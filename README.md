# Fasal Dristhi (CropSentinel)

An intelligent, calibrated agro-advisory and plant disease diagnostic system. Fasal Dristhi combines deep-learning computer vision for foliar disease classification, classical computer vision for lesion localization and severity quantification, and an agronomy knowledge base providing contextual management recommendations.

---

## 1. Project Overview & Architecture

The repository root is `D:\Plant_Disease_Detection`. The application microservices are located inside `ai_detect/sih 2026/`.

```
D:\Plant_Disease_Detection\
├── .gitignore                          # Root Git exclusion rules
├── README.md                           # Master repository documentation
└── ai_detect/
    └── sih 2026/                       # Application root
        ├── .env.example                # Shared environment configuration template
        ├── backend/                    # Node.js / Express REST API gateway
        │   ├── index.js                # Core API, JWT auth, scan processing & fallbacks
        │   ├── package.json            # Backend dependency manifest
        │   └── .env.example            # Backend-specific environment template
        ├── frontend/                   # React + Vite agricultural user interface
        │   ├── src/                    # UI components, dashboard, scout tools
        │   ├── package.json            # Frontend dependency manifest
        │   └── .env.example            # Frontend environment template (VITE_API_URL)
        └── ml/                         # Python / FastAPI ML inference microservice
            ├── app/
            │   ├── main.py             # FastAPI entry point & endpoints (/health, /predict)
            │   ├── model.py            # PyTorch dual-architecture loader & temperature scaling
            │   ├── config.py           # ML configuration settings & defaults
            │   ├── detection.py        # Classical OpenCV lesion contour localization
            │   ├── severity.py         # Tissue damage percentage quantification
            │   └── preprocessing.py    # Image validation, MIME checks & normalization
            ├── models/                 # Model checkpoints & calibration parameters
            │   ├── class_indices.json  # 38-class index-to-label mapping
            │   └── temperature_T.json  # Calibrated temperature scaling parameter (T=0.71392)
            ├── requirements.txt        # ML microservice dependencies
            └── .env.example            # ML microservice environment template
```

### Microservice Interaction

```
[ Frontend (Port 5173) ]
       │
       ▼ (HTTP / Multipart / JWT)
[ Backend Gateway (Port 4000) ] ── (Fallback: In-Memory Store if MongoDB Offline)
       │
       ▼ (HTTP / Multipart)
[ ML Inference Service (Port 8000) ]
       ├── Classification: PyTorch (EfficientNet-B0 / MobileNetV2)
       ├── Temperature Calibration: T = 0.71392
       ├── Lesion Contouring: Classical OpenCV HSV morphology
       └── Agronomy Recommendations: Decoupled Knowledge Base
```

---

## 2. Supported 38 Plant Disease Classes

The model classifies 38 distinct crop-disease combinations across 14 agricultural crops:

| Crop | Classes Supported |
| :--- | :--- |
| **Apple** | Apple Scab, Black Rot, Cedar Apple Rust, Healthy |
| **Blueberry** | Healthy |
| **Cherry** | Powdery Mildew, Healthy |
| **Corn (Maize)** | Cercospora Leaf Spot / Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| **Grape** | Black Rot, Esca (Black Measles), Leaf Blight (Isariopsis Leaf Spot), Healthy |
| **Orange** | Huanglongbing (Citrus Greening) |
| **Peach** | Bacterial Spot, Healthy |
| **Pepper (Bell)** | Bacterial Spot, Healthy |
| **Potato** | Early Blight, Late Blight, Healthy |
| **Raspberry** | Healthy |
| **Soybean** | Healthy |
| **Squash** | Powdery Mildew |
| **Strawberry** | Leaf Scorch, Healthy |
| **Tomato** | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites (Two-Spotted), Target Spot, Tomato Yellow Leaf Curl Virus, Tomato Mosaic Virus, Healthy |

---

## 3. Machine Learning Capabilities & Scientific Limitations

### Dual Architecture Support
- **Baseline Default Checkpoint:** `plant_disease_model.pth`
  - Architecture: `MobileNetV2` (38 classes)
  - Top-1 Accuracy: **53.94%** on a 10,547-image test partition
  - Calibration: Uncalibrated ($T = 1.0$)
- **Candidate Checkpoint:** `plant_disease_candidate_efficientnet.pth`
  - Architecture: `EfficientNet-B0` (38 classes)
  - Top-1 Accuracy: **93.14%** on an offline held-out test partition of 10,547 images
  - Calibration: Temperature Scaled with $T = 0.71392$ documented in `models/temperature_T.json`
  - Activation: Set `MODEL_ARCH=efficientnet` in `ml/.env` or rely on the automatic checkpoint tensor inspection in `app/model.py`.

### Critical Evaluation Caveat
> **Important:** The 93.14% top-1 accuracy for EfficientNet-B0 was measured strictly on an offline held-out test split under controlled isolate conditions. It does not guarantee 93.14% field accuracy under unconstrained agricultural conditions (e.g., non-foliar backgrounds, severe motion blur, adverse lighting, or multi-pathogen co-infections).

### Genuine Confidence Calibration
- All artificial confidence overrides (which previously forced predictions to ~95%) have been eliminated from both the ML inference pipeline and the Node.js backend.
- Prediction scores reflect mathematically genuine Softmax distributions scaled by temperature $T$:
  $$\hat{p}_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$$
- Safety badges are dynamically assigned:
  - `HIGH_CONFIDENCE`: Top probability $\ge 0.80$ with clear class margin.
  - `MEDIUM_CONFIDENCE`: Top probability between $0.60$ and $0.79$.
  - `LOW_UNCERTAIN`: Top probability $< 0.60$.
  - `AMBIGUOUS`: Margin between top-1 and top-2 probabilities $< 0.15$.

### Visual Lesion Localization & Severity
- Lesion bounding boxes, contours, and damaged tissue percentages are calculated via **classical OpenCV image processing** (HSV color thresholding, green leaf masking, and morphological contour detection in `detection.py` and `severity.py`).
- **No deep learning detection (YOLO) or pixel segmentation (U-Net) models are deployed.** The repository maintains transparent annotation status tracking (`REAL_ANNOTATION_STATUS_REPORT.md` and `DATASET_PROGRESS_TEMPLATE.csv`), where manual bounding box annotations are marked as pending.

### Resilient Storage Architecture
- **Database:** Connects to MongoDB Atlas when `MONGODB_URI` is configured. If unreachable, the backend switches automatically to a volatile in-memory store so testing and demonstrations remain functional.
- **Media:** Supports Cloudinary when credentials are provided, with fallback to local temporary image processing.

---

## 4. Local Setup & Execution Guide (Windows PowerShell)

### Prerequisites
- **Node.js** 18.x or later and `npm`
- **Python** 3.10 to 3.12 with `pip`
- Git (optional; Git is not initialized by default)

### Step 1: Environment Configuration
Copy the provided `.env.example` templates to local `.env` files in each service directory. Never commit `.env` files containing active secrets.

Open PowerShell in `D:\Plant_Disease_Detection`:

```powershell
# Backend & application root configuration
Copy-Item "ai_detect\sih 2026\.env.example" "ai_detect\sih 2026\.env"

# ML microservice configuration
Copy-Item "ai_detect\sih 2026\ml\.env.example" "ai_detect\sih 2026\ml\.env"

# Frontend configuration
Copy-Item "ai_detect\sih 2026\frontend\.env.example" "ai_detect\sih 2026\frontend\.env"
```

Configure `ai_detect\sih 2026\ml\.env` to choose your model architecture:
```ini
MODEL_ARCH=efficientnet
MODEL_PATH=models/plant_disease_candidate_efficientnet.pth
TEMPERATURE_PATH=models/temperature_T.json
CONFIDENCE_THRESHOLD=0.60
```

### Step 2: Three-Terminal Startup

Run each service in a separate PowerShell window:

#### Terminal 1 — ML Inference Microservice (Port 8000)
```powershell
cd "D:\Plant_Disease_Detection\ai_detect\sih 2026\ml"
.\venv\Scripts\activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Health verification:* Open `http://127.0.0.1:8000/health` (returns `{"status": "healthy", "model_loaded": true}`).

#### Terminal 2 — Backend API Gateway (Port 4000)
```powershell
cd "D:\Plant_Disease_Detection\ai_detect\sih 2026\backend"
npm start
```
*Health verification:* Terminal logs `Server listening on port 4000`.

#### Terminal 3 — Frontend Web Application (Port 5173)
```powershell
cd "D:\Plant_Disease_Detection\ai_detect\sih 2026\frontend"
npm run dev
```
*Access application:* Open the Vite URL displayed (typically `http://localhost:5173`).

---

## 5. Dataset Acquisition & Reproduction

Due to size constraints and open-source licensing, raw dataset images are excluded from version control via `.gitignore`.

### Dataset Requirements
- **Benchmark Source:** PlantVillage public crop disease dataset (54,306 images across 38 classes).
- **Directory Layout for Training/Evaluation:**
  ```
  ai_detect/sih 2026/ml/datasets/
  └── plantvillage_isolated/
      ├── train/
      ├── val/
      └── test/
  ```
- **Validation Pipeline:**
  To verify split integrity without data leakage, run:
  ```powershell
  cd "D:\Plant_Disease_Detection\ai_detect\sih 2026\ml"
  .\venv\Scripts\activate
  python scripts/validate_data_pipeline.py
  ```

---

## 6. Automated Testing & Verification

The repository includes standalone validation scripts to verify system health without manual UI interaction:

```powershell
cd "D:\Plant_Disease_Detection\ai_detect\sih 2026\ml"
.\venv\Scripts\activate

# 1. Model architecture, loading, and temperature scaling test
python test_step4_model_confidence.py

# 2. End-to-end integration test (JWT auth, valid scan, error handling)
# Requires ML (port 8000) and Backend (port 4000) to be running
python test_step3_integration.py
```

---

## 7. GitHub Readiness & Security Policy

### Root `.gitignore` Enforcement
The repository root `.gitignore` enforces exclusion of:
- All active environment files (`.env`, `**/.env`, `*.local`).
- Package manager dependencies (`node_modules/`, `**/node_modules/`).
- Python virtual environments (`venv/`, `.venv/`, `__pycache__/`).
- Large raw datasets and cache indices (`**/ml/datasets/`, `**/ml/test_data/`, `tree_cache.json`).
- Heavy model binary files (`*.pth`, `*.pth*`, `*.safetensors`, `*.pt`, `*.bin`, `*.untrained_backup`).
- Build outputs and logs (`dist/`, `build/`, `*.log`).

### Preserved Files
- Configuration templates (`.env.example`, `ml/.env.example`, `frontend/.env.example`).
- Model calibration metadata (`ml/models/class_indices.json`, `ml/models/temperature_T.json`).
- Full source code, test suites, and documentation.
