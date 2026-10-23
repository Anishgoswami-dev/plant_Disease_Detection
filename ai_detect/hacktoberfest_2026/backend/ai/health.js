import { OpenAIProvider } from './providers/OpenAIProvider.js'
import { GeminiProvider } from './providers/GeminiProvider.js'

export async function runAIHealthCheck() {
  const openai = new OpenAIProvider()
  const gemini = new GeminiProvider()

  // Run health checks in parallel
  const [gptPrimary, gptFast, gptSecondary, geminiPrimary, geminiFast] = await Promise.allSettled([
    openai.healthCheck('primary'),
    openai.healthCheck('fast'),
    openai.healthCheck('secondary'),
    gemini.healthCheck('primary'),
    gemini.healthCheck('fast')
  ])

  const results = {
    timestamp: new Date().toISOString(),
    overallStatus: 'UNKNOWN',
    providers: {
      openai: {
        status: 'FAIL',
        modules: {
          primary: gptPrimary.status === 'fulfilled' ? gptPrimary.value : { ok: false, error: gptPrimary.reason?.message },
          fast: gptFast.status === 'fulfilled' ? gptFast.value : { ok: false, error: gptFast.reason?.message },
          secondary: gptSecondary.status === 'fulfilled' ? gptSecondary.value : { ok: false, error: gptSecondary.reason?.message }
        }
      },
      gemini: {
        status: 'FAIL',
        modules: {
          primary: geminiPrimary.status === 'fulfilled' ? geminiPrimary.value : { ok: false, error: geminiPrimary.reason?.message },
          fast: geminiFast.status === 'fulfilled' ? geminiFast.value : { ok: false, error: geminiFast.reason?.message }
        }
      }
    }
  }

  // Provider level status
  const openaiOk = Object.values(results.providers.openai.modules).some(m => m.ok)
  results.providers.openai.status = openaiOk ? 'PASS' : 'FAIL'

  const geminiOk = Object.values(results.providers.gemini.modules).some(m => m.ok)
  results.providers.gemini.status = geminiOk ? 'PASS' : 'FAIL'

  results.overallStatus = (openaiOk || geminiOk) ? 'OPERATIONAL' : 'DEGRADED'

  return results
}

export default runAIHealthCheck
