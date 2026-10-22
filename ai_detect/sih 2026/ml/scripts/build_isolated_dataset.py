"""
FASAL DRISTHI — Isolated Dataset Builder
Restructures PlantVillage into strictly separated train/ and test/ partitions:
  ml/datasets/plantvillage_isolated/
  ├── train/
  │   ├── Apple___Apple_scab/
  │   └── ... 38 classes
  └── test/
      ├── Apple___Apple_scab/
      └── ... 38 classes

Safety & Isolation Rules:
1. Source train partition (data_distribution_for_SVM/train/) -> plantvillage_isolated/train/ ONLY.
2. Source test partition (data_distribution_for_SVM/test/) -> plantvillage_isolated/test/ ONLY.
3. NEVER merge train and test images.
4. Any image present in ml/test_data/heldout_test/ (by MD5 or SHA-256) is EXCLUDED from train/.
5. Corrupted/unreadable images are rejected.
6. Re-uses existing downloaded files from ml/datasets/plantvillage/ to minimize bandwidth.
"""

import os, sys, json, hashlib, time, shutil, urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image

ML_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DATASET_DIR = ML_ROOT / "datasets" / "plantvillage"
ISOLATED_DIR = ML_ROOT / "datasets" / "plantvillage_isolated"
HELDOUT_DIR = ML_ROOT / "test_data" / "heldout_test"
TREE_CACHE = HELDOUT_DIR / "tree_cache.json"
CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"
BASE_RAW = "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/"

ISOLATED_TRAIN = ISOLATED_DIR / "train"
ISOLATED_TEST = ISOLATED_DIR / "test"

print("=" * 80)
print("PLANTVILLAGE ISOLATED DATASET BUILDER")
print("=" * 80)

# 1. Load class mapping
with open(CLASS_INDICES, "r", encoding="utf-8") as f:
    class_map = json.load(f)
classes = [class_map[str(i)] for i in range(len(class_map))]
print(f"[1] Loaded {len(classes)} classes from class_indices.json")

# Create partition directories
for cls in classes:
    (ISOLATED_TRAIN / cls).mkdir(parents=True, exist_ok=True)
    (ISOLATED_TEST / cls).mkdir(parents=True, exist_ok=True)

# 2. Hash held-out test set
print("[2] Indexing held-out test set hashes for zero-leakage guarantee...")
heldout_hashes = set()
heldout_sha256s = set()
heldout_file_count = 0
for p in HELDOUT_DIR.rglob("*.*"):
    if p.is_file() and p.suffix.lower() in [".jpg", ".jpeg", ".png"]:
        try:
            data = p.read_bytes()
            heldout_hashes.add(hashlib.md5(data).hexdigest())
            heldout_sha256s.add(hashlib.sha256(data).hexdigest())
            heldout_file_count += 1
        except Exception as e:
            print(f"    Warning: Could not read heldout file {p}: {e}")
print(f"    Found {heldout_file_count} held-out test images ({len(heldout_hashes)} unique MD5s)")

# 3. Load GitHub tree cache to map source partitions
print("[3] Parsing tree_cache.json for source partition mapping...")
with open(TREE_CACHE, "r", encoding="utf-8") as f:
    tree = json.load(f)

# Organize file items
# item: {'partition': 'train'/'test', 'class_idx': int, 'class_name': str, 'filename': str, 'rel_path': str}
files_to_process = []
for item in tree:
    if item.get("type") != "blob":
        continue
    p = item.get("path", "")
    for split in ("train", "test"):
        prefix = f"data_distribution_for_SVM/{split}/"
        if p.startswith(prefix):
            parts = p.split("/")
            if len(parts) == 4:
                try:
                    idx = int(parts[2])
                    if 0 <= idx < len(classes):
                        files_to_process.append({
                            "split": split,
                            "class_idx": idx,
                            "class_name": classes[idx],
                            "filename": parts[3],
                            "rel_path": p
                        })
                except ValueError:
                    pass

print(f"    Total files defined in source SVM partitions: {len(files_to_process)}")
train_items = [f for f in files_to_process if f["split"] == "train"]
test_items = [f for f in files_to_process if f["split"] == "test"]
print(f"    Source train partition: {len(train_items)} images")
print(f"    Source test partition:  {len(test_items)} images")

# 4. Migrate existing files from plantvillage/ if available
print("\n[4] Migrating existing downloaded files from ml/datasets/plantvillage/...")
copied_train = 0
copied_test = 0
excluded_heldout_overlap = []
corrupted_files = []

for item in files_to_process:
    split = item["split"]
    cls_name = item["class_name"]
    fname = item["filename"]
    
    target_dest = (ISOLATED_TRAIN if split == "train" else ISOLATED_TEST) / cls_name / fname
    if target_dest.exists() and target_dest.stat().st_size > 0:
        continue  # Already in place
    
    source_candidate = SOURCE_DATASET_DIR / cls_name / fname
    if source_candidate.exists() and source_candidate.stat().st_size > 0:
        try:
            data = source_candidate.read_bytes()
            md5 = hashlib.md5(data).hexdigest()
            sha256 = hashlib.sha256(data).hexdigest()
            
            # Leakage check: NEVER put a heldout test image into train
            if split == "train" and (md5 in heldout_hashes or sha256 in heldout_sha256s):
                excluded_heldout_overlap.append({"path": str(source_candidate), "md5": md5})
                continue
            
            # Verify image integrity
            with Image.open(source_candidate) as img:
                img.verify()
            
            # Safe to copy
            shutil.copy2(source_candidate, target_dest)
            if split == "train":
                copied_train += 1
            else:
                copied_test += 1
        except Exception as e:
            corrupted_files.append({"file": str(source_candidate), "error": str(e)})

print(f"    Migrated into isolated train: {copied_train}")
print(f"    Migrated into isolated test:  {copied_test}")
print(f"    Held-out test images excluded from train: {len(excluded_heldout_overlap)}")
if corrupted_files:
    print(f"    Corrupted files skipped: {len(corrupted_files)}")

# 5. Determine missing files to download
missing_downloads = []
for item in files_to_process:
    split = item["split"]
    cls_name = item["class_name"]
    fname = item["filename"]
    dest = (ISOLATED_TRAIN if split == "train" else ISOLATED_TEST) / cls_name / fname
    if not dest.exists() or dest.stat().st_size == 0:
        missing_downloads.append(item)

print(f"\n[5] Missing files to download: {len(missing_downloads)} / {len(files_to_process)}")

# 6. Concurrent Downloader Function
def download_item(item):
    split = item["split"]
    cls_name = item["class_name"]
    fname = item["filename"]
    dest = (ISOLATED_TRAIN if split == "train" else ISOLATED_TEST) / cls_name / fname
    
    url = BASE_RAW + item["rel_path"]
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "FasalDristhi-Isolated/1.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            
            if split == "train":
                md5 = hashlib.md5(data).hexdigest()
                sha256 = hashlib.sha256(data).hexdigest()
                if md5 in heldout_hashes or sha256 in heldout_sha256s:
                    return {"status": "excluded_heldout", "item": item, "md5": md5}
            
            dest.write_bytes(data)
            return {"status": "ok", "split": split}
        except Exception as e:
            if attempt == 2:
                return {"status": "error", "item": item, "error": str(e)}
            time.sleep(0.5 * (attempt + 1))

# Run concurrent downloader if missing
if missing_downloads:
    print(f"[6] Downloading {len(missing_downloads)} remaining files with 16 parallel threads...")
    start_dl = time.time()
    downloaded_train = 0
    downloaded_test = 0
    errors = []
    
    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(download_item, item): item for item in missing_downloads}
        done = 0
        total = len(futures)
        for fut in as_completed(futures):
            res = fut.result()
            done += 1
            if res["status"] == "ok":
                if res["split"] == "train":
                    downloaded_train += 1
                else:
                    downloaded_test += 1
            elif res["status"] == "excluded_heldout":
                excluded_heldout_overlap.append({"path": res["item"]["rel_path"], "md5": res["md5"]})
            elif res["status"] == "error":
                errors.append(res)
            
            if done % 500 == 0 or done == total:
                elapsed = time.time() - start_dl
                rate = done / max(elapsed, 0.1)
                print(f"    Progress: {done}/{total} files ({done*100/total:.1f}%) | "
                      f"Speed: {rate:.1f} img/s | ETA: {(total-done)/max(rate, 0.1)/60:.1f} min")
                sys.stdout.flush()

    print(f"    Download complete in {(time.time() - start_dl)/60:.1f} min.")
    print(f"    Downloaded Train: {downloaded_train}, Test: {downloaded_test}, Errors: {len(errors)}")

# 7. Write migration log
log = {
    "total_source_svm_files": len(files_to_process),
    "source_train_count": len(train_items),
    "source_test_count": len(test_items),
    "migrated_from_flat_train": copied_train,
    "migrated_from_flat_test": copied_test,
    "excluded_heldout_overlaps": len(excluded_heldout_overlap),
    "excluded_heldout_samples": excluded_heldout_overlap[:20],
    "corrupted_files_found": corrupted_files
}
log_path = ISOLATED_DIR / "isolation_build_log.json"
with open(log_path, "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

print(f"\n[7] Build log saved to {log_path}")
print("=" * 80)
