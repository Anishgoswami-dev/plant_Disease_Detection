"""
FASAL DRISTHI — EfficientNet-B0 Fine-Tuning Pipeline
Replaces MobileNetV2 with EfficientNet-B0 for improved accuracy.

Design:
  Phase 1: Freeze backbone, train classifier head only (5 epochs, LR=1e-3)
  Phase 2: Unfreeze all layers, end-to-end fine-tune (remaining epochs, LR=1e-4)
  Loss:     CrossEntropyLoss with class-frequency inverse weights
  Sampling: WeightedRandomSampler for additional imbalance mitigation
  Saves:    Candidate checkpoint only — NEVER overwrites active model

Architecture: EfficientNet-B0
  - Parameters: ~5.3M (vs MobileNetV2 3.4M — acceptable overhead)
  - Expected PlantVillage accuracy: ~96-98% (vs ~57% current candidate)
  - CPU inference: ~25-35 ms (vs ~14 ms current — still within budget)
"""

import os, sys, time, json, argparse
from pathlib import Path
import numpy as np
import torch, torch.nn as nn, torch.optim as optim
from torch.utils.data import DataLoader, Dataset, WeightedRandomSampler
from torchvision import datasets, transforms, models
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, precision_recall_fscore_support

SEED = 42
torch.manual_seed(SEED)
np.random.seed(SEED)

# ─── TRANSFORMS ─────────────────────────────────────────────────────────────
MEAN = [0.485, 0.456, 0.406]
STD  = [0.229, 0.224, 0.225]

def get_transforms(img_size: int = 224):
    train_tf = transforms.Compose([
        transforms.Resize(256),
        transforms.RandomResizedCrop(img_size, scale=(0.65, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(p=0.1),
        transforms.RandomRotation(25),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.05),
        transforms.RandomGrayscale(p=0.05),
        transforms.ToTensor(),
        transforms.Normalize(MEAN, STD),
        transforms.RandomErasing(p=0.1, scale=(0.02, 0.1))  # random erase for robustness
    ])
    val_tf = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(img_size),
        transforms.ToTensor(),
        transforms.Normalize(MEAN, STD)
    ])
    return train_tf, val_tf


# ─── DATASET WITH PER-SPLIT TRANSFORMS ──────────────────────────────────────
class TransformedSubset(Dataset):
    def __init__(self, full_dataset, indices, transform=None):
        self.full_dataset = full_dataset
        self.indices = indices
        self.transform = transform

    def __getitem__(self, idx):
        from PIL import Image
        img_path, target = self.full_dataset.samples[self.indices[idx]]
        img = Image.open(img_path).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, target

    def __len__(self):
        return len(self.indices)


# ─── MODEL BUILDER ──────────────────────────────────────────────────────────
def build_efficientnet_b0(num_classes: int, pretrained: bool = True):
    """Builds EfficientNet-B0 with a custom linear classifier head."""
    weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
    model = models.efficientnet_b0(weights=weights)
    in_features = model.classifier[1].in_features  # 1280
    model.classifier[1] = nn.Linear(in_features, num_classes)
    return model


def freeze_backbone(model):
    """Freezes all layers except the classifier head for Phase 1."""
    for name, param in model.named_parameters():
        if "classifier" not in name:
            param.requires_grad = False

def unfreeze_all(model):
    """Unfreezes all layers for Phase 2 end-to-end fine-tuning."""
    for param in model.parameters():
        param.requires_grad = True


# ─── TRAINING FUNCTION ──────────────────────────────────────────────────────
def train_model(
    dataset_dir: str,
    output_path: str = None,
    total_epochs: int = 20,
    phase1_epochs: int = 5,
    batch_size: int = 32,
    lr_phase1: float = 1e-3,
    lr_phase2: float = 1e-4,
    seed: int = SEED,
    img_size: int = 224,
    early_stop_patience: int = 5
):
    torch.manual_seed(seed)
    np.random.seed(seed)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INIT] Device: {device}")
    print(f"[INIT] Dataset: {dataset_dir}")

    data_path = Path(dataset_dir)
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found: {dataset_dir}")

    # Default output
    if output_path is None:
        output_path = str(Path(__file__).parent.parent / "models" / "plant_disease_efficientnet_candidate.pth")
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    # ── Load dataset ──────────────────────────────────────────────────────
    raw = datasets.ImageFolder(str(data_path))
    class_names = raw.classes
    num_classes = len(class_names)
    print(f"[DATA] {len(raw)} images, {num_classes} classes")

    targets = [s[1] for s in raw.samples]

    # Stratified 70/15/15 split
    train_idx, temp_idx, y_train, y_temp = train_test_split(
        range(len(targets)), targets, test_size=0.30, stratify=targets, random_state=seed
    )
    val_idx, test_idx, y_val, y_test = train_test_split(
        temp_idx, y_temp, test_size=0.50, stratify=y_temp, random_state=seed
    )
    print(f"[DATA] Split: train={len(train_idx)}, val={len(val_idx)}, test={len(test_idx)}")

    train_tf, val_tf = get_transforms(img_size)
    train_set = TransformedSubset(raw, train_idx, train_tf)
    val_set   = TransformedSubset(raw, val_idx, val_tf)
    test_set  = TransformedSubset(raw, test_idx, val_tf)

    # Class weights for loss AND for WeightedRandomSampler
    class_counts = np.bincount(y_train, minlength=num_classes)
    class_weights = len(y_train) / (num_classes * np.maximum(class_counts, 1).astype(np.float32))
    weight_tensor = torch.tensor(class_weights, dtype=torch.float32).to(device)

    # Sample weights for each training sample
    sample_weights = [class_weights[y] for y in y_train]
    sampler = WeightedRandomSampler(sample_weights, num_samples=len(sample_weights), replacement=True)

    num_workers = 0  # Windows safe
    train_loader = DataLoader(train_set, batch_size=batch_size, sampler=sampler, num_workers=num_workers)
    val_loader   = DataLoader(val_set,   batch_size=batch_size, shuffle=False, num_workers=num_workers)
    test_loader  = DataLoader(test_set,  batch_size=batch_size, shuffle=False, num_workers=num_workers)

    # ── Class distribution report ──────────────────────────────────────────
    print(f"\n[DATA] Class imbalance (train):")
    print(f"  Min: {class_counts.min()} ({class_names[class_counts.argmin()]})")
    print(f"  Max: {class_counts.max()} ({class_names[class_counts.argmax()]})")
    print(f"  Ratio: {class_counts.max()/max(class_counts.min(),1):.1f}x")

    # ── Build model ────────────────────────────────────────────────────────
    model = build_efficientnet_b0(num_classes, pretrained=True)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss(weight=weight_tensor)
    best_val_f1 = 0.0
    history = []
    no_improve = 0

    print(f"\n[PHASE 1] Classifier-head warm-up ({phase1_epochs} epochs, lr={lr_phase1})")
    freeze_backbone(model)
    optimizer = optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()),
                            lr=lr_phase1, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=phase1_epochs)

    for epoch in range(1, total_epochs + 1):
        # Switch to Phase 2 after phase1_epochs
        if epoch == phase1_epochs + 1:
            print(f"\n[PHASE 2] Full fine-tune (epochs {phase1_epochs+1}-{total_epochs}, lr={lr_phase2})")
            unfreeze_all(model)
            optimizer = optim.AdamW(model.parameters(), lr=lr_phase2, weight_decay=1e-4)
            scheduler = optim.lr_scheduler.CosineAnnealingLR(
                optimizer, T_max=(total_epochs - phase1_epochs)
            )

        t0 = time.time()
        model.train()
        running_loss = 0.0
        train_preds, train_trues = [], []

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            out = model(inputs)
            loss = criterion(out, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * inputs.size(0)
            train_preds.extend(torch.argmax(out, 1).cpu().numpy())
            train_trues.extend(labels.cpu().numpy())

        scheduler.step()
        train_acc = accuracy_score(train_trues, train_preds)
        train_f1  = f1_score(train_trues, train_preds, average="macro", zero_division=0)
        train_loss = running_loss / len(train_set)

        # Validation
        model.eval()
        val_preds, val_trues = [], []
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                val_preds.extend(torch.argmax(model(inputs), 1).cpu().numpy())
                val_trues.extend(labels.cpu().numpy())

        val_acc = accuracy_score(val_trues, val_preds)
        val_f1  = f1_score(val_trues, val_preds, average="macro", zero_division=0)
        elapsed = time.time() - t0

        log = {"epoch": epoch, "train_loss": round(train_loss, 4),
               "train_acc": round(train_acc*100, 2), "train_f1": round(train_f1*100, 2),
               "val_acc": round(val_acc*100, 2), "val_f1": round(val_f1*100, 2),
               "time_sec": round(elapsed, 1)}
        history.append(log)

        phase = "P1" if epoch <= phase1_epochs else "P2"
        print(f"  [{phase} Ep {epoch:2d}/{total_epochs}] ({elapsed:.0f}s) "
              f"Train Acc={train_acc*100:.1f}% F1={train_f1*100:.1f}% | "
              f"Val Acc={val_acc*100:.1f}% F1={val_f1*100:.1f}%")

        if val_f1 > best_val_f1:
            best_val_f1 = val_f1
            torch.save(model.state_dict(), output_path)
            print(f"    [CHECKPOINT] New best saved (Val Macro-F1={val_f1*100:.2f}%) -> {output_path}")
            no_improve = 0
        else:
            no_improve += 1
            if no_improve >= early_stop_patience and epoch > phase1_epochs:
                print(f"    [EARLY STOP] No improvement for {early_stop_patience} epochs. Stopping.")
                break

    # ── Final test evaluation ──────────────────────────────────────────────
    print(f"\n[EVAL] Loading best candidate ({output_path})...")
    model.load_state_dict(torch.load(output_path, map_location=device))
    model.eval()
    test_preds, test_trues = [], []
    with torch.no_grad():
        for inputs, labels in test_loader:
            test_preds.extend(torch.argmax(model(inputs.to(device)), 1).cpu().numpy())
            test_trues.extend(labels.numpy())

    test_acc = accuracy_score(test_trues, test_preds)
    test_f1  = f1_score(test_trues, test_preds, average="macro", zero_division=0)
    p, r, f_score, _ = precision_recall_fscore_support(test_trues, test_preds,
                                                         average="macro", zero_division=0)

    print(f"\n{'='*60}")
    print(f"EFFICIENTNET-B0 TRAINING RESULT")
    print(f"  Internal Test Accuracy:   {test_acc*100:.2f}%")
    print(f"  Macro Precision:          {p*100:.2f}%")
    print(f"  Macro Recall:             {r*100:.2f}%")
    print(f"  Macro F1:                 {test_f1*100:.2f}%")
    print(f"  Best Val Macro F1:        {best_val_f1*100:.2f}%")
    print(f"  Checkpoint:               {output_path}")
    print(f"{'='*60}")

    # Save log
    log_path = Path(output_path).parent / "training_history_efficientnet.json"
    with open(log_path, "w") as lf:
        json.dump({"architecture": "EfficientNet-B0", "num_classes": num_classes,
                   "history": history, "test_accuracy": test_acc,
                   "test_macro_f1": test_f1, "best_val_f1": best_val_f1}, lf, indent=2)
    print(f"[SAVED] Training log -> {log_path}")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description="EfficientNet-B0 Fine-Tuning on PlantVillage")
    p.add_argument("--data_dir", required=True, help="Path to PlantVillage dataset root")
    p.add_argument("--output", default=None, help="Candidate checkpoint path")
    p.add_argument("--epochs", type=int, default=20)
    p.add_argument("--phase1_epochs", type=int, default=5)
    p.add_argument("--batch_size", type=int, default=32)
    p.add_argument("--lr1", type=float, default=1e-3)
    p.add_argument("--lr2", type=float, default=1e-4)
    p.add_argument("--patience", type=int, default=5)
    args = p.parse_args()

    train_model(
        dataset_dir=args.data_dir,
        output_path=args.output,
        total_epochs=args.epochs,
        phase1_epochs=args.phase1_epochs,
        batch_size=args.batch_size,
        lr_phase1=args.lr1,
        lr_phase2=args.lr2,
        early_stop_patience=args.patience
    )
