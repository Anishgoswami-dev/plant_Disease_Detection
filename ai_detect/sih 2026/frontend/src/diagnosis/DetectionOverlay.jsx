import React from 'react';
import BoundingBox from './BoundingBox.jsx';

/**
 * 🎯 DetectionOverlay Component
 * Renders all bounding boxes over the scanned crop image.
 * Accepts real ML detection arrays when available.
 */
export default function DetectionOverlay({ detections = [], visible = true }) {
  if (!visible || !Array.isArray(detections) || detections.length === 0) {
    return null;
  }

  return (
    <div className="detection-overlay-container" aria-label="Visual Lesion Localization Overlay">
      {detections.map((det, index) => (
        <BoundingBox
          key={det.id || `detection_${index}`}
          detection={det}
        />
      ))}
    </div>
  );
}
