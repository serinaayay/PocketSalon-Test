import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import RNFS from 'react-native-fs';

export async function loadHairTypeModel(): Promise<InferenceSession> {
  try {
    const modelPath = `${FileSystem.documentDirectory}hair_type_model.onnx`;
    
    const fileInfo = await FileSystem.getInfoAsync(modelPath);
    if (!fileInfo.exists) {
      console.log('RNFS paths:', {
        MainBundlePath: RNFS.MainBundlePath,
        DocumentDirectoryPath: RNFS.DocumentDirectoryPath,
        CachesDirectoryPath: RNFS.CachesDirectoryPath,
      });
      
      try {
        await RNFS.copyFileAssets('models/hair_type/hair_type_model.onnx', modelPath);
        console.log('[OK] Copied hair type model from bundled assets');
      } catch (e) {
        console.error('Failed to copy hair type model from assets:', e);
        throw new Error(`Could not load bundled model: ${e}`);
      }
    }
    
    const session = await InferenceSession.create(modelPath);
    console.log('[OK] Hair type model loaded from:', modelPath);
    return session;
  } catch (error) {
    console.error('Error loading hair type model:', error);
    throw error;
  }
}

export async function loadHairDamageModel(): Promise<InferenceSession> {
  try {
    const modelPath = `${FileSystem.documentDirectory}hair_damage_model.onnx`;
    
    const fileInfo = await FileSystem.getInfoAsync(modelPath);
    if (!fileInfo.exists) {
      try {
        await RNFS.copyFileAssets('models/hair_damage/hair_damage_model_2.onnx', modelPath);
        console.log('[OK] Copied hair damage model from bundled assets');
      } catch (e) {
        console.error('Failed to copy hair damage model from assets:', e);
        throw new Error(`Could not load bundled damage model: ${e}`);
      }
    }
    
    const session = await InferenceSession.create(modelPath);
    console.log('[OK] Hair damage model loaded from:', modelPath);
    return session;
  } catch (error) {
    console.error('Error loading hair damage model:', error);
    throw error;
  }
}

export async function preprocessImageForOnnx(
  imageUri: string,
  targetSize: number = 224
): Promise<Tensor> {
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
    const pixels = rawImageData.data;
    
    const float32Data = new Float32Array(3 * targetSize * targetSize);
    const channelSize = targetSize * targetSize;
    
    for (let y = 0; y < targetSize; y++) {
      for (let x = 0; x < targetSize; x++) {
        const pixelIndex = y * targetSize + x;
        const sourceIndex = pixelIndex * 4;
        
        const r = pixels[sourceIndex] / 255.0;
        const g = pixels[sourceIndex + 1] / 255.0;
        const b = pixels[sourceIndex + 2] / 255.0;
        
        float32Data[pixelIndex] = r;
        float32Data[channelSize + pixelIndex] = g;
        float32Data[(2 * channelSize) + pixelIndex] = b;
      }
    }
    
    console.log('[DEBUG] Tensor shape:', [1, 3, targetSize, targetSize]);
    return new Tensor('float32', float32Data, [1, 3, targetSize, targetSize]);
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw error;
  }
}

export async function predictHairType(
  session: InferenceSession,
  imageTensor: Tensor
): Promise<{ hairType: string; confidence: number; probabilities: number[] }> {
  try {
    const outputs = await session.run({ input: imageTensor });
    const logits = outputs.output.data as Float32Array;
    
    const probabilities = softmax(Array.from(logits));
    const maxIdx = probabilities.indexOf(Math.max(...probabilities));
    
    const hairTypes = ['Straight', 'Wavy', 'Curly', 'Kinky'];
    
    return {
      hairType: hairTypes[maxIdx],
      confidence: probabilities[maxIdx],
      probabilities,
    };
  } catch (error) {
    console.error('Error running hair type inference:', error);
    throw error;
  }
}

export async function predictHairDamage(
  session: InferenceSession,
  imageTensor: Tensor
): Promise<{ damageLevel: string; confidence: number; probabilities: number[] }> {
  try {
    const outputs = await session.run({ input: imageTensor });
    const logits = outputs.output.data as Float32Array;
    
    const probabilities = softmax(Array.from(logits));
    const maxIdx = probabilities.indexOf(Math.max(...probabilities));
    
    const damageLevels = ['Healthy', 'Light Damage', 'Moderate Damage', 'Severe Damage'];
    
    return {
      damageLevel: damageLevels[maxIdx],
      confidence: probabilities[maxIdx],
      probabilities,
    };
  } catch (error) {
    console.error('Error running hair damage inference:', error);
    throw error;
  }
}

function softmax(logits: number[]): number[] {
  const maxLogit = Math.max(...logits);
  const expScores = logits.map(x => Math.exp(x - maxLogit));
  const sumExpScores = expScores.reduce((a, b) => a + b, 0);
  return expScores.map(x => x / sumExpScores);
}

export async function analyzeHair(imageUri: string): Promise<{
  hairType: { type: string; confidence: number };
  hairDamage: { level: string; confidence: number };
}> {
  try {
    const [hairTypeSession, hairDamageSession] = await Promise.all([
      loadHairTypeModel(),
      loadHairDamageModel(),
    ]);
    
    const tensor = await preprocessImageForOnnx(imageUri, 224);
    
    const [hairTypeResult, hairDamageResult] = await Promise.all([
      predictHairType(hairTypeSession, tensor),
      predictHairDamage(hairDamageSession, tensor),
    ]);
    
    return {
      hairType: {
        type: hairTypeResult.hairType,
        confidence: hairTypeResult.confidence,
      },
      hairDamage: {
        level: hairDamageResult.damageLevel,
        confidence: hairDamageResult.confidence,
      },
    };
  } catch (error) {
    console.error('Error analyzing hair:', error);
    throw error;
  }
}

