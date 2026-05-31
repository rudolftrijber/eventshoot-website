export const IMAGE_WIDTHS = [200, 400, 800, 1200, 1920] as const
export type ImageWidth = (typeof IMAGE_WIDTHS)[number]

export type ImagePreset = 'hero' | 'content' | 'carousel' | 'portrait' | 'card' | 'thumb'

const PRESET_WIDTHS: Record<ImagePreset, ImageWidth[]> = {
  hero: [800, 1200, 1920],
  content: [400, 800, 1200],
  carousel: [800, 1200],
  portrait: [200, 400],
  card: [400, 800],
  thumb: [400, 800],
}

const PRESET_SIZES: Record<ImagePreset, string> = {
  hero: '100vw',
  content: '(max-width: 768px) 100vw, 50vw',
  carousel: '(max-width: 768px) 100vw, min(900px, 90vw)',
  portrait: '200px',
  card: '(max-width: 768px) 100vw, 400px',
  thumb: '(max-width: 768px) 50vw, 400px',
}

/** Strip query string and map site path → optimized WebP under /opt/ */
export function stripImageQuery(src: string): string {
  return src.split('?')[0]
}

export function optWebpSrc(src: string, width: ImageWidth): string {
  const path = stripImageQuery(src)
  const dot = path.lastIndexOf('.')
  const base = dot > 0 ? path.slice(0, dot) : path
  return `/opt${base}.w${width}.webp`
}

export function optSrcSet(src: string, widths: readonly number[]): string {
  return widths.map(w => `${optWebpSrc(src, w as ImageWidth)} ${w}w`).join(', ')
}

export function presetWidths(preset: ImagePreset): ImageWidth[] {
  return PRESET_WIDTHS[preset]
}

export function presetSizes(preset: ImagePreset): string {
  return PRESET_SIZES[preset]
}

/** Smallest width ≥ target for fallback <img> */
export function optFallbackSrc(src: string, preset: ImagePreset): string {
  const widths = presetWidths(preset)
  const fallback = widths[widths.length - 1]
  return optWebpSrc(src, fallback)
}
