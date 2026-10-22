"""
CropSentinel — SIH 2026 PS-26131
Model Weights Acquisition Script

This script documents how to obtain or train the plant disease classification model.
The architecture is MobileNetV2 fine-tuned on the PlantVillage / multi-crop disease datasets.

OPTION A: Download a pre-trained PlantVillage MobileNetV2 checkpoint
OPTION B: Train from scratch using the datasets below

─────────────────────────────────────────────────────────────────────────────────
DATASETS (license-reviewed)
─────────────────────────────────────────────────────────────────────────────────

1. PlantVillage Dataset (38 classes, ~54,000 images)
   License: CC BY 4.0 (free for research and commercial use)
   Source:  https://github.com/spMohanty/PlantVillage-Dataset
   Labels:  class_indices.json (already created in this project)

2. 20K Multi-Class Crop Disease Images (Kaggle)
   License: Review individual dataset license on Kaggle before use
   Download via:
       import kagglehub
       path = kagglehub.dataset_download("jawadali1045/20k-multi-class-crop-disease-images")
       print("Dataset path:", path)

3. Multi-Crop Disease Dataset (Mendeley Data)
   Citation: E, Prem Kumar (2025), "Multi-Crop Disease Dataset",
             Mendeley Data, V1, doi: 10.17632/6243z8r6t6.1
   License:  CC BY 4.0
   URL:      https://data.mendeley.com/datasets/6243z8r6t6/1

⚠️  IMPORTANT BEFORE MERGING DATASETS:
   - Audit class label overlap between datasets
   - Remove duplicate images (perceptual hash check)
   - Verify class imbalance; use weighted sampling if imbalance > 5:1
   - Check image quality (blur, compression artefacts)
   - Do NOT blindly merge without reconciling class names

─────────────────────────────────────────────────────────────────────────────────
OPTION A — Use a Public Pre-Trained Checkpoint
─────────────────────────────────────────────────────────────────────────────────
A community-trained MobileNetV2 on PlantVillage (38 classes) is available:
  https://github.com/imrahulr/plantvillage-deep-learning
  Download: plant_disease_model.pth (MobileNetV2, 38 classes, ~98% val accuracy on PlantVillage)

After downloading, place the weights file at:
  ml/models/plant_disease_model.pth

The model will automatically load on the next service startup.

─────────────────────────────────────────────────────────────────────────────────
OPTION B — Training Pipeline
─────────────────────────────────────────────────────────────────────────────────
"""

import os
import sys
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, WeightedRandomSampler
from torchvision import datasets, models, transforms
from pathlib import Path

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

NUM_CLASSES = 38
EPOCHS = 30
BATCH_SIZE = 32
LR = 0.001
IMG_SIZE = 224


def train_model(data_dir: str, output_path: str = None):
    """
    Fine-tunes MobileNetV2 on a PlantVillage-structured dataset directory.
    
    Expected directory structure:
        data_dir/
            train/
                Apple___Apple_scab/    (images)
                Apple___Black_rot/
                ...
            val/
                Apple___Apple_scab/
                ...
    
    Args:
        data_dir: Root directory containing train/ and val/ subdirs
        output_path: Where to save the trained .pth file
    """
    if not os.path.isdir(data_dir):
        print(f"ERROR: Dataset directory not found: {data_dir}")
        print("Please download the dataset first (see OPTION A/B docs above)")
        sys.exit(1)

    if output_path is None:
        output_path = str(MODELS_DIR / "plant_disease_model.pth")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")

    # ImageNet normalization
    norm_mean = [0.485, 0.456, 0.406]
    norm_std = [0.229, 0.224, 0.225]

    train_transforms = transforms.Compose([
        transforms.RandomResizedCrop(IMG_SIZE, scale=(0.7, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(p=0.1),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
        transforms.RandomRotation(30),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])

    val_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(IMG_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])

    train_dataset = datasets.ImageFolder(os.path.join(data_dir, "train"), transform=train_transforms)
    val_dataset = datasets.ImageFolder(os.path.join(data_dir, "val"), transform=val_transforms)

    print(f"Train samples: {len(train_dataset)}, Val samples: {len(val_dataset)}")
    print(f"Number of classes detected: {len(train_dataset.classes)}")

    # Save class indices
    class_to_idx = train_dataset.class_to_idx
    idx_to_class = {v: k for k, v in class_to_idx.items()}
    indices_path = MODELS_DIR / "class_indices.json"
    with open(indices_path, "w") as f:
        json.dump(idx_to_class, f, indent=2)
    print(f"Class indices saved to {indices_path}")

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4, pin_memory=True)

    # MobileNetV2 with transfer learning
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, len(train_dataset.classes))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LR, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.1)

    best_val_acc = 0.0

    for epoch in range(EPOCHS):
        # Training phase
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

        train_acc = 100 * correct / total

        # Validation phase
        model.eval()
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                _, predicted = torch.max(outputs, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()

        val_acc = 100 * val_correct / val_total
        scheduler.step()

        print(f"Epoch [{epoch+1}/{EPOCHS}] Loss: {running_loss/len(train_loader):.4f} | Train Acc: {train_acc:.2f}% | Val Acc: {val_acc:.2f}%")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), output_path)
            print(f"  ✅ New best model saved ({val_acc:.2f}%) → {output_path}")

    print(f"\nTraining complete. Best validation accuracy: {best_val_acc:.2f}%")
    print(f"Weights saved to: {output_path}")
    print("\nNote: The validation accuracy reported above is on the PlantVillage validation split.")
    print("Real-world field performance may differ. Always validate on field-collected images.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        print("\nUsage: python download_weights.py <path_to_dataset_root>")
        print("Example: python download_weights.py /data/plantvillage")
        sys.exit(0)
    train_model(data_dir=sys.argv[1])
