import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isClient, intakeLockApplies } from './auth.js'
import {
  createGuest,
  ensureSchema,
  fetchGuests,
  fetchProducties,
} from './database.js'
import {
  filterGuestsForAuth,
  productionNameAllowed,
  requireLogin,
  sanitizeGuestCreateForClient,
} from './permissions.js'
import {
  clipText,
  MAX_LONG_TEXT,
  MAX_MEDIUM_TEXT,
  MAX_SHORT_TEXT,
  sanitizeImageUrl,
  sanitizeQuestions,
} from './sanitize.js'
import { MAX_INTERVIEW_TITLE_CHARS, type Gast } from './types.js'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ctx = await requireLogin(req, res)
  if (!ctx) return

  try {
    await ensureSchema()
    const productions = await fetchProducties(true)

    if (req.method === 'GET') {
      const guests = filterGuestsForAuth(ctx, await fetchGuests(), productions)
      res.status(200).json({ guests })
      return
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      if (isClient(ctx)) {
        const sanitized = sanitizeGuestCreateForClient(body)
        if (typeof sanitized === 'string') {
          res.status(400).json({ error: sanitized })
          return
        }
      }

      const productieNaam = String(body.productieNaam || '')
      if (!productionNameAllowed(ctx, productions, productieNaam)) {
        res.status(403).json({ error: 'Production not allowed' })
        return
      }

      const questions = sanitizeQuestions(body.questions)
      const type = clipText(body.type, 40)
      const intakeComplete = Boolean(body.intakeComplete) && intakeLockApplies(type)
      const guest: Omit<Gast, 'createdAt' | 'updatedAt'> = {
        id: uid(),
        productieNaam: clipText(productieNaam, MAX_SHORT_TEXT),
        type,
        naam: clipText(body.naam, MAX_SHORT_TEXT),
        functie: clipText(body.functie, MAX_SHORT_TEXT),
        organisatie: clipText(body.organisatie, MAX_SHORT_TEXT),
        planning: clipText(body.planning, MAX_MEDIUM_TEXT),
        gedeeld: Boolean(body.gedeeld),
        introTekst: clipText(body.introTekst, MAX_LONG_TEXT),
        outroTekst: clipText(body.outroTekst, MAX_LONG_TEXT),
        serieNaam: clipText(body.serieNaam, MAX_MEDIUM_TEXT),
        interviewTitel: clipText(body.interviewTitel, MAX_INTERVIEW_TITLE_CHARS),
        screenshot16x9: sanitizeImageUrl(body.screenshot16x9),
        screenshot9x16: sanitizeImageUrl(body.screenshot9x16),
        screenshot4x5: sanitizeImageUrl(body.screenshot4x5),
        thumbnail16x9: sanitizeImageUrl(body.thumbnail16x9),
        thumbnail9x16: sanitizeImageUrl(body.thumbnail9x16),
        thumbnail4x5: sanitizeImageUrl(body.thumbnail4x5),
        questions,
        moderator: clipText(body.moderator, MAX_SHORT_TEXT),
        moderatorFunctie: clipText(body.moderatorFunctie, MAX_SHORT_TEXT),
        intakeComplete,
        status: 'Entered',
        regienummer: '',
        datum: clipText(body.datum, 20),
        tijd: clipText(body.tijd, 20),
      }
      if (!guest.naam) {
        res.status(400).json({ error: 'Name is required' })
        return
      }
      const created = await createGuest(guest)
      res.status(201).json({ guest: created })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview guests error:', err)
    res.status(500).json({ error: 'Action failed' })
  }
}
