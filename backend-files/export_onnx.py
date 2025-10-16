"""
Simple script to export PyTorch model to ONNX format.
ONNX can be used directly in React Native with onnxruntime-react-native.
"""
import argparse
import shutil
from pathlib import Path

import torch
from model import HairTypeClassifier


def main():
    parser = argparse.ArgumentParser(description="Export PyTorch .pth to ONNX")
    parser.add_argument("--ckpt", default="model/hair_type_model.pth", help="Path to .pth checkpoint")
    parser.add_argument("--out", default="../assets/models/hair_type", help="Output directory for ONNX file")
    parser.add_argument("--size", type=int, default=224, help="Input image size (square)")
    args = parser.parse_args()

    ckpt_path = Path(args.ckpt)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Load model
    print(f"Loading model from {ckpt_path}...")
    model = HairTypeClassifier()
    state = torch.load(str(ckpt_path), map_location="cpu", weights_only=False)
    model.load_state_dict(state)
    model.eval()
    print("✓ Model loaded successfully")

    # Export to ONNX
    onnx_path = out_dir / "hair_type_model.onnx"
    dummy_input = torch.randn(1, 3, args.size, args.size)
    
    print(f"Exporting to ONNX format ({args.size}x{args.size} input)...")
    torch.onnx.export(
        model,
        dummy_input,
        str(onnx_path),
        input_names=["input"],
        output_names=["output"],
        opset_version=13,
        dynamic_axes={"input": {0: "batch"}, "output": {0: "batch"}},
        export_params=True,
    )
    print(f"✓ ONNX model exported to {onnx_path}")
    print(f"\nModel info:")
    print(f"  - Input: 'input' shape [batch, 3, {args.size}, {args.size}]")
    print(f"  - Output: 'output' shape [batch, 4] (Straight, Wavy, Curly, Kinky)")
    print(f"\nFile size: {onnx_path.stat().st_size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()

