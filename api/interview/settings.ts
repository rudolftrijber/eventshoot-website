import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from './session.js'
import { ensureSchema, fetchSettings, updateSettings } from './database.js'

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return

  try {
    await ensureSchema()

    if (req.method === 'GET') {
      const settings = await fetchSettings()
      res.status(200).json({ settings })
      return
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req)
      const maxChars = parseInt(String(body.maxChars || '40'), 10)
      if (Number.isNaN(maxChars) || maxChars < 10 || maxChars > 200) {
        res.status(400).json({ error: 'Ongeldige tekenlimiet' })
        return
      }
      const settings = await updateSettings(maxChars)
      res.status(200).json({ settings })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('interview settings error:', err)
    res.status(500).json({ error: 'Actie mislukt' })
  }
}
