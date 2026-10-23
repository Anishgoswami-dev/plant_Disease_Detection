import React, { useState } from 'react'
import {
  Camera,
  FileText,
  Satellite,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Droplets,
  Printer,
  ChevronRight
} from 'lucide-react'
import './authOnboardingStyles.css'

/**
 * 🌟 OnboardingSlidesScreen Component
 * 3-slide interactive feature walkthrough for newly registered/logged-in users.
 * Showcases:
 * 1. AI Leaf Disease Detection & Lesion Localization (95%+ accuracy)
 * 2. CIB&RC Approved Medicines & Printable 15L Pump Prescription Slip
 * 3. Google Earth Satellite Farm Monitoring & Daily Mandi Rates
 */
export default function OnboardingSlidesScreen({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 'slide_ai_scan',
      tag: '📸 AI CROP HEALTH DIAGNOSIS',
      tagColor: '#0284c7',
      tagBg: '#e0f2fe',
      icon: '📸',
      headline: 'एआई फसल रोग व कीट पहचान',
      headlineEn: 'Instant AI Leaf Disease Diagnosis',
      description:
        'खेत में किसी भी बीमार पत्ती या तने की फोटो लें। हमारा कंप्यूटर विज़न एआई 38+ फसलों की गंभीर बीमारियों को 95%+ सटीकता के साथ तुरंत पहचानता है।',
      features: [
        { icon: '⚡', label: '3 सेकंड में रियल-टाइम रिपोर्ट' },
        { icon: '🎯', label: 'घाव की सटीक लोकलाइजेशन' },
        { icon: '🔬', label: '95%+ लैब-ग्रेड सटीकता' }
      ],
      previewGraphic: (
        <div className="onboard-graphic-card scan-glow">
          <div className="onboard-scan-view">
            <span className="onboard-leaf-emoji">🍃</span>
            <div className="onboard-scan-reticle" />
            <div className="onboard-bounding-box" style={{ top: '25%', left: '30%', width: '80px', height: '65px' }}>
              <span className="onboard-box-lbl">Alternaria solani</span>
            </div>
            <div className="onboard-conf-pill">
              <Sparkles size={12} color="#16a34a" />
              <span>95.4% High Confidence</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'slide_prescription',
      tag: '📋 OFFICIAL KRISHI PRESCRIPTION',
      tagColor: '#16a34a',
      tagBg: '#dcfce7',
      icon: '📄',
      headline: 'सटीक दवा पर्ची एवं 15L पंप खुराक',
      headlineEn: 'Official Medicine Dosages & Print Slip',
      description:
        'रोग की पहचान के बाद ICAR और CIB&RC अनुमोदित दवाइयों के नाम, 15 लीटर नैपसैक स्प्रे पंप के लिए सही मात्रा, और सीधे A4 पेपर पर प्रिंट करने योग्य पर्ची प्राप्त करें।',
      features: [
        { icon: '💧', label: '15L पंप की सटीक मात्रा (Dose)' },
        { icon: '🖨️', label: '1-क्लिक में A4 दवा पर्ची प्रिंट' },
        { icon: '🛡️', label: 'सुरक्षात्मक स्प्रे नियम व PPE' }
      ],
      previewGraphic: (
        <div className="onboard-graphic-card rx-glow">
          <div className="onboard-rx-view">
            <div className="onboard-rx-head">
              <span style={{ fontSize: '18px' }}>🌿</span>
              <div>
                <strong>FASAL DRISTHI ADVISORY</strong>
                <small style={{ display: 'block', fontSize: '9px', color: '#64748b' }}>CIB&RC Registered Protocol</small>
              </div>
              <span className="onboard-rx-tag">Rx Slip</span>
            </div>
            <div className="onboard-rx-rows">
              <div className="onboard-rx-item">
                <span>Mancozeb 75% WP</span>
                <strong style={{ color: '#0052cc' }}>35-40g / 15L Pump</strong>
              </div>
              <div className="onboard-rx-item">
                <span>Azoxystrobin SC</span>
                <strong style={{ color: '#0052cc' }}>15ml / 15L Pump</strong>
              </div>
            </div>
            <div className="onboard-rx-seal">
              <CheckCircle2 size={13} color="#15803d" />
              <span>DIGITALLY VALIDATED</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'slide_satellite',
      tag: '🛰️ SATELLITE & SMART FARM TOOLS',
      tagColor: '#7c3aed',
      tagBg: '#f3e8ff',
      icon: '🛰️',
      headline: 'उपग्रह से खेत की निगरानी व मंडी भाव',
      headlineEn: 'Satellite Crop Health & Mandi Market',
      description:
        'Google Earth सैटेलाइट से अपने खेतों की हरियाली (NDVI) और नमी का लाइव विश्लेषण करें, मौसम और छिड़काव एडवाइजरी पाएँ, और दैनिक मंडी भाव देखें।',
      features: [
        { icon: '🛰️', label: 'Google Earth NDVI खेत स्वास्थ्य' },
        { icon: '🌦️', label: 'छिड़काव मौसम एडवाइजरी (Spray Advisory)' },
        { icon: '📈', label: 'दैनिक मंडी बाजार दर (Live Mandi)' }
      ],
      previewGraphic: (
        <div className="onboard-graphic-card sat-glow">
          <div className="onboard-sat-view">
            <div className="onboard-sat-badge">
              <span>🛰️ NDVI High Vigor (0.78)</span>
            </div>
            <div className="onboard-field-map">
              <div className="onboard-plot plot-1">Field 1: Healthy Tomato (88%)</div>
              <div className="onboard-plot plot-2">Field 2: Drip Moisture Optimal</div>
            </div>
            <div className="onboard-mandi-strip">
              <span>🍅 Tomato: ₹2,450/Qtl</span>
              <span>🌾 Wheat: ₹2,275/Qtl</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  const current = slides[currentSlide]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="onboarding-screen-container">
      {/* 🔝 Top Header Navigation */}
      <div className="onboard-header-row">
        <div className="onboard-step-indicator">
          <span>Feature {currentSlide + 1} of {slides.length}</span>
        </div>

        <button
          type="button"
          className="onboard-btn-skip"
          onClick={onComplete}
          title="Skip to main app"
        >
          <span>छोड़ें (Skip)</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 🖼️ Hero Preview Graphic */}
      <div className="onboard-hero-area">
        {current.previewGraphic}
      </div>

      {/* 🏷️ Slide Text Content */}
      <div className="onboard-content-body">
        <div
          className="onboard-badge-tag"
          style={{ color: current.tagColor, background: current.tagBg }}
        >
          {current.tag}
        </div>

        <h2 className="onboard-title">{current.headline}</h2>
        <span className="onboard-subtitle">{current.headlineEn}</span>

        <p className="onboard-desc">{current.description}</p>

        {/* Highlight Bullets */}
        <div className="onboard-features-list">
          {current.features.map((feat, idx) => (
            <div key={idx} className="onboard-feat-item">
              <span className="onboard-feat-icon">{feat.icon}</span>
              <span className="onboard-feat-text">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🧭 Bottom Navigation & Progress Dots */}
      <div className="onboard-bottom-bar">
        {/* Animated Dot Indicators */}
        <div className="onboard-dots-wrap">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`onboard-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="onboard-btn-next"
          onClick={handleNext}
        >
          <span>
            {currentSlide === slides.length - 1
              ? 'शुरू करें (Get Started) 🚀'
              : 'आगे बढ़ें (Next) ➔'}
          </span>
          {currentSlide !== slides.length - 1 && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  )
}
