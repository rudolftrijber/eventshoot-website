import type { Gast } from './types.js'

export type VisnipSnippet = {
  title: string
  start: string
  end: string
  search: string
  check: string
}

const TIMECODE = /^\d{2}:\d{2}:\d{2}:\d{2}$/
const MAX_TRANSCRIPT_CHARS = 60_000

function clip(value: unknown, max: number): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function parseTimecode(value: string): number | null {
  if (!TIMECODE.test(value)) return null
  const [h, m, s, f] = value.split(':').map(Number)
  return h * 3600 + m * 60 + s + f / 25
}

function parseSnippet(value: unknown): VisnipSnippet | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const start = clip(row.start, 11)
  const end = clip(row.end, 11)
  const startSec = parseTimecode(start)
  const endSec = parseTimecode(end)
  const search = clip(row.search, 180)
  if (startSec == null || endSec == null || endSec <= startSec || !search) return null
  const duration = endSec - startSec
  if (duration < 12 || duration > 55) return null
  return {
    title: clip(row.title, 140) || 'Snippet',
    start,
    end,
    search,
    check: clip(row.check, 180),
  }
}

function parseModelJson(text: string): VisnipSnippet[] {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = (fenced?.[1] || text).trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('Snippet list could not be parsed')
  const data = JSON.parse(raw.slice(start, end + 1)) as { snippets?: unknown }
  const snippets = Array.isArray(data.snippets)
    ? data.snippets.map(parseSnippet).filter((item): item is VisnipSnippet => Boolean(item))
    : []
  if (!snippets.length) throw new Error('Snippet list was empty')
  return snippets.slice(0, 3)
}

function buildPrompt(guest: Gast, transcript: string): string {
  const questions = guest.questions.map((q) => q.trim()).filter(Boolean)
  return [
    `Candidate: ${guest.naam}`,
    guest.functie ? `Role: ${guest.functie}` : '',
    guest.organisatie ? `Organization: ${guest.organisatie}` : '',
    guest.moderator ? `Host: ${guest.moderator}${guest.moderatorFunctie ? `, ${guest.moderatorFunctie}` : ''}` : '',
    questions.length ? `Questions:\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}` : '',
    '',
    'Transcript:',
    transcript,
  ].filter(Boolean).join('\n')
}

export async function selectVisnipSnippets(guest: Gast): Promise<VisnipSnippet[]> {
  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim()
  const model = (process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5').trim()
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured')

  const transcript = guest.transcript.trim().slice(0, MAX_TRANSCRIPT_CHARS)
  if (!transcript) throw new Error('No transcript')

  const system = [
    'You select vertical short-form snippets from one event vodcast transcript for a video editor.',
    'Output JSON only: {"snippets":[{"title":"","start":"","end":"","search":"","check":""}]}.',
    'Return exactly 3 snippets.',
    'Each snippet lasts 20 to 40 seconds. Timecode format is HH:MM:SS:FF, copied from the transcript.',
    'These are teasers. Do not give away the whole answer of the long interview.',
    'No call to action, no follow-us line, no end slate.',
    'Use the candidate name, role and organization from the briefing. Do not rename the person from the transcript.',
    'Prefer lines spoken by the guest, not the host welcome or thank-you.',
    'title is one short hook in the transcript language, max 12 words.',
    'search is a verbatim phrase from the start of the snippet, long enough to find in Premiere.',
    'check lists numbers, prices, product names or spelled names the editor must verify on the audio. Empty string if nothing needs a check.',
    'start must be earlier than end.',
  ].join(' ')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1400,
      temperature: 0.2,
      system,
      messages: [{ role: 'user', content: buildPrompt(guest, transcript) }],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    try {
      const data = JSON.parse(text) as { error?: { message?: string } }
      const message = data.error?.message || ''
      if (/credit balance is too low/i.test(message)) {
        throw new Error('Anthropic credits are empty. Add credits in the Anthropic console.')
      }
      if (/invalid x-api-key|authentication/i.test(message)) {
        throw new Error('Invalid Anthropic API key. Check ANTHROPIC_API_KEY.')
      }
      if (message) throw new Error(message)
    } catch (err) {
      if (err instanceof Error && !err.message.startsWith('Unexpected')) throw err
    }
    throw new Error(`AI request failed (${response.status})`)
  }

  const data = await response.json() as { content?: Array<{ type?: string, text?: string }> }
  const text = (data.content || []).filter((block) => block.type === 'text').map((block) => block.text || '').join('\n')
  if (!text.trim()) throw new Error('Snippet list was empty')
  return parseModelJson(text)
}
