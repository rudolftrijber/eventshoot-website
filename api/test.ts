import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
  })
}
