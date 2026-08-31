import { MAX_PNG_BYTES, PNG_RATIOS, type PngRatioId } from './types.js'

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff])
const RATIO_TOLERANCE = 0.08

export type ScreenshotExt = 'jpg' | 'png'

export function isPngRatioId(value: string): value is PngRatioId {
  return PNG_RATIOS.some((r) => r.id === value)
}

export function parseDataUrlImage(dataUrl: string): { buf: Buffer; ext: ScreenshotExt } {
  const trimmed = String(dataUrl || '').trim()
  const match = trimmed.match(/^data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=\s]+)$/i)
  if (!match) {
    throw new Error('Upload a JPG or PNG file')
  }
  const buf = Buffer.from(match[2].replace(/\s+/g, ''), 'base64')
  if (buf.length < 24) throw new Error('Image file is too small')
  if (buf.length > MAX_PNG_BYTES) throw new Error('Image max 3 MB')

  const mime = match[1].toLowerCase()
  if (mime === 'png' || buf.subarray(0, 8).equals(PNG_MAGIC)) {
    if (!buf.subarray(0, 8).equals(PNG_MAGIC)) throw new Error('File is not a valid PNG')
    return { buf, ext: 'png' }
  }
  if (!buf.subarray(0, 3).equals(JPEG_MAGIC)) {
    throw new Error('File is not a valid JPG')
  }
  return { buf, ext: 'jpg' }
}

function pngSize(buf: Buffer): { width: number; height: number } {
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  }
}

function jpegSize(buf: Buffer): { width: number; height: number } {
  let offset = 2
  while (offset + 8 < buf.length) {
    if (buf[offset] !== 0xff) break
    const marker = buf[offset + 1]
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2
      continue
    }
    const length = buf.readUInt16BE(offset + 2)
    const isSof = marker >= 0xc0 && marker <= 0xcf
      && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    if (isSof) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7),
      }
    }
    offset += 2 + length
  }
  throw new Error('Could not read JPG size')
}

export function imageSize(buf: Buffer, ext: ScreenshotExt): { width: number; height: number } {
  return ext === 'png' ? pngSize(buf) : jpegSize(buf)
}

export function assertImageRatio(buf: Buffer, ext: ScreenshotExt, ratioId: PngRatioId): void {
  const spec = PNG_RATIOS.find((r) => r.id === ratioId)
  if (!spec) throw new Error('Unknown ratio')
  const { width, height } = imageSize(buf, ext)
  if (!width || !height) throw new Error('Could not read image size')
  const actual = width / height
  const delta = Math.abs(actual - spec.ratio) / spec.ratio
  if (delta > RATIO_TOLERANCE) {
    throw new Error(`Image must be ${spec.label} (this file is ${width}×${height})`)
  }
}
