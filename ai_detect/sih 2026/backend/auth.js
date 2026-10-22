import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'fasal_dristhi_secure_production_secret_2026_key'
const TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

/**
 * Base64URL encoding according to RFC 7515 / RFC 7519
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return Buffer.from(str, 'base64').toString('utf8')
}

/**
 * Generate HMAC-SHA256 JWT Token
 */
export function generateToken(payload) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const exp = Math.floor((Date.now() + TOKEN_EXPIRY_MS) / 1000)

  const tokenPayload = {
    ...payload,
    iat: now,
    exp
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

/**
 * Cryptographically Verify and Decode JWT Token
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token is required and must be a string')
  }

  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('Malformed JWT structure: token must contain 3 parts')
  }

  const [encodedHeader, encodedPayload, signature] = parts

  // Recompute signature to verify integrity
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  // Timing-safe comparison to prevent side-channel attacks
  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSignature)

  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    throw new Error('Invalid JWT signature: token has been tampered with or secret mismatch')
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload))

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    throw new Error('JWT token has expired')
  }

  return payload
}

/**
 * Secure password hashing using PBKDF2 with SHA-512 and random salt
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false
  const [salt, originalHash] = storedHash.split(':')
  const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return computedHash === originalHash
}

/**
 * Express Middleware: Require Authentication
 * Rejects unauthenticated requests with HTTP 401
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || ''
  
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please provide a valid Bearer token in the Authorization header.',
      code: 'AUTH_REQUIRED'
    })
  }

  const token = authHeader.slice(7).trim()

  try {
    const userPayload = verifyToken(token)
    req.user = userPayload
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: `Authentication failed: ${err.message}`,
      code: 'INVALID_TOKEN'
    })
  }
}

/**
 * Express Middleware: Optional Authentication
 * Binds req.user if token is present and valid, but continues without error if absent
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || ''
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    try {
      req.user = verifyToken(token)
    } catch {
      req.user = null
    }
  } else {
    req.user = null
  }
  next()
}

/**
 * Cryptographically verify and refresh an expired or active JWT token.
 * Validates HMAC-SHA256 signature to guarantee integrity.
 * If signature is valid, allows refresh within a 7-day grace window after expiration.
 */
export function refreshToken(token, maxGraceSeconds = 7 * 24 * 3600) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token is required and must be a string')
  }

  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('Malformed JWT structure: token must contain 3 parts')
  }

  const [encodedHeader, encodedPayload, signature] = parts

  // Recompute signature to verify integrity against JWT_SECRET
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSignature)

  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    throw new Error('Invalid JWT signature: token has been tampered with or secret mismatch')
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload))
  const now = Math.floor(Date.now() / 1000)

  // Verify it hasn't exceeded the post-expiration grace window
  if (payload.exp && (now - payload.exp) > maxGraceSeconds) {
    throw new Error('JWT token has expired beyond allowable refresh window')
  }

  const newPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role || 'farmer'
  }
  return {
    token: generateToken(newPayload),
    payload: newPayload
  }
}

