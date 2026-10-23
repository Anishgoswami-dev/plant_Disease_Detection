import React from 'react';
import { Check } from 'lucide-react';

/**
 * 🌿 SymptomCard Component (Section 5)
 * Individual human-readable chip/card describing a verified symptom.
 */
export default function SymptomCard({ symptom }) {
  if (!symptom) return null;

  return (
    <div className="symptom-item-card">
      <div className="symptom-check-circle">
        <Check size={11} strokeWidth={3} />
      </div>
      <span className="symptom-text">{symptom}</span>
    </div>
  );
}
