import React, { useState } from 'react';
import DetectionOverlay from './DetectionOverlay.jsx';
import { Eye, EyeOff, Layers } from 'lucide-react';

/**
 * 🖼️ ScanImageCard Component (Section 1)
 * Renders the high-res scanned crop image with classical OpenCV visual localization overlay.
 */
export default function ScanImageCard({
  image,
  crop = 'Tomato',
  organ = 'Leaf',
  detections = []
}) {
  const [showOverlay, setShowOverlay] = useState(true);

  const fallbackImg = "https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="diagnosis-card" style={{ padding: '10px' }}>
      <div className="scan-image-wrapper">
        {/* Scanned Image */}
        <img
          src={image || fallbackImg}
          alt={`${crop} ${organ} Scanned Specimen`}
          className="scan-image-media"
          loading="eager"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackImg) {
              e.currentTarget.src = fallbackImg;
            } else {
              e.currentTarget.style.opacity = '0.5';
            }
          }}
        />

        {/* Floating Controls Overlay */}
        <div className="scan-image-controls">
          <div className="scan-image-chip">
            <span>🌿</span>
            <span>{crop} · {organ}</span>
          </div>

          {detections && detections.length > 0 && (
            <button
              type="button"
              className={`yolo-toggle-btn ${showOverlay ? 'active' : ''}`}
              onClick={() => setShowOverlay(!showOverlay)}
              title="Toggle OpenCV Visual Localization Bounding Boxes"
            >
              {showOverlay ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{showOverlay ? 'CV Localization ON' : 'Localization OFF'}</span>
            </button>
          )}
        </div>

        {/* OpenCV Visual Lesion Localization Overlay */}
        <DetectionOverlay
          detections={detections}
          visible={showOverlay}
        />
      </div>
    </div>
  );
}
