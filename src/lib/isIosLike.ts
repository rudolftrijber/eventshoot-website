/** iPhone, iPad and iPadOS "desktop" mode (Safari and Firefox on iOS both use WebKit). */
export function isIosLike(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod|FxiOS/.test(ua)) return true
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}
