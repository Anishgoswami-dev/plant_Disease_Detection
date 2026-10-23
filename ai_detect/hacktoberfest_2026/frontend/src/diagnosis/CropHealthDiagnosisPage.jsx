import React, { useMemo, useState } from 'react';
import DiagnosisHeader from './DiagnosisHeader.jsx';
import ScanImageCard from './ScanImageCard.jsx';
import DiagnosisSummary from './DiagnosisSummary.jsx';
import ConfidenceCard from './ConfidenceCard.jsx';
import ScanDetails from './ScanDetails.jsx';
import SymptomsSection from './SymptomsSection.jsx';
import CauseSection from './CauseSection.jsx';
import TreatmentTimeline from './TreatmentTimeline.jsx';
import CropProtectionSection from './CropProtectionSection.jsx';
import FollowUpCard from './FollowUpCard.jsx';
import ResultStatus from './ResultStatus.jsx';
import DiagnosisActions from './DiagnosisActions.jsx';
import DiagnosisDebugPanel from './DiagnosisDebugPanel.jsx';
import KrishiPrescriptionModal from './KrishiPrescriptionModal.jsx';
import { getDetailedTreatmentPlan } from './cropMedicineKnowledge.js';
import { mockDiagnosis } from './mockDiagnosisData.js';
import { Printer, FileText } from 'lucide-react';
import './diagnosisStyles.css';

/**
 * 🌿 CropHealthDiagnosisPage
 * Master presentation container for the AI Crop Health Diagnosis result page.
 * Completely data-driven with detailed 6-phase IPM steps and printable farmer medicine prescription slip.
 */
export default function CropHealthDiagnosisPage({
  diagnosisData = null,
  debugTelemetry = null,
  onBack,
  onScanAnother,
  onSaveResult,
  onShareResult,
  onCheckAgain,
  notify
}) {
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Normalize and merge data with mock fallback
  const data = useMemo(() => {
    if (!diagnosisData) return {
      ...mockDiagnosis,
      detailedPlan: getDetailedTreatmentPlan(mockDiagnosis.crop, mockDiagnosis.disease)
    };

    // Normalizing disease name from real diagnosis object or top-level string
    const disease = typeof diagnosisData.disease === 'string'
      ? diagnosisData.disease
      : (diagnosisData.diagnosis?.disease || (typeof diagnosisData.diagnosis === 'string' ? diagnosisData.diagnosis : mockDiagnosis.disease));

    const crop = diagnosisData.crop || diagnosisData.diagnosis?.crop || mockDiagnosis.crop;

    // Genuine confidence from API without artificial inflation or override
    let rawConf = null;
    if (typeof diagnosisData.diagnosis?.confidence === 'number') {
      rawConf = diagnosisData.diagnosis.confidence;
    } else if (typeof diagnosisData.confidenceDecimal === 'number') {
      rawConf = diagnosisData.confidenceDecimal;
    } else if (typeof diagnosisData.confidence === 'number') {
      rawConf = diagnosisData.confidence > 1 ? diagnosisData.confidence / 100 : diagnosisData.confidence;
    } else if (typeof diagnosisData.confidence_percent === 'number') {
      rawConf = diagnosisData.confidence_percent / 100;
    }

    // Do NOT fall back to 0.75 if diagnosisData is an actual scan response!
    let conf = rawConf !== null ? rawConf : (diagnosisData ? null : 0.75);

    // Normalizing confidence status adhering strictly to safety policy
    const confidenceStatus = diagnosisData.diagnosis?.reliability_status ||
      diagnosisData.reliabilityStatus ||
      diagnosisData.reliabilityBadge ||
      (conf != null ? (conf >= 0.80 ? 'HIGH_CONFIDENCE' : conf >= 0.50 ? 'REVIEW_RECOMMENDED' : 'LOW_UNCERTAIN') : 'LOW_UNCERTAIN');

    const isUncertain = confidenceStatus === 'LOW_UNCERTAIN' || confidenceStatus === 'AMBIGUOUS' || (conf != null && conf < 0.80);

    // Normalizing detections
    const detections = diagnosisData.visual_evidence?.detections || diagnosisData.visualEvidence?.detections || diagnosisData.detections || [];

    // Normalizing symptoms
    const symptoms = diagnosisData.symptoms || diagnosisData.observedSymptoms || [
      `Foliar necrotic tissue and concentric spotting on ${crop} foliage`,
      'Yellow chlorotic halos around expanding lesions',
      'Canopy stress with localized leaf curling and premature drying'
    ];

    // Normalizing causes
    let causes = [];
    if (Array.isArray(diagnosisData.causes) && diagnosisData.causes.length > 0) {
      causes = diagnosisData.causes.map((c, i) => (typeof c === 'string' ? { id: `c_${i}`, icon: '🔬', title: 'Diagnostic Factor', desc: c } : c));
    } else if (diagnosisData.probableCauses) {
      const pc = diagnosisData.probableCauses;
      causes = [
        pc.observed_evidence && {
          id: 'c_evidence',
          icon: '🔬',
          title: 'Observed Diagnostic Evidence',
          desc: pc.observed_evidence
        },
        pc.contributing_factors && {
          id: 'c_factors',
          icon: '💧',
          title: 'Environmental & Foliar Conditions',
          desc: pc.contributing_factors
        }
      ].filter(Boolean);
    } else {
      causes = [
        { id: 'c1', icon: '💧', title: 'High Humidity & Leaf Wetness', desc: 'Prolonged foliar moisture (>6 hours) favors rapid pathogen spore germination.' },
        { id: 'c2', icon: '🌿', title: 'Dense Canopy Aeration Stress', desc: 'Inadequate plant-to-plant spacing limits direct sunlight and air circulation.' }
      ];
    }

    // Fetch detailed agronomic IPM solution and CIB&RC approved medicines
    const detailedPlan = getDetailedTreatmentPlan(crop, disease);

    // Normalizing treatment steps — filter out chemical steps when diagnosis is uncertain
    let treatmentSteps = diagnosisData.treatment?.ipm_steps || diagnosisData.treatmentSteps || [];
    if (!treatmentSteps || treatmentSteps.length < 3) {
      treatmentSteps = isUncertain
        ? detailedPlan.solutionSteps.filter(s => {
            const stepText = (s.step || s.title || s.phase || '').toLowerCase();
            return !stepText.includes('chemical') && !stepText.includes('fungicide') && !stepText.includes('pesticide');
          })
        : detailedPlan.solutionSteps;
    }

    // Normalizing treatments / crop protection medicines:
    // SAFETY POLICY: When uncertain or ambiguous, definitive chemical recommendations are STRICTLY WITHHELD
    let treatments = [];
    if (!isUncertain) {
      treatments = diagnosisData.treatment?.chemical_control || diagnosisData.treatments || [];
      if (!treatments || treatments.length === 0 || !treatments[0]?.dosePerPump) {
        treatments = detailedPlan.medicines;
      }
    }

    // Normalizing image
    const image = diagnosisData.preview ||
      diagnosisData.image_url ||
      diagnosisData.imageUrl ||
      diagnosisData.image ||
      diagnosisData.visualEvidence?.annotated_image_url ||
      mockDiagnosis.image;

    const scientificName = diagnosisData.diagnosis?.scientific_name || diagnosisData.scientificName || diagnosisData.scientific_name || detailedPlan.scientific_name || mockDiagnosis.scientificName;
    const affectedArea = diagnosisData.diagnosis?.affected_area_percent ?? diagnosisData.affected_area_percent ?? diagnosisData.affectedAreaPercent ?? (diagnosisData.isHealthy ? 0 : null);
    const severity = diagnosisData.diagnosis?.severity ?? diagnosisData.severity ?? (diagnosisData.isHealthy ? 'Healthy' : 'Moderate');

    const modelVersion = diagnosisData.model_metadata?.architecture ||
      (diagnosisData.model_metadata?.model_name ? `${diagnosisData.model_metadata.model_name} v${diagnosisData.model_metadata.model_version || '1.0'}` : null) ||
      diagnosisData.modelVersion ||
      'Fasal Dristhi Vision';

    const scanDate = diagnosisData.scan_date || diagnosisData.date || mockDiagnosis.scanDate;
    const location = diagnosisData.field || diagnosisData.location || mockDiagnosis.location;
    const organ = diagnosisData.organ || 'Leaf';

    const followUp = diagnosisData.follow_up || {
      followUpDate: '10 Days',
      actions: [
        'Inspect new canopy flushes for absence of target lesions',
        'Check lower foliage for drying of existing spots',
        'Verify if chemical Pre-Harvest Interval (PHI) has completed'
      ],
      resultStatus: 'ACTIVE MONITORING'
    };

    const safetyMessage = diagnosisData.diagnosis?.safety_message ||
      diagnosisData.safetyMessage ||
      diagnosisData.safety_message ||
      (confidenceStatus === 'LOW_UNCERTAIN'
        ? 'Uncertain result — confidence below safety threshold. Expert verification required.'
        : confidenceStatus === 'AMBIGUOUS'
        ? 'Ambiguous diagnosis — multiple foliar conditions share similar visual symptoms. Expert verification required.'
        : 'Diagnosis confirmed by visual pattern matching.');

    return {
      crop,
      organ,
      disease,
      scientificName,
      confidence: conf,
      confidenceStatus,
      isUncertain,
      modelVersion,
      severity,
      affectedArea,
      scanDate,
      location,
      image,
      detections,
      symptoms,
      causes,
      treatmentSteps,
      treatments,
      followUp,
      detailedPlan,
      safetyMessage
    };
  }, [diagnosisData]);

  const handleSave = () => {
    if (onSaveResult) {
      onSaveResult(data);
    } else {
      notify?.('Diagnosis report & prescription saved to farm records');
    }
  };

  const handleShare = () => {
    if (onShareResult) {
      onShareResult(data);
    } else if (navigator.share) {
      navigator.share({
        title: `Fasal Dristhi Diagnosis: ${data.disease}`,
        text: `Diagnosis detected ${data.disease} on ${data.crop} with ${(data.confidence * 100).toFixed(1)}% confidence.`
      }).catch(() => {});
    } else {
      notify?.('Report summary copied to clipboard');
    }
  };

  const handleCheckAgain = () => {
    if (onCheckAgain) {
      onCheckAgain();
    } else if (onScanAnother) {
      onScanAnother();
    } else {
      notify?.('Follow-up inspection scheduled for ' + (data.followUp?.followUpDate || '10 days'));
    }
  };

  const activeDebug = debugTelemetry || diagnosisData?.debugTelemetry;

  return (
    <div className="diagnosis-page-container">
      {/* HEADER (Shows ONLY: "AI Crop Health Diagnosis" + Back Button) */}
      <DiagnosisHeader onBack={onBack} />

      <div className="diagnosis-content-scroll">
        {/* DEVELOPMENT / MOCK PREVIEW NOTICE */}
        {!diagnosisData && (
          <div className="diagnosis-preview-badge">
            <span>🔬 Frontend Presentation Preview (Sample Specimen)</span>
            <span className="diagnosis-preview-badge-tag">Mock UI Preview</span>
          </div>
        )}

        {/* DEVELOPMENT TELEMETRY DEBUG PANEL (Cleanly returns null) */}
        <DiagnosisDebugPanel
          selectedCropBeforeCall={activeDebug?.selectedCropBeforeCall || data.crop}
          formDataCrop={activeDebug?.formDataCrop || data.crop}
          backendReturnedCrop={data.crop}
          scanId={data.scan_id || data._id || activeDebug?.backendScanId}
          imageFilename={activeDebug?.imageFilename || 'leaf_specimen.jpg'}
          modelVersion={data.modelVersion}
          localizationEngine={data.visual_evidence?.localization_engine || 'Classical CV / OpenCV Contour Analysis'}
        />

        {/* SECTION 1: Scanned Image + Localization Overlay */}
        <ScanImageCard
          image={data.image}
          crop={data.crop}
          organ={data.organ}
          detections={data.detections}
        />

        {/* SECTION 2: Disease Detected Card */}
        <DiagnosisSummary
          disease={data.disease}
          scientificName={data.scientificName}
          crop={data.crop}
          organ={data.organ}
          affectedArea={data.affectedArea}
          severity={data.severity}
          confidenceStatus={data.confidenceStatus}
          safetyMessage={data.safetyMessage}
          topPredictions={data.top_predictions || data.topPredictions || data.topK || []}
        />

        {/* Quick Prescription Action Bar or Uncertain Referral Bar */}
        {data.isUncertain ? (
          <div className="prescription-cta-banner" style={{ background: '#fff7ed', borderColor: '#fdba74' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '26px' }}>📋</span>
              <div>
                <strong style={{ fontSize: '13px', display: 'block', color: '#9a3412' }}>
                  Uncertain — expert verification required (विशेषज्ञ सत्यापन आवश्यक)
                </strong>
                <span style={{ fontSize: '11px', color: '#c2410c' }}>
                  Chemical prescriptions and dosages are withheld to prevent pesticide misuse. Generate a laboratory referral slip for extension verification.
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-open-prescription-main"
              onClick={() => setShowPrescriptionModal(true)}
              style={{ background: '#d97706', borderColor: '#b45309' }}
            >
              <Printer size={15} />
              <span>Diagnostic Referral Slip (सत्यापन पर्ची बनाएं)</span>
            </button>
          </div>
        ) : (
          <div className="prescription-cta-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '26px' }}>📄</span>
              <div>
                <strong style={{ fontSize: '13px', display: 'block', color: 'var(--ink)' }}>
                  Official Medicine Prescription (किसान दवा पर्ची)
                </strong>
                <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
                  Exact 15L pump dosages, spray schedule & CIB&RC approved medicines for printing.
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-open-prescription-main"
              onClick={() => setShowPrescriptionModal(true)}
            >
              <Printer size={15} />
              <span>View & Print Prescription (दवा पर्ची देखें व प्रिंट करें)</span>
            </button>
          </div>
        )}

        {/* SECTION 3: Confidence Level */}
        <ConfidenceCard
          confidence={data.confidence}
          confidenceStatus={data.confidenceStatus}
          modelVersion={data.modelVersion}
        />

        {/* SECTION 4: Scan Details */}
        <ScanDetails
          scanDate={data.scanDate}
          crop={data.crop}
          organ={data.organ}
          location={data.location}
        />

        {/* SECTION 5: Symptoms Detected */}
        <SymptomsSection
          symptoms={data.symptoms}
        />

        {/* SECTION 6: Why This Disease May Occur */}
        <CauseSection
          causes={data.causes}
        />

        {/* SECTION 7: Detailed Step-by-Step Solution Process (IPM Protocol) */}
        <TreatmentTimeline
          treatmentSteps={data.treatmentSteps}
        />

        {/* SECTION 8: Recommended Crop Protection & Chemical Dosages */}
        <CropProtectionSection
          treatments={data.treatments}
          confidenceStatus={data.confidenceStatus}
          onOpenPrescription={() => setShowPrescriptionModal(true)}
        />

        {/* SECTION 9: 10-Day Follow-Up */}
        <FollowUpCard
          followUp={data.followUp}
          onCheckAgain={handleCheckAgain}
        />

        {/* SECTION 10: Result Status */}
        <ResultStatus
          status={data.followUp?.resultStatus || 'AWAITING FOLLOW-UP'}
        />

        {/* SECTION 11: Action Buttons */}
        <DiagnosisActions
          onScanAnother={onScanAnother || onBack}
          onSaveResult={handleSave}
          onShareResult={handleShare}
        />
      </div>

      {/* Printable Krishi Prescription Modal */}
      <KrishiPrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        diagnosisData={data}
        prescriptionPlan={data.detailedPlan}
      />
    </div>
  );
}
