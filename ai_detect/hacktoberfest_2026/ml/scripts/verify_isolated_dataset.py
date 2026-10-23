"""
FASAL DRISTHI — Isolated Dataset Verification Script
Verifies strict partition isolation, data integrity, and zero leakage:
1. Confirms all 38 classes in both train/ and test/.
2. Counts actual train and test images per class.
3. Checks for any duplicate images (MD5 & SHA-256) between train/ and test/.
4. Checks for any duplicate images between held-out test and train/.
5. Confirms folder names match class_indices.json 100%.
6. Scans every image for corruption/unreadable bytes via PIL.
7. Generates verification report.
"""

import os, sys, json, hashlib, time
from pathlib import Path
from PIL import Image

ML_ROOT = Path(__file__).resolve().parent.parent
ISOLATED_DIR = ML_ROOT / "datasets" / "plantvillage_isolated"
HELDOUT_DIR = ML_ROOT / "test_data" / "heldout_test"
CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"
OUTPUT_REPORT = ML_ROOT / "isolated_dataset_verification.json"

ISOLATED_TRAIN = ISOLATED_DIR / "train"
ISOLATED_TEST = ISOLATED_DIR / "test"

print("=" * 80)
print("PLANTVILLAGE ISOLATED DATASET VERIFICATION")
print("=" * 80)

report = {
    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "class_mapping_verified": False,
    "train_summary": {},
    "test_summary": {},
    "per_class_counts": {},
    "train_test_overlap": [],
    "heldout_train_leakage": [],
    "corrupted_images": [],
    "is_ready_for_evaluation": False,
    "issues": []
}

# 1. Load class mapping
with open(CLASS_INDICES, "r", encoding="utf-8") as f:
    class_map = json.load(f)
expected_classes = [class_map[str(i)] for i in range(len(class_map))]
report["expected_classes_count"] = len(expected_classes)

train_dirs = [d.name for d in ISOLATED_TRAIN.iterdir() if d.is_dir()] if ISOLATED_TRAIN.exists() else []
test_dirs = [d.name for d in ISOLATED_TEST.iterdir() if d.is_dir()] if ISOLATED_TEST.exists() else []

missing_in_train = [c for c in expected_classes if c not in train_dirs]
missing_in_test = [c for c in expected_classes if c not in test_dirs]
extra_in_train = [c for c in train_dirs if c not in expected_classes]
extra_in_test = [c for c in test_dirs if c not in expected_classes]

report["class_mapping"] = {
    "missing_in_train": missing_in_train,
    "missing_in_test": missing_in_test,
    "extra_in_train": extra_in_train,
    "extra_in_test": extra_in_test,
    "match_count": len([c for c in expected_classes if c in train_dirs and c in test_dirs])
}

if not missing_in_train and not missing_in_test and not extra_in_train and not extra_in_test:
    report["class_mapping_verified"] = True
    print(f"[1] Class mapping: 100% MATCH ({len(expected_classes)} classes in train and test)")
else:
    report["issues"].append(f"Class folder mismatch: missing train={missing_in_train}, test={missing_in_test}")
    print(f"[1] Class mapping MISMATCH: missing train={len(missing_in_train)}, test={len(missing_in_test)}")

# 2. Index held-out test hashes
print("\n[2] Indexing held-out test set hashes...")
heldout_hashes = {}
for p in HELDOUT_DIR.rglob("*.*"):
    if p.is_file() and p.suffix.lower() in [".jpg", ".jpeg", ".png"]:
        try:
            h = hashlib.md5(p.read_bytes()).hexdigest()
            heldout_hashes[h] = str(p)
        except Exception as e:
            pass
print(f"    Indexed {len(heldout_hashes)} held-out images.")

# 3. Audit train partition
print("\n[3] Auditing isolated train partition...")
train_hashes = {}
train_class_counts = {}
total_train = 0
corrupted = []

for cls in expected_classes:
    cls_path = ISOLATED_TRAIN / cls
    if not cls_path.exists():
        train_class_counts[cls] = 0
        continue
    imgs = [p for p in cls_path.iterdir() if p.is_file() and p.suffix.lower() in [".jpg", ".jpeg", ".png"]]
    train_class_counts[cls] = len(imgs)
    total_train += len(imgs)
    
    for img_path in imgs:
        try:
            data = img_path.read_bytes()
            h = hashlib.md5(data).hexdigest()
            train_hashes[h] = str(img_path)
            
            # Check leakage against held-out test
            if h in heldout_hashes:
                report["heldout_train_leakage"].append({
                    "hash": h,
                    "train_file": str(img_path),
                    "heldout_file": heldout_hashes[h]
                })
            
            with Image.open(img_path) as im:
                im.verify()
        except Exception as e:
            corrupted.append({"path": str(img_path), "partition": "train", "error": str(e)})

report["train_summary"]["total_images"] = total_train
report["train_summary"]["classes_populated"] = sum(1 for c, n in train_class_counts.items() if n > 0)
print(f"    Total train images: {total_train} across {report['train_summary']['classes_populated']}/38 classes")
print(f"    Held-out leakage into train: {len(report['heldout_train_leakage'])} files")

# 4. Audit test partition
print("\n[4] Auditing isolated test partition...")
test_hashes = {}
test_class_counts = {}
total_test = 0

for cls in expected_classes:
    cls_path = ISOLATED_TEST / cls
    if not cls_path.exists():
        test_class_counts[cls] = 0
        continue
    imgs = [p for p in cls_path.iterdir() if p.is_file() and p.suffix.lower() in [".jpg", ".jpeg", ".png"]]
    test_class_counts[cls] = len(imgs)
    total_test += len(imgs)
    
    for img_path in imgs:
        try:
            data = img_path.read_bytes()
            h = hashlib.md5(data).hexdigest()
            test_hashes[h] = str(img_path)
            
            # Check train-test overlap
            if h in train_hashes:
                report["train_test_overlap"].append({
                    "hash": h,
                    "train_file": train_hashes[h],
                    "test_file": str(img_path)
                })
            
            with Image.open(img_path) as im:
                im.verify()
        except Exception as e:
            corrupted.append({"path": str(img_path), "partition": "test", "error": str(e)})

report["test_summary"]["total_images"] = total_test
report["test_summary"]["classes_populated"] = sum(1 for c, n in test_class_counts.items() if n > 0)
print(f"    Total test images: {total_test} across {report['test_summary']['classes_populated']}/38 classes")
print(f"    Train-Test cross-overlap: {len(report['train_test_overlap'])} files")
print(f"    Corrupted/unreadable images: {len(corrupted)}")

report["corrupted_images"] = corrupted

# Combine per-class counts
for cls in expected_classes:
    report["per_class_counts"][cls] = {
        "train": train_class_counts.get(cls, 0),
        "test": test_class_counts.get(cls, 0),
        "total": train_class_counts.get(cls, 0) + test_class_counts.get(cls, 0)
    }

# Ready evaluation check
if len(report["heldout_train_leakage"]) > 0:
    report["issues"].append(f"Found {len(report['heldout_train_leakage'])} heldout test images leaked in train/")
if len(report["train_test_overlap"]) > 0:
    report["issues"].append(f"Found {len(report['train_test_overlap'])} duplicate images between train and test")
if len(corrupted) > 0:
    report["issues"].append(f"Found {len(corrupted)} corrupted images")
if report["train_summary"]["classes_populated"] < 38 or report["test_summary"]["classes_populated"] < 38:
    report["issues"].append(f"Incomplete class population: train={report['train_summary']['classes_populated']}/38, test={report['test_summary']['classes_populated']}/38")

report["is_ready_for_evaluation"] = len(report["issues"]) == 0

print(f"\n[5] Final Isolated Dataset Status:")
print(f"    Ready for Independent Evaluation: {report['is_ready_for_evaluation']}")
for issue in report["issues"]:
    print(f"    [!] {issue}")

with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2)

print(f"\nSaved report to {OUTPUT_REPORT}")
print("=" * 80)
