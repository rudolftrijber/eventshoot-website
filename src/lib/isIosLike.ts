/**
 * iPad Safari in desktop mode uses the same user agent as a Mac, and often
 * reports no touch points. Every Safari-family browser skips the full-screen
 * video, so that layer cannot cover the page.
 */
export function isIosLike(): boolean {
  try {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent || ''
    if (/iPad|iPhone|iPod|FxiOS|CriOS|EdgiOS/.test(ua)) return true
    if (/Safari/.test(ua) && !/Chrome|Chromium|Edg\/|OPR\/|Android/.test(ua)) return true
    const touch = (navigator.maxTouchPoints || 0) > 0
    if (touch && /Macintosh|Mac OS X/.test(ua)) return true
    if (typeof window !== 'undefined' && window.matchMedia?.('(any-pointer: coarse), (pointer: coarse), (hover: none)').matches) return true
    return false
  } catch {
    return true
  }
}

/** iPad mini landscape is wider than the phone breakpoint, but must follow the phone path: no full-screen video. */
export function skipFullscreenVideo(): boolean {
  if (isIosLike()) return true
  try {
    if (typeof window === 'undefined') return false
    const shortSide = Math.min(window.screen?.width || 0, window.screen?.height || 0)
    if (shortSide > 0 && shortSide <= 1024) return true
    if (window.matchMedia?.('(max-width: 1200px)').matches) return true
    return false
  } catch {
    return true
  }
}
