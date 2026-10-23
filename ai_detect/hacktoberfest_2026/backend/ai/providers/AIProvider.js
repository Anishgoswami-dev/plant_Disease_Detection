/**
 * AIProvider Base Class
 * Standardizes calls across OpenAI, Gemini, and future providers.
 */
export class AIProvider {
  constructor(name) {
    this.name = name
  }

  async generateText({ prompt, systemPrompt, temperature, maxTokens, history }) {
    throw new Error(`generateText not implemented for provider ${this.name}`)
  }

  async analyzeImage({ prompt, images, systemPrompt }) {
    throw new Error(`analyzeImage not implemented for provider ${this.name}`)
  }

  async analyzeDocument({ prompt, docText, docBuffer, mimeType, systemPrompt }) {
    throw new Error(`analyzeDocument not implemented for provider ${this.name}`)
  }

  async healthCheck() {
    throw new Error(`healthCheck not implemented for provider ${this.name}`)
  }
}

export default AIProvider
