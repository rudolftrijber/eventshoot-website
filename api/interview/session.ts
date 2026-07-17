import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getAuthContext,
  parseSessionToken,
  skipAuth,
  verifyCrewPassword,
  SESSION_TTL_SEC,
} from './auth.js'

const COOKIE_NAME = 'interview_session'

export { skipAuth, verifyCrewPassword as verifyPassword, SESSION_TTL_SEC }

export function getSessionToken(req: VercelRequest): string | null {
  const cookie = req.headers.cookie
  if (!cookie) return null
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function isAuthenticated(req: VercelRequest): boolean {
  return getAuthContext(req, getSessionToken(req)).authenticated
}

export function setSessionCookie(res: VercelResponse, token: string): void {
  const secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_SEC}; SameSite=Lax${secure}`,
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
    res.status(401).json({ error: 'Not logged in' })
    return false
  }
  return true
}

export function getSessionPayload(req: VercelRequest) {
  return parseSessionToken(getSessionToken(req))
}
