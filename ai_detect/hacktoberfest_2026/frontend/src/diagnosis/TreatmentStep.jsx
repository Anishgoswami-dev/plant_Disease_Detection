import React from 'react';
import { Clock } from 'lucide-react';

/**
 * 🪜 TreatmentStep Component (Section 7)
 * Detailed step inside the agronomic IPM solution timeline.
 */
export default function TreatmentStep({ step }) {
  if (!step) return null;

  const description = step.desc || step.explanation || step.details || '';

  return (
    <div className="timeline-step-row">
      <div className="timeline-node-pin" />

      <div className="timeline-step-content">
        <div className="timeline-step-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="timeline-step-badge">{step.stepNumber || '01'}</span>
            <span style={{ fontSize: '16px' }}>{step.icon || '🌱'}</span>
            <strong className="timeline-step-title">{step.title}</strong>
          </div>

          {step.badge && (
            <span className="timeline-phase-pill">
              {step.badge}
            </span>
          )}
        </div>

        <p className="timeline-step-desc">
          {description}
        </p>

        {step.timing && (
          <div className="timeline-timing-note">
            <Clock size={12} color="#0284c7" />
            <span>Recommended timing: <strong>{step.timing}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
