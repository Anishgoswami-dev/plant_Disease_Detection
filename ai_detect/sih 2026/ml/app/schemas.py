from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PredictUrlRequest(BaseModel):
    image_url: str = Field(..., description="Accessible HTTP/HTTPS URL of the crop image (e.g. Cloudinary)")

class PredictionClassResult(BaseModel):
    class_id: int
    raw_label: str
    crop: str
    disease: str
    is_healthy: bool
    confidence: float

class AgronomyDetails(BaseModel):
    severity: str
    pathogen: str
    actions: List[str]
    organic_remedy: str
    chemical_remedy: str
    phi_days: int

class ModelMetadata(BaseModel):
    name: str
    version: str
    architecture: str
    classes_count: int

class ExpertReferral(BaseModel):
    required: bool = False
    reason: str = ""
    suggested_actions: List[str] = []

class PredictionResponse(BaseModel):
    success: bool
    crop: str
    disease: str
    confidence: float
    is_healthy: bool
    raw_label: str
    severity: str
    pathogen: str
    actions: List[str]
    organic_remedy: str
    chemical_remedy: str
    phi_days: int
    top_k: List[PredictionClassResult]
    model: ModelMetadata
    inference_time_ms: float
    # OOD & Calibration fields (v2.5.0)
    prediction_tier: Optional[str] = None
    entropy: Optional[float] = None
    margin: Optional[float] = None
    energy_score: Optional[float] = None
    ood_flag: Optional[bool] = None
    treatment_suppressed: Optional[bool] = None
    expert_referral: Optional[ExpertReferral] = None

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str
    model_version: str
    architecture: str
    device: str
    num_classes: int
    weights_path: str

