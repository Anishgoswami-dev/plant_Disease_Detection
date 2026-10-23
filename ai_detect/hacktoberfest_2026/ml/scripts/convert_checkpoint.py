"""
Fasal Dristhi — Checkpoint Converter & Verification Script
Converts the audited candidate checkpoint (A2H0H0R1/mobilenet_v2_1.0_224-plant-disease)
to standard torchvision MobileNetV2 state_dict format, outputting plant_disease_model_candidate.pth.
"""

import os
import sys
import json
from pathlib import Path
import urllib.request
import torch
import torchvision.models as models
from safetensors.torch import load_file

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
RAW_SAFETENSORS = MODELS_DIR / "candidate_raw.safetensors"
CANDIDATE_PTH = MODELS_DIR / "plant_disease_model_candidate.pth"
CLASS_INDICES = MODELS_DIR / "class_indices.json"

HF_REPO_URL = "https://huggingface.co/A2H0H0R1/mobilenet_v2_1.0_224-plant-disease/resolve/main/model.safetensors"
HF_CONFIG_URL = "https://huggingface.co/A2H0H0R1/mobilenet_v2_1.0_224-plant-disease/raw/main/config.json"
HF_EVAL_URL = "https://huggingface.co/A2H0H0R1/mobilenet_v2_1.0_224-plant-disease/raw/main/eval_results.json"


def download_and_verify_metadata():
    print("[1/4] Verifying checkpoint metadata & class mapping...")
    req = urllib.request.Request(HF_CONFIG_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        cfg = json.loads(resp.read().decode())

    hf_id2label = cfg.get("id2label", {})
    with open(CLASS_INDICES, "r", encoding="utf-8") as f:
        local_indices = json.load(f)

    if len(hf_id2label) != len(local_indices):
        raise ValueError(f"Class count mismatch: HF has {len(hf_id2label)}, local has {len(local_indices)}")

    for idx in range(len(local_indices)):
        hf_cls = hf_id2label.get(str(idx))
        loc_cls = local_indices.get(str(idx))
        if hf_cls != loc_cls:
            raise ValueError(f"Class mapping mismatch at index {idx}: HF='{hf_cls}' vs Local='{loc_cls}'")

    print(f"  [OK] All {len(local_indices)} classes matched identically (0..37).")

    # Fetch verified eval results
    try:
        req_eval = urllib.request.Request(HF_EVAL_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req_eval) as resp:
            ev = json.loads(resp.read().decode())
        print(f"  [OK] Checkpoint eval accuracy: {ev.get('eval_accuracy', 0)*100:.2f}%, loss: {ev.get('eval_loss', 0):.4f}")
    except Exception as e:
        print(f"  [WARN] Could not fetch eval_results.json: {e}")


def convert_and_save():
    print("[2/4] Downloading / Loading candidate safetensors...")
    if not RAW_SAFETENSORS.exists():
        print(f"  Downloading from {HF_REPO_URL} ...")
        urllib.request.urlretrieve(HF_REPO_URL, RAW_SAFETENSORS)
        print(f"  Downloaded: {RAW_SAFETENSORS.stat().st_size} bytes")
    else:
        print(f"  Using cached {RAW_SAFETENSORS} ({RAW_SAFETENSORS.stat().st_size} bytes)")

    hf_sd = load_file(str(RAW_SAFETENSORS))

    print("[3/4] Mapping HuggingFace layer keys to torchvision MobileNetV2...")
    tv_model = models.mobilenet_v2()
    tv_model.classifier[1] = torch.nn.Linear(1280, 38)
    tv_sd = tv_model.state_dict()

    mapped_sd = {}

    # 1. Stem First Conv -> features.0
    mapped_sd["features.0.0.weight"] = hf_sd["mobilenet_v2.conv_stem.first_conv.convolution.weight"]
    mapped_sd["features.0.1.weight"] = hf_sd["mobilenet_v2.conv_stem.first_conv.normalization.weight"]
    mapped_sd["features.0.1.bias"] = hf_sd["mobilenet_v2.conv_stem.first_conv.normalization.bias"]
    mapped_sd["features.0.1.running_mean"] = hf_sd["mobilenet_v2.conv_stem.first_conv.normalization.running_mean"]
    mapped_sd["features.0.1.running_var"] = hf_sd["mobilenet_v2.conv_stem.first_conv.normalization.running_var"]
    mapped_sd["features.0.1.num_batches_tracked"] = hf_sd["mobilenet_v2.conv_stem.first_conv.normalization.num_batches_tracked"]

    # 2. Stem Inverted Residual (expansion=1) -> features.1
    mapped_sd["features.1.conv.0.0.weight"] = hf_sd["mobilenet_v2.conv_stem.conv_3x3.convolution.weight"]
    mapped_sd["features.1.conv.0.1.weight"] = hf_sd["mobilenet_v2.conv_stem.conv_3x3.normalization.weight"]
    mapped_sd["features.1.conv.0.1.bias"] = hf_sd["mobilenet_v2.conv_stem.conv_3x3.normalization.bias"]
    mapped_sd["features.1.conv.0.1.running_mean"] = hf_sd["mobilenet_v2.conv_stem.conv_3x3.normalization.running_mean"]
    mapped_sd["features.1.conv.0.1.running_var"] = hf_sd["mobilenet_v2.conv_stem.conv_3x3.normalization.running_var"]
    mapped_sd["features.1.conv.0.1.num_batches_tracked"] = hf_sd["mobilenet_v2.conv_stem.conv_3x3.normalization.num_batches_tracked"]

    mapped_sd["features.1.conv.1.weight"] = hf_sd["mobilenet_v2.conv_stem.reduce_1x1.convolution.weight"]
    mapped_sd["features.1.conv.2.weight"] = hf_sd["mobilenet_v2.conv_stem.reduce_1x1.normalization.weight"]
    mapped_sd["features.1.conv.2.bias"] = hf_sd["mobilenet_v2.conv_stem.reduce_1x1.normalization.bias"]
    mapped_sd["features.1.conv.2.running_mean"] = hf_sd["mobilenet_v2.conv_stem.reduce_1x1.normalization.running_mean"]
    mapped_sd["features.1.conv.2.running_var"] = hf_sd["mobilenet_v2.conv_stem.reduce_1x1.normalization.running_var"]
    mapped_sd["features.1.conv.2.num_batches_tracked"] = hf_sd["mobilenet_v2.conv_stem.reduce_1x1.normalization.num_batches_tracked"]

    # 3. Layers 0..15 -> features.2..17
    for hf_layer in range(16):
        tv_idx = hf_layer + 2
        # expand_1x1
        mapped_sd[f"features.{tv_idx}.conv.0.0.weight"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.expand_1x1.convolution.weight"]
        mapped_sd[f"features.{tv_idx}.conv.0.1.weight"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.expand_1x1.normalization.weight"]
        mapped_sd[f"features.{tv_idx}.conv.0.1.bias"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.expand_1x1.normalization.bias"]
        mapped_sd[f"features.{tv_idx}.conv.0.1.running_mean"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.expand_1x1.normalization.running_mean"]
        mapped_sd[f"features.{tv_idx}.conv.0.1.running_var"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.expand_1x1.normalization.running_var"]
        mapped_sd[f"features.{tv_idx}.conv.0.1.num_batches_tracked"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.expand_1x1.normalization.num_batches_tracked"]
        
        # conv_3x3 (depthwise)
        mapped_sd[f"features.{tv_idx}.conv.1.0.weight"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.conv_3x3.convolution.weight"]
        mapped_sd[f"features.{tv_idx}.conv.1.1.weight"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.conv_3x3.normalization.weight"]
        mapped_sd[f"features.{tv_idx}.conv.1.1.bias"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.conv_3x3.normalization.bias"]
        mapped_sd[f"features.{tv_idx}.conv.1.1.running_mean"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.conv_3x3.normalization.running_mean"]
        mapped_sd[f"features.{tv_idx}.conv.1.1.running_var"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.conv_3x3.normalization.running_var"]
        mapped_sd[f"features.{tv_idx}.conv.1.1.num_batches_tracked"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.conv_3x3.normalization.num_batches_tracked"]

        # reduce_1x1 (project)
        mapped_sd[f"features.{tv_idx}.conv.2.weight"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.reduce_1x1.convolution.weight"]
        mapped_sd[f"features.{tv_idx}.conv.3.weight"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.reduce_1x1.normalization.weight"]
        mapped_sd[f"features.{tv_idx}.conv.3.bias"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.reduce_1x1.normalization.bias"]
        mapped_sd[f"features.{tv_idx}.conv.3.running_mean"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.reduce_1x1.normalization.running_mean"]
        mapped_sd[f"features.{tv_idx}.conv.3.running_var"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.reduce_1x1.normalization.running_var"]
        mapped_sd[f"features.{tv_idx}.conv.3.num_batches_tracked"] = hf_sd[f"mobilenet_v2.layer.{hf_layer}.reduce_1x1.normalization.num_batches_tracked"]

    # 4. Final Conv 1x1 -> features.18
    mapped_sd["features.18.0.weight"] = hf_sd["mobilenet_v2.conv_1x1.convolution.weight"]
    mapped_sd["features.18.1.weight"] = hf_sd["mobilenet_v2.conv_1x1.normalization.weight"]
    mapped_sd["features.18.1.bias"] = hf_sd["mobilenet_v2.conv_1x1.normalization.bias"]
    mapped_sd["features.18.1.running_mean"] = hf_sd["mobilenet_v2.conv_1x1.normalization.running_mean"]
    mapped_sd["features.18.1.running_var"] = hf_sd["mobilenet_v2.conv_1x1.normalization.running_var"]
    mapped_sd["features.18.1.num_batches_tracked"] = hf_sd["mobilenet_v2.conv_1x1.normalization.num_batches_tracked"]

    # 5. Classifier
    mapped_sd["classifier.1.weight"] = hf_sd["classifier.weight"]
    mapped_sd["classifier.1.bias"] = hf_sd["classifier.bias"]

    # Validate all 314 tensors match
    if len(mapped_sd) != len(tv_sd):
        raise ValueError(f"Key count mismatch: mapped {len(mapped_sd)} vs expected {len(tv_sd)}")

    for k in tv_sd:
        if k not in mapped_sd:
            raise KeyError(f"Missing mapped key: {k}")
        if tv_sd[k].shape != mapped_sd[k].shape:
            raise ValueError(f"Shape mismatch for {k}: expected {tv_sd[k].shape}, got {mapped_sd[k].shape}")

    tv_model.load_state_dict(mapped_sd)
    print("  [OK] Validated all 314 layers. State dict matches MobileNetV2 perfectly.")

    print(f"[4/4] Saving candidate model to {CANDIDATE_PTH}...")
    torch.save(mapped_sd, str(CANDIDATE_PTH))
    print(f"  [DONE] Candidate checkpoint successfully created: {CANDIDATE_PTH} ({CANDIDATE_PTH.stat().st_size} bytes)")


if __name__ == "__main__":
    download_and_verify_metadata()
    convert_and_save()
