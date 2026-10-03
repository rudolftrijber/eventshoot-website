import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRequestIp } from './auth.js'
import { ensureSchema, fetchGuests } from './database.js'
import { requireCrew } from './permissions.js'
import { consumeRateLimit, rateLimited } from './rateLimit.js'
import { clipText } from './sanitize.js'
import { selectVisnipSnippets } from './visnipSnippets.js'

const AI_MAX_HITS = 40
const AI_WINDOW_MS = 60 * 60 * 1000

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

function publicAiError(err: unknown): string {
  const message = err instanceof Error ? err.message : ''
  if (/credit balance|too low/i.test(message)) return 'AI is temporarily unavailable. Try again later.'
  if (/api key|authentication|ANTHROPIC/i.test(message)) return 'AI is not available right now.'
  if (/could not be parsed|empty|No transcript/i.test(message)) return 'Could not make a snippet list for this transcript.'
  return 'Snippet list failed'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ctx = await requireCrew(req, res)
  if (!ctx) return

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const ip = getRequestIp(req)
    const limit = await consumeRateLimit(`visnip:${ip}`, AI_MAX_HITS, AI_WINDOW_MS)
    if (!limit.ok) {
      rateLimited(res, limit.retryAfterSec, 'AI limit reached. Try again later.')
      return
    }

    const body = parseBody(req)
    const guestId = clipText(body.guestId, 40)
    if (!guestId) {
      res.status(400).json({ error: 'Candidate is required' })
      return
    }

    await ensureSchema()
    const guest = (await fetchGuests()).find((item) => item.id === guestId)
    if (!guest) {
      res.status(404).json({ error: 'Candidate not found' })
      return
    }
    if (!guest.transcript.trim()) {
      res.status(400).json({ error: 'No transcript' })
      return
    }

    const snippets = await selectVisnipSnippets(guest)
    res.status(200).json({ snippets })
  } catch (err) {
    console.error('interview snippets error:', err)
    res.status(500).json({ error: publicAiError(err) })
  }
}
