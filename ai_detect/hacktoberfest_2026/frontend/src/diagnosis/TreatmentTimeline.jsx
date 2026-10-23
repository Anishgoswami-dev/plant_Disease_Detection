import React from 'react';
import TreatmentStep from './TreatmentStep.jsx';
import { ListOrdered } from 'lucide-react';

/**
 * ⏳ TreatmentTimeline Component (Section 7)
 * Vertical solution process timeline rendered dynamically from data.
 */
export default function TreatmentTimeline({ treatmentSteps = [] }) {
  if (!treatmentSteps || treatmentSteps.length === 0) return null;

  return (
    <div className="diagnosis-card">
      <h3 className="section-card-title">
        <ListOrdered size={15} color="#0052cc" />
        Step-by-Step Solution Process
      </h3>

      <div className="timeline-vertical-wrap">
        <div className="timeline-connector-line" />

        {treatmentSteps.map((step, index) => (
          <TreatmentStep
            key={step.stepNumber || `step_${index}`}
            step={step}
          />
        ))}
      </div>
    </div>
  );
}
