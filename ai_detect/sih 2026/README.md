# Fasal Dristhi — Application Subsystems (`ai_detect/sih 2026/`)

This directory houses the three core subsystems of the **Fasal Dristhi (CropSentinel)** platform.

> For comprehensive documentation, system architecture, dataset requirements, and testing guides, please refer to the master [README.md](../../README.md) at the repository root.

---

## Subsystem Layout

1. **`ml/`** — Python / FastAPI Computer Vision Microservice (Port 8000)
   - Dual-architecture PyTorch model loader supporting **EfficientNet-B0** ($T=0.71392$, 93.14% offline test top-1 accuracy) and **MobileNetV2** (53.94% top-1 accuracy).
   - Classical OpenCV morphological contouring for lesion bounding box detection and severity quantification.
   - Comprehensive agronomy knowledge base mapping 38 plant disease classes to treatment recommendations.

2. **`backend/`** — Node.js / Express REST API Gateway (Port 4000)
   - Express server handling JWT authentication, multipart file uploads, and proxying scan requests to the ML microservice.
   - Resilient data layer: connects to MongoDB Atlas when configured, with automatic in-memory store fallback when offline.

3. **`frontend/`** — React / Vite Farmer User Interface (Port 5173)
   - Diagnostic workflow: scan upload, real-time bounding box visualization, disease identification, and advisory cards.
   - Integrated field tools: risk forecasting, guided scouting, fertilizer calculator, and community forum.

---

## Local Execution Commands (Windows PowerShell)

Run each subsystem in a separate terminal:

### Terminal 1 — ML Microservice
```powershell
cd ml
.\venv\Scripts\activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Terminal 2 — Backend API Gateway
```powershell
cd backend
npm start
```

### Terminal 3 — Frontend Web Application
```powershell
cd frontend
npm run dev
```

---

## Configuration & Environment Templates

Copy the example configuration files before running:
- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`
- `ml/.env.example` -> `ml/.env`

*Active `.env` files are excluded from Git tracking via the root `.gitignore`.*
