"""
Fasal Dristhi — Production Fine-Tuning & Training Pipeline
Fine-tunes MobileNetV2 on PlantVillage dataset with:
- Strict class-stratified splits (preventing class imbalance bias)
- Independent transforms per split (zero data leakage)
- Compatible MobileNetV2 classifier architecture (features -> classifier.1)
- Defensive candidate checkpoint saving (never overwrites production weights directly)
- Reproducible random seed and detailed metric logging
"""

import os
import sys
import time
import json
import argparse
from pathlib import Path
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import datasets, transforms, models
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score


class TransformedSubset(Dataset):
    """
    Subsets a dataset while applying independent transforms.
    Prevents the PyTorch dataset.transform mutation bug where modifying
    subset transforms overwrites the parent dataset.
    """
    def __init__(self, full_dataset, indices, transform=None):
        self.full_dataset = full_dataset
        self.indices = indices
        self.transform = transform

    def __getitem__(self, idx):
        # Retrieve image path or raw PIL from parent without parent transform
        img_path, target = self.full_dataset.samples[self.indices[idx]]
        from PIL import Image
        img = Image.open(img_path).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, target

    def __len__(self):
        return len(self.indices)


def get_transforms(img_size: int = 224):
    norm_mean = [0.485, 0.456, 0.406]
    norm_std = [0.229, 0.224, 0.225]

    train_tf = transforms.Compose([
        transforms.Resize(256),
        transforms.RandomResizedCrop(img_size, scale=(0.7, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(p=0.1),
        transforms.RandomRotation(20),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])

    val_tf = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(img_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])

    return train_tf, val_tf


def train_model(
    dataset_dir: str,
    output_model_path: str = "../models/plant_disease_model_candidate.pth",
    epochs: int = 5,
    batch_size: int = 32,
    learning_rate: float = 1e-4,
    seed: int = 42
):
    # Set reproducible seeds
    torch.manual_seed(seed)
    np.random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INIT] Training Device: {device}")
    print(f"[INIT] Random Seed: {seed}")

    data_path = Path(dataset_dir)
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset directory '{dataset_dir}' does not exist.")

    # Load raw dataset without transforms to inspect labels
    raw_dataset = datasets.ImageFolder(str(data_path))
    class_names = raw_dataset.classes
    num_classes = len(class_names)
    print(f"[DATA] Found {len(raw_dataset)} total images across {num_classes} classes.")

    targets = [s[1] for s in raw_dataset.samples]

    # Stratified Train/Val/Test Split (70 / 15 / 15)
    train_idx, temp_idx, y_train, y_temp = train_test_split(
        range(len(targets)), targets, test_size=0.30, stratify=targets, random_state=seed
    )
    val_idx, test_idx, y_val, y_test = train_test_split(
        temp_idx, y_temp, test_size=0.50, stratify=y_temp, random_state=seed
    )

    print(f"[DATA] Stratified Split -> Train: {len(train_idx)}, Val: {len(val_idx)}, Test: {len(test_idx)}")

    train_tf, val_tf = get_transforms()

    train_set = TransformedSubset(raw_dataset, train_idx, transform=train_tf)
    val_set = TransformedSubset(raw_dataset, val_idx, transform=val_tf)
    test_set = TransformedSubset(raw_dataset, test_idx, transform=val_tf)

    num_workers = 2 if os.name != "nt" else 0  # 0 on Windows for stability
    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    test_loader = DataLoader(test_set, batch_size=batch_size, shuffle=False, num_workers=num_workers)

    # Calculate class weights for loss balancing
    class_counts = np.bincount(y_train, minlength=num_classes)
    weights = len(y_train) / (num_classes * np.maximum(class_counts, 1).astype(np.float32))
    weight_tensor = torch.tensor(weights, dtype=torch.float32).to(device)

    # Initialize MobileNetV2 with compatible classifier head
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    in_features = model.classifier[1].in_features
    # Keep architecture identical to Fasal Dristhi runtime: classifier[1] = Linear(1280, num_classes)
    model.classifier[1] = nn.Linear(in_features, num_classes)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss(weight=weight_tensor)
    optimizer = optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    best_val_f1 = 0.0
    Path(output_model_path).parent.mkdir(parents=True, exist_ok=True)
    history = []

    print(f"\n[START] Commencing training for {epochs} epochs...")
    for epoch in range(epochs):
        t0 = time.time()
        model.train()
        running_loss = 0.0
        train_preds, train_trues = [], []

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            preds = torch.argmax(outputs, dim=1)
            train_preds.extend(preds.cpu().numpy())
            train_trues.extend(labels.cpu().numpy())

        scheduler.step()
        train_loss = running_loss / len(train_set)
        train_acc = accuracy_score(train_trues, train_preds)
        train_f1 = f1_score(train_trues, train_preds, average="macro")

        # Validation Phase
        model.eval()
        val_loss = 0.0
        val_preds, val_trues = [], []
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * inputs.size(0)
                preds = torch.argmax(outputs, dim=1)
                val_preds.extend(preds.cpu().numpy())
                val_trues.extend(labels.cpu().numpy())

        val_loss = val_loss / len(val_set)
        val_acc = accuracy_score(val_trues, val_preds)
        val_f1 = f1_score(val_trues, val_preds, average="macro")
        elapsed = time.time() - t0

        log_entry = {
            "epoch": epoch + 1,
            "train_loss": round(train_loss, 4),
            "train_acc": round(train_acc * 100, 2),
            "train_f1": round(train_f1 * 100, 2),
            "val_loss": round(val_loss, 4),
            "val_acc": round(val_acc * 100, 2),
            "val_f1": round(val_f1 * 100, 2),
            "time_sec": round(elapsed, 1)
        }
        history.append(log_entry)

        print(f"Epoch [{epoch+1}/{epochs}] ({elapsed:.1f}s) | Train Loss: {train_loss:.4f} Acc: {train_acc*100:.2f}% | Val Loss: {val_loss:.4f} Acc: {val_acc*100:.2f}% (F1: {val_f1*100:.2f}%)")

        if val_f1 > best_val_f1:
            best_val_f1 = val_f1
            torch.save(model.state_dict(), output_model_path)
            print(f"  [CHECKPOINT] Saved new best candidate model (Val Macro-F1: {val_f1*100:.2f}%) -> {output_model_path}")

    # Evaluate Best Model on Held-Out Test Split
    print("\n[EVAL] Evaluating best candidate model on Held-Out Test Split...")
    model.load_state_dict(torch.load(output_model_path))
    model.eval()
    test_preds, test_trues = [], []
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            test_preds.extend(torch.argmax(outputs, dim=1).cpu().numpy())
            test_trues.extend(labels.numpy())

    test_acc = accuracy_score(test_trues, test_preds)
    test_f1 = f1_score(test_trues, test_preds, average="macro")
    print(f"[TEST RESULT] Held-Out Test Accuracy: {test_acc*100:.2f}%, Test Macro-F1: {test_f1*100:.2f}%")

    # Save training log
    log_path = Path(output_model_path).parent / "training_history.json"
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump({"history": history, "test_accuracy": test_acc, "test_macro_f1": test_f1}, f, indent=2)
    print(f"[SAVED] Training log saved to {log_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fasal Dristhi Model Fine-Tuning")
    parser.add_argument("--data_dir", type=str, required=True, help="Path to PlantVillage dataset root")
    parser.add_argument("--output", type=str, default="../models/plant_disease_model_candidate.pth")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=1e-4)
    args = parser.parse_args()

    train_model(
        dataset_dir=args.data_dir,
        output_model_path=args.output,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.lr
    )
