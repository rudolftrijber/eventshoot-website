/** Uploads written to /public/interview-uploads during local npm run dev. */
export function isLocalInterviewUpload(url: string): boolean {
  const value = String(url || '').trim()
  if (!value) return false
  if (/\/interview-uploads\//.test(value)) return true
  try {
    const parsed = value.startsWith('http') ? new URL(value) : null
    return Boolean(parsed && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'))
  } catch {
    return false
  }
}

/**
 * Local disk URLs work on npm run dev, not on Vercel. Neon is shared, so a
 * PNG uploaded locally 404s on the live interview app.
 */
export function interviewUploadUnavailable(url: string): boolean {
  if (!url) return true
  if (!isLocalInterviewUpload(url)) return false
  if (typeof window === 'undefined') return true
  const host = window.location.hostname
  return host !== 'localhost' && host !== '127.0.0.1'
}
