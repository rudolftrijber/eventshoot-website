import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireCrew } from './permissions.js'
import {
  createProductie,
  ensureSchema,
  fetchProducties,
} from './database.js'
import { MAX_GENERAL_TITLE_CHARS, type Productie } from './types.js'
import {
  clipText,
  MAX_PASSWORD_LEN,
  MAX_SHORT_TEXT,
  MIN_CLIENT_PASSWORD_LEN,
  sanitizeImageUrl,
  sanitizeQuestions,
} from './sanitize.js'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!await requireCrew(req, res)) return

  try {
    await ensureSchema()

    if (req.method === 'GET') {
      const includeArchived = req.query.archived === '1'
      const productions = await fetchProducties(includeArchived)
      res.status(200).json({ productions })
      return
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const vragen = sanitizeQuestions(body.vragen)
      const productie: Omit<Productie, 'createdAt' | 'updatedAt' | 'archivedAt' | 'hasClientPassword'> = {
        id: clipText(body.id || uid(), 64) || uid(),
        naam: clipText(body.naam, MAX_SHORT_TEXT),
        datum: clipText(body.datum, 20),
        startTijd: clipText(body.startTijd, 20),
        eindDatum: clipText(body.eindDatum, 20),
        eindTijd: clipText(body.eindTijd, 20),
        status: (String(body.status || 'OPT') as Productie['status']),
        locatie: clipText(body.locatie, MAX_SHORT_TEXT),
        land: clipText(body.land, MAX_SHORT_TEXT),
        supervisor: clipText(body.supervisor || 'Rolf Trijber', MAX_SHORT_TEXT),
        crew2: clipText(body.crew2 || 'N.V.T.', MAX_SHORT_TEXT),
        crew3: clipText(body.crew3 || 'N.V.T.', MAX_SHORT_TEXT),
        crew4: clipText(body.crew4 || 'N.V.T.', MAX_SHORT_TEXT),
        crew5: clipText(body.crew5 || 'N.V.T.', MAX_SHORT_TEXT),
        vragen,
        generalTitel: clipText(body.generalTitel, MAX_GENERAL_TITLE_CHARS),
        png16x9: sanitizeImageUrl(body.png16x9),
        png9x16: sanitizeImageUrl(body.png9x16),
        png4x5: sanitizeImageUrl(body.png4x5),
      }
      if (!productie.naam) {
        res.status(400).json({ error: 'Production name is required' })
        return
      }
      const clientPassword = clipText(body.clientPassword, MAX_PASSWORD_LEN)
      if (clientPassword && clientPassword.length < MIN_CLIENT_PASSWORD_LEN) {
        res.status(400).json({ error: `Client password must be at least ${MIN_CLIENT_PASSWORD_LEN} characters` })
        return
      }
      const created = await createProductie(productie, clientPassword || undefined)
      res.status(201).json({ production: created })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview productions error:', err)
    const message = err instanceof Error ? err.message : ''
    if (message.includes('interview_producties_naam_active_idx') || message.toLowerCase().includes('duplicate key')) {
      res.status(409).json({ error: 'A production with this name already exists' })
      return
    }
    res.status(500).json({ error: 'Action failed' })
  }
}
