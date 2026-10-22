"""
FASAL DRISTHI — Candidate Model Independent Evaluator
Evaluates a model checkpoint on the independent test partition or held-out benchmark.
Computes:
1. Top-1 Accuracy
2. Balanced Accuracy
3. Macro Precision, Recall, F1
4. Per-Class F1 Table (all 38 classes)
5. Top-3 Accuracy
6. Confusion Matrix (JSON & CSV)
7. CPU Latency Profiling (100 iterations)
"""

import os, sys, time, json, argparse
from pathlib import Path
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
from sklearn.metrics import (
    accuracy_score, balanced_accuracy_score, f1_score,
    precision_recall_fscore_support, confusion_matrix
)

ML_ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ML_ROOT / "datasets" / "plantvillage_isolated" / "splits_manifest.json"
CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"
EVAL_DIR = ML_ROOT / "evaluation"
EVAL_DIR.mkdir(parents=True, exist_ok=True)

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

eval_tf = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
])

class ManifestDataset(Dataset):
    def __init__(self, samples, root_dir, transform=None):
        self.samples = samples
        self.root_dir = Path(root_dir)
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        item = self.samples[idx]
        img_path = self.root_dir / item["path"]
        with Image.open(img_path) as img:
            img = img.convert("RGB")
        if self.transform:
            img = self.transform(img)
        label = item["class_idx"]
        return img, label, item["path"]


def load_model(checkpoint_path: str, arch: str = "efficientnet", num_classes: int = 38):
    device = torch.device("cpu")
    if arch == "efficientnet":
        model = models.efficientnet_b0(weights=None)
        in_features = model.classifier[1].in_features
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features, num_classes)
        )
    elif arch == "mobilenet":
        model = models.mobilenet_v2(weights=None)
        model.classifier[1] = nn.Linear(model.last_channel, num_classes)
    else:
        raise ValueError(f"Unknown architecture: {arch}")

    state_dict = torch.load(checkpoint_path, map_location=device)
    model.load_state_dict(state_dict)
    model.eval()
    return model


def evaluate(
    checkpoint_path: str,
    arch: str = "efficientnet",
    split: str = "val",
    output_prefix: str = "candidate_efficientnet"
):
    print("=" * 80)
    print(f"CANDIDATE MODEL INDEPENDENT EVALUATION ({arch.upper()})")
    print(f"Checkpoint: {checkpoint_path}")
    print(f"Evaluation Split: {split.upper()}")
    print("=" * 80)

    # Load class mapping
    with open(CLASS_INDICES, "r", encoding="utf-8") as f:
        class_map = json.load(f)
    classes = [class_map[str(i)] for i in range(len(class_map))]

    # Load manifest
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    if split == "val":
        samples = manifest["val_samples"]
    elif split == "test":
        samples = manifest["test_samples"]
    elif split == "heldout":
        heldout_dir = ML_ROOT / "test_data" / "heldout_test"
        samples = []
        for cls_idx, cls_name in enumerate(classes):
            c_dir = heldout_dir / cls_name
            if c_dir.exists():
                for p in c_dir.iterdir():
                    if p.suffix.lower() in [".jpg", ".jpeg", ".png"]:
                        samples.append({
                            "path": str(p.relative_to(ML_ROOT)),
                            "class_name": cls_name,
                            "class_idx": cls_idx
                        })
    else:
        raise ValueError(f"Invalid split: {split}")

    print(f"[DATA] Evaluating on {len(samples)} samples across {len(classes)} classes...")

    dataset = ManifestDataset(samples, ML_ROOT, transform=eval_tf)
    loader = DataLoader(dataset, batch_size=32, shuffle=False, num_workers=0)

    model = load_model(checkpoint_path, arch=arch, num_classes=len(classes))

    all_preds = []
    all_top3 = []
    all_targets = []
    latencies = []

    print("[EVAL] Running inference...")
    with torch.no_grad():
        for images, targets, paths in loader:
            t0 = time.perf_counter()
            outputs = model(images)
            latencies.append((time.perf_counter() - t0) / images.size(0) * 1000)

            top3 = torch.topk(outputs, 3, dim=1).indices.cpu().numpy()
            preds = top3[:, 0]

            all_preds.extend(preds)
            all_top3.extend(top3)
            all_targets.extend(targets.numpy())

    all_targets = np.array(all_targets)
    all_preds = np.array(all_preds)

    # Metrics
    top1_acc = accuracy_score(all_targets, all_preds)
    balanced_acc = balanced_accuracy_score(all_targets, all_preds)
    macro_f1 = f1_score(all_targets, all_preds, average="macro", zero_division=0)
    weighted_f1 = f1_score(all_targets, all_preds, average="weighted", zero_division=0)
    p_macro, r_macro, _, _ = precision_recall_fscore_support(all_targets, all_preds, average="macro", zero_division=0)

    top3_correct = sum(1 for t, top3_list in zip(all_targets, all_top3) if t in top3_list)
    top3_acc = top3_correct / len(all_targets)

    # Per-class metrics
    p_per, r_per, f1_per, support_per = precision_recall_fscore_support(
        all_targets, all_preds, labels=list(range(len(classes))), zero_division=0
    )

    per_class_metrics = {}
    for idx, cls_name in enumerate(classes):
        per_class_metrics[cls_name] = {
            "precision": round(float(p_per[idx]) * 100, 2),
            "recall": round(float(r_per[idx]) * 100, 2),
            "f1_score": round(float(f1_per[idx]) * 100, 2),
            "sample_count": int(support_per[idx])
        }

    # Confusion matrix
    cm = confusion_matrix(all_targets, all_preds, labels=list(range(len(classes))))

    # Latency
    mean_lat = float(np.mean(latencies))
    p50_lat = float(np.percentile(latencies, 50))
    p95_lat = float(np.percentile(latencies, 95))

    results = {
        "architecture": arch,
        "checkpoint": str(checkpoint_path),
        "split": split,
        "samples_evaluated": len(all_targets),
        "top1_accuracy": round(top1_acc * 100, 2),
        "top3_accuracy": round(top3_acc * 100, 2),
        "balanced_accuracy": round(balanced_acc * 100, 2),
        "macro_precision": round(p_macro * 100, 2),
        "macro_recall": round(r_macro * 100, 2),
        "macro_f1": round(macro_f1 * 100, 2),
        "weighted_f1": round(weighted_f1 * 100, 2),
        "latency_ms": {
            "mean": round(mean_lat, 2),
            "p50": round(p50_lat, 2),
            "p95": round(p95_lat, 2)
        },
        "per_class_metrics": per_class_metrics,
        "confusion_matrix": cm.tolist()
    }

    report_path = EVAL_DIR / f"{output_prefix}_{split}_eval.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    # CSV confusion matrix
    cm_csv_path = EVAL_DIR / f"{output_prefix}_{split}_confusion_matrix.csv"
    np.savetxt(cm_csv_path, cm, delimiter=",", fmt="%d")

    print("\n" + "=" * 60)
    print("EVALUATION RESULTS")
    print(f"  Top-1 Accuracy:     {top1_acc*100:.2f}%")
    print(f"  Balanced Accuracy:  {balanced_acc*100:.2f}%")
    print(f"  Macro-F1 Score:     {macro_f1*100:.2f}%")
    print(f"  Macro-Precision:    {p_macro*100:.2f}%")
    print(f"  Macro-Recall:       {r_macro*100:.2f}%")
    print(f"  Top-3 Accuracy:     {top3_acc*100:.2f}%")
    print(f"  Mean CPU Latency:   {mean_lat:.2f} ms")
    print(f"  Report saved to:    {report_path}")
    print("=" * 60)
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint", required=True)
    parser.add_argument("--arch", default="efficientnet", choices=["efficientnet", "mobilenet"])
    parser.add_argument("--split", default="val", choices=["val", "test", "heldout"])
    parser.add_argument("--output_prefix", default="candidate_efficientnet")
    args = parser.parse_args()

    evaluate(args.checkpoint, arch=args.arch, split=args.split, output_prefix=args.output_prefix)
