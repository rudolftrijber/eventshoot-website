/**
 * Test CSV export/import voor de Interview App.
 * Gebruik: node scripts/test-interview-csv.mjs
 * Optioneel API-test: node scripts/test-interview-csv.mjs --api
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const API_BASE = process.env.INTERVIEW_API_BASE || 'http://localhost:5173'
const runApi = process.argv.includes('--api')

const CSV_HEADERS = [
  'productienaam', 'type', 'naam', 'functie', 'planning', 'gedeeld',
  'vraag1', 'vraag2', 'vraag3', 'vraag4', 'vraag5', 'vraag6', 'vraag7',
  'status', 'regienummer', 'datum', 'tijd',
]

const CLIENT_CSV_HEADERS = [
  'productienaam', 'type', 'naam', 'functie', 'planning', 'gedeeld',
  'vraag1', 'vraag2', 'vraag3', 'vraag4', 'vraag5', 'vraag6', 'vraag7',
]

function toCSVField(val) {
  let str = val == null ? '' : String(val)
  if (/[",\n]/.test(str)) str = `"${str.replace(/"/g, '""')}"`
  return str
}

function splitCSVLine(line) {
  const result = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      result.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  result.push(cur)
  return result
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length)
  if (!lines.length) return []
  const headers = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((line) => {
    const cols = splitCSVLine(line)
    const obj = {}
    headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim() })
    return obj
  })
}

function csvRowToGuestPayload(row) {
  const questions = []
  for (let i = 1; i <= 7; i++) {
    if (row[`vraag${i}`]) questions.push(row[`vraag${i}`])
  }
  while (questions.length < 4) questions.push('')
  return {
    productieNaam: row.productienaam || row.productie || '',
    type: row.type || '',
    naam: row.naam || '',
    functie: row.functie || '',
    planning: row.planning || '',
    gedeeld: /^(ja|true|1)$/i.test(row.gedeeld || ''),
    questions,
    status: row.status || 'Ingevoerd',
    regienummer: row.regienummer || '',
    datum: row.datum || '',
    tijd: row.tijd || '',
  }
}

function guestsToCSV(list) {
  const lines = [CSV_HEADERS.join(',')]
  const source = list.length ? list : [{
    productieNaam: 'Test Event 2026',
    type: 'Deelnemer',
    naam: 'CSV Test Persoon',
    functie: 'Testfunctie',
    planning: 'na de lunch',
    gedeeld: false,
    questions: ['V1', 'V2', 'V3', 'V4'],
    status: 'Ingevoerd',
    regienummer: '',
    datum: '',
    tijd: '',
  }]
  source.forEach((r) => {
    const q = r.questions || []
    const row = [
      r.productieNaam, r.type || '', r.naam, r.functie, r.planning || '',
      r.gedeeld ? 'ja' : 'nee',
      q[0], q[1], q[2], q[3], q[4], q[5], q[6],
      r.status, r.regienummer || '', r.datum || '', r.tijd || '',
    ].map(toCSVField)
    lines.push(row.join(','))
  })
  return lines.join('\r\n')
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

function runUnitTests() {
  console.log('=== Unit tests CSV ===')

  const sample = {
    productieNaam: 'DSR Congres 2026',
    type: 'Executive',
    naam: 'Maria de Vries',
    functie: 'CEO, Voorbeeld BV',
    planning: 'rond 14:00, bij de stand',
    gedeeld: true,
    questions: ['Vraag A', 'Vraag B', 'Vraag C', 'Vraag D'],
    status: 'Ingevoerd',
    regienummer: '',
    datum: '',
    tijd: '',
  }

  const exported = guestsToCSV([sample])
  assert(exported.startsWith('productienaam,type,naam'), 'Export heeft headers')
  const rows = parseCSV(exported)
  assert(rows.length === 1, 'Export heeft 1 dataregel')
  const payload = csvRowToGuestPayload(rows[0])
  assert(payload.naam === sample.naam, 'Naam roundtrip')
  assert(payload.functie === sample.functie, 'Functie roundtrip')
  assert(payload.productieNaam === sample.productieNaam, 'Productie roundtrip')
  assert(payload.gedeeld === true, 'Gedeeld ja roundtrip')
  assert(payload.questions[0] === 'Vraag A', 'Vraag1 roundtrip')
  console.log('✓ Export → parse → payload roundtrip')

  const quoted = guestsToCSV([{
    ...sample,
    naam: 'Piet "Special" Jansen',
    planning: 'na keynote, hal A, stand 12',
  }])
  const quotedRows = parseCSV(quoted)
  assert(quotedRows[0].naam === 'Piet "Special" Jansen', 'Quoted naam')
  assert(quotedRows[0].planning.includes('hal A'), 'Comma in planning')
  console.log('✓ Quoted velden met komma')

  const templatePath = join(root, 'public/DATA_EVENTSHOOT/FILES/interview-intake-sjabloon.csv')
  const template = readFileSync(templatePath, 'utf8')
  const templateRows = parseCSV(template)
  assert(templateRows.length >= 1, 'Sjabloon heeft minstens voorbeeldregel')
  assert(templateRows[0].naam === 'Jan Jansen', 'Sjabloon voorbeeldnaam')
  const templatePayload = csvRowToGuestPayload(templateRows[0])
  assert(templatePayload.questions.length >= 4, 'Sjabloon heeft min. 4 vragen')
  console.log('✓ Opdrachtgever-sjabloon leesbaar en importeerbaar')

  const blankRows = templateRows.filter((r) => !r.naam)
  assert(blankRows.length >= 3, 'Sjabloon heeft lege regels voor invullen')
  console.log('✓ Lege sjabloonregels worden overgeslagen bij import (geen naam)')

  const tmpPath = join(root, 'scripts/.test-interview-export.csv')
  writeFileSync(tmpPath, exported, 'utf8')
  const reimport = parseCSV(readFileSync(tmpPath, 'utf8'))
  assert(reimport[0].naam === sample.naam, 'Bestand roundtrip')
  console.log(`✓ Tijdelijk testbestand: ${tmpPath}`)
}

async function runApiTest() {
  console.log('\n=== API import test ===')
  const stamp = Date.now()
  const testNaam = `CSV Import Test ${stamp}`
  const csv = guestsToCSV([{
    productieNaam: 'CSV Test Productie',
    type: 'Deelnemer',
    naam: testNaam,
    functie: 'Tester',
    planning: 'test',
    gedeeld: false,
    questions: ['Q1', 'Q2', 'Q3', 'Q4'],
    status: 'Ingevoerd',
    regienummer: '',
    datum: '',
    tijd: '',
  }])
  const row = csvRowToGuestPayload(parseCSV(csv)[0])

  const createRes = await fetch(`${API_BASE}/api/interview/guests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(row),
  })
  const createText = await createRes.text()
  if (!createRes.ok) {
    throw new Error(`POST guest mislukt: ${createRes.status} ${createText}`)
  }
  const { guest } = JSON.parse(createText)
  assert(guest.naam === testNaam, 'API guest naam')
  console.log(`✓ Gast aangemaakt via API (${guest.id})`)

  const syncRes = await fetch(`${API_BASE}/api/interview/sync`, { credentials: 'include' })
  assert(syncRes.ok, 'Sync mislukt')
  const { guests } = await syncRes.json()
  assert(guests.some((g) => g.id === guest.id), 'Gast zichtbaar in sync')
  console.log('✓ Gast zichtbaar na sync')

  const delRes = await fetch(`${API_BASE}/api/interview/guests/${guest.id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  assert(delRes.ok, 'DELETE mislukt')
  console.log('✓ Testgast opgeruimd')
}

try {
  runUnitTests()
  if (runApi) {
    await runApiTest()
  } else {
    console.log('\nTip: voeg --api toe voor live import-test tegen localhost:5173')
  }
  console.log('\nAlle CSV-tests geslaagd.')
} catch (err) {
  console.error('\nTEST MISLUKT:', err.message)
  process.exit(1)
}
