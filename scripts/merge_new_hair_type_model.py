#!/usr/bin/env python3
"""
Merge new hair type model external data for React Native release builds.
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

def merge_new_hair_type_model():
    # Path to the new hair type model
    model_path = Path("assets/models/new hair type/mobilenet_v3_small_20251121_210313.onnx")
    data_path = Path("assets/models/new hair type/mobilenet_v3_small_20251121_210313.onnx.data")
    output_path = Path("assets/models/new hair type/mobilenet_v3_small_20251121_210313_merged.onnx")
    
    print("=" * 60)
    print("Merging New Hair Type Model for Release Build")
    print("=" * 60)
    print()
    
    if not model_path.exists():
        print(f"ERROR: Model file not found: {model_path}")
        return False
    
    if not data_path.exists():
        print(f"WARNING: No external data file found at {data_path}")
        print("Model may already be self-contained or data file is missing")
        return False
    
    if output_path.exists():
        print(f"SKIP: Merged model already exists: {output_path}")
        print("Delete it first if you want to regenerate.")
        return True
    
    print(f"Model: {model_path.name}")
    print(f"Data: {data_path.name}")
    print(f"Output: {output_path.name}")
    print()
    
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
    print("=" * 60)
    print("Next steps:")
    print("1. Update lib/onnx-helpers-native.ts to use the new merged model")
    print("2. Rebuild your app: npx expo prebuild --clean")
    print("3. Test the hair type detection")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    success = merge_new_hair_type_model()
    sys.exit(0 if success else 1)


