import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  createSessionToken,
  getAuthContext,
  getRequestIp,
  hasCrewAuthConfigured,
  verifyCrewMemberLogin,
} from './interview/auth.js'
import { ensureSchema, fetchProductiesByClientPassword } from './interview/database.js'
import { consumeRateLimit, rateLimited } from './interview/rateLimit.js'
import {
  clearSessionCookie,
  getSessionToken,
  setSessionCookie,
  skipAuth,
} from './interview/session.js'

const LOGIN_MAX_ATTEMPTS = 10
const LOGIN_WINDOW_MS = 15 * 60 * 1000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const token = getSessionToken(req)
      const ctx = getAuthContext(req, token)
      const authSkipped = skipAuth()
      const hasSecret = Boolean(process.env.INTERVIEW_SESSION_SECRET)
      const hasCrewAuth = hasCrewAuthConfigured()
      const hasDb = Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING)
      res.status(200).json({
        authenticated: ctx.authenticated,
        role: ctx.role,
        productionIds: ctx.productionIds,
        crewName: ctx.crewName,
        skipAuth: authSkipped,
        configured: authSkipped ? hasDb : hasSecret && hasCrewAuth && hasDb,
        missing: authSkipped
          ? [!hasDb && 'POSTGRES_URL'].filter(Boolean)
          : [
              !hasCrewAuth && 'INTERVIEW_CREW_PASSWORDS (or INTERVIEW_APP_PASSWORD)',
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
        res.status(500).json({ error: 'Server not configured (INTERVIEW_SESSION_SECRET)' })
        return
      }

      const ip = getRequestIp(req)
      const limit = await consumeRateLimit(`login:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS)
      if (!limit.ok) {
        rateLimited(res, limit.retryAfterSec, 'Too many login attempts. Try again later.')
        return
      }

      const password = String(body?.password || '')
      const crewName = String(body?.crewName || '').trim()
      if (!password) {
        res.status(401).json({ error: 'Incorrect password' })
        return
      }

      if (crewName) {
        if (!verifyCrewMemberLogin(crewName, password)) {
          res.status(401).json({ error: 'Incorrect password' })
          return
        }
        const token = createSessionToken({ role: 'crew', productionIds: [], crewName })
        setSessionCookie(res, token)
        res.status(200).json({ ok: true, role: 'crew', crewName })
        return
      }

      await ensureSchema()
      const productions = await fetchProductiesByClientPassword(password)
      if (!productions.length) {
        res.status(401).json({ error: 'Incorrect password' })
        return
      }

      const token = createSessionToken({
        role: 'client',
        productionIds: productions.map((p) => p.id),
      })
      setSessionCookie(res, token)
      res.status(200).json({
        ok: true,
        role: 'client',
        productionIds: productions.map((p) => p.id),
      })
      return
    }

    res.status(400).json({ error: 'Unknown action' })
  } catch (err) {
    console.error('interview login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
}
