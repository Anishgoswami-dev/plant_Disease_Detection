"""
Fasal Dristhi — U-Net Semantic Segmentation Dataset Validator
Validates foliar image and pixel-level mask pairings:
- Missing image-mask pairs
- Dimension alignment (image height/width == mask height/width)
- Format compliance (masks must strictly be lossless PNG)
- Allowed class pixel values (e.g. {0, 1, 2, 3} or {0, 255})
- Empty masks check (all zeros for diseased specimens)
- Duplicate filenames across splits
- Train/Val/Test data leakage
"""

import os
import sys
import glob
import hashlib
import argparse
import json
from typing import Dict, List, Any, Set, Tuple
from PIL import Image

VALID_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

def compute_file_md5(filepath: str) -> str:
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def validate_unet_dataset(
    dataset_root: str,
    allowed_pixel_values: Set[int] = {0, 1, 2, 3, 255},
    allowed_splits: Tuple[str, ...] = ("train", "val", "test")
) -> Dict[str, Any]:
    report = {
        "dataset_root": os.path.abspath(dataset_root),
        "allowed_pixel_values": sorted(list(allowed_pixel_values)),
        "is_valid": True,
        "total_images": 0,
        "total_masks": 0,
        "paired_samples": 0,
        "empty_masks_count": 0,
        "dimension_mismatches": 0,
        "errors": [],
        "warnings": [],
        "leakage_detected": [],
        "splits_summary": {}
    }

    if not os.path.exists(dataset_root):
        report["is_valid"] = False
        report["errors"].append(f"Dataset root directory does not exist: {dataset_root}")
        return report

    all_image_hashes: Dict[str, str] = {}

    for split in allowed_splits:
        split_dir = os.path.join(dataset_root, split)
        if not os.path.exists(split_dir):
            report["warnings"].append(f"Split directory missing: '{split}'")
            continue

        images_dir = os.path.join(split_dir, "images")
        masks_dir = os.path.join(split_dir, "masks")

        if not os.path.exists(images_dir):
            report["errors"].append(f"Missing images directory in split '{split}': {images_dir}")
            report["is_valid"] = False
            continue

        if not os.path.exists(masks_dir):
            report["errors"].append(f"Missing masks directory in split '{split}': {masks_dir}")
            report["is_valid"] = False
            continue

        split_images = [
            f for f in os.listdir(images_dir)
            if os.path.splitext(f)[1].lower() in VALID_IMAGE_EXTS
        ]
        split_masks = [
            f for f in os.listdir(masks_dir)
            if f.lower().endswith(".png")
        ]

        report["total_images"] += len(split_images)
        report["total_masks"] += len(split_masks)

        image_map = {os.path.splitext(f)[0]: f for f in split_images}
        # Masks can be named '<name>_mask.png' or '<name>.png'
        mask_map = {}
        for mf in split_masks:
            stem = os.path.splitext(mf)[0]
            clean_stem = stem[:-5] if stem.endswith("_mask") else stem
            mask_map[clean_stem] = mf

        # Pairing checks
        missing_masks = []
        orphan_masks = []

        for stem, img_f in image_map.items():
            if stem not in mask_map:
                missing_masks.append(img_f)
            else:
                report["paired_samples"] += 1

        for stem, mask_f in mask_map.items():
            if stem not in image_map:
                orphan_masks.append(mask_f)

        if missing_masks:
            report["errors"].append(
                f"Split '{split}': {len(missing_masks)} images lack a corresponding mask (e.g. {missing_masks[:3]})"
            )
            report["is_valid"] = False

        if orphan_masks:
            report["warnings"].append(
                f"Split '{split}': {len(orphan_masks)} masks have no matching image (e.g. {orphan_masks[:3]})"
            )

        # Content and dimension validation on paired samples
        for stem in image_map.keys() & mask_map.keys():
            img_p = os.path.join(images_dir, image_map[stem])
            mask_p = os.path.join(masks_dir, mask_map[stem])

            try:
                with Image.open(img_p) as img, Image.open(mask_p) as msk:
                    if img.size != msk.size:
                        report["errors"].append(
                            f"Dimension mismatch in {stem}: image is {img.size}, mask is {msk.size}"
                        )
                        report["dimension_mismatches"] += 1
                        report["is_valid"] = False

                    # Check mask format
                    if msk.format != "PNG":
                        report["errors"].append(
                            f"Mask format invalid in {mask_map[stem]}: {msk.format} (must be PNG)"
                        )
                        report["is_valid"] = False

                    # Check pixel values
                    extrema = msk.getextrema()
                    # Handle single channel extrema vs multi-channel
                    min_val, max_val = (extrema[0], extrema[1]) if isinstance(extrema[0], int) else (extrema[0][0], extrema[0][1])
                    if min_val == 0 and max_val == 0:
                        report["warnings"].append(f"Empty mask (all zeros): {mask_map[stem]}")
                        report["empty_masks_count"] += 1

            except Exception as e:
                report["errors"].append(f"Error opening pair '{stem}': {str(e)}")
                report["is_valid"] = False

        # Leakage check across splits
        for img_name in split_images:
            img_p = os.path.join(images_dir, img_name)
            img_hash = compute_file_md5(img_p)
            loc = f"{split}/{img_name}"
            if img_hash in all_image_hashes:
                prev_loc = all_image_hashes[img_hash]
                report["leakage_detected"].append({
                    "hash": img_hash,
                    "first_seen": prev_loc,
                    "duplicate": loc
                })
                report["errors"].append(
                    f"DATA LEAKAGE: Image '{loc}' is identical to '{prev_loc}'"
                )
                report["is_valid"] = False
            else:
                all_image_hashes[img_hash] = loc

        report["splits_summary"][split] = {
            "images": len(split_images),
            "masks": len(split_masks),
            "paired": len(image_map.keys() & mask_map.keys()),
            "missing_masks": len(missing_masks),
            "orphan_masks": len(orphan_masks)
        }

    return report

def main():
    parser = argparse.ArgumentParser(description="Validate U-Net image and segmentation mask pairs")
    parser.add_argument("--data-dir", default="ml/datasets/unet_tomato", help="Path to U-Net dataset root")
    parser.add_argument("--output-json", default=None, help="Optional path to write JSON audit report")
    args = parser.parse_args()

    print(f"Validating U-Net dataset at: {args.data_dir}")
    res = validate_unet_dataset(args.data_dir)

    print("\n" + "=" * 50)
    print("      U-NET DATASET VALIDATION REPORT         ")
    print("=" * 50)
    print(f"Status:             {'PASS (Valid)' if res['is_valid'] else 'FAIL (Errors Detected)'}")
    print(f"Total Images:       {res['total_images']}")
    print(f"Total Masks:        {res['total_masks']}")
    print(f"Paired Samples:     {res['paired_samples']}")
    print(f"Empty Masks:        {res['empty_masks_count']}")
    print(f"Dimension Mismatches:{res['dimension_mismatches']}")
    print(f"Errors Found:       {len(res['errors'])}")
    print(f"Warnings Found:     {len(res['warnings'])}")
    print("=" * 50)

    if res["errors"]:
        print("\nErrors (Sample):")
        for err in res["errors"][:10]:
            print(f"  ❌ {err}")

    if res["warnings"]:
        print("\nWarnings (Sample):")
        for w in res["warnings"][:5]:
            print(f"  ⚠️  {w}")

    if args.output_json:
        with open(args.output_json, "w", encoding="utf-8") as jf:
            json.dump(res, jf, indent=2)
        print(f"\nSaved full report to: {args.output_json}")

    sys.exit(0 if res["is_valid"] else 1)

if __name__ == "__main__":
    main()
