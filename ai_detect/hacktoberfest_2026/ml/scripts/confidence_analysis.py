"""
FASAL DRISTHI — Confidence & Calibration Analysis
Analyzes prediction confidence distributions on the independent test set.
Does NOT modify any model or dataset.

Outputs:
  - evaluation/confidence_analysis.json
  - evaluation/confidence_histogram.png
  - evaluation/calibration_curve.png
"""

import os, json, time
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

ML_ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ML_ROOT / "datasets" / "plantvillage_isolated" / "splits_manifest.json"
CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"
EVAL_DIR = ML_ROOT / "evaluation"
EVAL_DIR.mkdir(parents=True, exist_ok=True)

CHECKPOINT = ML_ROOT / "models" / "plant_disease_candidate_efficientnet.pth"

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
        return img, item["class_idx"], item["path"]


def main():
    print("=" * 70)
    print("CONFIDENCE & CALIBRATION ANALYSIS — EfficientNet-B0 Candidate")
    print("=" * 70)

    # Load class mapping
    with open(CLASS_INDICES, "r", encoding="utf-8") as f:
        class_map = json.load(f)
    classes = [class_map[str(i)] for i in range(len(class_map))]

    # Load manifest — test split
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    samples = manifest["test_samples"]
    print(f"[DATA] {len(samples)} test samples, {len(classes)} classes")

    dataset = ManifestDataset(samples, ML_ROOT, transform=eval_tf)
    loader = DataLoader(dataset, batch_size=32, shuffle=False, num_workers=0)

    # Load model
    model = models.efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_features, len(classes))
    )
    state_dict = torch.load(str(CHECKPOINT), map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()

    # Collect predictions
    all_confs = []       # top-1 confidence (softmax prob)
    all_top3_confs = []  # top-3 confidence values
    all_preds = []       # predicted class idx
    all_top3_preds = []  # top-3 predicted class indices
    all_targets = []
    all_entropies = []   # prediction entropy
    all_margins = []     # margin between top-1 and top-2

    print("[EVAL] Running inference with softmax analysis...")
    with torch.no_grad():
        for batch_idx, (images, targets, paths) in enumerate(loader):
            logits = model(images)
            probs = F.softmax(logits, dim=1)

            # Top-3
            top3_vals, top3_idx = torch.topk(probs, 3, dim=1)

            for i in range(images.size(0)):
                p = probs[i].numpy()
                top1_conf = float(top3_vals[i, 0])
                top2_conf = float(top3_vals[i, 1])
                top3_conf_val = float(top3_vals[i, 2])
                pred = int(top3_idx[i, 0])
                target = int(targets[i])

                all_confs.append(top1_conf)
                all_top3_confs.append([top1_conf, top2_conf, top3_conf_val])
                all_top3_preds.append(top3_idx[i].numpy().tolist())
                all_preds.append(pred)
                all_targets.append(target)

                # Entropy: -sum(p * log(p))
                entropy = float(-np.sum(p * np.log(p + 1e-12)))
                all_entropies.append(entropy)

                # Margin
                all_margins.append(top1_conf - top2_conf)

            if (batch_idx + 1) % 50 == 0:
                print(f"  Processed {(batch_idx+1)*32}/{len(samples)} images...")

    all_confs = np.array(all_confs)
    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)
    all_entropies = np.array(all_entropies)
    all_margins = np.array(all_margins)
    correct = (all_preds == all_targets)

    print(f"\n[STATS] Total predictions: {len(all_confs)}")
    print(f"[STATS] Overall accuracy: {correct.mean()*100:.2f}%")

    # ── Confidence Distribution ──────────────────────────────────────────
    bins = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.01]
    bin_labels = ["0-10%", "10-20%", "20-30%", "30-40%", "40-50%",
                  "50-60%", "60-70%", "70-80%", "80-90%", "90-95%", "95-100%"]

    conf_distribution = {}
    for lo, hi, label in zip(bins[:-1], bins[1:], bin_labels):
        mask = (all_confs >= lo) & (all_confs < hi)
        count = int(mask.sum())
        acc = float(correct[mask].mean() * 100) if count > 0 else 0.0
        conf_distribution[label] = {
            "count": count,
            "pct_of_total": round(count / len(all_confs) * 100, 2),
            "accuracy_in_bin": round(acc, 2)
        }

    # ── Threshold Analysis ───────────────────────────────────────────────
    thresholds = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95]
    threshold_analysis = {}
    for t in thresholds:
        above = all_confs >= t
        n_above = int(above.sum())
        n_below = int((~above).sum())
        acc_above = float(correct[above].mean() * 100) if n_above > 0 else 0.0
        acc_below = float(correct[~above].mean() * 100) if n_below > 0 else 0.0
        coverage = n_above / len(all_confs) * 100
        threshold_analysis[str(t)] = {
            "predictions_above": n_above,
            "predictions_below": n_below,
            "accuracy_above": round(acc_above, 2),
            "accuracy_below": round(acc_below, 2),
            "coverage_pct": round(coverage, 2)
        }

    # ── Top-1 vs Top-3 Disagreement ─────────────────────────────────────
    top1_correct = correct
    top3_correct = np.array([t in top3 for t, top3 in zip(all_targets, all_top3_preds)])
    top1_wrong_top3_right = (~top1_correct) & top3_correct
    top1_wrong_top3_wrong = (~top1_correct) & (~top3_correct)

    disagreement = {
        "top1_correct": int(top1_correct.sum()),
        "top1_wrong_but_top3_correct": int(top1_wrong_top3_right.sum()),
        "both_wrong": int(top1_wrong_top3_wrong.sum()),
        "top3_rescue_rate": round(float(top1_wrong_top3_right.sum()) / max(1, int((~top1_correct).sum())) * 100, 2),
        "avg_confidence_when_top1_correct": round(float(all_confs[top1_correct].mean() * 100), 2),
        "avg_confidence_when_top1_wrong": round(float(all_confs[~top1_correct].mean() * 100), 2),
        "avg_margin_when_correct": round(float(all_margins[top1_correct].mean() * 100), 2),
        "avg_margin_when_wrong": round(float(all_margins[~top1_correct].mean() * 100), 2),
    }

    # ── Entropy Analysis ─────────────────────────────────────────────────
    entropy_stats = {
        "mean": round(float(all_entropies.mean()), 4),
        "median": round(float(np.median(all_entropies)), 4),
        "p95": round(float(np.percentile(all_entropies, 95)), 4),
        "max": round(float(all_entropies.max()), 4),
        "mean_when_correct": round(float(all_entropies[correct].mean()), 4),
        "mean_when_wrong": round(float(all_entropies[~correct].mean()), 4),
    }

    # ── Per-class confidence ─────────────────────────────────────────────
    per_class_conf = {}
    for idx, cls_name in enumerate(classes):
        mask = all_targets == idx
        if mask.sum() == 0:
            continue
        cls_confs = all_confs[mask]
        cls_correct = correct[mask]
        per_class_conf[cls_name] = {
            "mean_confidence": round(float(cls_confs.mean() * 100), 2),
            "median_confidence": round(float(np.median(cls_confs) * 100), 2),
            "min_confidence": round(float(cls_confs.min() * 100), 2),
            "accuracy": round(float(cls_correct.mean() * 100), 2),
            "overconfident_wrong": int(((cls_confs >= 0.9) & (~cls_correct)).sum()),
            "low_conf_correct": int(((cls_confs < 0.5) & cls_correct).sum()),
            "sample_count": int(mask.sum())
        }

    # ── Calibration Data (10 bins) ────────────────────────────────────────
    cal_bins = np.linspace(0, 1, 11)
    calibration = []
    for lo, hi in zip(cal_bins[:-1], cal_bins[1:]):
        mask = (all_confs >= lo) & (all_confs < hi)
        n = int(mask.sum())
        if n > 0:
            avg_conf = float(all_confs[mask].mean())
            avg_acc = float(correct[mask].mean())
        else:
            avg_conf = float((lo + hi) / 2)
            avg_acc = 0.0
        calibration.append({
            "bin_lo": round(float(lo), 2),
            "bin_hi": round(float(hi), 2),
            "count": n,
            "avg_confidence": round(avg_conf, 4),
            "avg_accuracy": round(avg_acc, 4)
        })

    # Expected Calibration Error
    ece = 0.0
    for b in calibration:
        if b["count"] > 0:
            ece += (b["count"] / len(all_confs)) * abs(b["avg_confidence"] - b["avg_accuracy"])
    ece = round(ece * 100, 2)

    # ── Save Results ─────────────────────────────────────────────────────
    results = {
        "model": "EfficientNet-B0 Candidate",
        "checkpoint": str(CHECKPOINT),
        "test_samples": len(all_confs),
        "overall_accuracy": round(float(correct.mean() * 100), 2),
        "confidence_distribution": conf_distribution,
        "threshold_analysis": threshold_analysis,
        "top1_vs_top3": disagreement,
        "entropy_stats": entropy_stats,
        "calibration": calibration,
        "expected_calibration_error_pct": ece,
        "per_class_confidence": per_class_conf
    }

    out_path = EVAL_DIR / "confidence_analysis.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\n[SAVED] {out_path}")

    # ── Plot: Confidence Histogram ────────────────────────────────────────
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))

    # Left: confidence histogram colored by correct/wrong
    axes[0].hist(all_confs[correct], bins=50, alpha=0.7, color='#2ecc71', label='Correct', edgecolor='white')
    axes[0].hist(all_confs[~correct], bins=50, alpha=0.7, color='#e74c3c', label='Wrong', edgecolor='white')
    axes[0].axvline(x=0.5, color='orange', linestyle='--', linewidth=2, label='Referral threshold (0.50)')
    axes[0].axvline(x=0.8, color='blue', linestyle='--', linewidth=2, label='High-confidence (0.80)')
    axes[0].set_xlabel('Prediction Confidence', fontsize=12)
    axes[0].set_ylabel('Count', fontsize=12)
    axes[0].set_title('Confidence Distribution — Correct vs Wrong', fontsize=13, fontweight='bold')
    axes[0].legend(fontsize=10)

    # Right: margin histogram
    axes[1].hist(all_margins[correct], bins=50, alpha=0.7, color='#2ecc71', label='Correct', edgecolor='white')
    axes[1].hist(all_margins[~correct], bins=50, alpha=0.7, color='#e74c3c', label='Wrong', edgecolor='white')
    axes[1].set_xlabel('Top-1 minus Top-2 Margin', fontsize=12)
    axes[1].set_ylabel('Count', fontsize=12)
    axes[1].set_title('Confidence Margin — Correct vs Wrong', fontsize=13, fontweight='bold')
    axes[1].legend(fontsize=10)

    plt.tight_layout()
    hist_path = EVAL_DIR / "confidence_histogram.png"
    fig.savefig(hist_path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"[SAVED] {hist_path}")

    # ── Plot: Calibration Curve ──────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(8, 8))
    cal_confs = [b["avg_confidence"] for b in calibration if b["count"] > 0]
    cal_accs = [b["avg_accuracy"] for b in calibration if b["count"] > 0]
    cal_counts = [b["count"] for b in calibration if b["count"] > 0]

    ax.plot([0, 1], [0, 1], 'k--', linewidth=1, label='Perfect calibration')
    ax.bar(cal_confs, cal_accs, width=0.08, alpha=0.6, color='#3498db', edgecolor='white', label='Model')
    ax.scatter(cal_confs, cal_accs, color='#e74c3c', s=60, zorder=5)
    ax.set_xlabel('Mean Predicted Confidence', fontsize=13)
    ax.set_ylabel('Fraction of Correct Predictions', fontsize=13)
    ax.set_title(f'Calibration Curve — ECE = {ece:.2f}%', fontsize=14, fontweight='bold')
    ax.legend(fontsize=11)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_aspect('equal')

    cal_path = EVAL_DIR / "calibration_curve.png"
    fig.savefig(cal_path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"[SAVED] {cal_path}")

    # ── Summary ──────────────────────────────────────────────────────────
    print("\n" + "=" * 70)
    print("CONFIDENCE ANALYSIS SUMMARY")
    print(f"  Expected Calibration Error: {ece}%")
    print(f"  Avg confidence (correct):   {disagreement['avg_confidence_when_top1_correct']:.1f}%")
    print(f"  Avg confidence (wrong):     {disagreement['avg_confidence_when_top1_wrong']:.1f}%")
    print(f"  Top-3 rescue rate:          {disagreement['top3_rescue_rate']:.1f}%")
    print(f"  Mean entropy (correct):     {entropy_stats['mean_when_correct']}")
    print(f"  Mean entropy (wrong):       {entropy_stats['mean_when_wrong']}")

    # Threshold recommendation
    for t_str, t_data in threshold_analysis.items():
        t = float(t_str)
        if t_data["accuracy_above"] >= 95.0 and t_data["coverage_pct"] >= 50.0:
            print(f"\n  ★ Recommended referral threshold: {t}")
            print(f"    → Accuracy above: {t_data['accuracy_above']}%")
            print(f"    → Coverage: {t_data['coverage_pct']}%")
            print(f"    → Referred: {t_data['predictions_below']} images ({100-t_data['coverage_pct']:.1f}%)")
            break

    print("=" * 70)


if __name__ == "__main__":
    main()
