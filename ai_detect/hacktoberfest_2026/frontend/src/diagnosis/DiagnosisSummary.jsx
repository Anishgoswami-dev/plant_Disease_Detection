import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

/**
 * 🩺 DiagnosisSummary Component (Section 2)
 * Renders the primary disease detection summary:
 * Disease name (dominant), scientific name, crop, affected part, affected area (~18%),
 * and a professional disease status indicator.
 */
export default function DiagnosisSummary({
  disease = 'Early Blight',
  scientificName = 'Alternaria solani',
  crop = 'Tomato',
  organ = 'Leaf',
  affectedArea = null,
  severity = null,
  confidenceStatus = 'HIGH_CONFIDENCE',
  safetyMessage = null,
  topPredictions = []
}) {
  const isLow = confidenceStatus === 'LOW_UNCERTAIN';
  const isAmbiguous = confidenceStatus === 'AMBIGUOUS';
  const isUncertain = isLow || isAmbiguous;

  return (
    <div className="diagnosis-card disease-summary-card">
      {/* Safety Decision Banner for Low Confidence or Ambiguity */}
      {isUncertain && (
        <div style={{
          background: isLow ? '#fef2f2' : '#fff7ed',
          border: `1.5px solid ${isLow ? '#fca5a5' : '#fdba74'}`,
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: isLow ? '#991b1b' : '#9a3412'
        }}>
          <AlertCircle size={18} color={isLow ? '#dc2626' : '#ea580c'} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '12.5px', display: 'block' }}>
              Uncertain — expert verification required
            </strong>
            <span style={{ fontSize: '11px', color: isLow ? '#b91c1c' : '#c2410c' }}>
              {safetyMessage || (isAmbiguous
                ? 'Ambiguous symptoms — multiple foliar conditions share visual characteristics. Physical crop pathology review is advised before chemical application.'
                : 'Foliar visual patterns require agronomic verification before chemical intervention.')}
            </span>
          </div>
        </div>
      )}

      {/* Top Status Row */}
      <div className="disease-status-row">
        <span
          className="disease-detected-label"
          style={
            isUncertain
              ? { background: isLow ? '#fef2f2' : '#fff7ed', color: isLow ? '#dc2626' : '#c2410c' }
              : {}
          }
        >
          <ShieldAlert size={14} />
          {isUncertain ? 'Uncertain — expert verification required' : 'Disease Detected'}
        </span>

        <span
          className="status-indicator-badge"
          style={
            isUncertain
              ? { background: isLow ? '#fef2f2' : '#fff7ed', color: isLow ? '#b91c1c' : '#c2410c' }
              : {}
          }
        >
          <span className="status-pulse-dot" style={{ background: isLow ? '#ef4444' : isAmbiguous ? '#ea580c' : undefined }} />
          <span>{isUncertain ? 'Uncertain — expert verification required' : 'Active Infection'}</span>
        </span>
      </div>

      {/* Disease Primary Title (Visually Dominant) */}
      <h2 className="disease-primary-title">
        {disease}
      </h2>

      {/* Scientific Pathogen Name */}
      {scientificName && (
        <div className="disease-scientific-name">
          Scientific name: {scientificName}
        </div>
      )}

      {/* Top Candidate Classes for Uncertain Cases */}
      {isUncertain && topPredictions && topPredictions.length > 1 && (
        <div style={{ margin: '12px 0 16px', background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
            Top Candidate Differential Diagnoses:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {topPredictions.slice(0, 3).map((cand, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#334155' }}>
                <span>• {cand.disease || cand.raw_label} ({cand.crop})</span>
                <strong style={{ color: '#0284c7' }}>{cand.confidence_percent ?? (cand.confidence * 100).toFixed(1)}%</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agronomic Meta Grid */}
      <div className="disease-meta-grid">
        <div className="disease-meta-item">
          <span className="disease-meta-label">Crop</span>
          <span className="disease-meta-value">{crop}</span>
        </div>

        <div className="disease-meta-item">
          <span className="disease-meta-label">Affected Part</span>
          <span className="disease-meta-value">{organ}</span>
        </div>

        <div className="disease-meta-item">
          <span className="disease-meta-label">Affected Area</span>
          <span className="disease-meta-value">{affectedArea != null ? `~${affectedArea}%` : 'Unavailable'}</span>
        </div>
      </div>
    </div>
  );
}
