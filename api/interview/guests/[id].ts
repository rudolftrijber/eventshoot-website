import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../../../lib/interview/auth'
import {
  deleteGuest,
  ensureSchema,
  finalizeGuest,
  fetchGuests,
  updateGuest,
} from '../../../lib/interview/db'
import type { GastStatus } from '../../../lib/interview/types'

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

      if (body.productieNaam !== undefined) patch.productieNaam = String(body.productieNaam)
      if (body.type !== undefined) patch.type = String(body.type)
      if (body.naam !== undefined) patch.naam = String(body.naam)
      if (body.functie !== undefined) patch.functie = String(body.functie)
      if (body.planning !== undefined) patch.planning = String(body.planning)
      if (body.gedeeld !== undefined) patch.gedeeld = Boolean(body.gedeeld)
      if (body.questions !== undefined) patch.questions = Array.isArray(body.questions) ? body.questions.map(String) : []
      if (body.status !== undefined) patch.status = String(body.status) as GastStatus
      if (body.regienummer !== undefined) patch.regienummer = String(body.regienummer)
      if (body.datum !== undefined) patch.datum = String(body.datum)
      if (body.tijd !== undefined) patch.tijd = String(body.tijd)

      if (body.action === 'finalize') {
        const guests = await fetchGuests()
        const guest = guests.find((g) => g.id === id)
        if (!guest) {
          res.status(404).json({ error: 'Gast niet gevonden' })
          return
        }
        guest.naam = String(body.naam ?? guest.naam).trim()
        guest.functie = String(body.functie ?? guest.functie).trim()
        const finalized = await finalizeGuest(guest)
        res.status(200).json({ guest: finalized })
        return
      }

      const updated = await updateGuest(id, patch)
      if (!updated) {
        res.status(404).json({ error: 'Gast niet gevonden' })
        return
      }
      res.status(200).json({ guest: updated })
      return
    }

    if (req.method === 'DELETE') {
      const ok = await deleteGuest(id)
      if (!ok) {
        res.status(404).json({ error: 'Gast niet gevonden' })
        return
      }
      res.status(200).json({ ok: true })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview guest id error:', err)
    res.status(500).json({ error: 'Actie mislukt' })
  }
}
