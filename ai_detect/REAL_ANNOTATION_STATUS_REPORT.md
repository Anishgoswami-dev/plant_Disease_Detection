# Fasal Dristhi — Real Annotation Status & Pilot Audit Report

**Report Date:** 2026-09-19  
**Target System:** Fasal Dristhi Tomato Crop Health Diagnosis  
**Pilot Dataset Path:** `d:/ai_detect/sih 2026/ml/datasets/yolo_pilot`  
**Overall Training Readiness Verdict:** 🛑 **NOT READY FOR YOLO TRAINING**

---

## Executive Summary

An audit of the annotation progress tracking system and physical files confirmed that **zero genuine bounding-box annotations or pixel-level segmentation masks existed**. 

All placeholder records claiming completed annotations (`bbox_annotated = YES`, `mask_annotated = YES`, `quality_status = APPROVED_QA`, `reviewer = Dr. Agronomist`) have been **completely purged and corrected** across all tracking files. No synthetic bounding boxes or pseudo-annotations were fabricated.

A real YOLO annotation pilot dataset containing **250 representative Tomato images** has been sampled and organized into standard YOLO Ultralytics split directories. The dataset is strictly in an **awaiting manual annotation** state.

---

## 1. Audit & Correction of `DATASET_PROGRESS_TEMPLATE.csv`

### Previous State (Placeholder/Fabricated Data Detected)
In the previous preparation step, 5 sample rows contained placeholder annotation indicators:
- `bbox_annotated`: `YES`
- `mask_annotated`: `YES`
- `quality_status`: `APPROVED_QA`
- `reviewer`: `Dr. Agronomist`
- Additional rows contained `mask_annotated`: `YES`

### Corrective Action Taken
Every row in `DATASET_PROGRESS_TEMPLATE.csv` has been corrected to reflect absolute ground truth:

| Field | Previous (Fabricated) Value | Corrected (Real) Value | Rationale |
| :--- | :--- | :--- | :--- |
| `bbox_annotated` | `YES` | **`NO`** | No `.txt` YOLO bounding box file exists on disk. |
| `mask_annotated` | `YES` | **`NO`** | No `.png` pixel segmentation mask exists on disk. |
| `quality_status` | `APPROVED_QA` / `VERIFIED` | **`PENDING_ANNOTATION`** | Cannot approve annotations that do not exist. |
| `reviewer` | `Dr. Agronomist` | **`Unassigned`** | No agronomist review has taken place. |
| `notes` | Generic isolate note | **`No real bbox or mask annotation file exists`** | Explicit audit trail. |

**Synced across all locations:**
- `d:/ai_detect/DATASET_PROGRESS_TEMPLATE.csv`
- `d:/ai_detect/sih 2026/DATASET_PROGRESS_TEMPLATE.csv`
- `d:/sih 2026/DATASET_PROGRESS_TEMPLATE.csv`

---

## 2. YOLO Pilot Dataset Structure & Composition

The pilot dataset was constructed via stratified sampling from verified Tomato isolate collections in `plantvillage_isolated` without cross-split leakage.

### Directory Layout
```
d:/ai_detect/sih 2026/ml/datasets/yolo_pilot/
├── data.yaml                     # Ultralytics dataset configuration
├── pilot_manifest.csv            # 250 image tracking records with source paths
├── validation_report.json        # Output of automated validation tool
├── images/
│   ├── train/                    # 175 real images (35 per class)
│   ├── val/                      # 35 real images (7 per class)
│   └── test/                     # 40 real images (8 per class)
└── labels/
    ├── train/                    # 0 files (awaits manual annotation)
    ├── val/                      # 0 files (awaits manual annotation)
    └── test/                     # 0 files (awaits manual annotation)
```

### Dataset Configuration (`data.yaml`)
```yaml
path: d:/ai_detect/sih 2026/ml/datasets/yolo_pilot
train: images/train
val: images/val
test: images/test
nc: 4
names:
  0: early_blight
  1: late_blight
  2: bacterial_spot
  3: septoria_leaf_spot
```

### Class Distribution (Stratified Sampling)

| Class ID | Disease / Class Name | Train | Val | Test | Total Images |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **0** | `early_blight` (*Alternaria solani*) | 35 | 7 | 8 | **50** |
| **1** | `late_blight` (*Phytophthora infestans*) | 35 | 7 | 8 | **50** |
| **2** | `bacterial_spot` (*Xanthomonas spp.*) | 35 | 7 | 8 | **50** |
| **3** | `septoria_leaf_spot` (*Septoria lycopersici*) | 35 | 7 | 8 | **50** |
| *Ctrl* | `healthy` (Negative control leaves) | 35 | 7 | 8 | **50** |
| **TOTAL** | | **175** | **35** | **40** | **250** |

---

## 3. Real Annotation Status & Metrics

| Metric | Verified Count | Status |
| :--- | :---: | :--- |
| **Number of images selected** | **250** | Complete (stratified representation) |
| **Number of real label files present** | **0** | Awaiting manual annotation |
| **Number of images still requiring annotation** | **250** | 100% of pilot set |
| **Number of missing labels** | **250** | All 250 images lack labels |
| **Number of invalid labels** | **0** | No corrupt or invalid labels exist |
| **Total bounding boxes recorded** | **0** | Zero fabricated bounding boxes |
| **Cross-split bitwise leakage** | **0** | Clean (MD5 hash verification passed) |
| **Ready for YOLO training?** | **NO** | 🛑 **BLOCKED until manual annotations exist** |

---

## 4. Automated Validation Tool Output

Running the updated `validate_yolo_dataset.py` on the pilot directory confirms the structural validity of the dataset and the exact absence of labels:

```
==================================================
      YOLO DATASET VALIDATION REPORT          
==================================================
Layout:             standard (images/<split>, labels/<split>)
Status:             PASS (Valid Directory Structure)
Total Images:       250
Total Labels:       0
Total Bounding Boxes: 0
Class Counts:       {0: 0, 1: 0, 2: 0, 3: 0}
Errors Found:       0
Warnings Found:     3 (Expected: labels missing in train, val, test)
Leakage Instances:  0
==================================================

Warnings (Sample):
  [!] Split 'train': 175 images lack a .txt label file
  [!] Split 'val': 35 images lack a .txt label file
  [!] Split 'test': 40 images lack a .txt label file
```

---

## 5. Production Pipeline Preservation

Throughout this phase, the live production pipeline was strictly frozen and preserved:

- **MobileNetV2 Classification Weights:** Intact at `sih 2026/ml/models/plant_disease_model.pth`.
- **Active Inference Engine:** FastAPI running on `http://localhost:8000` (verified active, CPU forward pass ~50ms).
- **Vision Localization:** Classical OpenCV contour analysis untouched.
- **OOD Thresholds:** Unchanged.
- **Backend & Authentication:** Express backend on `http://localhost:4000` with JWT bearer authentication untouched.
- **Frontend UI:** Active and verified on `http://localhost:5173`.

---

## 6. Next Actions Required to Reach Training Readiness

1. **Import Images to Annotation Tool:** Import the 250 images from `images/` into CVAT or Roboflow according to `YOLO_PILOT_ANNOTATION_CHECKLIST.md`.
2. **Execute Manual Bounding-Box Annotation:** Annotators draw tight boxes around disease lesions for the 4 target classes and generate empty `.txt` files for the 50 healthy control leaves.
3. **Export & Place Labels:** Export annotations in YOLO format and place into `labels/train/`, `labels/val/`, `labels/test/`.
4. **Re-Run Validation:** Execute `python sih 2026/ml/scripts/validate_yolo_dataset.py --data-dir sih 2026/ml/datasets/yolo_pilot`.
5. **Quality Review:** Reviewers verify boxes and update `DATASET_PROGRESS_TEMPLATE.csv` to `APPROVED_QA` only after genuine manual review.
