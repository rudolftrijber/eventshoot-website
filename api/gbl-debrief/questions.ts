/**
 * GBL-debrief. Pas de vragen hier aan: de formulieren én de controle bij
 * verzenden lezen dit bestand. Daarna opnieuw publiceren.
 *
 * conference.id wijzigen als een volgende conferentie start, zodat de
 * antwoorden niet door elkaar lopen.
 */

export const CONFERENCE = {
  id: 'prague-2026',
  title: 'GBL Conference Prague',
  when: 'November 2026',
}

export const GBL_LOGO = '/GBL/gbl_logo_neg.svg'

export const THANKS = {
  title: 'Thank you',
  body: 'The GBL Board thanks you for taking the time. Your answers are for the Board only, and they help shape the next conference.',
  anonymous: 'This response cannot be traced back to you.',
  sign: 'The GBL Board',
}

type ScaleQuestion = {
  id: string
  kind: 'scale'
  prompt: string
  hint: string
  min: number
  max: number
}

type MatrixQuestion = {
  id: string
  kind: 'matrix'
  prompt: string
  hint: string
  min: number
  max: number
  naLabel: string
  items: { id: string; label: string }[]
}

type ChoiceQuestion = {
  id: string
  kind: 'choice'
  prompt: string
  options: { id: string; label: string }[]
}

type TextQuestion = {
  id: string
  kind: 'text'
  prompt: string
  required: boolean
  hint?: string
}

export type DebriefQuestion = ScaleQuestion | MatrixQuestion | ChoiceQuestion | TextQuestion

export type IdentityField = {
  id: string
  label: string
  required: boolean
  autocomplete: string
}

export type DebriefAudience = {
  id: 'participants' | 'host'
  title: string
  minutes: string
  intro: string
  note: string
  anonymous: boolean
  identity: IdentityField[]
  questions: DebriefQuestion[]
}

const MAX_TEXT = 4000
const MAX_NAME = 120

export const AUDIENCES: DebriefAudience[] = [
  {
    id: 'participants',
    title: 'Debrief for participants',
    minutes: '',
    intro: '',
    note: 'Anonymous. No name, no firm, no email. About 3 minutes.',
    anonymous: true,
    identity: [],
    questions: [
      {
        id: 'overall',
        kind: 'scale',
        prompt: 'How would you rate the conference overall?',
        hint: '1 is low, 10 is high.',
        min: 1,
        max: 10,
      },
      {
        id: 'parts',
        kind: 'matrix',
        prompt: 'Please rate each item separately.',
        hint: '1 is low, 5 is high. Choose Did not attend if you were not there.',
        min: 1,
        max: 5,
        naLabel: 'Did not attend',
        items: [
          { id: 'information', label: 'Information beforehand' },
          { id: 'hotelVenue', label: 'Hotel and venue' },
          { id: 'keynotes', label: 'Keynote speakers' },
          { id: 'business', label: 'Business Generation tables' },
          { id: 'culture', label: 'Cultural programme' },
        ],
      },
      {
        id: 'contacts',
        kind: 'choice',
        prompt: 'Did the conference lead to new contacts or referrals?',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'not_yet', label: 'Not yet' },
          { id: 'no', label: 'No' },
        ],
      },
      {
        id: 'worked',
        kind: 'text',
        prompt: 'What worked best?',
        required: false,
      },
      {
        id: 'differently',
        kind: 'text',
        prompt: 'What should we do differently?',
        required: false,
      },
      {
        id: 'topics',
        kind: 'text',
        prompt: 'Which topics would you like at the next conference?',
        required: false,
      },
    ],
  },
  {
    id: 'host',
    title: 'Debrief for the host firm',
    minutes: 'About 5 minutes',
    intro:
      'A separate short questionnaire for the organising office. The results are for the GBL Board only.',
    note: 'Please leave your name and firm, so the Board knows which office answered.',
    anonymous: false,
    identity: [
      { id: 'name', label: 'Your name', required: true, autocomplete: 'name' },
      { id: 'firm', label: 'Firm', required: true, autocomplete: 'organization' },
    ],
    questions: [
      { id: 'wentWell', kind: 'text', prompt: 'What went well?', required: true },
      { id: 'challenge', kind: 'text', prompt: 'What was the biggest challenge?', required: true },
      { id: 'missed', kind: 'text', prompt: 'What did you miss from GBL?', required: true },
      {
        id: 'advice',
        kind: 'text',
        prompt: 'What advice would you give the next host firm?',
        required: true,
      },
    ],
  },
]

export function audienceById(id: string): DebriefAudience | undefined {
  return AUDIENCES.find((item) => item.id === id)
}

function cleanText(value: unknown): string | null {
  if (value == null) return ''
  if (typeof value !== 'string') return null
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
}

function asInt(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN
  if (!Number.isInteger(n)) return null
  return n
}

export function parseSubmission(
  audience: DebriefAudience,
  raw: unknown,
): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const body = raw as Record<string, unknown>
  const answers: Record<string, unknown> = {}

  for (const field of audience.identity) {
    const value = cleanText(body[field.id])
    if (value === null || value.length > MAX_NAME) return null
    if (field.required && !value) return null
    answers[field.id] = value
  }

  for (const question of audience.questions) {
    const value = body[question.id]
    if (question.kind === 'scale') {
      const n = asInt(value)
      if (n === null || n < question.min || n > question.max) return null
      answers[question.id] = n
      continue
    }
    if (question.kind === 'matrix') {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null
      const row = value as Record<string, unknown>
      const out: Record<string, number | 'na'> = {}
      for (const item of question.items) {
        const cell = row[item.id]
        if (cell === 'na') {
          out[item.id] = 'na'
          continue
        }
        const n = asInt(cell)
        if (n === null || n < question.min || n > question.max) return null
        out[item.id] = n
      }
      answers[question.id] = out
      continue
    }
    if (question.kind === 'choice') {
      if (typeof value !== 'string' || !question.options.some((option) => option.id === value)) return null
      answers[question.id] = value
      continue
    }
    const text = cleanText(value)
    if (text === null || text.length > MAX_TEXT) return null
    if (question.required && !text) return null
    answers[question.id] = text
  }

  return answers
}

export type AnswerLine = { label: string; value: string }

export function answerLines(audienceId: string, answers: Record<string, unknown>): AnswerLine[] {
  const audience = audienceById(audienceId)
  const lines: AnswerLine[] = []
  const used = new Set<string>()

  const push = (id: string, label: string, value: unknown) => {
    used.add(id)
    lines.push({ label, value: value === '' || value == null ? '—' : String(value) })
  }

  if (!audience) {
    for (const [key, value] of Object.entries(answers)) push(key, key, typeof value === 'object' ? JSON.stringify(value) : value)
    return lines
  }

  for (const field of audience.identity) push(field.id, field.label, answers[field.id])

  for (const question of audience.questions) {
    const value = answers[question.id]
    if (question.kind === 'matrix') {
      const row = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
      for (const item of question.items) {
        const cell = row[item.id]
        push(`${question.id}.${item.id}`, item.label, cell === 'na' ? question.naLabel : cell)
      }
      used.add(question.id)
      continue
    }
    if (question.kind === 'choice') {
      const label = question.options.find((option) => option.id === value)?.label
      push(question.id, question.prompt, label || value)
      continue
    }
    push(question.id, question.prompt, value)
  }

  for (const [key, value] of Object.entries(answers)) {
    if (used.has(key)) continue
    push(key, key, typeof value === 'object' ? JSON.stringify(value) : value)
  }
  return lines
}
