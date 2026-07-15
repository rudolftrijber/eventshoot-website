import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isCrew } from './auth.js'
import { fetchGuests, fetchProducties, fetchSettings, ensureSchema } from './database.js'
import { seedDemoData } from './demoSeed.js'
import { filterGuestsForAuth, filterProductionsForAuth, requireLogin } from './permissions.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const ctx = requireLogin(req, res)
  if (!ctx) return

  try {
    await ensureSchema()

    let guests = await fetchGuests()
    let productions = await fetchProducties(true)

    if (isCrew(ctx) && guests.length === 0 && productions.length === 0) {
      await seedDemoData()
      guests = await fetchGuests()
      productions = await fetchProducties(true)
    }

    productions = filterProductionsForAuth(ctx, productions)
    guests = filterGuestsForAuth(ctx, guests, productions)
    const settings = await fetchSettings()

    res.status(200).json({
      guests,
      productions,
      settings,
      role: ctx.role,
      productionIds: ctx.productionIds,
      serverTime: new Date().toISOString(),
    })
  } catch (err) {
    console.error('interview sync error:', err)
    res.status(500).json({ error: 'Sync failed' })
  }
}
