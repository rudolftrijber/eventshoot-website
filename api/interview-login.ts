import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  clientPasswordLookup,
  createSessionToken,
  crewSessionCred,
  getAuthContext,
  getRequestIp,
  hasCrewAuthConfigured,
  parseSessionToken,
  verifyCrewMemberLogin,
} from './interview/auth.js'
import { clientSessionCredValid, ensureSchema, fetchProductiesByClientPassword } from './interview/database.js'
import { consumeRateLimit, rateLimited } from './interview/rateLimit.js'
import { MAX_PASSWORD_LEN, originAllowed } from './interview/sanitize.js'
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
      let ctx = getAuthContext(req, token)
      if (ctx.authenticated && !ctx.skipAuth && ctx.role === 'client') {
        const payload = parseSessionToken(token)
        if (!payload || !(await clientSessionCredValid(payload.productionIds, payload.cred))) {
          ctx = { authenticated: false, role: null, productionIds: [], crewName: null, skipAuth: false }
        }
      }
      const authSkipped = skipAuth()
      const hasSecret = Boolean(process.env.INTERVIEW_SESSION_SECRET)
      const hasCrewAuth = hasCrewAuthConfigured()
      const hasDb = Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING)
      const configured = authSkipped ? hasDb : hasSecret && hasCrewAuth && hasDb
      res.status(200).json({
        authenticated: ctx.authenticated,
        role: ctx.role,
        productionIds: ctx.productionIds,
        crewName: ctx.crewName,
        skipAuth: authSkipped,
        configured,
        missing: authSkipped && !hasDb ? ['POSTGRES_URL'] : [],
      })
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    if (!originAllowed(req)) {
      res.status(403).json({ error: 'Forbidden' })
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
        res.status(500).json({ error: 'Server not configured' })
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
      if (!password || password.length > MAX_PASSWORD_LEN) {
        res.status(401).json({ error: 'Incorrect password' })
        return
      }

      if (crewName) {
        if (!verifyCrewMemberLogin(crewName, password)) {
          res.status(401).json({ error: 'Incorrect password' })
          return
        }
        const token = createSessionToken({
          role: 'crew',
          productionIds: [],
          crewName,
          cred: crewSessionCred(crewName),
        })
        setSessionCookie(res, token)
        res.status(200).json({ ok: true, role: 'crew', crewName })
        return
      }

      await ensureSchema()
      const productions = await fetchProductiesByClientPassword(password)
      const lookup = clientPasswordLookup(password)
      if (!productions.length || !lookup) {
        res.status(401).json({ error: 'Incorrect password' })
        return
      }

      const token = createSessionToken({
        role: 'client',
        productionIds: productions.map((p) => p.id),
        cred: lookup,
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
