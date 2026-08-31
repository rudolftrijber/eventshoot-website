import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { v2 as cloudinary } from 'cloudinary'
import { requireLogin } from './permissions.js'
import { isPngRatioId, parseDataUrlImage, assertImageRatio, type ScreenshotExt } from './png.js'

const KINDS = ['production-png', 'guest-screenshot', 'guest-thumbnail'] as const
type UploadKind = (typeof KINDS)[number]

/** Vercel cannot write to /public. If Cloudinary fails, small files stay as data URLs. */
const DATA_URL_MAX_BYTES = 700 * 1024

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function cloudinaryReady(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME
    && process.env.CLOUDINARY_API_KEY
    && process.env.CLOUDINARY_API_SECRET,
  )
}

async function storeLocalImage(
  buf: Buffer,
  kind: UploadKind,
  ratio: string,
  ext: ScreenshotExt,
  filename?: string,
): Promise<string> {
  const dir = join(process.cwd(), 'public', 'interview-uploads')
  await mkdir(dir, { recursive: true })
  const name = sanitizeStoredName(filename, kind, ratio, ext)
  await writeFile(join(dir, name), buf)
  return `/interview-uploads/${name}`
}

async function storeCloudinaryImage(
  dataUrl: string,
  kind: UploadKind,
  ratio: string,
  filename?: string,
): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  const publicId = sanitizeStoredName(filename, kind, ratio, 'jpg').replace(/\.jpe?g$/i, '')
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: `interview-app/${kind}/${ratio}`,
    resource_type: 'image',
    ...(kind === 'production-png' ? { format: 'png' } : {}),
    ...(kind === 'guest-thumbnail' && filename ? { public_id: publicId } : {}),
  })
  return String(result.secure_url || result.url)
}

function sanitizeStoredName(
  raw: string | undefined,
  kind: UploadKind,
  ratio: string,
  ext: ScreenshotExt,
): string {
  const unique = uid()
  if (kind === 'guest-thumbnail' && raw) {
    let base = String(raw).trim().replace(/\\/g, '/').split('/').pop() || ''
    base = base.replace(/\.[^.]+$/, '')
    base = base.replace(/[^\p{L}\p{N}_-]+/gu, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    if (base) return `${base}-${unique}.${ext}`
  }
  return `${kind}-${ratio}-${unique}.${ext}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const ctx = requireLogin(req, res)
  if (!ctx) return

  try {
    const body = parseBody(req)
    const kind = String(body.kind || '') as UploadKind
    const ratio = String(body.ratio || '')
    const dataUrl = String(body.dataUrl || '')
    const filename = typeof body.filename === 'string' ? body.filename : ''

    if (!KINDS.includes(kind)) {
      res.status(400).json({ error: 'Unknown upload type' })
      return
    }
    if (!isPngRatioId(ratio)) {
      res.status(400).json({ error: 'Ratio must be 16:9, 9:16 or 4:5' })
      return
    }

    const { buf, ext } = parseDataUrlImage(dataUrl)
    if (kind === 'production-png' && ext !== 'png') {
      throw new Error('Production overlays must be a transparent PNG')
    }
    if (kind === 'guest-screenshot' && ext !== 'jpg') {
      throw new Error('Candidate stills must be a JPG')
    }
    if (kind === 'guest-thumbnail' && ext !== 'jpg') {
      throw new Error('Thumbnails must be a JPG')
    }
    assertImageRatio(buf, ext, ratio)

    const onVercel = Boolean(process.env.VERCEL)
    let url = ''

    if (onVercel) {
      if (cloudinaryReady()) {
        try {
          url = await storeCloudinaryImage(dataUrl, kind, ratio, filename)
        } catch (cloudErr) {
          console.error('Cloudinary upload failed, using fallback:', cloudErr)
        }
      }
      if (!url) {
        if (buf.length > DATA_URL_MAX_BYTES) {
          res.status(503).json({
            error: 'Live upload needs a working Cloudinary account, or a PNG under 500 KB. This file is too large to store without Cloudinary.',
          })
          return
        }
        url = dataUrl
      }
    } else {
      url = await storeLocalImage(buf, kind, ratio, ext, filename)
    }

    res.status(201).json({ url })
  } catch (err) {
    const raw = err instanceof Error ? err.message : 'Upload failed'
    console.error('interview upload error:', err)
    if (/Unexpected end of JSON|Unexpected token/i.test(raw)) {
      res.status(413).json({ error: 'File is too large for live upload. Use a PNG under 2 MB.' })
      return
    }
    const known = /PNG|JPG|JPEG|ratio|Upload a JPG|max 3 MB|not a valid|Image |Cloudinary|too large/i.test(raw)
    res.status(known ? 400 : 500).json({ error: raw.slice(0, 180) || 'Upload failed' })
  }
}
