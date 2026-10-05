/**
 * iPad Safari in desktop mode uses the same user agent as a Mac, and often
 * reports no touch points. Every Safari-family browser skips the full-screen
 * video, so that layer cannot cover the page.
 */
export function isIosLike(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod|FxiOS|CriOS|EdgiOS/.test(ua)) return true
  if (/Safari/.test(ua) && !/Chrome|Chromium|Edg\/|OPR\/|Android/.test(ua)) return true
  const touch = (navigator.maxTouchPoints || 0) > 0
  if (touch && /Macintosh|Mac OS X/.test(ua)) return true
  if (typeof window !== 'undefined' && window.matchMedia?.('(any-pointer: coarse), (pointer: coarse), (hover: none)').matches) return true
  return false
}
