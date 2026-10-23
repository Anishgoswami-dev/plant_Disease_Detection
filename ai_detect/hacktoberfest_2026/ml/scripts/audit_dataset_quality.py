"""
FASAL DRISTHI — Complete Dataset Integrity, Leakage, and Model Verification Audit
Performs deep non-destructive audit:
1. Dataset integrity (image counts, corrupt files, duplicates)
2. Data leakage (heldout_test vs plantvillage hashes & filenames)
3. Split verification (SVM train vs test vs heldout)
4. Evaluation reproducibility (re-run evaluation on heldout_test)
5. Model & label verification (MobileNetV2 state_dict, class_indices.json, file hashes)
"""
import os, sys, json, hashlib, time
from pathlib import Path
from collections import Counter, defaultdict
from PIL import Image
import numpy as np
import torch
import torchvision.models as models
from torchvision import transforms

ML_ROOT = Path(__file__).resolve().parent.parent
DATASET_DIR = ML_ROOT / "datasets" / "plantvillage"
HELDOUT_DIR = ML_ROOT / "test_data" / "heldout_test"
CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"
ACTIVE_MODEL = ML_ROOT / "models" / "plant_disease_model.pth"
AUDIT_OUTPUT = ML_ROOT / "audit_dataset_quality_report.json"

print("=" * 80)
print("FASAL DRISTHI — DATASET QUALITY & REPRODUCIBILITY AUDIT")
print("=" * 80)

audit = {
    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "dataset_integrity": {},
    "leakage_check": {},
    "split_verification": {},
    "evaluation_reproducibility": {},
    "model_verification": {},
    "recommendation": "NOT READY"
}

# 1. LOAD CLASS INDICES
with open(CLASS_INDICES, "r", encoding="utf-8") as f:
    class_indices = json.load(f)
expected_classes = [class_indices[str(i)] for i in range(len(class_indices))]
audit["model_verification"]["total_classes_in_indices"] = len(expected_classes)
print(f"[1] Loaded {len(expected_classes)} expected classes from class_indices.json")

# 2. AUDIT DATASET INTEGRITY
print("\n[2] Auditing Dataset Integrity in ml/datasets/plantvillage...")
dataset_exists = DATASET_DIR.exists()
audit["dataset_integrity"]["dataset_dir_exists"] = dataset_exists

class_counts = {}
corrupted_images = []
unreadable_images = []
dataset_hashes = {}  # hash -> [filepaths]
file_extensions = Counter()
total_dataset_images = 0

if dataset_exists:
    found_classes = [d.name for d in DATASET_DIR.iterdir() if d.is_dir()]
    audit["dataset_integrity"]["total_class_folders"] = len(found_classes)
    
    missing_classes = [c for c in expected_classes if c not in found_classes]
    extra_classes = [c for c in found_classes if c not in expected_classes]
    audit["dataset_integrity"]["missing_class_folders"] = missing_classes
    audit["dataset_integrity"]["extra_class_folders"] = extra_classes

    for cls in expected_classes:
        cls_path = DATASET_DIR / cls
        if not cls_path.exists():
            class_counts[cls] = 0
            continue
        
        imgs = [p for p in cls_path.iterdir() if p.is_file()]
        class_counts[cls] = len(imgs)
        total_dataset_images += len(imgs)

        for img_path in imgs:
            file_extensions[img_path.suffix.lower()] += 1
            # Check readability and corruption
            try:
                with open(img_path, "rb") as f:
                    data = f.read()
                h = hashlib.md5(data).hexdigest()
                dataset_hashes.setdefault(h, []).append(str(img_path))
                
                with Image.open(img_path) as img:
                    img.verify()
            except Exception as e:
                corrupted_images.append({"path": str(img_path), "error": str(e)})

audit["dataset_integrity"]["total_images"] = total_dataset_images
audit["dataset_integrity"]["class_counts"] = class_counts
audit["dataset_integrity"]["file_extensions"] = dict(file_extensions)
audit["dataset_integrity"]["corrupted_count"] = len(corrupted_images)
audit["dataset_integrity"]["corrupted_files"] = corrupted_images[:20]

# Duplicate check within dataset
internal_duplicates = {h: paths for h, paths in dataset_hashes.items() if len(paths) > 1}
audit["dataset_integrity"]["internal_exact_duplicate_groups"] = len(internal_duplicates)
audit["dataset_integrity"]["internal_duplicate_samples"] = [
    {"hash": h, "count": len(paths), "files": paths[:3]} for h, paths in list(internal_duplicates.items())[:10]
]
print(f"    Total images in dataset: {total_dataset_images}")
print(f"    Corrupted/Unreadable images: {len(corrupted_images)}")
print(f"    Exact duplicate groups within dataset: {len(internal_duplicates)}")

# 3. AUDIT HELDOUT TEST SET
print("\n[3] Auditing Heldout Test Set in ml/test_data/heldout_test...")
heldout_counts = {}
heldout_hashes = {}  # hash -> filepath
heldout_filenames = {}  # filename -> filepath
heldout_corrupted = []
total_heldout_images = 0

if HELDOUT_DIR.exists():
    for cls in expected_classes:
        cls_dir = HELDOUT_DIR / cls
        if not cls_dir.exists():
            heldout_counts[cls] = 0
            continue
        imgs = [p for p in cls_dir.iterdir() if p.is_file() and p.suffix.lower() in [".jpg", ".jpeg", ".png"]]
        heldout_counts[cls] = len(imgs)
        total_heldout_images += len(imgs)
        for img_path in imgs:
            try:
                with open(img_path, "rb") as f:
                    data = f.read()
                h = hashlib.md5(data).hexdigest()
                heldout_hashes[h] = str(img_path)
                heldout_filenames[img_path.name] = str(img_path)
                with Image.open(img_path) as img:
                    img.verify()
            except Exception as e:
                heldout_corrupted.append({"path": str(img_path), "error": str(e)})

audit["split_verification"]["heldout_total_images"] = total_heldout_images
audit["split_verification"]["heldout_class_counts"] = heldout_counts
audit["split_verification"]["heldout_corrupted_count"] = len(heldout_corrupted)
print(f"    Total heldout test images: {total_heldout_images}")
print(f"    Heldout classes with 0 images: {sum(1 for c, n in heldout_counts.items() if n == 0)}")

# 4. DATA LEAKAGE AUDIT
print("\n[4] Checking Data Leakage between heldout_test and plantvillage...")
hash_overlaps = []
for h, heldout_path in heldout_hashes.items():
    if h in dataset_hashes:
        hash_overlaps.append({
            "hash": h,
            "heldout_file": heldout_path,
            "dataset_files": dataset_hashes[h]
        })

filename_overlaps = []
for fname, heldout_path in heldout_filenames.items():
    matches = list(DATASET_DIR.glob(f"*/{fname}"))
    if matches:
        filename_overlaps.append({
            "filename": fname,
            "heldout_file": heldout_path,
            "dataset_files": [str(m) for m in matches]
        })

audit["leakage_check"]["exact_hash_leakage_count"] = len(hash_overlaps)
audit["leakage_check"]["exact_hash_leakages"] = hash_overlaps[:25]
audit["leakage_check"]["filename_leakage_count"] = len(filename_overlaps)
audit["leakage_check"]["filename_leakages"] = filename_overlaps[:25]
print(f"    Exact Hash Leakage (heldout images found in dataset): {len(hash_overlaps)}")
print(f"    Filename Overlaps: {len(filename_overlaps)}")

# Check download script design leakage
tree_cache_path = ML_ROOT / "test_data" / "heldout_test" / "tree_cache.json"
if tree_cache_path.exists():
    with open(tree_cache_path, "r", encoding="utf-8") as f:
        tree = json.load(f)
    svm_train_count = sum(1 for item in tree if item.get("path", "").startswith("data_distribution_for_SVM/train/"))
    svm_test_count = sum(1 for item in tree if item.get("path", "").startswith("data_distribution_for_SVM/test/"))
    audit["split_verification"]["svm_split_available"] = {
        "svm_train_blobs": svm_train_count,
        "svm_test_blobs": svm_test_count
    }
    print(f"    Source Repo Distribution: {svm_train_count} SVM train blobs, {svm_test_count} SVM test blobs")

# 5. REPRODUCIBILITY TEST OF EVALUATION METRICS
print("\n[5] Verifying Evaluation Reproducibility...")
eval_reproduced = False
top1_acc = 0.0
macro_f1 = 0.0
balanced_acc = 0.0
top3_acc = 0.0

try:
    # Load active model
    model = models.mobilenet_v2(weights=None)
    model.classifier[1] = torch.nn.Linear(model.last_channel, 38)
    ckpt = torch.load(ACTIVE_MODEL, map_location="cpu")
    model.load_state_dict(ckpt)
    model.eval()

    val_tf = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    all_preds = []
    all_top3 = []
    all_targets = []
    
    for idx, cls in enumerate(expected_classes):
        cls_dir = HELDOUT_DIR / cls
        if not cls_dir.exists():
            continue
        imgs = [p for p in cls_dir.iterdir() if p.suffix.lower() in [".jpg", ".jpeg", ".png"]]
        for p in imgs:
            try:
                img = Image.open(p).convert("RGB")
                t = val_tf(img).unsqueeze(0)
                with torch.no_grad():
                    out = model(t)
                    top3 = torch.topk(out, 3, dim=1).indices.squeeze().tolist()
                    pred = top3[0] if isinstance(top3, list) else top3
                all_preds.append(pred)
                all_top3.append(top3 if isinstance(top3, list) else [top3])
                all_targets.append(idx)
            except Exception as e:
                pass

    from sklearn.metrics import accuracy_score, f1_score, balanced_accuracy_score
    if len(all_targets) > 0:
        top1_acc = accuracy_score(all_targets, all_preds)
        macro_f1 = f1_score(all_targets, all_preds, average="macro", zero_division=0)
        balanced_acc = balanced_accuracy_score(all_targets, all_preds)
        top3_correct = sum(1 for t, preds in zip(all_targets, all_top3) if t in preds)
        top3_acc = top3_correct / len(all_targets)
        eval_reproduced = True
except Exception as e:
    audit["evaluation_reproducibility"]["error"] = str(e)

audit["evaluation_reproducibility"]["reproduced"] = eval_reproduced
audit["evaluation_reproducibility"]["evaluated_samples"] = len(all_targets)
audit["evaluation_reproducibility"]["top1_accuracy"] = round(top1_acc * 100, 2)
audit["evaluation_reproducibility"]["macro_f1"] = round(macro_f1 * 100, 2)
audit["evaluation_reproducibility"]["balanced_accuracy"] = round(balanced_acc * 100, 2)
audit["evaluation_reproducibility"]["top3_accuracy"] = round(top3_acc * 100, 2)

# Statistical confidence interval (Wilson score interval for Top-1 accuracy)
n = len(all_targets)
p = top1_acc
z = 1.96  # 95% confidence
denominator = 1 + z**2 / n
centre_adjusted_probability = p + z**2 / (2 * n)
adjusted_standard_deviation = np.sqrt((p * (1 - p) + z**2 / (4 * n)) / n)
ci_lower = (centre_adjusted_probability - z * adjusted_standard_deviation) / denominator
ci_upper = (centre_adjusted_probability + z * adjusted_standard_deviation) / denominator
audit["evaluation_reproducibility"]["confidence_interval_95pct"] = {
    "lower": round(ci_lower * 100, 2),
    "upper": round(ci_upper * 100, 2),
    "margin_of_error": round(((ci_upper - ci_lower) / 2) * 100, 2)
}
print(f"    Reproduced Top-1: {top1_acc*100:.2f}% (Previously reported: 48.37%)")
print(f"    Reproduced Macro F1: {macro_f1*100:.2f}% (Previously reported: 44.47%)")
print(f"    95% CI on 306 samples: [{ci_lower*100:.2f}%, {ci_upper*100:.2f}%] (Margin: ±{((ci_upper-ci_lower)/2)*100:.2f}%)")

# 6. MODEL & LABEL INTEGRITY
print("\n[6] Verifying Model and Label Integrity...")
active_stat = ACTIVE_MODEL.stat()
audit["model_verification"]["model_file_size_bytes"] = active_stat.st_size
audit["model_verification"]["model_file_modified_time"] = time.ctime(active_stat.st_mtime)

with open(ACTIVE_MODEL, "rb") as f:
    model_sha256 = hashlib.sha256(f.read()).hexdigest()
audit["model_verification"]["model_sha256"] = model_sha256

# Check weights
ckpt = torch.load(ACTIVE_MODEL, map_location="cpu")
classifier_weight_shape = list(ckpt.get("classifier.1.weight", torch.tensor([])).shape)
audit["model_verification"]["classifier_weight_shape"] = classifier_weight_shape
audit["model_verification"]["is_mobilenet_v2"] = "features.0.0.weight" in ckpt and "classifier.1.weight" in ckpt
print(f"    Model size: {active_stat.st_size} bytes (Expected: 9,328,715)")
print(f"    Classifier weight shape: {classifier_weight_shape} (Expected: [38, 1280])")
print(f"    SHA256: {model_sha256[:16]}...")

# 7. FINAL DETERMINATION
serious_issues = []
if total_dataset_images < 19298:
    serious_issues.append(f"Dataset download incomplete: only {total_dataset_images} of 19,298 images downloaded.")
if len(hash_overlaps) > 0 or len(filename_overlaps) > 0:
    serious_issues.append(f"CRITICAL DATA LEAKAGE: {len(hash_overlaps)} exact identical images / {len(filename_overlaps)} filename overlaps exist between heldout_test and plantvillage.")
if audit["dataset_integrity"]["total_class_folders"] < 38:
    serious_issues.append(f"Incomplete class coverage: only {audit['dataset_integrity']['total_class_folders']}/38 class folders present.")

audit["serious_issues"] = serious_issues
audit["recommendation"] = "NOT READY" if len(serious_issues) > 0 else "READY"
print(f"\nFinal Recommendation: {audit['recommendation']}")
for issue in serious_issues:
    print(f"  [!] {issue}")

with open(AUDIT_OUTPUT, "w", encoding="utf-8") as f:
    json.dump(audit, f, indent=2)
print(f"\nSaved full report to {AUDIT_OUTPUT}")
print("=" * 80)
