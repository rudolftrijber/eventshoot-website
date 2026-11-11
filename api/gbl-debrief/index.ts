import { randomUUID } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyCrewMemberLogin } from '../interview/auth.js'
import { getSql } from '../interview/database.js'
import { consumeRateLimit, rateLimited, rateLimitKeyFromRequest } from '../interview/rateLimit.js'
import { AUDIENCES, CONFERENCE, answerLines, audienceById, parseSubmission } from './questions.js'

type StoredRow = {
  id: string
  audience: string
  conference_id: string
  conference_title: string
  answers: Record<string, unknown>
  created_at: string | Date
}

let schemaReady: Promise<void> | null = null

function adminOk(given: string): boolean {
  if (!given) return false
  return verifyCrewMemberLogin('Rolf Trijber', given)
}

function requestIp(req: VercelRequest): string {
  const vercel = String(req.headers['x-vercel-forwarded-for'] || '').split(',')[0]?.trim()
  if (vercel) return vercel
  const realIp = String(req.headers['x-real-ip'] || '').trim()
  if (realIp) return realIp
  if (!process.env.VERCEL) {
    const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0]?.trim()
    if (forwarded) return forwarded
  }
  return 'unknown'
}

function adminKeyFrom(req: VercelRequest): string {
  const raw = req.headers['x-gbl-admin-key']
  return (Array.isArray(raw) ? raw[0] : raw || '').trim()
}

function noStore(res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
}

async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = initSchema().catch((err) => {
      schemaReady = null
      throw err
    })
  }
  await schemaReady
}

async function initSchema(): Promise<void> {
  const sql = await getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS gbl_debrief_responses (
      id TEXT PRIMARY KEY,
      audience TEXT NOT NULL,
      conference_id TEXT NOT NULL,
      conference_title TEXT NOT NULL,
      answers JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS gbl_debrief_responses_created
    ON gbl_debrief_responses (created_at DESC)
  `
}

function asAnswers(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>
    } catch {
      return {}
    }
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>
  return {}
}

function present(row: StoredRow) {
  const answers = asAnswers(row.answers)
  return {
    id: row.id,
    audience: row.audience,
    audienceTitle: AUDIENCES.find((item) => item.id === row.audience)?.title || row.audience,
    conferenceId: row.conference_id,
    conferenceTitle: row.conference_title,
    createdAt: new Date(row.created_at).toISOString(),
    lines: answerLines(row.audience, answers),
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  noStore(res)
  try {
    await ensureSchema()
    const admin = adminOk(adminKeyFrom(req))
    const sql = await getSql()

    if (req.method === 'GET') {
      if (!admin) {
        res.status(401).json({ error: 'unauthorized' })
        return
      }
      const rows = (await sql`
        SELECT id, audience, conference_id, conference_title, answers, created_at
        FROM gbl_debrief_responses
        ORDER BY created_at DESC
        LIMIT 500
      `) as StoredRow[]
      res.status(200).json({ responses: rows.map(present) })
      return
    }

    if (req.method === 'DELETE') {
      if (!admin) {
        res.status(401).json({ error: 'unauthorized' })
        return
      }
      const id = typeof (req.body as { id?: unknown } | undefined)?.id === 'string'
        ? (req.body as { id: string }).id.trim()
        : ''
      if (!id || id.length > 80) {
        res.status(400).json({ error: 'invalid' })
        return
      }
      await sql`DELETE FROM gbl_debrief_responses WHERE id = ${id}`
      const rows = (await sql`
        SELECT id, audience, conference_id, conference_title, answers, created_at
        FROM gbl_debrief_responses
        ORDER BY created_at DESC
        LIMIT 500
      `) as StoredRow[]
      res.status(200).json({ responses: rows.map(present) })
      return
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST, DELETE')
      res.status(405).json({ error: 'method' })
      return
    }

    const limit = await consumeRateLimit(
      rateLimitKeyFromRequest('gbl-debrief', requestIp(req)),
      8,
      10 * 60 * 1000,
    )
    if (!limit.ok) {
      rateLimited(res, limit.retryAfterSec, 'Too many attempts. Please wait a few minutes and try again.')
      return
    }

    const body = (req.body || {}) as { audience?: unknown; answers?: unknown; website?: unknown }
    if (typeof body.website === 'string' && body.website.trim()) {
      res.status(200).json({ ok: true })
      return
    }

    const audience = audienceById(typeof body.audience === 'string' ? body.audience : '')
    const answers = audience ? parseSubmission(audience, body.answers) : null
    if (!audience || !answers) {
      res.status(400).json({ error: 'invalid' })
      return
    }

    await sql`
      INSERT INTO gbl_debrief_responses (id, audience, conference_id, conference_title, answers)
      VALUES (
        ${randomUUID()},
        ${audience.id},
        ${CONFERENCE.id},
        ${CONFERENCE.title},
        ${JSON.stringify(answers)}::jsonb
      )
    `

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('gbl-debrief error:', err instanceof Error ? `${err.name}: ${err.message}` : 'unknown')
    res.status(500).json({ error: 'unavailable' })
  }
}
