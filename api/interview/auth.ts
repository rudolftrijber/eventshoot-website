import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  clearSessionCookie,
  createSessionToken,
  isAuthenticated,
  requireAuth,
  setSessionCookie,
  verifyPassword,
} from '../_lib/interview/auth'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ authenticated: isAuthenticated(req) })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const action = body?.action as string

  if (action === 'logout') {
    clearSessionCookie(res)
    res.status(200).json({ ok: true })
    return
  }

  if (action === 'login') {
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
}
