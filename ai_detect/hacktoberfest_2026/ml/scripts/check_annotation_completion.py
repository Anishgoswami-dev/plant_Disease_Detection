"""
Fasal Dristhi — YOLO Manual Annotation Completion & Verification Checker

Verifies post-annotation completion for YOLO datasets:
- Checks whether each image has an exact matching .txt label file.
- Validates that healthy/negative control leaves safely use EMPTY (0-byte) label files.
- Validates that diseased images have at least 1 valid bounding box.
- Checks coordinate bounds (0 <= x, y, w, h <= 1) and valid class IDs.
- Calculates exact completion percentages per split and overall.
- NEVER fabricates annotations or bounding boxes.
"""

import os
import sys
import argparse
import json
import csv
from pathlib import Path
from typing import Dict, List, Any, Tuple

VALID_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def check_dataset_completion(
    dataset_root: str,
    num_classes: int = 4,
    allowed_splits: Tuple[str, ...] = ("train", "val", "test")
) -> Dict[str, Any]:
    dataset_root = os.path.abspath(dataset_root)

    # Detect directory layout
    is_standard = os.path.isdir(os.path.join(dataset_root, "images"))

    report = {
        "dataset_root": dataset_root,
        "layout": "standard" if is_standard else "per_split",
        "num_classes": num_classes,
        "total_images": 0,
        "total_labels_found": 0,
        "completed_images": 0,
        "healthy_controls_verified": 0,
        "missing_labels": 0,
        "empty_diseased_labels": 0,
        "invalid_labels": 0,
        "completion_percentage": 0.0,
        "is_ready_for_training": False,
        "splits": {},
        "file_details": []
    }

    if not os.path.isdir(dataset_root):
        report["error"] = f"Directory not found: {dataset_root}"
        return report

    # Check if a manifest exists to identify known healthy control images
    manifest_map = {}
    manifest_path = os.path.join(dataset_root, "pilot_manifest.csv")
    if os.path.isfile(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as mf:
                reader = csv.DictReader(mf)
                for row in reader:
                    manifest_map[row["image_id"]] = row.get("disease", "").lower()
        except Exception:
            pass

    for split in allowed_splits:
        if is_standard:
            img_dir = os.path.join(dataset_root, "images", split)
            lbl_dir = os.path.join(dataset_root, "labels", split)
        else:
            img_dir = os.path.join(dataset_root, split, "images")
            lbl_dir = os.path.join(dataset_root, split, "labels")

        split_summary = {
            "images": 0,
            "labels_present": 0,
            "completed": 0,
            "healthy_controls": 0,
            "missing_labels": 0,
            "empty_diseased": 0,
            "invalid": 0,
            "completion_pct": 0.0
        }

        if not os.path.isdir(img_dir):
            report["splits"][split] = split_summary
            continue

        images = [f for f in os.listdir(img_dir) if os.path.splitext(f)[1].lower() in VALID_IMAGE_EXTS]
        split_summary["images"] = len(images)
        report["total_images"] += len(images)

        for img_name in sorted(images):
            stem = os.path.splitext(img_name)[0]
            lbl_name = stem + ".txt"
            lbl_path = os.path.join(lbl_dir, lbl_name)

            is_known_healthy = (
                "healthy" in stem.lower() or
                manifest_map.get(img_name, "") == "healthy"
            )

            record = {
                "image_filename": img_name,
                "split": split,
                "is_healthy_control": is_known_healthy,
                "label_filename": lbl_name,
                "label_exists": False,
                "box_count": 0,
                "status": "MISSING_LABEL",
                "issues": []
            }

            if not os.path.isfile(lbl_path):
                record["status"] = "MISSING_LABEL"
                split_summary["missing_labels"] += 1
                report["missing_labels"] += 1
                report["file_details"].append(record)
                continue

            record["label_exists"] = True
            split_summary["labels_present"] += 1
            report["total_labels_found"] += 1

            # Read label content
            try:
                with open(lbl_path, "r", encoding="utf-8") as lf:
                    lines = [line.strip() for line in lf if line.strip()]
            except Exception as e:
                record["status"] = "UNREADABLE_LABEL"
                record["issues"].append(str(e))
                split_summary["invalid"] += 1
                report["invalid_labels"] += 1
                report["file_details"].append(record)
                continue

            record["box_count"] = len(lines)

            # Case A: Zero bounding boxes in label
            if len(lines) == 0:
                if is_known_healthy:
                    record["status"] = "HEALTHY_CONTROL_VERIFIED"
                    split_summary["healthy_controls"] += 1
                    split_summary["completed"] += 1
                    report["healthy_controls_verified"] += 1
                    report["completed_images"] += 1
                else:
                    record["status"] = "EMPTY_DISEASED_LABEL"
                    record["issues"].append("Diseased leaf has 0 bounding boxes. If truly healthy, update manifest.")
                    split_summary["empty_diseased"] += 1
                    report["empty_diseased_labels"] += 1
                report["file_details"].append(record)
                continue

            # Case B: Diseased leaf with boxes — validate each box
            box_errors = []
            for line_idx, line in enumerate(lines, 1):
                tokens = line.split()
                if len(tokens) != 5:
                    box_errors.append(f"L{line_idx}: Expected 5 values (class x y w h), got {len(tokens)}")
                    continue

                try:
                    cls_id = int(tokens[0])
                    xc, yc, w, h = map(float, tokens[1:5])
                except ValueError:
                    box_errors.append(f"L{line_idx}: Non-numeric box coordinates")
                    continue

                if cls_id < 0 or cls_id >= num_classes:
                    box_errors.append(f"L{line_idx}: Class {cls_id} out of range [0, {num_classes-1}]")

                if not (0.0 <= xc <= 1.0 and 0.0 <= yc <= 1.0 and 0.0 < w <= 1.0 and 0.0 < h <= 1.0):
                    box_errors.append(f"L{line_idx}: Box values not normalized to [0, 1]")

            if box_errors:
                record["status"] = "INVALID_BOX_FORMAT"
                record["issues"].extend(box_errors)
                split_summary["invalid"] += 1
                report["invalid_labels"] += 1
            else:
                record["status"] = "COMPLETED_ANNOTATION"
                split_summary["completed"] += 1
                report["completed_images"] += 1

            report["file_details"].append(record)

        if split_summary["images"] > 0:
            split_summary["completion_pct"] = round(
                (split_summary["completed"] / split_summary["images"]) * 100, 2
            )
        report["splits"][split] = split_summary

    if report["total_images"] > 0:
        report["completion_percentage"] = round(
            (report["completed_images"] / report["total_images"]) * 100, 2
        )

    # Readiness condition: All images must be verified and 0 errors/missing
    report["is_ready_for_training"] = (
        report["total_images"] > 0 and
        report["completed_images"] == report["total_images"] and
        report["missing_labels"] == 0 and
        report["invalid_labels"] == 0 and
        report["empty_diseased_labels"] == 0
    )

    return report


def main():
    parser = argparse.ArgumentParser(description="Check YOLO manual annotation completion status")
    parser.add_argument(
        "--data-dir",
        default=str(Path(__file__).resolve().parent.parent / "datasets" / "yolo_pilot"),
        help="Path to YOLO dataset directory"
    )
    parser.add_argument("--classes", type=int, default=4, help="Number of target disease classes")
    parser.add_argument("--output-csv", default=None, help="Optional path to output per-file status CSV")
    parser.add_argument("--output-json", default=None, help="Optional path to output summary JSON")
    args = parser.parse_args()

    print(f"Auditing annotation completion at: {args.data_dir}")
    report = check_dataset_completion(args.data_dir, num_classes=args.classes)

    print("\n" + "=" * 60)
    print("       FASAL DRISTHI — ANNOTATION COMPLETION REPORT       ")
    print("=" * 60)
    print(f"Dataset Path:             {report.get('dataset_root')}")
    print(f"Directory Layout:         {report.get('layout')}")
    print(f"Total Images in Dataset:  {report.get('total_images')}")
    print(f"Total Labels Found:       {report.get('total_labels_found')}")
    print(f"Fully Completed Images:   {report.get('completed_images')}")
    print(f"  - Diseased with Boxes:  {report.get('completed_images') - report.get('healthy_controls_verified')}")
    print(f"  - Healthy Controls:     {report.get('healthy_controls_verified')} (valid empty labels)")
    print(f"Missing Labels:           {report.get('missing_labels')}")
    print(f"Empty Diseased Labels:    {report.get('empty_diseased_labels')}")
    print(f"Invalid Labels:           {report.get('invalid_labels')}")
    print(f"Overall Completion:       {report.get('completion_percentage')}%")
    print("-" * 60)
    print("Split Progress:")
    for split_name, s in report.get("splits", {}).items():
        print(f"  {split_name:6s}: {s['completed']}/{s['images']} completed ({s['completion_pct']}%) | Missing: {s['missing_labels']}")
    print("=" * 60)

    if report.get("is_ready_for_training"):
        print(">> VERDICT: [READY] All images annotated and validated! Ready for YOLO training.")
    else:
        print(">> VERDICT: [NOT READY] Manual annotation has NOT been completed.")
        print("   Human manual annotation must be performed in CVAT or Roboflow.")
        print("   Zero fake/synthetic annotations are permitted.")
    print("=" * 60)

    if args.output_csv and report.get("file_details"):
        with open(args.output_csv, "w", newline="", encoding="utf-8") as cf:
            writer = csv.DictWriter(
                cf,
                fieldnames=["image_filename", "split", "is_healthy_control", "label_filename",
                            "label_exists", "box_count", "status", "issues"]
            )
            writer.writeheader()
            for row in report["file_details"]:
                row_copy = dict(row)
                row_copy["issues"] = "; ".join(row_copy["issues"])
                writer.writerow(row_copy)
        print(f"\nWrote per-file completion status to: {args.output_csv}")

    if args.output_json:
        with open(args.output_json, "w", encoding="utf-8") as jf:
            json.dump(report, jf, indent=2)
        print(f"Wrote summary JSON report to: {args.output_json}")


if __name__ == "__main__":
    main()
