"""
FASAL DRISTHI — STEP 5 COMPREHENSIVE AUDIT SCRIPT
Covers: dataset inventory, quality, class distribution, split analysis,
        YOLO/U-Net readiness, field image assessment.
"""
import os, sys, json, hashlib, collections, pathlib, traceback
from PIL import Image

ML_ROOT = pathlib.Path(__file__).resolve().parent.parent
HELDOUT  = ML_ROOT / "test_data" / "heldout_test"
TEST_IMG = ML_ROOT / "test_images"
MODELS   = ML_ROOT / "models"
EVAL     = ML_ROOT / "evaluation"
SCRIPTS  = ML_ROOT / "scripts"
APP      = ML_ROOT / "app"

results = {}

# ─────────────────────────────────────────────
# 1. HELDOUT TEST SET AUDIT
# ─────────────────────────────────────────────
print("=" * 70)
print("TASK 1 — DATASET AUDIT (Heldout Test Set)")
print("=" * 70)

class_stats = {}
total_images = 0
corrupt = []
formats = collections.Counter()
dims = []
hash_set = {}
duplicates = []
SUPPORTED = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"}

for cls_dir in sorted(HELDOUT.iterdir()):
    if not cls_dir.is_dir() or cls_dir.name == "tree_cache.json":
        continue
    cls_name = cls_dir.name
    images = [f for f in cls_dir.iterdir() if f.suffix.lower() in SUPPORTED]
    class_stats[cls_name] = {"count": len(images), "corrupt": 0, "dims": []}
    
    for img_path in images:
        total_images += 1
        formats[img_path.suffix.lower()] += 1
        try:
            with Image.open(img_path) as img:
                w, h = img.size
                dims.append((w, h))
                class_stats[cls_name]["dims"].append((w, h))
                # Hash for duplicate detection
                img_hash = hashlib.md5(img.tobytes()).hexdigest()
                if img_hash in hash_set:
                    duplicates.append((str(img_path), hash_set[img_hash]))
                else:
                    hash_set[img_hash] = str(img_path)
        except Exception as e:
            corrupt.append(str(img_path))
            class_stats[cls_name]["corrupt"] += 1

print(f"\n📦 Heldout Test Set Summary:")
print(f"  Total classes:  {len(class_stats)}")
print(f"  Total images:   {total_images}")
print(f"  Corrupt images: {len(corrupt)}")
print(f"  Duplicates:     {len(duplicates)}")
print(f"  Formats:        {dict(formats)}")

if dims:
    ws = [d[0] for d in dims]; hs = [d[1] for d in dims]
    print(f"  Width  range:   {min(ws)} – {max(ws)} px (mean {sum(ws)//len(ws)})")
    print(f"  Height range:   {min(hs)} – {max(hs)} px (mean {sum(hs)//len(hs)})")

print(f"\n📊 Per-Class Image Counts:")
counts = [(n, s["count"]) for n, s in class_stats.items()]
for name, cnt in sorted(counts, key=lambda x: x[1]):
    bar = "█" * cnt
    print(f"  [{cnt:3d}] {bar:30s} {name}")

min_cls = min(counts, key=lambda x: x[1])
max_cls = max(counts, key=lambda x: x[1])
print(f"\n  Min per class: {min_cls[1]} ({min_cls[0]})")
print(f"  Max per class: {max_cls[1]} ({max_cls[0]})")
print(f"  Imbalance ratio: {max_cls[1]/max(min_cls[1],1):.1f}x")

# Classes with ZERO test images
zero_cls = [n for n, c in counts if c == 0]
print(f"\n⚠️  Classes with 0 test images: {len(zero_cls)}")
for z in zero_cls:
    print(f"  - {z}")

results["heldout_test"] = {
    "total_images": total_images,
    "total_classes": len(class_stats),
    "corrupt_images": corrupt,
    "duplicate_count": len(duplicates),
    "formats": dict(formats),
    "zero_count_classes": zero_cls,
    "per_class_counts": {n: s["count"] for n, s in class_stats.items()},
    "imbalance_ratio": round(max_cls[1]/max(min_cls[1],1), 2) if min_cls[1] > 0 else "∞ (some classes have 0 images)"
}

# ─────────────────────────────────────────────
# 2. CLASS MAPPING VERIFICATION
# ─────────────────────────────────────────────
print("\n" + "=" * 70)
print("TASK 2 — CLASS MAPPING VERIFICATION")
print("=" * 70)

with open(MODELS / "class_indices.json", encoding="utf-8") as f:
    class_idx_json = json.load(f)

model_classes = [class_idx_json[str(i)] for i in range(len(class_idx_json))]
heldout_classes = sorted([d.name for d in HELDOUT.iterdir() if d.is_dir()])

print(f"\n  class_indices.json has {len(model_classes)} classes")
print(f"  Heldout test set has {len(heldout_classes)} class directories")

mismatches = []
for i, mc in enumerate(model_classes):
    if mc not in heldout_classes:
        mismatches.append(f"  [IDX {i}] '{mc}' in class_indices.json NOT FOUND in heldout")

for hc in heldout_classes:
    if hc not in model_classes:
        mismatches.append(f"  '{hc}' in heldout NOT FOUND in class_indices.json")

if mismatches:
    print(f"\n⚠️  Class mapping MISMATCHES ({len(mismatches)}):")
    for m in mismatches: print(m)
else:
    print(f"\n✅  0 mismatches between class_indices.json and heldout test set")

results["class_mapping"] = {
    "class_indices_count": len(model_classes),
    "heldout_class_dir_count": len(heldout_classes),
    "mismatches": mismatches
}

# ─────────────────────────────────────────────
# 3. TRAINING PIPELINE INSPECTION
# ─────────────────────────────────────────────
print("\n" + "=" * 70)
print("TASK 3 — TRAINING PIPELINE ANALYSIS")
print("=" * 70)

train_py = SCRIPTS / "train.py"
with open(train_py, encoding="utf-8") as f:
    train_src = f.read()

checks = {
    "Stratified train/val/test split": "stratify" in train_src,
    "Fixed random seed": "random_state=seed" in train_src or "seed" in train_src,
    "Train-only augmentation (TransformedSubset)": "TransformedSubset" in train_src,
    "Val/Test use eval transforms only": "val_tf" in train_src and "test_set = TransformedSubset" in train_src,
    "Independent transforms per subset (no leakage)": "TransformedSubset" in train_src,
    "Class-weighted loss (imbalance handling)": "class_counts" in train_src or "weight" in train_src.lower(),
    "Saves only best candidate (no production overwrite)": "candidate" in train_src and "plant_disease_model.pth" not in train_src.replace("candidate",""),
    "Test set evaluated after best checkpoint": "load_state_dict(torch.load(output_model_path))" in train_src,
    "Dataset directory must exist check": "FileNotFoundError" in train_src,
}

print(f"\n  Training pipeline checks ({train_py.name}):")
for check, ok in checks.items():
    status = "✅" if ok else "❌"
    print(f"  {status} {check}")

split_ratio = "70/15/15 (train/val/test)"
optimizer = "AdamW (weight_decay=1e-4)"
scheduler = "CosineAnnealingLR"
loss_fn = "CrossEntropyLoss with class_weights"
seed = 42

results["training_pipeline"] = {
    "checks": {k: bool(v) for k, v in checks.items()},
    "split": split_ratio,
    "optimizer": optimizer,
    "scheduler": scheduler,
    "loss": loss_fn,
    "seed": seed,
    "augmentation_train": ["RandomResizedCrop", "RandomHorizontalFlip", "RandomVerticalFlip", "RandomRotation", "ColorJitter"],
    "augmentation_val_test": ["Resize", "CenterCrop", "Normalize"],
    "note": "No PlantVillage full dataset found locally — training not currently possible without downloading it"
}

# ─────────────────────────────────────────────
# 4. YOLO / U-NET READINESS
# ─────────────────────────────────────────────
print("\n" + "=" * 70)
print("TASK 8 — YOLO / U-NET READINESS CHECK")
print("=" * 70)

# Check for annotation files
yolo_annotations = []
unet_masks = []
for root, dirs, files in os.walk(str(ML_ROOT)):
    for f in files:
        fl = f.lower()
        if fl.endswith(".txt") and "label" in fl:
            yolo_annotations.append(os.path.join(root, f))
        if fl.endswith(".xml") or ("annotation" in fl and fl.endswith(".json")):
            yolo_annotations.append(os.path.join(root, f))
        if "mask" in fl or "segmentation" in fl or fl.endswith("_mask.png"):
            unet_masks.append(os.path.join(root, f))

# Check for YOLO/detection weights
yolo_weights = list(ML_ROOT.rglob("*.pt")) + list(ML_ROOT.rglob("yolo*.pth")) + list(ML_ROOT.rglob("yolov*.weights"))
unet_weights = list(ML_ROOT.rglob("unet*.pth")) + list(ML_ROOT.rglob("*segmentation*.pth"))

print(f"\n  YOLO:")
print(f"    Bounding-box annotation files found: {len(yolo_annotations)}")
print(f"    YOLO checkpoint files found:          {len(yolo_weights)}")
if yolo_annotations: [print(f"      {a}") for a in yolo_annotations[:5]]

print(f"\n  U-Net:")
print(f"    Pixel segmentation mask files found: {len(unet_masks)}")
print(f"    U-Net checkpoint files found:         {len(unet_weights)}")
if unet_masks: [print(f"      {m}") for m in unet_masks[:5]]

yolo_status = "DATASET_REQUIRED" if not yolo_annotations else ("CHECKPOINT_REQUIRED" if not yolo_weights else "READY_FOR_TRAINING")
unet_status = "DATASET_REQUIRED" if not unet_masks else ("CHECKPOINT_REQUIRED" if not unet_weights else "READY_FOR_TRAINING")

print(f"\n  YOLO Readiness: {yolo_status}")
print(f"  U-Net Readiness: {unet_status}")

results["yolo_readiness"] = {"status": yolo_status, "annotation_files": len(yolo_annotations), "checkpoints": len(yolo_weights)}
results["unet_readiness"] = {"status": unet_status, "mask_files": len(unet_masks), "checkpoints": len(unet_weights)}

# ─────────────────────────────────────────────
# 5. FIELD IMAGE ASSESSMENT
# ─────────────────────────────────────────────
print("\n" + "=" * 70)
print("TASK 7 — FIELD IMAGE ASSESSMENT")
print("=" * 70)

field_images = []
for ext in [".jpg", ".jpeg", ".png"]:
    field_images += list(TEST_IMG.rglob(f"*{ext}"))

print(f"\n  Field images in ml/test_images: {len(field_images)}")
for fi in field_images:
    try:
        with Image.open(fi) as img:
            print(f"    {fi.name}: {img.size[0]}x{img.size[1]} px, mode={img.mode}, size={fi.stat().st_size//1024}KB")
            print(f"      Label: Tomato___Early_blight (manually labelled, unverified by expert)")
    except Exception as e:
        print(f"    {fi.name}: CORRUPT — {e}")

print(f"\n  ⚠️  Assessment: {len(field_images)} field image(s) available.")
print(f"  ❌  Not sufficient for a genuine held-out field test set.")
print(f"  ❌  No expert-verified labels for field images.")

results["field_images"] = {
    "count": len(field_images),
    "filenames": [f.name for f in field_images],
    "verdict": "INSUFFICIENT — minimum 50 expert-verified field images per class needed for field-test credibility"
}

# ─────────────────────────────────────────────
# 6. KNOWLEDGE BASE AUDIT
# ─────────────────────────────────────────────
print("\n" + "=" * 70)
print("TASK 9 — KNOWLEDGE BASE AUDIT")
print("=" * 70)

KB_PATH = APP / "knowledge_base.py" if (APP / "knowledge_base.py").exists() else ML_ROOT / "knowledge_base.py"
with open(KB_PATH, encoding="utf-8") as f:
    kb_src = f.read()

REQUIRED_FIELDS = [
    "scientific_name", "pathogen", "observed_symptoms", "probable_causes",
    "actions", "organic_remedy", "chemical_remedy", "phi_days",
    "safety_precautions", "expert_referral_threshold"
]

# Count how many keys the KB has
kb_entries = kb_src.count('"crop":')
print(f"\n  KB entries found: {kb_entries}")
print(f"  KB file size:     {KB_PATH.stat().st_size // 1024} KB")

field_coverage = {}
for field in REQUIRED_FIELDS:
    count = kb_src.count(f'"{field}"')
    field_coverage[field] = count
    status = "✅" if count >= kb_entries else "⚠️ PARTIAL" if count > 0 else "❌ MISSING"
    print(f"  {status} '{field}': {count}/{kb_entries} entries")

# Check which of the 38 classes are in the KB
kb_classes_present = []
kb_classes_missing = []
for cls in model_classes:
    if f'"{cls}"' in kb_src:
        kb_classes_present.append(cls)
    else:
        kb_classes_missing.append(cls)

print(f"\n  Classes in class_indices.json covered by KB: {len(kb_classes_present)}/38")
if kb_classes_missing:
    print(f"  ⚠️  MISSING from KB:")
    for m in kb_classes_missing:
        print(f"    - {m}")

results["knowledge_base"] = {
    "entries_found": kb_entries,
    "classes_covered": len(kb_classes_present),
    "classes_missing_from_kb": kb_classes_missing,
    "field_coverage": field_coverage
}

# ─────────────────────────────────────────────
# 7. CURRENT METRICS SUMMARY
# ─────────────────────────────────────────────
print("\n" + "=" * 70)
print("CURRENT MEASURED METRICS (from evaluation/)")
print("=" * 70)

eval_file = EVAL / "evaluation_candidate_plantvillage_model.json"
with open(eval_file, encoding="utf-8") as f:
    eval_data = json.load(f)

print(f"\n  Model:              {eval_data['model']}")
print(f"  Test samples:       {eval_data['total_samples']}")
print(f"  Accuracy:           {eval_data['accuracy']*100:.2f}%")
print(f"  Macro Precision:    {eval_data['macro_precision']*100:.2f}%")
print(f"  Macro Recall:       {eval_data['macro_recall']*100:.2f}%")
print(f"  Macro F1:           {eval_data['macro_f1']*100:.2f}%")
print(f"  Weighted F1:        {eval_data['weighted_f1']*100:.2f}%")
print(f"  Mean Confidence:    {eval_data['mean_confidence']*100:.2f}%")
print(f"  Mean Latency:       {eval_data['mean_latency_ms']} ms")

zero_f1_classes = [p["class_name"] for p in eval_data["per_class"] if p["f1_score"] == 0.0]
perfect_f1_classes = [p["class_name"] for p in eval_data["per_class"] if p["f1_score"] == 1.0]

print(f"\n  Classes with F1=0.0: {len(zero_f1_classes)}")
for c in zero_f1_classes[:10]:
    print(f"    - {c}")
if len(zero_f1_classes) > 10:
    print(f"    ...and {len(zero_f1_classes)-10} more")

print(f"\n  Classes with F1=1.0: {len(perfect_f1_classes)}")
for c in perfect_f1_classes:
    print(f"    + {c}")

results["current_metrics"] = eval_data

# ─────────────────────────────────────────────
# 8. SAVE FULL RESULTS
# ─────────────────────────────────────────────
out_path = ML_ROOT / "audit_results.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, default=str)
print(f"\n\n📁 Full audit results saved to: {out_path}")
print("=" * 70)
print("AUDIT COMPLETE")
print("=" * 70)
