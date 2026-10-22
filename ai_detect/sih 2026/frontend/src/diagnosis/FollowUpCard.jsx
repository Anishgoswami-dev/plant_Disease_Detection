import React from 'react';
import { CalendarDays, RefreshCw } from 'lucide-react';

/**
 * 📅 FollowUpCard Component (Section 9)
 * 10-Day Follow-Up inspection tracker card.
 */
export default function FollowUpCard({
  followUp = {},
  onCheckAgain
}) {
  const {
    scanDate = '14 Sep 2026',
    followUpDate = '24 Sep 2026',
    daysRemaining = 10,
    status = 'Follow-up scheduled'
  } = followUp;

  return (
    <div className="diagnosis-card followup-highlight-card">
      <h3 className="section-card-title">
        <CalendarDays size={15} color="#16a34a" />
        10-Day Follow-Up
      </h3>

      <div className="followup-dates-row">
        {/* Initial Scan Date */}
        <div className="followup-date-col">
          <span className="followup-date-lbl">Initial Scan</span>
          <span className="followup-date-val">{scanDate}</span>
        </div>

        {/* Countdown Pill */}
        <span className="followup-countdown-pill">
          {daysRemaining} days remaining
        </span>

        {/* Next Crop Check Date */}
        <div className="followup-date-col" style={{ textAlign: 'right' }}>
          <span className="followup-date-lbl">Next Crop Check</span>
          <span className="followup-date-val">{followUpDate}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '11px', color: '#166534', fontWeight: 600 }}>
        <span>Inspection Milestone:</span>
        <span style={{ textTransform: 'capitalize' }}>✓ {status}</span>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        className="followup-action-btn"
        onClick={onCheckAgain}
      >
        <RefreshCw size={14} />
        Check Crop Again
      </button>
    </div>
  );
}
