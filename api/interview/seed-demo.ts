import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from './session.js'
import { seedDemoData } from './demoSeed.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const result = await seedDemoData()
    if (!result.created) {
      res.status(200).json({
        ok: true,
        message: 'Demo-data staat er al.',
        ...result,
      })
      return
    }
    res.status(201).json({
      ok: true,
      message: `${result.producties} producties en ${result.gasten} gasten toegevoegd.`,
      ...result,
    })
  } catch (err) {
    console.error('interview seed-demo error:', err)
    res.status(500).json({ error: 'Demo-data laden mislukt' })
  }
}
