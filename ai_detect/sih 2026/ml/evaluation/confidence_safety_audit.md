# FASAL DRISTHI — Confidence & Safety Audit

**Date:** 2026-09-18  
**Model:** EfficientNet-B0 Candidate (`plant_disease_candidate_efficientnet.pth`)  
**Test Set:** Independent PlantVillage test partition — 10,547 images, 38 classes  
**Active Model:** MobileNetV2 (`plant_disease_model.pth`) — UNCHANGED  

> [!IMPORTANT]
> All results in this report are from the **PlantVillage-based test set only**. No field images have been evaluated. These confidence metrics may not generalize to real-world field conditions.

---

## 1. Confidence Distribution Overview

![Confidence Histogram — Correct vs Wrong predictions](C:/Users/ANISH/.gemini/antigravity-ide/brain/139b45ce-49a1-4acc-a923-195ab51b8ebc/confidence_histogram.png)

| Confidence Bin | Count | % of Total | Accuracy in Bin |
|---|:---:|:---:|:---:|
| 0–10% | 0 | 0.00% | — |
| 10–20% | 72 | 0.68% | 36.11% |
| 20–30% | 325 | 3.08% | 52.92% |
| 30–40% | 469 | 4.45% | 67.38% |
| 40–50% | 623 | 5.91% | 75.76% |
| **50–60%** | **835** | **7.92%** | **88.26%** |
| **60–70%** | **1,070** | **10.15%** | **94.67%** |
| **70–80%** | **1,497** | **14.19%** | **97.86%** |
| **80–90%** | **2,283** | **21.65%** | **98.82%** |
| **90–95%** | **1,551** | **14.71%** | **99.68%** |
| **95–100%** | **1,822** | **17.28%** | **99.95%** |

**Key Observations:**
- **67.8%** of predictions have confidence ≥ 70%, with **99.09% accuracy** in this range
- **14.1%** of predictions have confidence < 50% — these are the highest-risk predictions
- Only **0.68%** of predictions are in the extreme low range (10–20%)
- The model produces **zero** predictions below 10% confidence

---

## 2. Confidence Threshold Analysis

This section answers: *"If we reject all predictions below threshold T, what accuracy do we get on the remaining predictions, and how many do we reject?"*

| Threshold | Predictions Accepted | Coverage | Accuracy (Accepted) | Predictions Rejected | Accuracy (Rejected) |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 0.30 | 10,150 | 96.24% | 94.84% | 397 | 49.87% |
| 0.40 | 9,681 | 91.79% | 96.17% | 866 | 59.35% |
| **0.50** | **9,058** | **85.88%** | **97.57%** | **1,489** | **66.22%** |
| **0.60** | **8,223** | **77.97%** | **98.52%** | **2,324** | **74.14%** |
| 0.70 | 7,153 | 67.82% | 99.09% | 3,394 | 80.61% |
| 0.80 | 5,656 | 53.63% | 99.42% | 4,891 | 85.89% |
| 0.90 | 3,373 | 31.98% | 99.82% | 7,174 | 90.01% |
| 0.95 | 1,822 | 17.28% | 99.95% | 8,725 | 91.72% |

### Recommended Thresholds

| Zone | Threshold | Accuracy | Coverage | Use Case |
|---|:---:|:---:|:---:|---|
| **HIGH CONFIDENCE** | ≥ 0.80 | 99.42% | 53.63% | Auto-accept — safe for direct advice |
| **MEDIUM / REVIEW** | 0.50 – 0.80 | 94.60% | 32.25% | Show prediction with "Review Recommended" badge |
| **LOW / REFER** | < 0.50 | 66.22% | 14.12% | Refer to expert — suppress auto-advice |

> [!WARNING]
> The current production thresholds (`HIGH_CONFIDENCE = 0.85`, `MEDIUM_CONFIDENCE = 0.60`) are close but not optimally tuned. Based on this analysis, **0.80 is the optimal high-confidence threshold** (99.42% accuracy at 53.63% coverage), and **0.50 is the optimal referral threshold** (97.57% accuracy above, only 14.12% referred).

---

## 3. Top-1 vs Top-3 Disagreement Analysis

| Metric | Value |
|---|:---:|
| Top-1 correct | 9,824 / 10,547 (93.14%) |
| Top-1 wrong but Top-3 correct | **607** (5.76%) |
| Both Top-1 and Top-3 wrong | 116 (1.10%) |
| **Top-3 rescue rate** | **83.96%** |

**What this means:**  
When the model's top prediction is wrong (723 cases), the correct answer is still in the top-3 predictions **84% of the time**. Only 116 images (1.1%) are completely missed by the top-3.

| Metric | When Top-1 Correct | When Top-1 Wrong |
|---|:---:|:---:|
| Mean confidence | **78.18%** | **42.84%** |
| Mean top-1 vs top-2 margin | **71.20%** | **21.51%** |

**Safety Insight:** Wrong predictions have dramatically lower confidence (42.8% vs 78.2%) and much tighter margins (21.5% vs 71.2%). This means the confidence and margin signals are **highly discriminative** — low-confidence predictions should trigger expert referral.

---

## 4. Calibration Analysis

![Calibration Curve](C:/Users/ANISH/.gemini/antigravity-ide/brain/139b45ce-49a1-4acc-a923-195ab51b8ebc/calibration_curve.png)

| Metric | Value |
|---|:---:|
| **Expected Calibration Error (ECE)** | **17.39%** |

### Calibration Breakdown

| Bin | Avg Confidence | Actual Accuracy | Gap | Trend |
|:---:|:---:|:---:|:---:|:---:|
| 10–20% | 17.6% | 36.1% | +18.5% | Underconfident |
| 20–30% | 25.5% | 52.9% | +27.4% | Underconfident |
| 30–40% | 35.6% | 67.4% | +31.8% | **Underconfident** |
| 40–50% | 45.3% | 75.8% | +30.5% | **Underconfident** |
| 50–60% | 55.1% | 88.3% | +33.2% | **Underconfident** |
| 60–70% | 65.2% | 94.7% | +29.5% | Underconfident |
| 70–80% | 75.2% | 97.9% | +22.7% | Underconfident |
| 80–90% | 85.3% | 98.8% | +13.5% | Slightly underconfident |
| 90–100% | 95.3% | 99.8% | +4.5% | Well calibrated |

> [!NOTE]
> **The model is systematically underconfident**, not overconfident. When it predicts 40% confidence, the actual accuracy is ~76%. When it predicts 60%, the actual accuracy is ~95%. This is **safer than overconfidence** but means the referral rate is higher than necessary. Temperature scaling (T < 1.0) could reduce unnecessary referrals by ~30% without losing safety.

### ECE = 17.39% — Is This Acceptable?

- ECE < 5% = Excellent calibration
- ECE 5–10% = Good calibration
- **ECE 10–20% = Moderate — needs improvement for safety-critical deployment**
- ECE > 20% = Poor calibration

The 17.39% ECE is driven by systematic underconfidence. This is a conservative failure mode (errs toward caution), but should be corrected with temperature scaling before production.

---

## 5. Prediction Entropy Analysis

| Metric | Value |
|---|:---:|
| Mean entropy (all) | 1.0164 nats |
| Median entropy | 0.8967 nats |
| 95th percentile entropy | 2.3227 nats |
| Max entropy | 3.1792 nats |
| **Mean entropy (correct predictions)** | **0.9538 nats** |
| **Mean entropy (wrong predictions)** | **1.8664 nats** |

**Entropy is highly discriminative:**  
Wrong predictions have **~2× higher entropy** than correct ones. An entropy threshold of ~1.5 nats could serve as an additional OOD/uncertainty filter.

**Maximum possible entropy** for 38 classes = ln(38) = 3.638 nats. The maximum observed (3.179) approaches this limit, meaning some predictions are nearly random.

---

## 6. Overconfident Wrong Predictions (Safety Critical)

These are the most dangerous predictions: the model is wrong but expresses ≥ 90% confidence.

| Class | Overconfident Wrong Count | Test Samples | Accuracy | Misclassified As |
|---|:---:|:---:|:---:|---|
| Corn — Northern Leaf Blight | **3** | 222 | 81.08% | Corn Cercospora leaf spot |
| Corn — Cercospora leaf spot | 1 | 104 | 91.35% | Corn Northern Leaf Blight |
| Potato — Late blight | 1 | 204 | 91.18% | Potato Early blight |
| Tomato — Late blight | 1 | 369 | 76.15% | Tomato Septoria leaf spot |

**Total overconfident errors: 6 / 10,547 = 0.057%**

> [!CAUTION]
> All 6 overconfident errors are **within the same crop** and involve visually similar diseases. These are medically-adjacent misclassifications (e.g., Corn Northern Leaf Blight confused with Corn Cercospora), which means the treatment recommendations may partially overlap. However, in a safety-critical agricultural context, even 6 such errors could lead to incorrect pesticide application.

---

## 7. Low-Confidence Classes (Risk Assessment)

Classes where the model frequently predicts correctly but with low confidence (< 50%):

| Class | Low-Conf Correct | Mean Confidence | Accuracy | Samples | Risk |
|---|:---:|:---:|:---:|:---:|---|
| Tomato — Yellow Leaf Curl Virus | 160 | 70.20% | 91.21% | 1,103 | False referrals |
| Soybean — healthy | 145 | 63.73% | 90.99% | 899 | Healthy → "uncertain" |
| Orange — Citrus greening | 78 | 75.91% | 99.31% | 1,166 | Unnecessary expert calls |
| Tomato — Septoria leaf spot | 77 | 54.18% | 70.83% | 312 | Genuine difficulty |
| Tomato — Bacterial spot | 75 | 69.94% | 95.25% | 463 | False referrals |
| Tomato — Late blight | 71 | 60.27% | 76.15% | 369 | Genuine difficulty |
| Peach — Bacterial spot | 68 | 68.18% | 88.18% | 440 | False referrals |
| Tomato — Target Spot | 45 | 64.82% | 82.88% | 257 | Genuine difficulty |

**Two failure modes emerge:**
1. **False referrals** — Model is correct but not confident enough, causing unnecessary expert escalation. Affects Soybean, Orange, Peach, and some Tomato diseases. Fix: temperature scaling.
2. **Genuine difficulty** — Tomato disease cluster (Early blight, Late blight, Septoria, Target Spot) shows both low confidence AND lower accuracy. These diseases have overlapping visual features. Fix: more training data, disease-specific features.

---

## 8. Per-Tier Safety Profile

### Tier 1: HIGH CONFIDENCE (≥ 0.80) — 5,656 predictions (53.63%)

| Metric | Value |
|---|:---:|
| Accuracy | **99.42%** |
| Error rate | 0.58% (33 errors) |
| Overconfident wrong (≥ 90%) | 6 |

**Verdict:** Safe for auto-advice. Error rate < 1%.

### Tier 2: MEDIUM (0.50 – 0.80) — 3,402 predictions (32.25%)

| Metric | Value |
|---|:---:|
| Accuracy | **94.60%** |
| Error rate | 5.40% (184 errors) |

**Verdict:** Show prediction with "Review Recommended" badge. User should inspect the top-3 list.

### Tier 3: LOW / REFER (< 0.50) — 1,489 predictions (14.12%)

| Metric | Value |
|---|:---:|
| Accuracy | **66.22%** |
| Error rate | 33.78% (503 errors) |

**Verdict:** Suppress auto-advice. Refer to agronomist. Show top-3 as "possible diagnoses" only.

---

## 9. Current Production Pipeline Gaps

### Existing Safety Mechanisms (in [`model.py`](file:///d:/ai_detect/sih%202026/ml/app/model.py))

| Feature | Implementation | Status |
|---|---|:---:|
| Three-tier confidence badge | `HIGH_CONFIDENCE` / `REVIEW_RECOMMENDED` / `LOW_UNCERTAIN` | ✅ Present |
| Threshold: High | 0.85 | ⚠️ Should be 0.80 |
| Threshold: Medium | 0.60 | ⚠️ Should be 0.50 |
| Crop mismatch detection | Compares user-input crop vs predicted crop | ✅ Present |
| Top-K predictions | Returns top-3 with probabilities | ✅ Present |
| Expert referral text | Static text suggestion | ✅ Present |

### Missing Safety Mechanisms

| Gap | Impact | Priority | Recommendation |
|---|---|:---:|---|
| **No OOD detection** | Unknown diseases get forced 38-class prediction | 🔴 Critical | Add entropy threshold (> 2.3 nats → "Unknown") |
| **No temperature scaling** | 17.39% ECE, systematic underconfidence | 🟡 High | Learn optimal T on validation set (expect T ≈ 0.6–0.8) |
| **No margin reporting** | Top-1/Top-2 margin not exposed | 🟡 High | Add `margin` field to API response |
| **No entropy reporting** | Entropy not computed or returned | 🟡 High | Add `entropy` field to API response |
| **No auto-referral workflow** | `LOW_UNCERTAIN` is badge-only | 🟡 High | Integrate with expert-connect feature |
| **No confidence on field images** | All metrics are PlantVillage-only | 🔴 Critical | Requires field image dataset |
| **No misclassification cost** | All errors treated equally | 🟢 Medium | Healthy→Diseased errors are costlier than crop confusion |

---

## 10. Recommended Confidence Configuration

Based on this audit, the following configuration changes are recommended:

```python
# app/config.py — proposed changes
HIGH_CONFIDENCE_THRESHOLD = 0.80    # was 0.85 → captures 99.42% accuracy
MEDIUM_CONFIDENCE_THRESHOLD = 0.50  # was 0.60 → reduces false referrals
ENTROPY_THRESHOLD = 2.3             # NEW: predictions above this → "Unknown/OOD"
MARGIN_THRESHOLD = 0.15             # NEW: top1-top2 margin below this → flag disagreement
```

**Expected impact of threshold changes:**

| Change | Before | After | Effect |
|---|---|---|---|
| High threshold: 0.85 → 0.80 | ~45% auto-accept | ~54% auto-accept | +9% coverage, same safety |
| Medium threshold: 0.60 → 0.50 | ~22% referral rate | ~14% referral rate | −8% unnecessary referrals |
| Add entropy filter (2.3 nats) | No OOD detection | Top-5% entropy flagged | New safety layer |
| Add margin filter (0.15) | No disagreement flag | Ambiguous predictions flagged | New safety layer |

---

## 11. Summary

| Audit Item | Finding | Risk Level |
|---|---|:---:|
| Overall calibration | ECE = 17.39% (underconfident) | 🟡 Moderate |
| Overconfident errors | 6 / 10,547 (0.057%) | 🟢 Low |
| Top-3 rescue rate | 84% of wrong predictions rescued by top-3 | 🟢 Low |
| Confidence discriminability | Wrong predictions avg 42.8% vs correct 78.2% | 🟢 Strong signal |
| OOD detection | Not implemented | 🔴 Critical gap |
| Field validation | Not performed | 🔴 Critical gap |
| Temperature calibration | Not applied | 🟡 Needed before production |
| Tomato disease cluster | 4 diseases with F1 < 85% and low confidence | 🟡 Known weakness |

> [!WARNING]
> **The model's confidence signal is effective for triaging predictions** on PlantVillage data. However, these calibration metrics have NOT been validated on real field images. Before production deployment, field-image calibration must be measured separately.

---

## Files Generated

| File | Description |
|---|---|
| [confidence_analysis.json](file:///d:/ai_detect/sih%202026/ml/evaluation/confidence_analysis.json) | Full confidence analysis data |
| [confidence_histogram.png](file:///d:/ai_detect/sih%202026/ml/evaluation/confidence_histogram.png) | Confidence distribution chart |
| [calibration_curve.png](file:///d:/ai_detect/sih%202026/ml/evaluation/calibration_curve.png) | Calibration curve with ECE |
| [confidence_analysis.py](file:///d:/ai_detect/sih%202026/ml/scripts/confidence_analysis.py) | Analysis script (reproducible) |
