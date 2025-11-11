import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';

// Load hair type model (expects NCHW [1, 3, H, W])
export async function loadHairTypeModel(): Promise<InferenceSession> {
  try {
    // Load the merged model (all data embedded in single file)
    const modelAsset = Asset.fromModule(require('../assets/models/hair_type/hair_type_merged.onnx'));
    await modelAsset.downloadAsync();
    
    if (!modelAsset.localUri) {
      throw new Error('Failed to load hair type model asset');
    }
    
    return await InferenceSession.create(modelAsset.localUri);
  } catch (error) {
    console.error('Error loading hair type model:', error);
    throw error;
  }
}

// Load hair damage model (expects NCHW [1, 3, 224, 224] according to README)
export async function loadHairDamageModel(): Promise<InferenceSession> {
  try {
    const modelAsset = Asset.fromModule(require('../assets/models/hair_damage/MobileNetV3Small.onnx'));
    await modelAsset.downloadAsync();
    if (!modelAsset.localUri) {
      throw new Error('Failed to load hair damage model asset');
    }
    const session = await InferenceSession.create(modelAsset.localUri);
    return session;
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
  hairDamage: { level: string; type: string; confidence: number };
  hairHealth: { score: number };
  predictions: number[]; // use hair damage raw probs as canonical predictions
  modelLoadingTimeMs: number;
  inferenceTimeMs: number;
}> {
  try {
    const t0Load = Date.now();
    // Load both models
    const [hairTypeSession, hairDamageSession] = await Promise.all([
      loadHairTypeModel(),
      loadHairDamageModel(),
    ]);
    const modelLoadingTimeMs = Date.now() - t0Load;
    
    // Hair type model expects NCHW format [1, 3, 224, 224] (channels-first)
    // Hair damage model expects NHWC format [1, 224, 224, 3] (channels-last)
    const tensorNCHW = await preprocessImageNCHW(imageUri, 224);
    const tensorNHWC = await preprocessImageNHWC(imageUri, 224);
    
    // Run inference on both models with their respective tensor formats
    const hairTypeInputName = hairTypeSession.inputNames[0];
    const hairDamageInputName = hairDamageSession.inputNames[0];
    
    const t0Infer = Date.now();
    const [hairTypeOutputs, hairDamageOutputs] = await Promise.all([
      hairTypeSession.run({ [hairTypeInputName]: tensorNCHW }),
      hairDamageSession.run({ [hairDamageInputName]: tensorNHWC }),
    ]);
    const inferenceTimeMs = Date.now() - t0Infer;
    
    console.log('='.repeat(60));
    console.log('🧬 HAIR ANALYSIS MODEL RESULTS');
    console.log('='.repeat(60));
    console.log(`⏱️  Model Loading Time: ${modelLoadingTimeMs}ms`);
    console.log(`⚡ Inference Time: ${inferenceTimeMs}ms`);
    console.log('');
    
    // Process Hair Type results
    const hairTypeOutputName = hairTypeSession.outputNames[0];
    const hairTypeData = hairTypeOutputs[hairTypeOutputName].data as Float32Array;
    
    // Map to hair type labels from README
    const hairTypeLabels = ['Straight', 'Wavy', 'Curly', 'Coily'];
    
    console.log('📊 HAIR TYPE MODEL PREDICTIONS (Raw Logits):');
    console.log('─'.repeat(60));
    const rawLogits = Array.from(hairTypeData);
    rawLogits.forEach((logit, idx) => {
      console.log(`  ${hairTypeLabels[idx].padEnd(10)}: ${logit.toFixed(6)} (raw logit)`);
    });
    
    // Apply softmax to convert logits to probabilities
    // Softmax formula: exp(x_i) / sum(exp(x_j)) for all j
    const maxLogit = Math.max(...rawLogits);
    const expLogits = rawLogits.map(logit => Math.exp(logit - maxLogit)); // Subtract max for numerical stability
    const sumExp = expLogits.reduce((sum, val) => sum + val, 0);
    const probabilities = expLogits.map(exp => exp / sumExp);
    
    console.log('');
    console.log('📊 HAIR TYPE MODEL PREDICTIONS (After Softmax):');
    console.log('─'.repeat(60));
    const hairTypeProbabilities = probabilities.map((prob, idx) => ({
      type: hairTypeLabels[idx],
      probability: prob,
      percentage: (prob * 100).toFixed(2) + '%'
    }));
    
    // Log all probabilities
    hairTypeProbabilities.forEach(({ type, probability, percentage }) => {
      console.log(`  ${type.padEnd(10)}: ${probability.toFixed(6)} (${percentage})`);
    });
    
    // Verify probabilities sum to ~1.0
    const probSum = probabilities.reduce((sum, p) => sum + p, 0);
    console.log(`  Sum of probabilities: ${probSum.toFixed(6)} (should be ~1.0)`);
    console.log('');
    
    // Find the class with highest probability
    let maxIndex = 0;
    let maxValue = probabilities[0];
    for (let i = 1; i < probabilities.length; i++) {
      if (probabilities[i] > maxValue) {
        maxValue = probabilities[i];
        maxIndex = i;
      }
    }
    
    const hairType = hairTypeLabels[maxIndex] || `Type ${maxIndex + 1}`;
    const hairTypeConfidence = maxValue;
    
    console.log('');
    console.log(`✅ Predicted Hair Type: ${hairType}`);
    console.log(`   Confidence: ${(hairTypeConfidence * 100).toFixed(2)}%`);
    console.log('');
    
    // Process Hair Damage results
    // The model has separate outputs for each damage type
    // Map output names to damage types
    const outputNameToDamageType: { [key: string]: string } = {
      'healthy': 'Healthy',
      'breakage': 'Breakage',
      'hair_loss': 'Hair Loss',
      'hairloss': 'Hair Loss',
      'color_damage': 'Color Damage',
      'colordamage': 'Color Damage',
    };
    
    console.log('🔍 HAIR DAMAGE MODEL PREDICTIONS:');
    console.log('─'.repeat(60));
    console.log(`   Output Names: [${hairDamageSession.outputNames.join(', ')}]`);
    console.log('');
    
    // Process all outputs and find the one with highest value
    let maxDamageValue = 0;
    let maxDamageType = 'Healthy';
    let allDamageValues: { [key: string]: number } = {};
    
    for (const outputName of hairDamageSession.outputNames) {
      const outputData = hairDamageOutputs[outputName].data as Float32Array;
      const outputValue = outputData[0]; // Each output is a single value [1, 1]
      
      // Map output name to damage type (normalize to lowercase for matching)
      const normalizedName = outputName.toLowerCase();
      const damageType = outputNameToDamageType[normalizedName] || outputName;
      
      allDamageValues[damageType] = outputValue;
      
      // Log each damage type prediction
      const percentage = outputValue > 1.0 
        ? outputValue.toFixed(2) + '%' 
        : (outputValue * 100).toFixed(2) + '%';
      console.log(`  ${damageType.padEnd(15)}: ${outputValue.toFixed(6)} (${percentage})`);
      
      // Track the highest value
      if (outputValue > maxDamageValue) {
        maxDamageValue = outputValue;
        maxDamageType = damageType;
      }
    }
    
    console.log('');
    console.log(`✅ Predicted Damage Type: ${maxDamageType}`);
    console.log(`   Raw Value: ${maxDamageValue.toFixed(6)}`);
    console.log('');
    
    const baseDamageType = maxDamageType;
    
    // Convert to percentage and clamp to 0-100% range
    // If value is already > 1, assume it's already a percentage (0-100)
    // Otherwise, assume it's a probability (0-1) and multiply by 100
    let damagePercentage: number;
    if (maxDamageValue > 1.0) {
      // Already in percentage form, just clamp it
      damagePercentage = Math.max(0, Math.min(100, maxDamageValue));
    } else {
      // Probability form, convert to percentage
      damagePercentage = Math.max(0, Math.min(100, maxDamageValue * 100));
    }
    
    // Apply conditional interpretation based on percentage
    let damageLevel = baseDamageType;
    
    if (baseDamageType !== 'Healthy' && damagePercentage > 50) {
      if (damagePercentage >= 80) {
        damageLevel = `High chance of ${baseDamageType}`;
      } else if (damagePercentage >= 60) {
        damageLevel = `Moderate chance of ${baseDamageType}`;
      } else if (damagePercentage >= 50) {
        damageLevel = `Likely ${baseDamageType}`;
      }
    }
    
    // Normalize confidence to 0-1 range for consistency
    const damageConfidence = maxDamageValue > 1.0 ? maxDamageValue / 100 : maxDamageValue;
    
    // Calculate hair health score (inverse of damage confidence for non-healthy hair)
    let healthScore: number;
    if (baseDamageType === 'Healthy') {
      healthScore = 100;
    } else {
      healthScore = Math.max(0, Math.min(100, (1 - damageConfidence) * 100));
    }
    
    // Clean up tensors
    tensorNCHW.dispose();
    tensorNHWC.dispose();
    
    // Create predictions array from all damage values (for compatibility)
    const predictionsArray = Object.values(allDamageValues);
    
    console.log('📋 FINAL ANALYSIS RESULTS:');
    console.log('─'.repeat(60));
    console.log(`Hair Type: ${hairType} (${(hairTypeConfidence * 100).toFixed(2)}% confidence)`);
    console.log(`Damage Type: ${baseDamageType}`);
    console.log(`Damage Level: ${damageLevel}`);
    console.log(`Damage Confidence: ${(damageConfidence * 100).toFixed(2)}%`);
    console.log(`Hair Health Score: ${healthScore.toFixed(2)}/100`);
    console.log(`Damage Percentage: ${damagePercentage.toFixed(2)}%`);
    console.log('');
    console.log('📈 All Damage Probabilities:');
    Object.entries(allDamageValues).forEach(([type, value]) => {
      const pct = value > 1.0 ? value.toFixed(2) + '%' : (value * 100).toFixed(2) + '%';
      console.log(`  ${type.padEnd(15)}: ${pct}`);
    });
    console.log('');
    console.log('📊 All Hair Type Probabilities (After Softmax):');
    hairTypeProbabilities.forEach(({ type, percentage }) => {
      console.log(`  ${type.padEnd(10)}: ${percentage}`);
    });
    console.log('='.repeat(60));
    console.log('');
    
    return {
      hairType: { type: hairType, confidence: hairTypeConfidence },
      hairDamage: { level: damageLevel, type: baseDamageType, confidence: damageConfidence },
      hairHealth: { score: healthScore },
      predictions: predictionsArray, // All damage type probabilities
      modelLoadingTimeMs,
      inferenceTimeMs,
    };
  } catch (error) {
    console.error('Error analyzing hair:', error);
    throw error;
  }
}
