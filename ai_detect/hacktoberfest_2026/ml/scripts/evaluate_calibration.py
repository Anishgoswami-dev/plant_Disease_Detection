"""
FASAL DRISTHI — Calibration Evaluation
Evaluates calibration quality BEFORE and AFTER temperature scaling on the test set.
Produces: ECE, MCE, Brier Score, NLL, reliability diagram, referral rate comparison.

Usage:
  python scripts/evaluate_calibration.py

Outputs:
  evaluation/calibration_before_after.json
  evaluation/reliability_diagram_comparison.png
"""

import os, json
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
CHECKPOINT = ML_ROOT / "models" / "plant_disease_candidate_efficientnet.pth"
TEMP_PATH = ML_ROOT / "models" / "temperature_T.json"
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
        return img, item["class_idx"]


def compute_calibration_metrics(probs, labels, n_bins=15):
    """Compute ECE, MCE, and per-bin calibration data."""
    confs, preds = probs.max(dim=1)
    correct = (preds == labels).float()

    bin_boundaries = torch.linspace(0, 1, n_bins + 1)
    ece = 0.0
    mce = 0.0
    bins = []

    for i in range(n_bins):
        lo, hi = float(bin_boundaries[i]), float(bin_boundaries[i + 1])
        mask = (confs >= lo) & (confs < hi)
        n = mask.sum().item()
        if n > 0:
            avg_conf = confs[mask].mean().item()
            avg_acc = correct[mask].mean().item()
            gap = abs(avg_conf - avg_acc)
            ece += (n / len(labels)) * gap
            mce = max(mce, gap)
        else:
            avg_conf = (lo + hi) / 2
            avg_acc = 0.0
            gap = 0.0
        bins.append({
            "lo": round(lo, 4), "hi": round(hi, 4),
            "count": int(n),
            "avg_confidence": round(avg_conf, 4),
            "avg_accuracy": round(avg_acc, 4),
            "gap": round(gap, 4)
        })

    return round(ece * 100, 2), round(mce * 100, 2), bins


def compute_brier(probs, labels, num_classes):
    one_hot = F.one_hot(labels, num_classes).float()
    return round(((probs - one_hot) ** 2).sum(dim=1).mean().item(), 6)


def compute_referral_rates(probs, thresholds=[0.50, 0.60, 0.80]):
    confs = probs.max(dim=1).values
    rates = {}
    for t in thresholds:
        below = (confs < t).float().mean().item()
        rates[str(t)] = round(below * 100, 2)
    return rates


def main():
    print("=" * 70)
    print("CALIBRATION EVALUATION ON TEST SET")
    print("=" * 70)

    # Load temperature
    if not TEMP_PATH.exists():
        print(f"ERROR: {TEMP_PATH} not found. Run calibrate_temperature.py first.")
        return
    with open(TEMP_PATH, "r") as f:
        temp_data = json.load(f)
    T = temp_data["temperature"]
    print(f"[INFO] Loaded temperature T = {T}")

    # Load classes
    with open(CLASS_INDICES, "r", encoding="utf-8") as f:
        class_map = json.load(f)
    num_classes = len(class_map)

    # Load test samples
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    test_samples = manifest["test_samples"]
    print(f"[INFO] Test set: {len(test_samples)} samples")

    dataset = ManifestDataset(test_samples, ML_ROOT, transform=eval_tf)
    loader = DataLoader(dataset, batch_size=32, shuffle=False, num_workers=0)

    # Load model
    model = models.efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_features, num_classes)
    )
    state_dict = torch.load(str(CHECKPOINT), map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()

    # Collect logits
    print("[EVAL] Collecting logits from test set...")
    all_logits = []
    all_labels = []
    with torch.no_grad():
        for batch_idx, (images, labels) in enumerate(loader):
            logits = model(images)
            all_logits.append(logits)
            all_labels.append(labels)
            if (batch_idx + 1) % 50 == 0:
                print(f"  Processed {(batch_idx+1)*32}/{len(test_samples)}...")

    all_logits = torch.cat(all_logits, dim=0)
    all_labels = torch.cat(all_labels, dim=0)

    # Before calibration
    before_probs = F.softmax(all_logits, dim=1)
    before_nll = F.cross_entropy(all_logits, all_labels).item()
    before_ece, before_mce, before_bins = compute_calibration_metrics(before_probs, all_labels)
    before_brier = compute_brier(before_probs, all_labels, num_classes)
    before_acc = (before_probs.argmax(dim=1) == all_labels).float().mean().item()
    before_referrals = compute_referral_rates(before_probs)

    # After calibration
    scaled_logits = all_logits / T
    after_probs = F.softmax(scaled_logits, dim=1)
    after_nll = F.cross_entropy(scaled_logits, all_labels).item()
    after_ece, after_mce, after_bins = compute_calibration_metrics(after_probs, all_labels)
    after_brier = compute_brier(after_probs, all_labels, num_classes)
    after_acc = (after_probs.argmax(dim=1) == all_labels).float().mean().item()
    after_referrals = compute_referral_rates(after_probs)

    # Predictions preserved check
    preds_preserved = bool((before_probs.argmax(dim=1) == after_probs.argmax(dim=1)).all().item())

    print(f"\n{'='*60}")
    print(f"CALIBRATION COMPARISON (Test Set, n={len(all_labels)})")
    print(f"{'='*60}")
    print(f"  Temperature T = {T:.6f}")
    print(f"  {'Metric':<25} {'Before':>10} {'After':>10} {'Change':>10}")
    print(f"  {'-'*55}")
    print(f"  {'ECE (%)':<25} {before_ece:>10.2f} {after_ece:>10.2f} {after_ece-before_ece:>+10.2f}")
    print(f"  {'MCE (%)':<25} {before_mce:>10.2f} {after_mce:>10.2f} {after_mce-before_mce:>+10.2f}")
    print(f"  {'NLL':<25} {before_nll:>10.4f} {after_nll:>10.4f} {after_nll-before_nll:>+10.4f}")
    print(f"  {'Brier Score':<25} {before_brier:>10.4f} {after_brier:>10.4f} {after_brier-before_brier:>+10.4f}")
    print(f"  {'Accuracy (%)':<25} {before_acc*100:>10.2f} {after_acc*100:>10.2f} {(after_acc-before_acc)*100:>+10.2f}")
    print(f"  {'Preds preserved':<25} {'':>10} {str(preds_preserved):>10}")
    print(f"\n  Referral rates (% below threshold):")
    for t_str in before_referrals:
        print(f"    Threshold {t_str}: {before_referrals[t_str]:.1f}% -> {after_referrals[t_str]:.1f}%")
    print(f"{'='*60}")

    # Save results
    results = {
        "temperature": T,
        "test_samples": len(all_labels),
        "predictions_preserved": preds_preserved,
        "before_calibration": {
            "ece_pct": before_ece, "mce_pct": before_mce,
            "nll": round(before_nll, 4), "brier_score": before_brier,
            "accuracy_pct": round(before_acc * 100, 2),
            "referral_rates": before_referrals,
            "bins": before_bins
        },
        "after_calibration": {
            "ece_pct": after_ece, "mce_pct": after_mce,
            "nll": round(after_nll, 4), "brier_score": after_brier,
            "accuracy_pct": round(after_acc * 100, 2),
            "referral_rates": after_referrals,
            "bins": after_bins
        }
    }

    out_json = EVAL_DIR / "calibration_before_after.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\n[SAVED] {out_json}")

    # Plot reliability diagram comparison
    fig, axes = plt.subplots(1, 2, figsize=(16, 7))

    for ax, bins, title, ece_val in [
        (axes[0], before_bins, f"Before Calibration (T=1.0) | ECE={before_ece:.2f}%", before_ece),
        (axes[1], after_bins, f"After Calibration (T={T:.4f}) | ECE={after_ece:.2f}%", after_ece)
    ]:
        confs = [b["avg_confidence"] for b in bins if b["count"] > 0]
        accs = [b["avg_accuracy"] for b in bins if b["count"] > 0]
        counts = [b["count"] for b in bins if b["count"] > 0]

        ax.plot([0, 1], [0, 1], 'k--', linewidth=1, label='Perfect calibration')
        ax.bar(confs, accs, width=0.06, alpha=0.6, color='#3498db', edgecolor='white', label='Model')
        ax.scatter(confs, accs, color='#e74c3c', s=50, zorder=5)

        # Gap fill
        for c, a in zip(confs, accs):
            ax.plot([c, c], [min(c, a), max(c, a)], color='#e74c3c', linewidth=1.5, alpha=0.5)

        ax.set_xlabel('Mean Predicted Confidence', fontsize=12)
        ax.set_ylabel('Fraction of Correct', fontsize=12)
        ax.set_title(title, fontsize=12, fontweight='bold')
        ax.legend(fontsize=10)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.set_aspect('equal')

    plt.tight_layout()
    fig_path = EVAL_DIR / "reliability_diagram_comparison.png"
    fig.savefig(fig_path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"[SAVED] {fig_path}")
    print("Done.")


if __name__ == "__main__":
    main()
