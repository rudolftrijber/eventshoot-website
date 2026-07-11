import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../../../lib/interview/session'
import {
  deleteProductie,
  ensureSchema,
  updateProductie,
} from '../../../lib/interview/database'
import type { ProductieStatus } from '../../../lib/interview/types'

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return

  const id = String(req.query.id || '')
  if (!id) {
    res.status(400).json({ error: 'ID ontbreekt' })
    return
  }

  try {
    await ensureSchema()

    if (req.method === 'PATCH') {
      const body = parseBody(req)
      const patch: Record<string, unknown> = {}

      if (body.naam !== undefined) patch.naam = String(body.naam)
      if (body.datum !== undefined) patch.datum = String(body.datum)
      if (body.status !== undefined) patch.status = String(body.status) as ProductieStatus
      if (body.vragen !== undefined) patch.vragen = Array.isArray(body.vragen) ? body.vragen.map(String) : []

      if (body.action === 'archive') {
        patch.archivedAt = new Date().toISOString()
      }
      if (body.action === 'restore') {
        patch.archivedAt = null
      }

      const updated = await updateProductie(id, patch)
      if (!updated) {
        res.status(404).json({ error: 'Productie niet gevonden' })
        return
      }
      res.status(200).json({ production: updated })
      return
    }

    if (req.method === 'DELETE') {
      const ok = await deleteProductie(id)
      if (!ok) {
        res.status(404).json({ error: 'Productie niet gevonden' })
        return
      }
      res.status(200).json({ ok: true })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview production id error:', err)
    res.status(500).json({ error: 'Actie mislukt' })
  }
}
