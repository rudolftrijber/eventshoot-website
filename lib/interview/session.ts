import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const COOKIE_NAME = 'interview_session'
const MAX_AGE_SEC = 60 * 60 * 24 * 7

function getSecret(): string {
  return process.env.INTERVIEW_SESSION_SECRET || ''
}

export function getSessionToken(req: VercelRequest): string | null {
  const cookie = req.headers.cookie
  if (!cookie) return null
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function createSessionToken(): string {
  const payload = randomBytes(32).toString('hex')
  const secret = getSecret()
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifySessionToken(token: string | null): boolean {
  if (!token) return false
  const secret = getSecret()
  if (!secret) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}

export function isAuthenticated(req: VercelRequest): boolean {
  return verifySessionToken(getSessionToken(req))
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.INTERVIEW_APP_PASSWORD || ''
  if (!expected || !password) return false
  if (password.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  } catch {
    return false
  }
}

export function setSessionCookie(res: VercelResponse, token: string): void {
  const secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax${secure}`,
  )
}

export function clearSessionCookie(res: VercelResponse): void {
  const secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`,
  )
}

export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Niet ingelogd' })
    return false
  }
  return true
}
