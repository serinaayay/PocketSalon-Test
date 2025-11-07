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

// Load model 
const session = await loadHairDamageModel();

const tensor = await preprocessImageForOnnx(imageUri, 224);

const result = await predictHairDamage(session, tensor);
console.log(result.damageLevel, result.confidence);

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
