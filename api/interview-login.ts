import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  clientPasswordLookup,
  createSessionToken,
  createSetToken,
  crewSessionCred,
  endOfAmsterdamDayUnix,
  getAuthContext,
  getRequestIp,
  hasCrewAuthConfigured,
  INTERVIEWER_NAMES,
  isCrew,
  parseSessionToken,
  readSetToken,
  SET_CREW_NAME,
  setAppPath,
  setSessionCred,
  verifyCrewMemberLogin,
} from './interview/auth.js'
import { clientSessionCredValid, ensureSchema, fetchProducties, fetchProductiesByClientPassword } from './interview/database.js'
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
const SET_MAX_ATTEMPTS = 40

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

    if (action === 'set-link') {
      if (!process.env.INTERVIEW_SESSION_SECRET) {
        res.status(500).json({ error: 'Server not configured' })
        return
      }
      const ctx = getAuthContext(req, getSessionToken(req))
      if (!isCrew(ctx)) {
        res.status(403).json({ error: 'Crew access only' })
        return
      }
      const productionId = String(body?.productionId || '').trim().slice(0, 64)
      if (!productionId) {
        res.status(400).json({ error: 'Production missing' })
        return
      }
      await ensureSchema()
      const productions = await fetchProducties(true)
      if (!productions.some((p) => p.id === productionId)) {
        res.status(404).json({ error: 'Production not found' })
        return
      }
      const token = createSetToken(productionId)
      res.status(200).json({ path: setAppPath(token) })
      return
    }

    if (action === 'set') {
      const parsed = readSetToken(String(body?.key || ''))
      if (!parsed.ok) {
        res.status(401).json({
          error: parsed.reason === 'expired'
            ? 'This set link has expired. Ask Rolf or Maurice for a new link.'
            : 'This set link is not valid. Ask Rolf or Maurice for today\'s link.',
        })
        return
      }

      if (!process.env.INTERVIEW_SESSION_SECRET) {
        res.status(500).json({ error: 'Server not configured' })
        return
      }

      const ip = getRequestIp(req)
      const limit = await consumeRateLimit(`set:${ip}`, SET_MAX_ATTEMPTS, LOGIN_WINDOW_MS)
      if (!limit.ok) {
        rateLimited(res, limit.retryAfterSec, 'Too many set-link attempts. Try again later.')
        return
      }

      await ensureSchema()
      const productions = await fetchProducties(true)
      const production = productions.find((p) => p.id === parsed.productionId)
      if (!production) {
        res.status(401).json({ error: 'This set link is not valid. Ask Rolf or Maurice for today\'s link.' })
        return
      }

      const existing = getAuthContext(req, getSessionToken(req))
      if (
        existing.authenticated
        && existing.role === 'crew'
        && existing.crewName
        && (INTERVIEWER_NAMES as readonly string[]).includes(existing.crewName)
      ) {
        res.status(200).json({
          ok: true,
          retained: true,
          role: 'crew',
          crewName: existing.crewName,
          productionId: production.id,
        })
        return
      }

      const token = createSessionToken({
        role: 'set',
        productionIds: [production.id],
        crewName: SET_CREW_NAME,
        cred: setSessionCred(production.id, parsed.date),
        exp: endOfAmsterdamDayUnix(),
      })
      setSessionCookie(res, token)
      res.status(200).json({
        ok: true,
        role: 'set',
        crewName: SET_CREW_NAME,
        productionId: production.id,
        productionIds: [production.id],
      })
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
          exp: endOfAmsterdamDayUnix(),
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
