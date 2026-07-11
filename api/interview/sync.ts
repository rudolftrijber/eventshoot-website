import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { requireAuth } = await import('./_session')
  if (!requireAuth(req, res)) return

  try {
    const {
      ensureSchema,
      fetchGuests,
      fetchProducties,
      fetchSettings,
    } = await import('./_database')
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
