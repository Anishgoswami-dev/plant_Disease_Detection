import React, { useState } from 'react'
import { X, Lock, Mail, User, Phone, MapPin, Sprout, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', notify }) {
  const { signIn, signUp, signInWithGoogle, loading, authError } = useAuth()
  const { language } = useLanguage()
  const [mode, setMode] = useState(initialMode) // 'signin' | 'signup' | 'forgot'
  
  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [village, setVillage] = useState('')
  const [state, setState] = useState('Maharashtra')
  const [primaryCrop, setPrimaryCrop] = useState('Tomato')
  
  // UI states
  const [localError, setLocalError] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (mode === 'signup') {
      if (!name.trim()) return setLocalError('Please enter your full name.')
      if (!email.trim() || !email.includes('@')) return setLocalError('Please enter a valid email address.')
      if (password.length < 6) return setLocalError('Password must be at least 6 characters long.')
      if (password !== confirmPassword) return setLocalError('Passwords do not match.')

      const res = await signUp({ name, email, phone, password, village, state, primaryCrop })
      if (res.success) {
        if (notify) notify('🎉 Account created successfully! Welcome to Fasal Dristhi.')
        onClose()
      } else {
        setLocalError(res.error || 'Registration failed.')
      }
    } else if (mode === 'signin') {
      if (!email.trim()) return setLocalError('Please enter your email.')
      if (!password) return setLocalError('Please enter your password.')

      const res = await signIn({ email, password })
      if (res.success) {
        if (notify) notify('✅ Signed in successfully.')
        onClose()
      } else {
        setLocalError(res.error || 'Invalid credentials.')
      }
    } else if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) return setLocalError('Please enter your registered email address.')
      setForgotSent(true)
      if (notify) notify(`Password reset instructions sent to ${email}`)
    }
  }

  const handleGoogleAuth = async () => {
    setLocalError('')
    const res = await signInWithGoogle()
    if (res.success) {
      if (notify) notify('✅ Google authentication verified. Profile synced.')
      onClose()
    } else {
      setLocalError(res.error || 'Google authentication failed.')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '420px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        padding: '24px'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            fontSize: '24px'
          }}>
            🌿
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            {mode === 'signup' ? 'Create Farmer Account' : mode === 'forgot' ? 'Reset Password' : 'Sign in to Fasal Dristhi'}
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            {mode === 'signup' ? 'Join 100,000+ farmers across India for smart AI crop health' : 'Access your farm plots, live weather, and crop health scans'}
          </p>
        </div>

        {/* Google One-Tap OAuth Button */}
        {mode !== 'forgot' && (
          <div style={{ marginBottom: '16px' }}>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#1e293b',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>

              <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
            </button>

            {mode === 'signin' && (
              <button
                type="button"
                onClick={async () => {
                  setLocalError('')
                  setEmail('farmer.anish@fasaldristhi.in')
                  setPassword('Farmer@123')
                  const res = await signIn({ email: 'farmer.anish@fasaldristhi.in', password: 'Farmer@123' })
                  if (res.success) {
                    if (notify) notify('✅ Signed in as demo farmer (Anish Goswami)')
                    onClose()
                  } else {
                    setLocalError(res.error || 'Demo sign-in failed.')
                  }
                }}
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1.5px solid #86efac',
                  background: '#f0fdf4',
                  color: '#166534',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: loading ? 'wait' : 'pointer'
                }}
              >
                <span>🌾</span>
                <span>Quick Sign-In as Demo Farmer (Anish Goswami)</span>
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>OR EMAIL</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>
          </div>
        )}


        {/* Error Alert */}
        {(localError || authError) && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Forms */}
        {mode === 'forgot' ? (
          <div>
            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>Reset Link Sent!</h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px' }}>
                  We have sent password recovery instructions to <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setForgotSent(false); }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0284c7',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anish Goswami"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                  Password *
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            )}

            {mode === 'signup' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Village / Town
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Panchavati"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Primary Crop
                  </label>
                  <select
                    value={primaryCrop}
                    onChange={(e) => setPrimaryCrop(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Brinjal">Brinjal</option>
                    <option value="Chilli">Chilli</option>
                    <option value="Canola">Canola</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '6px',
                background: 'linear-gradient(135deg, #0052cc 0%, #0066fe 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '13px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(0, 82, 204, 0.3)'
              }}
            >
              {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Toggle Mode */}
        {mode !== 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#64748b' }}>
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  style={{ background: 'none', border: 'none', color: '#0052cc', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                >
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  style={{ background: 'none', border: 'none', color: '#0052cc', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
