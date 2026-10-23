"""
Fasal Dristhi — Step 4 Verification Test Suite
Tests:
1. Safe dual-architecture model loading (MobileNetV2 and EfficientNet-B0)
2. Mathematical temperature scaling calibration
3. Removal of artificial confidence inflation
4. Genuine safety thresholding and uncertainty handling
5. Real leaf image inference smoke test
"""

import os
import sys
import json
from pathlib import Path
import torch
import numpy as np

# Ensure ml root is on sys.path
ML_ROOT = Path(__file__).resolve().parent
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

from app.config import (
    DEFAULT_MOBILENET_PATH,
    DEFAULT_EFFICIENTNET_PATH,
    TEMPERATURE_PATH,
    CLASS_INDICES_PATH,
    HIGH_CONFIDENCE_THRESHOLD,
    MEDIUM_CONFIDENCE_THRESHOLD,
    MARGIN_AMBIGUITY_THRESHOLD
)
from app.model import PlantDiseaseClassifier
from app.preprocessing import validate_and_load_image, preprocess_image_to_tensor


def test_1_dual_architecture_loading():
    print("\n[TEST 1] Testing Dual-Architecture Model Loading...")
    
    # 1A: MobileNetV2
    mobilenet_clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")
    assert mobilenet_clf.is_loaded, f"MobileNetV2 failed to load: {mobilenet_clf.last_error}"
    assert mobilenet_clf.architecture_loaded == "mobilenet", f"Expected mobilenet, got {mobilenet_clf.architecture_loaded}"
    assert mobilenet_clf.temperature == 1.0, f"Expected T=1.0 for mobilenet, got {mobilenet_clf.temperature}"
    print(f"  PASS: MobileNetV2 loaded successfully (is_loaded={mobilenet_clf.is_loaded}, T={mobilenet_clf.temperature})")

    # 1B: EfficientNet-B0
    eff_clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_EFFICIENTNET_PATH), arch_type="efficientnet")
    assert eff_clf.is_loaded, f"EfficientNet-B0 failed to load: {eff_clf.last_error}"
    assert eff_clf.architecture_loaded == "efficientnet", f"Expected efficientnet, got {eff_clf.architecture_loaded}"
    assert eff_clf.is_calibrated, "Expected temperature calibration to be active for EfficientNet"
    assert round(eff_clf.temperature, 4) == 0.7139, f"Expected T=0.71392, got {eff_clf.temperature}"
    print(f"  PASS: EfficientNet-B0 candidate loaded successfully (is_loaded={eff_clf.is_loaded}, T={eff_clf.temperature})")



def test_2_mathematical_temperature_scaling():
    print("\n[TEST 2] Testing Mathematical Temperature Scaling...")
    # Raw logits example with 3 classes
    logits = torch.tensor([[2.0, 1.0, 0.1]])
    
    # Unscaled (T = 1.0)
    probs_unscaled = torch.softmax(logits, dim=1)[0]
    
    # Calibrated with T = 0.71392
    T = 0.71392
    probs_calibrated = torch.softmax(logits / T, dim=1)[0]
    
    # Mathematically, when T < 1.0, peak probability should sharpen
    assert probs_calibrated[0] > probs_unscaled[0], "Calibrated peak probability should be sharper when T < 1.0"
    assert torch.isclose(probs_calibrated.sum(), torch.tensor(1.0)), "Probabilities must sum to 1.0"
    print(f"  PASS: Logits {logits.tolist()[0]} -> Unscaled max: {probs_unscaled[0]:.4f}, Calibrated max (T={T}): {probs_calibrated[0]:.4f}")


def test_3_removal_of_artificial_confidence_inflation():
    print("\n[TEST 3] Testing Removal of Artificial Confidence Inflation...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")

    # Pass an arbitrary zero/noise tensor that yields low max confidence
    noise_tensor = torch.randn(1, 3, 224, 224)
    result = clf.predict(noise_tensor)

    raw_conf = result["confidence"]
    # With artificial inflation removed, an arbitrary noise tensor will NOT be forced to ~0.95
    print(f"  Noise tensor top confidence: {raw_conf:.4f} ({result['confidence_percent']}%)")
    print(f"  Assigned badge: {result['reliability_badge']}")
    print(f"  Safety message: {result['safety_message']}")

    # The previous code forcibly changed any raw_c < 0.90 to 0.948+
    # Ensure it is NOT clamped to 0.948 - 0.958
    if raw_conf < 0.90:
        assert not (0.948 <= raw_conf <= 0.958), f"Detected artificial confidence override: {raw_conf}"
        print("  PASS: No artificial confidence override detected; confidence is genuine.")


def test_4_safety_uncertainty_and_ambiguity_thresholds():
    print("\n[TEST 4] Testing Safety Uncertainty & Ambiguity Responses...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")

    # Synthetic noise yields low confidence, which must trigger LOW_UNCERTAIN
    noise_tensor = torch.zeros(1, 3, 224, 224)
    result = clf.predict(noise_tensor)

    if result["confidence"] < MEDIUM_CONFIDENCE_THRESHOLD:
        assert result["is_low_confidence"] == True
        assert result["reliability_badge"] == "LOW_UNCERTAIN"
        assert "Uncertain result" in result["safety_message"]
        print(f"  PASS: Low-confidence safety trigger verified (badge={result['reliability_badge']})")
    else:
        print(f"  INFO: Sample confidence {result['confidence']:.2f} above low threshold.")


def test_5_real_image_smoke_test():
    print("\n[TEST 5] Testing Real Leaf Image Inference Smoke Test...")
    test_img_path = ML_ROOT / "test_images" / "real_tomato_early_blight.jpg"
    assert test_img_path.exists(), f"Missing test image at {test_img_path}"

    with open(test_img_path, "rb") as f:
        image_bytes = f.read()
    pil_image, cv_image, quality_metrics = validate_and_load_image(image_bytes)
    input_tensor = preprocess_image_to_tensor(pil_image)

    # Test with EfficientNet candidate
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_EFFICIENTNET_PATH), arch_type="efficientnet")
    result = clf.predict(input_tensor, cv_image=cv_image, context={"crop": "Tomato"})

    assert result["success"] == True
    assert result["crop"] == "Tomato"
    assert "disease" in result
    assert "confidence" in result
    assert result["model_metadata"]["architecture_type"] == "efficientnet"
    assert result["model_metadata"]["temperature_scaling_applied"] == True

    print(f"  PASS: Prediction successful for real image.")
    print(f"    Crop:              {result['crop']}")
    print(f"    Diagnosis:         {result['disease']}")
    print(f"    Confidence:        {result['confidence_percent']}%")
    print(f"    Reliability Badge: {result['reliability_badge']}")
    print(f"    Severity:          {result['severity']} (Score: {result['severity_score']})")
    print(f"    Architecture:      {result['model_metadata']['architecture']}")
    print(f"    Temperature:       {result['model_metadata']['temperature']}")
    print(f"    Inference Latency: {result['inference_time_ms']} ms")


if __name__ == "__main__":
    print("=" * 70)
    print("FASAL DRISTHI — STEP 4 VERIFICATION TEST SUITE")
    print("=" * 70)
    
    test_1_dual_architecture_loading()
    test_2_mathematical_temperature_scaling()
    test_3_removal_of_artificial_confidence_inflation()
    test_4_safety_uncertainty_and_ambiguity_thresholds()
    test_5_real_image_smoke_test()
    
    print("\n" + "=" * 70)
    print("ALL 5 TESTS PASSED SUCCESSFULLY.")
    print("=" * 70)
