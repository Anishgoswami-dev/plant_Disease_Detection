import React from 'react';
import SymptomCard from './SymptomCard.jsx';
import { Microscope } from 'lucide-react';

/**
 * 🔍 SymptomsSection Component (Section 5)
 * Dedicated human-readable section listing all detected visual symptoms.
 */
export default function SymptomsSection({ symptoms = [] }) {
  if (!symptoms || symptoms.length === 0) return null;

  return (
    <div className="diagnosis-card">
      <h3 className="section-card-title">
        <Microscope size={15} color="#16a34a" />
        Symptoms Detected
      </h3>

      <div className="symptoms-chip-list">
        {symptoms.map((symptom, index) => (
          <SymptomCard
            key={`symptom_${index}`}
            symptom={symptom}
          />
        ))}
      </div>
    </div>
  );
}
