import React, { useState } from 'react'
import { Phone, CheckCircle, ExternalLink, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'

export const VERIFIED_HELPLINES = [
  {
    id: 'national-kisan-call-centre',
    scope: 'All India',
    title: 'Kisan Call Centre',
    titleHi: 'किसान कॉल सेंटर (भारत सरकार)',
    titleMr: 'किसान कॉल सेंटर (भारत सरकार)',
    titleBn: 'কিষাণ কল সেন্টার (ভারত সরকার)',
    badge: 'Official Govt · 24×7 Toll-Free',
    number: '1800-180-1551',
    tel: 'tel:18001801551',
    is24x7: true,
    desc: 'Nationwide 24×7 agricultural advisory service by the Ministry of Agriculture & Farmers Welfare. Available in 22 local languages including Hindi, Marathi, Bengali, and English.',
    sourceUrl: 'https://farmer.gov.in/kisan.aspx',
    sourceName: 'farmer.gov.in / Ministry of Agriculture',
    verified: true,
    themeColor: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0'
  },
  {
    id: 'maharashtra-agri-dept',
    scope: 'Maharashtra',
    title: 'Maharashtra Agriculture Department',
    titleHi: 'महाराष्ट्र कृषि विभाग हेल्पलाइन',
    titleMr: 'महाराष्ट्र कृषी विभाग शेतकरी हेल्पलाइन',
    titleBn: 'মহারাষ্ট্র কৃষি বিভাগ হেল্পলাইন',
    badge: 'State Govt Helpline',
    number: '1800-233-4000',
    tel: 'tel:18002334000',
    is24x7: false,
    desc: 'Dedicated state helpline for farmer assistance regarding certified seeds, fertilizer & pesticide quality, supply shortages, subsidies, and complaints.',
    sourceUrl: 'https://krishi.maharashtra.gov.in/',
    sourceName: 'krishi.maharashtra.gov.in',
    verified: true,
    themeColor: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd'
  }
]

export const WHEN_TO_CALL_GUIDES = [
  {
    icon: '🌦️',
    title: 'Weather & Spray Advisory',
    titleHi: 'मौसम एवं छिड़काव सलाह',
    titleMr: 'हवामान व फवारणी सल्ला',
    titleBn: 'আবহাওয়া ও স্প্রে পরামর্শ',
    desc: 'Check optimal spraying time, rainfall windows, and frost/heatwave warnings.'
  },
  {
    icon: '🐛',
    title: 'Pest & Disease Outbreaks',
    titleHi: 'कीट व रोग प्रकोप',
    titleMr: 'कीड व रोग प्रादुर्भाव',
    titleBn: 'কীটপতঙ্গ ও রোগবালাই প্রাদুর্ভাব',
    desc: 'Immediate diagnosis advice for sudden leaf spots, wilting, or caterpillar attacks.'
  },
  {
    icon: '🌱',
    title: 'Crop & Seed Guidance',
    titleHi: 'बीज व बुवाई मार्गदर्शन',
    titleMr: 'बियाणे व लागवड मार्गदर्शन',
    titleBn: 'উন্নত বীজ ও রোপণ নির্দেশিকা',
    desc: 'Recommend certified hybrid varieties, seed treatment, and sowing spacing.'
  },
  {
    icon: '🧪',
    title: 'Fertilizer & Nutrition',
    titleHi: 'उर्वरक एवं पोषण मात्रा',
    titleMr: 'खते व पोषण व्यवस्थापन',
    titleBn: 'সার ও পুষ্টি মাত্রা ব্যবস্থাপনা',
    desc: 'Correct N-P-K dosages, micronutrient deficiency cure, and soil health advice.'
  },
  {
    icon: '💰',
    title: 'Govt Schemes & Subsidies',
    titleHi: 'सरकारी योजनाएं व सब्सिडी',
    titleMr: 'शासकीय योजना व अनुदान',
    titleBn: 'সরকারি প্রকল্প ও কৃষি অনুদান',
    desc: 'Guidance on PM-Kisan, drip irrigation subsidies, and crop insurance claims.'
  },
  {
    icon: '📦',
    title: 'Supply Complaints',
    titleHi: 'नकली खाद/बीज शिकायत',
    titleMr: 'बनावट बियाणे व खते तक्रार',
    titleBn: 'সার ও বীজের গুণমান সংক্রান্ত অভিযোগ',
    desc: 'Report spurious inputs, overpricing, or black marketing directly to authorities.'
  }
]

export default function KisanHelpCenterScreen({ onBack, notify }) {
  const { language, t } = useLanguage()
  const [confirmCall, setConfirmCall] = useState(null)

  const handleInitiateCall = (helpline) => {
    setConfirmCall(helpline)
  }

  const handleProceedCall = () => {
    if (confirmCall) {
      window.location.href = confirmCall.tel
      if (notify) notify(`Dialing ${confirmCall.title}: ${confirmCall.number}`)
      setConfirmCall(null)
    }
  }

  return (
    <div className="subpage-view" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="subpage-header" style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
        <button className="subpage-back-btn" onClick={onBack} title="Go Back">‹</button>
        <span className="subpage-title" style={{ fontWeight: 800, color: '#0f172a' }}>
          {language === 'hi' ? 'किसान सहायता केंद्र' : language === 'mr' ? 'किसान मदत केंद्र' : language === 'bn' ? 'কিষাণ সহায়তা কেন্দ্র' : 'Kisan Help Center'}
        </span>
        <div style={{ width: '36px' }}></div>
      </div>

      <div className="app-scroll-body" style={{ padding: '16px', paddingBottom: '90px' }}>
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
          borderRadius: '20px',
          padding: '20px',
          color: '#ffffff',
          marginBottom: '18px',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={18} color="#a7f3d0" />
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a7f3d0' }}>
              Official Farmer Assistance
            </span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', lineHeight: 1.3 }}>
            {language === 'hi' ? 'सरकारी कृषि हेल्पलाइन एवं विशेषज्ञ सहायता'
              : language === 'mr' ? 'शासकीय कृषी हेल्पलाइन व तज्ज्ञ सल्ला'
              : language === 'bn' ? 'সরকারি কৃষি হেল্পলাইন ও বিশেষজ্ঞ সহায়তা'
              : 'Direct Government Helplines & Agronomy Support'}
          </h2>
          <p style={{ fontSize: '12px', opacity: 0.92, margin: 0, lineHeight: 1.4 }}>
            {language === 'hi' ? 'निःशुल्क फोन करें और भारत सरकार एवं राज्य कृषि विभाग से तुरंत समाधान पाएं।'
              : language === 'mr' ? 'मोफत कॉल करा आणि कृषी शास्त्रज्ञांकडून त्वरित मार्गदर्शन मिळवा.'
              : language === 'bn' ? 'টোল-ফ্রি কল করে সরাসরি সরকারি কৃষি বিশেষজ্ঞদের পরামর্শ নিন।'
              : 'Connect directly with certified agronomists and government officials toll-free.'}
          </p>
        </div>

        {/* Helpline Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {VERIFIED_HELPLINES.map((hl) => (
            <div
              key={hl.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: `1px solid ${hl.borderColor}`,
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: hl.bgColor,
                    color: hl.themeColor,
                    fontSize: '10px',
                    fontWeight: 800,
                    marginBottom: '4px'
                  }}>
                    {hl.badge}
                  </span>
                  <h3 style={{ margin: '4px 0 2px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {language === 'hi' ? hl.titleHi : language === 'mr' ? hl.titleMr : language === 'bn' ? hl.titleBn : hl.title}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>📍 {hl.scope}</span>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: hl.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: hl.themeColor
                }}>
                  <Phone size={20} />
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '10px 14px',
                borderRadius: '12px',
                margin: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Toll Free Number</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: hl.themeColor, letterSpacing: '0.02em' }}>
                    {hl.number}
                  </div>
                </div>
                {hl.is24x7 && (
                  <span style={{ background: '#dcfce7', color: '#166534', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '20px' }}>
                    24×7 Available
                  </span>
                )}
              </div>

              <p style={{ fontSize: '11.5px', color: '#475569', margin: '0 0 14px', lineHeight: 1.45 }}>
                {hl.desc}
              </p>

              {/* Action row */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => handleInitiateCall(hl)}
                  style={{
                    flex: 1,
                    background: hl.themeColor,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: `0 4px 12px ${hl.themeColor}33`
                  }}
                  aria-label={`Call ${hl.title}`}
                >
                  <Phone size={15} />
                  <span>{language === 'hi' ? 'कॉल करें' : language === 'mr' ? 'कॉल करा' : language === 'bn' ? 'কল করুন' : 'Call Now'} ({hl.number})</span>
                </button>

                <a
                  href={hl.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="View official government source"
                >
                  <ExternalLink size={13} />
                  <span>Source</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* When to Call Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {language === 'hi' ? 'किसान हेल्पलाइन पर कब संपर्क करें?'
                : language === 'mr' ? 'हेल्पलाइनवर केव्हा संपर्क साधावा?'
                : language === 'bn' ? 'কখন হেল্পলাইনে কল করবেন?'
                : 'When Should You Call?'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            {WHEN_TO_CALL_GUIDES.map((g, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{g.icon}</div>
                <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  {language === 'hi' ? g.titleHi : language === 'mr' ? g.titleMr : language === 'bn' ? g.titleBn : g.title}
                </strong>
                <p style={{ fontSize: '10.5px', color: '#64748b', margin: 0, lineHeight: 1.35 }}>
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Transparency Footer */}
        <div style={{
          padding: '14px',
          background: '#f1f5f9',
          borderRadius: '12px',
          fontSize: '11px',
          color: '#64748b',
          lineHeight: 1.45,
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
            🛡️ Official Source Verification: Ministry of Agriculture & Farmers Welfare, Govt of India (farmer.gov.in) & Maharashtra State Agriculture Dept (krishi.maharashtra.gov.in).
          </p>
          <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>
            Fasal Dristhi provides direct telephonic links to official public helplines without intercepting or recording farmer calls.
          </p>
        </div>
      </div>

      {/* Lightweight Call Confirmation Modal */}
      {confirmCall && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '340px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '27px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <Phone size={26} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>
              {language === 'hi' ? 'क्या आप कॉल करना चाहते हैं?'
                : language === 'mr' ? 'तुम्हाला कॉल करायचा आहे का?'
                : language === 'bn' ? 'আপনি কি কল করতে চান?'
                : 'Call Government Helpline?'}
            </h3>

            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px' }}>
              <strong>{confirmCall.title}</strong>
              <span style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {confirmCall.number}
              </span>
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setConfirmCall(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleProceedCall}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
              >
                📞 Call Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
