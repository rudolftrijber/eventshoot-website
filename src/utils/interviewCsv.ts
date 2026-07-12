import type { Gast } from '@/types/interview'
import { CLIENT_CSV_HEADERS, CSV_HEADERS } from '@/types/interview'

function toCSVField(val: unknown): string {
  let str = val == null ? '' : String(val)
  if (/[",\n]/.test(str)) str = `"${str.replace(/"/g, '""')}"`
  return str
}

export function guestsToCSV(list: Gast[]): string {
  const lines = [CSV_HEADERS.join(',')]
  const source = list.length ? list : [{
    productieNaam: 'Voorbeeld Event 2026',
    type: 'Deelnemer',
    naam: 'Jan Jansen',
    functie: 'Directeur Innovatie',
    planning: 'interview voor de lunch',
    gedeeld: false,
    questions: [
      'Wat merkte u vandaag het meest op?',
      'Wat was het hoogtepunt?',
      'Wat neemt u mee naar volgend jaar?',
      'Heeft u nog een boodschap voor de kijker?',
    ],
    status: 'Ingevoerd' as const,
    regienummer: '',
    datum: '',
    tijd: '',
  }]

  source.forEach((r) => {
    const q = 'questions' in r ? r.questions : []
    const row = [
      'productieNaam' in r ? r.productieNaam : '',
      r.type || '',
      r.naam,
      r.functie,
      'planning' in r ? r.planning : '',
      ('gedeeld' in r && r.gedeeld) ? 'ja' : 'nee',
      q[0], q[1], q[2], q[3], q[4], q[5], q[6],
      r.status,
      r.regienummer || '',
      r.datum || '',
      r.tijd || '',
    ].map(toCSVField)
    lines.push(row.join(','))
  })
  return lines.join('\r\n')
}

const CLIENT_TEMPLATE_EXAMPLE = {
  productieNaam: 'Jaarcongres Branchevereniging 2026',
  type: 'Keynote spreker',
  naam: 'Jan Jansen',
  functie: 'Directeur Innovatie',
  planning: 'interview na de keynote, ca. 12:30',
  gedeeld: true,
  questions: [
    'Wat was voor u het belangrijkste inzicht van vandaag?',
    'Wat neemt u mee naar uw organisatie?',
    'Wat was het hoogtepunt van het congres?',
    'Heeft u een boodschap voor de deelnemers?',
  ],
}

function clientExampleRow(): string[] {
  const q = CLIENT_TEMPLATE_EXAMPLE.questions
  return [
    CLIENT_TEMPLATE_EXAMPLE.productieNaam,
    CLIENT_TEMPLATE_EXAMPLE.type,
    CLIENT_TEMPLATE_EXAMPLE.naam,
    CLIENT_TEMPLATE_EXAMPLE.functie,
    CLIENT_TEMPLATE_EXAMPLE.planning,
    CLIENT_TEMPLATE_EXAMPLE.gedeeld ? 'ja' : 'nee',
    q[0], q[1], q[2], q[3], q[4], q[5], q[6],
  ].map(toCSVField)
}

function blankClientRow(): string {
  return CLIENT_CSV_HEADERS.map(() => '').join(',')
}

/** Leeg sjabloon voor opdrachtgevers: 1 voorbeeldregel + 5 lege regels */
export function clientTemplateCSV(): string {
  const lines = [
    CLIENT_CSV_HEADERS.join(','),
    clientExampleRow().join(','),
    blankClientRow(),
    blankClientRow(),
    blankClientRow(),
    blankClientRow(),
    blankClientRow(),
  ]
  return lines.join('\r\n')
}

export function lowerthirdCSV(list: Gast[]): string {
  const headers = ['regienummer', 'datum', 'tijd', 'naam', 'functie', 'productie', 'status']
  const lines = [headers.join(',')]
  list.forEach((g) => {
    lines.push([
      g.regienummer, g.datum, g.tijd, g.naam, g.functie, g.productieNaam, g.status,
    ].map(toCSVField).join(','))
  })
  return lines.join('\r\n')
}

function splitCSVLine(line: string): string[] {
  const result: string[] = []
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

export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length)
  if (!lines.length) return []
  const headers = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((line) => {
    const cols = splitCSVLine(line)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim() })
    return obj
  })
}

export function csvRowToGuestPayload(row: Record<string, string>) {
  const questions: string[] = []
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

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDisplayDate(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return iso || todayStr()
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`)
  return d.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
}
