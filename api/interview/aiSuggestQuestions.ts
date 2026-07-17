export interface AiPrepAnswers {
  sector: string
  specialism: string
  timeliness: string
  /** Optional free-form instructions from crew */
  customPrompt?: string
}

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
  prepAnswers?: AiPrepAnswers
  language?: 'nl' | 'en'
  addressForm?: 'u' | 'jij'
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

function trimQuestions(list: unknown, max = 4): string[] {
  if (!Array.isArray(list)) return []
  return list
    .map((q) => String(q || '').trim())
    .filter(Boolean)
    .slice(0, max)
}

function normalizeGuestType(value: string | undefined): string {
  const type = String(value || '').trim()
  if (!type) return 'Other'
  if (GUEST_TYPES.has(type)) return type
  return 'Other'
}

function buildUserPrompt(input: SuggestQuestionsInput): string {
  const guestType = normalizeGuestType(input.guestType)
  const isEnglish = input.language === 'en'
  const language = isEnglish ? 'English' : 'Dutch'
  const addressForm = isEnglish
    ? 'natural professional English'
    : input.addressForm === 'jij' ? 'jij (informal)' : 'u (formal)'
  const defaults = (input.productionDefaults || []).map((q) => q.trim()).filter(Boolean)
  const isParticipant = guestType === 'Participant'
  const isProductionScope = input.scope === 'production'

  const prep = input.prepAnswers
  const hasStructuredBriefing = Boolean(
    prep && (prep.sector.trim() || prep.specialism.trim() || prep.timeliness.trim()),
  )
  const hasCustomPrompt = Boolean(prep?.customPrompt?.trim())

  const lines = [
    `OUTPUT LANGUAGE (mandatory): ${language}`,
    `Write every question entirely in ${language}. Do not mix languages.`,
    isEnglish
      ? 'Do not write Dutch.'
      : 'Schrijf alle vragen in het Nederlands. Geen Engels.',
    `Address form: ${addressForm}`,
    `Scope: ${isProductionScope ? 'production defaults for Participants' : 'single guest'}`,
    `Production: ${input.productionName || 'Unknown event'}`,
    '',
    'STRICT RULES:',
  ]

  if (hasStructuredBriefing) {
    lines.push(
      '- Use ONLY facts from the crew briefing below for sector, theme and timeliness.',
      '- Do NOT infer or invent industries, sectors, regulations or topics from job titles or roles.',
      '- Example: role "putjesschepper op zee" does NOT justify maritime or cybersecurity questions unless the briefing says so.',
    )
  } else if (hasCustomPrompt) {
    lines.push(
      '- Follow the crew prompt below as the main brief for topics and angle.',
      '- Do NOT invent extra industries or themes beyond that prompt and the production name.',
      `- Even if the crew prompt is in another language, still write the questions in ${language}.`,
    )
  } else {
    lines.push(
      '- Do NOT invent industries, sectors or topics from job titles or roles.',
    )
  }

  lines.push(
    '- Name and role may only help tailor wording, not introduce new subject matter.',
    isEnglish
      ? '- Use natural professional English in every question.'
      : '- Use the requested Dutch address form (u or jij) consistently in every question.',
    '- Keep each question short and speakable on camera (max. ~15 words).',
    '- One question per sentence only. Never combine two questions in one sentence.',
  )

  if (input.productionDate) lines.push(`Production date: ${input.productionDate}`)
  if (input.productionContext?.trim()) lines.push(`Extra context: ${input.productionContext.trim()}`)

  if (hasStructuredBriefing && prep) {
    lines.push(
      'Crew briefing:',
      `1. Sector / industry: ${prep.sector.trim()}`,
      `2. Specialism or angle: ${prep.specialism.trim()}`,
      `3. Current topics: ${prep.timeliness.trim()}`,
    )
  }
  if (hasCustomPrompt && prep) {
    lines.push(
      'Crew prompt (follow these extra instructions carefully):',
      prep.customPrompt!.trim(),
    )
  }

  if (!isProductionScope) {
    lines.push('Guest context (wording only, do not invent topics from this):')
    lines.push(`Guest type: ${guestType}`)
    if (input.name?.trim()) lines.push(`Name: ${input.name.trim()}`)
    if (input.role?.trim()) lines.push(`Role: ${input.role.trim()}`)
    if (input.planning?.trim()) lines.push(`Schedule: ${input.planning.trim()}`)
  }

  if (isParticipant && defaults.length) {
    lines.push(
      'Production default questions for Participants (use as foundation, adapt lightly, rewrite into the output language if needed):',
      ...defaults.map((q, i) => `${i + 1}. ${q}`),
    )
  } else if (!isParticipant && defaults.length) {
    lines.push(
      'Note: production default questions exist but apply only to Participants. Do not reuse them for this guest type.',
    )
  }

  if (isProductionScope) {
    lines.push(isEnglish
      ? 'Write exactly 4 default interview questions in English for Participants at this event.'
      : 'Schrijf precies 4 standaard interviewvragen in het Nederlands voor Participants op dit event.')
  } else if (isParticipant) {
    lines.push(isEnglish
      ? 'Write exactly 4 interview questions in English tailored to this participant.'
      : 'Schrijf precies 4 interviewvragen in het Nederlands, toegesneden op deze participant.')
  } else if (guestType === 'Sponsor') {
    lines.push(isEnglish
      ? 'Write exactly 4 interview questions in English about the sponsorship, brand fit and value for the audience.'
      : 'Schrijf precies 4 interviewvragen in het Nederlands over sponsorship, merkfit en waarde voor het publiek.')
  } else if (guestType === 'Keynote speaker') {
    lines.push(isEnglish
      ? 'Write exactly 4 interview questions in English about the keynote theme, vision and sector relevance.'
      : 'Schrijf precies 4 interviewvragen in het Nederlands over het keynote-thema, visie en relevantie voor de sector.')
  } else if (guestType === 'Executive') {
    lines.push(isEnglish
      ? 'Write exactly 4 interview questions in English about leadership, strategy and event significance.'
      : 'Schrijf precies 4 interviewvragen in het Nederlands over leiderschap, strategie en het belang van dit event.')
  } else {
    lines.push(isEnglish
      ? 'Write exactly 4 balanced on-camera interview questions in English for this guest.'
      : 'Schrijf precies 4 evenwichtige interviewvragen in het Nederlands voor deze gast.')
  }

  lines.push(
    `Final check: every string in "questions" must be ${language}.`,
    'Return JSON only: {"questions":["..."]} with at most 4 questions.',
  )
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
  const nl = input.language !== 'en'

  if (input.scope === 'production' || guestType === 'Participant') {
    if (defaults.length >= 4) return defaults.slice(0, 4)
    return nl
      ? [
          'Wat viel u vandaag het meest op?',
          'Wat was het hoogtepunt van deze dag?',
          'Wat neemt u mee terug naar uw organisatie?',
          'Heeft u een boodschap voor wie er niet bij kon zijn?',
        ]
      : [
          'What stood out most for you at this event?',
          'What was the highlight of your day?',
          'What will you take back to your organisation?',
          'Do you have a message for viewers who could not attend?',
        ]
  }

  if (guestType === 'Sponsor') {
    return nl
      ? [
          'Waarom sponsort u dit event?',
          'Welke connectie ziet u tussen uw merk en dit publiek?',
          'Wat hebben deelnemers aan uw betrokkenheid?',
          'Wat wilt u dat men onthoudt van deze samenwerking?',
        ]
      : [
          'Why did you choose to sponsor this event?',
          'What connection do you see between your brand and this audience?',
          'What do participants gain from your involvement?',
          'What would you like people to remember about your partnership?',
        ]
  }

  if (guestType === 'Keynote speaker') {
    return nl
      ? [
          'Wat is de kernboodschap van uw keynote?',
          'Waarom is dit onderwerp nu urgent voor dit publiek?',
          'Wat moeten deelnemers morgen anders doen?',
          'Wat verraste u het meest bij de voorbereiding?',
        ]
      : [
          'What is the core message of your keynote?',
          'Why is this topic urgent for this audience now?',
          'What should participants do differently after your session?',
          'What surprised you most in preparing for this event?',
        ]
  }

  if (guestType === 'Executive') {
    return nl
      ? [
          'Waarom is dit event belangrijk voor uw organisatie?',
          'Welk strategisch thema raakt uw werk nu het meest?',
          'Wat wilde u dat deelnemers vandaag meenemen?',
          'Hoe volgt u op wat hier gebeurde?',
        ]
      : [
          'Why is this event important for your organisation?',
          'What strategic theme connects most to your work right now?',
          'What did you want participants to take away today?',
          'How will you follow up on what happened here?',
        ]
  }

  return nl
    ? [
        'Wat viel u vandaag het meest op?',
        'Wat was vandaag het meest waardevol?',
        'Wat gaat u hierna toepassen?',
        'Heeft u nog een slotboodschap voor het publiek?',
      ]
    : [
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

  const isEnglish = input.language === 'en'
  const language = isEnglish ? 'English' : 'Dutch'
  const systemPrompt = [
    'You write concise on-camera interview questions for business events.',
    `CRITICAL: Write ALL questions in ${language} only. Never mix languages.`,
    isEnglish
      ? 'Do not output Dutch questions.'
      : 'Schrijf uitsluitend Nederlandse vragen. Geen Engelse vragen.',
    'Output JSON only with key "questions" (array of exactly 4 strings, never more).',
    'Each question must be short, speakable, non-leading, and not yes/no.',
    'Exactly one question per item. Never put two questions in one sentence.',
    'Use ONLY the crew briefing for sector, specialism and timeliness. Never invent topics.',
    'Do not infer industry or themes from job titles or roles.',
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
      temperature: 0.4,
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
