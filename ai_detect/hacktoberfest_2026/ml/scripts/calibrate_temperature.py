"""
FASAL DRISTHI — Temperature Scaling Calibration
Learns optimal temperature T on the validation set to minimize NLL.
Temperature scaling preserves prediction order (argmax unchanged) but
re-calibrates softmax probabilities so they better reflect true accuracy.

Usage:
  python scripts/calibrate_temperature.py

Outputs:
  models/temperature_T.json  — {"temperature": <learned_T>}
"""

import os, json, sys
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
from pathlib import Path

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

ML_ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ML_ROOT / "datasets" / "plantvillage_isolated" / "splits_manifest.json"
CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"
CHECKPOINT = ML_ROOT / "models" / "plant_disease_candidate_efficientnet.pth"
OUTPUT_PATH = ML_ROOT / "models" / "temperature_T.json"

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


class TemperatureScaler(nn.Module):
    """Learns a single scalar temperature parameter."""
    def __init__(self):
        super().__init__()
        self.temperature = nn.Parameter(torch.ones(1) * 1.5)

    def forward(self, logits):
        return logits / self.temperature


def main():
    print("=" * 70)
    print("TEMPERATURE SCALING CALIBRATION")
    print("=" * 70)

    # Load class mapping
    with open(CLASS_INDICES, "r", encoding="utf-8") as f:
        class_map = json.load(f)
    num_classes = len(class_map)
    print(f"[INFO] {num_classes} classes")

    # Load validation samples from manifest
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    val_samples = manifest["val_samples"]
    print(f"[INFO] Validation set: {len(val_samples)} samples")

    dataset = ManifestDataset(val_samples, ML_ROOT, transform=eval_tf)
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
    print(f"[INFO] Model loaded from {CHECKPOINT}")

    # Step 1: Collect all logits and labels
    print("[STEP 1] Collecting logits from validation set...")
    all_logits = []
    all_labels = []
    with torch.no_grad():
        for images, labels in loader:
            logits = model(images)
            all_logits.append(logits)
            all_labels.append(labels)

    all_logits = torch.cat(all_logits, dim=0)   # [N, 38]
    all_labels = torch.cat(all_labels, dim=0)    # [N]
    print(f"[STEP 1] Collected {all_logits.shape[0]} logit vectors")

    # Before calibration metrics
    before_nll = F.cross_entropy(all_logits, all_labels).item()
    before_probs = F.softmax(all_logits, dim=1)
    before_confs, before_preds = before_probs.max(dim=1)
    before_acc = (before_preds == all_labels).float().mean().item()
    print(f"\n[BEFORE] NLL = {before_nll:.4f}, Accuracy = {before_acc*100:.2f}%")

    # Step 2: Learn temperature via LBFGS
    print("\n[STEP 2] Learning optimal temperature T...")
    temp_scaler = TemperatureScaler()
    optimizer = torch.optim.LBFGS([temp_scaler.temperature], lr=0.01, max_iter=100)

    def closure():
        optimizer.zero_grad()
        scaled_logits = temp_scaler(all_logits)
        loss = F.cross_entropy(scaled_logits, all_labels)
        loss.backward()
        return loss

    optimizer.step(closure)
    learned_T = temp_scaler.temperature.item()
    print(f"[STEP 2] Optimal temperature: T = {learned_T:.6f}")

    # After calibration metrics
    with torch.no_grad():
        scaled_logits = all_logits / learned_T
        after_nll = F.cross_entropy(scaled_logits, all_labels).item()
        after_probs = F.softmax(scaled_logits, dim=1)
        after_confs, after_preds = after_probs.max(dim=1)
        after_acc = (after_preds == all_labels).float().mean().item()

    print(f"[AFTER]  NLL = {after_nll:.4f}, Accuracy = {after_acc*100:.2f}%")
    print(f"[CHECK]  Prediction order preserved: {(before_preds == after_preds).all().item()}")

    # Step 3: Compute ECE before and after
    def compute_ece(probs, labels, n_bins=10):
        bin_boundaries = torch.linspace(0, 1, n_bins + 1)
        confs, preds = probs.max(dim=1)
        correct = (preds == labels).float()
        ece = 0.0
        for i in range(n_bins):
            lo, hi = bin_boundaries[i], bin_boundaries[i + 1]
            mask = (confs >= lo) & (confs < hi)
            n = mask.sum().item()
            if n > 0:
                avg_conf = confs[mask].mean().item()
                avg_acc = correct[mask].mean().item()
                ece += (n / len(labels)) * abs(avg_conf - avg_acc)
        return ece * 100

    ece_before = compute_ece(before_probs, all_labels)
    ece_after = compute_ece(after_probs, all_labels)

    # Brier score
    def compute_brier(probs, labels, num_classes):
        one_hot = F.one_hot(labels, num_classes).float()
        brier = ((probs - one_hot) ** 2).sum(dim=1).mean().item()
        return brier

    brier_before = compute_brier(before_probs, all_labels, num_classes)
    brier_after = compute_brier(after_probs, all_labels, num_classes)

    print(f"\n{'='*60}")
    print(f"CALIBRATION RESULTS (Validation Set, n={len(all_labels)})")
    print(f"{'='*60}")
    print(f"  {'Metric':<25} {'Before':>10} {'After':>10} {'Change':>10}")
    print(f"  {'-'*55}")
    print(f"  {'Temperature T':<25} {'1.0000':>10} {learned_T:>10.4f} {'':>10}")
    print(f"  {'NLL':<25} {before_nll:>10.4f} {after_nll:>10.4f} {after_nll-before_nll:>+10.4f}")
    print(f"  {'ECE (%)':<25} {ece_before:>10.2f} {ece_after:>10.2f} {ece_after-ece_before:>+10.2f}")
    print(f"  {'Brier Score':<25} {brier_before:>10.4f} {brier_after:>10.4f} {brier_after-brier_before:>+10.4f}")
    print(f"  {'Accuracy (%)':<25} {before_acc*100:>10.2f} {after_acc*100:>10.2f} {(after_acc-before_acc)*100:>+10.2f}")
    print(f"  {'Predictions unchanged':<25} {str((before_preds == after_preds).all().item()):>10}")
    print(f"{'='*60}")

    # Step 4: Save temperature
    result = {
        "temperature": round(learned_T, 6),
        "calibration_set": "val",
        "calibration_samples": len(all_labels),
        "checkpoint": str(CHECKPOINT.name),
        "metrics_before": {
            "nll": round(before_nll, 4),
            "ece_pct": round(ece_before, 2),
            "brier_score": round(brier_before, 4),
            "accuracy_pct": round(before_acc * 100, 2)
        },
        "metrics_after": {
            "nll": round(after_nll, 4),
            "ece_pct": round(ece_after, 2),
            "brier_score": round(brier_after, 4),
            "accuracy_pct": round(after_acc * 100, 2)
        },
        "predictions_preserved": bool((before_preds == after_preds).all().item())
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print(f"\n[SAVED] {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
