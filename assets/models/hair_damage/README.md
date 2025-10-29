# Hair Damage Detection Model

## Model Information

- **Source Model**: `backend-files/mobnetv3_hairdmg_2_POST.keras`
- **ONNX Model**: `hair_damage_model_2.onnx`
- **Architecture**: MobileNetV3
- **File Size**: ~3.60 MB
- **Type**: Multilabel classification (4 classes)

## Model Specifications

### Input
- **Shape**: `[1, 3, 224, 224]` (NCHW format)
- **Type**: float32
- **Preprocessing**:
  - Resize to 224×224 pixels
  - Convert to RGB (3 channels)
  - Normalize to 0-1 range (divide by 255)
  - Convert to channel-first format (NCHW)

### Output
- **Shape**: `[1, 4]`
- **Type**: float32 (softmax probabilities)
- **Classes**:
  1. Healthy
  2. Light Damage
  3. Moderate Damage
  4. Severe Damage

## Conversion Details

- **Converter**: TensorFlow 2 to ONNX (tf2onnx)
- **ONNX Opset**: 13
- **Total Parameters**: 941,428

## Usage in React Native

```typescript
import { loadHairDamageModel, predictHairDamage, preprocessImageForOnnx } from '@/lib/onnx-helpers-native';

// Load model (do this once)
const session = await loadHairDamageModel();

// Preprocess image (224x224)
const tensor = await preprocessImageForOnnx(imageUri, 224);

// Run inference
const result = await predictHairDamage(session, tensor);
console.log(result.damageLevel, result.confidence);
// Example output: "Light Damage", 0.82
```

## Model Training Information

- Based on MobileNetV3 architecture optimized for mobile deployment
- Trained for multilabel hair damage detection
- Output uses softmax activation

## Available Models

### Model 1 (Not Used)
- File: `hair_damage_model_1.onnx`
- Source: `mobnetv3_hairdmg_1_POST.keras`
- Classes: 3 (older version)

### Model 2 (Active) ✓
- File: `hair_damage_model_2.onnx`
- Source: `mobnetv3_hairdmg_2_POST.keras`
- Classes: 4 (multilabel, current version)

## Re-conversion

To re-convert from Keras to ONNX:

```bash
cd backend-files
..\venv\Scripts\python.exe export_all_models_to_onnx.py
```

This will regenerate `hair_damage_model_2.onnx` from the latest Keras file.

## Image Dimensions Alignment

Both hair type and hair damage models use the same input dimensions:
- **Input Size**: 224×224 pixels
- **Channels**: 3 (RGB)
- **Format**: NCHW (channel-first)

This ensures consistent preprocessing across both models.
