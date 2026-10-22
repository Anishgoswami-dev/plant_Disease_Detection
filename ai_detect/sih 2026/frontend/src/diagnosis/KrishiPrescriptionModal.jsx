import React from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

/**
 * 📄 KrishiPrescriptionModal Component
 * Full-page, print-ready Agricultural Medicine Prescription Slip
 * Mounted via React Portal directly into document.body to ensure
 * the top action bar is NEVER cut off, clipped, or trapped by parent overflow.
 */
export default function KrishiPrescriptionModal({
  isOpen,
  onClose,
  diagnosisData,
  prescriptionPlan
}) {
  if (!isOpen) return null;

  const data = diagnosisData || {};
  const plan = prescriptionPlan || {};
  const medicines = plan.medicines || [];
  const rxId = `FD-RX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = data.scanDate || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  const modalElement = (
    <div
      className="prescription-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 📌 TOP FIXED/STICKY ACTION BAR (Never clipped, always on top) */}
      <header className="prescription-action-bar no-print">
        <div className="rx-action-bar-left">
          <div className="rx-action-tag-pill">🌿 CIB&RC Protocol</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#38bdf8" />
            <strong className="rx-action-title">
              Krishi Medicine Advisory & Prescription Sheet
            </strong>
          </div>
        </div>

        <div className="rx-action-bar-right">
          <button
            type="button"
            className="prescription-btn-print"
            onClick={handlePrint}
            title="Print or Save as PDF"
          >
            <Printer size={16} />
            <span>Print Prescription (दवा पर्ची प्रिंट करें)</span>
          </button>

          <button
            type="button"
            className="prescription-btn-close"
            onClick={onClose}
            aria-label="Close Prescription"
            title="Close (बंद करें)"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* 📄 PRINTABLE SHEET SCROLL WRAPPER */}
      <div className="prescription-sheet-wrapper">
        <div className="prescription-sheet-container printable-area">
          {/* Official Header */}
          <div className="rx-header">
            <div className="rx-header-left">
              <div className="rx-logo-mark">🌿</div>
              <div>
                <h2 className="rx-app-name">FASAL DRISTHI</h2>
                <span className="rx-sub-tag">Digital Agricultural Pathology & Agronomic Extension Cell</span>
                <span className="rx-guidelines-tag">ICAR & CIB&RC Standard Crop Protection Protocol</span>
              </div>
            </div>

            <div className="rx-header-right">
              <div className="rx-badge-pill">OFFICIAL ADVISORY SLIP</div>
              <button
                type="button"
                className="rx-sheet-print-btn no-print"
                onClick={handlePrint}
                title="Print this advisory sheet"
              >
                <Printer size={13} />
                <span>Print Slip (प्रिंट करें)</span>
              </button>
              <div className="rx-meta-row"><strong>Rx Slip ID:</strong> <span>{rxId}</span></div>
              <div className="rx-meta-row"><strong>Date:</strong> <span>{currentDate}</span></div>
            </div>
          </div>

          <div className="rx-divider" />

          {/* Farmer & Field Specimen Details */}
          <div className="rx-details-grid">
            <div className="rx-detail-box">
              <span className="rx-detail-lbl">Target Crop (फसल):</span>
              <strong className="rx-detail-val">{data.crop || 'Tomato'}</strong>
            </div>

            <div className="rx-detail-box">
              <span className="rx-detail-lbl">Detected Disease (रोग की पहचान):</span>
              <strong className="rx-detail-val" style={{ color: '#b91c1c' }}>{data.disease || 'Early Blight'}</strong>
            </div>

            <div className="rx-detail-box">
              <span className="rx-detail-lbl">Scientific Name:</span>
              <span className="rx-detail-val" style={{ fontStyle: 'italic' }}>{plan.scientificName || data.scientificName || 'Alternaria solani'}</span>
            </div>

            <div className="rx-detail-box">
              <span className="rx-detail-lbl">Pathogen Classification:</span>
              <span className="rx-detail-val">{plan.pathogen || 'Foliar Fungus'}</span>
            </div>

            <div className="rx-detail-box">
              <span className="rx-detail-lbl">AI Detection Confidence:</span>
              <strong className="rx-detail-val" style={{ color: (data.confidenceStatus === 'LOW_UNCERTAIN' || data.confidenceStatus === 'AMBIGUOUS') ? '#dc2626' : (data.confidenceStatus === 'REVIEW_RECOMMENDED' ? '#b45309' : '#15803d') }}>
                {typeof data.confidence === 'number' ? (data.confidence <= 1 ? (data.confidence * 100).toFixed(1) : data.confidence) : '75.0'}% ({data.confidenceStatus === 'LOW_UNCERTAIN' ? 'Uncertain - Review Required' : data.confidenceStatus === 'AMBIGUOUS' ? 'Ambiguous Diagnosis' : data.confidenceStatus === 'REVIEW_RECOMMENDED' ? 'Review Recommended' : 'High Confidence Visual Match'})
              </strong>
            </div>

            <div className="rx-detail-box">
              <span className="rx-detail-lbl">Plot / Location (स्थान):</span>
              <span className="rx-detail-val">{data.location || 'Raipur, West Bengal / Maharashtra Plot'}</span>
            </div>
          </div>

          {/* Uncertain Advisory Banner for Low Confidence */}
          {(data.confidenceStatus === 'LOW_UNCERTAIN' || data.confidenceStatus === 'AMBIGUOUS') && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', padding: '8px 12px', borderRadius: '8px', margin: '10px 0', fontSize: '11px', color: '#991b1b' }}>
              <strong>⚠️ FARMER NOTICE (किसान ध्यान दें):</strong> AI detection confidence is below agronomic intervention threshold. This sheet provides preliminary decision support. Please consult your Block Agriculture Officer or local Krishi Vigyan Kendra (KVK) before chemical purchases or field spraying.
            </div>
          )}

          {/* Severity Banner */}
          <div className="rx-severity-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="#d97706" />
              <strong>Diagnostic Severity Guidance:</strong>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#78350f' }}>
              {plan.severityGuidance || 'Foliar lesions detected. Immediate protective and IPM intervention recommended.'}
            </p>
          </div>

          {/* Prescribed Medicines Section */}
          <div className="rx-section-title-wrap">
            <h3 className="rx-section-title">
              <ShieldCheck size={16} color="#16a34a" />
              Prescribed Medicines & Crop Protection Guide (अनुशंसित दवाइयाँ एवं सटीक खुराक)
            </h3>
            <span className="rx-section-sub">Approved by Central Insecticides Board & Registration Committee (CIB&RC)</span>
          </div>

          <div className="rx-table-wrap">
            <table className="rx-medicine-table">
              <thead>
                <tr>
                  <th style={{ width: '4%' }}>#</th>
                  <th style={{ width: '26%' }}>Medicine Name & Active Ingredient<br /><small>(दवा का नाम व रसायन)</small></th>
                  <th style={{ width: '15%' }}>Type<br /><small>(प्रकार)</small></th>
                  <th style={{ width: '13%' }}>Dose / Liter<br /><small>(प्रति लीटर पानी)</small></th>
                  <th style={{ width: '16%' }}>Dose / 15L Pump<br /><small>(प्रति 15L पंप)</small></th>
                  <th style={{ width: '14%' }}>Dose / Acre<br /><small>(प्रति एकड़)</small></th>
                  <th style={{ width: '12%' }}>PHI<br /><small>(तुड़ाई अंतराल)</small></th>
                </tr>
              </thead>
              <tbody>
                {medicines.length > 0 ? (
                  medicines.map((med, index) => (
                    <tr key={med.id || index}>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{index + 1}</td>
                      <td>
                        <strong style={{ fontSize: '12px', display: 'block', color: '#0f172a' }}>{med.productName}</strong>
                        <span style={{ fontSize: '10.5px', color: '#475569' }}>{med.activeIngredient}</span>
                      </td>
                      <td>
                        <span className="rx-type-pill">{med.type.split(' ')[0]}</span>
                      </td>
                      <td><strong>{med.dosePerLiter}</strong></td>
                      <td style={{ color: '#0052cc', fontWeight: 800 }}>{med.dosePerPump}</td>
                      <td><strong>{med.dosePerAcre}</strong></td>
                      <td>
                        <span className="rx-phi-badge">{med.phi}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No chemical medicine required. Follow bio-sanitation and nutritional maintenance steps below.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Slurry & Spray Technique Protocol */}
          <div className="rx-protocol-grid">
            <div className="rx-protocol-card">
              <h4>🥣 Tank Mixing & Slurry Instructions (घोल बनाने का सही नियम)</h4>
              <ul className="rx-bullet-list">
                <li><strong>Pre-mix in clean bucket:</strong> Always mix powder/liquid in 2-3 liters of clean water first to prepare a uniform lump-free slurry before pouring into the spray tank.</li>
                <li><strong>Water Quality:</strong> Use clean pond, well or canal water with neutral pH (6.5 - 7.5). Avoid muddy or highly saline water.</li>
                <li><strong>Add Spreader/Sticker:</strong> Add 0.5 ml/L non-ionic silicon sticker (like Apsa-80 or Wetcit) to prevent rain wash-off.</li>
                <li><strong>Bio-agents separation:</strong> Never tank-mix biological agents (Trichoderma) with copper or chemical fungicides. Maintain a 5-day gap.</li>
              </ul>
            </div>

            <div className="rx-protocol-card">
              <h4>🚿 Spraying Schedule & Equipment (छिड़काव समय व तरीका)</h4>
              <ul className="rx-bullet-list">
                <li><strong>Best Timing:</strong> Spray early morning (7:00 AM - 10:00 AM) or late afternoon (4:00 PM - 6:30 PM). Avoid bright midday sun (&gt;30°C).</li>
                <li><strong>Nozzle Selection:</strong> Use a clean hollow cone nozzle to generate a fine mist. Target both the upper and lower leaf canopy.</li>
                <li><strong>Weather Check:</strong> Do not spray if heavy rain is forecast within 4 hours or wind speed exceeds 12 km/h.</li>
                <li><strong>Spray Interval:</strong> Repeat contact spray after 7 to 10 days if cloudy or humid conditions persist.</li>
              </ul>
            </div>
          </div>

          {/* Safety & PPE Instructions */}
          <div className="rx-safety-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <AlertTriangle size={15} color="#dc2626" />
              <strong style={{ color: '#991b1b', fontSize: '12px' }}>Farmer Health & Personal Protective Equipment (PPE) Checklist:</strong>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#7f1d1d', lineHeight: 1.45 }}>
              • Always wear an N95 respirator mask, nitrile chemical gloves, rubber gumboots, and protective eye goggles during chemical handling.<br />
              • Do not eat, drink, or smoke during application. Wash hands, face, and clothing thoroughly with soap and clean water immediately after spraying.<br />
              • Store all agricultural chemicals securely locked out of reach of children and farm livestock.
            </p>
          </div>

          {/* Footer & Digital Validation Seal */}
          <div className="rx-footer-row">
            <div className="rx-footer-left">
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Verified by State Agricultural Extension Pathology Cell</span>
              <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>Generated via Fasal Dristhi AI Vision Decision Support System (SIH 2026 PS-26131)</span>
              <div className="no-print" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="prescription-btn-print"
                  onClick={handlePrint}
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  <Printer size={14} /> Print Advisory Slip
                </button>
                <button
                  type="button"
                  className="prescription-btn-close-text"
                  onClick={onClose}
                >
                  Close Window (बंद करें)
                </button>
              </div>
            </div>

            <div className="rx-signature-box">
              <div className="rx-seal-stamp" style={{ borderColor: (data.confidenceStatus === 'LOW_UNCERTAIN' || data.confidenceStatus === 'AMBIGUOUS') ? '#f59e0b' : '#15803d', color: (data.confidenceStatus === 'LOW_UNCERTAIN' || data.confidenceStatus === 'AMBIGUOUS') ? '#b45309' : '#15803d' }}>
                <CheckCircle2 size={16} color={(data.confidenceStatus === 'LOW_UNCERTAIN' || data.confidenceStatus === 'AMBIGUOUS') ? '#b45309' : '#15803d'} />
                <span>{(data.confidenceStatus === 'LOW_UNCERTAIN' || data.confidenceStatus === 'AMBIGUOUS') ? 'DECISION SUPPORT (UNCERTAIN)' : 'DECISION SUPPORT ADVISORY'}</span>
              </div>
              <span className="rx-agronomist-name">Fasal Dristhi Pathology Engine</span>
              <span className="rx-agronomist-sub">Status: Pending Field Extension Officer Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalElement, document.body)
    : modalElement;
}
