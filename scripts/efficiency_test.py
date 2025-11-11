#!/usr/bin/env python3
"""
Efficiency Test for Hair-Type Models (ONNX)

Features:
- Loads all ONNX models from a directory (default: assets/models/hairtype-efficiency)
- Randomly samples up to 100 images from an assets root (default: assets)
- Handles NCHW and NHWC input formats by inspecting model input shape
- Measures:
  - model loading time
  - per-image inference times (mean/std/min/max)
  - warmup time (first inference)
  - total elapsed time for the batch
- Prints a summary table like the provided screenshot
- Saves results to CSV/JSON
- Optionally uploads artifacts to Firebase Storage (if credentials/bucket available)

Usage:
  python scripts/efficiency_test.py \
    --model-dir "assets/models/hairtype-efficiency" \
    --assets-root "assets" \
    --num-images 100 \
    --output-dir "efficiency_results" \
    --firebase-bucket "your-bucket-name.appspot.com"
"""

import os
import sys
import time
import json
import random
import argparse
import pathlib
import datetime
from typing import List, Tuple, Dict, Any

import numpy as np
from PIL import Image
from tabulate import tabulate
from tqdm import tqdm

try:
    import onnxruntime as ort
except Exception as e:
    print("Error: onnxruntime is required. Install via: pip install onnxruntime")
    raise

# Firebase is optional; only used if available and bucket is provided
FIREBASE_AVAILABLE = False
try:
    import firebase_admin
    from firebase_admin import credentials, storage
    FIREBASE_AVAILABLE = True
except Exception:
    FIREBASE_AVAILABLE = False


def find_models(model_dir: str) -> List[pathlib.Path]:
    p = pathlib.Path(model_dir)
    if not p.exists():
        return []
    return sorted([f for f in p.rglob("*.onnx") if f.is_file()], key=lambda x: x.name.lower())


def list_images(root: str) -> List[pathlib.Path]:
    p = pathlib.Path(root)
    if not p.exists():
        return []
    exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    return [f for f in p.rglob("*") if f.suffix.lower() in exts and f.is_file()]


def load_image(path: pathlib.Path, size: Tuple[int, int]) -> np.ndarray:
    img = Image.open(path).convert("RGB").resize(size, Image.BILINEAR)
    # normalize to [0,1]
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return arr


def prepare_input_tensor(image_arr: np.ndarray, input_shape: List[int]) -> np.ndarray:
    """
    Prepare input tensor based on model input shape.
    Handles typical shapes:
      - [1, 3, H, W] (NCHW)
      - [1, H, W, 3] (NHWC)
    """
    # Resolve dynamic dims (None) to concrete ints if possible
    shape = [int(d) if isinstance(d, (int, np.integer)) or (isinstance(d, str) and d.isdigit()) else d for d in input_shape]
    # Default size from image
    h, w = image_arr.shape[0], image_arr.shape[1]

    if len(shape) != 4:
        # Fallback: assume NHWC
        nchw = False
    else:
        # Detect format from channels location
        if (shape[1] == 3) or (shape[1] is None and shape[-1] != 3):
            nchw = True
        elif shape[-1] == 3 or shape[-1] is None:
            nchw = False
        else:
            # Default NHWC if ambiguous
            nchw = False

    if nchw:
        # shape: [1, 3, H, W]
        if shape[2] not in (None, h) or shape[3] not in (None, w):
            # resize again to requested size
            target_h = h if shape[2] in (None, ) else int(shape[2])
            target_w = w if shape[3] in (None, ) else int(shape[3])
            image_arr = load_image(pathlib.Path(""), (target_w, target_h))  # dummy, replaced below
        # Convert NHWC -> NCHW
        chw = np.transpose(image_arr, (2, 0, 1))
        tensor = chw[np.newaxis, :, :, :].astype(np.float32)
    else:
        # shape: [1, H, W, 3]
        tensor = image_arr[np.newaxis, :, :, :].astype(np.float32)

    return tensor


def preprocess_to_model(image_path: pathlib.Path, input_shape: List[int]) -> np.ndarray:
    # Determine target size from input shape
    h, w = 224, 224
    if len(input_shape) == 4:
        if input_shape[-1] == 3:  # NHWC
            h = int(input_shape[1]) if isinstance(input_shape[1], int) else 224
            w = int(input_shape[2]) if isinstance(input_shape[2], int) else 224
        elif input_shape[1] == 3:  # NCHW
            h = int(input_shape[2]) if isinstance(input_shape[2], int) else 224
            w = int(input_shape[3]) if isinstance(input_shape[3], int) else 224
    img = load_image(image_path, (w, h))

    # Build tensor with correct layout
    if len(input_shape) == 4 and input_shape[1] == 3:  # NCHW
        tensor = np.transpose(img, (2, 0, 1))[np.newaxis, :, :, :].astype(np.float32)
    else:  # default NHWC
        tensor = img[np.newaxis, :, :, :].astype(np.float32)
    return tensor


def run_benchmark_on_model(model_path: pathlib.Path, image_paths: List[pathlib.Path]) -> Dict[str, Any]:
    # Load session and record loading time
    t0_load = time.time()
    session = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
    loading_time = time.time() - t0_load

    input_name = session.get_inputs()[0].name
    input_shape = session.get_inputs()[0].shape

    # Warmup on first image
    warmup_time = None
    times: List[float] = []

    # First inference for warmup
    if image_paths:
        tensor = preprocess_to_model(image_paths[0], input_shape)
        t0 = time.time()
        session.run(None, {input_name: tensor})
        warmup_time = time.time() - t0

    # Main timing loop
    for p in tqdm(image_paths, desc=f"Infer {model_path.name}", leave=False):
        tensor = preprocess_to_model(p, input_shape)
        t0 = time.time()
        session.run(None, {input_name: tensor})
        t1 = time.time()
        times.append(t1 - t0)

    # Aggregate
    if times:
        mean_time = float(np.mean(times))
        std_time = float(np.std(times))
        min_time = float(np.min(times))
        max_time = float(np.max(times))
        total_time = float(np.sum(times))
    else:
        mean_time = std_time = min_time = max_time = total_time = 0.0

    size_mb = round(model_path.stat().st_size / (1024 * 1024), 6)

    return {
        "model": model_path.stem,
        "mean_time": round(mean_time, 6),
        "std_time": round(std_time, 6),
        "min_time": round(min_time, 6),
        "max_time": round(max_time, 6),
        "warmup_time": round(warmup_time or 0.0, 6),
        "loading_time": round(loading_time, 6),
        "total_time": round(total_time, 6),
        "num_images": len(image_paths),
        "size_mb": round(size_mb, 6),
        "model_path": str(model_path),
    }


def upload_to_firebase(output_dir: pathlib.Path, bucket_name: str) -> None:
    if not FIREBASE_AVAILABLE:
        print("Firebase SDK not available; skipping upload.")
        return
    if not bucket_name:
        print("No Firebase bucket provided; skipping upload.")
        return

    # Initialize app once
    if not firebase_admin._apps:
        # Use ADC if GOOGLE_APPLICATION_CREDENTIALS set; otherwise default app
        if os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred, {"storageBucket": bucket_name})
        else:
            # This will work only if running in an environment with default creds (e.g., GCP)
            firebase_admin.initialize_app(options={"storageBucket": bucket_name})

    bucket = storage.bucket(bucket_name)

    for local_file in output_dir.rglob("*"):
        if local_file.is_file():
            rel = local_file.relative_to(output_dir)
            blob_path = f"efficiency_tests/{output_dir.name}/{rel.as_posix()}"
            blob = bucket.blob(blob_path)
            blob.upload_from_filename(str(local_file))
            print(f"Uploaded: {blob_path}")


def main():
    parser = argparse.ArgumentParser(description="Hair-type ONNX model efficiency test")
    parser.add_argument("--model-dir", type=str, default="assets/models/hairtype-efficiency")
    parser.add_argument("--assets-root", type=str, default="assets")
    parser.add_argument("--num-images", type=int, default=100)
    parser.add_argument("--output-dir", type=str, default="efficiency_results")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--firebase-bucket", type=str, default="")
    args = parser.parse_args()

    random.seed(args.seed)
    np.random.seed(args.seed)

    models = find_models(args.model_dir)
    if not models:
        print(f"No ONNX models found in: {args.model_dir}")
        sys.exit(1)

    all_images = list_images(args.assets_root)
    if not all_images:
        print(f"No images found under: {args.assets_root}")
        sys.exit(1)

    # Randomly pick requested number (without replacement)
    num_pick = min(args.num_images, len(all_images))
    chosen_images = random.sample(all_images, num_pick)

    # Output directory timestamped
    ts = datetime.datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    out_dir = pathlib.Path(args.output_dir) / f"run-{ts}"
    out_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for m in models:
        print(f"\nBenchmarking model: {m.name}")
        res = run_benchmark_on_model(m, chosen_images)
        results.append(res)

    # Sort by mean_time ascending
    results_sorted = sorted(results, key=lambda r: r["mean_time"])

    # Print table like screenshot
    headers = ["model", "mean_time", "std_time", "min_time", "max_time", "warmup_time", "loading_time", "size_mb"]
    table = [[r[h] for h in headers] for r in results_sorted]
    print()
    print(tabulate(table, headers=headers, tablefmt="github", floatfmt=".6f"))

    # Save JSON and CSV
    json_path = out_dir / "summary.json"
    csv_path = out_dir / "summary.csv"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(results_sorted, f, ensure_ascii=False, indent=2)

    with open(csv_path, "w", encoding="utf-8") as f:
        f.write(",".join(headers) + "\n")
        for r in results_sorted:
            row = [str(r[h]) for h in headers]
            f.write(",".join(row) + "\n")

    # Save image list used
    with open(out_dir / "images_used.txt", "w", encoding="utf-8") as f:
        for p in chosen_images:
            f.write(str(p) + "\n")

    # Upload to Firebase Storage if requested
    if args.firebase_bucket:
        try:
            upload_to_firebase(out_dir, args.firebase_bucket)
        except Exception as e:
            print(f"Firebase upload failed: {e}")

    print(f"\nArtifacts saved to: {out_dir}")


if __name__ == "__main__":
    # Ensure UTF-8 console on Windows to avoid emoji/log issues
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
        sys.stderr.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except Exception:
        pass
    main()


