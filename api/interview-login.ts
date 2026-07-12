import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isAuthenticated, skipAuth, verifyPassword, createSessionToken, setSessionCookie, clearSessionCookie } from './interview/_session'

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const authSkipped = skipAuth()
      const hasSecret = Boolean(process.env.INTERVIEW_SESSION_SECRET)
      const hasPassword = Boolean(process.env.INTERVIEW_APP_PASSWORD)
      const hasDb = Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING)
      res.status(200).json({
        authenticated: isAuthenticated(req),
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
