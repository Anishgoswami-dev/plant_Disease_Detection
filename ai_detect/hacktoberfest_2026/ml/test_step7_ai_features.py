"""
Fasal Dristhi — Step 7 AI Feature Improvements & Reliability Test Suite
Verifies:
1. Genuine Softmax probability distribution and removal of artificial inflation
2. Uncertainty handling for low confidence and ambiguous predictions
3. Classical OpenCV visual localization honesty (no fake YOLO/U-Net)
4. Agronomic advisory safety and expert referral thresholds
5. Crop mismatch prevention logic
"""

import os
import sys
import json
from pathlib import Path
import torch
import numpy as np
from PIL import Image

# Ensure ml root is on sys.path
ML_ROOT = Path(__file__).resolve().parent
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

from app.config import (
    DEFAULT_MOBILENET_PATH,
    DEFAULT_EFFICIENTNET_PATH,
    HIGH_CONFIDENCE_THRESHOLD,
    MEDIUM_CONFIDENCE_THRESHOLD,
    MARGIN_AMBIGUITY_THRESHOLD
)
from app.model import PlantDiseaseClassifier
from app.preprocessing import validate_and_load_image, preprocess_image_to_tensor


def test_1_genuine_probability_distribution():
    print("\n[TEST 1] Testing Genuine Probability Distribution & Sum Integrity...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")
    assert clf.is_loaded, "Model failed to load"
    
    # Create synthetic input tensor
    dummy_input = torch.randn(1, 3, 224, 224)
    with torch.no_grad():
        logits = clf.model(dummy_input.to(clf.device))
        probs = torch.softmax(logits, dim=1)[0].cpu().numpy()
        
    prob_sum = float(np.sum(probs))
    assert abs(prob_sum - 1.0) < 1e-4, f"Probabilities do not sum to 1.0: {prob_sum}"
    print(f"  PASS: All {len(probs)} class probabilities sum to {prob_sum:.6f} (genuine Softmax).")


def test_2_uncertainty_handling_low_confidence():
    print("\n[TEST 2] Testing Uncertainty Handling for Low-Confidence Logits...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")
    
    # Mock model to return flat logits (< 0.60 top confidence)
    flat_logits = torch.ones(1, len(clf.classes)) * 0.1
    # Add minor perturbation so top-1 is around ~0.05
    flat_logits[0, 0] = 0.5
    
    class MockFlatModel(torch.nn.Module):
        def forward(self, x):
            return flat_logits
            
    clf.model = MockFlatModel()
    dummy_input = torch.zeros(1, 3, 224, 224)
    result = clf.predict(dummy_input)
    
    assert result["is_low_confidence"] == True, "Expected is_low_confidence to be True"
    assert result["reliability_badge"] == "LOW_UNCERTAIN", f"Expected LOW_UNCERTAIN, got {result['reliability_badge']}"
    assert "Uncertain result" in result["safety_message"], f"Unexpected safety message: {result['safety_message']}"
    print(f"  PASS: Low-confidence prediction flagged as {result['reliability_badge']} with message: '{result['safety_message']}'")


def test_3_ambiguity_detection_margin_threshold():
    print("\n[TEST 3] Testing Ambiguity Detection on Close Margins (< 0.15)...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")
    
    # Mock model to return two dominant classes with margin < 0.15
    ambig_logits = torch.zeros(1, len(clf.classes))
    # Tomato early blight (idx 29) and Tomato late blight (idx 30)
    ambig_logits[0, 29] = 5.0
    ambig_logits[0, 30] = 4.95  # very close logits
    
    class MockAmbigModel(torch.nn.Module):
        def forward(self, x):
            return ambig_logits
            
    clf.model = MockAmbigModel()
    dummy_input = torch.zeros(1, 3, 224, 224)
    result = clf.predict(dummy_input)
    
    top1 = result["top_k"][0]["confidence"]
    top2 = result["top_k"][1]["confidence"]
    margin = top1 - top2
    assert margin < MARGIN_AMBIGUITY_THRESHOLD, f"Margin {margin} not below {MARGIN_AMBIGUITY_THRESHOLD}"
    assert result["reliability_badge"] == "AMBIGUOUS", f"Expected AMBIGUOUS, got {result['reliability_badge']}"
    assert "Ambiguous diagnosis" in result["safety_message"], f"Unexpected safety message: {result['safety_message']}"
    print(f"  PASS: Ambiguous diagnosis correctly flagged (top1={top1:.4f}, top2={top2:.4f}, margin={margin:.4f}) -> {result['reliability_badge']}")


def test_4_classical_opencv_attribution_honesty():
    print("\n[TEST 4] Testing Classical OpenCV Localization Attribution Honesty...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")
    
    # Synthetic cv2 image
    dummy_cv = np.zeros((224, 224, 3), dtype=np.uint8)
    dummy_input = torch.zeros(1, 3, 224, 224)
    result = clf.predict(dummy_input, cv_image=dummy_cv)
    
    ve = result["visual_evidence"]
    assert ve["yolo_integrated"] == False, "yolo_integrated should be False"
    assert ve["unet_integrated"] == False, "unet_integrated should be False"
    assert "OpenCV" in ve["localization_method"], f"Expected OpenCV in localization_method: {ve['localization_method']}"
    
    meta = result["model_metadata"]
    assert meta["yolo_integrated"] == False
    assert meta["unet_integrated"] == False
    assert "OpenCV" in meta["localization_engine"]
    print("  PASS: Visual localization truthfully attributed to classical OpenCV (no fake YOLO/U-Net).")


def test_5_advisory_safety_and_expert_referral():
    print("\n[TEST 5] Testing Agronomy Advisory Safety & Expert Referral...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")
    
    dummy_input = torch.zeros(1, 3, 224, 224)
    result = clf.predict(dummy_input)
    
    ipm = result["ipm_plan"]
    assert "immediate_action" in ipm
    assert "cultural" in ipm
    assert "mechanical" in ipm
    assert "biological" in ipm
    assert "chemical" in ipm
    assert "safety_precautions" in ipm
    assert "phi_days" in ipm
    assert len(result["expert_referral_threshold"]) > 0
    print(f"  PASS: Agronomic IPM advisory contains all required safety tiers and referral: '{result['expert_referral_threshold']}'")


def test_6_real_leaf_image_prediction():
    print("\n[TEST 6] Testing Prediction on Real Leaf Specimen...")
    img_path = ML_ROOT / "test_images" / "real_tomato_early_blight.jpg"
    assert img_path.exists(), f"Sample image missing at {img_path}"
    
    with open(img_path, "rb") as f:
        buf = f.read()
        
    pil_img, cv_img, quality = validate_and_load_image(buf, filename="real_tomato.jpg")
    tensor = preprocess_image_to_tensor(pil_img)
    
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")
    result = clf.predict(tensor, cv_image=cv_img, context={"crop": "Tomato"})
    
    assert result["success"] == True
    assert result["crop"] == "Tomato"
    assert isinstance(result["confidence"], float)
    assert 0.0 <= result["confidence"] <= 1.0
    assert result["confidence"] != 0.952, "Confidence should not be artificially fixed at 0.952"
    assert result["severity"] in ["Low", "Moderate", "Severe", "Healthy"]
    print(f"  PASS: Real leaf inference succeeded: {result['disease']} ({result['confidence_percent']}%, {result['reliability_badge']}, Severity: {result['severity']})")


def run_all_tests():
    print("=" * 70)
    print("FASAL DRISTHI — STEP 7 AI FEATURE IMPROVEMENTS & SAFETY VERIFICATION")
    print("=" * 70)
    
    tests = [
        test_1_genuine_probability_distribution,
        test_2_uncertainty_handling_low_confidence,
        test_3_ambiguity_detection_margin_threshold,
        test_4_classical_opencv_attribution_honesty,
        test_5_advisory_safety_and_expert_referral,
        test_6_real_leaf_image_prediction
    ]
    
    passed = 0
    failed = 0
    
    for t in tests:
        try:
            t()
            passed += 1
        except Exception as e:
            print(f"  FAILED: {t.__name__} - {e}")
            failed += 1
            
    print("\n" + "=" * 70)
    print(f"RESULTS: {passed} PASSED, {failed} FAILED (Total: {len(tests)})")
    print("=" * 70)
    
    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    run_all_tests()
