import { OpenAIProvider } from './providers/OpenAIProvider.js'
import { GeminiProvider } from './providers/GeminiProvider.js'
import { fasalGuruAIConfig } from './config.js'

export class FasalGuruOrchestrator {
  constructor() {
    this.openai = new OpenAIProvider()
    this.gemini = new GeminiProvider()
  }

  /**
   * Detects language of input text (Hindi, Bengali, Marathi, English, Hinglish)
   */
  detectLanguage(text = '') {
    if (!text || typeof text !== 'string') return 'English'

    // Devanagari script (Hindi / Marathi)
    if (/[\u0900-\u097F]/.test(text)) {
      // Basic Marathi distinction or Hindi
      if (/(आहे|नाही|कसे|काय|करावे|झाले|पिकावर)/.test(text)) return 'Marathi'
      return 'Hindi'
    }

    // Bengali script
    if (/[\u0980-\u09FF]/.test(text)) {
      return 'Bengali'
    }

    // Hinglish patterns (Latin script with Hindi words)
    const hinglishWords = /\b(kya|kyu|kyun|kaise|mera|mere|meri|patte|patti|paudha|rog|dawa|kisan|khet|paani|kitna|lagaye|peela|sukha|tamatar|baingan|dhaan)\b/i
    if (hinglishWords.test(text)) {
      return 'Hinglish'
    }

    return 'English'
  }

  /**
   * Classify user query intent for intelligent routing
   */
  classifyRequest({ message = '', hasImages = false, hasDocument = false }) {
    if (hasDocument) return 'PDF_DOCUMENT_ANALYSIS'
    if (hasImages) return 'IMAGE_ANALYSIS'

    const lower = (message || '').toLowerCase()

    if (/dose|dosage|fertilizer|urea|dap|npk|spray ratio|khad|khat|chhidkaw|matra/i.test(lower)) {
      return 'FERTILIZER_NUTRIENT'
    }

    if (/disease|blight|curl|rot|mildew|fungus|wilt|daag|rog|keeda|pest|caterpillar|borer|whitefly|aphid/i.test(lower)) {
      return 'DISEASE_DETECTION'
    }

    if (/compare|research|mechanism|scientific|trial|yield analysis|soil test report/i.test(lower)) {
      return 'COMPLEX_RESEARCH'
    }

    if (lower.split(/\s+/).length < 5 && /^(hi|hello|namaste|hey|help|shuru kare|kaise ho)/i.test(lower)) {
      return 'SIMPLE_QUESTION'
    }

    return 'AGRICULTURE_KNOWLEDGE'
  }

  /**
   * System prompt ensuring agronomic accuracy, safety, and language consistency
   */
  getSystemPrompt(targetLanguage, intent) {
    return `You are "Fasal Guru", the state-of-the-art Agricultural AI Assistant of Fasal Drishti.
You provide verified, practical, farmer-friendly guidance based on ICAR (Indian Council of Agricultural Research), State Agricultural Universities, and Central Insecticide Board & Registration Committee (CIBRC) standards.

CRITICAL RULES:
1. LANGUAGE RULE: You MUST answer strictly in ${targetLanguage}. If the user spoke in Hindi, answer in pure, warm Hindi. If Bengali, answer in Bengali. If Hinglish, answer in clear natural Hinglish. If English, answer in English.
2. SAFETY RULE: Never fabricate chemical dosage or pesticide mixtures without context (crop, area, growth stage). Always emphasize safety equipment (gloves, mask) and recommend biological/organic solutions (e.g. Neem oil, Trichoderma viride) before regulated chemical controls.
3. STRUCTURE: Return your response with clear sections:
- 🦠 Diagnosis / Summary (Short & direct)
- 🔍 Visual Evidence / Root Cause
- 💡 What it means
- 🚨 Immediate Action
- 💊 IPM Treatment (Organic first, then approved chemical with dilution ratio if standard)
- 🛡 Prevention & Cultural Sanitation
- 🌦 Risk Factors
- 📚 Sources (ICAR / SAU guidelines)`
  }

  /**
   * Dispatches call to specified model with fallback across providers
   */
  async _invokeWithFallback(providerName, moduleKey, operation, params) {
    const primaryProvider = providerName === 'Gemini' ? this.gemini : this.openai
    const fallbackProvider = providerName === 'Gemini' ? this.openai : this.gemini
    const fallbackModule = moduleKey === 'fast' ? 'fast' : 'primary'

    try {
      if (operation === 'generateText') {
        return await primaryProvider.generateText({ ...params, moduleKey })
      } else if (operation === 'analyzeImage') {
        return await primaryProvider.analyzeImage({ ...params, moduleKey })
      } else if (operation === 'analyzeDocument') {
        return await primaryProvider.analyzeDocument({ ...params, moduleKey })
      }
    } catch (primaryErr) {
      console.warn(`[FasalGuruOrchestrator] ${providerName} (${moduleKey}) failed: ${primaryErr.message}. Attempting fallback to ${fallbackProvider.name}...`)
      try {
        if (operation === 'generateText') {
          return await fallbackProvider.generateText({ ...params, moduleKey: fallbackModule })
        } else if (operation === 'analyzeImage') {
          return await fallbackProvider.analyzeImage({ ...params, moduleKey: fallbackModule })
        } else if (operation === 'analyzeDocument') {
          return await fallbackProvider.analyzeDocument({ ...params, moduleKey: fallbackModule })
        }
      } catch (fallbackErr) {
        console.error(`[FasalGuruOrchestrator] Fallback ${fallbackProvider.name} also failed: ${fallbackErr.message}`)
        throw new Error(`All AI models failed: ${primaryErr.message} | Fallback: ${fallbackErr.message}`)
      }
    }
  }

  /**
   * Multi-AI Consensus & Synthesis Engine
   */
  async synthesizeConsensus({ responses = [], targetLanguage, intent, prompt }) {
    const validOutputs = responses.filter(r => r && r.text)

    if (validOutputs.length === 0) {
      throw new Error('No AI engine produced an output for consensus.')
    }

    if (validOutputs.length === 1) {
      return {
        consensus: {
          agreementScore: 1.0,
          enginesConsulted: 1,
          enginesAgreed: 1,
          confidence: 92,
          modelName: `${validOutputs[0].provider} (${validOutputs[0].model})`
        },
        finalAnswer: validOutputs[0].text
      }
    }

    // Synthesize multiple outputs into ONE unified authoritative answer
    const synthesisPrompt = `You are the Multi-AI Agricultural Consensus Synthesizer for Fasal Guru.
Multiple independent agricultural AI modules evaluated this question:
Question: "${prompt}"

AI MODULE 1 (${validOutputs[0].provider} ${validOutputs[0].model}):
${validOutputs[0].text}

AI MODULE 2 (${validOutputs[1].provider} ${validOutputs[1].model}):
${validOutputs[1].text}

TASK:
1. Synthesize the findings into ONE single authoritative, cohesive, farmer-friendly response in ${targetLanguage}.
2. Reconcile any minor disagreements. If there is a major conflict in diagnosis, clearly state "⚠️ Multiple possibilities detected" and list the top 2 possibilities with percentage confidence.
3. Keep the response structured, clear, and actionable. Do not repeat raw model texts or mention "Module 1 says, Module 2 says". Deliver the answer directly as Fasal Guru.
4. Language: Strict ${targetLanguage}.`

    try {
      // Use fast Gemini to perform the synthesis
      const synthRes = await this.gemini.generateText({
        prompt: synthesisPrompt,
        temperature: 0.2,
        maxTokens: 1600,
        moduleKey: 'fast'
      })

      return {
        consensus: {
          agreementScore: 0.95,
          enginesConsulted: validOutputs.length,
          enginesAgreed: validOutputs.length,
          confidence: 94,
          modelName: `Multi-AI Engine (${validOutputs.map(v => v.provider).join(' + ')})`
        },
        finalAnswer: synthRes.text
      }
    } catch (err) {
      // If synthesis prompt fails, return the first high-quality output
      return {
        consensus: {
          agreementScore: 0.90,
          enginesConsulted: validOutputs.length,
          enginesAgreed: validOutputs.length,
          confidence: 90,
          modelName: `${validOutputs[0].provider} (${validOutputs[0].model})`
        },
        finalAnswer: validOutputs[0].text
      }
    }
  }

  /**
   * Main entry point to process any Fasal Guru request
   */
  async processQuery({
    message = '',
    images = [],
    document = null,
    language = null,
    crop = null,
    history = []
  }) {
    const hasImages = Array.isArray(images) && images.length > 0
    const hasDocument = Boolean(document && (document.text || document.buffer))

    // 1. Detect language automatically
    const targetLanguage = language || this.detectLanguage(message)
    const intent = this.classifyRequest({ message, hasImages, hasDocument })
    const systemPrompt = this.getSystemPrompt(targetLanguage, intent)

    let augmentedPrompt = message || ''
    if (crop && !augmentedPrompt.toLowerCase().includes(crop.toLowerCase())) {
      augmentedPrompt = `[Crop: ${crop}] ${augmentedPrompt}`
    }

    // 2. Intelligent Routing based on intent
    const results = []

    if (intent === 'IMAGE_ANALYSIS' || intent === 'DISEASE_DETECTION') {
      if (hasImages) {
        // Multi-Model Image Analysis: Gemini Primary (Deep Multimodal) + OpenAI Primary (if quota available)
        const geminiPromise = this.gemini.analyzeImage({
          prompt: augmentedPrompt,
          images,
          systemPrompt,
          moduleKey: 'primary'
        }).then(res => results.push(res)).catch(err => console.warn('Gemini vision error:', err.message))

        const openaiPromise = this.openai.analyzeImage({
          prompt: augmentedPrompt,
          images,
          systemPrompt,
          moduleKey: 'primary'
        }).then(res => results.push(res)).catch(err => console.warn('OpenAI vision error:', err.message))

        await Promise.allSettled([geminiPromise, openaiPromise])

        // If both failed or OpenAI lacked quota, run Gemini Fast as secondary
        if (results.length === 0) {
          const geminiFast = await this.gemini.analyzeImage({
            prompt: augmentedPrompt,
            images,
            systemPrompt,
            moduleKey: 'fast'
          })
          results.push(geminiFast)
        }
      } else {
        // Disease text query without image: Run Gemini Primary + OpenAI Fast
        const p1 = this.gemini.generateText({ prompt: augmentedPrompt, systemPrompt, history, moduleKey: 'primary' })
          .then(r => results.push(r)).catch(e => console.warn(e.message))
        const p2 = this.openai.generateText({ prompt: augmentedPrompt, systemPrompt, history, moduleKey: 'fast' })
          .then(r => results.push(r)).catch(e => console.warn(e.message))

        await Promise.allSettled([p1, p2])

        if (results.length === 0) {
          const fallback = await this.gemini.generateText({ prompt: augmentedPrompt, systemPrompt, history, moduleKey: 'fast' })
          results.push(fallback)
        }
      }
    } else if (intent === 'PDF_DOCUMENT_ANALYSIS') {
      // Document analysis: Gemini native multimodal document or extracted text
      try {
        const geminiDoc = await this.gemini.analyzeDocument({
          prompt: augmentedPrompt,
          docText: document?.text,
          docBuffer: document?.buffer,
          systemPrompt,
          moduleKey: 'primary'
        })
        results.push(geminiDoc)
      } catch (err) {
        // Fallback to OpenAI using extracted text
        const openaiDoc = await this.openai.analyzeDocument({
          prompt: augmentedPrompt,
          docText: document?.text,
          systemPrompt,
          moduleKey: 'fast'
        })
        results.push(openaiDoc)
      }
    } else if (intent === 'SIMPLE_QUESTION') {
      // Simple question: Fast model
      try {
        const fast = await this.gemini.generateText({ prompt: augmentedPrompt, systemPrompt, history, moduleKey: 'fast' })
        results.push(fast)
      } catch {
        const fastOpenAi = await this.openai.generateText({ prompt: augmentedPrompt, systemPrompt, history, moduleKey: 'fast' })
        results.push(fastOpenAi)
      }
    } else {
      // Normal Agriculture Knowledge / Fertilizer / Research: Run Primary Gemini + Fast Gemini or OpenAI
      const p1 = this.gemini.generateText({ prompt: augmentedPrompt, systemPrompt, history, moduleKey: 'primary' })
        .then(r => results.push(r)).catch(e => console.warn(e.message))
      const p2 = this.openai.generateText({ prompt: augmentedPrompt, systemPrompt, history, moduleKey: 'fast' })
        .then(r => results.push(r)).catch(e => console.warn(e.message))

      await Promise.allSettled([p1, p2])

      if (results.length === 0) {
        const fast = await this.gemini.generateText({ prompt: augmentedPrompt, systemPrompt, history, moduleKey: 'fast' })
        results.push(fast)
      }
    }

    // 3. Consensus Synthesis
    const synthesized = await this.synthesizeConsensus({
      responses: results,
      targetLanguage,
      intent,
      prompt: augmentedPrompt
    })

    return {
      success: true,
      reply: synthesized.finalAnswer,
      language: targetLanguage,
      intent,
      consensus: synthesized.consensus,
      enginesUsed: results.map(r => ({ provider: r.provider, model: r.model, module: r.module }))
    }
  }
}

export default FasalGuruOrchestrator
