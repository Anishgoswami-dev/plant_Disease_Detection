/**
 * 🧠 Backboard.io Persistent AI Memory Service
 * Manages assistant-level long-term memory and thread continuity for Fasal Dristhi.
 *
 * Official API Spec:
 * Base URL: https://app.backboard.io/api
 * Auth Header: X-API-Key: <BACKBOARD_API_KEY>
 * Create Assistant: POST /assistants { name, system_prompt }
 * Send Message: POST /threads/messages { content, assistant_id, thread_id, memory: "Auto" }
 * List Memories: GET /assistants/{assistant_id}/memories
 */
export class BackboardMemoryService {
  constructor({ apiKey = process.env.BACKBOARD_API_KEY, baseUrl = 'https://app.backboard.io/api', timeoutMs = 8000 } = {}) {
    this.apiKey = apiKey || ''
    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.timeoutMs = timeoutMs
    // Local in-memory mapping cache: farmerId -> { assistantId, activeThreadId, memoriesCache, updatedAt }
    this.memoryCache = new Map()
  }

  /**
   * Check if Backboard API is configured
   */
  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10)
  }

  /**
   * Safe fetch wrapper with timeout and error protection
   */
  async _request(endpoint, { method = 'GET', body = null } = {}) {
    if (!this.isConfigured()) {
      return { ok: false, status: 0, error: 'BACKBOARD_NOT_CONFIGURED' }
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const headers = {
        'X-API-Key': this.apiKey.trim(),
        'Content-Type': 'application/json'
      }

      const options = {
        method,
        headers,
        signal: controller.signal
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
      const response = await fetch(url, options)
      clearTimeout(timeout)

      let data = null
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        data = await response.json().catch(() => null)
      } else {
        const text = await response.text().catch(() => '')
        data = { text }
      }

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: data?.detail || data?.error || `HTTP ${response.status}`,
          data
        }
      }

      return { ok: true, status: response.status, data }
    } catch (err) {
      clearTimeout(timeout)
      const isTimeout = err.name === 'AbortError'
      return {
        ok: false,
        status: isTimeout ? 408 : 500,
        error: isTimeout ? 'Request timed out' : err.message
      }
    }
  }

  /**
   * Get or create a Backboard Assistant for an authenticated farmer.
   * Isolates memories per farmer so Farmer A can never see Farmer B's data.
   */
  async getOrCreateAssistant(farmerId, { mappingModel = null, farmerDetails = {} } = {}) {
    if (!this.isConfigured()) return null
    const safeFarmerId = String(farmerId || 'default_farmer').trim()

    // 1. Check in-memory cache first
    const cached = this.memoryCache.get(safeFarmerId)
    if (cached?.assistantId) {
      return cached
    }

    // 2. Check MongoDB Atlas if model is provided
    if (mappingModel) {
      try {
        const existing = await mappingModel.findOne({ farmerId: safeFarmerId })
        if (existing?.assistantId) {
          const mapping = {
            farmerId: safeFarmerId,
            assistantId: existing.assistantId,
            activeThreadId: existing.activeThreadId || null
          }
          this.memoryCache.set(safeFarmerId, mapping)
          return mapping
        }
      } catch (dbErr) {
        console.warn('[Backboard] MongoDB lookup warning:', dbErr.message)
      }
    }

    // 3. Create a new Assistant on Backboard.io
    const name = `Fasal Dristhi Farmer ${safeFarmerId.slice(-8)}`
    const system_prompt = `You are Fasal Guru's persistent agricultural memory for farmer "${safeFarmerId}".
Remember user's crops, acreage, location, past diseases, soil types, and farming preferences across sessions.
Never invent crop disease diagnoses; maintain factual farmer context.`

    const res = await this._request('/assistants', {
      method: 'POST',
      body: { name, system_prompt }
    })

    if (!res.ok || !res.data?.assistant_id) {
      console.warn('[Backboard] Failed to create assistant:', res.error)
      return null
    }

    const assistantId = res.data.assistant_id
    const mapping = {
      farmerId: safeFarmerId,
      assistantId,
      activeThreadId: null
    }

    this.memoryCache.set(safeFarmerId, mapping)

    // Persist in MongoDB
    if (mappingModel) {
      try {
        await mappingModel.findOneAndUpdate(
          { farmerId: safeFarmerId },
          { farmerId: safeFarmerId, assistantId, activeThreadId: null, lastUsedAt: new Date() },
          { upsert: true, new: true }
        )
      } catch (dbErr) {
        console.warn('[Backboard] MongoDB upsert warning:', dbErr.message)
      }
    }

    return mapping
  }

  /**
   * Retrieve stored memories for a farmer's assistant
   */
  async getMemories(farmerId, { mappingModel = null } = {}) {
    if (!this.isConfigured()) return []
    const mapping = await this.getOrCreateAssistant(farmerId, { mappingModel })
    if (!mapping?.assistantId) return []

    const res = await this._request(`/assistants/${mapping.assistantId}/memories`, { method: 'GET' })
    if (!res.ok || !res.data) {
      return []
    }

    // Normalize memories list from API
    let memories = []
    if (Array.isArray(res.data)) {
      memories = res.data
    } else if (Array.isArray(res.data.memories)) {
      memories = res.data.memories
    } else if (Array.isArray(res.data.items)) {
      memories = res.data.items
    }

    return memories
  }

  /**
   * Format persistent memories into prompt context for Gemini / OpenAI
   */
  formatMemoryContext(memories = []) {
    if (!Array.isArray(memories) || memories.length === 0) return ''

    const facts = memories.map((m, idx) => {
      if (typeof m === 'string') return `• ${m}`
      if (m?.content) return `• ${m.content}`
      if (m?.fact) return `• ${m.fact}`
      if (m?.text) return `• ${m.text}`
      return null
    }).filter(Boolean)

    if (facts.length === 0) return ''

    return `[FARMER PERSISTENT MEMORY (Recalled from previous sessions)]:
${facts.join('\n')}
(Use this context to provide personalized, continuous advice regarding farmer's crops, location, or past conditions. Do not repeat raw notes directly.)`
  }

  /**
   * Record a conversation turn into Backboard thread with memory="Auto"
   * to automatically extract persistent facts.
   */
  async recordConversationTurn({
    farmerId,
    userMessage,
    assistantReply = '',
    crop = '',
    mappingModel = null
  }) {
    if (!this.isConfigured() || !userMessage?.trim()) return null
    const safeFarmerId = String(farmerId || 'default_farmer').trim()
    const mapping = await this.getOrCreateAssistant(safeFarmerId, { mappingModel })
    if (!mapping?.assistantId) return null

    const payload = {
      content: crop ? `[Crop: ${crop}] ${userMessage}` : userMessage,
      assistant_id: mapping.assistantId,
      memory: 'Auto'
    }

    if (mapping.activeThreadId) {
      payload.thread_id = mapping.activeThreadId
    }

    const res = await this._request('/threads/messages', {
      method: 'POST',
      body: payload
    })

    if (!res.ok || !res.data) {
      console.warn('[Backboard] Record turn warning:', res.error)
      return null
    }

    const threadId = res.data.thread_id || mapping.activeThreadId
    if (threadId && threadId !== mapping.activeThreadId) {
      mapping.activeThreadId = threadId
      this.memoryCache.set(safeFarmerId, mapping)

      if (mappingModel) {
        try {
          await mappingModel.findOneAndUpdate(
            { farmerId: safeFarmerId },
            { activeThreadId: threadId, lastUsedAt: new Date() }
          )
        } catch {}
      }
    }

    return {
      threadId,
      assistantId: mapping.assistantId,
      reply: res.data.content || ''
    }
  }

  /**
   * Health and status check
   */
  async getStatus() {
    if (!this.isConfigured()) {
      return {
        configured: false,
        status: 'UNCONFIGURED',
        message: 'BACKBOARD_API_KEY is not set in backend/.env'
      }
    }

    const res = await this._request('/assistants?limit=1', { method: 'GET' })
    return {
      configured: true,
      status: res.ok ? 'HEALTHY' : 'ERROR',
      statusCode: res.status,
      error: res.ok ? null : res.error
    }
  }
}

export const backboardService = new BackboardMemoryService()
export default backboardService
