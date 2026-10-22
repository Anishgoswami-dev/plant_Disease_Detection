"""
Fasal Dristhi — Local ML Test Script
Direct inference verification on real crop leaf images using existing ML system.
"""

import os
import sys
import time
import argparse
from pathlib import Path
import torch
from PIL import Image

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure ml directory is in sys.path
ML_DIR = Path(__file__).resolve().parent
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

from app.config import (
    MODEL_WEIGHTS_PATH,
    CLASS_INDICES_PATH,
    MODEL_ARCHITECTURE,
    DEVICE
)
from app.preprocessing import (
    validate_and_load_image,
    preprocess_image_to_tensor,
    ImageValidationError
)
from app.model import get_classifier
from app.knowledge_base import get_agronomy_info, format_class_name


def run_inference_test(image_path: str, model_path: str = None):
    print("=" * 40)
    print("FASAL DRISHTI — REAL ML TEST")
    print("=" * 40)
    print()

    # 1. Verify Image Path
    if not os.path.exists(image_path):
        print(f"ERROR: Image file not found at: {image_path}")
        print("REAL TEST IMAGE REQUIRED")
        print("Expected format: JPEG / PNG image of a plant/crop leaf.")
        sys.exit(1)

    print(f"Image:\n{os.path.abspath(image_path)}\n")

    # 2. Check Architecture & Device
    device_name = "CUDA" if torch.cuda.is_available() else "CPU"
    print(f"Model:\n{MODEL_ARCHITECTURE}\n")
    print(f"Device:\n{device_name}\n")

    # 3. Model & Weights Loading Check
    classifier = get_classifier()
    target_weights = model_path if model_path else MODEL_WEIGHTS_PATH
    if model_path and os.path.exists(model_path):
        try:
            sd = torch.load(model_path, map_location=classifier.device)
            classifier.model.load_state_dict(sd)
            classifier.is_loaded = True
            weights_loaded = "YES"
        except Exception as e:
            weights_loaded = f"NO — {e}"
    else:
        weights_loaded = "YES" if (classifier.is_loaded and os.path.exists(target_weights)) else "NO"

    print(f"Number of Classes:\n{len(classifier.classes)}\n")
    print(f"Model Weights Loaded:\n{weights_loaded}\n")

    # 4. Class Mapping Check
    class_mapping_loaded = "YES" if (len(classifier.classes) == 38 and os.path.exists(CLASS_INDICES_PATH)) else "NO"
    print(f"Class Mapping Loaded:\n{class_mapping_loaded}\n")

    # 5. Preprocessing Check
    try:
        with open(image_path, "rb") as f:
            image_bytes = f.read()
        pil_img, cv_img, quality_metrics = validate_and_load_image(image_bytes, filename=os.path.basename(image_path))
        input_tensor = preprocess_image_to_tensor(pil_img)
        preprocessing_loaded = "YES"
    except ImageValidationError as e:
        print(f"Preprocessing Loaded:\nNO — Image validation error: {e.message}\n")
        print("REAL TEST IMAGE REQUIRED")
        print("Ensure the image is well-lit, in focus, and contains foliage.")
        sys.exit(1)
    except Exception as e:
        print(f"Preprocessing Loaded:\nNO — {str(e)}\n")
        sys.exit(1)

    print(f"Preprocessing Loaded:\n{preprocessing_loaded}\n")

    # 6. Real Forward Pass
    real_forward_pass = "NO"
    inference_time_ms = 0.0

    try:
        start_time = time.perf_counter()
        with torch.no_grad():
            tensor_device = input_tensor.to(classifier.device)
            logits = classifier.model(tensor_device)
            probabilities = torch.softmax(logits, dim=1)[0]
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
        real_forward_pass = "YES"
    except Exception as e:
        print(f"Real Forward Pass:\nNO — Execution failed: {str(e)}\n")
        sys.exit(1)

    print(f"Real Forward Pass:\n{real_forward_pass}\n")

    # 7. Extract Top-3 Predictions directly from Softmax output
    top3_probs, top3_indices = torch.topk(probabilities, 3)
    top3_list = []
    for prob, idx in zip(top3_probs.tolist(), top3_indices.tolist()):
        raw_label = classifier.classes[idx]
        crop, disease, is_healthy = format_class_name(raw_label)
        top3_list.append({
            "raw_label": raw_label,
            "crop": crop,
            "disease": disease,
            "probability": float(prob)
        })

    primary = top3_list[0]
    agronomy = get_agronomy_info(primary["raw_label"])
    scientific_name = agronomy.get("scientific_name", primary["disease"])

    print("-" * 40)
    print("RESULT")
    print("-" * 40)
    print()
    print(f"Crop:\n{primary['crop']}\n")
    print(f"Predicted Disease:\n{primary['disease']}\n")
    print(f"Scientific Name:\n{scientific_name}\n")
    print(f"Confidence:\n{primary['probability']:.4f} ({primary['probability']*100:.2f}%)\n")

    print("Top-3 Predictions:\n")
    for i, pred in enumerate(top3_list, 1):
        print(f"{i}. {pred['raw_label']} - {pred['probability']:.4f} ({pred['probability']*100:.2f}%)")

    print()
    print("-" * 40)
    print()
    print(f"Inference Time:\n{inference_time_ms} ms\n")
    print("=" * 40)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fasal Dristhi Real ML Test")
    parser.add_argument("--image", type=str, default=str(ML_DIR / "test_images" / "real_tomato_early_blight.jpg"),
                        help="Path to real leaf image file")
    parser.add_argument("--model", type=str, default=None,
                        help="Path to custom model weights (.pth)")
    args = parser.parse_args()
    run_inference_test(args.image, model_path=args.model)
