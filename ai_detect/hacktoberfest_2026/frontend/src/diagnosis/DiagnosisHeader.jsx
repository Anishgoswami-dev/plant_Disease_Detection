import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * 🏷️ DiagnosisHeader Component
 * Shows ONLY: "AI Crop Health Diagnosis" with a clean back button.
 * Preserves zero redundant branding.
 */
export default function DiagnosisHeader({ onBack }) {
  return (
    <header className="diagnosis-header-bar">
      <button
        type="button"
        className="diagnosis-back-btn"
        onClick={onBack}
        aria-label="Go back"
        title="Back"
      >
        <ArrowLeft size={18} />
      </button>

      <h1 className="diagnosis-page-title">
        AI Crop Health Diagnosis
      </h1>

      <div className="diagnosis-header-placeholder" />
    </header>
  );
}
