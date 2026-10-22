import React from 'react';
import { ShieldCheck, AlertTriangle, Info, Printer, Sparkles } from 'lucide-react';

/**
 * 🛡️ CropProtectionSection Component (Section 8)
 * Displays verified crop protection data with precise 15L pump and acre dosages,
 * and gives a direct one-click action to view & print the farmer prescription slip.
 */
export default function CropProtectionSection({ treatments = [], confidenceStatus = 'HIGH_CONFIDENCE', onOpenPrescription }) {
  const isUncertain = confidenceStatus === 'LOW_UNCERTAIN' || confidenceStatus === 'AMBIGUOUS';

  return (
    <div className="diagnosis-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 className="section-card-title" style={{ margin: 0 }}>
          <ShieldCheck size={16} color="#16a34a" />
          Recommended Crop Protection & Medicines (दवाइयाँ)
        </h3>

        {onOpenPrescription && (
          <button
            type="button"
            className="btn-open-prescription-mini"
            onClick={onOpenPrescription}
            title="Open printable medicine prescription"
          >
            <Printer size={13} />
            <span>Print Prescription (दवा पर्ची)</span>
          </button>
        )}
      </div>

      {/* Uncertain Warning Banner */}
      {isUncertain && (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fca5a5',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          color: '#991b1b'
        }}>
          <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '12.5px', display: 'block' }}>Uncertain Diagnosis Warning (अनिश्चित निदान चेतावनी)</strong>
            <span style={{ fontSize: '11px', color: '#b91c1c' }}>
              Chemical treatments must NOT be applied without physical confirmation by a local Krishi Vigyan Kendra (KVK) or certified agricultural extension officer. Prioritize cultural hygiene and non-chemical measures.
            </span>
          </div>
        </div>
      )}

      {/* Notice Banner */}
      <div className="protection-notice-box">
        <Info size={14} color="#0284c7" style={{ flexShrink: 0 }} />
        <span>
          ICAR & CIB&RC approved dosage guidelines. Always follow recommended dilution ratios and observe Pre-Harvest Intervals (PHI).
        </span>
      </div>

      {/* Treatment Recommendation Cards */}
      {treatments && treatments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {treatments.map((item, idx) => (
            <div key={item.id || idx} className="medicine-item-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                <div>
                  <h4 className="medicine-name-title">{item.productName}</h4>
                  <div className="medicine-active-spec">{item.activeIngredient}</div>
                </div>

                {item.type && (
                  <span className="medicine-type-badge">
                    {item.type.split('(')[0].trim()}
                  </span>
                )}
              </div>

              <div className="medicine-specs-table">
                {item.dosePerLiter && (
                  <div className="medicine-spec-row">
                    <span className="medicine-spec-lbl">Dose / Liter (प्रति लीटर)</span>
                    <strong className="medicine-spec-val" style={{ color: '#0f172a' }}>{item.dosePerLiter}</strong>
                  </div>
                )}
                {(item.dosePerPump || item.dose) && (
                  <div className="medicine-spec-row">
                    <span className="medicine-spec-lbl">Dose / 15L Pump (15L पंप)</span>
                    <strong className="medicine-spec-val" style={{ color: '#0052cc', fontWeight: 800 }}>
                      {item.dosePerPump || item.dose}
                    </strong>
                  </div>
                )}
                {item.dosePerAcre && (
                  <div className="medicine-spec-row">
                    <span className="medicine-spec-lbl">Dose / Acre (प्रति एकड़)</span>
                    <span className="medicine-spec-val">{item.dosePerAcre}</span>
                  </div>
                )}
                {item.formulation && (
                  <div className="medicine-spec-row">
                    <span className="medicine-spec-lbl">Formulation</span>
                    <span className="medicine-spec-val">{item.formulation}</span>
                  </div>
                )}
                {item.applicationMethod && (
                  <div className="medicine-spec-row">
                    <span className="medicine-spec-lbl">Application</span>
                    <span className="medicine-spec-val">{item.applicationMethod}</span>
                  </div>
                )}
                {(item.applicationInterval || item.interval) && (
                  <div className="medicine-spec-row">
                    <span className="medicine-spec-lbl">Spray Interval</span>
                    <span className="medicine-spec-val">{item.applicationInterval || item.interval}</span>
                  </div>
                )}
                {(item.phi || item.PHI) && (
                  <div className="medicine-spec-row">
                    <span className="medicine-spec-lbl">Pre-Harvest Interval (PHI)</span>
                    <span className="medicine-spec-val" style={{ color: '#b91c1c', fontWeight: 700 }}>
                      {item.phi || item.PHI}
                    </span>
                  </div>
                )}
              </div>

              {/* Safety Instructions */}
              <div className="protection-safety-warning">
                <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Safety:</strong> {item.safetyInstructions || item.safety || 'Wear respirator mask and nitrile gloves during knapsack spraying.'}
                </span>
              </div>
            </div>
          ))}

          {/* Big Print Button at bottom of medicines */}
          {onOpenPrescription && (
            <button
              type="button"
              className="btn-print-rx-cta"
              onClick={onOpenPrescription}
            >
              <Printer size={16} />
              <span>Generate & Print Farmer Prescription Slip (दवा पर्ची प्रिंट करें)</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--ink-muted)', fontSize: '11.5px' }}>
          Treatment recommendations are pending verified agronomic review.
        </div>
      )}
    </div>
  );
}
