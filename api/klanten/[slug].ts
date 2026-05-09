import type { VercelRequest, VercelResponse } from '@vercel/node'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { slug } = req.query
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing slug' })
  }

  // Lees metadata JSON (case-insensitief: probeer exact en lowercase)
  let meta: Record<string, unknown> = {}
  const dataDir = path.join(process.cwd(), 'src', 'data', 'klanten')
  const candidates = [slug, slug.toLowerCase(), slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase()]
  for (const name of candidates) {
    const filePath = path.join(dataDir, `${name}.json`)
    if (fs.existsSync(filePath)) {
      meta = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      break
    }
  }

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: slug + '/',
      max_results: 500,
    })

    const photos = result.resources
      .filter((r: { resource_type: string }) => r.resource_type === 'image')
      .sort((a: { public_id: string }, b: { public_id: string }) => a.public_id.localeCompare(b.public_id))
      .map((r: { secure_url: string }) => r.secure_url)

    return res.status(200).json({ ...meta, photos })
  } catch (err) {
    console.error('Cloudinary error:', err)
    return res.status(500).json({ error: 'Cloudinary fout', detail: String(err) })
  }
}
