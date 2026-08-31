import type { VercelRequest, VercelResponse } from '@vercel/node'
import { intakeLockApplies } from './auth.js'
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
import { isClient } from './auth.js'
import type { Gast } from './types.js'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ctx = requireLogin(req, res)
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

      const questions = Array.isArray(body.questions) ? body.questions.map(String) : []
      const type = String(body.type || '')
      const intakeComplete = Boolean(body.intakeComplete) && intakeLockApplies(type)
      const guest: Omit<Gast, 'createdAt' | 'updatedAt'> = {
        id: uid(),
        productieNaam,
        type,
        naam: String(body.naam || '').trim(),
        functie: String(body.functie || '').trim(),
        organisatie: String(body.organisatie || '').trim(),
        planning: String(body.planning || ''),
        gedeeld: Boolean(body.gedeeld),
        introTekst: String(body.introTekst || '').trim(),
        outroTekst: String(body.outroTekst || '').trim(),
        serieNaam: String(body.serieNaam || '').trim(),
        interviewTitel: String(body.interviewTitel || '').trim().slice(0, 30),
        screenshot16x9: String(body.screenshot16x9 || '').trim(),
        screenshot9x16: String(body.screenshot9x16 || '').trim(),
        screenshot4x5: String(body.screenshot4x5 || '').trim(),
        thumbnail16x9: String(body.thumbnail16x9 || '').trim(),
        thumbnail9x16: String(body.thumbnail9x16 || '').trim(),
        thumbnail4x5: String(body.thumbnail4x5 || '').trim(),
        questions,
        intakeComplete,
        status: 'Entered',
        regienummer: '',
        datum: '',
        tijd: '',
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
