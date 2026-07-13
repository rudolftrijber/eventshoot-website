export interface SuggestQuestionsInput {
  scope: 'guest' | 'production'
  productionName: string
  productionDate?: string
  productionContext?: string
  guestType?: string
  name?: string
  role?: string
  planning?: string
  productionDefaults?: string[]
  language?: 'nl' | 'en'
}

export interface SuggestQuestionsResult {
  questions: string[]
}

const GUEST_TYPES = new Set([
  'Keynote speaker',
  'Executive',
  'Participant',
  'Sponsor',
  'Other',
])

function trimQuestions(list: unknown): string[] {
  if (!Array.isArray(list)) return []
  return list
    .map((q) => String(q || '').trim())
    .filter(Boolean)
    .slice(0, 7)
}

function normalizeGuestType(value: string | undefined): string {
  const type = String(value || '').trim()
  if (!type) return 'Other'
  if (GUEST_TYPES.has(type)) return type
  return 'Other'
}

function buildUserPrompt(input: SuggestQuestionsInput): string {
  const guestType = normalizeGuestType(input.guestType)
  const language = input.language === 'en' ? 'English' : 'Dutch'
  const defaults = (input.productionDefaults || []).map((q) => q.trim()).filter(Boolean)
  const isParticipant = guestType === 'Participant'
  const isProductionScope = input.scope === 'production'

  const lines = [
    `Language: ${language}`,
    `Scope: ${isProductionScope ? 'production defaults for Participants' : 'single guest'}`,
    `Production: ${input.productionName || 'Unknown event'}`,
  ]

  if (input.productionDate) lines.push(`Production date: ${input.productionDate}`)
  if (input.productionContext?.trim()) lines.push(`Event context: ${input.productionContext.trim()}`)

  if (!isProductionScope) {
    lines.push(`Guest type: ${guestType}`)
    if (input.name?.trim()) lines.push(`Name: ${input.name.trim()}`)
    if (input.role?.trim()) lines.push(`Role: ${input.role.trim()}`)
    if (input.planning?.trim()) lines.push(`Schedule: ${input.planning.trim()}`)
  }

  if (isParticipant && defaults.length) {
    lines.push(
      'Production default questions for Participants (use as foundation, adapt lightly):',
      ...defaults.map((q, i) => `${i + 1}. ${q}`),
    )
  } else if (!isParticipant && defaults.length) {
    lines.push(
      'Note: production default questions exist but apply only to Participants. Do not reuse them for this guest type.',
    )
  }

  if (isProductionScope) {
    lines.push('Write 4 default interview questions for Participants at this event.')
  } else if (isParticipant) {
    lines.push('Write 4 to 7 interview questions tailored to this participant.')
  } else if (guestType === 'Sponsor') {
    lines.push('Write 4 to 7 interview questions about the sponsorship, brand fit and value for the audience.')
  } else if (guestType === 'Keynote speaker') {
    lines.push('Write 4 to 7 interview questions about the keynote theme, vision and sector relevance.')
  } else if (guestType === 'Executive') {
    lines.push('Write 4 to 7 interview questions about leadership, strategy and event significance.')
  } else {
    lines.push('Write 4 to 7 balanced on-camera interview questions for this guest.')
  }

  lines.push('Return JSON only: {"questions":["..."]}')
  return lines.join('\n')
}

function parseModelJson(content: string): string[] {
  const trimmed = content.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced?.[1]?.trim() || trimmed
  const parsed = JSON.parse(raw) as { questions?: unknown }
  return trimQuestions(parsed.questions)
}

function fallbackQuestions(input: SuggestQuestionsInput): string[] {
  const guestType = normalizeGuestType(input.guestType)
  const defaults = (input.productionDefaults || []).map((q) => q.trim()).filter(Boolean)

  if (input.scope === 'production' || guestType === 'Participant') {
    if (defaults.length >= 4) return defaults.slice(0, 7)
    return [
      'What stood out most for you at this event?',
      'What was the highlight of your day?',
      'What will you take back to your organisation?',
      'Do you have a message for viewers who could not attend?',
    ]
  }

  if (guestType === 'Sponsor') {
    return [
      'Why did you choose to sponsor this event?',
      'What connection do you see between your brand and this audience?',
      'What do participants gain from your involvement?',
      'What would you like people to remember about your partnership?',
    ]
  }

  if (guestType === 'Keynote speaker') {
    return [
      'What is the core message of your keynote?',
      'Why is this topic urgent for this audience now?',
      'What should participants do differently after your session?',
      'What surprised you most in preparing for this event?',
    ]
  }

  if (guestType === 'Executive') {
    return [
      'Why is this event important for your organisation?',
      'What strategic theme connects most to your work right now?',
      'What did you want participants to take away today?',
      'How will you follow up on what happened here?',
    ]
  }

  return [
    'What stood out most for you today?',
    'What was most valuable about being here?',
    'What will you apply after this event?',
    'Do you have a final message for the audience?',
  ]
}

function parseAnthropicError(status: number, text: string): string {
  try {
    const data = JSON.parse(text) as { error?: { message?: string; type?: string } }
    const message = data.error?.message || ''
    if (/credit balance is too low/i.test(message)) {
      return 'Anthropic credits are empty. Go to console.anthropic.com → Plans & Billing to add credits.'
    }
    if (/invalid x-api-key|authentication/i.test(message)) {
      return 'Invalid Anthropic API key. Check ANTHROPIC_API_KEY in Vercel.'
    }
    if (message) return message
  } catch {
    // fall through
  }
  return `AI request failed (${status})`
}

export async function suggestInterviewQuestions(
  input: SuggestQuestionsInput,
): Promise<SuggestQuestionsResult> {
  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim()
  const model = (process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5').trim()

  if (!apiKey) {
    const questions = fallbackQuestions(input)
    if (questions.length < 4) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }
    return { questions }
  }

  const systemPrompt = [
    'You write concise on-camera interview questions for business events.',
    'Output JSON only with key "questions" (array of 4-7 strings).',
    'Questions must be speakable, non-leading, and not yes/no.',
    'Production default questions apply only to Participant guests.',
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
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        { role: 'user', content: buildUserPrompt(input) },
      ],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(parseAnthropicError(response.status, text))
  }

  const data = await response.json() as {
    content?: Array<{ type?: string; text?: string }>
  }
  const content = data.content?.find((block) => block.type === 'text')?.text
  if (!content) throw new Error('AI returned an empty response')

  let questions: string[]
  try {
    questions = parseModelJson(content)
  } catch {
    throw new Error('AI response could not be parsed')
  }

  if (questions.length < 1) {
    throw new Error('AI returned no questions')
  }

  return { questions }
}
