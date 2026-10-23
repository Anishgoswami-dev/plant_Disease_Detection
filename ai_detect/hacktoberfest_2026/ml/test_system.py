import io
import json
import sys
import time
import requests
from PIL import Image, ImageDraw

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

AI_URL = "http://localhost:8000"
NODE_URL = "http://localhost:4000"

def create_sample_leaf_image(color=(34, 139, 34), spots=False, spot_color=(139, 69, 19)) -> bytes:
    """Generates a synthetic realistic leaf RGB test image with optional necrotic spots"""
    img = Image.new("RGB", (300, 300), color=(240, 245, 240))
    draw = ImageDraw.Draw(img)
    
    # Draw leaf shape
    draw.polygon([(150, 30), (240, 150), (200, 260), (150, 280), (100, 260), (60, 150)], fill=color)
    # Draw main vein
    draw.line([(150, 30), (150, 280)], fill=(20, 100, 20), width=3)
    
    if spots:
        # Concentric ring lesions characteristic of Early Blight
        draw.ellipse([(120, 100), (160, 140)], fill=spot_color, outline=(90, 40, 10), width=2)
        draw.ellipse([(130, 110), (150, 130)], fill=(70, 30, 10))
        draw.ellipse([(170, 180), (200, 210)], fill=spot_color)

    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def test_health():
    print("\n--- 1. Testing AI Microservice Health Endpoint ---")
    try:
        res = requests.get(f"{AI_URL}/health", timeout=5)
        print(f"Status Code: {res.status_code}")
        print(f"Response: {json.dumps(res.json(), indent=2)}")
        assert res.status_code == 200, "Health check failed"
        assert res.json().get("model_loaded") is True, "Model is not loaded"
        print("[PASS] Health Check Passed!")
    except Exception as e:
        print(f"[FAIL] Health Check Error: {e}")
        return False
    return True

def test_classes():
    print("\n--- 2. Testing Classes Endpoint ---")
    try:
        res = requests.get(f"{AI_URL}/classes", timeout=5)
        data = res.json()
        print(f"Status Code: {res.status_code}")
        print(f"Total Supported Classes: {data.get('count')}")
        assert data.get("count") == 38, f"Expected 38 classes, got {data.get('count')}"
        print("[PASS] Classes Endpoint Passed!")
    except Exception as e:
        print(f"[FAIL] Classes Endpoint Error: {e}")
        return False
    return True

def test_ai_direct_inference():
    print("\n--- 3. Testing Direct AI FastAPI Inference (/predict) ---")
    img_bytes = create_sample_leaf_image(spots=True)
    files = {"file": ("leaf_test.jpg", img_bytes, "image/jpeg")}
    
    try:
        start = time.time()
        res = requests.post(f"{AI_URL}/predict", files=files, timeout=10)
        elapsed = round((time.time() - start) * 1000, 2)
        print(f"Status Code: {res.status_code} (Roundtrip: {elapsed}ms)")
        data = res.json()
        print(f"Prediction Result: {json.dumps(data, indent=2)}")
        assert res.status_code == 200, "Prediction failed"
        assert data.get("success") is True, "Success flag is False"
        assert "confidence" in data and isinstance(data["confidence"], float), "Confidence missing"
        assert "top_k" in data and len(data["top_k"]) > 0, "Top-K missing"
        print("[PASS] Direct AI Inference Passed!")
    except Exception as e:
        print(f"[FAIL] Direct AI Inference Error: {e}")
        return False
    return True

def test_invalid_image_rejection():
    print("\n--- 4. Testing Invalid Image Rejection ---")
    files = {"file": ("bad.txt", b"This is not an image file content", "text/plain")}
    try:
        res = requests.post(f"{AI_URL}/predict", files=files, timeout=5)
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.text}")
        assert res.status_code in (400, 422), f"Expected 400/422 on bad file, got {res.status_code}"
        print("[PASS] Bad image correctly rejected with 400 Bad Request!")
    except Exception as e:
        print(f"[FAIL] Invalid image test error: {e}")
        return False
    return True

def test_node_pipeline():
    print("\n--- 5. Testing Node.js -> FastAPI Pipeline (/api/scans) ---")
    img_bytes = create_sample_leaf_image(spots=False)
    files = {"image": ("crop_scan.jpg", img_bytes, "image/jpeg")}
    data = {"crop": "Tomato", "field": "North Field Plot A"}

    try:
        start = time.time()
        res = requests.post(f"{NODE_URL}/api/scans", files=files, data=data, timeout=15)
        elapsed = round((time.time() - start) * 1000, 2)
        print(f"Status Code: {res.status_code} (Roundtrip: {elapsed}ms)")
        resp = res.json()
        print(f"Node.js API Response: {json.dumps(resp, indent=2)}")
        assert res.status_code == 200, "Node.js /api/scans failed"
        assert resp.get("success") is True, "Success flag missing"
        assert "confidence" in resp, "Confidence missing"
        assert "modelName" in resp, "Model name metadata missing"
        print("[PASS] Full Node.js -> FastAPI -> Real Model Pipeline Passed!")
    except Exception as e:
        print(f"[FAIL] Node.js Pipeline Error: {e}")
        return False
    return True

def main():
    print("=" * 60)
    print("Krishi Sathi Real AI Inference Verification Suite")
    print("=" * 60)
    
    t1 = test_health()
    t2 = test_classes()
    t3 = test_ai_direct_inference()
    t4 = test_invalid_image_rejection()
    t5 = test_node_pipeline()
    
    all_passed = all([t1, t2, t3, t4, t5])
    print("\n" + "=" * 60)
    if all_passed:
        print("[SUCCESS] ALL TESTS PASSED SUCCESSFULLY! REAL AI IS FULLY OPERATIONAL!")
    else:
        print("[WARN] Some tests failed. Check logs above.")
    print("=" * 60)

if __name__ == "__main__":
    main()
