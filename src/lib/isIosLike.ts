/** iPhone, iPad and iPadOS desktop mode. Safari and Firefox on iOS both use WebKit. */
export function isIosLike(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod|FxiOS|CriOS/.test(ua)) return true
  const touch = (navigator.maxTouchPoints || 0) > 1
  if (touch && /Macintosh|Mac OS X/.test(ua)) return true
  return navigator.platform === 'MacIntel' && touch
}
