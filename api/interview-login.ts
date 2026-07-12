import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const COOKIE_NAME = 'interview_session'
const MAX_AGE_SEC = 60 * 60 * 24 * 7

function getSecret(): string {
  return process.env.INTERVIEW_SESSION_SECRET || ''
}

function getSessionToken(req: VercelRequest): string | null {
  const cookie = req.headers.cookie
  if (!cookie) return null
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

function createSessionToken(): string {
  const payload = randomBytes(32).toString('hex')
  const secret = getSecret()
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${sig}`
}

function verifySessionToken(token: string | null): boolean {
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

function isAuthenticated(req: VercelRequest): boolean {
  return verifySessionToken(getSessionToken(req))
}

function verifyPassword(password: string): boolean {
  const expected = process.env.INTERVIEW_APP_PASSWORD || ''
  if (!expected || !password) return false
  if (password.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  } catch {
    return false
  }
}

function setSessionCookie(res: VercelResponse, token: string): void {
  const secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax${secure}`,
  )
}

function clearSessionCookie(res: VercelResponse): void {
  const secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`,
  )
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const hasSecret = Boolean(process.env.INTERVIEW_SESSION_SECRET)
      const hasPassword = Boolean(process.env.INTERVIEW_APP_PASSWORD)
      const hasDb = Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING)
      res.status(200).json({
        authenticated: isAuthenticated(req),
        configured: hasSecret && hasPassword && hasDb,
        missing: [
          !hasPassword && 'INTERVIEW_APP_PASSWORD',
          !hasSecret && 'INTERVIEW_SESSION_SECRET',
          !hasDb && 'POSTGRES_URL',
        ].filter(Boolean),
      })
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
    const action = body?.action as string

    if (action === 'logout') {
      clearSessionCookie(res)
      res.status(200).json({ ok: true })
      return
    }

    if (action === 'login') {
      if (!process.env.INTERVIEW_SESSION_SECRET) {
        res.status(500).json({ error: 'Server niet geconfigureerd (INTERVIEW_SESSION_SECRET)' })
        return
      }
      if (!process.env.INTERVIEW_APP_PASSWORD) {
        res.status(500).json({ error: 'Server niet geconfigureerd (INTERVIEW_APP_PASSWORD)' })
        return
      }
      const password = String(body?.password || '')
      if (!verifyPassword(password)) {
        res.status(401).json({ error: 'Onjuist wachtwoord' })
        return
      }
      const token = createSessionToken()
      setSessionCookie(res, token)
      res.status(200).json({ ok: true })
      return
    }

    res.status(400).json({ error: 'Onbekende actie' })
  } catch (err) {
    console.error('interview login error:', err)
    res.status(500).json({ error: 'Login mislukt' })
  }
}
