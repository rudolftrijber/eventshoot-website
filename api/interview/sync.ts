import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../_lib/interview/auth'
import {
  ensureSchema,
  fetchGuests,
  fetchProducties,
  fetchSettings,
} from '../_lib/interview/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  if (!requireAuth(req, res)) return

  try {
    await ensureSchema()
    const [guests, productions, settings] = await Promise.all([
      fetchGuests(),
      fetchProducties(true),
      fetchSettings(),
    ])
    res.status(200).json({
      guests,
      productions,
      settings,
      serverTime: new Date().toISOString(),
    })
  } catch (err) {
    console.error('interview sync error:', err)
    res.status(500).json({ error: 'Sync mislukt' })
  }
}
