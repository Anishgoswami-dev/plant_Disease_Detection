"""
Fasal Dristhi — Model Evaluation & Verification Suite
Calculates exact Test Accuracy, Macro Precision, Macro Recall, Macro F1,
Per-Class Metrics, and Confusion Matrix on a held-out benchmark test set.
Exports results to ml/evaluation/confusion_matrix.json and .csv.
"""

import os
import sys
import time
import json
import csv
import urllib.request
import urllib.parse
from pathlib import Path
import numpy as np
from PIL import Image
import torch
import torchvision.models as models
from torchvision import transforms
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report
)

ML_DIR = Path(__file__).resolve().parent
MODELS_DIR = ML_DIR / "models"
EVAL_DIR = ML_DIR / "evaluation"
TEST_DATA_DIR = ML_DIR / "test_data" / "heldout_test"
CLASS_INDICES_PATH = MODELS_DIR / "class_indices.json"
CANDIDATE_MODEL_PATH = MODELS_DIR / "plant_disease_model_candidate.pth"
ORIGINAL_MODEL_PATH = MODELS_DIR / "plant_disease_model.pth"

EVAL_DIR.mkdir(parents=True, exist_ok=True)
TEST_DATA_DIR.mkdir(parents=True, exist_ok=True)


def get_image_transform():
    return transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])


def prepare_benchmark_testset(samples_per_class: int = 3):
    """
    Downloads an authentic, held-out test set from the official PlantVillage repository
    with a stratified count per class.
    """
    print(f"[PREPARE] Checking / Preparing held-out test dataset ({samples_per_class} images/class)...")
    with open(CLASS_INDICES_PATH, "r", encoding="utf-8") as f:
        class_map = json.load(f)
    classes = [class_map[str(i)] for i in range(len(class_map))]

    # Fetch git tree
    tree_cache = TEST_DATA_DIR / "tree_cache.json"
    if not tree_cache.exists():
        print("  Fetching official repository tree for authentic file paths...")
        tree_url = "https://api.github.com/repos/spMohanty/PlantVillage-Dataset/git/trees/master?recursive=1"
        req = urllib.request.Request(tree_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
        with open(tree_cache, "w", encoding="utf-8") as f:
            json.dump(data.get("tree", []), f)
        tree = data.get("tree", [])
    else:
        with open(tree_cache, "r", encoding="utf-8") as f:
            tree = json.load(f)

    # Group files by class
    class_files = {cls: [] for cls in classes}
    for item in tree:
        p = item.get("path", "")
        if p.startswith("raw/color/") and item.get("type") == "blob":
            parts = p.split("/")
            if len(parts) >= 3:
                c = parts[2]
                if c in class_files:
                    class_files[c].append(p)

    total_downloaded = 0
    # Download samples
    for idx, cls in enumerate(classes):
        cls_dir = TEST_DATA_DIR / cls
        cls_dir.mkdir(exist_ok=True)
        existing = list(cls_dir.glob("*.jpg")) + list(cls_dir.glob("*.JPG"))
        needed = samples_per_class - len(existing)
        
        if needed > 0 and class_files[cls]:
            # Deterministic selection from the end of the class list (held-out split)
            selected = class_files[cls][-samples_per_class:]
            for rel_path in selected:
                fname = Path(rel_path).name
                dest = cls_dir / fname
                if not dest.exists():
                    encoded_path = "/".join(urllib.parse.quote(part) for part in rel_path.split("/"))
                    raw_url = f"https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/{encoded_path}"
                    try:
                        urllib.request.urlretrieve(raw_url, dest)
                        total_downloaded += 1
                    except Exception as e:
                        print(f"    Failed to download {fname}: {e}")

    print(f"  [DONE] Test benchmark prepared. Total downloaded this run: {total_downloaded}")


def load_model(weights_path: Path) -> torch.nn.Module:
    model = models.mobilenet_v2()
    model.classifier[1] = torch.nn.Linear(1280, 38)
    sd = torch.load(str(weights_path), map_location="cpu")
    model.load_state_dict(sd)
    model.eval()
    return model


def evaluate_model_pipeline(weights_path: Path, model_label: str):
    print("\n" + "=" * 60)
    print(f"EVALUATING MODEL: {model_label}")
    print(f"Weights: {weights_path}")
    print("=" * 60)

    with open(CLASS_INDICES_PATH, "r", encoding="utf-8") as f:
        class_map = json.load(f)
    classes = [class_map[str(i)] for i in range(len(class_map))]
    class_to_idx = {cls: i for i, cls in enumerate(classes)}

    model = load_model(weights_path)
    transform = get_image_transform()

    y_true = []
    y_pred = []
    y_probs = []
    latencies = []

    for cls in classes:
        cls_dir = TEST_DATA_DIR / cls
        images = list(cls_dir.glob("*.jpg")) + list(cls_dir.glob("*.JPG"))
        label_idx = class_to_idx[cls]

        for img_path in images:
            try:
                img = Image.open(img_path).convert("RGB")
                tensor = transform(img).unsqueeze(0)

                t0 = time.perf_counter()
                with torch.no_grad():
                    logits = model(tensor)
                    probs = torch.softmax(logits, dim=1)[0]
                latencies.append((time.perf_counter() - t0) * 1000)

                pred_idx = torch.argmax(probs).item()
                y_true.append(label_idx)
                y_pred.append(pred_idx)
                y_probs.append(probs[pred_idx].item())
            except Exception as e:
                print(f"Error evaluating {img_path}: {e}")

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    y_probs = np.array(y_probs)

    # Compute Metrics
    acc = accuracy_score(y_true, y_pred)
    macro_p, macro_r, macro_f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="macro", zero_division=0
    )
    weighted_p, weighted_r, weighted_f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="weighted", zero_division=0
    )

    per_class_p, per_class_r, per_class_f1, support = precision_recall_fscore_support(
        y_true, y_pred, labels=list(range(len(classes))), average=None, zero_division=0
    )

    cm = confusion_matrix(y_true, y_pred, labels=list(range(len(classes))))
    mean_latency = float(np.mean(latencies))

    print(f"\n--- {model_label} SUMMARY METRICS ---")
    print(f"Total Test Samples:    {len(y_true)}")
    print(f"Accuracy:              {acc*100:.2f}%")
    print(f"Macro Precision:       {macro_p*100:.2f}%")
    print(f"Macro Recall:          {macro_r*100:.2f}%")
    print(f"Macro F1-Score:        {macro_f1*100:.2f}%")
    print(f"Weighted F1-Score:     {weighted_f1*100:.2f}%")
    print(f"Mean CPU Latency:      {mean_latency:.2f} ms/image")
    print(f"Mean Pred Confidence:  {np.mean(y_probs)*100:.2f}%")

    # Save Confusion Matrix
    cm_json_path = EVAL_DIR / "confusion_matrix.json"
    with open(cm_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "classes": classes,
            "matrix": cm.tolist(),
            "accuracy": float(acc),
            "macro_f1": float(macro_f1)
        }, f, indent=2)

    cm_csv_path = EVAL_DIR / "confusion_matrix.csv"
    with open(cm_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Class"] + classes)
        for i, row in enumerate(cm):
            writer.writerow([classes[i]] + row.tolist())

    # Save Class-wise metrics
    per_class_results = []
    for i, cls in enumerate(classes):
        per_class_results.append({
            "class_index": i,
            "class_name": cls,
            "precision": round(float(per_class_p[i]), 4),
            "recall": round(float(per_class_r[i]), 4),
            "f1_score": round(float(per_class_f1[i]), 4),
            "support": int(support[i])
        })

    report_path = EVAL_DIR / f"evaluation_{model_label.lower().replace(' ', '_')}.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump({
            "model": model_label,
            "weights_file": str(weights_path),
            "total_samples": len(y_true),
            "accuracy": round(float(acc), 4),
            "macro_precision": round(float(macro_p), 4),
            "macro_recall": round(float(macro_r), 4),
            "macro_f1": round(float(macro_f1), 4),
            "weighted_f1": round(float(weighted_f1), 4),
            "mean_latency_ms": round(mean_latency, 2),
            "mean_confidence": round(float(np.mean(y_probs)), 4),
            "confusion_matrix_path": str(cm_csv_path),
            "per_class": per_class_results
        }, f, indent=2)

    print(f"\n[SAVED] Confusion Matrix JSON: {cm_json_path}")
    print(f"[SAVED] Confusion Matrix CSV:  {cm_csv_path}")
    print(f"[SAVED] Evaluation Report:     {report_path}")

    return {
        "accuracy": acc,
        "macro_f1": macro_f1,
        "macro_precision": macro_p,
        "macro_recall": macro_r,
        "mean_latency": mean_latency,
        "per_class": per_class_results,
        "cm": cm
    }


def main():
    prepare_benchmark_testset(samples_per_class=3)
    
    # 1. Evaluate Candidate Checkpoint
    cand_results = evaluate_model_pipeline(CANDIDATE_MODEL_PATH, "Candidate_PlantVillage_Model")
    
    # 2. Evaluate Original Untrained Model for Comparison
    orig_results = evaluate_model_pipeline(ORIGINAL_MODEL_PATH, "Untrained_Original_Model")

    print("\n" + "=" * 60)
    print("HEAD-TO-HEAD COMPARISON ON AUTHENTIC HELD-OUT TEST BENCHMARK")
    print("=" * 60)
    print(f"{'Metric':<22} | {'Untrained Original':<20} | {'Candidate Model':<20}")
    print("-" * 68)
    print(f"{'Accuracy':<22} | {orig_results['accuracy']*100:<19.2f}% | {cand_results['accuracy']*100:<19.2f}%")
    print(f"{'Macro Precision':<22} | {orig_results['macro_precision']*100:<19.2f}% | {cand_results['macro_precision']*100:<19.2f}%")
    print(f"{'Macro Recall':<22} | {orig_results['macro_recall']*100:<19.2f}% | {cand_results['macro_recall']*100:<19.2f}%")
    print(f"{'Macro F1-Score':<22} | {orig_results['macro_f1']*100:<19.2f}% | {cand_results['macro_f1']*100:<19.2f}%")
    print(f"{'Mean Latency (CPU)':<22} | {orig_results['mean_latency']:<17.2f} ms | {cand_results['mean_latency']:<17.2f} ms")
    print("=" * 60)


if __name__ == "__main__":
    main()
