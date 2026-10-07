/**
 * Echte iPhone of iPad, ook als iPadOS zich als desktop-Mac voordoet.
 * Desktop-Safari hoort hier niet bij.
 */
export function isIosLike(): boolean {
  try {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent || ''
    if (/iPad|iPhone|iPod|FxiOS|CriOS|EdgiOS/.test(ua)) return true
    const touch = (navigator.maxTouchPoints || 0) > 1
    if (touch && /Macintosh|Mac OS X/.test(ua)) return true
    return false
  } catch {
    return false
  }
}

/**
 * Telefoon of tablet: stille achtergrondfoto.
 * Desktop, ongeacht de browser, krijgt de videobackground.
 * Dit moet gelijk blijven aan het script in index.html.
 */
export function useStillBackground(): boolean {
  if (isIosLike()) return true
  try {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent || ''
    if (/Android/.test(ua)) return true
    if (typeof window === 'undefined') return false
    const coarse = window.matchMedia?.('(pointer: coarse)').matches
    const noHover = window.matchMedia?.('(hover: none)').matches
    return Boolean(coarse && noHover)
  } catch {
    return true
  }
}
