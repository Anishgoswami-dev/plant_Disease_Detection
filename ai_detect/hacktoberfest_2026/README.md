# Fasal Dristhi — Application Subsystems (`ai_detect/hacktoberfest_2026/`)

This directory houses the three core subsystems of the **Fasal Dristhi (CropSentinel)** platform.

> For comprehensive documentation, system architecture, dataset requirements, and testing guides, please refer to the master [README.md](../../README.md) at the repository root.

---

## Subsystem Layout

1. **`ml/`** — Python / FastAPI Computer Vision Microservice (Port 8000)
   - Dual-architecture PyTorch model loader supporting **EfficientNet-B0** and **MobileNetV2**.
   - Neural temperature scaling ($T=0.085$) calibrated for high-confidence foliar infection identification (**93%–97%** confidence band) while rejecting non-foliar noise.
   - Clinical uncertainty protocol: strictly withholds chemical prescriptions on ambiguous scans and generates Krishi Vigyan Kendra (KVK) referral slips.
   - Classical OpenCV morphological contouring for lesion bounding box detection and severity quantification.
   - Comprehensive agronomy knowledge base mapping 38 plant disease classes to treatment recommendations.

2. **`backend/`** — Node.js / Express REST API Gateway (Port 4000)
   - Express server handling JWT authentication, multipart file uploads, and proxying scan requests to the ML microservice.
   - Resilient data layer: connects to MongoDB Atlas with DNS preloading, with automatic in-memory store fallback when offline.
   - **ElevenLabs Multilingual Text-to-Speech:** Server-side synthesis via `voiceService.js` (`POST /api/voice/tts`), streaming audio for Kisan AI Assistant with automatic browser fallback.
   - **Backboard.io Persistent AI Memory:** Assistant-level memory layer (`backboardService.js`) with per-farmer isolation, thread continuity, and fact extraction for Kisan AI Assistant.

3. **`frontend/`** — React / Vite Farmer User Interface (Port 5173)
   - Diagnostic workflow: scan upload, real-time bounding box visualization, disease identification, and advisory cards.
   - Kisan AI Assistant with voice advisory playback and audio lifecycle memory management.
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
