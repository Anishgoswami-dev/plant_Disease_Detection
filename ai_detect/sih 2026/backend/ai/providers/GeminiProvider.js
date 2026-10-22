import { AIProvider } from './AIProvider.js'
import { fasalGuruAIConfig } from '../config.js'

export class GeminiProvider extends AIProvider {
  constructor() {
    super('Gemini')
    this.apiKey = fasalGuruAIConfig.gemini.apiKey
    this.endpointBase = fasalGuruAIConfig.gemini.endpointBase
    this.models = {
      primary: fasalGuruAIConfig.gemini.primary,
      fast: fasalGuruAIConfig.gemini.fast
    }
  }

  getModel(moduleKey = 'primary') {
    return this.models[moduleKey] || this.models.primary
  }

  async _request(model, payload, timeoutMs = 25000) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on server.')
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    const url = `${this.endpointBase}/${model}:generateContent?key=${encodeURIComponent(this.apiKey)}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      const data = await response.json()

      if (!response.ok) {
        const errMsg = data?.error?.message || `Gemini request failed with HTTP ${response.status}`
        const errStatus = data?.error?.status || `HTTP_${response.status}`
        const error = new Error(`Gemini [${errStatus}]: ${errMsg}`)
        error.code = errStatus
        error.status = response.status
        error.raw = data
        throw error
      }

      return data
    } finally {
      clearTimeout(timer)
    }
  }

  async generateText({ prompt, systemPrompt, temperature = 0.3, maxTokens = 1500, history = [], moduleKey = 'primary' }) {
    const model = this.getModel(moduleKey)
    const contents = []

    // Map history to Gemini format (role: 'user' | 'model')
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: h.text }] })
        } else if (h.sender === 'ai') {
          contents.push({ role: 'model', parts: [{ text: h.text }] })
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: prompt }] })

    const payload = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens
      }
    }

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      }
    }

    const res = await this._request(model, payload)
    const text = res.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return {
      provider: 'Gemini',
      module: moduleKey,
      model,
      text: text.trim(),
      usage: res.usageMetadata
    }
  }

  async analyzeImage({ prompt, images = [], systemPrompt, moduleKey = 'primary' }) {
    const model = this.getModel(moduleKey)
    const parts = []

    for (const img of images) {
      const mime = img.mimeType || 'image/jpeg'
      const base64Data = img.base64?.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '') || ''
      parts.push({
        inlineData: {
          mimeType: mime,
          data: base64Data
        }
      })
    }

    parts.push({ text: prompt || 'Analyze this agricultural image in detail.' })

    const payload = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1500
      }
    }

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      }
    }

    const res = await this._request(model, payload)
    const text = res.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return {
      provider: 'Gemini',
      module: moduleKey,
      model,
      text: text.trim(),
      usage: res.usageMetadata
    }
  }

  async analyzeDocument({ prompt, docText, docBuffer, mimeType = 'application/pdf', systemPrompt, moduleKey = 'primary' }) {
    const model = this.getModel(moduleKey)
    const parts = []

    // If we have raw base64 buffer of the document, send as native inlineData part
    if (docBuffer) {
      const base64Pdf = typeof docBuffer === 'string'
        ? docBuffer.replace(/^data:application\/pdf;base64,/, '')
        : docBuffer.toString('base64')

      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Pdf
        }
      })
      parts.push({ text: prompt || 'Read and analyze this agricultural document thoroughly.' })
    } else if (docText) {
      parts.push({
        text: `Agricultural Document Content:\n---\n${docText.slice(0, 15000)}\n---\n\nFarmer Query:\n${prompt}`
      })
    }

    const payload = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1500
      }
    }

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      }
    }

    const res = await this._request(model, payload)
    const text = res.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return {
      provider: 'Gemini',
      module: moduleKey,
      model,
      text: text.trim(),
      usage: res.usageMetadata
    }
  }

  async healthCheck(moduleKey = 'primary') {
    const startTime = Date.now()
    if (!this.apiKey) {
      return {
        ok: false,
        status: 'FAIL',
        module: moduleKey,
        model: this.getModel(moduleKey),
        error: 'GEMINI_API_KEY is missing from environment.'
      }
    }

    try {
      const res = await this.generateText({
        prompt: '1+1=',
        maxTokens: 5,
        moduleKey
      })

      return {
        ok: true,
        status: 'PASS',
        module: moduleKey,
        model: res.model,
        latencyMs: Date.now() - startTime
      }
    } catch (err) {
      return {
        ok: false,
        status: 'FAIL',
        module: moduleKey,
        model: this.getModel(moduleKey),
        latencyMs: Date.now() - startTime,
        error: err.message,
        code: err.code || err.status || 'ERROR'
      }
    }
  }
}

export default GeminiProvider
