"""
FASAL DRISTHI — Full 38-Class Heldout Evaluation (Expanded)
Evaluates the current candidate model on the expanded heldout test set
covering all 38 classes including all Tomato diseases.
"""
import json, time
from pathlib import Path
import numpy as np
import torch
from PIL import Image
from torchvision import transforms, models
from sklearn.metrics import (accuracy_score, f1_score,
                              precision_recall_fscore_support,
                              balanced_accuracy_score)

ML_ROOT = Path(__file__).resolve().parent.parent
HELDOUT  = ML_ROOT / "test_data" / "heldout_test"
MODELS   = ML_ROOT / "models"
EVAL_DIR = ML_ROOT / "evaluation"
EVAL_DIR.mkdir(exist_ok=True)

with open(MODELS / "class_indices.json", encoding="utf-8") as f:
    cmap = json.load(f)
classes = [cmap[str(i)] for i in range(38)]
class_to_idx = {c: i for i, c in enumerate(classes)}

# Transform (same as training eval)
tf = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def evaluate(model_path: Path, arch: str = "mobilenet_v2", label: str = "Model"):
    # Build model
    if arch == "mobilenet_v2":
        model = models.mobilenet_v2(weights=None)
        model.classifier[1] = torch.nn.Linear(1280, 38)
    elif arch == "efficientnet_b0":
        model = models.efficientnet_b0(weights=None)
        model.classifier[1] = torch.nn.Linear(1280, 38)
    else:
        raise ValueError(f"Unknown arch: {arch}")

    model.load_state_dict(torch.load(str(model_path), map_location="cpu"))
    model.eval()

    y_true, y_pred, y_conf, latencies = [], [], [], []
    top3_correct = 0

    for cls in classes:
        d = HELDOUT / cls
        imgs = list(d.glob("*.jpg")) + list(d.glob("*.JPG")) + list(d.glob("*.png"))
        lbl = class_to_idx[cls]
        for img_path in imgs:
            try:
                img = Image.open(img_path).convert("RGB")
                t = tf(img).unsqueeze(0)
                t0 = time.perf_counter()
                with torch.no_grad():
                    logits = model(t)
                    probs = torch.softmax(logits, 1)[0]
                latencies.append((time.perf_counter() - t0) * 1000)
                pred = int(torch.argmax(probs))
                top3_idx = torch.topk(probs, min(3, 38)).indices.tolist()
                if lbl in top3_idx:
                    top3_correct += 1
                y_true.append(lbl)
                y_pred.append(pred)
                y_conf.append(float(probs[pred]))
            except Exception as e:
                print(f"  Error {img_path.name}: {e}")

    n = len(y_true)
    acc  = accuracy_score(y_true, y_pred)
    bacc = balanced_accuracy_score(y_true, y_pred)
    mf1  = f1_score(y_true, y_pred, average="macro", zero_division=0)
    wf1  = f1_score(y_true, y_pred, average="weighted", zero_division=0)
    mp, mr, _, _ = precision_recall_fscore_support(y_true, y_pred, average="macro", zero_division=0)
    top3_acc = top3_correct / max(n, 1)

    p_c, r_c, f_c, s_c = precision_recall_fscore_support(
        y_true, y_pred, labels=list(range(38)), average=None, zero_division=0
    )

    print(f"\n{'='*70}")
    print(f"  {label} — Expanded Heldout (All 38 Classes)")
    print(f"{'='*70}")
    print(f"  Samples:              {n}")
    print(f"  Top-1 Accuracy:       {acc*100:.2f}%")
    print(f"  Balanced Accuracy:    {bacc*100:.2f}%")
    print(f"  Top-3 Accuracy:       {top3_acc*100:.2f}%")
    print(f"  Macro Precision:      {mp*100:.2f}%")
    print(f"  Macro Recall:         {mr*100:.2f}%")
    print(f"  Macro F1:             {mf1*100:.2f}%")
    print(f"  Weighted F1:          {wf1*100:.2f}%")
    print(f"  Mean Confidence:      {np.mean(y_conf)*100:.2f}%")
    print(f"  Mean Latency (CPU):   {np.mean(latencies):.2f} ms")
    print()
    print(f"  {'Class':<55} {'P':>6} {'R':>6} {'F1':>6} {'N':>5}")
    print(f"  {'-'*55} {'------':>6} {'------':>6} {'------':>6} {'-----':>5}")
    for i, cls in enumerate(classes):
        status = "" if f_c[i] > 0.5 else (" [WEAK]" if f_c[i] > 0 else " [ZERO]")
        print(f"  [{i:2d}] {cls[:50]:<50} {p_c[i]*100:6.1f} {r_c[i]*100:6.1f} {f_c[i]*100:6.1f} {int(s_c[i]):5d}{status}")

    zero_f1  = sum(1 for f, s in zip(f_c, s_c) if f == 0.0 and s > 0)
    good_f1  = sum(1 for f in f_c if f >= 0.75)
    print(f"\n  Classes F1=0.0 (with samples): {zero_f1}")
    print(f"  Classes F1>=0.75:               {good_f1}")

    # Save
    result = {
        "model": label,
        "weights": str(model_path),
        "total_samples": n,
        "accuracy": round(acc, 4),
        "balanced_accuracy": round(bacc, 4),
        "top3_accuracy": round(top3_acc, 4),
        "macro_precision": round(mp, 4),
        "macro_recall": round(mr, 4),
        "macro_f1": round(mf1, 4),
        "weighted_f1": round(wf1, 4),
        "mean_confidence": round(float(np.mean(y_conf)), 4),
        "mean_latency_ms": round(float(np.mean(latencies)), 2),
        "per_class": [
            {"class_index": i, "class_name": classes[i],
             "precision": round(float(p_c[i]), 4),
             "recall": round(float(r_c[i]), 4),
             "f1_score": round(float(f_c[i]), 4),
             "support": int(s_c[i])}
            for i in range(38)
        ]
    }
    out_name = label.lower().replace(" ", "_").replace("-", "_") + "_eval_38class.json"
    out_path = EVAL_DIR / out_name
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print(f"\n  Saved: {out_path}")
    return result


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--model", choices=["candidate", "original", "efficientnet"],
                   default="candidate")
    args = p.parse_args()

    if args.model == "efficientnet":
        eff_path = MODELS / "plant_disease_efficientnet_candidate.pth"
        if not eff_path.exists():
            print(f"EfficientNet candidate not found at {eff_path}")
            exit(1)
        evaluate(eff_path, arch="efficientnet_b0", label="EfficientNet-B0 Candidate")
    elif args.model == "original":
        evaluate(MODELS / "plant_disease_model.pth",
                 arch="mobilenet_v2", label="Original MobileNetV2")
    else:
        evaluate(MODELS / "plant_disease_model_candidate.pth",
                 arch="mobilenet_v2", label="Candidate MobileNetV2")
