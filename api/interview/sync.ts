import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchGuests, fetchProducties, fetchSettings, ensureSchema } from './_database'
import { seedDemoData } from './_demoSeed'
import { requireAuth } from './_session'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!requireAuth(req, res)) return

  try {
    await ensureSchema()

    let guests = await fetchGuests()
    let productions = await fetchProducties(true)

    if (guests.length === 0 && productions.length === 0) {
      await seedDemoData()
      guests = await fetchGuests()
      productions = await fetchProducties(true)
    }

    const settings = await fetchSettings()

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
