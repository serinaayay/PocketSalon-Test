import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as DocumentPicker from 'expo-document-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getDeviceInfo } from './deviceInfo';
import { preprocessImageNCHW } from './onnx-helpers-native';

const SAMPLE_IMAGES = [
  require('../assets/Coily/006b5533c75639d9e44fcd34399398ba.jpg'),
  require('../assets/Coily/009737667973ddbbaa25292d2c043ba8.jpg'),
  require('../assets/Coily/0118d8be1b5525a2abb21d78b7ced22e.jpg'),
  require('../assets/Coily/01590042a179bf854aa3ac8fdd2e3235.jpg'),
  require('../assets/Curly/0361617794cd4cda2c9ac9475920b0fc.jpg'),
  require('../assets/Curly/07ffd6aec027de238e457e456295dbfd.jpg'),
  require('../assets/Curly/082bddab6c7dca1417630bf08c81dd6d.jpg'),
  require('../assets/Curly/0c4a9f4c681eab339bb2ac27ca3fba06.jpg'),
  require('../assets/Wavy/000473adea542cc828bfbd48a500576d.jpg'),
  require('../assets/Wavy/006893316bbc5635525aa6cf87cd9648.jpg'),
  require('../assets/Wavy/04dac71559d69264f2038a0c4a2eaad0.jpg'),
  require('../assets/Wavy/09206988d9d664b715a2207e8847f42c.jpg'),
  require('../assets/Straight/00a20603a342c27c2c3fac73583eec0f.jpg'),
  require('../assets/Straight/00e6d27ee574a77dabb1429b8933862f.jpg'),
  require('../assets/Straight/02-long-and-staight.jpg'),
  require('../assets/Straight/0415430e88577771fb4e3f3524eb81fb.jpg'),
];

export interface EfficiencyTestResult {
  mean_time: number;
  std_time: number;
  min_time: number;
  max_time: number;
  warmup_time: number;
  loading_time: number;
  size_mb: number;
  total_images: number;
  inference_times: number[];
}

export interface EfficiencyTestProgress {
  progress: number;
  status: string;
}

export async function runEfficiencyTest(
  onProgress?: (progress: EfficiencyTestProgress) => void
): Promise<EfficiencyTestResult> {
  const t0Load = Date.now();
  
  onProgress?.({ progress: 5, status: 'Loading model...' });
  
const modelLoadOrder = [
  // Hair Damage ResNet50 - MERGED (for production/release builds)
  {
    label: 'Hair Damage ResNet50',
    path: 'EFFTEST_HDMG_DMG_CV_best_resnet50_20251117_145818_merged.onnx',
    loader: () => require('../assets/models/EFFTEST_HDMG_DMG_CV_best_resnet50_20251117_145818_merged.onnx'),
  },
  // Fallback to other merged models
  {
    label: 'Hair Damage EfficientNet-B0',
    path: 'EFFTEST_HDMG_DMG_CV_best_efficientnet_b0_20251117_155148_merged.onnx',
    loader: () => require('../assets/models/EFFTEST_HDMG_DMG_CV_best_efficientnet_b0_20251117_155148_merged.onnx'),
  },
  {
    label: 'Hair Damage MobileNetV3-Small',
    path: 'hair_damage_efftest/EFFTEST_HDMG_DMG_CV_best_mobilenet_v3_small_20251117_163748.onnx',
    loader: () => require('../assets/models/hair_damage_efftest/EFFTEST_HDMG_DMG_CV_best_mobilenet_v3_small_20251117_163748.onnx'),
  },
  {
    label: 'ResNet50 merged (legacy)',
    path: 'EFFTEST_resnet50_20251111_101444_merged.onnx',
    loader: () => require('../assets/models/EFFTEST_resnet50_20251111_101444_merged.onnx'),
  },
  {
    label: 'ResNet50 (legacy)',
    path: 'EFFTEST_resnet50_20251111_101444.onnx',
    loader: () => require('../assets/models/EFFTEST_resnet50_20251111_101444.onnx'),
  },
  {
    label: 'MobileNetV3-Small merged (legacy)',
    path: 'EFFTEST_mobilenet_v3_small_20251111_101530_merged.onnx',
    loader: () => require('../assets/models/EFFTEST_mobilenet_v3_small_20251111_101530_merged.onnx'),
  },
  {
    label: 'MobileNetV3-Small (legacy)',
    path: 'EFFTEST_mobilenet_v3_small_20251111_101530.onnx',
    loader: () => require('../assets/models/EFFTEST_mobilenet_v3_small_20251111_101530.onnx'),
  },
];

let modelAsset: Asset | undefined;
  let modelPath = '';
let modelLabel = '';

for (const attempt of modelLoadOrder) {
    try {
    modelAsset = Asset.fromModule(attempt.loader());
    modelPath = attempt.path;
    modelLabel = attempt.label;
    console.log(`Using ${attempt.label}`);
    break;
  } catch (err) {
    console.log(`${attempt.label} not found, trying next option...`, err);
    }
}

if (!modelAsset) {
  throw new Error('Failed to load any efficiency test model asset.');
  }
  
  try {
    await modelAsset.downloadAsync();
    console.log('Model asset downloaded, localUri:', modelAsset.localUri);
  } catch (error) {
    console.error('Error downloading model asset:', error);
    throw new Error(`Failed to download model asset: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  if (!modelAsset.localUri) {
    console.error('Model asset has no localUri after download');
    throw new Error('Failed to load model asset: localUri is null');
  }
  
  console.log('Creating inference session with model at:', modelAsset.localUri);
  
  const fileInfo = await FileSystem.getInfoAsync(modelAsset.localUri);
  console.log('Model file info:', {
    exists: fileInfo.exists,
    size: fileInfo.exists && 'size' in fileInfo ? `${(fileInfo.size / (1024 * 1024)).toFixed(2)} MB` : 'unknown',
    uri: modelAsset.localUri,
  });
  
  if (!fileInfo.exists) {
    throw new Error(`Model file does not exist at: ${modelAsset.localUri}`);
  }
  
  let session;
  try {
    session = await InferenceSession.create(modelAsset.localUri);
    console.log('Inference session created successfully');
  } catch (error) {
    console.error('Error creating inference session:', error);
    console.error('Model path:', modelAsset.localUri);
    console.error('Model file exists:', fileInfo.exists);
    throw new Error(`Failed to create inference session: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  const loadingTime = (Date.now() - t0Load) / 1000;
  
  const modelSize = await getModelSize(modelAsset.localUri);
  
  onProgress?.({ progress: 15, status: 'Waiting for user to select images...' });
  
  let imageUris: string[];
  try {
    imageUris = await getImageUrisFromDevice();
  } catch (error) {
    console.log('DocumentPicker failed, falling back to bundled images:', error);
    imageUris = await prepareTestImages();
  }
  
  if (imageUris.length === 0) {
    throw new Error('No images available for testing');
  }
  
  const totalImages = 100;
  const repeatedImages: string[] = [];
  
  for (let i = 0; i < totalImages; i++) {
    repeatedImages.push(imageUris[i % imageUris.length]);
  }
  
  onProgress?.({ progress: 20, status: 'Running warm-up inference...' });
  
  const firstImage = repeatedImages[0];
  const warmupTensor = await preprocessImageNCHW(firstImage, 224);
  const inputName = session.inputNames[0];
  
  const t0Warmup = Date.now();
  await session.run({ [inputName]: warmupTensor });
  const warmupTime = (Date.now() - t0Warmup) / 1000;
  warmupTensor.dispose();
  
  onProgress?.({ progress: 25, status: 'Running inference tests...' });
  
  const inferenceTimes: number[] = [];
  
  for (let i = 0; i < repeatedImages.length; i++) {
    const imageUri = repeatedImages[i];
    const tensor = await preprocessImageNCHW(imageUri, 224);
    
    const t0 = Date.now();
    await session.run({ [inputName]: tensor });
    const t1 = Date.now();
    
    inferenceTimes.push((t1 - t0) / 1000);
    tensor.dispose();
    
    const progress = 25 + Math.floor((i / repeatedImages.length) * 70);
    onProgress?.({ progress, status: `Processing image ${i + 1}/${totalImages}...` });
  }
  
  const meanTime = inferenceTimes.reduce((a, b) => a + b, 0) / inferenceTimes.length;
  const variance = inferenceTimes.reduce((sum, time) => sum + Math.pow(time - meanTime, 2), 0) / inferenceTimes.length;
  const stdTime = Math.sqrt(variance);
  const minTime = Math.min(...inferenceTimes);
  const maxTime = Math.max(...inferenceTimes);
  
  onProgress?.({ progress: 100, status: 'Test complete' });
  
  return {
    mean_time: meanTime,
    std_time: stdTime,
    min_time: minTime,
    max_time: maxTime,
    warmup_time: warmupTime,
    loading_time: loadingTime,
    size_mb: modelSize,
    total_images: totalImages,
    inference_times: inferenceTimes,
  };
}

async function getImageUrisFromDevice(): Promise<string[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'image/*',
    copyToCacheDirectory: false,
    multiple: true,
  });

  if (result.canceled) {
    throw new Error('User cancelled image selection.');
  }

  if (!result.assets || result.assets.length === 0) {
    throw new Error('No images selected.');
  }

  const imageUris = result.assets.map(asset => asset.uri);
  console.log(`User selected ${imageUris.length} images`);
  
  return imageUris;
}

async function prepareTestImages(): Promise<string[]> {
  const imageUris: string[] = [];
  
  for (let i = 0; i < SAMPLE_IMAGES.length; i++) {
    try {
      const imageModule = SAMPLE_IMAGES[i];
      const asset = Asset.fromModule(imageModule);
      await asset.downloadAsync();
      
      if (asset.localUri) {
        imageUris.push(asset.localUri);
        console.log(`Image ${i + 1}/${SAMPLE_IMAGES.length} loaded: ${asset.localUri}`);
      } else {
        console.warn(`Image ${i + 1} has no localUri after download`);
      }
    } catch (error) {
      console.error(`Error loading image ${i + 1}:`, error);
    }
  }
  
  if (imageUris.length === 0) {
    throw new Error('Failed to load any test images');
  }
  
  console.log(`Loaded ${imageUris.length}/${SAMPLE_IMAGES.length} test images`);
  return imageUris;
}

async function getModelSize(modelPath: string): Promise<number> {
  try {
    const info = await FileSystem.getInfoAsync(modelPath);
    let totalSize = 0;
    
    if (info.exists && 'size' in info) {
      totalSize += info.size;
    }
    
    const dataPath = modelPath + '.data';
    try {
      const dataInfo = await FileSystem.getInfoAsync(dataPath);
      if (dataInfo.exists && 'size' in dataInfo) {
        totalSize += dataInfo.size;
      }
    } catch {
      // .data file might not exist or be accessible
    }
    
    return totalSize / (1024 * 1024);
  } catch (error) {
    console.error('Error getting model size:', error);
  }
  return 0;
}

export async function saveEfficiencyTestResults(result: EfficiencyTestResult): Promise<void> {
  try {
    const deviceInfo = await getDeviceInfo();
    const userId = `device_${deviceInfo.model}_${Date.now()}`;
    
    await addDoc(collection(db, 'efficiencyTests'), {
      userId,
      model: 'mobilenet_v3_small',
      mean_time: result.mean_time,
      std_time: result.std_time,
      min_time: result.min_time,
      max_time: result.max_time,
      warmup_time: result.warmup_time,
      loading_time: result.loading_time,
      size_mb: result.size_mb,
      total_images: result.total_images,
      inference_times: result.inference_times,
      timestamp: serverTimestamp(),
      deviceInfo: {
        model: deviceInfo.model,
        manufacturer: deviceInfo.manufacturer,
        brand: deviceInfo.brand,
        osVersion: deviceInfo.osVersion,
        totalMemory: deviceInfo.totalMemory || 0,
      },
    });
  } catch (error) {
    console.error('Error saving efficiency test results:', error);
    throw error;
  }
}

