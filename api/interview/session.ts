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

function cookieSecure(): string {
  return process.env.VERCEL ? '; Secure' : ''
}

function cookieParts(path: string, token: string, maxAge: number): string {
  const value = token ? encodeURIComponent(token) : ''
  return `${COOKIE_NAME}=${value}; HttpOnly; Path=${path}; Max-Age=${maxAge}; SameSite=Lax${cookieSecure()}`
}

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
  res.setHeader('Set-Cookie', [
    cookieParts('/', '', 0),
    cookieParts('/api', token, SESSION_TTL_SEC),
  ])
}

export function clearSessionCookie(res: VercelResponse): void {
  res.setHeader('Set-Cookie', [
    cookieParts('/', '', 0),
    cookieParts('/api', '', 0),
  ])
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
