const CRC_TABLE = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  CRC_TABLE[n] = c >>> 0
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function dosDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1)
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { time, day }
}

function u16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true)
}

function u32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true)
}

export function buildStoredZip(files: { name: string; data: Uint8Array }[]) {
  const encoder = new TextEncoder()
  const { time, day } = dosDateTime()
  const parts: BlobPart[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  for (const file of files) {
    const data = file.data
    const name = encoder.encode(file.name)
    const crc = crc32(data)

    const local = new Uint8Array(30 + name.length)
    const localView = new DataView(local.buffer)
    u32(localView, 0, 0x04034b50)
    u16(localView, 4, 20)
    u16(localView, 6, 0)
    u16(localView, 8, 0)
    u16(localView, 10, time)
    u16(localView, 12, day)
    u32(localView, 14, crc)
    u32(localView, 18, data.length)
    u32(localView, 22, data.length)
    u16(localView, 26, name.length)
    u16(localView, 28, 0)
    local.set(name, 30)

    const central = new Uint8Array(46 + name.length)
    const centralView = new DataView(central.buffer)
    u32(centralView, 0, 0x02014b50)
    u16(centralView, 4, 20)
    u16(centralView, 6, 20)
    u16(centralView, 8, 0)
    u16(centralView, 10, 0)
    u16(centralView, 12, time)
    u16(centralView, 14, day)
    u32(centralView, 16, crc)
    u32(centralView, 20, data.length)
    u32(centralView, 24, data.length)
    u16(centralView, 28, name.length)
    u16(centralView, 30, 0)
    u16(centralView, 32, 0)
    u16(centralView, 34, 0)
    u16(centralView, 36, 0)
    u32(centralView, 38, 0)
    u32(centralView, 42, offset)
    central.set(name, 46)

    parts.push(local, data)
    centralParts.push(central)
    offset += local.length + data.length
  }

  let centralSize = 0
  for (const part of centralParts) centralSize += part.length

  const eocd = new Uint8Array(22)
  const eocdView = new DataView(eocd.buffer)
  u32(eocdView, 0, 0x06054b50)
  u16(eocdView, 4, 0)
  u16(eocdView, 6, 0)
  u16(eocdView, 8, centralParts.length)
  u16(eocdView, 10, centralParts.length)
  u32(eocdView, 12, centralSize)
  u32(eocdView, 16, offset)
  u16(eocdView, 20, 0)

  return new Blob([...parts, ...centralParts, eocd], { type: 'application/zip' })
}

export async function downloadStoredZip(filename: string, files: { name: string; url: string }[]) {
  const packed: { name: string; data: Uint8Array }[] = []
  for (const file of files) {
    const response = await fetch(file.url)
    if (!response.ok) throw new Error(`Kon ${file.name} niet ophalen`)
    packed.push({ name: file.name, data: new Uint8Array(await response.arrayBuffer()) })
  }

  const blob = buildStoredZip(packed)
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(href), 60_000)
}
