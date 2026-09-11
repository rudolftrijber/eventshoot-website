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
import { MAX_INTERVIEW_TITLE_CHARS, type GastStatus } from '../types.js'
import {
  clipText,
  MAX_LONG_TEXT,
  MAX_MEDIUM_TEXT,
  MAX_SHORT_TEXT,
  sanitizeImageUrl,
  sanitizeQuestions,
} from '../sanitize.js'

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ctx = await requireLogin(req, res)
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
      res.status(404).json({ error: 'Guest not found' })
      return
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req)

      if (body.action === 'finalize') {
        if (!isCrew(ctx)) {
          res.status(403).json({ error: 'Crew access only' })
          return
        }
        guest.naam = clipText(body.naam ?? guest.naam, MAX_SHORT_TEXT)
        guest.functie = clipText(body.functie ?? guest.functie, MAX_SHORT_TEXT)
        guest.organisatie = clipText(body.organisatie ?? guest.organisatie, MAX_SHORT_TEXT)
        const finalized = await finalizeGuest(guest)
        res.status(200).json({ guest: finalized })
        return
      }

      const patch: Record<string, unknown> = {}
      if (body.productieNaam !== undefined) patch.productieNaam = clipText(body.productieNaam, MAX_SHORT_TEXT)
      if (body.type !== undefined) patch.type = clipText(body.type, 40)
      if (body.naam !== undefined) patch.naam = clipText(body.naam, MAX_SHORT_TEXT)
      if (body.functie !== undefined) patch.functie = clipText(body.functie, MAX_SHORT_TEXT)
      if (body.organisatie !== undefined) patch.organisatie = clipText(body.organisatie, MAX_SHORT_TEXT)
      if (body.planning !== undefined) patch.planning = clipText(body.planning, MAX_MEDIUM_TEXT)
      if (body.gedeeld !== undefined) patch.gedeeld = Boolean(body.gedeeld)
      if (body.introTekst !== undefined) patch.introTekst = clipText(body.introTekst, MAX_LONG_TEXT)
      if (body.outroTekst !== undefined) patch.outroTekst = clipText(body.outroTekst, MAX_LONG_TEXT)
      if (body.serieNaam !== undefined) patch.serieNaam = clipText(body.serieNaam, MAX_MEDIUM_TEXT)
      if (body.interviewTitel !== undefined) patch.interviewTitel = clipText(body.interviewTitel, MAX_INTERVIEW_TITLE_CHARS)
      if (body.screenshot16x9 !== undefined) patch.screenshot16x9 = sanitizeImageUrl(body.screenshot16x9)
      if (body.screenshot9x16 !== undefined) patch.screenshot9x16 = sanitizeImageUrl(body.screenshot9x16)
      if (body.screenshot4x5 !== undefined) patch.screenshot4x5 = sanitizeImageUrl(body.screenshot4x5)
      if (body.thumbnail16x9 !== undefined) patch.thumbnail16x9 = sanitizeImageUrl(body.thumbnail16x9)
      if (body.thumbnail9x16 !== undefined) patch.thumbnail9x16 = sanitizeImageUrl(body.thumbnail9x16)
      if (body.thumbnail4x5 !== undefined) patch.thumbnail4x5 = sanitizeImageUrl(body.thumbnail4x5)
      if (body.questions !== undefined) patch.questions = sanitizeQuestions(body.questions)
      if (body.moderator !== undefined) patch.moderator = clipText(body.moderator, MAX_SHORT_TEXT)
      if (body.moderatorFunctie !== undefined) patch.moderatorFunctie = clipText(body.moderatorFunctie, MAX_SHORT_TEXT)
      if (body.intakeComplete !== undefined) patch.intakeComplete = Boolean(body.intakeComplete)
      if (body.status !== undefined) patch.status = String(body.status) as GastStatus
      if (body.regienummer !== undefined) patch.regienummer = clipText(body.regienummer, 20)
      if (body.datum !== undefined) patch.datum = clipText(body.datum, 20)
      if (body.tijd !== undefined) patch.tijd = clipText(body.tijd, 20)

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
