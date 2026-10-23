/**
 * 🎙️ ElevenLabs Text-to-Speech Voice Service
 * Provides high-definition multilingual speech synthesis for Kisan AI Assistant.
 * 
 * Features:
 * - Direct integration with ElevenLabs REST API v1
 * - Secure server-side credential isolation (API key never exposed to client)
 * - Markdown & URL stripping for natural speech cadence
 * - Multilingual support (Hindi, Bengali, Marathi, English)
 * - Graceful fallback signaling for client-side Web Speech API
 */

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech'
const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah (Premade Multilingual)
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2' // Multilingual v2 model
const MAX_TEXT_LENGTH = 2500
const TTS_TIMEOUT_MS = 15000

/**
 * Sanitizes and prepares raw AI markdown text for speech synthesis.
 * Strips code blocks, URLs, markdown formatting, and excessive punctuation.
 */
export function cleanTextForSpeech(rawText) {
  if (typeof rawText !== 'string') return ''
  return rawText
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove URLs
    .replace(/https?:\/\/\S+/g, '')
    // Remove markdown symbols
    .replace(/[#*_~>]/g, '')
    // Replace bullet points with brief pauses
    .replace(/^[-*•]\s+/gm, '')
    // Normalize newlines to sentence pauses
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    // Collapse excess spaces
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * Synthesizes audio buffer from text using ElevenLabs API.
 */
export async function synthesizeSpeech(text, options = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    const error = new Error('ElevenLabs API key is not configured on the server.')
    error.code = 'ELEVENLABS_NOT_CONFIGURED'
    error.statusCode = 503
    throw error
  }

  const voiceId = options.voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID
  const modelId = options.modelId || process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID

  const cleanedText = cleanTextForSpeech(text)
  if (!cleanedText) {
    const error = new Error('No speakable text provided after cleaning.')
    error.code = 'INVALID_TEXT'
    error.statusCode = 400
    throw error
  }

  if (cleanedText.length > MAX_TEXT_LENGTH) {
    const error = new Error(`Text exceeds maximum allowed length of ${MAX_TEXT_LENGTH} characters.`)
    error.code = 'TEXT_TOO_LONG'
    error.statusCode = 400
    throw error
  }

  const endpointUrl = `${ELEVENLABS_API_URL}/${encodeURIComponent(voiceId)}`

  const payload = {
    text: cleanedText,
    model_id: modelId,
    voice_settings: {
      stability: options.stability ?? 0.5,
      similarity_boost: options.similarityBoost ?? 0.75
    }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS)

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey.trim(),
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorBody = ''
      try {
        const errorJson = await response.json()
        errorBody = errorJson?.detail?.message || errorJson?.message || JSON.stringify(errorJson)
      } catch {
        errorBody = await response.text()
      }

      const error = new Error(`ElevenLabs upstream error: ${errorBody || response.statusText}`)
      error.statusCode = response.status === 401 ? 401 : response.status === 429 ? 429 : 502
      error.code = response.status === 401
        ? 'INVALID_API_KEY'
        : response.status === 429
        ? 'QUOTA_EXCEEDED'
        : 'UPSTREAM_TTS_FAILED'
      throw error
    }

    const arrayBuffer = await response.arrayBuffer()
    return {
      audioBuffer: Buffer.from(arrayBuffer),
      contentType: 'audio/mpeg',
      voiceId,
      modelId,
      characterCount: cleanedText.length
    }
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      const error = new Error('ElevenLabs text-to-speech request timed out.')
      error.code = 'TTS_TIMEOUT'
      error.statusCode = 504
      throw error
    }
    throw err
  }
}

/**
 * Express Route Handler: POST /api/voice/tts
 */
export async function handleTextToSpeech(req, res) {
  try {
    const { text, voiceId, modelId, stability, similarityBoost } = req.body || {}

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        code: 'INVALID_INPUT',
        error: 'A non-empty "text" string is required in the request body.',
        fallback: 'browser'
      })
    }

    const result = await synthesizeSpeech(text, {
      voiceId,
      modelId,
      stability,
      similarityBoost
    })

    res.setHeader('Content-Type', result.contentType)
    res.setHeader('Content-Length', result.audioBuffer.length)
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.setHeader('X-Voice-Provider', 'ElevenLabs')
    res.setHeader('X-Voice-Id', result.voiceId)

    return res.end(result.audioBuffer)
  } catch (err) {
    const statusCode = err.statusCode || 500
    const errorCode = err.code || 'TTS_INTERNAL_ERROR'

    // Clean sanitized error logging without secrets
    console.warn(`[ElevenLabs TTS] Speech synthesis failed (${errorCode}):`, err.message)

    return res.status(statusCode).json({
      success: false,
      code: errorCode,
      error: err.message,
      fallback: 'browser'
    })
  }
}

/**
 * Express Route Handler: GET /api/voice/status
 */
export function handleVoiceStatus(req, res) {
  const hasKey = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim() !== '')
  res.json({
    success: true,
    available: hasKey,
    provider: 'ElevenLabs',
    voiceId: process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID,
    modelId: process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID,
    maxTextLength: MAX_TEXT_LENGTH
  })
}
