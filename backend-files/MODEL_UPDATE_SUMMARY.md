# Model Update Summary

## Changes Made

### Hair Type Model
- **Changed from**: `resnet50_hairtype_2.keras` or `effnetb0_hairtype_3.keras`
- **Changed to**: `mobnetv3_hairtype_1.keras` ✓
- **ONNX Output**: `assets/models/hair_type/hair_type_model.onnx`

**Specifications:**
- Architecture: MobileNetV3
- Input: 224×224×3 RGB images
- Output: 4 classes (Straight, Wavy, Curly, Kinky)
- Activation: Softmax
- File Size: 3.60 MB
- Parameters: 941,428

### Hair Damage Model
- **Changed from**: `mobnetv3_hairdmg_1_POST.keras` (3 classes)
- **Changed to**: `mobnetv3_hairdmg_2_POST.keras` ✓ (multilabel, 4 classes)
- **ONNX Output**: `assets/models/hair_damage/hair_damage_model_2.onnx`

**Specifications:**
- Architecture: MobileNetV3
- Input: 224×224×3 RGB images
- Output: 4 classes (Healthy, Light Damage, Moderate Damage, Severe Damage)
- Activation: Softmax
- File Size: 3.60 MB
- Parameters: 941,428

## Image Dimension Alignment

Both models now use **identical input dimensions**:
- **Image Size**: 224×224 pixels
- **Color Channels**: 3 (RGB)
- **Input Format**: NCHW (batch, channels, height, width)
- **Normalization**: 0-1 range (pixel_value / 255.0)

This ensures:
✓ Consistent preprocessing across both models
✓ Single preprocessing function can be used for both
✓ Optimized memory usage
✓ Simplified integration code

## ONNX Export Configuration

- **Converter**: tf2onnx
- **ONNX Opset**: 13 (compatible with onnxruntime-react-native)
- **Input Tensor Name**: `input`
- **Output Tensor Name**: `output`

## Files Created/Updated

### New Files
1. `backend-files/inspect_models.py` - Model inspection utility
2. `backend-files/export_all_models_to_onnx.py` - Unified export script
3. `assets/models/hair_type/hair_type_model.onnx` - New hair type model
4. `assets/models/hair_damage/hair_damage_model_2.onnx` - New damage model

### Updated Files
1. `assets/models/hair_type/README.md` - Updated documentation
2. `assets/models/hair_damage/README.md` - Updated documentation

## React Native Integration

The app's ONNX helper code (`lib/onnx-helpers-native.ts`) already supports:
- ✓ Loading both models from assets
- ✓ Preprocessing images to 224×224
- ✓ Running inference with proper tensor shapes
- ✓ Interpreting results with correct class labels

**No code changes required** - the preprocessing function already uses `targetSize: 224` by default.

## Model Performance

Both models use MobileNetV3 architecture:
- **Optimized for mobile**: Low latency, small file size
- **Efficient**: ~3.6 MB per model vs ~90 MB for ResNet50
- **Fast inference**: Suitable for real-time analysis
- **Same architecture**: Consistent performance characteristics

## How to Re-export Models

If you need to re-export the models from Keras to ONNX:

```bash
cd backend-files
..\venv\Scripts\activate
python export_all_models_to_onnx.py
```

This will:
1. Load the Keras models
2. Convert to ONNX format with opset 13
3. Save to `assets/models/` directories
4. Verify the ONNX models are valid

## Verification

To verify model specifications:

```bash
cd backend-files
..\venv\Scripts\activate
python inspect_models.py
```

This will display:
- Input/output shapes
- Number of classes
- Activation functions
- File sizes
- Parameter counts

## Next Steps

1. ✓ Models exported to ONNX
2. ✓ Dimensions aligned (224×224)
3. ✓ Documentation updated
4. Test models in React Native app
5. Verify inference results
6. Update UI if needed based on new damage classes

## Notes

- The hair damage model 2 is described as "multilabel" though it uses softmax activation
- Both models were successfully validated with ONNX checker
- Input dimensions are perfectly aligned (224×224) for both models
- Preprocessing code requires no modifications

