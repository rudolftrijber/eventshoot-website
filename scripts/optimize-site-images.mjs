/**
 * Genereert WebP-varianten onder public/opt/ (zelfde padstructuur als originelen).
 * Alleen opnieuw verwerken als bron nieuwer is dan de output.
 *
 * Gebruik: npm run optimize:images
 */

import { existsSync, mkdirSync, statSync, readdirSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, '../public')
const OPT = join(PUBLIC, 'opt')
const WIDTHS = [200, 400, 800, 1200, 1920]
const QUALITY = 82

function collectImages(dir, acc = []) {
  if (!existsSync(dir)) return acc
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'opt') continue
      collectImages(full, acc)
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      acc.push(full)
    }
  }
  return acc
}

function shouldSkip(srcPath, outPath) {
  if (!existsSync(outPath)) return false
  return statSync(outPath).mtimeMs >= statSync(srcPath).mtimeMs
}

async function optimizeOne(absPath) {
  const rel = relative(PUBLIC, absPath)
  const relBase = rel.replace(/\.(jpe?g|png)$/i, '')
  let meta
  try {
    meta = await sharp(absPath).metadata()
  } catch {
    console.warn(`  ⏭  Overgeslagen (ongeldig): ${rel}`)
    return 0
  }

  const srcW = meta.width ?? 1920
  const applicable = WIDTHS.filter(w => w <= srcW)
  const toGenerate = applicable.length ? applicable : [Math.min(400, srcW)]
  let count = 0

  for (const w of toGenerate) {
    const targetW = Math.min(w, srcW)
    const outRel = `${relBase}.w${w}.webp`
    const outPath = join(OPT, outRel)
    if (shouldSkip(absPath, outPath)) continue

    mkdirSync(dirname(outPath), { recursive: true })
    await sharp(absPath)
      .resize({ width: targetW, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath)

    count++
  }
  return count
}

async function run() {
  console.log('\n🖼  Site-afbeeldingen optimaliseren → public/opt/\n')

  const images = new Set()

  if (existsSync(PUBLIC)) {
    for (const f of readdirSync(PUBLIC)) {
      if (/^eventshoot-.*\.jpe?g$/i.test(f)) images.add(join(PUBLIC, f))
    }
  }

  collectImages(join(PUBLIC, 'DATA_EVENTSHOOT'), []).forEach(p => images.add(p))
  collectImages(join(PUBLIC, 'images/vodcast'), []).forEach(p => images.add(p))
  collectImages(join(PUBLIC, 'video'), []).forEach(p => images.add(p))

  for (const rel of ['images/checklist.jpg', 'images/Eventshoot_GOLDEN_HOUR.jpg']) {
    const p = join(PUBLIC, rel)
    if (existsSync(p)) images.add(p)
  }

  let files = 0
  let variants = 0

  for (const absPath of [...images].sort()) {
    const n = await optimizeOne(absPath)
    if (n > 0) {
      files++
      variants += n
      console.log(`  ✅  ${relative(PUBLIC, absPath)} → ${n} variant(en)`)
    }
  }

  console.log(`\n✨ Klaar: ${files} bronbestanden, ${variants} WebP-varianten.\n`)
}

run().catch(err => {
  console.error('❌', err)
  process.exit(1)
})
