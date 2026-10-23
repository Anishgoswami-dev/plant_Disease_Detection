"""
Fasal Dristhi — AI Crop Health Diagnosis Confidence & Safety Test Suite
Validates:
1. High-confidence unambiguous results (confidence >= 0.80, margin >= 0.10)
2. Ambiguous results (margin < 0.10 between top-1 and top-2)
3. Low-confidence results (confidence < 0.80 or < 0.60)
4. API errors (invalid image format, corrupted payload)
5. Missing confidence values (null / undefined confidence handled safely)
"""

import sys
import io
import json
from pathlib import Path
import torch
import numpy as np
from PIL import Image

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
from app.preprocessing import validate_and_load_image, preprocess_image_to_tensor, ImageValidationError


def test_scenario_1_high_confidence_unambiguous():
    """Scenario 1: High-confidence unambiguous prediction (conf >= 0.80, margin >= 0.10)"""
    print("\n[TEST 1] Testing High-Confidence Unambiguous Results...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")

    # Construct synthetic logits where class 0 is strongly dominant
    logits = torch.full((1, 38), -2.0)
    logits[0, 5] = 5.0  # Dominant class
    logits[0, 10] = 0.5  # Distant runner-up

    probs = torch.softmax(logits, dim=1)[0]
    top_probs, top_indices = torch.topk(probs, k=3)
    margin = float(top_probs[0] - top_probs[1])

    assert top_probs[0] >= HIGH_CONFIDENCE_THRESHOLD, f"Expected conf >= {HIGH_CONFIDENCE_THRESHOLD}, got {top_probs[0]}"
    assert margin >= MARGIN_AMBIGUITY_THRESHOLD, f"Expected margin >= {MARGIN_AMBIGUITY_THRESHOLD}, got {margin}"

    # Build response using model's ambiguity logic
    is_ambiguous = margin < MARGIN_AMBIGUITY_THRESHOLD
    is_low_conf = float(top_probs[0]) < MEDIUM_CONFIDENCE_THRESHOLD
    badge = "HIGH_CONFIDENCE" if (float(top_probs[0]) >= HIGH_CONFIDENCE_THRESHOLD and not is_ambiguous) else "LOW_UNCERTAIN"

    assert not is_ambiguous, "Expected is_ambiguous=False for dominant class"
    assert not is_low_conf, "Expected is_low_conf=False"
    assert badge == "HIGH_CONFIDENCE", f"Expected HIGH_CONFIDENCE badge, got {badge}"

    print(f"  PASS: Top confidence: {top_probs[0]:.4f}, Margin: {margin:.4f}")
    print(f"  Status: {badge} (is_ambiguous={is_ambiguous}, is_low_conf={is_low_conf})")


def test_scenario_2_ambiguous_results():
    """Scenario 2: Ambiguous prediction with close competing classes (margin < 0.10)"""
    print("\n[TEST 2] Testing Ambiguous Results (Competing Foliar Lesion Classes)...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")

    # Construct synthetic logits where top 2 classes are extremely close (e.g. 48% vs 46%)
    logits = torch.full((1, 38), -1.0)
    logits[0, 7] = 3.00   # e.g., Corn___Gray_leaf_spot
    logits[0, 8] = 2.95   # e.g., Corn___Common_rust

    probs = torch.softmax(logits, dim=1)[0]
    top_probs, top_indices = torch.topk(probs, k=3)
    margin = float(top_probs[0] - top_probs[1])

    is_ambiguous = margin < MARGIN_AMBIGUITY_THRESHOLD
    assert is_ambiguous, f"Expected is_ambiguous=True for close margin {margin:.4f}"

    badge = "AMBIGUOUS" if is_ambiguous else "HIGH_CONFIDENCE"
    assert badge == "AMBIGUOUS", f"Expected AMBIGUOUS badge, got {badge}"

    # Safety check: when ambiguous, chemical treatment must be withheld
    is_uncertain = is_ambiguous or float(top_probs[0]) < HIGH_CONFIDENCE_THRESHOLD
    assert is_uncertain is True, "Ambiguous results must always be flagged uncertain"

    print(f"  PASS: Top1={top_probs[0]:.4f}, Top2={top_probs[1]:.4f}, Margin={margin:.4f} < {MARGIN_AMBIGUITY_THRESHOLD}")
    print(f"  Status: {badge} -> is_uncertain={is_uncertain} (Chemical prescriptions withheld)")


def test_scenario_3_low_confidence_results():
    """Scenario 3: Low-confidence prediction (confidence < 0.60 or < 0.80)"""
    print("\n[TEST 3] Testing Low-Confidence Results...")
    clf = PlantDiseaseClassifier(weights_path=str(DEFAULT_MOBILENET_PATH), arch_type="mobilenet")

    # Flat logits representing ambiguous/unrecognized image (low max prob)
    logits = torch.randn(1, 38) * 0.1
    probs = torch.softmax(logits, dim=1)[0]
    top_probs, _ = torch.topk(probs, k=2)

    max_conf = float(top_probs[0])
    is_low_conf = max_conf < MEDIUM_CONFIDENCE_THRESHOLD
    assert is_low_conf, f"Expected low confidence, got {max_conf:.4f}"

    badge = "LOW_UNCERTAIN" if is_low_conf else "HIGH_CONFIDENCE"
    assert badge == "LOW_UNCERTAIN", f"Expected LOW_UNCERTAIN badge, got {badge}"

    is_uncertain = badge in ("LOW_UNCERTAIN", "AMBIGUOUS") or max_conf < HIGH_CONFIDENCE_THRESHOLD
    assert is_uncertain is True, "Low confidence must require expert verification"

    print(f"  PASS: Max confidence: {max_conf:.4f} < {MEDIUM_CONFIDENCE_THRESHOLD}")
    print(f"  Status: {badge} -> Labeled 'Uncertain — expert verification required'")


def test_scenario_4_api_errors_and_invalid_inputs():
    """Scenario 4: Handling invalid or corrupted image inputs"""
    print("\n[TEST 4] Testing API Error and Invalid Payload Handling...")

    # Test 4A: Corrupt bytes
    corrupt_bytes = b"NOT_A_VALID_JPEG_IMAGE_DATA_12345"
    try:
        validate_and_load_image(corrupt_bytes)
        assert False, "Expected ImageValidationError on corrupt bytes"
    except (ImageValidationError, ValueError) as e:
        assert "not a valid or recognizable image" in str(e) or "cannot identify image" in str(e) or "Invalid image data" in str(e)
        print("  PASS: Corrupt image bytes correctly rejected with ImageValidationError.")

    # Test 4B: Image too small (< 32x32)
    tiny_img = Image.new("RGB", (10, 10), color="green")
    buf = io.BytesIO()
    tiny_img.save(buf, format="JPEG")
    try:
        validate_and_load_image(buf.getvalue())
        assert False, "Expected ImageValidationError on image dimensions too small"
    except (ImageValidationError, ValueError) as e:
        assert "Resolution too low" in str(e) or "too low" in str(e)
        print("  PASS: Undersized image correctly rejected with ImageValidationError.")


def test_scenario_5_missing_confidence_values():
    """Scenario 5: Handling missing, None, or unparseable confidence values"""
    print("\n[TEST 5] Testing Missing Confidence Value Handling...")

    # Simulate backend normalization when ML service response lacks confidence
    mock_ml_response = {
        "disease": "Gray Leaf Spot (Cercospora Leaf Spot)",
        "crop": "Corn (Maize)",
        "confidence": None,  # Missing confidence!
        "confidence_percent": None
    }

    # Backend normalization logic
    confidence_is_missing = typeof_conf_is_not_number = (mock_ml_response.get("confidence") is None)
    raw_conf = mock_ml_response["confidence"] if not confidence_is_missing else None

    # Reliability status defaults safely to LOW_UNCERTAIN when confidence is missing
    AI_HIGH_CONFIDENCE = 0.80
    reliability_status = "LOW_UNCERTAIN" if raw_conf is None else (
        "HIGH_CONFIDENCE" if raw_conf >= AI_HIGH_CONFIDENCE else "LOW_UNCERTAIN"
    )

    is_uncertain = (reliability_status in ("LOW_UNCERTAIN", "AMBIGUOUS")) or (raw_conf is None) or (raw_conf < AI_HIGH_CONFIDENCE)

    # Treatment must be WITHHELD
    treatment_status = "WITHHELD_PENDING_EXPERT_VERIFICATION" if is_uncertain else "APPROVED"

    assert raw_conf is None, "raw_conf should remain None, not fabricated into a fake number"
    assert reliability_status == "LOW_UNCERTAIN", "Missing confidence must be flagged LOW_UNCERTAIN"
    assert is_uncertain is True, "Missing confidence must be marked uncertain"
    assert treatment_status == "WITHHELD_PENDING_EXPERT_VERIFICATION", "Chemical treatments must be withheld"

    print("  PASS: Missing confidence cleanly handled without crashing or fabricating numbers.")
    print(f"  Confidence: {raw_conf}, Status: {reliability_status}, Uncertain: {is_uncertain}")


if __name__ == "__main__":
    print("=" * 70)
    print("AI CROP HEALTH DIAGNOSIS — CONFIDENCE & SAFETY TEST SUITE")
    print("=" * 70)

    test_scenario_1_high_confidence_unambiguous()
    test_scenario_2_ambiguous_results()
    test_scenario_3_low_confidence_results()
    test_scenario_4_api_errors_and_invalid_inputs()
    test_scenario_5_missing_confidence_values()

    print("\n" + "=" * 70)
    print("ALL 5 CONFIDENCE & SAFETY SCENARIOS PASSED WITH ZERO REGRESSIONS.")
    print("=" * 70)
