import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from './_session'
import {
  createProductie,
  ensureSchema,
  fetchProducties,
} from './_database'
import type { Productie } from './_types'

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
      const includeArchived = req.query.archived === '1'
      const productions = await fetchProducties(includeArchived)
      res.status(200).json({ productions })
      return
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const vragen = Array.isArray(body.vragen) ? body.vragen.map(String) : []
      const productie: Omit<Productie, 'createdAt' | 'updatedAt' | 'archivedAt'> = {
        id: String(body.id || uid()),
        naam: String(body.naam || '').trim(),
        datum: String(body.datum || ''),
        status: (String(body.status || 'Gepland') as Productie['status']),
        vragen,
      }
      if (!productie.naam) {
        res.status(400).json({ error: 'Productienaam is verplicht' })
        return
      }
      const created = await createProductie(productie)
      res.status(201).json({ production: created })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview productions error:', err)
    res.status(500).json({ error: 'Actie mislukt' })
  }
}
