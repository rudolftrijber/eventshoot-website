import type { VercelRequest, VercelResponse } from '@vercel/node'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing slug' })
  }

  try {
    // Laad metadata JSON (titel, subtitel, video's)
    const meta = await import(`../../src/data/klanten/${slug}.json`).catch(() => null)

    // Haal alle foto's op uit de Cloudinary-map
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: slug,
      max_results: 500,
    })

    const photos = result.resources
      .sort((a: { public_id: string }, b: { public_id: string }) => a.public_id.localeCompare(b.public_id))
      .map((r: { secure_url: string }) => r.secure_url)

    return res.status(200).json({
      ...(meta?.default ?? {}),
      photos,
    })
  } catch (err) {
    console.error(err)
    return res.status(404).json({ error: 'Klant niet gevonden' })
  }
}
