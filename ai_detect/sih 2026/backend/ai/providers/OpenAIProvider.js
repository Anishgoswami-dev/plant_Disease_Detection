import { AIProvider } from './AIProvider.js'
import { fasalGuruAIConfig } from '../config.js'

export class OpenAIProvider extends AIProvider {
  constructor() {
    super('OpenAI')
    this.apiKey = fasalGuruAIConfig.openai.apiKey
    this.endpoint = fasalGuruAIConfig.openai.endpoint
    this.modelsEndpoint = fasalGuruAIConfig.openai.modelsEndpoint
    this.models = {
      primary: fasalGuruAIConfig.openai.primary,
      fast: fasalGuruAIConfig.openai.fast,
      secondary: fasalGuruAIConfig.openai.secondary
    }
    this.quotaExhaustedUntil = 0
    this.lastQuotaError = null
  }

  getModel(moduleKey = 'primary') {
    return this.models[moduleKey] || this.models.primary
  }

  async _request(payload, timeoutMs = 25000, bypassQuotaCache = false) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured on server.')
    }

    if (!bypassQuotaCache && Date.now() < this.quotaExhaustedUntil) {
      const cachedErr = new Error(`OpenAI [credit_balance_exhausted]: ${this.lastQuotaError || 'You have no credits remaining.'}`)
      cachedErr.code = 'credit_balance_exhausted'
      cachedErr.status = 429
      throw cachedErr
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      const data = await response.json()

      if (!response.ok) {
        const errMsg = data?.error?.message || `OpenAI request failed with HTTP ${response.status}`
        const errType = data?.error?.code || data?.error?.type || 'API_ERROR'
        if (errType === 'credit_balance_exhausted' || response.status === 429) {
          this.quotaExhaustedUntil = Date.now() + 60000 // Cache for 60s
          this.lastQuotaError = errMsg
        }
        const error = new Error(`OpenAI [${errType}]: ${errMsg}`)
        error.code = errType
        error.status = response.status
        error.raw = data
        throw error
      }

      this.quotaExhaustedUntil = 0
      return data
    } finally {
      clearTimeout(timer)
    }
  }

  async generateText({ prompt, systemPrompt, temperature = 0.3, maxTokens = 1200, history = [], moduleKey = 'primary' }) {
    const model = this.getModel(moduleKey)
    const messages = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.sender === 'user') messages.push({ role: 'user', content: h.text })
        else if (h.sender === 'ai') messages.push({ role: 'assistant', content: h.text })
      }
    }

    messages.push({ role: 'user', content: prompt })

    const res = await this._request({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    })

    const reply = res.choices?.[0]?.message?.content || ''
    return {
      provider: 'OpenAI',
      module: moduleKey,
      model,
      text: reply.trim(),
      usage: res.usage
    }
  }

  async analyzeImage({ prompt, images = [], systemPrompt, moduleKey = 'primary' }) {
    // OpenAI vision requires gpt-4o or gpt-4o-mini
    const model = moduleKey === 'secondary' ? this.models.fast : this.getModel(moduleKey)
    const messages = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    const userContent = [{ type: 'text', text: prompt || 'Analyze this crop image in detail.' }]

    for (const img of images) {
      const mime = img.mimeType || 'image/jpeg'
      const base64Data = img.base64?.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '') || ''
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:${mime};base64,${base64Data}`,
          detail: 'high'
        }
      })
    }

    messages.push({ role: 'user', content: userContent })

    const res = await this._request({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 1500
    })

    return {
      provider: 'OpenAI',
      module: moduleKey,
      model,
      text: res.choices?.[0]?.message?.content?.trim() || '',
      usage: res.usage
    }
  }

  async analyzeDocument({ prompt, docText, systemPrompt, moduleKey = 'primary' }) {
    const model = this.getModel(moduleKey)
    const fullPrompt = `Below is an excerpt of an agricultural document / research material:\n\n---\n${docText?.slice(0, 12000)}\n---\n\nUser Question:\n${prompt}`

    return this.generateText({
      prompt: fullPrompt,
      systemPrompt: systemPrompt || 'You are an agricultural expert analyzing verified research documents. Ground your answer strictly in the document text.',
      moduleKey,
      maxTokens: 1500
    })
  }

  async healthCheck(moduleKey = 'primary') {
    const startTime = Date.now()
    if (!this.apiKey) {
      return {
        ok: false,
        status: 'FAIL',
        module: moduleKey,
        model: this.getModel(moduleKey),
        error: 'OPENAI_API_KEY is missing from environment.'
      }
    }

    try {
      // Test generation with short prompt
      const res = await this.generateText({
        prompt: 'Ping',
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

export default OpenAIProvider
