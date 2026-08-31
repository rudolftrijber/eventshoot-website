import type { PngRatioId } from '@/types/interview'

export const THUMBNAIL_SIZE: Record<PngRatioId, { width: number; height: number }> = {
  '16x9': { width: 1920, height: 1080 },
  '9x16': { width: 1080, height: 1920 },
  '4x5': { width: 1080, height: 1350 },
}

export function thumbnailFilename(ratio: PngRatioId, naam: string, isoDate: string): string {
  const slug = String(naam || 'thumbnail')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') || 'thumbnail'
  let datePart = '00_00_0000'
  if (isoDate && /^\d{4}-\d{2}-\d{2}/.test(isoDate)) {
    const [year, month, day] = isoDate.slice(0, 10).split('-')
    datePart = `${day}_${month}_${year}`
  }
  const suffix = ratio === '16x9' ? '' : `_${ratio}`
  return `${slug}_${datePart}${suffix}.jpg`
}

export function formatThumbnailDate(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return ''
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`)
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (/^https?:\/\//i.test(src)) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image for thumbnail'))
    img.src = src
  })
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh)
}

function prepareOverlay(
  img: HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create overlay canvas')
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const total = width * height
  let transparent = 0
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 16) transparent++
  }

  if (transparent / total < 0.02) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 18 && data[i + 1] < 18 && data[i + 2] < 18) {
        data[i + 3] = 0
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }

  return canvas
}

function findTextBox(
  overlay: HTMLCanvasElement,
  margin: number,
): { x: number; y: number; width: number; height: number } {
  const { width, height } = overlay
  const ctx = overlay.getContext('2d')
  if (!ctx) {
    return { x: margin, y: margin, width: Math.round(width * 0.382) - margin, height: height - margin * 2 }
  }

  const data = ctx.getImageData(0, 0, width, height).data
  const colOpaque = new Float32Array(width)
  const rowOpaque = new Float32Array(height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        colOpaque[x]++
        rowOpaque[y]++
      }
    }
  }

  const colThresh = height * 0.12
  let left = 0
  while (left < width && colOpaque[left] < colThresh) left++
  let right = left
  while (right < width && colOpaque[right] >= colThresh) right++

  const rowThresh = width * 0.18
  let bottom = height - 1
  while (bottom > 0 && rowOpaque[bottom] < rowThresh) bottom--
  let top = bottom
  while (top > 0 && rowOpaque[top] >= rowThresh) top--

  const fieldWidth = right - left
  const fieldHeight = bottom - top
  const useLeftField = fieldWidth > width * 0.22 && fieldWidth < width * 0.75
  const useBottomField = fieldHeight > height * 0.16 && top > height * 0.35

  if (useLeftField && !(useBottomField && fieldWidth < width * 0.3)) {
    return {
      x: left + margin,
      y: margin,
      width: Math.max(160, fieldWidth - margin * 1.15),
      height: height - margin * 2,
    }
  }

  if (useBottomField) {
    return {
      x: margin,
      y: top + Math.round(margin * 0.35),
      width: width - margin * 2,
      height: height - top - margin,
    }
  }

  return {
    x: margin,
    y: margin,
    width: Math.round(width * 0.382) - margin,
    height: height - margin * 2,
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const lines: string[] = []
  let current = words[0]
  for (let i = 1; i < words.length; i++) {
    const next = `${current} ${words[i]}`
    if (ctx.measureText(next).width <= maxWidth) {
      current = next
    } else {
      lines.push(current)
      current = words[i]
    }
  }
  lines.push(current)
  return lines
}

function leftFieldWidthAt(overlay: HTMLCanvasElement, y: number): number {
  const ctx = overlay.getContext('2d')
  const { width, height } = overlay
  if (!ctx) return Math.round(width * 0.38)
  const row = Math.max(0, Math.min(height - 1, Math.round(y)))
  const data = ctx.getImageData(0, row, width, 1).data
  let start = 0
  while (start < width && data[start * 4 + 3] < 96) start++
  let end = start
  let gap = 0
  for (let x = start; x < width; x++) {
    if (data[x * 4 + 3] >= 96) {
      end = x
      gap = 0
    } else if (++gap > 6) {
      break
    }
  }
  return Math.max(0, end - start + 1)
}

function minFieldWidth(overlay: HTMLCanvasElement, y0: number, y1: number): number {
  const top = Math.min(y0, y1)
  const bottom = Math.max(y0, y1)
  let min = overlay.width
  const steps = 6
  for (let i = 0; i <= steps; i++) {
    const y = top + ((bottom - top) * i) / steps
    min = Math.min(min, leftFieldWidthAt(overlay, y))
  }
  return min
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startSize: number,
  weight: '700' | '500' | '400',
  maxLines: number,
): { size: number; lines: string[] } {
  let size = startSize
  while (size >= 16) {
    ctx.font = `${weight} ${size}px Roboto, system-ui, sans-serif`
    const lines = wrapText(ctx, text, maxWidth)
    const longest = lines.reduce((m, line) => Math.max(m, ctx.measureText(line).width), 0)
    if (lines.length <= maxLines && longest <= maxWidth) {
      return { size, lines }
    }
    size -= 1
  }
  ctx.font = `${weight} 16px Roboto, system-ui, sans-serif`
  return { size: 16, lines: wrapText(ctx, text, maxWidth) }
}

function sizeForCharBudget(
  ctx: CanvasRenderingContext2D,
  maxWidth: number,
  chars: number,
  weight: '700' | '500' | '400',
): number {
  const sample = 'n'.repeat(Math.max(1, chars))
  let size = 90
  while (size > 16) {
    ctx.font = `${weight} ${size}px Roboto, system-ui, sans-serif`
    if (ctx.measureText(sample).width <= maxWidth) return size
    size -= 1
  }
  return 16
}

export async function composeInterviewThumbnail(input: {
  ratio: PngRatioId
  stillUrl: string
  overlayUrl: string
  interviewTitel: string
  naam: string
  functie: string
  organisatie?: string
  generalTitel?: string
  dateLabel?: string
}): Promise<string> {
  if (!THUMBNAIL_SIZE[input.ratio]) throw new Error('Unknown ratio')
  if (!input.stillUrl?.trim()) throw new Error('A JPG still is required')
  if (!input.overlayUrl?.trim()) throw new Error('A transparent PNG overlay is required')
  if (!input.interviewTitel?.trim()) throw new Error('Interview titel is required')
  if (!input.naam?.trim()) throw new Error('Name is required')
  if (!input.functie?.trim()) throw new Error('Role is required')

  const { width, height } = THUMBNAIL_SIZE[input.ratio]
  await document.fonts.ready

  const [still, overlayImg] = await Promise.all([
    loadImage(input.stillUrl),
    loadImage(input.overlayUrl),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create thumbnail canvas')

  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, width, height)
  drawCover(ctx, still, width, height)

  const overlay = prepareOverlay(overlayImg, width, height)
  ctx.drawImage(overlay, 0, 0)

  const margin = Math.round(80 * (width / 1920))
  const box = findTextBox(overlay, margin)
  const textX = box.x
  const titleLeading = 1.05
  const subLeading = 1.08

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffffff'

  const titleBandTop = height * 0.70
  const titleBandBottom = height * 0.88
  const titleField = minFieldWidth(overlay, titleBandTop, titleBandBottom)
  const titleMaxWidth = Math.max(140, titleField - textX - Math.round(margin * 0.45))
  const titleCap = sizeForCharBudget(ctx, titleMaxWidth, 16, '700')
  const { size: usedTitleSize, lines: titleLines } = fitText(
    ctx,
    input.interviewTitel.trim(),
    titleMaxWidth,
    Math.min(Math.round(height * (66 / 1080)), titleCap),
    '700',
    2,
  )
  const usedSubSize = Math.max(18, Math.round(usedTitleSize / 1.6))

  const creditParts = [input.naam.trim(), input.functie.trim()].filter(Boolean)
  const credit = creditParts.length ? `met ${creditParts.join(', ')}` : ''
  ctx.font = `400 ${usedSubSize}px Roboto, system-ui, sans-serif`
  const creditLines = credit ? wrapText(ctx, credit, titleMaxWidth) : []

  const org = (input.organisatie || '').trim()
  ctx.font = `400 ${usedSubSize}px Roboto, system-ui, sans-serif`
  const orgLines = org ? wrapText(ctx, org, titleMaxWidth) : []

  const titleBlock = titleLines.length * usedTitleSize * titleLeading
  const creditBlock = creditLines.length * usedSubSize * subLeading
  const orgBlock = orgLines.length * usedSubSize * subLeading
  const gap = usedSubSize / 1.6
  let y = titleBandBottom
  if (orgLines.length) y -= orgBlock
  if (creditLines.length) y -= creditBlock + (orgLines.length ? gap * 0.6 : 0)
  if (titleLines.length) y -= titleBlock + ((creditLines.length || orgLines.length) ? gap : 0)
  const titleStartY = y

  ctx.font = `700 ${usedTitleSize}px Roboto, system-ui, sans-serif`
  for (const line of titleLines) {
    y += usedTitleSize * titleLeading
    ctx.fillText(line, textX, y)
  }

  if (creditLines.length) {
    y += gap
    ctx.font = `400 ${usedSubSize}px Roboto, system-ui, sans-serif`
    for (const line of creditLines) {
      y += usedSubSize * subLeading
      ctx.fillText(line, textX, y)
    }
  }

  if (orgLines.length) {
    y += gap * 0.6
    ctx.font = `400 ${usedSubSize}px Roboto, system-ui, sans-serif`
    for (const line of orgLines) {
      y += usedSubSize * subLeading
      ctx.fillText(line, textX, y)
    }
  }

  const generalTitel = (input.generalTitel || '').trim()
  const dateLabel = (input.dateLabel || '').trim()
  if (generalTitel || dateLabel) {
    const serieY = Math.round(height * 0.52)
    const serieField = minFieldWidth(overlay, serieY - 20, serieY + 50)
    const serieMaxWidth = Math.max(140, serieField - textX - Math.round(margin * 0.45))
    const serieCap = sizeForCharBudget(ctx, serieMaxWidth, 18, '500')
    let serieSize = Math.min(Math.round(height * (40 / 1080)), serieCap)
    let serieLines: string[] = []
    if (generalTitel) {
      const fitted = fitText(ctx, generalTitel, serieMaxWidth, serieSize, '500', 2)
      serieSize = fitted.size
      serieLines = fitted.lines
    }
    let dateSize = Math.round(serieSize / 1.55)
    if (dateLabel) {
      ctx.font = `400 ${dateSize}px Roboto, system-ui, sans-serif`
      while (dateSize > 16 && ctx.measureText(dateLabel).width > serieMaxWidth) {
        dateSize -= 1
        ctx.font = `400 ${dateSize}px Roboto, system-ui, sans-serif`
      }
    }
    const serieBlock = serieLines.length * serieSize * 1.08 + (dateLabel ? dateSize * 1.5 : 0)
    const zoneTop = Math.round(height * 0.46)
    const zoneBottom = titleStartY - Math.round(height * 0.06)
    let topY = Math.round((zoneTop + zoneBottom) * 0.58)
    topY = Math.max(zoneTop, Math.min(topY, zoneBottom - serieBlock))
    if (serieLines.length) {
      ctx.font = `500 ${serieSize}px Roboto, system-ui, sans-serif`
      for (const line of serieLines) {
        ctx.fillText(line, textX, topY)
        topY += serieSize * 1.08
      }
    }
    if (dateLabel) {
      ctx.font = `400 ${dateSize}px Roboto, system-ui, sans-serif`
      ctx.fillText(dateLabel, textX, topY + dateSize * 0.35)
    }
  }

  return canvasToJpegDataUrl(canvas)
}

function canvasToJpegDataUrl(canvas: HTMLCanvasElement, maxBytes = 650_000): string {
  let quality = 0.9
  let url = canvas.toDataURL('image/jpeg', quality)
  while (quality > 0.55 && dataUrlBytes(url) > maxBytes) {
    quality -= 0.08
    url = canvas.toDataURL('image/jpeg', quality)
  }
  return url
}

function dataUrlBytes(url: string): number {
  const comma = url.indexOf(',')
  const b64 = comma >= 0 ? url.slice(comma + 1) : url
  return Math.ceil((b64.length * 3) / 4)
}
