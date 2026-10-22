# Fasal Dristhi — YOLO Pilot Annotation Checklist & Protocol

**Document Version:** 1.0.0  
**Target Crop:** Tomato (*Solanum lycopersicum*)  
**Pilot Dataset Size:** 250 Representative Images (70% Train, 15% Val, 15% Test)  
**Target Models:** YOLOv8 / YOLOv11 (Foliar Lesion Detection)  
**Status:** Ready for Manual Annotation (0 Annotations Created — No Synthetic Data)

---

## 1. Pilot Dataset Scope & Structure

The pilot dataset is staged at `sih 2026/ml/datasets/yolo_pilot/` with the following strict split:

```
yolo_pilot/
├── data.yaml
├── pilot_manifest.csv
├── validation_report.json
├── images/
│   ├── train/          (175 images: 35 per class)
│   ├── val/            (35 images: 7 per class)
│   └── test/           (40 images: 8 per class)
└── labels/
    ├── train/          (Awaiting manual annotation)
    ├── val/            (Awaiting manual annotation)
    └── test/           (Awaiting manual annotation)
```

### Class Mapping (Zero-Indexed YOLO Classes)

| Class ID | Class Name | Plant Pathology Diagnostic Features |
| :---: | :--- | :--- |
| **`0`** | `early_blight` | Target-board concentric rings (*Alternaria solani*), brown/black lesions surrounded by chlorotic yellow halos. |
| **`1`** | `late_blight` | Large water-soaked irregular lesions (*Phytophthora infestans*), pale green/brown margins, rapid tissue necrosis. |
| **`2`** | `bacterial_spot` | Small (2–3mm) circular/angular dark brown/black lesions (*Xanthomonas spp.*), occasionally with slight yellow halo or scabby texture. |
| **`3`** | `septoria_leaf_spot` | Numerous small circular spots (*Septoria lycopersici*) with grayish-white centers and dark brown borders, often containing tiny black pycnidia. |
| *N/A* | `healthy` | Control leaves showing zero foliar disease lesions. Produces an **empty (0-byte) `.txt` label file**. |

---

## 2. Lesion Bounding Box Annotation Protocol

### Rule A: Discrete Lesions
- Draw a tight bounding box around each visible individual lesion.
- The box must cover the necrotic central area **and** the chlorotic halo immediately bordering the lesion.
- Do **not** include uninfected healthy green tissue beyond the immediate halo.

### Rule B: Multiple Lesions on a Single Leaflet
- If a leaf has multiple distinct lesions separated by healthy tissue (>3mm), annotate each lesion with an independent bounding box.
- Do not draw one single giant bounding box over the entire leaf if the lesions are discrete.

### Rule C: Dense Clusters & Overlapping Lesions
- When multiple small lesions (frequent in `septoria_leaf_spot` and `bacterial_spot`) merge together so tightly that individual boundaries cannot be distinguished:
  - If fewer than 5 lesions overlap slightly, draw individual overlapping boxes.
  - If a dense necrotic patch of 10+ confluent lesions covers a lobe, draw a single bounding box enclosing the confluent disease patch.

### Rule D: Ambiguous or Unclear Lesions
- If a spot cannot be confidently identified due to motion blur, severe underexposure, or physical mechanical damage (insect chew, wind tear, fertilizer burn):
  - Do **not** guess or fabricate a disease box.
  - Log the image in `DATASET_PROGRESS_TEMPLATE.csv` with `quality_status = FLAGGED_AMBIGUOUS` and note the issue in `notes`.
  - A senior plant pathologist must review the flagged specimen before inclusion.

### Rule E: Healthy Control Leaves
- For the 50 control images in the pilot (`disease = healthy`):
  - No disease bounding boxes should be drawn.
  - In YOLO format, negative/background control images must have a corresponding `.txt` file that is completely **empty (0 bytes)**.
  - This explicitly teaches YOLO what an uninfected leaf looks like without generating false positives.

---

## 3. YOLO Label Format Specification

Each annotated image `<filename>.JPG` must have a corresponding `<filename>.txt` in the matching split directory under `labels/`:

```
<class_id> <x_center> <y_center> <width> <height>
```

- All coordinates must be normalized to floating point values between `0.0` and `1.0`:
  - `x_center` = (box_center_x) / (image_width)
  - `y_center` = (box_center_y) / (image_height)
  - `width` = (box_width) / (image_width)
  - `height` = (box_height) / (image_height)
- Example label file (`0027889d-8d3b-46c2-b081-c41925811602.txt`):
  ```
  0 0.452100 0.321450 0.125000 0.098400
  0 0.612000 0.584200 0.084500 0.076200
  ```

---

## 4. Step-by-Step Tool Setup & Annotation Workflow

### Option 1: CVAT (Computer Vision Annotation Tool)
1. **Create Project:** Name `Fasal-Dristhi-Tomato-YOLO-Pilot`.
2. **Setup Labels:** Add classes `early_blight` (id 0), `late_blight` (id 1), `bacterial_spot` (id 2), `septoria_leaf_spot` (id 3).
3. **Upload Dataset:** Upload images from `images/train/`, `images/val/`, `images/test/` as separate tasks.
4. **Annotate:** Follow Section 2 above to annotate all bounding boxes.
5. **Export:** Export annotation as **YOLO 1.1** format.
6. **Deploy:** Place exported `.txt` files into the respective `labels/train/`, `labels/val/`, and `labels/test/` folders.

### Option 2: Roboflow
1. **Create Project:** Object Detection type, Project Name: `fasal-dristhi-tomato-pilot`.
2. **Classes:** `early_blight`, `late_blight`, `bacterial_spot`, `septoria_leaf_spot`.
3. **Upload:** Drag and drop images preserving existing train/val/test splits.
4. **Annotate:** Use the bounding box tool (`B` shortcut).
5. **Export:** Generate YOLOv8 PyTorch format (txt).
6. **Deploy:** Download and copy label files into `sih 2026/ml/datasets/yolo_pilot/labels/`.

---

## 5. QA Reviewer Checklist (Before Signing Off)

Every annotated image must pass this 8-point checklist before updating `DATASET_PROGRESS_TEMPLATE.csv`:

- [ ] **Image-Label Pair:** Every image in `images/` has an exact-matching `.txt` file in `labels/`.
- [ ] **Class Range:** All class IDs are strictly integers in `{0, 1, 2, 3}`.
- [ ] **Coordinate Bounds:** All `x_center`, `y_center`, `width`, `height` $\in (0.0, 1.0]$.
- [ ] **Box Extents:** No box coordinates extend beyond the physical boundaries $[0.0, 1.0]$.
- [ ] **Tight Boundaries:** Bounding boxes are snug against the lesion halo without excessive background padding.
- [ ] **Healthy Leaf Verification:** Healthy leaf control files are exactly 0 bytes (no spurious boxes).
- [ ] **No Cross-Split Leakage:** Images are uniquely partitioned between train, val, and test splits.
- [ ] **Automated Validation:** `python sih 2026/ml/scripts/validate_yolo_dataset.py --data-dir sih 2026/ml/datasets/yolo_pilot` passes with 0 errors.

---

## 6. Automated Validation Command

Run this command after annotating each batch to automatically catch formatting errors:

```bash
python "d:\ai_detect\sih 2026\ml\scripts\validate_yolo_dataset.py" \
  --data-dir "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot" \
  --classes 4 \
  --output-json "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot\validation_report.json"
```

Only when `Total Labels == Total Images` and `Errors Found == 0` can the dataset be declared ready for YOLO training.
