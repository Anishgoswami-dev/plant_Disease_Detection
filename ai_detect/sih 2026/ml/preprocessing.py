import io
import cv2
import numpy as np
from PIL import Image, UnidentifiedImageError
import requests
import torch
from torchvision import transforms
from typing import Tuple, Dict, Any, Optional

from app.config import (
    IMAGE_INPUT_SIZE,
    MAX_IMAGE_SIZE_BYTES,
    NORM_MEAN,
    NORM_STD,
    ALLOWED_EXTENSIONS
)

# Standard computer vision inference transform pipeline for 224x224 input models
inference_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(IMAGE_INPUT_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=NORM_MEAN, std=NORM_STD)
])

class ImageValidationError(Exception):
    """Custom exception raised when image verification fails"""
    def __init__(self, message: str, status_code: int = 400, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}

def analyze_image_quality(cv_image: np.ndarray) -> Dict[str, Any]:
    """
    Performs real OpenCV computer vision quality and vegetation validation:
    1. Dimensions & aspect ratio check
    2. Blur detection via Laplacian variance
    3. Exposure & brightness check (underexposed vs overexposed)
    4. HSV vegetation analysis to ensure genuine plant/leaf presence
    5. Quality score estimation (0-100)
    """
    height, width = cv_image.shape[:2]
    
    # 1. Size check
    if width < 100 or height < 100:
        raise ImageValidationError(
            "Image resolution is too low for reliable diagnosis. Please upload an image of at least 200x200 pixels.",
            status_code=422,
            details={"width": width, "height": height, "error_type": "low_resolution"}
        )

    # Convert to grayscale for blur & exposure analysis
    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

    # 2. Blur detection via Laplacian variance
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    is_blurry = laplacian_var < 35.0

    # 3. Brightness / Exposure analysis
    mean_brightness = float(np.mean(gray))
    is_too_dark = mean_brightness < 30.0
    is_overexposed = mean_brightness > 235.0

    # 4. Color-space HSV vegetation & plant detection
    hsv = cv2.cvtColor(cv_image, cv2.COLOR_BGR2HSV)
    
    # Green plant foliage range: Hue 25-95
    lower_green = np.array([25, 30, 30], dtype=np.uint8)
    upper_green = np.array([95, 255, 255], dtype=np.uint8)
    mask_green = cv2.inRange(hsv, lower_green, upper_green)

    # Yellow / Brown / Chlorotic / Necrotic plant disease range: Hue 10-30
    lower_diseased = np.array([10, 40, 40], dtype=np.uint8)
    upper_diseased = np.array([30, 255, 255], dtype=np.uint8)
    mask_diseased = cv2.inRange(hsv, lower_diseased, upper_diseased)

    # Combined vegetation mask
    combined_veg_mask = cv2.bitwise_or(mask_green, mask_diseased)
    veg_pixel_count = int(np.count_nonzero(combined_veg_mask))
    total_pixels = height * width
    vegetation_ratio = float(veg_pixel_count / max(1, total_pixels))

    # Reject non-plant images (if vegetation/foliage is under 8% of frame)
    is_non_plant = vegetation_ratio < 0.08

    # Calculate overall image quality score (0 to 100)
    quality_score = 100.0
    if laplacian_var < 100:
        quality_score -= min(40, (100 - laplacian_var) * 0.4)
    if mean_brightness < 60:
        quality_score -= (60 - mean_brightness) * 0.5
    elif mean_brightness > 200:
        quality_score -= (mean_brightness - 200) * 0.5
    if is_non_plant:
        quality_score -= 50
    quality_score = max(5.0, min(100.0, quality_score))

    metrics = {
        "width": width,
        "height": height,
        "laplacian_blur_var": round(laplacian_var, 2),
        "mean_brightness": round(mean_brightness, 2),
        "vegetation_ratio": round(vegetation_ratio * 100, 2),
        "quality_score": round(quality_score, 1),
        "is_blurry": is_blurry,
        "is_too_dark": is_too_dark,
        "is_overexposed": is_overexposed,
        "is_non_plant": is_non_plant
    }

    # Strict Validation Rejections
    if is_non_plant:
        raise ImageValidationError(
            "No plant, leaf, or crop foliage detected in this image. Please upload a clear photo of an affected plant or leaf.",
            status_code=422,
            details=metrics
        )

    if is_too_dark:
        raise ImageValidationError(
            "Image is too dark for accurate symptom diagnosis. Please capture the leaf in adequate natural lighting.",
            status_code=422,
            details=metrics
        )

    if is_overexposed:
        raise ImageValidationError(
            "Image is overexposed / washed out with harsh glare. Please shield the leaf or take a photo under diffuse light.",
            status_code=422,
            details=metrics
        )

    if is_blurry:
        raise ImageValidationError(
            "Image is too blurry for reliable disease diagnosis. Please tap to focus and take a steady close-up of the leaf.",
            status_code=422,
            details=metrics
        )

    return metrics

def enhance_image_clahe(cv_image: np.ndarray) -> np.ndarray:
    """
    Applies Contrast Limited Adaptive Histogram Equalization (CLAHE) in LAB color space
    to enhance subtle foliar lesions and fungal spot details without color distortion.
    """
    lab = cv2.cvtColor(cv_image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_l = clahe.apply(l)
    enhanced_lab = cv2.merge((enhanced_l, a, b))
    enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    return enhanced_bgr

def validate_and_load_image(
    image_bytes: bytes,
    filename: str = "image.jpg"
) -> Tuple[Image.Image, np.ndarray, Dict[str, Any]]:
    """
    Validates raw byte buffer, opens it as an RGB PIL Image and an OpenCV BGR ndarray,
    and runs full computer vision quality checks.
    """
    if not image_bytes:
        raise ImageValidationError("Empty image payload received.")

    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise ImageValidationError(
            f"Image exceeds maximum allowable size of {MAX_IMAGE_SIZE_BYTES / (1024 * 1024):.1f}MB."
        )

    # Validate image bytes integrity with PIL
    try:
        image_stream = io.BytesIO(image_bytes)
        pil_img = Image.open(image_stream)
        pil_img.verify()
    except UnidentifiedImageError:
        raise ImageValidationError("Uploaded file is not a valid or recognizable image format.")
    except Exception as e:
        raise ImageValidationError(f"Corrupt image file or unsupported image stream: {str(e)}")

    image_stream.seek(0)
    pil_img = Image.open(image_stream)

    if pil_img.mode != "RGB":
        pil_img = pil_img.convert("RGB")

    # Convert PIL Image to OpenCV BGR numpy array
    np_arr = np.frombuffer(image_bytes, np.uint8)
    cv_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if cv_img is None:
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

    # Perform OpenCV Image Quality & Plant Validation
    quality_metrics = analyze_image_quality(cv_img)

    return pil_img, cv_img, quality_metrics

def fetch_image_from_url(url: str, timeout_sec: int = 10) -> Tuple[Image.Image, np.ndarray, Dict[str, Any]]:
    """
    Fetches an image from an external HTTP/HTTPS URL (e.g. Cloudinary) and validates it.
    """
    if not url or not (url.startswith("http://") or url.startswith("https://")):
        raise ImageValidationError("Invalid or missing image URL protocol.")

    try:
        headers = {"User-Agent": "KrishiSathi-AI-Service/1.0"}
        response = requests.get(url, headers=headers, timeout=timeout_sec, stream=True)
        response.raise_for_status()
        
        content = response.content
        if len(content) > MAX_IMAGE_SIZE_BYTES:
            raise ImageValidationError("Image at URL exceeds maximum size limit.")
            
        return validate_and_load_image(content, filename=url)
    except requests.exceptions.Timeout:
        raise ImageValidationError("Connection timed out while fetching image from URL.", status_code=504)
    except requests.exceptions.RequestException as e:
        raise ImageValidationError(f"Failed to retrieve image from provided URL: {str(e)}", status_code=400)

def preprocess_image_to_tensor(image: Image.Image) -> torch.Tensor:
    """
    Converts a valid RGB PIL image to normalized tensor shaped [1, 3, 224, 224] for PyTorch inference.
    """
    tensor = inference_transform(image)
    tensor = tensor.unsqueeze(0)
    return tensor
