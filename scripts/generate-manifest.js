// Gebruik: node scripts/generate-manifest.js Leontine
// Genereert public/def/[naam]/manifest.json met alle foto's in die map

import { readdirSync, writeFileSync } from 'fs'
import { join, extname } from 'path'

const name = process.argv[2]
if (!name) { console.error('Geef een klantnaam op: node scripts/generate-manifest.js Leontine'); process.exit(1) }

const dir = join('public', 'def', name)
const exts = ['.jpg', '.jpeg', '.png', '.webp']

const files = readdirSync(dir)
  .filter(f => exts.includes(extname(f).toLowerCase()))
  .sort()

const manifest = { name, photos: files.map(f => `/def/${name}/${f}`) }
const out = join(dir, 'manifest.json')
writeFileSync(out, JSON.stringify(manifest, null, 2))
console.log(`✓ ${files.length} foto's → ${out}`)
