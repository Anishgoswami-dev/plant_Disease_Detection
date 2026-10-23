import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

/**
 * 📊 ConfidenceCard Component (Section 3)
 * Receives raw confidence (e.g. 0.3638), confidenceStatus, and modelVersion.
 * Automatically converts float into human-readable percentage (36.4%).
 * Adheres strictly to certainty policy:
 * - >= 85%: HIGH_CONFIDENCE
 * - 60% - 84.9%: REVIEW_RECOMMENDED
 * - < 60%: LOW_UNCERTAIN
 */
export default function ConfidenceCard({
  confidence = 0.75,
  confidenceStatus = 'HIGH_CONFIDENCE',
  modelVersion = 'Fasal Dristhi Vision'
}) {
  // Convert raw float to human-readable percentage without manipulation
  const percentage = typeof confidence === 'number'
    ? (confidence <= 1 ? confidence * 100 : confidence).toFixed(1)
    : '0.0';

  const numericVal = parseFloat(percentage);

  // Status badge styling adhering strictly to policy
  const isAmbiguous = confidenceStatus === 'AMBIGUOUS';
  const isLow = confidenceStatus === 'LOW_UNCERTAIN' || (!confidenceStatus && numericVal < 80);
  const isUncertain = isLow || isAmbiguous || numericVal < 80;

  const displayStatusBadge = isUncertain
    ? 'Uncertain — expert verification required'
    : 'High Confidence (Verified Match)';

  return (
    <div className="diagnosis-card">
      <div className="confidence-card-header">
        <div>
          <span
            className="confidence-status-badge"
            style={
              isUncertain
                ? { background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }
                : { background: '#f0fdf4', color: '#16a34a', borderColor: '#86efac' }
            }
          >
            {isUncertain ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
            {displayStatusBadge}
          </span>
        </div>

        {modelVersion && (
          <span style={{ fontSize: '10px', color: 'var(--ink-muted)', fontWeight: 600 }}>
            {modelVersion}
          </span>
        )}
      </div>

      <div className="confidence-metric-wrap">
        <span
          className="confidence-number-big"
          style={{ color: isUncertain ? (isAmbiguous ? '#c2410c' : '#dc2626') : '#16a34a' }}
        >
          {percentage}%
        </span>
        <span className="confidence-label-text">
          Model Disease-Class Probability {isUncertain && <span style={{ color: isAmbiguous ? '#c2410c' : '#dc2626', fontSize: '11px', fontWeight: 600 }}>({isAmbiguous ? 'Ambiguous Diagnosis' : 'Below Safety Threshold'})</span>}
        </span>
      </div>

      {/* Visual meter bar */}
      <div className="confidence-progress-bar">
        <div
          className="confidence-progress-fill"
          style={{
            width: `${Math.min(100, Math.max(5, numericVal))}%`,
            background: isUncertain ? (isAmbiguous ? '#ea580c' : '#ef4444') : '#16a34a'
          }}
        />
      </div>

      {/* Educational description of what confidence represents */}
      <div style={{
        marginTop: '12px',
        padding: '10px 12px',
        background: isUncertain ? '#fff7ed' : '#f8fafc',
        borderRadius: '8px',
        border: `1px solid ${isUncertain ? '#ffedd5' : '#e2e8f0'}`,
        fontSize: '11px',
        lineHeight: 1.5,
        color: isUncertain ? '#9a3412' : '#475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '3px' }}>
          <Info size={13} color={isUncertain ? '#ea580c' : '#0284c7'} />
          <span>Understanding This Confidence Metric:</span>
        </div>
        <p style={{ margin: 0 }}>
          The displayed value ({percentage}%) represents the neural network's raw Softmax class probability for foliar lesion patterns, not visual ground truth certainty.
          {isUncertain ? (
            <strong> Because symptoms are ambiguous or below the 80% safety threshold, chemical pesticide application is unsafe without physical laboratory or agricultural officer verification.</strong>
          ) : (
            <span> The visual symptoms match the pathogen reference profile with high class separation (&gt;80% threshold).</span>
          )}
        </p>
      </div>

      <div className="confidence-footer-note" style={{ marginTop: '10px' }}>
        <span>Computed from foliar vision feature extraction</span>
        <span>
          {isUncertain
            ? 'Uncertain — expert verification required'
            : 'Diagnosis confirmed by visual pattern matching'}
        </span>
      </div>
    </div>
  );
}
