import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';

export async function loadModel(): Promise<InferenceSession> {
  try {
    // Load model from assets using expo-asset
    const modelAsset = Asset.fromModule(require('../assets/models/hair_type/hair_type_model.onnx'));
    await modelAsset.downloadAsync();
    
    if (!modelAsset.localUri) {
      throw new Error('Failed to load model asset');
    }
    
    console.log('Loading model from:', modelAsset.localUri);
    const session = await InferenceSession.create(modelAsset.localUri);
    console.log('Model loaded:', session.inputNames, session.outputNames);
    return session;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

// Load hair type model (expects NCHW [1, 3, H, W])
export async function loadHairTypeModel(): Promise<InferenceSession> {
  try {
    const modelAsset = Asset.fromModule(require('../assets/models/hair_type/hair_type_model.onnx'));
    await modelAsset.downloadAsync();
    if (!modelAsset.localUri) {
      throw new Error('Failed to load hair type model asset');
    }
    console.log('Hair type model loaded from:', modelAsset.localUri);
    return await InferenceSession.create(modelAsset.localUri);
  } catch (error) {
    console.error('Error loading hair type model:', error);
    throw error;
  }
}

// Load hair damage model (expects NHWC [1, H, W, 3])
export async function loadHairDamageModel(): Promise<InferenceSession> {
  try {
    const modelAsset = Asset.fromModule(require('../assets/models/hair_damage/hair_damage_model_2.onnx'));
    await modelAsset.downloadAsync();
    if (!modelAsset.localUri) {
      throw new Error('Failed to load hair damage model asset');
    }
    console.log('Hair damage model loaded from:', modelAsset.localUri);
    return await InferenceSession.create(modelAsset.localUri);
  } catch (error) {
    console.error('Error loading hair damage model:', error);
    throw error;
  }
}

export async function preprocessImage(imageUri: string): Promise<Tensor> {
  try {
    // Resize to 224x224
    const resized = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { format: ImageManipulator.SaveFormat.JPEG, compress: 1 }
    );
    
    const base64 = await FileSystem.readAsStringAsync(resized.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const jpeg = require('jpeg-js');
    const rawImageData = jpeg.decode(bytes, { useTArray: true });
    const pixels = rawImageData.data;
    
    // Convert to float32 array and normalize to [0, 1] (224 * 224 * 3 = 150528 values)
    const float32Data = new Float32Array(224 * 224 * 3);
    
    for (let i = 0; i < 224 * 224; i++) {
      const sourceIndex = i * 4; // RGBA
      const targetIndex = i * 3; // RGB
      
      // Normalize pixel values to [0, 1] range by dividing by 255
      float32Data[targetIndex] = pixels[sourceIndex] / 255.0;         // R
      float32Data[targetIndex + 1] = pixels[sourceIndex + 1] / 255.0; // G
      float32Data[targetIndex + 2] = pixels[sourceIndex + 2] / 255.0; // B
    }
    
    // Shape: [1, 224, 224, 3] - NHWC format (channels-last)
    return new Tensor('float32', float32Data, [1, 224, 224, 3]);
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw error;
  }
}

// Preprocess to NCHW [1, 3, H, W] (for both hair type and hair damage models)
export async function preprocessImageNCHW(imageUri: string, targetSize: number = 224): Promise<Tensor> {
  try {
    const resized = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: targetSize, height: targetSize } }],
      { format: ImageManipulator.SaveFormat.JPEG, compress: 1 }
    );

    const base64 = await FileSystem.readAsStringAsync(resized.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const jpeg = require('jpeg-js');
    const rawImageData = jpeg.decode(bytes, { useTArray: true });
    const pixels = rawImageData.data; // RGBA

    const channelSize = targetSize * targetSize;
    const float32Data = new Float32Array(3 * channelSize);

    // Convert to NCHW format and normalize to [0, 1] range (divide by 255)
    for (let y = 0; y < targetSize; y++) {
      for (let x = 0; x < targetSize; x++) {
        const pixelIndex = y * targetSize + x;
        const src = pixelIndex * 4; // RGBA source
        
        // Normalize RGB values to [0, 1] range
        const r = pixels[src] / 255.0;
        const g = pixels[src + 1] / 255.0;
        const b = pixels[src + 2] / 255.0;
        
        // Store in NCHW format: all R values, then all G values, then all B values
        float32Data[pixelIndex] = r;
        float32Data[channelSize + pixelIndex] = g;
        float32Data[2 * channelSize + pixelIndex] = b;
      }
    }

    return new Tensor('float32', float32Data, [1, 3, targetSize, targetSize]);
  } catch (error) {
    console.error('Error preprocessing image (NCHW):', error);
    throw error;
  }
}

// Preprocess to NHWC [1, H, W, 3] (for hair damage)
export async function preprocessImageNHWC(imageUri: string, targetSize: number = 224): Promise<Tensor> {
  // Reuse existing preprocessImage which already returns NHWC [1, 224, 224, 3]
  return preprocessImage(imageUri);
}

export async function analyzeHair(imageUri: string): Promise<{
  hairType: { type: string; confidence: number };
  hairDamage: { level: string; confidence: number };
}> {
  try {
    console.log('Starting hair analysis...');
    
    // Load both models
    const [hairTypeSession, hairDamageSession] = await Promise.all([
      loadHairTypeModel(),
      loadHairDamageModel(),
    ]);
    
    console.log('Both models loaded successfully');
    console.log('Hair Type Model - Input:', hairTypeSession.inputNames, 'Output:', hairTypeSession.outputNames);
    console.log('Hair Damage Model - Input:', hairDamageSession.inputNames, 'Output:', hairDamageSession.outputNames);
    
    // BOTH models actually expect NHWC format [1, 224, 224, 3] (channels-last)
    // The README was incorrect - the actual runtime shows they need channels-last format
    const tensorNHWC = await preprocessImageNHWC(imageUri, 224);
    
    console.log('Image preprocessed with shape:', tensorNHWC.dims);
    
    // Run inference on both models (both use the same NHWC tensor)
    const hairTypeInputName = hairTypeSession.inputNames[0];
    const hairDamageInputName = hairDamageSession.inputNames[0];
    
    const [hairTypeOutputs, hairDamageOutputs] = await Promise.all([
      hairTypeSession.run({ [hairTypeInputName]: tensorNHWC }),
      hairDamageSession.run({ [hairDamageInputName]: tensorNHWC }),
    ]);
    
    console.log('Inference completed on both models');
    
    // Process Hair Type results
    const hairTypeOutputName = hairTypeSession.outputNames[0];
    const hairTypeData = hairTypeOutputs[hairTypeOutputName].data as Float32Array;
    
    console.log('Hair Type raw output:', Array.from(hairTypeData));
    
    // Find the class with highest probability
    let maxIndex = 0;
    let maxValue = hairTypeData[0];
    for (let i = 1; i < hairTypeData.length; i++) {
      if (hairTypeData[i] > maxValue) {
        maxValue = hairTypeData[i];
        maxIndex = i;
      }
    }
    
    // Map to hair type labels from README
    const hairTypeLabels = ['Straight', 'Wavy', 'Curly', 'Kinky'];
    const hairType = hairTypeLabels[maxIndex] || `Type ${maxIndex + 1}`;
    const hairTypeConfidence = maxValue;
    
    // Process Hair Damage results
    const hairDamageOutputName = hairDamageSession.outputNames[0];
    const hairDamageData = hairDamageOutputs[hairDamageOutputName].data as Float32Array;
    
    console.log('Hair Damage raw output:', Array.from(hairDamageData));
    
    // Find the class with highest probability
    let maxDamageIndex = 0;
    let maxDamageValue = hairDamageData[0];
    for (let i = 1; i < hairDamageData.length; i++) {
      if (hairDamageData[i] > maxDamageValue) {
        maxDamageValue = hairDamageData[i];
        maxDamageIndex = i;
      }
    }
    
    // Map to damage level labels from README
    const damageLevels = ['Healthy', 'Light Damage', 'Moderate Damage', 'Severe Damage'];
    const damageLevel = damageLevels[maxDamageIndex] || `Level ${maxDamageIndex}`;
    const damageConfidence = maxDamageValue;
    
    console.log('Results:', {
      hairType: { type: hairType, confidence: hairTypeConfidence },
      hairDamage: { level: damageLevel, confidence: damageConfidence },
    });
    
    // Clean up tensor
    tensorNHWC.dispose();
    
    return {
      hairType: { type: hairType, confidence: hairTypeConfidence },
      hairDamage: { level: damageLevel, confidence: damageConfidence },
    };
  } catch (error) {
    console.error('Error analyzing hair:', error);
    throw error;
  }
}
