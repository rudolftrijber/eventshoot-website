import type { VercelRequest, VercelResponse } from '@vercel/node'
import { saveCrew } from './directory.js'
import { ensureSchema } from './database.js'
import { requireCrew } from './permissions.js'

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!await requireCrew(req, res)) return

  try {
    await ensureSchema()
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    const body = parseBody(req)
    const member = await saveCrew({
      naam: String(body.naam || ''),
      rol: String(body.rol || ''),
      telefoon: String(body.telefoon || ''),
    })
    res.status(201).json({ member })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Action failed'
    const status = /already exists|required|Enter a/.test(message) ? 400 : 500
    if (status === 500) console.error('interview crew error:', err)
    res.status(status).json({ error: status === 400 ? message : 'Action failed' })
  }
}
