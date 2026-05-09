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

  // Debug: log env vars (verwijder na testen)
  console.log('cloud_name:', process.env.CLOUDINARY_CLOUD_NAME)
  console.log('api_key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING')
  console.log('api_secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING')
  console.log('slug:', slug)

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: slug,
      max_results: 500,
    })

    console.log('resources found:', result.resources.length)

    const photos = result.resources
      .filter((r: { resource_type: string }) => r.resource_type === 'image')
      .sort((a: { public_id: string }, b: { public_id: string }) => a.public_id.localeCompare(b.public_id))
      .map((r: { secure_url: string }) => r.secure_url)

    return res.status(200).json({
      slug,
      title: slug,
      subtitle: 'Jouw foto\'s van Eventshoot.nl',
      heroImage: photos[0] ?? '',
      videos: [],
      photos,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Error:', message)
    return res.status(500).json({ error: message })
  }
}
