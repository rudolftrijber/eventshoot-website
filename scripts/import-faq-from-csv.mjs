/**
 * Importeer FAQ-items uit data/FAQ-import-eventshoot.csv naar Sanity.
 * Gebruik: SANITY_TOKEN=sk... node scripts/import-faq-from-csv.mjs
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@sanity/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSV_PATH = join(__dirname, '../data/FAQ-import-eventshoot.csv')

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'pn3eisnr'
const DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_TOKEN

if (!TOKEN) {
  console.error('❌  Geen SANITY_TOKEN. Gebruik:')
  console.error('    SANITY_TOKEN=sk... node scripts/import-faq-from-csv.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  useCdn: false,
  apiVersion: '2026-05-08',
})

function parseLine(line) {
  const result = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (c === ';' && !inQuotes) {
      result.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  result.push(cur)
  return result
}

function parseCsv(content) {
  const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim())
  const headers = parseLine(lines[0])
  return lines.slice(1).map(line => {
    const cols = parseLine(line)
    const row = {}
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? ''
    })
    return row
  })
}

function toDocId(page, order) {
  return `faq-${page}-${order}`
}

function isActive(val) {
  const v = String(val).trim().toLowerCase()
  return v === 'ja' || v === 'yes' || v === 'true' || v === '1'
}

async function run() {
  const raw = readFileSync(CSV_PATH, 'utf8')
  const rows = parseCsv(raw)

  console.log(`\n📋 ${rows.length} FAQ-items importeren → Sanity (${PROJECT_ID} / ${DATASET})\n`)

  let ok = 0
  for (const row of rows) {
    const page = row["Tonen op pagina's"]?.trim()
    const order = Number(row['Volgorde']) || 10
    const category = row['Categorie']?.trim()
    const questionNl = row['Vraag (NL)']?.trim()
    const answerNl = row['Antwoord (NL)']?.trim()
    const questionEn = row['Vraag (EN)']?.trim()
    const answerEn = row['Antwoord (EN)']?.trim()

    if (!page || !questionNl || !answerNl) {
      console.warn(`  ⏭  Overgeslagen (ontbrekende velden): ${questionNl || '(leeg)'}`)
      continue
    }

    const doc = {
      _type: 'faqItem',
      _id: toDocId(page, order),
      active: isActive(row['Actief']),
      category,
      showOn: [page],
      sortOrder: order,
      questionNl,
      answerNl,
      questionEn,
      answerEn,
    }

    await client.createOrReplace(doc)
    console.log(`  ✅  [${page}] ${order}. ${questionNl.slice(0, 55)}…`)
    ok++
  }

  console.log(`\n✨ ${ok} FAQ-items geplaatst in Sanity.`)
  console.log('   Controleer in Studio: http://localhost:3333 → FAQ\n')
}

run().catch(err => {
  console.error('❌ Fout:', err.message)
  process.exit(1)
})
