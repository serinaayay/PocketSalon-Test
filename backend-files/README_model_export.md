# Hair Type Model Export Guide

## Overview

This document explains how to export the PyTorch hair type classification model to ONNX format for use in the React Native mobile app.

## Prerequisites

- Python 3.12
- Virtual environment activated (`venv`)
- All dependencies installed from `requirements.txt`

## Model Architecture

The model is based on **ResNet50** with a custom classification head:
- Input: RGB image (224x224 pixels)
- Output: 4 classes (Straight, Wavy, Curly, Kinky)
- Format: ONNX (Open Neural Network Exchange)

## Export Process

### 1. Install Dependencies

```bash
cd backend-files
..\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 2. Export to ONNX

Run the export script:

```bash
..\venv\Scripts\python.exe export_onnx.py
```

This will:
- Load the PyTorch model from `model/hair_type_model.pth`
- Export it to ONNX format
- Save the model to `../assets/models/hair_type/hair_type_model.onnx`

### 3. Output

The ONNX model will be created at:
```
assets/models/hair_type/hair_type_model.onnx
```

**Model Details:**
- File size: ~93.6 MB
- Input shape: [batch, 3, 224, 224] (NCHW format)
- Input type: float32
- Normalization: ImageNet mean/std ([0.485, 0.456, 0.406] / [0.229, 0.224, 0.225])
- Output shape: [batch, 4]
- Output type: float32 (logits, apply softmax for probabilities)

## Mobile App Integration

### Dependencies

The React Native app uses:
- `onnxruntime-react-native` - For running ONNX models
- `jpeg-js` - For image decoding

### Usage

```typescript
import { loadHairTypeModelOnnx } from '../lib/loadModelOnnx';
import { jpegToOnnxTensor, softmax } from '../lib/preprocessOnnx';
import { Tensor } from 'onnxruntime-react-native';

// Load model
const session = await loadHairTypeModelOnnx();

// Preprocess image
const rawBytes = /* JPEG bytes */;
const inputData = jpegToOnnxTensor(rawBytes, 224);

// Create tensor and run inference
const inputTensor = new Tensor('float32', inputData, [1, 3, 224, 224]);
const outputs = await session.run({ input: inputTensor });

// Get predictions
const logits = outputs.output.data as Float32Array;
const probs = softmax(logits);
const labels = ['Straight', 'Wavy', 'Curly', 'Kinky'];
const prediction = labels[probs.indexOf(Math.max(...probs))];
```

## Why ONNX Instead of TensorFlow.js?

We chose ONNX over TensorFlow.js for several reasons:

1. **Simpler Conversion**: Direct PyTorch → ONNX export is well-supported and reliable
2. **Better Python 3.12 Support**: TensorFlow.js conversion tools had Python version compatibility issues
3. **Smaller Bundle**: ONNX runtime is lighter than TensorFlow.js
4. **Better Performance**: ONNX runtime is optimized for mobile inference
5. **Single File**: Model is in one file instead of multiple shards

## Troubleshooting

### Model not loading in app

1. Make sure Metro bundler includes `.onnx` files:
   ```javascript
   // metro.config.js
   config.resolver.assetExts.push('onnx');
   ```

2. Restart Metro with cache clear:
   ```bash
   npx expo start -c
   ```

### Low accuracy

Check image preprocessing:
- Ensure RGB order (not BGR)
- Apply ImageNet normalization
- Resize to 224x224
- Use NCHW format (channel-first)

### Memory issues

The model is ~94MB. On low-memory devices:
- Load model once and cache it
- Dispose tensors after inference
- Consider model quantization (future optimization)

## Future Optimizations

- **Quantization**: Reduce model size to <25MB using INT8 quantization
- **Mobile-specific models**: Export to Core ML (iOS) or TensorFlow Lite (Android)
- **Dynamic ONNX Runtime**: Use platform-specific ONNX runtime backends

