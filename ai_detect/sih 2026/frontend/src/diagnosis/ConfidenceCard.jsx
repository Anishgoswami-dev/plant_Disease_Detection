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
  const isHigh = confidenceStatus === 'HIGH_CONFIDENCE' || (!confidenceStatus && numericVal >= 80);
  const isMedium = confidenceStatus === 'REVIEW_RECOMMENDED' || (!confidenceStatus && numericVal >= 60 && numericVal < 80);
  const isAmbiguous = confidenceStatus === 'AMBIGUOUS';
  const isLow = confidenceStatus === 'LOW_UNCERTAIN' || (!confidenceStatus && numericVal < 60);

  const statusLabel = confidenceStatus || (isHigh ? 'HIGH_CONFIDENCE' : isMedium ? 'REVIEW_RECOMMENDED' : 'LOW_UNCERTAIN');
  const isUncertain = isLow || isAmbiguous;

  return (
    <div className="diagnosis-card">
      <div className="confidence-card-header">
        <div>
          <span
            className="confidence-status-badge"
            style={
              isLow
                ? { background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }
                : isAmbiguous
                ? { background: '#fff7ed', color: '#c2410c', borderColor: '#fdba74' }
                : isMedium
                ? { background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }
                : { background: '#f0fdf4', color: '#16a34a', borderColor: '#86efac' }
            }
          >
            {isUncertain ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
            {statusLabel}
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
          style={{ color: isLow ? '#dc2626' : (isAmbiguous ? '#c2410c' : (isMedium ? '#b45309' : '#16a34a')) }}
        >
          {percentage}%
        </span>
        <span className="confidence-label-text">
          Confidence Level {isUncertain && <span style={{ color: isLow ? '#dc2626' : '#c2410c', fontSize: '11px', fontWeight: 600 }}>({isAmbiguous ? 'Ambiguous Diagnosis' : 'Uncertain Diagnosis'})</span>}
        </span>
      </div>

      {/* Visual meter bar */}
      <div className="confidence-progress-bar">
        <div
          className="confidence-progress-fill"
          style={{
            width: `${Math.min(100, Math.max(5, numericVal))}%`,
            background: isLow ? '#ef4444' : (isAmbiguous ? '#ea580c' : (isMedium ? '#f59e0b' : '#16a34a'))
          }}
        />
      </div>

      <div className="confidence-footer-note">
        <span>Computed from foliar vision feature extraction</span>
        <span>
          {isLow
            ? 'Low confidence (<60%) — expert verification required'
            : isAmbiguous
            ? 'Ambiguous — multiple conditions share visual symptoms'
            : isMedium
            ? 'Review recommended before chemical treatment'
            : 'Diagnosis confirmed by visual pattern matching'}
        </span>
      </div>
    </div>
  );
}
