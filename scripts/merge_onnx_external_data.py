#!/usr/bin/env python3
"""
Script to merge ONNX models with external data into single .onnx files.
This makes them easier to bundle in React Native apps.
"""
import os
import sys
from pathlib import Path

# Configure UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

try:
    import onnx
except ImportError:
    print("ERROR: onnx package not installed")
    print("Install with: pip install onnx")
    sys.exit(1)

def merge_onnx_external_data(model_path: str, output_path: str = None):
    """
    Load an ONNX model with external data and save it as a single file.
    
    Args:
        model_path: Path to the .onnx file (with external .onnx.data)
        output_path: Optional output path. If None, creates _merged.onnx
    """
    if not os.path.exists(model_path):
        print(f"ERROR: Model file not found: {model_path}")
        return False
    
    # Check if .data file exists
    data_path = model_path + '.data'
    if not os.path.exists(data_path):
        print(f"WARNING: No external data file found at {data_path}")
        print(f"Model {model_path} may already be self-contained")
        return False
    
    print(f"Loading model: {model_path}")
    print(f"External data: {data_path}")
    
    # Load the model (this will automatically load external data)
    model_dir = os.path.dirname(model_path)
    model = onnx.load(model_path, load_external_data=True)
    
    # Determine output path
    if output_path is None:
        base = model_path.replace('.onnx', '')
        output_path = f"{base}_merged.onnx"
    
    print(f"Saving merged model to: {output_path}")
    
    # Save with all data embedded
    onnx.save(model, output_path)
    
    # Verify the saved model
    merged_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
    print(f"✓ Merged model saved successfully ({merged_size:.2f} MB)")
    
    return True

def main():
    # Models to merge
    efficiency_dir = Path("assets/models/hairtype-efficiency")
    
    models_to_merge = [
        "EFFTEST_resnet50_20251111_101444.onnx",
        "EFFTEST_efficientnet_b0_20251111_101510.onnx",
        "EFFTEST_mobilenet_v3_small_20251111_101530.onnx",
    ]
    
    if not efficiency_dir.exists():
        print(f"ERROR: Directory not found: {efficiency_dir}")
        print("Please run this script from the project root directory")
        sys.exit(1)
    
    print("=" * 60)
    print("ONNX External Data Merger")
    print("=" * 60)
    print()
    
    success_count = 0
    for model_name in models_to_merge:
        model_path = efficiency_dir / model_name
        output_path = efficiency_dir / model_name.replace('.onnx', '_merged.onnx')
        
        if merge_onnx_external_data(str(model_path), str(output_path)):
            success_count += 1
        print()
    
    print("=" * 60)
    print(f"Merged {success_count}/{len(models_to_merge)} models successfully")
    print("=" * 60)
    
    if success_count > 0:
        print("\nNext steps:")
        print("1. Update lib/efficiencyRunner.ts to use the *_merged.onnx files")
        print("2. Restart Metro bundler: npx expo start -c")
        print("3. Reload the app and test the efficiency button")

if __name__ == "__main__":
    main()

