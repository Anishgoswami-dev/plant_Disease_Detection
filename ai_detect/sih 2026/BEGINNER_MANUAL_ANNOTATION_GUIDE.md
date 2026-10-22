# Fasal Dristhi — Beginner's Step-by-Step Manual Annotation Guide

This guide walks you through manually annotating the 250-image Tomato pilot dataset using **Roboflow** (recommended for simplicity) or **CVAT**, exporting the labels in YOLO format, verifying them, and preparing the dataset for training.

---

## Visual Workflow

```text
  250 Pilot Images
  ├── images/train (175)
  ├── images/val   (35)
  └── images/test  (40)
         │
         ▼
  Upload to Roboflow or CVAT (Preserve Split)
         │
         ▼
  Create 4 Classes:
  0: early_blight  |  1: late_blight  |  2: bacterial_spot  |  3: septoria_leaf_spot
         │
         ▼
  Draw Bounding Boxes on Disease Lesions
  (Healthy leaves = ZERO boxes)
         │
         ▼
  Peer Review & Quality Check
         │
         ▼
  Export Dataset as "YOLOv8 PyTorch" (.txt format)
         │
         ▼
  Copy .txt Files to labels/train, labels/val, labels/test
         │
         ▼
  Run: python sih 2026/ml/scripts/check_annotation_completion.py
         │
         ▼
  If 100% Valid & 0 Errors ──> Ready for YOLO Training!
```

---

## Step 1: Open the 250 Pilot Images in Roboflow or CVAT

The images are located in your local project folder:
```
D:\ai_detect\sih 2026\ml\datasets\yolo_pilot\images\
├── train\   (175 images)
├── val\     (35 images)
└── test\    (40 images)
```

### Option A: Using Roboflow (Recommended for Beginners)

1. Go to [https://roboflow.com](https://roboflow.com) and sign in (free account).
2. Click **Create New Project**:
   - **Project Type:** `Object Detection` (Bounding Box).
   - **Project Name:** `Fasal-Dristhi-Tomato-Pilot`.
   - **What is your model detecting:** `Tomato leaf disease lesions`.
3. Click **Upload Data**:
   - Roboflow lets you upload folders directly.
   - **Best Practice:** Upload by split so the pre-defined 70/15/15 ratio is preserved:
     - Drag the files from `images\train\` and select **Save to Train Set**.
     - Drag the files from `images\val\` and select **Save to Valid Set**.
     - Drag the files from `images\test\` and select **Save to Test Set**.
4. Click **Finish Upload** and assign images to yourself for annotation.

---

### Option B: Using CVAT (Computer Vision Annotation Tool)

1. Go to [https://app.cvat.ai](https://app.cvat.ai) or launch your local CVAT instance.
2. Click **Projects** > **+ (Create New Project)**:
   - **Name:** `Fasal-Dristhi-Tomato-Pilot`.
3. Create 3 Tasks under this project (to preserve the splits):
   - Task 1: `tomato_train` -> Upload all files from `images\train\`
   - Task 2: `tomato_val` -> Upload all files from `images\val\`
   - Task 3: `tomato_test` -> Upload all files from `images\test\`
4. Open the task and click on the job to start the annotation canvas.

---

## Step 2: Create the Four Disease Classes

Define the 4 target classes in Roboflow/CVAT. **Do not create a class for healthy leaves.**

| Class ID | Class Name | Diagnostic Features on Leaf |
| :---: | :--- | :--- |
| **`0`** | `early_blight` | Dark brown to black circular/oval spots with distinct **target-board concentric rings** surrounded by a yellow chlorotic halo (*Alternaria solani*). |
| **`1`** | `late_blight` | Large, irregular, water-soaked brown patches that look rapidly decaying, pale green/brown borders (*Phytophthora infestans*). |
| **`2`** | `bacterial_spot` | Small (2–3 mm), dark brown/black angular or circular spots, sometimes greasy looking or scabby (*Xanthomonas spp.*). |
| **`3`** | `septoria_leaf_spot` | Numerous small circular spots with **grayish-white centers** and thin, dark brown borders. Tiny black dots (pycnidia) often visible inside (*Septoria lycopersici*). |

---

## Step 3: Draw Accurate Bounding Boxes

1. Press **`B`** (shortcut in Roboflow/CVAT) to activate the **Bounding Box** tool.
2. Select the disease class from the dropdown or shortcut key.
3. Click and drag the box to enclose the visible lesion:
   - **Tight Margins:** The box must snugly enclose the dark necrotic spot **plus its immediate yellow halo**.
   - **Do not include healthy leaf tissue:** Do not make the box unnecessarily large.
   - **Do not box the whole leaf:** If a leaf has 5 spots, do not draw 1 giant box around the leaf.

---

## Step 4: Handle Special Cases

### 1. Multiple Lesions on One Leaf
- Annotate **each lesion individually** with its own bounding box.
- If a leaf has 8 Septoria spots, there should be 8 separate bounding boxes labeled `septoria_leaf_spot`.

### 2. Dense Clusters & Overlapping Lesions
- If small lesions touch each other slightly, draw overlapping individual boxes.
- If a cluster of 10+ tiny spots merges into a solid necrotic patch where individual spots cannot be separated, draw **one single bounding box** enclosing the entire patch.

### 3. Healthy Control Images (50 Images in Pilot)
- You have 50 control images labeled `healthy` (e.g. `003ee675-0423-4258-a265-5db6cd13c8bf.JPG`).
- **DO NOT DRAW ANY BOUNDING BOXES ON HEALTHY IMAGES.**
- Simply review the image, confirm there are no disease lesions, and click **Next / Mark as Complete**.
- On export, healthy images will generate an **empty (0-byte) `.txt` file**. This is crucial: it teaches YOLO what an uninfected leaf looks like, preventing false-positive alerts.

### 4. Ambiguous Spots
- If a spot is unclear (could be mud/soil splash, mechanical scratch, insect bite):
  - Do not guess or fabricate a disease box.
  - Leave it unboxed.

---

## Step 5: Export Annotations in YOLO Ultralytics Format

### From Roboflow:
1. When all 250 images are annotated, click **Generate** in the left sidebar.
2. In Preprocessing/Augmentation: **Leave disabled** (or select default `Auto-Orient`).
3. Click **Generate New Version**.
4. Click **Export Dataset**:
   - Format: Select **`YOLOv8`** (PyTorch TXT format).
   - Choose: **download zip to computer**.
5. Unzip the downloaded file. You will see:
   ```
   downloaded_zip/
   ├── train/
   │   ├── images/
   │   └── labels/
   ├── valid/
   │   ├── images/
   │   └── labels/
   └── test/
       ├── images/
       └── labels/
   ```

### From CVAT:
1. In the CVAT task/project, click **Actions** > **Export dataset**.
2. Select format: **`YOLO 1.1`**.
3. Download and unzip the archive.

---

## Step 6: Copy the Exported Labels into the Dataset Folders

Copy the generated `.txt` files into the project's label folders:

```powershell
# Copy train labels (.txt files) into:
D:\ai_detect\sih 2026\ml\datasets\yolo_pilot\labels\train\

# Copy valid/val labels (.txt files) into:
D:\ai_detect\sih 2026\ml\datasets\yolo_pilot\labels\val\

# Copy test labels (.txt files) into:
D:\ai_detect\sih 2026\ml\datasets\yolo_pilot\labels\test\
```

### Healthy Images Label Check
Make sure every healthy image has a corresponding `.txt` file with 0 bytes. For example:
- `images/train/healthy_003ee675...JPG` $\longrightarrow$ `labels/train/healthy_003ee675...txt` (0 bytes / empty).
- If Roboflow did not generate an empty `.txt` file for unannotated images, you can create empty text files for healthy leaves matching their image names.

---

## Step 7: Run `check_annotation_completion.py`

Once all label files are in place, run the verification script in PowerShell:

```powershell
python "d:\ai_detect\sih 2026\ml\scripts\check_annotation_completion.py" --data-dir "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot" --output-csv "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot\completion_audit.csv"
```

Also run the coordinate validator:
```powershell
python "d:\ai_detect\sih 2026\ml\scripts\validate_yolo_dataset.py" --data-dir "d:\ai_detect\sih 2026\ml\datasets\yolo_pilot" --classes 4
```

---

## Step 8: Interpret the Validation Report

### Success Output (Ready for Training)

```text
============================================================
       FASAL DRISTHI — ANNOTATION COMPLETION REPORT       
============================================================
Total Images in Dataset:  250
Total Labels Found:       250
Fully Completed Images:   250
  - Diseased with Boxes:  200
  - Healthy Controls:     50 (valid empty labels)
Missing Labels:           0
Empty Diseased Labels:    0
Invalid Labels:           0
Overall Completion:       100.0%
------------------------------------------------------------
Split Progress:
  train : 175/175 completed (100.0%) | Missing: 0
  val   : 35/35 completed (35.0%)   | Missing: 0
  test  : 40/40 completed (40.0%)   | Missing: 0
============================================================
>> VERDICT: [READY] All images annotated and validated! Ready for YOLO training.
============================================================
```

### Failure Output (Action Required)

| Warning / Error | What it Means | How to Fix It |
| :--- | :--- | :--- |
| `Missing Labels: X` | One or more images have no matching `.txt` file in `labels/`. | Check filename match; make sure healthy images have a 0-byte `.txt` file. |
| `Empty Diseased Labels: X` | A diseased leaf has a 0-byte `.txt` file (0 bounding boxes drawn). | Open the image in Roboflow/CVAT and draw bounding boxes on the lesion. |
| `Invalid Labels: X` | Coordinates are not normalized between 0.0 and 1.0, or class ID $> 3$. | Re-export from Roboflow in standard YOLOv8 PyTorch format. |
| `Status: [NOT READY]` | Training is blocked until all 250 images have valid labels. | Complete all missing labels and re-run the script. |

---

## Next Step After Passing

Only when `check_annotation_completion.py` outputs **`VERDICT: [READY]`** can YOLO training begin:

```bash
# YOLOv8 Training Command (Run ONLY after passing verification):
yolo detect train model=yolov8n.pt data="d:/ai_detect/sih 2026/ml/datasets/yolo_pilot/data.yaml" epochs=50 imgsz=640 batch=16
```
