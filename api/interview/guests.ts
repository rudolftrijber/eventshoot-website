import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from './session'
import {
  createGuest,
  ensureSchema,
  fetchGuests,
} from './database'
import type { Gast } from './types'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return

  try {
    await ensureSchema()

    if (req.method === 'GET') {
      const guests = await fetchGuests()
      res.status(200).json({ guests })
      return
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const questions = Array.isArray(body.questions) ? body.questions.map(String) : []
      const guest: Omit<Gast, 'createdAt' | 'updatedAt'> = {
        id: uid(),
        productieNaam: String(body.productieNaam || ''),
        type: String(body.type || ''),
        naam: String(body.naam || '').trim(),
        functie: String(body.functie || '').trim(),
        planning: String(body.planning || ''),
        gedeeld: Boolean(body.gedeeld),
        questions,
        status: 'Ingevoerd',
        regienummer: '',
        datum: '',
        tijd: '',
      }
      if (!guest.naam) {
        res.status(400).json({ error: 'Naam is verplicht' })
        return
      }
      const created = await createGuest(guest)
      res.status(201).json({ guest: created })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview guests error:', err)
    res.status(500).json({ error: 'Actie mislukt' })
  }
}
