import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY_AUTH = 'fasalDristhi_auth_session'
const STORAGE_KEY_JWT = 'fasalDristhi_jwt'

const AuthContext = createContext(null)

/**
 * Read the stored JWT for use in Authorization headers.
 * Call this outside of React components (e.g. inside fetch helpers).
 */
export function getToken() {
  try {
    const token = localStorage.getItem(STORAGE_KEY_JWT)
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return null
    }
    return token.trim()
  } catch {
    return null
  }
}

/** Store or clear the JWT in localStorage */
export function storeToken(token) {
  try {
    if (token && token !== 'null' && token !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_JWT, token.trim())
    } else {
      localStorage.removeItem(STORAGE_KEY_JWT)
    }
  } catch {}
}

/**
 * Check whether a JWT token string has expired.
 */
export function isTokenExpired(token) {
  if (!token) return true
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.exp) return false
    const now = Math.floor(Date.now() / 1000)
    return payload.exp <= now
  } catch {
    return true
  }
}

/**
 * Retrieve a cryptographically valid token.
 * If the current token is close to expiry (within 120s) or expired,
 * it attempts a refresh using the backend refresh mechanism.
 */
export async function getValidToken() {
  let token = getToken()
  if (!token) return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      storeToken(null)
      return null
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    const now = Math.floor(Date.now() / 1000)

    // If token expires in less than 2 minutes, attempt auto-refresh
    if (payload.exp && (payload.exp - now) < 120) {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      })
      const refreshData = await refreshRes.json()
      if (refreshRes.ok && refreshData.success && refreshData.token) {
        storeToken(refreshData.token)
        return refreshData.token
      }
    }
  } catch (err) {
    console.warn('[Auth] Token validation/refresh check failed:', err)
  }

  return token
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedToken = getToken()
      const saved = localStorage.getItem(STORAGE_KEY_AUTH)
      if (saved && savedToken) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Error reading stored auth session', e)
    }
    return null
  })

  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  // Persist session and JWT to localStorage
  useEffect(() => {
    try {
      if (user && getToken()) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH)
        storeToken(null)
      }
    } catch (e) {
      console.warn('Error saving auth session', e)
    }
  }, [user])

  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true)
    setAuthError('')
    try {
      if (!email || !password) {
        throw new Error('Please provide both email and password.')
      }

      // Attempt real backend login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })
      const data = await res.json()
      if (res.ok && data.success && data.token) {
        storeToken(data.token)
        const sessionUser = {
          ...data.user,
          isGoogleConnected: false,
          authProvider: 'email',
          avatarUrl: data.user.avatarUrl || '',
          farmFieldsCount: data.user.farmFieldsCount ?? 1,
          savedGuidesCount: data.user.savedGuidesCount ?? 0,
          healthScore: data.user.healthScore ?? 80
        }
        setUser(sessionUser)
        return { success: true, user: sessionUser, token: data.token }
      }
      throw new Error(data.error || 'Invalid email or password.')
    } catch (err) {
      const errorMsg = err.message === 'Failed to fetch'
        ? 'Cannot connect to authentication service. Please ensure backend is running.'
        : (err.message || 'Sign in failed')
      setAuthError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async ({ name, email, phone, password, village, state, primaryCrop }) => {
    setLoading(true)
    setAuthError('')
    try {
      if (!name || !email || !password) {
        throw new Error('Full name, email, and password are required.')
      }

      // Attempt real backend registration
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.trim(), password, phone, village, state, primaryCrop })
      })
      const data = await res.json()
      if (res.ok && data.success && data.token) {
        storeToken(data.token)
        const sessionUser = {
          ...data.user,
          isGoogleConnected: false,
          authProvider: 'email',
          avatarUrl: data.user.avatarUrl || '',
          farmFieldsCount: data.user.farmFieldsCount ?? 1,
          savedGuidesCount: data.user.savedGuidesCount ?? 0,
          healthScore: data.user.healthScore ?? 85
        }
        setUser(sessionUser)
        return { success: true, user: sessionUser, token: data.token }
      }
      throw new Error(data.error || 'Registration failed.')
    } catch (err) {
      const errorMsg = err.message === 'Failed to fetch'
        ? 'Cannot connect to registration service. Please ensure backend is running.'
        : (err.message || 'Registration failed')
      setAuthError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'farmer.anish@fasaldristhi.in',
          name: 'Anish Goswami',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        })
      })
      const data = await res.json()
      if (res.ok && data.success && data.token) {
        storeToken(data.token)
        const sessionUser = {
          ...data.user,
          isGoogleConnected: true,
          authProvider: 'google',
          avatarUrl: data.user.avatarUrl || '',
          farmFieldsCount: data.user.farmFieldsCount ?? 4,
          savedGuidesCount: data.user.savedGuidesCount ?? 3,
          healthScore: data.user.healthScore ?? 82
        }
        setUser(sessionUser)
        return { success: true, user: sessionUser, token: data.token }
      }
      throw new Error(data.error || 'Google sign-in failed.')
    } catch (err) {
      const errorMsg = err.message === 'Failed to fetch'
        ? 'Backend service unavailable for Google OAuth. Check backend connection.'
        : (err.message || 'Google sign-in cancelled or unavailable')
      setAuthError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshSession = useCallback(async () => {
    const currentToken = getToken()
    if (!currentToken) return false
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ token: currentToken })
      })
      const data = await res.json()
      if (res.ok && data.success && data.token) {
        storeToken(data.token)
        if (data.user) {
          setUser(prev => ({ ...(prev || {}), ...data.user }))
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 200))
      storeToken(null)
      setUser(null)
      localStorage.removeItem(STORAGE_KEY_AUTH)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (updatedFields) => {
    setLoading(true)
    try {
      setUser(prev => {
        const next = { ...(prev || {}), ...updatedFields }
        const token = getToken()
        fetch('/api/profile/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(next)
        }).catch(() => {})
        return next
      })
      return { success: true }
    } finally {
      setLoading(false)
    }
  }, [])

  // Calculate actual dynamic profile completion percentage
  const calculateCompletion = useCallback(() => {
    if (!user) return 0
    const fields = [
      user.name,
      user.phone,
      user.email,
      user.village,
      user.state,
      user.primaryCrop,
      user.avatarUrl,
      user.soilType
    ]
    const filled = fields.filter(Boolean).length
    return Math.round((filled / fields.length) * 100)
  }, [user])

  const value = {
    user,
    isAuthenticated: Boolean(user && getToken()),
    loading,
    authError,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshSession,
    updateProfile,
    profileCompletion: calculateCompletion()
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
