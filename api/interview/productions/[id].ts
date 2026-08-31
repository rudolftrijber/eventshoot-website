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
        if (body.generalTitel !== undefined) patch.generalTitel = String(body.generalTitel).trim().slice(0, 30)
        if (body.png16x9 !== undefined) patch.png16x9 = String(body.png16x9).trim()
        if (body.png9x16 !== undefined) patch.png9x16 = String(body.png9x16).trim()
        if (body.png4x5 !== undefined) patch.png4x5 = String(body.png4x5).trim()
        if (body.datum !== undefined) patch.datum = String(body.datum)
        if (body.startTijd !== undefined) patch.startTijd = String(body.startTijd)
        if (body.eindDatum !== undefined) patch.eindDatum = String(body.eindDatum)
        if (body.eindTijd !== undefined) patch.eindTijd = String(body.eindTijd)
        if (body.status !== undefined) patch.status = String(body.status) as ProductieStatus
        if (body.locatie !== undefined) patch.locatie = String(body.locatie)
        if (body.land !== undefined) patch.land = String(body.land)
        if (body.supervisor !== undefined) patch.supervisor = String(body.supervisor)
        if (body.crew2 !== undefined) patch.crew2 = String(body.crew2)
        if (body.crew3 !== undefined) patch.crew3 = String(body.crew3)
        if (body.crew4 !== undefined) patch.crew4 = String(body.crew4)
        if (body.crew5 !== undefined) patch.crew5 = String(body.crew5)
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
