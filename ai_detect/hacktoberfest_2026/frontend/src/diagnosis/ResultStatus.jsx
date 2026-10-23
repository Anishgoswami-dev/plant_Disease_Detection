import React from 'react';
import { Activity, Clock } from 'lucide-react';

/**
 * 📈 ResultStatus Component (Section 10)
 * Future-ready result status indicator.
 * Current default: "AWAITING FOLLOW-UP".
 */
export default function ResultStatus({ status = 'AWAITING FOLLOW-UP' }) {
  const normStatus = (status || 'AWAITING FOLLOW-UP').toUpperCase();

  const getBadgeClass = (s) => {
    switch (s) {
      case 'IMPROVING':
      case 'RECOVERED':
        return 'improving';
      case 'STABLE':
        return 'stable';
      case 'WORSENING':
        return 'worsening';
      case 'UNCERTAIN':
      case 'AWAITING FOLLOW-UP':
      default:
        return 'awaiting';
    }
  };

  return (
    <div className="result-status-card">
      <div className="result-status-label-group">
        <span className="result-status-sub">Recovery Trajectory</span>
        <strong style={{ font: '800 13px Manrope', color: 'var(--ink)' }}>
          Clinical Plant Status
        </strong>
      </div>

      <div className={`result-status-badge-chip ${getBadgeClass(normStatus)}`}>
        {normStatus === 'AWAITING FOLLOW-UP' && '⏳ '}
        {normStatus === 'IMPROVING' && '🌱 '}
        {normStatus === 'STABLE' && '⚖️ '}
        {normStatus === 'WORSENING' && '⚠️ '}
        {normStatus}
      </div>
    </div>
  );
}
