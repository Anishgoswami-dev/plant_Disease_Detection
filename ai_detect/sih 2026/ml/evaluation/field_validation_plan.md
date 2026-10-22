# FASAL DRISTHI — Field Validation Plan

**Date:** 2026-09-18  
**Status:** PRE-PRODUCTION — No model has been promoted  
**Active Model:** MobileNetV2 (`plant_disease_model.pth`) — UNCHANGED  
**Candidate Model:** EfficientNet-B0 (`plant_disease_candidate_efficientnet.pth`) — UNCHANGED  

---

## 1. Context & Motivation

The EfficientNet-B0 candidate achieved **93.14% Top-1 accuracy** on the PlantVillage-based independent test set (10,547 images, 38 classes). However, PlantVillage images are:

- Captured under **controlled laboratory conditions**
- Cropped to **single, centered leaves** on uniform backgrounds
- Curated by **plant pathologists** with known ground truth
- Free of blur, occlusion, shadows, and complex field backgrounds

> [!CAUTION]
> **PlantVillage benchmark accuracy does NOT predict real-world field accuracy.** Published research consistently shows 20–40 percentage point accuracy drops when lab-trained plant disease models are deployed on field images (Mohanty et al., 2016; Ferentinos, 2018; Too et al., 2019). A 93% PlantVillage score may correspond to 55–75% field accuracy without domain adaptation.

---

## 2. PlantVillage vs Real Field: Domain Gap Analysis

| Factor | PlantVillage (Lab) | Real Field | Impact on Model |
|---|---|---|---|
| **Background** | Uniform white/black | Soil, sky, weeds, other plants | Feature confusion, false positives |
| **Lighting** | Controlled, even | Variable — sun, shadow, overcast, dusk | Brightness/contrast shifts |
| **Leaf presentation** | Single, flat, centered | Multiple leaves, overlapping, curled | Partial occlusion, wrong crop region |
| **Image quality** | High resolution, sharp | Variable blur, phone cameras, compression | Loss of lesion detail |
| **Disease stage** | Moderate to severe symptoms | Early, mild, or mixed symptoms | Missed early-stage infections |
| **Angle & distance** | Standardized top-down | Varying angles, whole plant shots | Scale invariance failures |
| **Species variation** | Limited cultivar range | Regional cultivar diversity | Unseen phenotype confusion |
| **Unknown diseases** | N/A (closed-set) | Out-of-distribution (OOD) diseases | Forced misclassification |
| **Non-leaf inputs** | N/A | Stems, fruits, roots, soil, insects | Completely unexpected inputs |

---

## 3. Field Validation Workflow Design

### 3.1 Data Collection Protocol

To perform a meaningful field validation, the following data must be collected:

#### Required Test Image Categories

| Category | Description | Min. Images | Priority |
|---|---|:---:|:---:|
| **A. Standard field photos** | Single diseased leaf in natural field setting | 200 | 🔴 Critical |
| **B. Healthy leaves** | Healthy leaves from all 14 supported crops | 100 | 🔴 Critical |
| **C. Blurred images** | Intentionally out-of-focus or motion-blurred | 50 | 🟡 High |
| **D. Poor lighting** | Underexposed, overexposed, harsh shadows | 50 | 🟡 High |
| **E. Multiple leaves** | Frame contains multiple leaves, some healthy | 50 | 🟡 High |
| **F. Complex backgrounds** | Soil, weeds, other crops visible | 50 | 🟡 High |
| **G. Early-stage disease** | Subtle, early-onset symptoms (< 5% affected) | 50 | 🔴 Critical |
| **H. Unknown/unsupported** | Diseases not in the 38-class taxonomy | 50 | 🔴 Critical |
| **I. Non-leaf plant parts** | Stems, fruits, roots with disease symptoms | 30 | 🟢 Medium |
| **J. Non-plant images** | Random objects, text, animals (negative control) | 30 | 🟢 Medium |
| **K. Regional cultivars** | Indian-specific crop varieties (desi cultivars) | 50 | 🟡 High |

**Total minimum:** ~710 expert-labeled field images

#### Labeling Requirements

Each field image MUST have:
1. **Ground truth label** — Confirmed by a plant pathologist or trained agronomist
2. **Disease stage** — Early / Moderate / Severe / Healthy
3. **Image quality tag** — Clear / Blurry / Dark / Overexposed / Complex-BG
4. **Crop species** — Specific cultivar if known
5. **Capture metadata** — Date, location (GPS or district), phone model if available
6. **Known/Unknown flag** — Whether the disease is in the 38-class taxonomy

#### Data Sources

| Source | Feasibility | Notes |
|---|---|---|
| **iNaturalist / PlantDoc** | ✅ Available | CC-licensed field photos of plant diseases |
| **EPPO photo library** | ⚠️ Restricted | Professional pathology images, license required |
| **Government KVK field data** | ⚠️ Requires partnership | Indian field data with regional cultivars |
| **Manual field collection** | ✅ Self-controlled | Controlled protocol, highest quality labels |
| **User-uploaded (production)** | ✅ Future pipeline | Requires consent, de-identification, labeling |

---

### 3.2 Field Validation Execution Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIELD VALIDATION PIPELINE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. IMAGE INTAKE                                                 │
│     ├── Receive field image (file or URL)                        │
│     ├── Record capture metadata                                  │
│     └── Assign ground truth label (expert pathologist)           │
│                                                                  │
│  2. QUALITY GATE (existing preprocessing.py)                     │
│     ├── Resolution check (≥ 100×100)                             │
│     ├── Blur detection (Laplacian variance < 35 → reject)        │
│     ├── Brightness check (too dark < 30, overexposed > 235)      │
│     ├── Vegetation ratio check (< 8% → reject as non-plant)     │
│     └── Log: pass/fail + quality_score                           │
│                                                                  │
│  3. MODEL INFERENCE (EfficientNet-B0 candidate)                  │
│     ├── Resize 256 → CenterCrop 224 → Normalize                 │
│     ├── Forward pass → Softmax probabilities                     │
│     ├── Extract Top-1 prediction + confidence                    │
│     ├── Extract Top-3 predictions + confidences                  │
│     └── Compute prediction entropy                               │
│                                                                  │
│  4. CONFIDENCE TRIAGE                                            │
│     ├── HIGH CONFIDENCE (≥ 0.85):  → Accept prediction           │
│     ├── MEDIUM (0.50 – 0.85):      → Flag for review             │
│     ├── LOW / UNCERTAIN (< 0.50):  → Refer to expert             │
│     └── Top-1 ≠ Top-3 ground truth → Flag disagreement           │
│                                                                  │
│  5. COMPARISON                                                   │
│     ├── Compare prediction vs ground truth                       │
│     ├── Log: correct / incorrect / referred                      │
│     ├── Stratify by image category (A–K)                         │
│     └── Record per-category accuracy & confidence stats          │
│                                                                  │
│  6. REPORTING                                                    │
│     ├── Overall field accuracy (Top-1, Top-3)                    │
│     ├── Per-category accuracy breakdown                          │
│     ├── Confidence calibration on field images                   │
│     ├── Referral rate (% sent to expert)                         │
│     ├── False positive rate for OOD images                       │
│     └── Comparison: PlantVillage accuracy vs field accuracy      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Evaluation Script Specification

Create `scripts/evaluate_field_images.py` with the following interface:

```
python scripts/evaluate_field_images.py \
  --checkpoint models/plant_disease_candidate_efficientnet.pth \
  --arch efficientnet \
  --field-dir evaluation/field_test_images/ \
  --labels evaluation/field_labels.csv \
  --confidence-threshold 0.50 \
  --output evaluation/field_evaluation_report.json
```

**Expected `field_labels.csv` format:**

```csv
filename,class_name,class_idx,disease_stage,quality_tag,category,is_in_taxonomy
field_001.jpg,Tomato___Early_blight,29,moderate,clear,A,true
field_002.jpg,Tomato___healthy,37,healthy,blurry,C,true
field_003.jpg,UNKNOWN_rust,,-1,early,clear,H,false
```

---

## 4. Metrics to Report

### 4.1 Primary Field Metrics

| Metric | Description |
|---|---|
| **Field Top-1 Accuracy** | % correct on in-taxonomy field images |
| **Field Top-3 Accuracy** | % where correct label is in top-3 |
| **Field Balanced Accuracy** | Adjusted for class imbalance |
| **Macro-F1 (field)** | Class-weighted harmonic mean |
| **Referral Rate** | % of predictions below confidence threshold |
| **Coverage** | % of images that receive a high-confidence prediction |
| **OOD Rejection Rate** | % of unknown/unsupported images correctly NOT given a high-confidence prediction |
| **Quality Gate Rejection Rate** | % of images rejected by preprocessing (blur, dark, no vegetation) |

### 4.2 Safety-Critical Metrics

| Metric | Description | Acceptable Range |
|---|---|---|
| **False Positive Rate (Healthy → Diseased)** | Healthy leaves misclassified as diseased | < 5% |
| **False Negative Rate (Diseased → Healthy)** | Diseased leaves misclassified as healthy | < 3% |
| **High-Confidence Error Rate** | Wrong predictions with confidence ≥ 0.85 | < 2% |
| **OOD High-Confidence Rate** | Unknown diseases receiving confidence ≥ 0.85 | < 10% |

### 4.3 Stratified Reporting

Report accuracy separately for each image category (A through K) to identify specific failure modes.

---

## 5. Existing Pipeline Audit

### 5.1 What Already Exists

| Component | File | Status |
|---|---|---|
| Image validation | [`preprocessing.py`](file:///d:/ai_detect/sih%202026/ml/app/preprocessing.py) | ✅ Production-ready |
| Blur detection | `preprocessing.py` L57-58 | ✅ Laplacian variance threshold = 35 |
| Brightness check | `preprocessing.py` L61-63 | ✅ Dark < 30, Overexposed > 235 |
| Vegetation detection | `preprocessing.py` L66-85 | ✅ HSV green+yellow mask, threshold = 8% |
| Quality score | `preprocessing.py` L88-97 | ✅ Composite 0–100 score |
| Confidence triage | [`model.py`](file:///d:/ai_detect/sih%202026/ml/app/model.py) L165-170 | ✅ Three-tier: HIGH (≥0.85) / REVIEW (≥0.60) / LOW |
| Reliability badge | `model.py` L170 | ✅ `HIGH_CONFIDENCE`, `REVIEW_RECOMMENDED`, `LOW_UNCERTAIN` |
| Crop mismatch check | `model.py` L167 | ✅ Compares user-specified crop vs prediction |
| Top-K predictions | `model.py` L124 | ✅ Returns top-3 with probabilities |
| Expert referral | `model.py` L226 | ✅ Text message for expert referral |

### 5.2 What is MISSING for Field Validation

| Gap | Description | Priority |
|---|---|---|
| **No entropy / uncertainty score** | Only returns softmax confidence, not calibrated uncertainty | 🔴 Critical |
| **No OOD detection** | Model forces classification into one of 38 classes even for unknown inputs | 🔴 Critical |
| **No margin reporting** | Top-1 vs Top-2 margin not exposed in API response | 🟡 High |
| **No field-image test set** | No curated, expert-labeled field images exist | 🔴 Critical |
| **No auto-referral mechanism** | `LOW_UNCERTAIN` badge is informational only; no workflow escalation | 🟡 High |
| **No calibration** | Softmax probabilities are not temperature-scaled or Platt-calibrated | 🟡 High |
| **Quality gate too strict for field** | Blur threshold (35) and vegetation threshold (8%) may reject valid field images | 🟡 High |
| **No multi-leaf handling** | Pipeline assumes single-leaf input; no segmentation for multi-leaf frames | 🟢 Medium |

---

## 6. Data Required for Meaningful Field Validation

> [!IMPORTANT]
> **Field validation CANNOT proceed without the following data.** Do not fabricate field test results.

### Minimum Viable Field Test Set

| Requirement | Quantity | Source |
|---|---|---|
| Expert-labeled field images (in-taxonomy diseases) | ≥ 200 | Manual collection or PlantDoc dataset |
| Expert-labeled healthy field images | ≥ 50 | Manual collection |
| Out-of-distribution (OOD) disease images | ≥ 30 | iNaturalist or manual |
| Blurred / poor-quality images (with known labels) | ≥ 30 | Manual collection |
| Non-plant negative controls | ≥ 20 | Any source |

### Recommended Open Datasets for Initial Field Testing

| Dataset | Description | Availability |
|---|---|---|
| **PlantDoc** | 2,598 field images, 27 classes, real-world conditions | [GitHub](https://github.com/pratikkayal/PlantDoc-Dataset) |
| **iNaturalist (plant pathology)** | Community-sourced plant disease photos | API available |
| **Digipathos (EMBRAPA)** | 2,326 field images, Brazilian crops | Open access |
| **CGIAR PlantVillage field** | Subset with in-field photos | Partial access |

---

## 7. Recommended Pre-Production Checklist

Before promoting the EfficientNet-B0 candidate to production:

- [ ] **Collect ≥ 200 expert-labeled field images** spanning all 14 supported crops
- [ ] **Collect ≥ 30 OOD disease images** not in the 38-class taxonomy
- [ ] **Run field evaluation** using the same evaluation script with `--split field`
- [ ] **Measure field accuracy** and compare against PlantVillage benchmark
- [ ] **Verify OOD rejection** — model should NOT assign high confidence to unknown diseases
- [ ] **Calibrate confidence** — apply temperature scaling to align confidence with actual accuracy
- [ ] **Tune quality gate thresholds** — validate blur/vegetation thresholds on field images
- [ ] **Add prediction entropy** to API response for downstream safety logic
- [ ] **Add Top-1/Top-2 margin** to API response for disagreement flagging
- [ ] **Document acceptable field accuracy threshold** (e.g., ≥ 80% Top-1 on field images)
- [ ] **A/B test in production** — serve candidate alongside baseline for shadow evaluation
- [ ] **Obtain agronomist sign-off** on field validation results

---

## 8. Summary

| Item | Status |
|---|---|
| PlantVillage benchmark | ✅ Complete — 93.14% Top-1 |
| Field test dataset | ❌ Not yet collected |
| Field accuracy | ❌ Unknown — cannot be claimed |
| OOD detection | ❌ Not implemented |
| Confidence calibration | ❌ Not applied |
| Production readiness | ❌ Not yet validated |

> [!WARNING]
> **The model is NOT production-ready until field validation is complete.** PlantVillage benchmark accuracy is a necessary but insufficient condition for deployment.
