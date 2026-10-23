/**
 * 🔬 Centralized Mock Diagnosis Data Architecture
 * 
 * IMPORTANT: This file contains DEVELOPMENT / UI PREVIEW DATA ONLY.
 * It is NOT real ML inference or a trained YOLO model.
 * 
 * When real ML and backend services are connected:
 * Pass the real API response matching this structure directly into <CropHealthDiagnosisPage diagnosisData={apiResponse} />.
 */

export const mockDiagnosis = {
  crop: "Tomato",
  organ: "Leaf",
  disease: "Early Blight",
  scientificName: "Alternaria solani",
  confidence: 0.785, // Realistic sample confidence float (78.5%)
  confidenceStatus: "REVIEW_RECOMMENDED",
  modelVersion: "FasalDristhi-Vision v2.5 (Preview)",
  severity: "Moderate",
  affectedArea: 18, // Integer percentage (~18%)
  scanDate: "14 Sep 2026, 10:24 AM",
  location: "Nashik, Maharashtra", // If unavailable, passes "" or null -> UI shows "Location unavailable"
  image: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=800&auto=format&fit=crop&q=80",
  
  // Classical OpenCV localization coordinates (percentage-based: 0-100%)
  // Responsive across all screen sizes (360px to tablet/desktop)
  detections: [
    {
      id: "det_1",
      label: "Early Blight Lesion",
      confidence: 0.974,
      bbox: {
        x: 24, // 24% from left
        y: 28, // 28% from top
        width: 44, // 44% width
        height: 38 // 38% height
      }
    },
    {
      id: "det_2",
      label: "Concentric Ring Spot",
      confidence: 0.912,
      bbox: {
        x: 64,
        y: 58,
        width: 24,
        height: 26
      }
    }
  ],

  // Observed symptomatology
  symptoms: [
    "Brown circular spots with concentric target-board rings",
    "Yellow halo (chlorosis) around dark necrotic lesions",
    "Dry, brittle leaf patches with slight tissue cracking",
    "Spreading foliar lesions from lower mature canopy upwards"
  ],

  // Agronomic environmental causes
  causes: [
    {
      id: "c1",
      icon: "🌧️",
      title: "Prolonged Foliar Wetness",
      desc: "Leaf wetness exceeding 6-8 hours from dew or overhead sprinkler irrigation accelerates fungal spore germination."
    },
    {
      id: "c2",
      icon: "🌡️",
      title: "Warm & Humid Microclimate",
      desc: "Temperatures between 24°C–29°C paired with relative humidity above 80% create ideal conditions for Alternaria proliferation."
    },
    {
      id: "c3",
      icon: "🌱",
      title: "Soil-Splash & Lower Canopy Contact",
      desc: "Raindrops splashing against infested soil debris transfer resting conidia to the lower foliage leaves."
    }
  ],

  // Dynamic step-by-step solution process (vertical timeline)
  treatmentSteps: [
    {
      stepNumber: "01",
      icon: "✂️",
      title: "Identify & Remove Heavily Infected Leaves",
      explanation: "Carefully prune lower diseased foliage showing target spots into a disposal sack to prevent spore drift."
    },
    {
      stepNumber: "02",
      icon: "🧹",
      title: "Clean Infected Plant Debris",
      explanation: "Collect and safely dispose of all fallen leaf litter away from the cultivation field to eliminate overwintering spores."
    },
    {
      stepNumber: "03",
      icon: "💨",
      title: "Improve Field Air Ventilation",
      explanation: "Provide proper staking, prune redundant lower suckers, and ensure adequate plant spacing to allow fast canopy drying."
    },
    {
      stepNumber: "04",
      icon: "💧",
      title: "Manage Irrigation & Avoid Wet Leaves",
      explanation: "Switch to drip irrigation directly at the root zone. Avoid late-afternoon overhead spraying that leaves foliage damp overnight."
    },
    {
      stepNumber: "05",
      icon: "🛡️",
      title: "Apply Verified Treatment If Recommended",
      explanation: "Consult locally approved agricultural guidelines and consider registered preventive protectants if weather stays humid."
    },
    {
      stepNumber: "06",
      icon: "🔍",
      title: "Monitor the Crop Regularly",
      explanation: "Inspect 20 representative tomato plants twice weekly, paying close attention to newly expanding leaves."
    },
    {
      stepNumber: "07",
      icon: "📱",
      title: "Perform Scheduled Follow-Up Scan",
      explanation: "Capture a follow-up image in 10 days to track lesion stabilization and record plant recovery status."
    }
  ],

  // Recommended crop protection placeholder structure (No fake claims)
  treatments: [
    {
      id: "med_1",
      productName: "Registered Protective Fungicide",
      activeIngredient: "Mancozeb 75% WP (or ICAR/SAU recommended protectant)",
      formulation: "Wettable Powder (WP)",
      dose: "2.0 – 2.5 g per Litre of clean water",
      applicationMethod: "Foliar spray with cone nozzle ensuring uniform coverage of both leaf surfaces",
      applicationInterval: "Repeat after 7–10 days only if disease pressure and wet weather persist",
      PHI: "7 Days Pre-Harvest Interval (PHI)",
      safetyInstructions: "Always wear nitrile gloves, face mask, and eye protection goggles. Do not spray during peak midday heat or windy hours.",
      source: "ICAR - Indian Institute of Horticultural Research (IIHR) Tomato Advisory"
    }
  ],

  // 10-day follow-up tracking
  followUp: {
    scanDate: "14 Sep 2026",
    followUpDate: "24 Sep 2026",
    daysRemaining: 10,
    status: "Follow-up scheduled",
    resultStatus: "AWAITING FOLLOW-UP" // Allowed statuses: IMPROVING | STABLE | WORSENING | RECOVERED | UNCERTAIN | AWAITING FOLLOW-UP
  }
};
