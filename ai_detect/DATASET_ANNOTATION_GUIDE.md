# FASAL DRISTHI — DATASET ANNOTATION & PREPARATION GUIDE
**Document ID:** `DAG-2026-09-19-V1`  
**System:** Fasal Dristhi AI Crop Health Diagnosis Pipeline  
**Target Capabilities:** YOLO Lesion Localization & U-Net Foliar Tissue Semantic Segmentation  
**Target Crop:** Tomato (*Solanum lycopersicum*)  

---

## 1. Executive Summary & Audited Dataset Totals

Before beginning annotation, an exact file-by-file audit was conducted to resolve previous documentation discrepancies.

### Audited Dataset Inventory
| Split / Directory | Total Images | Tomato Images | Target Diseases (4 Classes) | Tomato Healthy |
|---|---|---|---|---|
| `ml/datasets/plantvillage` (raw download) | 3,390 | 0 | 0 | 0 |
| `ml/datasets/plantvillage_isolated/train` | 8,741 | 2,852 | 1,010 | 223 |
| `ml/datasets/plantvillage_isolated/test` | 10,547 | 3,582 | 1,324 | 336 |
| `ml/test_data/heldout_test` | 153 | 60 | 24 | 6 |
| **Combined Active Dataset** | **19,441** | **6,494** | **2,358** | **565** |

### Target Disease Breakdown (Initial Annotation Phase)
| Disease Class | Pathogen | Train Count | Test Count | Heldout Count | Total Available |
|---|---|---|---|---|---|
| `early_blight` | *Alternaria solani* | 147 | 184 | 6 | **337** |
| `late_blight` | *Phytophthora infestans* | 291 | 369 | 6 | **666** |
| `bacterial_spot` | *Xanthomonas campestris* | 297 | 463 | 6 | **766** |
| `septoria_leaf_spot` | *Septoria lycopersici* | 275 | 312 | 6 | **593** |
| `healthy_leaf` (Control) | N/A (Intact Lamina) | 223 | 336 | 6 | **565** |
| **Target Phase 1 Pool** | — | **1,233** | **1,664** | **30** | **2,927** |

---

## 2. Recommended Annotation Tooling

### Tool 1: CVAT (Computer Vision Annotation Tool) — Recommended for Self-Hosted / Offline
- **Deployment**: Local Docker container (`docker compose up -d`) or hosted at [cvat.ai](https://www.cvat.ai).
- **Strengths**:
  - Zero cloud vendor lock-in.
  - Native multi-user assignment with reviewer/annotator separation.
  - Native support for both Bounding Boxes (YOLO) and Polygons / Brush Masks (U-Net).
  - Direct export to **YOLO 1.1** format and **Segmentation MASK 1.1**.

### Tool 2: Roboflow — Recommended for Rapid Collaborative Curation
- **Deployment**: Cloud-based workspace [roboflow.com](https://roboflow.com).
- **Strengths**:
  - Automated dataset health checks (class imbalance, duplicate detection).
  - Built-in preprocessing (auto-orientation, resize, color jitter).
  - Versioned release exports with pre-built `data.yaml`.
  - Smart polygon labeling tools (SAM / Segment Anything integration for leaf margins).

---

## 3. Dataset Folder Structure

The dataset must be organized in parallel, independent directory structures for YOLO and U-Net to prevent cross-task confusion.

```
ml/datasets/
├── yolo_tomato/
│   ├── data.yaml                  # Class mapping & dataset paths
│   ├── train/
│   │   ├── images/                # .jpg / .png image files
│   │   │   ├── tom_eb_001.jpg
│   │   └── labels/                # .txt YOLO bounding box files
│   │       ├── tom_eb_001.txt
│   ├── val/
│   │   ├── images/
│   │   └── labels/
│   └── test/
│       ├── images/
│       └── labels/
│
└── unet_tomato/
    ├── dataset_manifest.json      # Mapping metadata and class indices
    ├── train/
    │   ├── images/                # Original RGB images (e.g. 512x512)
    │   │   ├── tom_001.png
    │   └── masks/                 # 8-bit single-channel ground-truth masks
    │       ├── tom_001_mask.png
    ├── val/
    │   ├── images/
    │   └── masks/
    └── test/
        ├── images/
        └── masks/
```

---

## 4. YOLO Annotation Plan

### A. Supported Classes
Only the 4 verified, pathogen-backed Tomato diseases plus a healthy control class are permitted:
```yaml
# data.yaml
path: ../datasets/yolo_tomato
train: train/images
val: val/images
test: test/images

nc: 4
names:
  0: early_blight
  1: late_blight
  2: bacterial_spot
  3: septoria_leaf_spot
```
*(Healthy leaves contain no bounding box entries, represented as empty `.txt` label files).*

### B. Annotation Format
YOLO format uses one text line per bounding box:
```
<class_id> <x_center> <y_center> <width> <height>
```
- All values must be normalized floats between `0.000000` and `1.000000` relative to image dimensions.
- Example (`tom_eb_001.txt`):
  ```
  0 0.452100 0.381200 0.124000 0.158000
  0 0.612400 0.540100 0.089000 0.092000
  ```

### C. Specific Annotation Rules
1. **Discrete Lesion Bounding Boxes**:
   - Draw the box tightly around the lesion, including the surrounding yellow chlorotic halo (halo is an active zone of fungal phytotoxin diffusion).
   - Margin tolerance: Leave no more than 3-5 pixels of healthy green tissue outside the bounding box.
2. **Multiple Lesions in One Image**:
   - Annotate every distinct lesion individually if its diameter is $\ge 15\text{ pixels}$.
   - For severe Septoria or Bacterial Spot infestations with hundreds of tiny pin-head specks ($<10\text{ pixels}$):
     - Cluster tightly coalesced specks into a single bounding box labeled with the dominant disease class.
     - Never create overlapping boxes for the same pinpoint lesion cluster.
3. **Overlapping Lesions**:
   - If two lesions overlap but show distinct concentric centers (e.g., two *Alternaria* concentric spots), draw two separate bounding boxes.
   - If lesions have fully coalesced into large non-specific dry necrosis, draw a single enclosing bounding box.
4. **Unclear or Borderline Lesions**:
   - If foliar damage cannot be conclusively identified (e.g., mechanical tear, insect feeding hole, chemical scorch):
     - **DO NOT** force a disease label.
     - Tag the image in `DATASET_PROGRESS_TEMPLATE.csv` with `quality_status = "BORDERLINE_EXCLUDE"` and record a note for agronomic review.
5. **Healthy Leaves (Negative Control)**:
   - For `Tomato___healthy` images: Create an empty `.txt` file (0 bytes).
   - This explicitly trains the YOLO background class, preventing false-positive bounding box hallucinations on intact foliage.

---

## 5. U-Net Semantic Segmentation Plan

### A. Semantic Class Indices
U-Net pixel masks must use strict single-channel (grayscale) 8-bit integer values:
| Class Index | Color Code (RGB) | Semantic Category | Description |
|---|---|---|---|
| **0** | `#000000` (Black) | **Background** | Soil, air, bench, shadows, hands, non-plant items |
| **1** | `#22C55E` (Green) | **Healthy Leaf Lamina** | Intact, chlorophyll-rich green foliar tissue |
| **2** | `#EF4444` (Red) | **Necrotic / Diseased Tissue** | Brown/black necrotic spots, water-soaked blights, lesions |
| **3** | `#EAB308` (Yellow) | **Chlorotic Halo** | Yellowing chlorosis surrounding active lesions |

### B. Binary Mask Protocol (Foliar Damage Ratio)
For initial training focused on diseased foliage percentage:
- `0`: Background + Healthy lamina (intact canopy).
- `255`: Diseased tissue + Chlorotic halo (affected area).
$$\text{Affected Area \%} = \frac{\text{Count}(\text{pixel} == 255)}{\text{Count}(\text{pixel} == 255) + \text{Count}(\text{pixel} == \text{healthy})} \times 100$$

### C. Image-Mask Pairing & Filename Matching Rules
1. Every mask must have an exact 1-to-1 corresponding image:
   - Image: `train/images/tom_eb_0042.jpg` (or `.png`)
   - Mask: `train/masks/tom_eb_0042_mask.png`
2. Masks **must strictly be PNG format** (lossless compression). Never use JPEG for segmentation masks (JPEG artifacts corrupt discrete pixel index values).
3. Image and mask dimensions must match exactly:
   $$\text{Height}_{\text{mask}} == \text{Height}_{\text{image}}, \quad \text{Width}_{\text{mask}} == \text{Width}_{\text{image}}$$

---

## 6. Train / Validation / Test Splitting Strategy

To guarantee statistical independence and prevent data leakage:
- **Partition Ratio**:
  - **Train**: **70%** (Model parameter updates)
  - **Validation**: **15%** (Hyperparameter tuning, early stopping, mAP/IoU checkpoints)
  - **Test**: **15%** (Independent, untouched benchmark)
- **Stratification**:
  - Stratify by disease class so each split has proportional representation.
  - Stratify by lesion density (mild, moderate, severe).
- **Leakage Prevention Rule**:
  - All images derived from the same plant specimen or captured in the same photographic burst must remain strictly within the same split. Never put burst-shot images of the same leaf in both train and validation.

---

## 7. Annotation Quality Checklist

Before approving any annotated batch:
- [ ] **Tight Box Boundaries**: Boxes contain the entire lesion without excessive background.
- [ ] **No Coordinate Truncation**: No box coordinates $<0$ or $>1$.
- [ ] **Halo Inclusion**: Chlorotic yellow halos around Early Blight and Septoria are enclosed.
- [ ] **Class ID Consistency**: Class IDs match `0: early_blight`, `1: late_blight`, `2: bacterial_spot`, `3: septoria_leaf_spot`.
- [ ] **Mask Pixel Fidelity**: Mask contains only allowed integer values (`[0, 1, 2, 3]` or `[0, 255]`).
- [ ] **Lossless Mask Format**: All masks saved as single-channel 8-bit PNG.
- [ ] **No Empty Label Files on Diseased Images**: An image labeled Early Blight must have $\ge 1$ bounding box.
- [ ] **Negative Control Empty Files**: Healthy leaf images must have a corresponding 0-byte `.txt` file.

---

## 8. Version Control Strategy

Because large image datasets cannot be committed directly to Git:
1. **DVC (Data Version Control)**:
   - Track dataset directories via `.dvc` pointer files:
     ```bash
     dvc add ml/datasets/yolo_tomato
     dvc add ml/datasets/unet_tomato
     git add ml/datasets/yolo_tomato.dvc ml/datasets/unet_tomato.dvc .gitignore
     git commit -m "feat(ml): track initial tomato annotation dataset v1.0"
     ```
2. **Release Tagging**:
   - Tag each completed annotation milestone: `dataset-yolo-tomato-v1.0`, `dataset-unet-tomato-v1.0`.
3. **Dataset Manifest**:
   - Maintain `splits_manifest.json` recording SHA-256 hashes of all images and annotations to prevent silent file corruption or unintended deletions.
