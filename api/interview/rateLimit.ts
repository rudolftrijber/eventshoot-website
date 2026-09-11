import type { VercelResponse } from '@vercel/node'
import { getSql, ensureSchema } from './database.js'

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSec: number
}

/**
 * Sliding fixed-window rate limit stored in Postgres (works across serverless instances).
 * Increment happens in one UPSERT so concurrent requests cannot skip the cap.
 */
export async function consumeRateLimit(
  bucketKey: string,
  maxHits: number,
  windowMs: number,
): Promise<RateLimitResult> {
  await ensureSchema()
  const sql = await getSql()
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000))
  const rows = await sql`
    INSERT INTO interview_rate_limits (bucket_key, hits, window_start)
    VALUES (${bucketKey}, 1, NOW())
    ON CONFLICT (bucket_key) DO UPDATE SET
      hits = CASE
        WHEN interview_rate_limits.window_start <= NOW() - make_interval(secs => ${windowSec}) THEN 1
        ELSE interview_rate_limits.hits + 1
      END,
      window_start = CASE
        WHEN interview_rate_limits.window_start <= NOW() - make_interval(secs => ${windowSec}) THEN NOW()
        ELSE interview_rate_limits.window_start
      END
    RETURNING hits, window_start
  `
  const row = rows[0] as { hits: number; window_start: string | Date } | undefined
  const hits = Number(row?.hits) || 1
  if (hits > maxHits) {
    const windowStart = row?.window_start instanceof Date
      ? row.window_start.getTime()
      : new Date(String(row?.window_start || '')).getTime()
    const elapsed = Number.isNaN(windowStart) ? 0 : Date.now() - windowStart
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - elapsed) / 1000))
    return { ok: false, remaining: 0, retryAfterSec }
  }
  return { ok: true, remaining: Math.max(0, maxHits - hits), retryAfterSec: 0 }
}

export function rateLimited(
  res: VercelResponse,
  retryAfterSec: number,
  message = 'Too many requests. Try again later.',
): void {
  res.setHeader('Retry-After', String(retryAfterSec))
  res.status(429).json({ error: message })
}

export function rateLimitKeyFromRequest(prefix: string, ip: string): string {
  return `${prefix}:${ip}`
}
