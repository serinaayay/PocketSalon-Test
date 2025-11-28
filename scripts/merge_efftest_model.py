#!/usr/bin/env python3
"""
Merge EFFTEST model external data for React Native release builds.
This creates a single self-contained ONNX file that works reliably in release APKs.
"""
import os
import sys
from pathlib import Path

try:
    import onnx
except ImportError:
    print("ERROR: onnx package not installed")
    print("Install with: pip install onnx")
    sys.exit(1)

def merge_single_model(model_name: str) -> bool:
    model_path = Path(f"assets/models/{model_name}")
    data_path = model_path.with_suffix('.onnx.data')
    output_path = Path(f"assets/models/{model_name.replace('.onnx', '_merged.onnx')}")
    
    if not model_path.exists():
        print(f"ERROR: Model file not found: {model_path}")
        return False
    
    if not data_path.exists():
        print(f"WARNING: No external data file found at {data_path}")
        print("Model may already be self-contained or data file is missing")
        return False
    
    if output_path.exists():
        print(f"SKIP: Merged model already exists: {output_path}")
        return True
    
    print(f"Model: {model_path.name}")
    print(f"Data: {data_path.name}")
    print(f"Output: {output_path.name}")
    
    print("Loading model with external data...")
    model = onnx.load(str(model_path), load_external_data=True)
    
    print("Saving merged model...")
    onnx.save(model, str(output_path))
    
    original_size = model_path.stat().st_size / (1024 * 1024)
    data_size = data_path.stat().st_size / (1024 * 1024)
    merged_size = output_path.stat().st_size / (1024 * 1024)
    
    print("Successfully merged!")
    print(f"  Original: {original_size:.2f} MB")
    print(f"  Data: {data_size:.2f} MB")
    print(f"  Merged: {merged_size:.2f} MB")
    print()
    
    return True

def merge_efftest_model():
    models_to_merge = [
        "EFFTEST_mobilenet_v3_small_20251111_101530.onnx",
        "EFFTEST_efficientnet_b0_20251111_101510.onnx",
        "EFFTEST_resnet50_20251111_101444.onnx",
        "mobilenet_v3_small_20251116_214232.onnx",
        "hair_damage_efftest/EFFTEST_HDMG_DMG_CV_best_resnet50_20251117_145818.onnx",
        "hair_damage_efftest/EFFTEST_HDMG_DMG_CV_best_mobilenet_v3_small_20251117_163748.onnx",
        "hair_damage_efftest/EFFTEST_HDMG_DMG_CV_best_efficientnet_b0_20251117_155148.onnx",
    ]
    
    print("=" * 60)
    print("Merging EFFTEST Models for Release Build")
    print("=" * 60)
    print()
    
    success_count = 0
    for model_name in models_to_merge:
        print(f"Processing {model_name}...")
        if merge_single_model(model_name):
            success_count += 1
        print()
    
    print("=" * 60)
    print(f"Merged {success_count}/{len(models_to_merge)} models successfully")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Rebuild your app: npx expo prebuild --clean")
    print("2. Build release APK: eas build --platform android --profile production")
    print("3. Test efficiency on device")
    
    return success_count > 0

if __name__ == "__main__":
    merge_efftest_model()

