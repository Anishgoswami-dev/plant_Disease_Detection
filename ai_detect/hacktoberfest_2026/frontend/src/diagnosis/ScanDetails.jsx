import React from 'react';
import { Calendar, Leaf, MapPin, Clock } from 'lucide-react';

/**
 * 📋 ScanDetails Component (Section 4)
 * Displays verified metadata for the specimen.
 * Handles missing location with explicit "Location unavailable" indicator.
 */
export default function ScanDetails({
  scanDate = '14 Sep 2026, 10:24 AM',
  crop = 'Tomato',
  organ = 'Leaf',
  location = ''
}) {
  const displayLocation = (location && location.trim()) ? location.trim() : 'Location unavailable';
  const hasLocation = displayLocation !== 'Location unavailable';

  return (
    <div className="diagnosis-card">
      <h3 className="section-card-title">
        <Clock size={15} color="#0052cc" />
        Scan Details
      </h3>

      <div className="scan-details-grid">
        {/* Date & Time */}
        <div className="scan-detail-box">
          <span className="scan-detail-lbl">Scanned On</span>
          <span className="scan-detail-val">{scanDate || 'Just now'}</span>
        </div>

        {/* Crop Name */}
        <div className="scan-detail-box">
          <span className="scan-detail-lbl">Crop</span>
          <span className="scan-detail-val">{crop}</span>
        </div>

        {/* Affected Part */}
        <div className="scan-detail-box">
          <span className="scan-detail-lbl">Affected Part</span>
          <span className="scan-detail-val">{organ}</span>
        </div>

        {/* Farm Location */}
        <div className="scan-detail-box">
          <span className="scan-detail-lbl">Location</span>
          <span className="scan-detail-val" style={{ color: hasLocation ? 'inherit' : 'var(--ink-muted)' }}>
            {hasLocation ? `📍 ${displayLocation}` : displayLocation}
          </span>
        </div>
      </div>
    </div>
  );
}
