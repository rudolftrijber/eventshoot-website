import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  createSessionToken,
  getAuthContext,
  verifyClientPassword,
  verifyCrewPassword,
} from './interview/auth.js'
import { ensureSchema, fetchProductiesByClientPassword } from './interview/database.js'
import {
  clearSessionCookie,
  getSessionToken,
  setSessionCookie,
  skipAuth,
} from './interview/session.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const token = getSessionToken(req)
      const ctx = getAuthContext(req, token)
      const authSkipped = skipAuth()
      const hasSecret = Boolean(process.env.INTERVIEW_SESSION_SECRET)
      const hasPassword = Boolean(process.env.INTERVIEW_APP_PASSWORD)
      const hasDb = Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING)
      res.status(200).json({
        authenticated: ctx.authenticated,
        role: ctx.role,
        productionIds: ctx.productionIds,
        skipAuth: authSkipped,
        configured: authSkipped ? hasDb : hasSecret && hasPassword && hasDb,
        missing: authSkipped
          ? [!hasDb && 'POSTGRES_URL'].filter(Boolean)
          : [
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
        res.status(500).json({ error: 'Server not configured (INTERVIEW_SESSION_SECRET)' })
        return
      }
      const password = String(body?.password || '')
      if (!password) {
        res.status(401).json({ error: 'Incorrect password' })
        return
      }

      if (process.env.INTERVIEW_APP_PASSWORD && verifyCrewPassword(password)) {
        const token = createSessionToken({ role: 'crew', productionIds: [] })
        setSessionCookie(res, token)
        res.status(200).json({ ok: true, role: 'crew' })
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
