import io
import cv2
import numpy as np
from PIL import Image
from app.preprocessing import validate_and_load_image, preprocess_image_to_tensor, ImageValidationError
from app.model import get_classifier

classifier = get_classifier()

def test_valid_image():
    # Natural field background
    img = np.full((300, 300, 3), (120, 130, 110), dtype=np.uint8)
    # Green leaf with texture & veins
    cv2.ellipse(img, (150, 150), (100, 70), 30, 0, 360, (35, 175, 50), -1)
    # Main leaf vein
    cv2.line(img, (60, 100), (240, 200), (20, 120, 30), 2)
    for i in range(5):
        cv2.line(img, (80 + i*30, 110 + i*18), (70 + i*30, 150 + i*15), (25, 130, 35), 1)
        cv2.line(img, (80 + i*30, 110 + i*18), (100 + i*30, 90 + i*15), (25, 130, 35), 1)
    # Sharp necrotic spots with halo
    cv2.circle(img, (130, 140), 16, (15, 75, 160), -1)
    cv2.circle(img, (130, 140), 8, (5, 25, 60), -1)
    cv2.circle(img, (175, 160), 12, (15, 75, 160), -1)
    
    _, buf = cv2.imencode('.jpg', img)
    pil_img, cv_img, quality = validate_and_load_image(buf.tobytes())
    tensor = preprocess_image_to_tensor(pil_img)
    result = classifier.predict(tensor, cv_image=cv_img)
    
    print("=== VALID IMAGE TEST PASSED ===")
    print("Crop:", result["crop"])
    print("Disease:", result["disease"])
    print("Confidence:", result["confidence_percent"], "%")
    print("Severity:", result["severity"], f"({result['affected_area_percent']}% affected area)")
    print("Lesions detected:", result["visual_evidence"]["lesion_count"])
    print("Annotated image URL prefix:", result["visual_evidence"]["annotated_image_url"][:40])
    print("IPM Chemical:", result["ipm_plan"]["chemical"][:50])

def test_non_plant():
    # Blank blue background without any plant foliage
    img = np.full((300, 300, 3), (220, 100, 20), dtype=np.uint8) # Blue
    _, buf = cv2.imencode('.jpg', img)
    try:
        validate_and_load_image(buf.tobytes())
        print("FAIL: Non-plant was not rejected")
    except ImageValidationError as e:
        print("=== NON-PLANT REJECTION TEST PASSED ===")
        print("Caught expected rejection:", e.message)

def test_blurry_image():
    # Heavily blurred image
    img = np.full((300, 300, 3), (120, 130, 110), dtype=np.uint8)
    cv2.ellipse(img, (150, 150), (100, 70), 30, 0, 360, (35, 175, 50), -1)
    img = cv2.GaussianBlur(img, (71, 71), 0)
    _, buf = cv2.imencode('.jpg', img)
    try:
        validate_and_load_image(buf.tobytes())
        print("FAIL: Blurry image was not rejected")
    except ImageValidationError as e:
        print("=== BLURRY REJECTION TEST PASSED ===")
        print("Caught expected rejection:", e.message)

if __name__ == "__main__":
    test_valid_image()
    test_non_plant()
    test_blurry_image()
