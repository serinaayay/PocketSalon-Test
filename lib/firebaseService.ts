import { collection, addDoc, getDocs, query, orderBy, where, Timestamp } from "firebase/firestore";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { db } from './firebaseConfig';
import { getOrCreateRespondentCode } from './respondent';

export type DeviceInfo = {
  model: string;
  manufacturer?: string;
  brand?: string;
  osVersion: string;
  totalMemory?: number; // in MB
  cpuArchitecture?: string;
  deviceYearClass?: number;
};

export type HairScanData = {
  userId: string;
  hairType: string;
  damageLevel: string;
  damageScore: number;
  loadingTime: number; // ms - model loading time
  inferenceTime: number; // ms - inference/prediction time
  timestamp: Date;
  imageUrl: string;
  imagePath: string; // local path reference to match with image
  resultsUrl?: string; // URL to results JSON in Storage
  deviceInfoUrl?: string; // URL to device info JSON in Storage
  deviceInfo: DeviceInfo;
  synced: boolean;
};

/**
 * Compress and resize image to be under 1MB
 * @param imageUri Local file URI of the image
 * @returns Compressed image URI
 */
async function compressImageForUpload(imageUri: string): Promise<string> {
  try {
    const MAX_SIZE_MB = 1;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    const MAX_DIMENSION = 1920; // Max width or height in pixels
    
    // Get file info to check current size
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (fileInfo.exists && fileInfo.size && fileInfo.size <= MAX_SIZE_BYTES) {
      // Already under 1MB, return as-is
      console.log(`✅ Image already under ${MAX_SIZE_MB}MB (${(fileInfo.size / 1024 / 1024).toFixed(2)}MB)`);
      return imageUri;
    }

    console.log(`📦 Compressing image (current size: ${fileInfo.exists && fileInfo.size ? (fileInfo.size / 1024 / 1024).toFixed(2) + 'MB' : 'unknown'})...`);

    // Start with quality 0.8 and max dimension 1920
    let quality = 0.8;
    let currentDimension = MAX_DIMENSION;
    let compressedUri = imageUri;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      // Resize and compress
      const manipResult = await ImageManipulator.manipulateAsync(
        compressedUri,
        [
          { resize: { width: currentDimension } }, // Maintain aspect ratio
        ],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Check the new file size
      const newFileInfo = await FileSystem.getInfoAsync(manipResult.uri);
      if (newFileInfo.exists && newFileInfo.size) {
        const sizeMB = newFileInfo.size / 1024 / 1024;
        console.log(`  Attempt ${attempts + 1}: ${sizeMB.toFixed(2)}MB (quality: ${quality}, dimension: ${currentDimension})`);

        if (newFileInfo.size <= MAX_SIZE_BYTES) {
          console.log(`✅ Image compressed successfully to ${sizeMB.toFixed(2)}MB`);
          // Clean up previous compressed file if it's different from original
          if (compressedUri !== imageUri && compressedUri !== manipResult.uri) {
            await FileSystem.deleteAsync(compressedUri, { idempotent: true });
          }
          return manipResult.uri;
        }

        // If still too large, reduce quality and/or dimension
        if (attempts < 2) {
          quality = Math.max(0.3, quality - 0.15); // Reduce quality more aggressively
        } else {
          quality = Math.max(0.2, quality - 0.1);
          currentDimension = Math.max(1280, currentDimension - 160); // Reduce dimension
        }
      }

      // Clean up previous attempt if it's not the original
      if (compressedUri !== imageUri && compressedUri !== manipResult.uri) {
        await FileSystem.deleteAsync(compressedUri, { idempotent: true });
      }

      compressedUri = manipResult.uri;
      attempts++;
    }

    // If we still couldn't get it under 1MB after max attempts, use the last result
    const finalFileInfo = await FileSystem.getInfoAsync(compressedUri);
    if (finalFileInfo.exists && finalFileInfo.size) {
      const sizeMB = finalFileInfo.size / 1024 / 1024;
      console.log(`⚠️ Image compressed to ${sizeMB.toFixed(2)}MB (target: ${MAX_SIZE_MB}MB)`);
    }

    return compressedUri;
  } catch (error) {
    console.error('Error compressing image:', error);
    // If compression fails, return original (upload will still work, just larger)
    return imageUri;
  }
}

/**
 * Upload a file to Firebase Storage
 * @param fileUri Local file URI or file content
 * @param storagePath Path in Firebase Storage
 * @param contentType MIME type of the file
 * @returns Download URL of the uploaded file
 */
async function uploadFileToStorage(
  fileUri: string,
  storagePath: string,
  contentType: string
): Promise<string> {
  try {
    const bucket = 'pocket-salon-db.firebasestorage.app';
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(storagePath)}`;
    
    // Upload directly from file URI
    const uploadResponse = await FileSystem.uploadAsync(uploadUrl, fileUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        'Content-Type': contentType,
      },
    });
    
    if (uploadResponse.status < 200 || uploadResponse.status >= 300) {
      throw new Error(`Upload failed: ${uploadResponse.status} - ${uploadResponse.body}`);
    }
    
    // Parse response to get the download token
    const responseData = JSON.parse(uploadResponse.body);
    const downloadToken = responseData.downloadTokens;
    
    // Construct the download URL with the token
    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading file to Firebase Storage (${storagePath}):`, error);
    throw error;
  }
}

/**
 * Upload an image to Firebase Storage
 * @param imageUri Local file URI of the image
 * @param userId User/device identifier
 * @param timestamp Timestamp for the scan
 * @returns Download URL of the uploaded image
 */
export async function uploadHairScanImage(
  imageUri: string,
  userId: string,
  timestamp: Date
): Promise<string> {
  // Compress image to under 1MB before uploading
  const compressedImageUri = await compressImageForUpload(imageUri);
  
  const timestampStr = timestamp.getTime().toString();
  const storagePath = `hair_scans/${userId}/${timestampStr}.jpg`;
  
  const downloadUrl = await uploadFileToStorage(compressedImageUri, storagePath, 'image/jpeg');
  
  // Clean up compressed file if it's different from original
  if (compressedImageUri !== imageUri) {
    await FileSystem.deleteAsync(compressedImageUri, { idempotent: true });
  }
  
  return downloadUrl;
}

/**
 * Upload results JSON to Firebase Storage
 * @param resultsJson JSON string of results data
 * @param userId User/device identifier
 * @param timestamp Timestamp for the scan
 * @returns Download URL of the uploaded results file
 */
export async function uploadResultsJson(
  resultsJson: string,
  userId: string,
  timestamp: Date
): Promise<string> {
  try {
    const timestampStr = timestamp.getTime().toString();
    const storagePath = `scan_results/${userId}/${timestampStr}_results.json`;
    
    // Create a temporary file with the JSON content
    const tempFilePath = FileSystem.cacheDirectory + `temp_results_${timestampStr}.json`;
    await FileSystem.writeAsStringAsync(tempFilePath, resultsJson);
    
    try {
      const downloadURL = await uploadFileToStorage(tempFilePath, storagePath, 'application/json');
      return downloadURL;
    } finally {
      // Clean up temporary file
      await FileSystem.deleteAsync(tempFilePath, { idempotent: true });
    }
  } catch (error) {
    console.error('Error uploading results JSON to Firebase Storage:', error);
    throw error;
  }
}

/**
 * Upload device info JSON to Firebase Storage
 * @param deviceInfo Device information object
 * @param userId User/device identifier
 * @param timestamp Timestamp for the scan
 * @returns Download URL of the uploaded device info file
 */
export async function uploadDeviceInfoJson(
  deviceInfo: DeviceInfo,
  userId: string,
  timestamp: Date
): Promise<string> {
  try {
    const timestampStr = timestamp.getTime().toString();
    const storagePath = `scan_results/${userId}/${timestampStr}_device.json`;
    
    // Create a temporary file with the JSON content
    const deviceInfoJson = JSON.stringify(deviceInfo, null, 2);
    const tempFilePath = FileSystem.cacheDirectory + `temp_device_${timestampStr}.json`;
    await FileSystem.writeAsStringAsync(tempFilePath, deviceInfoJson);
    
    try {
      const downloadURL = await uploadFileToStorage(tempFilePath, storagePath, 'application/json');
      return downloadURL;
    } finally {
      // Clean up temporary file
      await FileSystem.deleteAsync(tempFilePath, { idempotent: true });
    }
  } catch (error) {
    console.error('Error uploading device info JSON to Firebase Storage:', error);
    throw error;
  }
}

/**
 * Save hair scan metadata to Firestore
 * @param scanData Hair scan data to save
 * @returns Document ID of the created document
 */
export async function saveHairScanToFirestore(scanData: HairScanData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'hairScans'), {
      userId: scanData.userId,
      hairType: scanData.hairType,
      damageLevel: scanData.damageLevel,
      damageScore: scanData.damageScore,
      loadingTime: scanData.loadingTime,
      inferenceTime: scanData.inferenceTime,
      timestamp: Timestamp.fromDate(scanData.timestamp),
      imageUrl: scanData.imageUrl,
      imagePath: scanData.imagePath,
      resultsUrl: scanData.resultsUrl || null,
      deviceInfoUrl: scanData.deviceInfoUrl || null,
      deviceInfo: {
        model: scanData.deviceInfo.model,
        manufacturer: scanData.deviceInfo.manufacturer || 'Unknown',
        brand: scanData.deviceInfo.brand || 'Unknown',
        osVersion: scanData.deviceInfo.osVersion,
        totalMemory: scanData.deviceInfo.totalMemory || 0,
        cpuArchitecture: scanData.deviceInfo.cpuArchitecture || 'Unknown',
        deviceYearClass: scanData.deviceInfo.deviceYearClass || 0,
      },
      synced: scanData.synced,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving hair scan to Firestore:', error);
    throw error;
  }
}

/**
 * Upload image and save metadata in one operation
 * @param imageUri Local file URI of the image
 * @param hairType Detected hair type (e.g., "Wavy")
 * @param damageLevel Damage level description (e.g., "Moderate")
 * @param damageScore Damage score (0-100)
 * @param loadingTime Model loading time in milliseconds
 * @param inferenceTime Inference time in milliseconds
 * @param deviceInfo Device information (model, RAM, CPU, GPU, etc.)
 * @param resultsJson Optional: JSON string of complete results data
 * @param timestamp Timestamp for the scan (defaults to now)
 * @returns Document ID, image URL, results URL, and device info URL
 */
export async function uploadHairScan(
  imageUri: string,
  hairType: string,
  damageLevel: string,
  damageScore: number,
  loadingTime: number,
  inferenceTime: number,
  deviceInfo: DeviceInfo,
  resultsJson?: string,
  timestamp: Date = new Date()
): Promise<{ docId: string; imageUrl: string; resultsUrl?: string; deviceInfoUrl?: string }> {
  try {
    // Get or create user ID
    const userId = await getOrCreateRespondentCode();
    
    // Upload image to Storage
    console.log('📤 Uploading image to Storage...');
    const imageUrl = await uploadHairScanImage(imageUri, userId, timestamp);
    
    // Upload results JSON if provided
    let resultsUrl: string | undefined;
    if (resultsJson) {
      try {
        console.log('📤 Uploading results JSON to Storage...');
        resultsUrl = await uploadResultsJson(resultsJson, userId, timestamp);
        console.log('✅ Results JSON uploaded:', resultsUrl);
      } catch (error) {
        console.warn('⚠️ Failed to upload results JSON (continuing):', error);
      }
    }
    
    // Upload device info JSON
    let deviceInfoUrl: string | undefined;
    try {
      console.log('📤 Uploading device info JSON to Storage...');
      deviceInfoUrl = await uploadDeviceInfoJson(deviceInfo, userId, timestamp);
      console.log('✅ Device info JSON uploaded:', deviceInfoUrl);
    } catch (error) {
      console.warn('⚠️ Failed to upload device info JSON (continuing):', error);
    }
    
    // Save metadata to Firestore
    const docId = await saveHairScanToFirestore({
      userId,
      hairType,
      damageLevel,
      damageScore,
      loadingTime,
      inferenceTime,
      timestamp,
      imageUrl,
      imagePath: imageUri, // Store local path to link results with images
      resultsUrl,
      deviceInfoUrl,
      deviceInfo,
      synced: true,
    });
    
    return { docId, imageUrl, resultsUrl, deviceInfoUrl };
  } catch (error) {
    console.error('Error uploading hair scan:', error);
    throw error;
  }
}

/**
 * Get all hair scans for the current user
 * @returns Array of hair scan documents
 */
export async function getUserHairScans(): Promise<HairScanData[]> {
  try {
    const userId = await getOrCreateRespondentCode();
    const q = query(
      collection(db, 'hairScans'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const scans: HairScanData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scans.push({
        userId: data.userId,
        hairType: data.hairType,
        damageLevel: data.damageLevel,
        damageScore: data.damageScore,
        loadingTime: data.loadingTime || 0,
        inferenceTime: data.inferenceTime || 0,
        timestamp: data.timestamp.toDate(),
        imageUrl: data.imageUrl,
        imagePath: data.imagePath || '',
        resultsUrl: data.resultsUrl || undefined,
        deviceInfoUrl: data.deviceInfoUrl || undefined,
        deviceInfo: data.deviceInfo || {
          model: 'Unknown',
          osVersion: 'Unknown',
        },
        synced: data.synced,
      });
    });
    
    return scans;
  } catch (error) {
    console.error('Error fetching user hair scans:', error);
    throw error;
  }
}

/**
 * Get all hair scans (admin function - for testing/debugging)
 * @returns Array of all hair scan documents
 */
export async function getAllHairScans(): Promise<HairScanData[]> {
  try {
    const q = query(
      collection(db, 'hairScans'),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const scans: HairScanData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scans.push({
        userId: data.userId,
        hairType: data.hairType,
        damageLevel: data.damageLevel,
        damageScore: data.damageScore,
        loadingTime: data.loadingTime || 0,
        inferenceTime: data.inferenceTime || 0,
        timestamp: data.timestamp.toDate(),
        imageUrl: data.imageUrl,
        imagePath: data.imagePath || '',
        resultsUrl: data.resultsUrl || undefined,
        deviceInfoUrl: data.deviceInfoUrl || undefined,
        deviceInfo: data.deviceInfo || {
          model: 'Unknown',
          osVersion: 'Unknown',
        },
        synced: data.synced,
      });
    });
    
    return scans;
  } catch (error) {
    console.error('Error fetching all hair scans:', error);
    throw error;
  }
}

/**
 * Test Firebase connection - verifies both Firestore and Storage are accessible
 * @returns Object with connection status and details
 */
export async function testFirebaseConnection(): Promise<{
  connected: boolean;
  firestore: { connected: boolean; error?: string };
  storage: { connected: boolean; error?: string };
  details: string;
}> {
  const result = {
    connected: false,
    firestore: { connected: false } as { connected: boolean; error?: string },
    storage: { connected: false } as { connected: boolean; error?: string },
    details: '',
  };

  // Test Firestore connection
  try {
    const testCollection = collection(db, '_firebase_test');
    // Try to read from a test collection (this will succeed even if empty)
    const testQuery = query(testCollection);
    await getDocs(testQuery);
    result.firestore.connected = true;
    result.firestore.error = undefined;
  } catch (error: any) {
    result.firestore.connected = false;
    result.firestore.error = error?.message || String(error);
  }

  // Test Storage connection using REST API
  try {
    const bucket = 'pocket-salon-db.firebasestorage.app';
    // Try to access a non-existent file to test connectivity
    const testUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/_firebase_test%2Fconnection_test.txt?alt=media`;
    
    const response = await fetch(testUrl);
    // Any response (even 404) means we can connect
    // A network error would throw before we get here
    result.storage.connected = true;
    result.storage.error = undefined;
  } catch (error: any) {
    result.storage.connected = false;
    result.storage.error = error?.message || String(error);
  }

  result.connected = result.firestore.connected && result.storage.connected;
  
  if (result.connected) {
    result.details = '✅ Firebase is connected! Both Firestore and Storage are accessible.';
  } else {
    const issues: string[] = [];
    if (!result.firestore.connected) {
      issues.push(`Firestore: ${result.firestore.error || 'Connection failed'}`);
    }
    if (!result.storage.connected) {
      issues.push(`Storage: ${result.storage.error || 'Connection failed'}`);
    }
    result.details = `❌ Firebase connection issues:\n${issues.join('\n')}`;
  }

  return result;
}

