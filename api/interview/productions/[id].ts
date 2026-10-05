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
import { MAX_GENERAL_TITLE_CHARS, type ProductieStatus } from '../types.js'
import { sanitizeCallsheet } from '../callsheet.js'
import {
  clipText,
  MAX_PASSWORD_LEN,
  MAX_SHORT_TEXT,
  MIN_CLIENT_PASSWORD_LEN,
  sanitizeImageUrl,
  sanitizeQuestions,
} from '../sanitize.js'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
}

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
      const ctx = await requireLogin(req, res)
      if (!ctx) return

      const body = parseBody(req)
      let patch: Record<string, unknown> = {}

      if (isClient(ctx)) {
        if (body.action === 'archive' || body.action === 'restore') {
          res.status(403).json({ error: 'Crew access only' })
          return
        }
        if (body.vragen !== undefined) {
          patch.vragen = sanitizeQuestions(body.vragen)
        }
        const sanitized = sanitizeProductionPatchForClient(ctx, id, patch)
        if (typeof sanitized === 'string') {
          res.status(403).json({ error: sanitized })
          return
        }
        patch = sanitized
      } else if (isCrew(ctx)) {
        if (body.naam !== undefined) patch.naam = clipText(body.naam, MAX_SHORT_TEXT)
        if (body.generalTitel !== undefined) patch.generalTitel = clipText(body.generalTitel, MAX_GENERAL_TITLE_CHARS)
        if (body.png16x9 !== undefined) {
          const next = sanitizeImageUrl(body.png16x9)
          if (String(body.png16x9 || '').trim() && !next) {
            res.status(400).json({ error: 'PNG 16:9 could not be saved. Use a PNG under 3 MB, or upload again after Cloudinary is working.' })
            return
          }
          patch.png16x9 = next
        }
        if (body.png9x16 !== undefined) {
          const next = sanitizeImageUrl(body.png9x16)
          if (String(body.png9x16 || '').trim() && !next) {
            res.status(400).json({ error: 'PNG 9:16 could not be saved. Use a PNG under 3 MB, or upload again after Cloudinary is working.' })
            return
          }
          patch.png9x16 = next
        }
        if (body.png4x5 !== undefined) {
          const next = sanitizeImageUrl(body.png4x5)
          if (String(body.png4x5 || '').trim() && !next) {
            res.status(400).json({ error: 'PNG 4:5 could not be saved. Use a PNG under 3 MB, or upload again after Cloudinary is working.' })
            return
          }
          patch.png4x5 = next
        }
        if (body.datum !== undefined) patch.datum = clipText(body.datum, 20)
        if (body.startTijd !== undefined) patch.startTijd = clipText(body.startTijd, 20)
        if (body.eindDatum !== undefined) patch.eindDatum = clipText(body.eindDatum, 20)
        if (body.eindTijd !== undefined) patch.eindTijd = clipText(body.eindTijd, 20)
        if (body.status !== undefined) patch.status = String(body.status) as ProductieStatus
        if (body.locatie !== undefined) patch.locatie = clipText(body.locatie, MAX_SHORT_TEXT)
        if (body.land !== undefined) patch.land = clipText(body.land, MAX_SHORT_TEXT)
        if (body.clientId !== undefined) patch.clientId = clipText(body.clientId, 64)
        if (body.supervisor !== undefined) patch.supervisor = clipText(body.supervisor, MAX_SHORT_TEXT)
        if (body.crew2 !== undefined) patch.crew2 = clipText(body.crew2, MAX_SHORT_TEXT)
        if (body.crew3 !== undefined) patch.crew3 = clipText(body.crew3, MAX_SHORT_TEXT)
        if (body.crew4 !== undefined) patch.crew4 = clipText(body.crew4, MAX_SHORT_TEXT)
        if (body.crew5 !== undefined) patch.crew5 = clipText(body.crew5, MAX_SHORT_TEXT)
        if (body.callsheet !== undefined) patch.callsheet = sanitizeCallsheet(body.callsheet)
        if (body.vragen !== undefined) patch.vragen = sanitizeQuestions(body.vragen)
        if (body.clientPassword !== undefined) {
          const raw = String(body.clientPassword).trim()
          if (raw && (raw.length < MIN_CLIENT_PASSWORD_LEN || raw.length > MAX_PASSWORD_LEN)) {
            res.status(400).json({ error: `Client password must be ${MIN_CLIENT_PASSWORD_LEN}–${MAX_PASSWORD_LEN} characters` })
            return
          }
          patch.clientPassword = raw
        }

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
      if (!await requireCrew(req, res)) return
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
