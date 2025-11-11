import { InferenceSession } from 'onnxruntime-react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebaseConfig';
import hairtypeSampleImages from '../assets/manifests/hairtypeImages';
import { preprocessImageNCHW } from './onnx-helpers-native';

type ModelDef = {
  name: string;
  // Metro static require to the .onnx file under assets/models/hairtype-efficiency
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any;
  // Optional .onnx.data companion file (external initializers)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataModule?: any;
};

type PerModelResult = {
  model: string;
  loading_time_ms: number;
  warmup_time_ms: number;
  per_sample_inference_ms: number[];
  mean_inference_ms: number;
  std_inference_ms: number;
  num_images: number;
  upload_url?: string;
};

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function std(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

async function toLocalUri(moduleOrUri: any): Promise<string> {
  const asset = Asset.fromModule(moduleOrUri);
  await asset.downloadAsync();
  if (!asset.localUri) throw new Error('Failed to resolve localUri for asset');
  return asset.localUri;
}

async function getModelPath(model: ModelDef): Promise<string> {
  // For large models, use FileSystem to read directly from assets
  // Extract the model filename from the require path
  const modelFileName = `EFFTEST_${model.name}_*_merged.onnx`;
  
  // Map model names to their actual filenames
  const modelFiles: { [key: string]: string } = {
    'resnet50': 'EFFTEST_resnet50_20251111_101444_merged.onnx',
    'efficientnet_b0': 'EFFTEST_efficientnet_b0_20251111_101510_merged.onnx',
    'mobilenet_v3_small': 'EFFTEST_mobilenet_v3_small_20251111_101530_merged.onnx',
  };
  
  const fileName = modelFiles[model.name];
  if (!fileName) {
    throw new Error(`Unknown model: ${model.name}`);
  }
  
  // Try to get asset info without downloading (models are bundled in APK/bundle)
  const asset = Asset.fromModule(model.module);
  
  // In production, models are in the app bundle
  // In development, we need to use the file:// URI from Asset
  if (asset.localUri) {
    return asset.localUri;
  }
  
  // If no localUri yet, trigger download
  await asset.downloadAsync();
  
  if (!asset.localUri) {
    throw new Error(`Failed to resolve local URI for model: ${model.name}`);
  }
  
  return asset.localUri;
}

async function loadModelSession(model: ModelDef): Promise<{ session: InferenceSession; loadingMs: number }> {
  const t0 = Date.now();
  
  console.log(`[EfficiencyRunner] Loading model: ${model.name}`);
  
  let modelPath: string;
  try {
    modelPath = await getModelPath(model);
    console.log(`[EfficiencyRunner] Model path resolved: ${modelPath}`);
  } catch (e) {
    console.error(`[EfficiencyRunner] Failed to resolve model path for ${model.name}:`, e);
    throw new Error(`Cannot load model ${model.name}: ${e}`);
  }
  
  // Check if file exists
  const fileInfo = await FileSystem.getInfoAsync(modelPath);
  if (!fileInfo.exists) {
    throw new Error(`Model file does not exist at: ${modelPath}`);
  }
  
  console.log(`[EfficiencyRunner] Model file size: ${(fileInfo.size! / 1024 / 1024).toFixed(2)} MB`);
  
  const session = await InferenceSession.create(modelPath);
  const loadingMs = Date.now() - t0;
  
  console.log(`[EfficiencyRunner] Model ${model.name} loaded successfully in ${loadingMs}ms`);
  
  return { session, loadingMs };
}

async function resolveImageUris(limit = 100): Promise<string[]> {
  if (!hairtypeSampleImages || hairtypeSampleImages.length === 0) {
    console.warn(
      '[EfficiencyRunner] No sample images configured. Populate assets/manifests/hairtypeImages.ts with up to 100 static requires.'
    );
    return [];
  }
  const selected = hairtypeSampleImages.slice(0, limit);
  const uris: string[] = [];
  for (const mod of selected) {
    try {
      const uri = await toLocalUri(mod);
      uris.push(uri);
    } catch (e) {
      // skip broken entries
      // eslint-disable-next-line no-console
      console.warn('Failed to resolve sample image asset, skipping.', e);
    }
  }
  return uris;
}

export async function runHairTypeEfficiencyAndUpload(): Promise<{
  results: PerModelResult[];
  uploadedUrl: string | null;
}> {
  const models: ModelDef[] = [
    // Models merged into single files (no external data needed)
    {
      name: 'resnet50',
      module: require('../assets/models/hairtype-efficiency/EFFTEST_resnet50_20251111_101444_merged.onnx'),
    },
    {
      name: 'efficientnet_b0',
      module: require('../assets/models/hairtype-efficiency/EFFTEST_efficientnet_b0_20251111_101510_merged.onnx'),
    },
    {
      name: 'mobilenet_v3_small',
      module: require('../assets/models/hairtype-efficiency/EFFTEST_mobilenet_v3_small_20251111_101530_merged.onnx'),
    },
  ];

  const imageUris = await resolveImageUris(100);
  if (imageUris.length === 0) {
    return { results: [], uploadedUrl: null };
  }

  const results: PerModelResult[] = [];

  for (const model of models) {
    const { session, loadingMs } = await loadModelSession(model);
    const inputName = session.inputNames[0];

    // Warmup on first image
    const warmupTensor = await preprocessImageNCHW(imageUris[0], 224);
    let t0 = Date.now();
    await session.run({ [inputName]: warmupTensor });
    const warmupMs = Date.now() - t0;
    warmupTensor.dispose();

    const perSample: number[] = [];
    for (const uri of imageUris) {
      const tensor = await preprocessImageNCHW(uri, 224);
      t0 = Date.now();
      await session.run({ [inputName]: tensor });
      const dt = Date.now() - t0;
      perSample.push(dt);
      tensor.dispose();
    }

    const result: PerModelResult = {
      model: model.name,
      loading_time_ms: loadingMs,
      warmup_time_ms: warmupMs,
      per_sample_inference_ms: perSample,
      mean_inference_ms: Number(mean(perSample).toFixed(6)),
      std_inference_ms: Number(std(perSample).toFixed(6)),
      num_images: imageUris.length,
    };
    results.push(result);
  }

  // Store JSON locally first
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const localPath = `${FileSystem.cacheDirectory}hairtype_efficiency_${stamp}.json`;
  const payload = JSON.stringify(results, null, 2);
  await FileSystem.writeAsStringAsync(localPath, payload, { encoding: FileSystem.EncodingType.UTF8 });

  // Upload to Firebase Storage
  let uploadedUrl: string | null = null;
  try {
    const blob = await (await fetch(localPath)).blob();
    const storagePath = `efficiency_tests/hairtype/${stamp}.json`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);
    uploadedUrl = await getDownloadURL(storageRef);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Upload to Firebase failed, continuing without URL.', e);
  }

  return { results, uploadedUrl };
}


