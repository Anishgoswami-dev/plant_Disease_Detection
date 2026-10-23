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
          <ShieldCheck size={16} color={isUncertain ? '#d97706' : '#16a34a'} />
          {isUncertain ? 'Agronomic Verification & Non-Chemical Measures' : 'Recommended Crop Protection & Medicines (दवाइयाँ)'}
        </h3>

        {onOpenPrescription && (
          <button
            type="button"
            className="btn-open-prescription-mini"
            onClick={onOpenPrescription}
            title={isUncertain ? 'Print diagnostic verification slip' : 'Open printable medicine prescription'}
          >
            <Printer size={13} />
            <span>{isUncertain ? 'Print Referral Slip (सत्यापन पर्ची)' : 'Print Prescription (दवा पर्ची)'}</span>
          </button>
        )}
      </div>

      {/* Uncertain Warning Banner & Safe Protocol */}
      {isUncertain ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: '#fff7ed',
            border: '1.5px solid #fdba74',
            borderRadius: '10px',
            padding: '12px 14px',
            color: '#9a3412'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
              <AlertTriangle size={18} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '13px', display: 'block' }}>Chemical Prescriptions Withheld (रासायनिक दवाइयाँ रोकी गईं)</strong>
                <span style={{ fontSize: '11.5px', color: '#7c2d12', lineHeight: 1.5, display: 'block', marginTop: '2px' }}>
                  Definitive pesticide products and chemical dosages are withheld because this diagnosis is ambiguous or below the 80% safety threshold. Chemical intervention on unconfirmed pathogens risks crop phytotoxicity, unnecessary farmer expenditure, and pesticide resistance.
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Info size={15} color="#0284c7" />
              <strong style={{ fontSize: '12px', color: '#0f172a' }}>Safe Immediate Field Protocol (सुरक्षित अंतरिम उपाय):</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#334155', lineHeight: 1.6 }}>
              <li><strong>Physical Specimen Verification:</strong> Collect 2-3 fresh leaves showing typical lesion margins in a clean paper bag. Bring them to your nearest Krishi Vigyan Kendra (KVK) or block agriculture extension officer for visual/microscopic confirmation.</li>
              <li><strong>Sanitary Pruning:</strong> Prune and safely bag heavily spotted lower leaves. Sterilize pruning shears with 70% alcohol or bleach solution between plants.</li>
              <li><strong>Moisture Management:</strong> Avoid overhead sprinkler irrigation during evening hours to prevent prolonged foliar dampness (&gt;6 hours).</li>
              <li><strong>Biological Sanitation:</strong> If preventive spray is needed prior to laboratory confirmation, utilize certified bio-agents (e.g. <em>Trichoderma viride</em> or <em>Pseudomonas fluorescens</em>) as per local extension package of practices.</li>
            </ul>
          </div>

          {onOpenPrescription && (
            <button
              type="button"
              className="btn-print-rx-cta"
              onClick={onOpenPrescription}
              style={{ background: '#d97706', borderColor: '#b45309' }}
            >
              <Printer size={16} />
              <span>Generate KVK Diagnostic Referral Slip (सत्यापन पर्ची बनाएं)</span>
            </button>
          )}
        </div>
      ) : (
        /* Confirmed high-confidence diagnosis with verified CIB&RC medicines */
        <>
          <div className="protection-notice-box">
            <Info size={14} color="#0284c7" style={{ flexShrink: 0 }} />
            <span>
              ICAR & CIB&RC approved dosage guidelines. Always follow recommended dilution ratios and observe Pre-Harvest Intervals (PHI).
            </span>
          </div>

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
        </>
      )}
    </div>
  );
}
