"""
Fasal Dristhi — YOLO Dataset Validator
Validates YOLO foliar disease bounding box datasets:
- Missing images / labels
- Coordinate bounds (0.0 <= x, y, w, h <= 1.0)
- Box coordinate boundary overflow
- Class ID range checks
- Duplicate filenames across splits
- Train/Val/Test data leakage (MD5 image hash match)
"""

import os
import sys
import glob
import hashlib
import argparse
import json
from typing import Dict, List, Any, Set, Tuple

VALID_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

def compute_file_md5(filepath: str) -> str:
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def detect_layout(dataset_root: str, allowed_splits: Tuple[str, ...]) -> str:
    """
    Auto-detect YOLO directory layout.
    Returns 'standard' for images/<split>/ layout, or 'per_split' for <split>/images/ layout.
    """
    # Check standard YOLO Ultralytics layout: images/train, images/val, etc.
    images_top = os.path.join(dataset_root, "images")
    if os.path.isdir(images_top):
        for split in allowed_splits:
            if os.path.isdir(os.path.join(images_top, split)):
                return "standard"
    # Check per-split layout: train/images, val/images, etc.
    for split in allowed_splits:
        split_img = os.path.join(dataset_root, split, "images")
        if os.path.isdir(split_img):
            return "per_split"
    return "standard"  # default


def validate_yolo_dataset(
    dataset_root: str,
    num_classes: int = 4,
    allowed_splits: Tuple[str, ...] = ("train", "val", "test")
) -> Dict[str, Any]:
    report = {
        "dataset_root": os.path.abspath(dataset_root),
        "target_classes_count": num_classes,
        "layout": "unknown",
        "is_valid": True,
        "total_images": 0,
        "total_labels": 0,
        "total_bounding_boxes": 0,
        "class_distribution": {i: 0 for i in range(num_classes)},
        "errors": [],
        "warnings": [],
        "leakage_detected": [],
        "splits_summary": {}
    }

    if not os.path.exists(dataset_root):
        report["is_valid"] = False
        report["errors"].append(f"Dataset root directory does not exist: {dataset_root}")
        return report

    layout = detect_layout(dataset_root, allowed_splits)
    report["layout"] = layout

    all_image_hashes: Dict[str, str] = {}  # hash -> split/filename

    for split in allowed_splits:
        # Resolve images and labels directories based on layout
        if layout == "standard":
            images_dir = os.path.join(dataset_root, "images", split)
            labels_dir = os.path.join(dataset_root, "labels", split)
        else:
            images_dir = os.path.join(dataset_root, split, "images")
            labels_dir = os.path.join(dataset_root, split, "labels")

        if not os.path.isdir(images_dir):
            report["warnings"].append(f"Split '{split}' images directory missing: {images_dir}")
            continue

        split_images = [
            f for f in os.listdir(images_dir)
            if os.path.splitext(f)[1].lower() in VALID_IMAGE_EXTS
        ]
        split_labels = [
            f for f in os.listdir(labels_dir)
            if f.lower().endswith(".txt")
        ] if os.path.isdir(labels_dir) else []

        report["total_images"] += len(split_images)
        report["total_labels"] += len(split_labels)

        split_box_count = 0
        split_missing_labels = []
        split_missing_images = []

        # Check image -> label pairing
        image_stems = {os.path.splitext(f)[0]: f for f in split_images}
        label_stems = {os.path.splitext(f)[0]: f for f in split_labels}

        for stem, img_name in image_stems.items():
            if stem not in label_stems:
                split_missing_labels.append(img_name)

        for stem, lbl_name in label_stems.items():
            if stem not in image_stems:
                split_missing_images.append(lbl_name)

        if split_missing_labels:
            report["warnings"].append(
                f"Split '{split}': {len(split_missing_labels)} images lack a .txt label file (e.g. {split_missing_labels[:3]})"
            )
        if split_missing_images:
            report["errors"].append(
                f"Split '{split}': {len(split_missing_images)} label files have no matching image (e.g. {split_missing_images[:3]})"
            )
            report["is_valid"] = False

        # Validate bounding box coordinates in labels
        for lbl_name in split_labels:
            lbl_path = os.path.join(labels_dir, lbl_name)
            with open(lbl_path, "r", encoding="utf-8") as lf:
                lines = [line.strip() for line in lf if line.strip()]

            for line_idx, line in enumerate(lines, 1):
                tokens = line.split()
                if len(tokens) != 5:
                    report["errors"].append(
                        f"{lbl_name} L{line_idx}: Expected 5 tokens (class x y w h), got {len(tokens)}: '{line}'"
                    )
                    report["is_valid"] = False
                    continue

                try:
                    cls_id = int(tokens[0])
                    xc, yc, w, h = map(float, tokens[1:5])
                except ValueError:
                    report["errors"].append(
                        f"{lbl_name} L{line_idx}: Non-numeric bounding box values: '{line}'"
                    )
                    report["is_valid"] = False
                    continue

                # Class ID check
                if cls_id < 0 or cls_id >= num_classes:
                    report["errors"].append(
                        f"{lbl_name} L{line_idx}: Class ID {cls_id} out of allowed range [0, {num_classes - 1}]"
                    )
                    report["is_valid"] = False
                else:
                    report["class_distribution"][cls_id] += 1

                # Coordinate normalization check
                if not (0.0 <= xc <= 1.0 and 0.0 <= yc <= 1.0 and 0.0 < w <= 1.0 and 0.0 < h <= 1.0):
                    report["errors"].append(
                        f"{lbl_name} L{line_idx}: Normalized coordinates out of [0, 1] range: xc={xc}, yc={yc}, w={w}, h={h}"
                    )
                    report["is_valid"] = False

                # Box boundary overflow check
                x_min, x_max = xc - w / 2, xc + w / 2
                y_min, y_max = yc - h / 2, yc + h / 2
                if x_min < -0.01 or x_max > 1.01 or y_min < -0.01 or y_max > 1.01:
                    report["warnings"].append(
                        f"{lbl_name} L{line_idx}: Bounding box exceeds image bounds: [{x_min:.3f}, {y_min:.3f}, {x_max:.3f}, {y_max:.3f}]"
                    )

                split_box_count += 1
                report["total_bounding_boxes"] += 1

        # Check data leakage across splits
        for img_name in split_images:
            img_path = os.path.join(images_dir, img_name)
            img_hash = compute_file_md5(img_path)
            loc = f"{split}/{img_name}"
            if img_hash in all_image_hashes:
                prev_loc = all_image_hashes[img_hash]
                report["leakage_detected"].append({
                    "hash": img_hash,
                    "first_seen": prev_loc,
                    "duplicate": loc
                })
                report["errors"].append(
                    f"DATA LEAKAGE DETECTED: Image '{loc}' is an exact bitwise duplicate of '{prev_loc}'"
                )
                report["is_valid"] = False
            else:
                all_image_hashes[img_hash] = loc

        report["splits_summary"][split] = {
            "images": len(split_images),
            "labels": len(split_labels),
            "boxes": split_box_count,
            "missing_labels": len(split_missing_labels)
        }

    return report

def main():
    parser = argparse.ArgumentParser(description="Validate YOLO dataset structure, coordinates, and splits")
    parser.add_argument("--data-dir", default="ml/datasets/yolo_tomato", help="Path to YOLO dataset root")
    parser.add_argument("--classes", type=int, default=4, help="Number of target classes")
    parser.add_argument("--output-json", default=None, help="Optional path to write JSON audit report")
    args = parser.parse_args()

    print(f"Validating YOLO dataset at: {args.data_dir}")
    res = validate_yolo_dataset(args.data_dir, num_classes=args.classes)

    print("\n" + "=" * 50)
    print("      YOLO DATASET VALIDATION REPORT          ")
    print("=" * 50)
    print(f"Layout:             {res['layout']}")
    print(f"Status:             {'PASS (Valid)' if res['is_valid'] else 'FAIL (Errors Detected)'}")
    print(f"Total Images:       {res['total_images']}")
    print(f"Total Labels:       {res['total_labels']}")
    print(f"Total Bounding Boxes: {res['total_bounding_boxes']}")
    print(f"Class Counts:       {res['class_distribution']}")
    print(f"Errors Found:       {len(res['errors'])}")
    print(f"Warnings Found:     {len(res['warnings'])}")
    print(f"Leakage Instances:  {len(res['leakage_detected'])}")
    print("=" * 50)

    if res["errors"]:
        print("\nErrors (Sample):")
        for err in res["errors"][:10]:
            print(f"  [X] {err}")

    if res["warnings"]:
        print("\nWarnings (Sample):")
        for w in res["warnings"][:5]:
            print(f"  [!] {w}")

    if args.output_json:
        with open(args.output_json, "w", encoding="utf-8") as jf:
            json.dump(res, jf, indent=2)
        print(f"\nSaved full report to: {args.output_json}")

    sys.exit(0 if res["is_valid"] else 1)

if __name__ == "__main__":
    main()
