import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface KlantVideo {
  title: string
  url: string
  type?: 'vimeo' | 'iframe' | 'link'
}

interface KlantConfig {
  slug: string
  title: string
  subtitle: string
  cloudinaryFolder?: string
  localFolder?: string
  heroImage?: string
  reversePhotos?: boolean
  eyebrow?: string
  videos?: KlantVideo[]
}

interface KlantPhoto {
  url: string
  thumbUrl: string
  filename: string
}

function loadConfig(slug: string): KlantConfig | null {
  const paths = [
    join(process.cwd(), 'public', 'klanten', `${slug}.json`),
    join(process.cwd(), 'dist', 'klanten', `${slug}.json`),
  ]

  for (const path of paths) {
    if (!existsSync(path)) continue
    return JSON.parse(readFileSync(path, 'utf8')) as KlantConfig
  }

  return null
}

function filenameFromPublicId(publicId: string, format: string) {
  const base = publicId.split('/').pop() || publicId
  return base.includes('.') ? base : `${base}.${format}`
}

function loadLocalPhotos(folder: string): KlantPhoto[] {
  const paths = [
    join(process.cwd(), 'public', 'def', folder, 'manifest.json'),
    join(process.cwd(), 'dist', 'def', folder, 'manifest.json'),
  ]

  for (const path of paths) {
    if (!existsSync(path)) continue
    const manifest = JSON.parse(readFileSync(path, 'utf8')) as { photos: string[] }
    return manifest.photos.map((photoPath) => {
      const filename = photoPath.split('/').pop() || photoPath
      return {
        url: photoPath,
        thumbUrl: photoPath,
        filename,
      }
    })
  }

  return []
}

async function loadCloudinaryPhotos(folder: string): Promise<KlantPhoto[]> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return []

  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: 500,
  })

  return result.resources
    .filter((r: { resource_type: string }) => r.resource_type === 'image')
    .sort((a: { public_id: string }, b: { public_id: string }) => a.public_id.localeCompare(b.public_id))
    .map((r: { secure_url: string; public_id: string; format: string }) => {
      const filename = filenameFromPublicId(r.public_id, r.format)
      const thumbUrl = cloudinary.url(r.public_id, {
        width: 800,
        quality: 'auto',
        fetch_format: 'auto',
        secure: true,
      })
      return {
        url: r.secure_url,
        thumbUrl,
        filename,
      }
    })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = typeof req.query.slug === 'string' ? req.query.slug.toLowerCase() : ''
  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' })
  }

  const config = loadConfig(slug)
  if (!config) {
    return res.status(404).json({ error: 'Klant niet gevonden' })
  }

  try {
    const folder = config.cloudinaryFolder || config.localFolder || slug
    let photos = await loadCloudinaryPhotos(folder)

    if (!photos.length && config.localFolder) {
      photos = loadLocalPhotos(config.localFolder)
    }

    if (config.reversePhotos) {
      photos.reverse()
    }

    const heroImage = config.heroImage || photos[0]?.url || ''

    return res.status(200).json({
      slug: config.slug,
      title: config.title,
      subtitle: config.subtitle,
      eyebrow: config.eyebrow,
      heroImage,
      videos: config.videos ?? [],
      photos,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return res.status(500).json({ error: message })
  }
}
