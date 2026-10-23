# Krishi Sathi - Real AI Plant Disease Vision Microservice

FastAPI-powered Computer Vision inference microservice using PyTorch and MobileNetV2 architecture with 38 plant disease classes.

## Features
- **Real Image-Based Computer Vision**: Preprocessing (224x224 RGB, normalization) and forward pass neural network inference.
- **Genuine Confidence Probability**: Computed via Softmax output distributions.
- **Agronomy Knowledge Base**: Decoupled domain engine mapping genuine classifications to pathogen types, cultural actions, organic remedies, chemical remedies, and PHI.
- **Image Validation**: Full verification of image headers, MIME types, corruption checks, and file bounds.
- **Multiple Input Formats**: Accepts `multipart/form-data` image file uploads or remote URLs (e.g. Cloudinary).

## Quickstart

### 1. Setup Virtual Environment & Install Dependencies
```bash
# Windows
py -3.12 -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Download / Initialize Model Weights
```bash
python scripts/download_or_train_model.py
```

### 3. Run FastAPI Service
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

- `GET /health`: Health check and model readiness.
- `GET /classes`: List of 38 supported disease classes.
- `POST /predict`: Real inference on uploaded image file or URL.
- `POST /predict-url`: JSON `{ "image_url": "..." }` inference.

## Docker Setup
```bash
docker build -t krishi-sathi-ai-service .
docker run -p 8000:8000 krishi-sathi-ai-service
```
