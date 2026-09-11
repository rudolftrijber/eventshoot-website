import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRequestIp, isClient } from './auth.js'
import { suggestInterviewQuestions, type SuggestQuestionsInput } from './aiSuggestQuestions.js'
import { ensureSchema, fetchProducties } from './database.js'
import { productionNameAllowed, requireLogin } from './permissions.js'
import {
  clipText,
  MAX_LONG_TEXT,
  MAX_MEDIUM_TEXT,
  MAX_SHORT_TEXT,
  sanitizeQuestions,
} from './sanitize.js'
import { consumeRateLimit, rateLimited } from './rateLimit.js'

const AI_MAX_HITS = 20
const AI_WINDOW_MS = 60 * 60 * 1000

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

function asStringArray(value: unknown): string[] {
  return sanitizeQuestions(value)
}

function publicAiError(err: unknown): string {
  const message = err instanceof Error ? err.message : ''
  if (/credit balance|too low/i.test(message)) return 'AI is temporarily unavailable. Try again later.'
  if (/api key|authentication|ANTHROPIC/i.test(message)) return 'AI is not available right now.'
  if (/could not be parsed|empty response|no questions|not configured/i.test(message)) {
    return 'AI suggestion failed. Try again, or write the questions yourself.'
  }
  return 'AI suggestion failed'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ctx = await requireLogin(req, res)
  if (!ctx) return

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const ip = getRequestIp(req)
    const roleKey = ctx.role || 'unknown'
    const limit = await consumeRateLimit(`ai:${roleKey}:${ip}`, AI_MAX_HITS, AI_WINDOW_MS)
    if (!limit.ok) {
      rateLimited(res, limit.retryAfterSec, 'AI limit reached. Try again later.')
      return
    }

    const body = parseBody(req)
    const scope = body.scope === 'production' ? 'production' : 'guest'
    const productionName = clipText(body.productionName, MAX_SHORT_TEXT)

    if (!productionName) {
      res.status(400).json({ error: 'Production name is required' })
      return
    }

    if (isClient(ctx)) {
      await ensureSchema()
      const productions = await fetchProducties(true)
      if (!productionNameAllowed(ctx, productions, productionName)) {
        res.status(403).json({ error: 'Production not allowed' })
        return
      }
    }

    const prepRaw = body.prepAnswers
    const prepAnswers = prepRaw && typeof prepRaw === 'object'
      ? {
          sector: clipText((prepRaw as Record<string, unknown>).sector, MAX_MEDIUM_TEXT),
          specialism: clipText((prepRaw as Record<string, unknown>).specialism, MAX_MEDIUM_TEXT),
          timeliness: clipText((prepRaw as Record<string, unknown>).timeliness, MAX_MEDIUM_TEXT),
          customPrompt: clipText((prepRaw as Record<string, unknown>).customPrompt, MAX_LONG_TEXT),
        }
      : undefined

    if (!prepAnswers?.sector || !prepAnswers.specialism || !prepAnswers.timeliness) {
      if (!prepAnswers?.customPrompt) {
        res.status(400).json({ error: 'Fill the 3 briefing fields, or write your own prompt' })
        return
      }
    }

    const input: SuggestQuestionsInput = {
      scope,
      productionName,
      productionDate: clipText(body.productionDate, 20) || undefined,
      productionContext: clipText(body.productionContext, MAX_MEDIUM_TEXT) || undefined,
      guestType: clipText(body.guestType, 40) || undefined,
      name: clipText(body.name, MAX_SHORT_TEXT) || undefined,
      role: clipText(body.role, MAX_SHORT_TEXT) || undefined,
      organization: clipText(body.organization, MAX_SHORT_TEXT) || undefined,
      planning: clipText(body.planning, MAX_MEDIUM_TEXT) || undefined,
      productionDefaults: asStringArray(body.productionDefaults),
      prepAnswers,
      language: body.language === 'en' ? 'en' : 'nl',
      addressForm: body.addressForm === 'jij' ? 'jij' : 'u',
    }

    if (scope === 'guest' && !clipText(body.name, MAX_SHORT_TEXT)) {
      res.status(400).json({ error: 'Guest name is required' })
      return
    }

    const result = await suggestInterviewQuestions(input)
    res.status(200).json(result)
  } catch (err) {
    console.error('interview suggest-questions error:', err)
    res.status(500).json({ error: publicAiError(err) })
  }
}
