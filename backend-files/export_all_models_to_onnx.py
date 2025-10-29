

import os
import sys
from pathlib import Path
import tensorflow as tf
import tf2onnx
import onnx


def convert_keras_to_onnx(keras_path, onnx_path, model_name):
    """Convert a Keras model to ONNX format"""
    
    print(f"\n{'='*70}")
    print(f"Converting {model_name}")
    print(f"{'='*70}")
    
    # Load Keras model
    print(f"1. Loading Keras model from {keras_path}...")
    try:
        model = tf.keras.models.load_model(keras_path)
        print(f"   [OK] Model loaded successfully")
        print(f"   Input shape:  {model.input_shape}")
        print(f"   Output shape: {model.output_shape}")
        
        # Get dimensions
        if len(model.input_shape) == 4:
            batch, height, width, channels = model.input_shape
            print(f"   Image size:   {height}x{width} (channels: {channels})")
        
        if len(model.output_shape) == 2:
            batch, num_classes = model.output_shape
            print(f"   Classes:      {num_classes}")
            
        # Check output activation
        last_layer = model.layers[-1]
        if hasattr(last_layer, 'activation'):
            print(f"   Activation:   {last_layer.activation.__name__}")
            
    except Exception as e:
        print(f"   [ERROR] Error loading model: {e}")
        return False
    
    # Convert to ONNX
    print(f"\n2. Converting to ONNX format...")
    try:
        spec = (tf.TensorSpec(model.input_shape, tf.float32, name="input"),)
    
        onnx_model, _ = tf2onnx.convert.from_keras(
            model,
            input_signature=spec,
            opset=13,
            output_path=str(onnx_path)
        )
        
        print(f"   [OK] Conversion successful")
        print(f"   Saved to: {onnx_path}")
        

        print(f"\n3. Verifying ONNX model...")
        onnx_model = onnx.load(str(onnx_path))
        onnx.checker.check_model(onnx_model)
        print(f"   [OK] Model is valid")
        
        # Show file size
        file_size_mb = onnx_path.stat().st_size / (1024 * 1024)
        print(f"   File size: {file_size_mb:.2f} MB")
        
        return True
        
    except Exception as e:
        print(f"   [ERROR] Error converting model: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():

    backend_dir = Path(__file__).parent
    project_root = backend_dir.parent

    hair_type_dir = project_root / "assets" / "models" / "hair_type"
    hair_damage_dir = project_root / "assets" / "models" / "hair_damage"
    hair_type_dir.mkdir(parents=True, exist_ok=True)
    hair_damage_dir.mkdir(parents=True, exist_ok=True)

    models = [
        {
            "name": "Hair Type Model (MobileNetV3)",
            "keras": backend_dir / "mobnetv3_hairtype_1.keras",
            "onnx": hair_type_dir / "hair_type_model.onnx",
            "description": "4 classes: Straight, Wavy, Curly, Kinky"
        },
        {
            "name": "Hair Damage Model 2 (MobileNetV3 - Multilabel)",
            "keras": backend_dir / "mobnetv3_hairdmg_2_POST.keras",
            "onnx": hair_damage_dir / "hair_damage_model_2.onnx",
            "description": "4 classes multilabel for damage detection"
        }
    ]
    
    print("\n" + "="*70)
    print("Keras to ONNX Converter")
    print("="*70)
    print("\nThis will convert:")
    print("  1. mobnetv3_hairtype_1.keras    -> hair_type_model.onnx")
    print("  2. mobnetv3_hairdmg_2_POST.keras -> hair_damage_model_2.onnx")
    print("\nBoth models use 224x224 RGB images as input.")
    print("="*70)
    
    success_count = 0
    converted_models = []
    
    for model_info in models:
        if model_info["keras"].exists():
            if convert_keras_to_onnx(
                model_info["keras"],
                model_info["onnx"],
                model_info["name"]
            ):
                success_count += 1
                converted_models.append(model_info)
        else:
            print(f"\n[ERROR] Model not found: {model_info['keras']}")
    
    return success_count == len(models)


if __name__ == "__main__":
    try:
        import tf2onnx
    except ImportError:
        print("[ERROR] tf2onnx is not installed")
        print("Install it with: pip install tf2onnx")
        sys.exit(1)
    
    success = main()
    sys.exit(0 if success else 1)

