import React from 'react';

/**
 * 🏷️ DetectionLabel Component
 * Displays the disease spot label and formatted confidence percentage
 */
export default function DetectionLabel({ label, confidence }) {
  const formattedConf = typeof confidence === 'number'
    ? `${(confidence <= 1 ? confidence * 100 : confidence).toFixed(1)}%`
    : null;

  return (
    <div className="yolo-label-tag">
      <span>{label}</span>
      {formattedConf && <span style={{ opacity: 0.85 }}>({formattedConf})</span>}
    </div>
  );
}
