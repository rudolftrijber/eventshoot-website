import type { VercelRequest } from '@vercel/node'
import { MAX_PNG_BYTES } from './types.js'

export const MAX_SHORT_TEXT = 200
export const MAX_MEDIUM_TEXT = 500
export const MAX_LONG_TEXT = 4000
export const MAX_QUESTIONS = 10
export const MAX_QUESTION_LEN = 400
export const MAX_PASSWORD_LEN = 128
export const MIN_CLIENT_PASSWORD_LEN = 8
export const MAX_DATA_URL_CHARS = Math.ceil(MAX_PNG_BYTES * 1.4) + 64

export function clipText(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max)
}

export function sanitizeQuestions(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => clipText(item, MAX_QUESTION_LEN))
    .filter(Boolean)
    .slice(0, MAX_QUESTIONS)
}

/** Allow only data URLs, local interview uploads, and Cloudinary HTTPS URLs. */
export function sanitizeImageUrl(value: unknown): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  if (raw.length > MAX_DATA_URL_CHARS) return ''

  if (/^data:image\/(png|jpe?g);base64,[A-Za-z0-9+/=\s]+$/i.test(raw)) return raw

  const pathOnly = raw.split('#')[0]
  if (pathOnly.startsWith('/interview-uploads/')) {
    const pathname = pathOnly.split('?')[0]
    if (pathname.includes('..') || pathname.includes('\\')) return ''
    if (!/^\/interview-uploads\/[^/?#]+$/.test(pathname)) return ''
    return pathname
  }

  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:') return ''
    const host = url.hostname.toLowerCase()
    if (host === 'res.cloudinary.com' || host.endsWith('.cloudinary.com')) return raw
    return ''
  } catch {
    return ''
  }
}

function headerValue(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] || '')
  return String(value || '')
}

export function originAllowed(req: Pick<VercelRequest, 'method' | 'headers'>): boolean {
  const method = String(req.method || 'GET').toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true

  const host = headerValue(req.headers.host)
  if (!host) return false

  const origin = headerValue(req.headers.origin)
  const referer = headerValue(req.headers.referer)
  const matchesHost = (value: string): boolean => {
    try {
      return new URL(value).host === host
    } catch {
      return false
    }
  }

  if (origin) return matchesHost(origin)
  if (referer) return matchesHost(referer)
  return !process.env.VERCEL
}
