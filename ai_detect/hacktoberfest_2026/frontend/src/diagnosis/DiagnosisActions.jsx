import React from 'react';
import { Camera, Bookmark, Share2 } from 'lucide-react';

/**
 * ⚡ DiagnosisActions Component (Section 11)
 * Primary and secondary action buttons at the bottom of diagnosis report.
 */
export default function DiagnosisActions({
  onScanAnother,
  onSaveResult,
  onShareResult
}) {
  return (
    <div className="diagnosis-actions-container">
      {/* Primary Action: Scan Another Plant */}
      <button
        type="button"
        className="btn-primary-action"
        onClick={onScanAnother}
      >
        <Camera size={16} />
        Scan Another Plant
      </button>

      {/* Secondary Actions */}
      <div className="secondary-actions-row">
        <button
          type="button"
          className="btn-secondary-action"
          onClick={onSaveResult}
        >
          <Bookmark size={15} color="#0052cc" />
          Save Result
        </button>

        <button
          type="button"
          className="btn-secondary-action"
          onClick={onShareResult}
        >
          <Share2 size={15} color="#16a34a" />
          Share Result
        </button>
      </div>
    </div>
  );
}
