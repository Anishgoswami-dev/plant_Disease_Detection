import React from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * ❓ CauseSection Component (Section 6)
 * "Why It Happens?" section highlighting agronomic environmental conditions.
 */
export default function CauseSection({ causes = [] }) {
  if (!causes || causes.length === 0) return null;

  return (
    <div className="diagnosis-card">
      <h3 className="section-card-title">
        <HelpCircle size={15} color="#d97706" />
        Why It Happens?
      </h3>

      <div className="cause-list-wrap">
        {causes.map((cause, index) => (
          <div key={cause.id || `cause_${index}`} className="cause-card-item">
            <div className="cause-icon-wrap">
              {cause.icon || '⚠️'}
            </div>
            <div className="cause-card-body">
              <span className="cause-title-text">{cause.title}</span>
              <p className="cause-desc-text">{cause.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
