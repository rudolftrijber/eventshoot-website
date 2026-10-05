import type { VercelRequest, VercelResponse } from '@vercel/node'
import { deleteCrew, saveCrew } from '../directory.js'
import { ensureSchema } from '../database.js'
import { requireCrew } from '../permissions.js'
import { clipText } from '../sanitize.js'

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!await requireCrew(req, res)) return

  try {
    await ensureSchema()
    const id = clipText(req.query.id, 64)
    if (!id) {
      res.status(400).json({ error: 'Missing crew member' })
      return
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req)
      const member = await saveCrew({
        id,
        naam: String(body.naam || ''),
        rol: String(body.rol || ''),
        telefoon: String(body.telefoon || ''),
      })
      res.status(200).json({ member })
      return
    }

    if (req.method === 'DELETE') {
      const removed = await deleteCrew(id)
      if (!removed) {
        res.status(404).json({ error: 'Crew member not found' })
        return
      }
      res.status(200).json({ ok: true })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Action failed'
    const status = /already exists|required|Enter a/.test(message) ? 400 : 500
    if (status === 500) console.error('interview crew member error:', err)
    res.status(status).json({ error: status === 400 ? message : 'Action failed' })
  }
}
