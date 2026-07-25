import type { Gast } from '@/types/interview'
import { CLIENT_CSV_HEADERS, CSV_HEADERS, normalizeGastStatus } from '@/types/interview'

function toCSVField(val: unknown): string {
  let str = val == null ? '' : String(val)
  if (/[",\n]/.test(str)) str = `"${str.replace(/"/g, '""')}"`
  return str
}

function questionFromRow(row: Record<string, string>, i: number): string {
  return row[`question${i}`] || row[`vraag${i}`] || ''
}

export function guestsToCSV(list: Gast[]): string {
  const lines = [CSV_HEADERS.join(',')]
  const source = list.length ? list : [{
    productieNaam: 'Example Event 2026',
    type: 'Participant',
    naam: 'Jane Smith',
    functie: 'Director of Innovation',
    planning: 'interview before lunch',
    gedeeld: false,
    questions: [
      'What stood out to you most today?',
      'What was the highlight?',
      'What will you take away for next year?',
      'Any message for viewers?',
    ],
    status: 'Entered' as const,
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
      ('gedeeld' in r && r.gedeeld) ? 'yes' : 'no',
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
  productieNaam: 'Industry Congress 2026',
  type: 'Keynote speaker',
  naam: 'Jane Smith',
  functie: 'Director of Innovation',
  planning: 'interview after keynote, around 12:30',
  gedeeld: true,
  questions: [
    'What was your most important insight from today?',
    'What will you take back to your organisation?',
    'What was the highlight of the congress?',
    'Any message for participants?',
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
    CLIENT_TEMPLATE_EXAMPLE.gedeeld ? 'yes' : 'no',
    q[0], q[1], q[2], q[3], q[4], q[5], q[6],
  ].map(toCSVField)
}

function blankClientRow(): string {
  return CLIENT_CSV_HEADERS.map(() => '').join(',')
}

/** Empty client template: 1 example row + 5 blank rows */
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
  const headers = ['crew_number', 'date', 'time', 'name', 'role', 'production', 'status']
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
    const q = questionFromRow(row, i)
    if (q) questions.push(q)
  }
  while (questions.length < 4) questions.push('')
  const sharedRaw = row.shared || row.gedeeld || ''
  return {
    productieNaam: row.production || row.productienaam || row.productie || '',
    type: row.type || '',
    naam: row.name || row.naam || '',
    functie: row.role || row.functie || '',
    planning: row.planning || '',
    gedeeld: /^(yes|ja|true|1)$/i.test(sharedRaw),
    questions,
    status: normalizeGastStatus(row.status || 'Entered'),
    regienummer: row.crew_number || row.regienummer || '',
    datum: row.date || row.datum || '',
    tijd: row.time || row.tijd || '',
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
  // e.g. "za 25 jul 2026"
  return d
    .toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/** e.g. za 25 jul 2026 08:00 — empty parts become — */
export function formatDisplayDateTime(date: string, time: string): string {
  if (!date) return '—'
  const d = formatDisplayDate(date)
  const t = (time || '').trim()
  return t ? `${d} ${t}` : d
}

/** Sort key for production start (ascending) */
export function productionStartSortKey(p: { datum?: string; startTijd?: string }): string {
  const time = (p.startTijd || '00:00').trim() || '00:00'
  return `${p.datum || '9999-99-99'}T${time.padStart(5, '0')}`
}

/** Numbered list for email / presenter cards */
export function formatQuestionsForCopy(questions: string[], title?: string): string {
  const lines = questions.map((q) => q.trim()).filter(Boolean)
  if (!lines.length) return ''
  const body = lines.map((q, i) => `${i + 1}. ${q}`).join('\n')
  const heading = (title || '').trim()
  return heading ? `${heading}\n\n${body}` : body
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text.trim()) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
