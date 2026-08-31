import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isClient, isCrew } from '../auth.js'
import {
  deleteGuest,
  ensureSchema,
  fetchGuests,
  fetchProducties,
  finalizeGuest,
  updateGuest,
} from '../database.js'
import {
  filterGuestsForAuth,
  productionNameAllowed,
  requireLogin,
  sanitizeGuestPatchForClient,
} from '../permissions.js'
import type { GastStatus } from '../types.js'

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ctx = requireLogin(req, res)
  if (!ctx) return

  const id = String(req.query.id || '')
  if (!id) {
    res.status(400).json({ error: 'ID missing' })
    return
  }

  try {
    await ensureSchema()
    const productions = await fetchProducties(true)
    const guests = await fetchGuests()
    const guest = guests.find((g) => g.id === id)
    if (!guest) {
      res.status(404).json({ error: 'Guest not found' })
      return
    }

    const visible = filterGuestsForAuth(ctx, [guest], productions)
    if (!visible.length) {
      res.status(403).json({ error: 'Guest not allowed' })
      return
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req)

      if (body.action === 'finalize') {
        if (!isCrew(ctx)) {
          res.status(403).json({ error: 'Crew access only' })
          return
        }
        guest.naam = String(body.naam ?? guest.naam).trim()
        guest.functie = String(body.functie ?? guest.functie).trim()
        guest.organisatie = String(body.organisatie ?? guest.organisatie).trim()
        const finalized = await finalizeGuest(guest)
        res.status(200).json({ guest: finalized })
        return
      }

      const patch: Record<string, unknown> = {}
      if (body.productieNaam !== undefined) patch.productieNaam = String(body.productieNaam)
      if (body.type !== undefined) patch.type = String(body.type)
      if (body.naam !== undefined) patch.naam = String(body.naam)
      if (body.functie !== undefined) patch.functie = String(body.functie)
      if (body.organisatie !== undefined) patch.organisatie = String(body.organisatie)
      if (body.planning !== undefined) patch.planning = String(body.planning)
      if (body.gedeeld !== undefined) patch.gedeeld = Boolean(body.gedeeld)
      if (body.introTekst !== undefined) patch.introTekst = String(body.introTekst)
      if (body.outroTekst !== undefined) patch.outroTekst = String(body.outroTekst)
      if (body.serieNaam !== undefined) patch.serieNaam = String(body.serieNaam)
      if (body.interviewTitel !== undefined) patch.interviewTitel = String(body.interviewTitel).trim().slice(0, 30)
      if (body.screenshot16x9 !== undefined) patch.screenshot16x9 = String(body.screenshot16x9).trim()
      if (body.screenshot9x16 !== undefined) patch.screenshot9x16 = String(body.screenshot9x16).trim()
      if (body.screenshot4x5 !== undefined) patch.screenshot4x5 = String(body.screenshot4x5).trim()
      if (body.thumbnail16x9 !== undefined) patch.thumbnail16x9 = String(body.thumbnail16x9).trim()
      if (body.thumbnail9x16 !== undefined) patch.thumbnail9x16 = String(body.thumbnail9x16).trim()
      if (body.thumbnail4x5 !== undefined) patch.thumbnail4x5 = String(body.thumbnail4x5).trim()
      if (body.questions !== undefined) {
        patch.questions = Array.isArray(body.questions) ? body.questions.map(String) : []
      }
      if (body.intakeComplete !== undefined) patch.intakeComplete = Boolean(body.intakeComplete)
      if (body.status !== undefined) patch.status = String(body.status) as GastStatus
      if (body.regienummer !== undefined) patch.regienummer = String(body.regienummer)
      if (body.datum !== undefined) patch.datum = String(body.datum)
      if (body.tijd !== undefined) patch.tijd = String(body.tijd)

      if (isClient(ctx)) {
        const sanitized = sanitizeGuestPatchForClient(guest, patch)
        if (typeof sanitized === 'string') {
          res.status(403).json({ error: sanitized })
          return
        }
        if (patch.productieNaam !== undefined
          && !productionNameAllowed(ctx, productions, String(patch.productieNaam))) {
          res.status(403).json({ error: 'Production not allowed' })
          return
        }
      }

      const updated = await updateGuest(id, patch)
      if (!updated) {
        res.status(404).json({ error: 'Guest not found' })
        return
      }
      res.status(200).json({ guest: updated })
      return
    }

    if (req.method === 'DELETE') {
      if (isClient(ctx)) {
        if (guest.intakeComplete) {
          res.status(403).json({ error: 'Unlock intake before deleting' })
          return
        }
      }
      const ok = await deleteGuest(id)
      if (!ok) {
        res.status(404).json({ error: 'Guest not found' })
        return
      }
      res.status(200).json({ ok: true })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview guest id error:', err)
    res.status(500).json({ error: 'Action failed' })
  }
}
