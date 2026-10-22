"""
Generate confusion matrix heatmap images for both models.
"""
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parent.parent
EVAL_DIR = ML_ROOT / "evaluation"

CLASS_INDICES = ML_ROOT / "models" / "class_indices.json"
with open(CLASS_INDICES, "r", encoding="utf-8") as f:
    class_map = json.load(f)
classes = [class_map[str(i)] for i in range(len(class_map))]
# Shorten class names for display
short_names = [c.replace("___", "\n").replace("_(including_sour)", "").replace("_(maize)", "")
               .replace("_", " ").replace(",", "") for c in classes]


def plot_confusion_matrix(cm, title, out_path):
    fig, ax = plt.subplots(figsize=(22, 20))
    
    # Normalize for display
    cm_norm = cm.astype(float)
    row_sums = cm_norm.sum(axis=1, keepdims=True)
    row_sums[row_sums == 0] = 1
    cm_norm = cm_norm / row_sums
    
    im = ax.imshow(cm_norm, interpolation='nearest', cmap='Blues', vmin=0, vmax=1)
    ax.set_title(title, fontsize=18, fontweight='bold', pad=20)
    
    cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    cbar.set_label('Recall (row-normalized)', fontsize=12)
    
    tick_marks = np.arange(len(classes))
    ax.set_xticks(tick_marks)
    ax.set_xticklabels(short_names, rotation=90, ha='center', fontsize=6)
    ax.set_yticks(tick_marks)
    ax.set_yticklabels(short_names, fontsize=6)
    
    ax.set_ylabel('True Label', fontsize=14)
    ax.set_xlabel('Predicted Label', fontsize=14)
    
    # Add text annotations for diagonal
    for i in range(len(classes)):
        val = cm_norm[i, i]
        color = 'white' if val > 0.5 else 'black'
        ax.text(i, i, f'{val:.0%}', ha='center', va='center', fontsize=5, color=color, fontweight='bold')
    
    plt.tight_layout()
    fig.savefig(out_path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"Saved: {out_path}")


# EfficientNet
with open(EVAL_DIR / "candidate_efficientnet_test_eval.json", "r") as f:
    eff_data = json.load(f)
cm_eff = np.array(eff_data["confusion_matrix"])
plot_confusion_matrix(cm_eff, "EfficientNet-B0 Candidate — Confusion Matrix (Test Set, n=10,547)",
                      EVAL_DIR / "confusion_matrix_efficientnet.png")

# MobileNetV2
with open(EVAL_DIR / "baseline_mobilenetv2_test_eval.json", "r") as f:
    mob_data = json.load(f)
cm_mob = np.array(mob_data["confusion_matrix"])
plot_confusion_matrix(cm_mob, "MobileNetV2 Baseline — Confusion Matrix (Test Set, n=10,547)",
                      EVAL_DIR / "confusion_matrix_mobilenetv2.png")

# Save combined metrics JSON
combined = {
    "evaluation_config": {
        "test_set": "ml/datasets/plantvillage_isolated/test/",
        "samples_evaluated": 10547,
        "num_classes": 38
    },
    "efficientnet_b0_candidate": {
        "checkpoint": eff_data["checkpoint"],
        "top1_accuracy": eff_data["top1_accuracy"],
        "top3_accuracy": eff_data["top3_accuracy"],
        "balanced_accuracy": eff_data["balanced_accuracy"],
        "macro_precision": eff_data["macro_precision"],
        "macro_recall": eff_data["macro_recall"],
        "macro_f1": eff_data["macro_f1"],
        "weighted_f1": eff_data["weighted_f1"],
        "latency_ms": eff_data["latency_ms"],
        "per_class_metrics": eff_data["per_class_metrics"]
    },
    "mobilenetv2_baseline": {
        "checkpoint": mob_data["checkpoint"],
        "top1_accuracy": mob_data["top1_accuracy"],
        "top3_accuracy": mob_data["top3_accuracy"],
        "balanced_accuracy": mob_data["balanced_accuracy"],
        "macro_precision": mob_data["macro_precision"],
        "macro_recall": mob_data["macro_recall"],
        "macro_f1": mob_data["macro_f1"],
        "weighted_f1": mob_data["weighted_f1"],
        "latency_ms": mob_data["latency_ms"],
        "per_class_metrics": mob_data["per_class_metrics"]
    }
}

with open(EVAL_DIR / "candidate_metrics.json", "w", encoding="utf-8") as f:
    json.dump(combined, f, indent=2)
print(f"Saved: {EVAL_DIR / 'candidate_metrics.json'}")
print("Done.")
