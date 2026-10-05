import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isCrew } from './auth.js'
import { fetchGuests, fetchProducties, fetchSettings, ensureSchema } from './database.js'
import { fetchClients, fetchCrew } from './directory.js'
import { seedDemoData } from './demoSeed.js'
import { filterGuestsForAuth, filterProductionsForAuth, requireLogin } from './permissions.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

    const ctx = await requireLogin(req, res)
  if (!ctx) return

  try {
    await ensureSchema()

    const [allGuests, allProductions, settings] = await Promise.all([
      fetchGuests(),
      fetchProducties(true),
      fetchSettings(),
    ])
    let guests = allGuests
    let productions = allProductions

    if (isCrew(ctx) && guests.length === 0 && productions.length === 0) {
      await seedDemoData()
      const [seededGuests, seededProductions] = await Promise.all([
        fetchGuests(),
        fetchProducties(true),
      ])
      guests = seededGuests
      productions = seededProductions
    }

    productions = filterProductionsForAuth(ctx, productions)
    guests = filterGuestsForAuth(ctx, guests, productions)
    const [clients, crew] = isCrew(ctx)
      ? await Promise.all([fetchClients(), fetchCrew()])
      : [[], []]

    res.status(200).json({
      guests,
      productions,
      settings,
      clients,
      crew,
      role: ctx.role,
      productionIds: ctx.productionIds,
      serverTime: new Date().toISOString(),
    })
  } catch (err) {
    console.error('interview sync error:', err)
    res.status(500).json({ error: 'Sync failed' })
  }
}
