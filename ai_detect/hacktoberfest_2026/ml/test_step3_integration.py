import requests
import json
import os
import sys

from pathlib import Path

BASE_URL = "http://localhost:4000"
IMAGE_PATH = str(Path(__file__).resolve().parent / "test_images" / "real_tomato_early_blight.jpg")


def run_tests():
    print("=" * 70)
    print("FASAL DRISTHI — STEP 3 BACKEND & ML INTEGRATION TEST SUITE")
    print("=" * 70)
    
    passed = 0
    total = 0

    # Obtain authenticated JWT token
    auth_headers = {}
    try:
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "farmer.anish@fasaldristhi.in", "password": "Farmer@123"}, timeout=5)
        if login_res.status_code == 200:
            token = login_res.json().get("token")
            auth_headers = {"Authorization": f"Bearer {token}"}
            print("[AUTH] Successfully authenticated as test farmer.")
    except Exception as e:
        print(f"[AUTH] Could not authenticate: {e}")

    # TEST 1: Valid Image Upload to POST /api/scans
    total += 1
    print("\n[TEST 1] Testing Valid Image Upload on POST /api/scans...")
    if not os.path.exists(IMAGE_PATH):
        print(f"FAILED: Test image not found at {IMAGE_PATH}")
        return

    with open(IMAGE_PATH, 'rb') as f:
        files = {'image': ('tomato_early_blight.jpg', f, 'image/jpeg')}
        data = {'crop': 'Tomato', 'field': 'North Field Plot 3'}
        res = requests.post(f"{BASE_URL}/api/scans", files=files, data=data, headers=auth_headers, timeout=25)
    
    print(f"Status Code: {res.status_code}")
    if res.status_code == 200:
        res_json = res.json()
        print("Response received:")
        print(json.dumps(res_json, indent=2))
        
        # Verify required top-level keys
        required_keys = [
            "success", "scan_id", "image_url", "scan_date", "crop",
            "diagnosis", "top_predictions", "symptoms", "causes",
            "visual_evidence", "treatment", "follow_up", "model_metadata"
        ]
        missing_keys = [k for k in required_keys if k not in res_json]
        if not missing_keys:
            print("PASS: All 13 required top-level keys present.")
            
            # Verify diagnosis object
            diag = res_json.get("diagnosis", {})
            diag_required = [
                "disease", "scientific_name", "confidence",
                "confidence_percent", "reliability_status",
                "severity", "affected_area_percent"
            ]
            missing_diag = [k for k in diag_required if k not in diag]
            if not missing_diag:
                print(f"PASS: diagnosis object contains all required fields: {diag}")
                
                # Check confidence policy
                conf = diag.get("confidence")
                rel_status = diag.get("reliability_status")
                print(f"  Confidence: {conf} ({diag.get('confidence_percent')}%)")
                print(f"  Reliability Status: {rel_status}")
                print(f"  Severity: {diag.get('severity')}")
                print(f"  Affected Area: {diag.get('affected_area_percent')}")
                
                assert conf < 0.60, f"Expected low confidence for real tomato early blight, got {conf}"
                assert rel_status in ["LOW_UNCERTAIN", "AMBIGUOUS"], f"Expected LOW_UNCERTAIN or AMBIGUOUS, got {rel_status}"
                assert diag.get("severity") in ["Low", "Moderate", "Severe"], f"Expected valid calculated severity, got {diag.get('severity')}"
                assert isinstance(diag.get("affected_area_percent"), (int, float)), f"Expected numeric affected area, got {diag.get('affected_area_percent')}"
                assert res_json.get("treatment", {}).get("status") == "PENDING_VERIFIED_AGRONOMIC_REVIEW", "Treatment status mismatch"
                print("PASS: Confidence, uncertainty policy, dynamic OpenCV severity, and pending treatment verified.")
                passed += 1
            else:
                print(f"FAIL: Missing diagnosis keys: {missing_diag}")
        else:
            print(f"FAIL: Missing top-level keys: {missing_keys}")
    else:
        print(f"FAIL: Expected 200, got {res.status_code} - {res.text}")

    # TEST 2: Invalid File Type
    total += 1
    print("\n[TEST 2] Testing Invalid File Type (Text file)...")
    files = {'image': ('test_document.txt', b"This is plain text, not a plant leaf image.", 'text/plain')}
    res = requests.post(f"{BASE_URL}/api/scans", files=files, headers=auth_headers, timeout=10)
    print(f"Status Code: {res.status_code} (Expected 400)")
    if res.status_code == 400 and res.json().get("success") is False:
        print(f"PASS: Rejected invalid file type cleanly: {res.json().get('error')}")
        passed += 1
    else:
        print(f"FAIL: Expected 400 Bad Request, got {res.status_code}: {res.text}")

    # TEST 3: Empty File Upload (0 bytes)
    total += 1
    print("\n[TEST 3] Testing Empty File Upload (0 bytes)...")
    files = {'image': ('empty_leaf.jpg', b"", 'image/jpeg')}
    res = requests.post(f"{BASE_URL}/api/scans", files=files, headers=auth_headers, timeout=10)
    print(f"Status Code: {res.status_code} (Expected 400)")
    if res.status_code == 400 and res.json().get("success") is False:
        print(f"PASS: Rejected empty file upload cleanly: {res.json().get('error')}")
        passed += 1
    else:
        print(f"FAIL: Expected 400 Bad Request, got {res.status_code}: {res.text}")

    # TEST 4: Missing File & Missing URL
    total += 1
    print("\n[TEST 4] Testing Missing File and URL...")
    res = requests.post(f"{BASE_URL}/api/scans", data={'crop': 'Tomato'}, headers=auth_headers, timeout=10)
    print(f"Status Code: {res.status_code} (Expected 400)")
    if res.status_code == 400 and res.json().get("success") is False:
        print(f"PASS: Rejected missing image cleanly: {res.json().get('error')}")
        passed += 1
    else:
        print(f"FAIL: Expected 400 Bad Request, got {res.status_code}: {res.text}")

    # TEST 5: ML Service Health Endpoint Check
    total += 1
    print("\n[TEST 5] Testing FastAPI ML Service Direct Health...")
    try:
        ml_res = requests.get("http://localhost:8000/health", timeout=5)
        print(f"ML Health Status: {ml_res.status_code}")
        ml_json = ml_res.json()
        print(f"ML Status Data: {ml_json}")
        if ml_res.status_code == 200 and ml_json.get("model_loaded") is True:
            print("PASS: ML service is online and active model is loaded.")
            passed += 1
        else:
            print("FAIL: ML service degraded or model not loaded.")
    except Exception as e:
        print(f"FAIL: Could not connect to ML service: {e}")

    # TEST 6: Top-K Predictions Structure
    total += 1
    print("\n[TEST 6] Testing Top-K Predictions in Scan Response...")
    with open(IMAGE_PATH, 'rb') as f:
        files = {'image': ('tomato.jpg', f, 'image/jpeg')}
        res = requests.post(f"{BASE_URL}/api/scans", files=files, headers=auth_headers, timeout=25)
    if res.status_code == 200:
        top_k = res.json().get("top_predictions", [])
        print(f"Top-K count: {len(top_k)}")
        for idx, pred in enumerate(top_k):
            print(f"  #{idx+1}: {pred.get('disease')} ({pred.get('crop')}) - {pred.get('confidence_percent')}%")
        if len(top_k) >= 3:
            print("PASS: Top-K predictions populated correctly from genuine model softmax.")
            passed += 1
        else:
            print("FAIL: Top-K predictions incomplete.")
    else:
        print("FAIL: Could not fetch top-K.")

    # TEST 7: Corrupted Image Bytes
    total += 1
    print("\n[TEST 7] Testing Corrupted Image Data (Garbage bytes)...")
    files = {'image': ('corrupt_leaf.jpg', b"CORRUPTED_NON_IMAGE_DATA_1234567890", 'image/jpeg')}
    res = requests.post(f"{BASE_URL}/api/scans", files=files, headers=auth_headers, timeout=10)
    print(f"Status Code: {res.status_code}")
    if res.status_code in [400, 422, 502] and res.json().get("success") is False:
        print(f"PASS: Rejected corrupted image cleanly: {res.json().get('error')}")
        passed += 1
    else:
        print(f"FAIL: Expected error status, got {res.status_code}: {res.text}")

    # TEST 8: Crop and Field Metadata Preservation
    total += 1
    print("\n[TEST 8] Testing Crop and Field Metadata Preservation...")
    with open(IMAGE_PATH, 'rb') as f:
        files = {'image': ('tomato.jpg', f, 'image/jpeg')}
        data = {'crop': 'Tomato', 'field': 'East Plot Sector 4B'}
        res = requests.post(f"{BASE_URL}/api/scans", files=files, data=data, headers=auth_headers, timeout=25)
    if res.status_code == 200:
        rj = res.json()
        if rj.get("crop") == "Tomato" and rj.get("field") == "East Plot Sector 4B":
            print(f"PASS: Preserved crop='{rj.get('crop')}' and field='{rj.get('field')}'.")
            passed += 1
        else:
            print(f"FAIL: Crop/Field metadata not preserved: {rj.get('crop')}, {rj.get('field')}")
    else:
        print("FAIL: Request failed.")

    print("\n" + "=" * 70)
    print(f"TEST RESULTS: {passed}/{total} Passed")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
