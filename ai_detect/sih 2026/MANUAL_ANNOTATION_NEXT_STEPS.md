# Fasal Dristhi — Manual Annotation Protocol & Next Steps

**Status:** Ready for Human Manual Annotation  
**Target Crop:** Tomato (*Solanum lycopersicum*)  
**Pilot Dataset Size:** 250 Images (Verified 100% Decodable, 0 Corrupt)  
**Current Annotation Completion:** **0.0% (0 / 250 Images Annotated)**  
**Training Readiness:** 🛑 **NOT READY FOR YOLO TRAINING**

> [!IMPORTANT]
> **Manual annotation must be performed by a human annotator.**
> Automatic bounding-box generation, pseudo-labeling from image classification tags, and synthetic annotations are strictly forbidden. The model requires genuine ground-truth spatial boundaries to learn accurate foliar localization.

---

## 1. Pilot Dataset Verification Summary

Before opening the manual annotation phase, an automated decodability check was performed across all 250 staged images:

- **Total Images Staged:** 250
- **Verified Decodable (PIL Header Check):** **250 / 250 (100%)**
- **Corrupt / Unreadable Images:** **0**
- **Images Missing Labels:** **250 / 250 (100%)**
- **Dataset Image Index:** Generated at [`ANNOTATION_IMAGE_INDEX.csv`](file:///d:/ai_detect/ANNOTATION_IMAGE_INDEX.csv)

### Class & Split Allocation

| Split | Early Blight | Late Blight | Bacterial Spot | Septoria Leaf Spot | Healthy (Control) | Total Images |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`train`** | 35 | 35 | 35 | 35 | 35 | **175** |
| **`val`** | 7 | 7 | 7 | 7 | 7 | **35** |
| **`test`** | 8 | 8 | 8 | 8 | 8 | **40** |
| **TOTAL** | **50** | **50** | **50** | **50** | **50** | **250** |

---

## 2. Annotation Task Checklist for CVAT / Roboflow

Follow this step-by-step checklist to perform manual annotation using either **CVAT** or **Roboflow**:

### Phase 1: Workspace & Project Setup
- [ ] **Step 1.1:** Sign in to CVAT (local or app.cvat.ai) or Roboflow (app.roboflow.com).
- [ ] **Step 1.2:** Create a new project named: `Fasal-Dristhi-Tomato-YOLO-Pilot`.
- [ ] **Step 1.3:** Configure the **4 Target Classes** with exact class IDs:
  - **`0`**: `early_blight` (Color recommendation: Red / Brown)
  - **`1`**: `late_blight` (Color recommendation: Dark Green / Purple)
  - **`2`**: `bacterial_spot` (Color recommendation: Orange)
  - **`3`**: `septoria_leaf_spot` (Color recommendation: Yellow / White)
  *(Note: Do NOT create a class for `healthy`. Healthy control images remain empty without boxes.)*

### Phase 2: Uploading Split Batches
- [ ] **Step 2.1:** Upload images in batches according to their split:
  - Task 1 (Train): Images from `sih 2026/ml/datasets/yolo_pilot/images/train/` (175 images)
  - Task 2 (Val): Images from `sih 2026/ml/datasets/yolo_pilot/images/val/` (35 images)
  - Task 3 (Test): Images from `sih 2026/ml/datasets/yolo_pilot/images/test/` (40 images)
- [ ] **Step 2.2:** Verify that all images upload without distortion or compression.

### Phase 3: Human Manual Annotation Protocol
- [ ] **Step 3.1: Bounding Box Tightness:**
  - Draw a tight bounding rectangle around each individual disease lesion.
  - Include both the dark necrotic lesion center **and** the immediate chlorotic yellow halo.
  - Exclude healthy green lamina beyond the halo boundary.
- [ ] **Step 3.2: Multiple Lesions on One Leaf:**
  - If a leaf has 10 distinct spots, draw 10 distinct bounding boxes.
  - Never draw one massive bounding box covering the whole leaf if lesions are spaced apart.
- [ ] **Step 3.3: Confluent Lesions / Dense Clusters:**
  - When lesions are so dense that individual boundaries cannot be distinguished (>5 touching lesions forming a continuous necrotic patch), draw a single bounding box around the contiguous necrotic area.
- [ ] **Step 3.4: Healthy Leaf Protocol (Critical):**
  - For the 50 control leaves (`source_class == 'healthy'`), **draw zero bounding boxes**.
  - On export, confirm that an **empty (0-byte) `.txt` file** exists for each healthy image.
  - *Why?* This explicitly trains YOLO to recognize healthy green tissue as background, drastically suppressing false-positive disease detections.
- [ ] **Step 3.5: Ambiguous Lesions:**
  - If a mark cannot be confirmed as disease (e.g. soil splash, leaf tear, mechanical abrasion), do not guess. Leave it unboxed and note the filename in `DATASET_PROGRESS_TEMPLATE.csv` under `notes`.

### Phase 4: Export & Deployment
- [ ] **Step 4.1:** Export annotations in **YOLO 1.1** (from CVAT) or **YOLOv8 PyTorch TXT** (from Roboflow).
- [ ] **Step 4.2:** Copy the exported `.txt` files into the matching pilot split folders:
  - `sih 2026/ml/datasets/yolo_pilot/labels/train/`
  - `sih 2026/ml/datasets/yolo_pilot/labels/val/`
  - `sih 2026/ml/datasets/yolo_pilot/labels/test/`
- [ ] **Step 4.3:** Ensure healthy images have 0-byte `.txt` files in the corresponding labels directory.

---

## 3. Automated Post-Annotation Verification Commands

After the human annotator exports the label files, run the automated verification scripts:

### Step 1: Check Annotation Completion
```bash
python "d:\ai_detect\sih 2026\ml\scripts\check_annotation_completion.py" \
  --data-dir "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot" \
  --classes 4 \
  --output-csv "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot\completion_audit.csv"
```
*Expected completion condition:* `Overall Completion: 100.0%`, `Missing Labels: 0`, `Invalid Labels: 0`.

### Step 2: Validate YOLO Coordinate Formatting
```bash
python "d:\ai_detect\sih 2026\ml\scripts\validate_yolo_dataset.py" \
  --data-dir "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot" \
  --classes 4 \
  --output-json "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot\validation_report.json"
```
*Expected validation condition:* `Status: PASS (Valid)`, `Errors Found: 0`.

---

## 4. Production Pipeline Integrity

The live production application remains completely protected and isolated:
- **MobileNetV2 Classifier:** Continues serving classification requests via `http://localhost:8000`.
- **OpenCV Localization:** Continues handling contour analysis.
- **Backend & Auth:** Express backend on `http://localhost:4000` requires valid JWT token.
- **Training Block:** YOLO training will remain blocked until the above two verification commands pass with 100% completion.
