import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
DEFAULT_MODEL_PATH = MODELS_DIR / "plant_disease_model.pth"
MODEL_WEIGHTS_PATH = os.getenv("MODEL_PATH", str(DEFAULT_MODEL_PATH))
CLASS_INDICES_PATH = str(MODELS_DIR / "class_indices.json")

# Service Info — CropSentinel AI Vision
MODEL_NAME = os.getenv("MODEL_NAME", "CropSentinel-Vision")
MODEL_ARCHITECTURE = "MobileNetV2-MultiCropDisease38"
MODEL_VERSION = os.getenv("MODEL_VERSION", "2.4.0")
NUM_CLASSES = 38
DEVICE = os.getenv("AI_DEVICE", "cpu")

# Confidence Thresholds (configurable via environment)
HIGH_CONFIDENCE_THRESHOLD = float(os.getenv("AI_HIGH_CONFIDENCE", "0.85"))
MEDIUM_CONFIDENCE_THRESHOLD = float(os.getenv("AI_MEDIUM_CONFIDENCE", "0.60"))
# Legacy alias used by model.py
CONFIDENCE_THRESHOLD = MEDIUM_CONFIDENCE_THRESHOLD

# Inference constraints
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
IMAGE_INPUT_SIZE = (224, 224)

# Normalization constants (ImageNet defaults)
NORM_MEAN = [0.485, 0.456, 0.406]
NORM_STD = [0.229, 0.224, 0.225]

# Server Settings
HOST = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
PORT = int(os.getenv("AI_SERVICE_PORT", "8000"))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
