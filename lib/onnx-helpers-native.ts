import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';

export const HAIR_TYPE_LABELS = ['Straight', 'Wavy', 'Curly', 'Coily'];
export const HAIR_DAMAGE_LABELS = ['Hair Loss', 'Color Damage', 'Breakage'];

// Load hair type model (expects NCHW [1, 3, H, W])
export async function loadHairTypeModel(): Promise<InferenceSession> {
  try {
    let modelAsset;
    try {
      // Try new merged model first
      modelAsset = Asset.fromModule(require('../assets/models/new hair type/mobilenet_v3_small_20251121_210313_merged.onnx'));
      console.log('Using new MobileNetV3 Small merged model for hair type');
    } catch (e) {
      console.log('New merged model not found, trying old merged model:', e);
      try {
        modelAsset = Asset.fromModule(require('../assets/models/mobilenet_v3_small_20251116_214232_merged.onnx'));
        console.log('Using old MobileNetV3 Small merged model for hair type');
      } catch (e2) {
        console.log('Old merged model not found, trying regular model:', e2);
        modelAsset = Asset.fromModule(require('../assets/models/mobilenet_v3_small_20251116_214232.onnx'));
        console.log('Using MobileNetV3 Small regular model for hair type');
      }
    }
    
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
    let modelAsset;
    try {
      modelAsset = Asset.fromModule(require('../assets/models/efficientnet_b0_20251112_125615_merged.onnx'));
      console.log('Using EfficientNet-B0 merged model for hair damage');
    } catch (e) {
      console.log('EfficientNet-B0 merged model not found, trying regular model:', e);
      modelAsset = Asset.fromModule(require('../assets/models/efficientnet_b0_20251112_125615.onnx'));
      console.log('Using EfficientNet-B0 regular model for hair damage');
    }
    await modelAsset.downloadAsync();
    if (!modelAsset.localUri) {
      throw new Error('Failed to load hair damage model asset');
    }
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

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

function softmax(logits: number[]): number[] {
  if (logits.length === 0) {
    return [];
  }
  const maxLogit = Math.max(...logits);
  const expScores = logits.map(logit => Math.exp(logit - maxLogit));
  const sumExpScores = expScores.reduce((sum, value) => sum + value, 0);
  return expScores.map(score => (sumExpScores === 0 ? 0 : score / sumExpScores));
}

export async function analyzeHair(imageUri: string): Promise<{
  hairType: { type: string; confidence: number };
  hairDamage: { level: string; type: string; confidence: number };
  hairHealth: { score: number };
  predictions: number[]; // use hair damage raw probs as canonical predictions
  hairTypePredictions: number[]; // hair type probabilities
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
    
    // Both models expect NCHW format [1, 3, 224, 224] (channels-first)
    const tensorNCHW = await preprocessImageNCHW(imageUri, 224);
    
    // Run inference on both models with their respective tensor formats
    const hairTypeInputName = hairTypeSession.inputNames[0];
    const hairDamageInputName = hairDamageSession.inputNames[0];
    
    const t0Infer = Date.now();
    const [hairTypeOutputs, hairDamageOutputs] = await Promise.all([
      hairTypeSession.run({ [hairTypeInputName]: tensorNCHW }),
      hairDamageSession.run({ [hairDamageInputName]: tensorNCHW }),
    ]);
    const inferenceTimeMs = Date.now() - t0Infer;
    
    console.log('='.repeat(60));
    console.log('HAIR ANALYSIS MODEL RESULTS');
    console.log('='.repeat(60));
    console.log(`Model Loading Time: ${modelLoadingTimeMs}ms`);
    console.log(`Inference Time: ${inferenceTimeMs}ms`);
    console.log('');
    
    // Process Hair Type results
    const hairTypeOutputName = hairTypeSession.outputNames[0];
    const hairTypeData = hairTypeOutputs[hairTypeOutputName].data as Float32Array;
    
    // Map to hair type labels from README
    const hairTypeLabels = HAIR_TYPE_LABELS;
    
    console.log('HAIR TYPE MODEL PREDICTIONS (Raw Logits):');
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
    console.log('HAIR TYPE MODEL PREDICTIONS (After Softmax):');
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
    console.log(`Predicted Hair Type: ${hairType}`);
    console.log(`   Confidence: ${(hairTypeConfidence * 100).toFixed(2)}%`);
    console.log('');
    
    // Process Hair Damage results (single output logits -> probabilities)
    console.log('HAIR DAMAGE MODEL PREDICTIONS:');
    console.log('─'.repeat(60));
    console.log(`   Output Names: [${hairDamageSession.outputNames.join(', ')}]`);
    console.log('');
    
    const hairDamageOutputName = hairDamageSession.outputNames[0];
    const hairDamageData = hairDamageOutputs[hairDamageOutputName].data as Float32Array;
    const damageLogits = Array.from(hairDamageData);
    
    console.log('Raw Hair Damage Logits:');
    damageLogits.forEach((logit, idx) => {
      const label = HAIR_DAMAGE_LABELS[idx] || `Damage ${idx + 1}`;
      console.log(`  ${label.padEnd(15)}: ${logit.toFixed(6)}`);
    });
    
    const damageProbabilities = damageLogits.map(sigmoid);
    const normalizedDamageProbabilities = HAIR_DAMAGE_LABELS.map((_, idx) => damageProbabilities[idx] ?? 0);
    
    console.log('');
    console.log('Hair Damage Probabilities (After Sigmoid):');
    normalizedDamageProbabilities.forEach((prob, idx) => {
      const label = HAIR_DAMAGE_LABELS[idx] || `Damage ${idx + 1}`;
      console.log(`  ${label.padEnd(15)}: ${prob.toFixed(6)} (${(prob * 100).toFixed(2)}%)`);
    });
    
    const maxDamageIndex = normalizedDamageProbabilities.reduce(
      (bestIdx, prob, idx, arr) => (prob > arr[bestIdx] ? idx : bestIdx),
      0
    );
    
    const baseDamageType = HAIR_DAMAGE_LABELS[maxDamageIndex] || 'Healthy';
    const damageConfidence = normalizedDamageProbabilities[maxDamageIndex];
    const damagePercentage = damageConfidence * 100;
    
    let damageLevel: string;
    if (damagePercentage < 50) {
      damageLevel = 'Healthy hair';
    } else if (damagePercentage < 70) {
      damageLevel = `Possible chance of ${baseDamageType}`;
    } else if (damagePercentage < 85) {
      damageLevel = `Moderate chance of ${baseDamageType}`;
    } else {
      damageLevel = `High chance of ${baseDamageType}`;
    }
    
    const healthScore = Math.max(0, Math.min(100, 100 - damagePercentage));
    const displayDamageConfidence = damageLevel === 'Healthy hair'
      ? Math.max(0, Math.min(1, 1 - damageConfidence))
      : damageConfidence;
    const displayDamagePercentage = displayDamageConfidence * 100;
    
    // Clean up tensors
    tensorNCHW.dispose();
    
    const predictionsArray = normalizedDamageProbabilities;
    
    console.log('FINAL ANALYSIS RESULTS:');
    console.log('─'.repeat(60));
    console.log(`Hair Type: ${hairType} (${(hairTypeConfidence * 100).toFixed(2)}% confidence)`);
    console.log(`Damage Type: ${baseDamageType}`);
    console.log(`Damage Level: ${damageLevel}`);
    console.log(`Damage Confidence: ${displayDamagePercentage.toFixed(2)}%`);
    console.log(`Hair Health Score: ${healthScore.toFixed(2)}/100`);
    console.log(`Damage Percentage (max class): ${damagePercentage.toFixed(2)}%`);
    console.log('');
    console.log('All Damage Probabilities:');
    HAIR_DAMAGE_LABELS.forEach((label, idx) => {
      const prob = predictionsArray[idx] ?? 0;
      console.log(`  ${label.padEnd(15)}: ${(prob * 100).toFixed(2)}%`);
    });
    console.log('');
    console.log('All Hair Type Probabilities (After Softmax):');
    hairTypeProbabilities.forEach(({ type, percentage }) => {
      console.log(`  ${type.padEnd(10)}: ${percentage}`);
    });
    console.log('='.repeat(60));
    console.log('');
    
    return {
      hairType: { type: hairType, confidence: hairTypeConfidence },
      hairDamage: { level: damageLevel, type: baseDamageType, confidence: displayDamageConfidence },
      hairHealth: { score: healthScore },
      predictions: predictionsArray, // All damage type probabilities
      hairTypePredictions: probabilities, // All hair type probabilities (after softmax)
      modelLoadingTimeMs,
      inferenceTimeMs,
    };
  } catch (error) {
    console.error('Error analyzing hair:', error);
    throw error;
  }
}
