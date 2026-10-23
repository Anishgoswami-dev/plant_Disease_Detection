"""
FASAL DRISTHI — EfficientNet-B0 Candidate Model Training Pipeline
Trains a candidate crop disease classification model on the isolated dataset.

Architecture: EfficientNet-B0 (Pretrained on ImageNet-1K)
Safety:
- NEVER overwrites active model (ml/models/plant_disease_model.pth).
- Saves candidate checkpoint to: ml/models/plant_disease_candidate_efficientnet.pth.
- Loads data strictly via verified manifest (ml/datasets/plantvillage_isolated/splits_manifest.json).
- Multi-threaded CPU optimization (torch.set_num_threads(6)).
"""

import os, sys, time, json, argparse
from pathlib import Path
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
from torchvision import transforms, models
from PIL import Image
from sklearn.metrics import accuracy_score, f1_score, precision_recall_fscore_support

SEED = 42
torch.manual_seed(SEED)
np.random.seed(SEED)

# Optimize for CPU execution on physical cores
torch.set_num_threads(6)

ML_ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ML_ROOT / "datasets" / "plantvillage_isolated" / "splits_manifest.json"
DEFAULT_OUTPUT = ML_ROOT / "models" / "plant_disease_candidate_efficientnet.pth"
HISTORY_OUTPUT = ML_ROOT / "models" / "training_history_efficientnet.json"

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

# ─── DATASET & TRANSFORMS ───────────────────────────────────────────────────
def get_transforms(img_size: int = 224):
    train_tf = transforms.Compose([
        transforms.Resize(256),
        transforms.RandomResizedCrop(img_size, scale=(0.7, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.1),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        transforms.RandomErasing(p=0.1, scale=(0.02, 0.1))
    ])
    eval_tf = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(img_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])
    return train_tf, eval_tf


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
        return img, label


# ─── MODEL BUILDER ──────────────────────────────────────────────────────────
def build_efficientnet_b0(num_classes: int = 38):
    weights = models.EfficientNet_B0_Weights.DEFAULT
    model = models.efficientnet_b0(weights=weights)
    in_features = model.classifier[1].in_features  # 1280
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_features, num_classes)
    )
    return model


def freeze_backbone(model):
    for name, param in model.named_parameters():
        if "classifier" not in name:
            param.requires_grad = False


def unfreeze_all(model):
    for param in model.parameters():
        param.requires_grad = True


# ─── TRAINING LOOP ──────────────────────────────────────────────────────────
def train(
    manifest_path: str = str(MANIFEST_PATH),
    output_path: str = str(DEFAULT_OUTPUT),
    history_path: str = str(HISTORY_OUTPUT),
    total_epochs: int = 15,
    phase1_epochs: int = 4,
    batch_size: int = 32,
    lr_phase1: float = 1e-3,
    lr_phase2_classifier: float = 1e-4,
    lr_phase2_backbone: float = 2e-5,
    patience: int = 4
):
    print("=" * 80)
    print("EFFICIENTNET-B0 CANDIDATE MODEL TRAINING")
    print(f"Manifest: {manifest_path}")
    print(f"Candidate Checkpoint Output: {output_path}")
    print(f"Total Epochs: {total_epochs} (Phase 1: {phase1_epochs}, Phase 2: {total_epochs - phase1_epochs})")
    print(f"Batch Size: {batch_size}, Early Stop Patience: {patience}")
    print("=" * 80)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[DEVICE] Training on: {device} (threads={torch.get_num_threads()})")

    # Load manifest
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    train_samples = manifest["train_samples"]
    val_samples = manifest["val_samples"]
    num_classes = manifest["metadata"]["total_classes"]
    print(f"[DATA] Train samples: {len(train_samples)}, Val samples: {len(val_samples)}, Classes: {num_classes}")

    train_tf, eval_tf = get_transforms(224)
    train_ds = ManifestDataset(train_samples, ML_ROOT, transform=train_tf)
    val_ds   = ManifestDataset(val_samples, ML_ROOT, transform=eval_tf)

    # Class weights for CrossEntropyLoss and WeightedRandomSampler
    y_train = [s["class_idx"] for s in train_samples]
    class_counts = np.bincount(y_train, minlength=num_classes)
    class_weights = len(y_train) / (num_classes * np.maximum(class_counts, 1).astype(np.float32))
    class_weights_tensor = torch.tensor(class_weights, dtype=torch.float32).to(device)

    # Sampler
    sample_weights = [class_weights[y] for y in y_train]
    sampler = WeightedRandomSampler(sample_weights, num_samples=len(sample_weights), replacement=True)

    train_loader = DataLoader(train_ds, batch_size=batch_size, sampler=sampler, num_workers=0)
    val_loader   = DataLoader(val_ds,   batch_size=batch_size, shuffle=False, num_workers=0)

    # Model
    model = build_efficientnet_b0(num_classes).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights_tensor, label_smoothing=0.05)

    # Phase 1 setup (warm-up head only)
    print(f"\n[PHASE 1] Classifier Warm-up ({phase1_epochs} epochs, lr={lr_phase1})...")
    freeze_backbone(model)
    optimizer = optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()),
                            lr=lr_phase1, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=phase1_epochs, eta_min=1e-5)

    best_val_f1 = 0.0
    best_epoch = 0
    no_improve = 0
    history = []

    for epoch in range(1, total_epochs + 1):
        epoch_start = time.time()

        # Switch to Phase 2 after phase1_epochs
        if epoch == phase1_epochs + 1:
            print(f"\n[PHASE 2] End-to-End Fine-Tuning (Epochs {phase1_epochs+1}..{total_epochs})...")
            unfreeze_all(model)
            # Discriminative learning rates
            param_groups = [
                {"params": [p for n, p in model.named_parameters() if "classifier" not in n], "lr": lr_phase2_backbone},
                {"params": [p for n, p in model.named_parameters() if "classifier" in n], "lr": lr_phase2_classifier}
            ]
            optimizer = optim.AdamW(param_groups, weight_decay=1e-4)
            scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=(total_epochs - phase1_epochs), eta_min=1e-6)

        # Training epoch
        model.train()
        running_loss = 0.0
        train_preds, train_trues = [], []

        for batch_idx, (images, targets) in enumerate(train_loader):
            images, targets = images.to(device), targets.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            train_preds.extend(torch.argmax(outputs, dim=1).cpu().numpy())
            train_trues.extend(targets.cpu().numpy())

        scheduler.step()
        train_loss = running_loss / len(train_ds)
        train_acc = accuracy_score(train_trues, train_preds)
        train_f1  = f1_score(train_trues, train_preds, average="macro", zero_division=0)

        # Validation epoch
        model.eval()
        val_loss = 0.0
        val_preds, val_trues = [], []
        with torch.no_grad():
            for images, targets in val_loader:
                images, targets = images.to(device), targets.to(device)
                outputs = model(images)
                loss = criterion(outputs, targets)
                val_loss += loss.item() * images.size(0)
                val_preds.extend(torch.argmax(outputs, dim=1).cpu().numpy())
                val_trues.extend(targets.cpu().numpy())

        val_loss = val_loss / len(val_ds)
        val_acc = accuracy_score(val_trues, val_preds)
        val_f1  = f1_score(val_trues, val_preds, average="macro", zero_division=0)
        epoch_time = time.time() - epoch_start

        phase_tag = "P1" if epoch <= phase1_epochs else "P2"
        print(f"[{phase_tag} Ep {epoch:2d}/{total_epochs}] ({epoch_time:.0f}s) "
              f"Train Loss={train_loss:.4f} Acc={train_acc*100:.1f}% F1={train_f1*100:.1f}% | "
              f"Val Loss={val_loss:.4f} Acc={val_acc*100:.1f}% F1={val_f1*100:.1f}%")

        epoch_record = {
            "epoch": epoch,
            "phase": phase_tag,
            "train_loss": round(train_loss, 4),
            "train_acc": round(train_acc * 100, 2),
            "train_f1": round(train_f1 * 100, 2),
            "val_loss": round(val_loss, 4),
            "val_acc": round(val_acc * 100, 2),
            "val_f1": round(val_f1 * 100, 2),
            "epoch_time_sec": round(epoch_time, 1)
        }
        history.append(epoch_record)

        # Checkpoint saving on best Val Macro-F1
        if val_f1 > best_val_f1:
            best_val_f1 = val_f1
            best_epoch = epoch
            no_improve = 0
            # Safety check: NEVER write to plant_disease_model.pth
            assert not output_path.endswith("plant_disease_model.pth"), "FATAL: Output path points to active model!"
            torch.save(model.state_dict(), output_path)
            print(f"    * New Best Candidate Checkpoint saved! (Val Macro-F1={val_f1*100:.2f}%) -> {output_path}")
        else:
            no_improve += 1
            if no_improve >= patience and epoch > phase1_epochs:
                print(f"\n[EARLY STOP] Validation Macro-F1 did not improve for {patience} consecutive epochs. Stopping.")
                break

    # Save training history
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump({
            "architecture": "EfficientNet-B0",
            "seed": SEED,
            "total_epochs_trained": len(history),
            "best_epoch": best_epoch,
            "best_val_f1": round(best_val_f1 * 100, 2),
            "history": history
        }, f, indent=2)

    print("\n" + "=" * 80)
    print("TRAINING COMPLETED SUCCESSFULLY")
    print(f"Best Val Macro-F1: {best_val_f1*100:.2f}% (Epoch {best_epoch})")
    print(f"Candidate Checkpoint: {output_path}")
    print(f"Training History: {history_path}")
    print("=" * 80)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", default=str(MANIFEST_PATH))
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT))
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--phase1_epochs", type=int, default=4)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--patience", type=int, default=4)
    args = parser.parse_args()

    train(
        manifest_path=args.manifest,
        output_path=args.output,
        total_epochs=args.epochs,
        phase1_epochs=args.phase1_epochs,
        batch_size=args.batch_size,
        patience=args.patience
    )
