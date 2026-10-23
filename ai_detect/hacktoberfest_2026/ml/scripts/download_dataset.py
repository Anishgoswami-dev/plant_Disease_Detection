"""
FASAL DRISTHI — PlantVillage Dataset Download (SVM Split, All 38 Classes)
Uses the official data_distribution_for_SVM split which has all 38 classes
including all Tomato diseases. Downloads into ml/datasets/plantvillage/
with proper class-name folder structure.

Source: https://github.com/spMohanty/PlantVillage-Dataset (CC BY 4.0)
Total: ~19,298 images (8,751 train + 10,547 test) — all 38 classes
"""
import os, sys, json, time, urllib.request
from pathlib import Path
from collections import Counter, defaultdict

ML_ROOT = Path(__file__).resolve().parent.parent
DATASET_DIR = ML_ROOT / "datasets" / "plantvillage"
TREE_CACHE = ML_ROOT / "test_data" / "heldout_test" / "tree_cache.json"
CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"
BASE_RAW = "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/"
LOG_PATH = ML_ROOT / "datasets" / "download_log.json"

DATASET_DIR.mkdir(parents=True, exist_ok=True)
LOG_PATH.parent.mkdir(parents=True, exist_ok=True)

print("=" * 70)
print("PLANTVILLAGE DOWNLOAD — data_distribution_for_SVM (All 38 Classes)")
print("=" * 70)

with open(CLASS_INDICES, encoding="utf-8") as f:
    class_map = json.load(f)
classes = [class_map[str(i)] for i in range(38)]

with open(TREE_CACHE, encoding="utf-8") as f:
    tree = json.load(f)
print(f"Tree loaded: {len(tree)} entries")

# Collect train and test file paths indexed by class integer
split_files = defaultdict(lambda: {"train": [], "test": []})
for item in tree:
    p = item.get("path", "")
    typ = item.get("type", "")
    if typ != "blob":
        continue
    for split in ("train", "test"):
        prefix = f"data_distribution_for_SVM/{split}/"
        if p.startswith(prefix):
            parts = p.split("/")
            if len(parts) == 4:
                try:
                    idx = int(parts[2])
                    if 0 <= idx < 38:
                        split_files[idx][split].append(p)
                except ValueError:
                    pass

# Summary
total_urls = sum(len(v["train"]) + len(v["test"]) for v in split_files.values())
print(f"Files to download: {total_urls} across 38 classes")
for idx in range(38):
    n = len(split_files[idx]["train"]) + len(split_files[idx]["test"])
    print(f"  [{idx:2d}] {classes[idx][:55]:55s}: {n}")

# Create class-name directories
for cls in classes:
    (DATASET_DIR / cls).mkdir(parents=True, exist_ok=True)

# Download
total_downloaded = 0
total_skipped = 0
total_errors = 0
error_list = []
start = time.time()

print(f"\nDownloading to {DATASET_DIR} ...")
for idx in range(38):
    cls = classes[idx]
    cls_dir = DATASET_DIR / cls
    all_paths = split_files[idx]["train"] + split_files[idx]["test"]
    cls_new = 0; cls_skip = 0

    for path in all_paths:
        fname = path.split("/")[-1]
        dest = cls_dir / fname
        if dest.exists() and dest.stat().st_size > 0:
            cls_skip += 1
            total_skipped += 1
            continue
        url = BASE_RAW + path
        for attempt in range(3):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "FasalDristhi/1.0"})
                with urllib.request.urlopen(req, timeout=30) as r:
                    data = r.read()
                dest.write_bytes(data)
                cls_new += 1
                total_downloaded += 1
                break
            except Exception as e:
                if attempt == 2:
                    total_errors += 1
                    if len(error_list) < 20:
                        error_list.append(f"{fname}: {e}")
                time.sleep(0.5 * (attempt + 1))
        time.sleep(0.02)  # gentle rate limit

    elapsed = time.time() - start
    total_done = total_downloaded + total_skipped
    rate = total_done / max(elapsed, 1)
    remaining = total_urls - total_done
    eta = remaining / max(rate, 0.1)
    print(f"  [{idx+1:2d}/38] {cls[:40]:40s}: +{cls_new:4d} new, {cls_skip:4d} existing | "
          f"Total={total_done}/{total_urls} | {rate:.1f}/s | ETA={eta/60:.0f}m")
    sys.stdout.flush()

elapsed_total = time.time() - start
print(f"\n{'='*70}")
print(f"DOWNLOAD COMPLETE")
print(f"  New images downloaded: {total_downloaded}")
print(f"  Existing (skipped):    {total_skipped}")
print(f"  Errors:                {total_errors}")
print(f"  Total in dataset:      {total_downloaded + total_skipped}")
print(f"  Time:                  {elapsed_total/60:.1f} minutes")

if error_list:
    print(f"\n  First errors:")
    for e in error_list[:5]:
        print(f"    {e}")

# Final count
final_count = 0
per_class_final = {}
for cls in classes:
    imgs = list((DATASET_DIR / cls).glob("*.JPG")) + list((DATASET_DIR / cls).glob("*.jpg")) + list((DATASET_DIR / cls).glob("*.png"))
    per_class_final[cls] = len(imgs)
    final_count += len(imgs)
print(f"\nVerification: {final_count} total images verified on disk")

# Save log
log = {
    "downloaded": total_downloaded,
    "skipped": total_skipped,
    "errors": total_errors,
    "total": final_count,
    "per_class": per_class_final,
    "dataset_path": str(DATASET_DIR),
    "time_minutes": round(elapsed_total/60, 1)
}
with open(LOG_PATH, "w") as f:
    json.dump(log, f, indent=2)
print(f"Log saved to {LOG_PATH}")
print("="*70)
