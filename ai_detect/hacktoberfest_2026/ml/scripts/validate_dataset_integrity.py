"""
Fasal Dristhi — General Dataset Integrity & Leakage Checker
Scans any image dataset split to detect:
- Bitwise duplicate images (MD5 hashing)
- Filename collisions across splits
- Class imbalance anomalies
- Corrupt or unreadable image headers
"""

import os
import sys
import hashlib
import argparse
import json
from collections import defaultdict
from typing import Dict, List, Any
from PIL import Image

VALID_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

def compute_md5(path: str) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def audit_dataset_integrity(root_dir: str) -> Dict[str, Any]:
    report = {
        "dataset_root": os.path.abspath(root_dir),
        "total_images": 0,
        "corrupt_images": [],
        "duplicate_hash_instances": [],
        "filename_collisions": defaultdict(list),
        "split_class_distribution": defaultdict(lambda: defaultdict(int)),
        "is_leakage_free": True
    }

    if not os.path.exists(root_dir):
        report["error"] = f"Directory not found: {root_dir}"
        return report

    seen_hashes: Dict[str, str] = {}  # hash -> first_path

    for dirpath, _, filenames in os.walk(root_dir):
        rel_dir = os.path.relpath(dirpath, root_dir)
        parts = rel_dir.split(os.sep)
        split_name = parts[0] if len(parts) > 0 else "root"
        class_name = parts[1] if len(parts) > 1 else "unclassified"

        for f in filenames:
            ext = os.path.splitext(f)[1].lower()
            if ext not in VALID_IMAGE_EXTS:
                continue

            full_path = os.path.join(dirpath, f)
            report["total_images"] += 1
            report["split_class_distribution"][split_name][class_name] += 1
            report["filename_collisions"][f].append(os.path.relpath(full_path, root_dir))

            # Verify image readability
            try:
                with Image.open(full_path) as img:
                    img.verify()
            except Exception as e:
                report["corrupt_images"].append({"file": full_path, "error": str(e)})

            # Verify hash uniqueness
            file_hash = compute_md5(full_path)
            if file_hash in seen_hashes:
                first_seen = seen_hashes[file_hash]
                report["duplicate_hash_instances"].append({
                    "hash": file_hash,
                    "first_occurrence": first_seen,
                    "duplicate_occurrence": os.path.relpath(full_path, root_dir)
                })
                # Check if duplicate crosses splits
                first_split = first_seen.split(os.sep)[0]
                if first_split != split_name:
                    report["is_leakage_free"] = False
            else:
                seen_hashes[file_hash] = os.path.relpath(full_path, root_dir)

    # Filter filename collisions to only those with >1 occurrence
    report["filename_collisions"] = {
        k: v for k, v in report["filename_collisions"].items() if len(v) > 1
    }

    return report

def main():
    parser = argparse.ArgumentParser(description="Check dataset integrity, duplicate images, and split leakage")
    parser.add_argument("--data-dir", default="ml/datasets/plantvillage_isolated", help="Dataset directory to check")
    parser.add_argument("--output-json", default=None, help="Path to write JSON report")
    args = parser.parse_args()

    print(f"Scanning dataset integrity at: {args.data_dir}")
    res = audit_dataset_integrity(args.data_dir)

    print("\n" + "=" * 55)
    print("        DATASET INTEGRITY & LEAKAGE REPORT        ")
    print("=" * 55)
    print(f"Total Images Scanned:     {res['total_images']}")
    print(f"Corrupt Images:           {len(res['corrupt_images'])}")
    print(f"Duplicate Hash Instances: {len(res['duplicate_hash_instances'])}")
    print(f"Filename Collisions:      {len(res['filename_collisions'])}")
    print(f"Cross-Split Leakage Free: {'YES (Clean)' if res['is_leakage_free'] else 'NO (Leakage Found!)'}")
    print("=" * 55)

    if res["corrupt_images"]:
        print(f"\nCorrupt Images ({len(res['corrupt_images'])}):")
        for c in res["corrupt_images"][:5]:
            print(f"  ❌ {c['file']}: {c['error']}")

    if not res["is_leakage_free"]:
        print(f"\nCross-Split Leakage Examples ({len(res['duplicate_hash_instances'])}):")
        for d in res["duplicate_hash_instances"][:5]:
            print(f"  ⚠️  {d['first_occurrence']} <==> {d['duplicate_occurrence']}")

    if args.output_json:
        with open(args.output_json, "w", encoding="utf-8") as jf:
            json.dump(res, jf, indent=2)
        print(f"\nSaved report to: {args.output_json}")

    sys.exit(0 if res["is_leakage_free"] and not res["corrupt_images"] else 1)

if __name__ == "__main__":
    main()
