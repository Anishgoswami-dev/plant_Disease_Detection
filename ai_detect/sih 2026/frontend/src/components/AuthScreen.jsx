import React, { useState } from 'react'
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Sprout,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage, SUPPORTED_LANGUAGES, normalizeLanguage } from '../context/LanguageContext.jsx'
import './authOnboardingStyles.css'

/**
 * 🌿 AuthScreen Component
 * Dedicated full-screen authentication experience for Fasal Dristhi.
 * Supports:
 * - Direct Google Sign-In ("Google से जारी रखें")
 * - Email / Phone & Password Login
 * - New Farmer Registration with Village, State & Primary Crop
 * - Quick One-Click Demo Farmer Login
 * - In-screen Language Switcher
 */
export default function AuthScreen({ onAuthSuccess, notify }) {
  const { signIn, signUp, signInWithGoogle, loading, authError } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [village, setVillage] = useState('')
  const [state, setState] = useState('Maharashtra')
  const [primaryCrop, setPrimaryCrop] = useState('Tomato')

  // UI feedback
  const [localError, setLocalError] = useState('')

  // Quick Demo Login Handler
  const handleDemoLogin = async () => {
    setLocalError('')
    setEmail('farmer.anish@fasaldristhi.in')
    setPassword('Farmer@123')
    const res = await signIn({ email: 'farmer.anish@fasaldristhi.in', password: 'Farmer@123' })
    if (res.success) {
      if (notify) notify('👨‍🌾 Welcome back, Anish! Demo farmer authenticated.')
      if (onAuthSuccess) onAuthSuccess(res.user, false)
    } else {
      setLocalError(res.error || 'Demo login failed.')
    }
  }

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setLocalError('')
    const res = await signInWithGoogle()
    if (res.success) {
      if (notify) notify('✅ Google Account verified! Welcome to Fasal Dristhi.')
      if (onAuthSuccess) onAuthSuccess(res.user, true)
    } else {
      setLocalError(res.error || 'Google authentication failed.')
    }
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (mode === 'signin') {
      if (!email.trim()) return setLocalError('Please enter your email or mobile number.')
      if (!password) return setLocalError('Please enter your password.')

      const res = await signIn({ email: email.trim(), password })
      if (res.success) {
        if (notify) notify('✅ Welcome back! Signed in successfully.')
        if (onAuthSuccess) onAuthSuccess(res.user, false)
      } else {
        setLocalError(res.error || 'Invalid credentials. Check email or password.')
      }
    } else {
      if (!name.trim()) return setLocalError('Please enter your full name (पूरा नाम).')
      if (!email.trim() || !email.includes('@')) return setLocalError('Please enter a valid email address.')
      if (password.length < 6) return setLocalError('Password must be at least 6 characters long.')

      const res = await signUp({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+91 98765 43210',
        password,
        village: village.trim() || 'Nashik Rural',
        state,
        primaryCrop
      })

      if (res.success) {
        if (notify) notify('🎉 Farmer Account registered! Welcome to Fasal Dristhi.')
        if (onAuthSuccess) onAuthSuccess(res.user, true)
      } else {
        setLocalError(res.error || 'Registration failed. Please try again.')
      }
    }
  }

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === normalizeLanguage(language)) || SUPPORTED_LANGUAGES[0]

  return (
    <div className="auth-screen-container">
      {/* 🌐 Top Bar with Language Selector */}
      <div className="auth-top-bar" style={{ justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="auth-lang-btn"
            onClick={() => setShowLangMenu(!showLangMenu)}
            title="Change Language"
          >
            <Globe size={14} />
            <span>{currentLangObj.flag} {currentLangObj.title}</span>
          </button>

          {showLangMenu && (
            <div className="auth-lang-dropdown">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`auth-lang-opt ${normalizeLanguage(language) === l.code ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(l.code)
                    setShowLangMenu(false)
                    if (notify) notify(`Language set to ${l.title}`)
                  }}
                >
                  <span>{l.flag}</span>
                  <span>{l.title} ({l.subtitle})</span>
                  {normalizeLanguage(language) === l.code && <CheckCircle2 size={13} color="#16a34a" style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🌿 Main Brand Header */}
      <div className="auth-brand-card">
        <div className="auth-logo-halo">
          <span className="auth-logo-icon">🌿</span>
        </div>
        <h1 className="auth-brand-title">Fasal Dristhi</h1>
        <p className="auth-brand-tagline">
          स्मार्ट खेती • समृद्ध किसान | Smart AI Crop Diagnostics
        </p>
      </div>

      {/* 📑 Mode Switcher Tabs */}
      <div className="auth-tabs-row">
        <button
          type="button"
          className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
          onClick={() => { setMode('signin'); setLocalError(''); }}
        >
          {mode === 'signin' && <Sparkles size={13} />}
          <span>लॉग इन (Log In)</span>
        </button>

        <button
          type="button"
          className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => { setMode('signup'); setLocalError(''); }}
        >
          {mode === 'signup' && <Sparkles size={13} />}
          <span>नया खाता (Sign Up)</span>
        </button>
      </div>

      {/* 🔴 Error Alert */}
      {(localError || authError) && (
        <div className="auth-error-banner">
          <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
          <span>{localError || authError}</span>
        </div>
      )}

      {/* 🔘 Google Sign-In Primary Button */}
      <button
        type="button"
        className="btn-google-auth-primary"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span style={{ fontWeight: 800 }}>
          {loading ? 'Connecting Google...' : 'Google से जारी रखें (Continue with Google)'}
        </span>
      </button>

      {/* ➗ Divider */}
      <div className="auth-divider-line">
        <span>अथवा ईमेल / पासवर्ड से (Or via Email)</span>
      </div>

      {/* 📝 Auth Form */}
      <form onSubmit={handleSubmit} className="auth-form-card">
        {mode === 'signup' && (
          <>
            <div className="auth-field-group">
              <label className="auth-field-lbl">
                <User size={14} /> <span>पूरा नाम (Full Name) *</span>
              </label>
              <input
                type="text"
                className="auth-input-field"
                placeholder="उदा. रमेश पाटिल / Anish Goswami"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label className="auth-field-lbl">
                <Phone size={14} /> <span>मोबाइल नंबर (Mobile Phone)</span>
              </label>
              <input
                type="tel"
                className="auth-input-field"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="auth-field-group">
          <label className="auth-field-lbl">
            <Mail size={14} /> <span>ईमेल (Email Address) *</span>
          </label>
          <input
            type="email"
            className="auth-input-field"
            placeholder="farmer@fasaldristhi.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-field-lbl">
            <Lock size={14} /> <span>पासवर्ड (Password) *</span>
          </label>
          <div className="auth-password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              className="auth-input-field"
              placeholder="कम से कम 6 अक्षर (Min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth-pwd-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <>
            <div className="auth-field-group">
              <label className="auth-field-lbl">
                <MapPin size={14} /> <span>गाँव / ज़िला (Village / District)</span>
              </label>
              <input
                type="text"
                className="auth-input-field"
                placeholder="उदा. पंचवटी, नाशिक"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="auth-field-group">
                <label className="auth-field-lbl">
                  <span>राज्य (State)</span>
                </label>
                <select
                  className="auth-select-field"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                  <option value="Punjab">Punjab (पंजाब)</option>
                  <option value="West Bengal">West Bengal (पश्चिम बंगाल)</option>
                  <option value="Gujarat">Gujarat (गुजरात)</option>
                  <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                  <option value="Karnataka">Karnataka (कर्नाटक)</option>
                  <option value="Rajasthan">Rajasthan (राजस्थान)</option>
                  <option value="Haryana">Haryana (हरियाणा)</option>
                  <option value="Bihar">Bihar (बिहार)</option>
                </select>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-lbl">
                  <Sprout size={14} /> <span>मुख्य फसल (Crop)</span>
                </label>
                <select
                  className="auth-select-field"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                >
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Rice (Paddy)">Rice / Paddy (धान)</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Banana">Banana (केला)</option>
                  <option value="Chilli">Chilli (मिर्च)</option>
                  <option value="Brinjal">Brinjal (बैंगन)</option>
                  <option value="Pomegranate">Pomegranate (अनार)</option>
                  <option value="Sugarcane">Sugarcane (गन्ना)</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* 🚀 Submit Button */}
        <button
          type="submit"
          className="btn-auth-submit-primary"
          disabled={loading}
        >
          <span>{loading ? 'कृपया प्रतीक्षा करें...' : mode === 'signin' ? 'लॉग इन करें (Sign In)' : 'खाता बनाएँ व आगे बढ़ें (Register)'}</span>
          <ArrowRight size={17} />
        </button>

        {/* ⚡ One-Click Demo Login (Only on signin mode) */}
        {mode === 'signin' && (
          <button
            type="button"
            className="btn-demo-quick-login"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <span>⚡ एक क्लिक में डेमो किसान लॉगिन (One-Click Demo Login)</span>
          </button>
        )}
      </form>

      {/* 🔒 Trust Footer */}
      <div className="auth-trust-footer">
        <span>🔒 256-Bit Encrypted Agricultural Security</span>
        <span>•</span>
        <span>SIH 2026 PS-26131</span>
      </div>
    </div>
  )
}
