# Contributing to Fasal Dristhi (CropSentinel)

Thank you for your interest in contributing to **Fasal Dristhi**! This project provides an AI-powered agro-advisory and foliar plant disease diagnostic platform. We welcome contributions from developers, agronomists, data scientists, and agricultural extension researchers.

---

## 1. Project Architecture & Repository Layout

The repository root is `D:\Plant_Disease_Detection`. The application microservices reside in `ai_detect/sih 2026/`:

- **`ml/`**: Python / FastAPI Computer Vision Microservice (PyTorch inference, OpenCV foliar lesion localization, agronomic IPM engine).
- **`backend/`**: Node.js / Express REST API Gateway (JWT authentication, scan routing, offline in-memory store fallback).
- **`frontend/`**: React + Vite farmer-facing interface (diagnostic modal, prescription sheet, risk forecasting).

---

## 2. Development Setup

### Prerequisites
- **Node.js** 18.x or later and `npm`
- **Python** 3.10 to 3.12 with `pip`
- Git (when version control is enabled)

### Local Environment Configuration
Copy the provided `.env.example` templates to `.env` files in each service directory:
```powershell
# In repository root:
Copy-Item "ai_detect\sih 2026\.env.example" "ai_detect\sih 2026\.env"
Copy-Item "ai_detect\sih 2026\ml\.env.example" "ai_detect\sih 2026\ml\.env"
Copy-Item "ai_detect\sih 2026\frontend\.env.example" "ai_detect\sih 2026\frontend\.env"
```

> **Security Rule:** Never commit active `.env` files, API keys, database credentials, or tokens. The root `.gitignore` enforces exclusion of local `.env` files.

---

## 3. Running Services Locally (Windows PowerShell)

Open three separate terminals:

### Terminal 1: ML Microservice (FastAPI, Port 8000)
```powershell
cd "ai_detect\sih 2026\ml"
.\venv\Scripts\activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Terminal 2: Backend API Gateway (Express, Port 4000)
```powershell
cd "ai_detect\sih 2026\backend"
npm start
```

### Terminal 3: Frontend Web Application (Vite, Port 5173)
```powershell
cd "ai_detect\sih 2026\frontend"
npm run dev
```

---

## 4. Testing & Quality Verification

Before submitting any contribution, run the automated test suites to ensure zero regressions:

```powershell
cd "ai_detect\sih 2026\ml"
.\venv\Scripts\activate

# 1. AI Feature Improvements & Reliability Test Suite (6 tests)
python test_step7_ai_features.py

# 2. Model Loading & Temperature Calibration Test Suite (5 tests)
python test_step4_model_confidence.py
```

To validate the frontend build:
```powershell
cd "ai_detect\sih 2026\frontend"
npm run build
```

---

## 5. Core AI & Agricultural Contribution Guidelines

All contributors must adhere strictly to the following principles:

1. **No Artificial Confidence Inflation:** Never hardcode confidence overrides (e.g. forcing output to ~95%) or alter Softmax distributions. Predictions must represent genuine mathematical model outputs.
2. **Transparent Uncertainty Handling:** Predictions below the confidence threshold ($< 0.60$) or with narrow margins between top candidates ($< 0.15$) must be transparently tagged as `LOW_UNCERTAIN` or `AMBIGUOUS`.
3. **Honest Computer Vision Attribution:** Lesion contour detection and severity calculations are performed by classical OpenCV morphology. Do not attribute classical contours to deep learning object detection (YOLO) or pixel segmentation (U-Net) unless an actual trained model and verified weights are added.
4. **Evidence-Based Agricultural Advisory:** Do not invent pesticide names, chemical formulations, or dosage recommendations. Chemical advice must be grounded in verified regulatory guidelines (e.g., CIB&RC / ICAR protocols) with appropriate Pre-Harvest Intervals (PHI). When uncertainty exists, always instruct farmers to seek physical verification from an agricultural extension officer.

---

## 6. Pull Request Process

1. Fork the repository and create a feature branch (`feature/your-feature-name` or `bugfix/issue-description`).
2. Implement your changes, ensuring code is formatted and clean.
3. Verify that all automated tests pass.
4. Update relevant documentation in `README.md` if adding or modifying features.
5. Submit a Pull Request through GitHub with a clear description of the problem solved, methodology, and test results.
6. Communication and reviews are conducted via repository Pull Request comments and GitHub Discussions.
