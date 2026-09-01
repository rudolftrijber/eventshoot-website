import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireCrew } from './permissions.js'
import {
  createProductie,
  ensureSchema,
  fetchProducties,
} from './database.js'
import { MAX_GENERAL_TITLE_CHARS, type Productie } from './types.js'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireCrew(req, res)) return

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
      const vragen = Array.isArray(body.vragen) ? body.vragen.map(String) : []
      const productie: Omit<Productie, 'createdAt' | 'updatedAt' | 'archivedAt' | 'hasClientPassword'> = {
        id: String(body.id || uid()),
        naam: String(body.naam || '').trim(),
        datum: String(body.datum || ''),
        startTijd: String(body.startTijd || ''),
        eindDatum: String(body.eindDatum || ''),
        eindTijd: String(body.eindTijd || ''),
        status: (String(body.status || 'OPT') as Productie['status']),
        locatie: String(body.locatie || '').trim(),
        land: String(body.land || '').trim(),
        supervisor: String(body.supervisor || 'Rolf Trijber'),
        crew2: String(body.crew2 || 'N.V.T.'),
        crew3: String(body.crew3 || 'N.V.T.'),
        crew4: String(body.crew4 || 'N.V.T.'),
        crew5: String(body.crew5 || 'N.V.T.'),
        vragen,
        generalTitel: String(body.generalTitel || '').trim().slice(0, MAX_GENERAL_TITLE_CHARS),
        png16x9: String(body.png16x9 || '').trim(),
        png9x16: String(body.png9x16 || '').trim(),
        png4x5: String(body.png4x5 || '').trim(),
      }
      if (!productie.naam) {
        res.status(400).json({ error: 'Production name is required' })
        return
      }
      const clientPassword = String(body.clientPassword || '').trim()
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
