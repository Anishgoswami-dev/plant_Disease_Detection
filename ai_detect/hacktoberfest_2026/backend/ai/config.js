import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

// Fasal Guru Multi-Model AI Assistant Configuration
export const fasalGuruAIConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    primary: process.env.OPENAI_MODEL_PRIMARY || 'gpt-4o',
    fast: process.env.OPENAI_MODEL_FAST || 'gpt-4o-mini',
    secondary: process.env.OPENAI_MODEL_SECONDARY || 'gpt-3.5-turbo',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelsEndpoint: 'https://api.openai.com/v1/models',
    timeoutMs: 20000
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    primary: process.env.GEMINI_MODEL_PRIMARY || 'gemini-3.6-flash',
    fast: process.env.GEMINI_MODEL_FAST || 'gemini-3.8-flash',
    endpointBase: 'https://generativelanguage.googleapis.com/v1beta/models',
    timeoutMs: 25000
  },
  thresholds: {
    highConfidence: 0.85,
    minConsensusAgreement: 0.6,
    maxImageTokens: 1500,
    maxPdfTextTokens: 4000
  },
  supportedLanguages: ['English', 'Hindi', 'Bengali', 'Marathi', 'Hinglish']
}

export default fasalGuruAIConfig
