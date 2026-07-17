import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql, ensureSchema } from './database.js'

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSec: number
}

/**
 * Sliding fixed-window rate limit stored in Postgres (works across serverless instances).
 */
export async function consumeRateLimit(
  bucketKey: string,
  maxHits: number,
  windowMs: number,
): Promise<RateLimitResult> {
  await ensureSchema()
  const sql = await getSql()
  const now = Date.now()
  const rows = await sql`
    SELECT hits, window_start FROM interview_rate_limits WHERE bucket_key = ${bucketKey}
  `
  const row = rows[0] as { hits: number; window_start: string | Date } | undefined

  if (!row) {
    await sql`
      INSERT INTO interview_rate_limits (bucket_key, hits, window_start)
      VALUES (${bucketKey}, 1, NOW())
      ON CONFLICT (bucket_key) DO UPDATE SET hits = 1, window_start = NOW()
    `
    return { ok: true, remaining: maxHits - 1, retryAfterSec: 0 }
  }

  const windowStart = row.window_start instanceof Date
    ? row.window_start.getTime()
    : new Date(row.window_start).getTime()
  const elapsed = now - windowStart

  if (Number.isNaN(windowStart) || elapsed >= windowMs) {
    await sql`
      UPDATE interview_rate_limits
      SET hits = 1, window_start = NOW()
      WHERE bucket_key = ${bucketKey}
    `
    return { ok: true, remaining: maxHits - 1, retryAfterSec: 0 }
  }

  const hits = Number(row.hits) || 0
  if (hits >= maxHits) {
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - elapsed) / 1000))
    return { ok: false, remaining: 0, retryAfterSec }
  }

  await sql`
    UPDATE interview_rate_limits
    SET hits = ${hits + 1}
    WHERE bucket_key = ${bucketKey}
  `
  return { ok: true, remaining: Math.max(0, maxHits - hits - 1), retryAfterSec: 0 }
}

export function rateLimited(
  res: VercelResponse,
  retryAfterSec: number,
  message = 'Too many requests. Try again later.',
): void {
  res.setHeader('Retry-After', String(retryAfterSec))
  res.status(429).json({ error: message })
}

export function rateLimitKeyFromRequest(req: VercelRequest, prefix: string, ip: string): string {
  return `${prefix}:${ip}`
}
