import type { VercelRequest, VercelResponse } from '@vercel/node'
import { suggestInterviewQuestions, type SuggestQuestionsInput } from './aiSuggestQuestions.js'
import { requireAuth } from './session.js'

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item || '').trim()).filter(Boolean)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = parseBody(req)
    const scope = body.scope === 'production' ? 'production' : 'guest'
    const productionName = String(body.productionName || '').trim()

    if (!productionName) {
      res.status(400).json({ error: 'Production name is required' })
      return
    }

    const input: SuggestQuestionsInput = {
      scope,
      productionName,
      productionDate: String(body.productionDate || '').trim() || undefined,
      productionContext: String(body.productionContext || '').trim() || undefined,
      guestType: String(body.guestType || '').trim() || undefined,
      name: String(body.name || '').trim() || undefined,
      role: String(body.role || '').trim() || undefined,
      planning: String(body.planning || '').trim() || undefined,
      productionDefaults: asStringArray(body.productionDefaults),
      language: body.language === 'en' ? 'en' : 'nl',
    }

    if (scope === 'guest' && !String(body.name || '').trim()) {
      res.status(400).json({ error: 'Guest name is required' })
      return
    }

    const result = await suggestInterviewQuestions(input)
    res.status(200).json(result)
  } catch (err) {
    console.error('interview suggest-questions error:', err)
    const message = err instanceof Error ? err.message : 'AI suggestion failed'
    res.status(500).json({ error: message })
  }
}
