"""
FASAL DRISTHI — Heldout Test Set Expander
Downloads 6 images per class for ALL 38 classes (including all Tomato)
using the data_distribution_for_SVM/test split from the PlantVillage repo.
Uses integer-indexed class folders mapped to class names via class_indices.json.
"""
import json, time, urllib.request, urllib.parse
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parent.parent
HELDOUT = ML_ROOT / "test_data" / "heldout_test"
TREE_CACHE = HELDOUT / "tree_cache.json"
CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"

SAMPLES_PER_CLASS = 6  # Target per class (download missing ones)
BASE_RAW = "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/"

print("=" * 70)
print(f"HELDOUT TEST SET EXPANDER — Target: {SAMPLES_PER_CLASS} images/class (all 38)")
print("=" * 70)

with open(CLASS_INDICES, encoding="utf-8") as f:
    class_map = json.load(f)
classes = [class_map[str(i)] for i in range(38)]

with open(TREE_CACHE, encoding="utf-8") as f:
    tree = json.load(f)

# Build per-class file list from data_distribution_for_SVM/test/
test_files = {i: [] for i in range(38)}
for item in tree:
    p = item.get("path", "")
    if p.startswith("data_distribution_for_SVM/test/") and item.get("type") == "blob":
        parts = p.split("/")
        if len(parts) == 4:
            try:
                idx = int(parts[2])
                if 0 <= idx < 38:
                    test_files[idx].append(p)
            except ValueError:
                pass

print(f"\nAvailable test images per class from SVM split:")
for i, cls in enumerate(classes):
    n = len(test_files[i])
    print(f"  [{i:2d}] {cls[:55]:55s}: {n} available")

# Download missing
total_downloaded = 0
total_skipped = 0
total_errors = 0

print(f"\nExpanding heldout set to {SAMPLES_PER_CLASS}/class...")
for idx, cls in enumerate(classes):
    cls_dir = HELDOUT / cls
    cls_dir.mkdir(exist_ok=True)

    existing = list(cls_dir.glob("*.jpg")) + list(cls_dir.glob("*.JPG")) + list(cls_dir.glob("*.png"))
    needed = max(0, SAMPLES_PER_CLASS - len(existing))

    if needed == 0:
        print(f"  [{idx+1:2d}/38] {cls[:45]:45s}: already has {len(existing)} images, skip")
        total_skipped += len(existing)
        continue

    available = test_files[idx]
    if not available:
        print(f"  [{idx+1:2d}/38] {cls[:45]:45s}: WARNING — 0 files in SVM test split!")
        continue

    # Use last `needed` files for determinism (consistent with existing evaluate_model.py logic)
    to_download = available[-needed:]
    cls_new = 0

    for rel_path in to_download:
        fname = Path(rel_path).name
        dest = cls_dir / fname
        if dest.exists():
            continue
        encoded = "/".join(urllib.parse.quote(part) for part in rel_path.split("/"))
        url = BASE_RAW + encoded
        for attempt in range(3):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "FasalDristhi/1.0"})
                with urllib.request.urlopen(req, timeout=30) as r:
                    dest.write_bytes(r.read())
                cls_new += 1
                total_downloaded += 1
                break
            except Exception as e:
                if attempt == 2:
                    total_errors += 1
                    print(f"    ERROR {fname}: {e}")
                time.sleep(0.5)
        time.sleep(0.05)

    final_count = len(list(cls_dir.glob("*.jpg")) + list(cls_dir.glob("*.JPG")) + list(cls_dir.glob("*.png")))
    print(f"  [{idx+1:2d}/38] {cls[:45]:45s}: +{cls_new} new => {final_count} total")

print(f"\n{'='*70}")
print(f"HELDOUT EXPANSION COMPLETE")
print(f"  New images downloaded: {total_downloaded}")
print(f"  Errors:                {total_errors}")

# Final count
final_total = 0
zero_classes = []
for idx, cls in enumerate(classes):
    cls_dir = HELDOUT / cls
    imgs = list(cls_dir.glob("*.jpg")) + list(cls_dir.glob("*.JPG")) + list(cls_dir.glob("*.png"))
    final_total += len(imgs)
    if len(imgs) == 0:
        zero_classes.append(cls)

print(f"  Total heldout images: {final_total}")
print(f"  Classes with 0 images: {len(zero_classes)}")
for z in zero_classes:
    print(f"    - {z}")
print("="*70)
