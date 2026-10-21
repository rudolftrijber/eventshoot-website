import { createHash, randomUUID, timingSafeEqual } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql } from '../interview/database.js'
import { consumeRateLimit, rateLimited, rateLimitKeyFromRequest } from '../interview/rateLimit.js'
import { findSlot, GBL_DAYS } from './slots.js'

type SignupRow = {
  id: string
  slot_id: string
  first_name: string
  last_name: string
  firm: string
}

let schemaReady: Promise<void> | null = null

function adminOk(given: string): boolean {
  const expected = (process.env.GBL_SIGNUP_ADMIN_KEY || '').trim()
  if (!expected || !given) return false
  const a = createHash('sha256').update(expected).digest()
  const b = createHash('sha256').update(given).digest()
  return timingSafeEqual(a, b)
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

function cleanField(value: unknown, max = 80): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (trimmed.length < 1 || trimmed.length > max) return null
  if (/[<>]/.test(trimmed)) return null
  return trimmed
}

function personKey(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
}

function pgDetails(err: unknown): { code?: string; constraint?: string } {
  const chain: unknown[] = [err]
  if (err && typeof err === 'object' && 'cause' in err) chain.push((err as { cause?: unknown }).cause)
  for (const item of chain) {
    if (!item || typeof item !== 'object') continue
    const row = item as { code?: string; constraint?: string }
    if (row.code || row.constraint) return row
  }
  return {}
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
    CREATE TABLE IF NOT EXISTS gbl_prague_signups (
      id TEXT PRIMARY KEY,
      slot_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      firm TEXT NOT NULL,
      person_key TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      cancelled_at TIMESTAMPTZ
    )
  `
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS gbl_prague_signups_slot_active
    ON gbl_prague_signups (slot_id)
    WHERE cancelled_at IS NULL
  `
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS gbl_prague_signups_person_active
    ON gbl_prague_signups (person_key)
    WHERE cancelled_at IS NULL
  `
}

async function activeSignups(): Promise<SignupRow[]> {
  const sql = await getSql()
  const rows = await sql`
    SELECT id, slot_id, first_name, last_name, firm
    FROM gbl_prague_signups
    WHERE cancelled_at IS NULL
  `
  return rows as SignupRow[]
}

function schedule(rows: SignupRow[], admin: boolean) {
  const bySlot = new Map(rows.map((row) => [row.slot_id, row]))
  return {
    admin,
    days: GBL_DAYS.map((day) => ({
      ...day,
      slots: day.slots.map((slot) => {
        const row = bySlot.get(slot.id)
        return {
          ...slot,
          booking: row
            ? { id: row.id, firstName: row.first_name, lastName: row.last_name, firm: row.firm }
            : null,
        }
      }),
    })),
  }
}

function noStore(res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  noStore(res)
  try {
    await ensureSchema()
    const admin = adminOk(adminKeyFrom(req))

    if (req.method === 'GET') {
      res.status(200).json(schedule(await activeSignups(), admin))
      return
    }

    if (req.method === 'DELETE') {
      if (!admin) {
        res.status(401).json({ error: 'unauthorized' })
        return
      }
      const id = cleanField((req.body as { id?: unknown } | undefined)?.id, 80)
      if (!id) {
        res.status(400).json({ error: 'invalid' })
        return
      }
      const sql = await getSql()
      const cleared = await sql`
        UPDATE gbl_prague_signups
        SET cancelled_at = NOW()
        WHERE id = ${id} AND cancelled_at IS NULL
        RETURNING id
      `
      if (!cleared.length) {
        res.status(404).json({ error: 'not_found' })
        return
      }
      res.status(200).json(schedule(await activeSignups(), true))
      return
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST, DELETE')
      res.status(405).json({ error: 'method' })
      return
    }

    const limit = await consumeRateLimit(
      rateLimitKeyFromRequest('gbl-prague', requestIp(req)),
      100,
      10 * 60 * 1000,
    )
    if (!limit.ok) {
      rateLimited(res, limit.retryAfterSec, 'Too many attempts. Try again in a few minutes.')
      return
    }

    const body = (req.body || {}) as { slotId?: unknown; firstName?: unknown; lastName?: unknown; firm?: unknown }
    const slot = findSlot(typeof body.slotId === 'string' ? body.slotId : '')
    const firstName = cleanField(body.firstName)
    const lastName = cleanField(body.lastName)
    const firm = cleanField(body.firm)
    if (!slot || !firstName || !lastName || !firm) {
      res.status(400).json({ error: 'invalid' })
      return
    }

    const key = personKey(firstName, lastName)
    const sql = await getSql()
    const existing = await sql`
      SELECT slot_id FROM gbl_prague_signups
      WHERE person_key = ${key} AND cancelled_at IS NULL
      LIMIT 1
    `
    if (existing.length) {
      const taken = findSlot(String((existing[0] as { slot_id: string }).slot_id))
      res.status(409).json({
        error: 'already_booked',
        dayLabel: taken?.day.label || '',
        dayLabelNl: taken?.day.labelNl || '',
        start: taken?.slot.start || '',
        end: taken?.slot.end || '',
      })
      return
    }

    try {
      await sql`
        INSERT INTO gbl_prague_signups (id, slot_id, first_name, last_name, firm, person_key)
        VALUES (${randomUUID()}, ${slot.slot.id}, ${firstName}, ${lastName}, ${firm}, ${key})
      `
    } catch (err) {
      const details = pgDetails(err)
      if (details.code !== '23505') throw err
      const again = await sql`
        SELECT slot_id FROM gbl_prague_signups
        WHERE person_key = ${key} AND cancelled_at IS NULL
        LIMIT 1
      `
      if (again.length) {
        const taken = findSlot(String((again[0] as { slot_id: string }).slot_id))
        res.status(409).json({
          error: 'already_booked',
          dayLabel: taken?.day.label || '',
          dayLabelNl: taken?.day.labelNl || '',
          start: taken?.slot.start || '',
          end: taken?.slot.end || '',
        })
        return
      }
      res.status(409).json({ error: 'slot_taken' })
      return
    }

    res.status(200).json(schedule(await activeSignups(), admin))
  } catch (err) {
    console.error('gbl-prague signup error:', err instanceof Error ? err.name : 'unknown')
    res.status(500).json({ error: 'unavailable' })
  }
}
