import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isClient, isCrew } from '../auth.js'
import {
  deleteProductie,
  ensureSchema,
  updateProductie,
} from '../database.js'
import {
  requireCrew,
  requireLogin,
  sanitizeProductionPatchForClient,
} from '../permissions.js'
import type { ProductieStatus } from '../types.js'

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = String(req.query.id || '')
  if (!id) {
    res.status(400).json({ error: 'ID ontbreekt' })
    return
  }

  try {
    await ensureSchema()

    if (req.method === 'PATCH') {
      const ctx = requireLogin(req, res)
      if (!ctx) return

      const body = parseBody(req)
      let patch: Record<string, unknown> = {}

      if (isClient(ctx)) {
        if (body.action === 'archive' || body.action === 'restore') {
          res.status(403).json({ error: 'Crew access only' })
          return
        }
        if (body.vragen !== undefined) {
          patch.vragen = Array.isArray(body.vragen) ? body.vragen.map(String) : []
        }
        const sanitized = sanitizeProductionPatchForClient(ctx, id, patch)
        if (typeof sanitized === 'string') {
          res.status(403).json({ error: sanitized })
          return
        }
        patch = sanitized
      } else if (isCrew(ctx)) {
        if (body.naam !== undefined) patch.naam = String(body.naam)
        if (body.datum !== undefined) patch.datum = String(body.datum)
        if (body.status !== undefined) patch.status = String(body.status) as ProductieStatus
        if (body.locatie !== undefined) patch.locatie = String(body.locatie)
        if (body.land !== undefined) patch.land = String(body.land)
        if (body.vragen !== undefined) patch.vragen = Array.isArray(body.vragen) ? body.vragen.map(String) : []
        if (body.clientPassword !== undefined) patch.clientPassword = String(body.clientPassword)

        if (body.action === 'archive') {
          patch.archivedAt = new Date().toISOString()
        }
        if (body.action === 'restore') {
          patch.archivedAt = null
        }
      } else {
        res.status(403).json({ error: 'Not allowed' })
        return
      }

      const updated = await updateProductie(id, patch)
      if (!updated) {
        res.status(404).json({ error: 'Production not found' })
        return
      }
      res.status(200).json({ production: updated })
      return
    }

    if (req.method === 'DELETE') {
      if (!requireCrew(req, res)) return
      const ok = await deleteProductie(id)
      if (!ok) {
        res.status(404).json({ error: 'Production not found' })
        return
      }
      res.status(200).json({ ok: true })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview production id error:', err)
    res.status(500).json({ error: 'Action failed' })
  }
}
