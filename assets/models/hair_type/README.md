# Hair Type Classification Model

## Model Information

- **Source Model**: `backend-files/mobnetv3_hairtype_1.keras`
- **ONNX Model**: `hair_type_model.onnx`
- **Architecture**: MobileNetV3
- **File Size**: ~3.60 MB

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
  1. Straight
  2. Wavy
  3. Curly
  4. Kinky

## Conversion Details

- **Converter**: TensorFlow 2 to ONNX (tf2onnx)
- **ONNX Opset**: 13
- **Total Parameters**: 941,428

## Usage in React Native

```typescript
import { loadHairTypeModel, predictHairType, preprocessImageForOnnx } from '@/lib/onnx-helpers-native';

// Load model (do this once)
const session = await loadHairTypeModel();

// Preprocess image (224x224)
const tensor = await preprocessImageForOnnx(imageUri, 224);

// Run inference
const result = await predictHairType(session, tensor);
console.log(result.hairType, result.confidence);
// Example output: "Wavy", 0.87
```

## Model Training Information

- Based on MobileNetV3 architecture optimized for mobile deployment
- Trained on hair type classification dataset
- Output uses softmax activation for multi-class classification

## Re-conversion

To re-convert from Keras to ONNX:

```bash
cd backend-files
..\venv\Scripts\python.exe export_all_models_to_onnx.py
```

This will regenerate `hair_type_model.onnx` from the latest Keras file.
