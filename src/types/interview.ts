export type GastStatus = 'Entered' | 'Checked' | 'Recorded'
export type ProductieStatus = 'OPT' | 'DEF' | 'COMPL'

export interface InterviewSettings {
  maxChars: number
}

export type InterviewRole = 'crew' | 'client' | 'set'

export type PngRatioId = '16x9' | '9x16' | '4x5'

export const MAX_GENERAL_TITLE_CHARS = 50
export const MAX_INTERVIEW_TITLE_CHARS = 50
export const MAX_PNG_BYTES = 3 * 1024 * 1024

export const PNG_RATIOS: Array<{ id: PngRatioId; label: string; ratio: number }> = [
  { id: '16x9', label: '16:9', ratio: 16 / 9 },
  { id: '9x16', label: '9:16', ratio: 9 / 16 },
  { id: '4x5', label: '4:5', ratio: 4 / 5 },
]

/** Temporary: hide 9:16 slots until that format is finetuned. */
export const SHOW_PORTRAIT_THUMBNAIL_RATIOS = false
/** LinkedIn 4:5, next to landscape 16:9. */
export const SHOW_45_THUMBNAIL_RATIO = true

export interface Productie {
  id: string
  naam: string
  /** Overlay title for later thumbnails (max 30) */
  generalTitel: string
  png16x9: string
  png9x16: string
  png4x5: string
  /** Start date (YYYY-MM-DD) */
  datum: string
  /** Start time (HH:mm) */
  startTijd: string
  /** End date (YYYY-MM-DD) */
  eindDatum: string
  /** End time (HH:mm) */
  eindTijd: string
  status: ProductieStatus
  locatie: string
  land: string
  /** Client from Settings. Empty when none is chosen. */
  clientId: string
  supervisor: string
  crew2: string
  crew3: string
  crew4: string
  crew5: string
  callsheet: CallsheetData
  vragen: string[]
  archivedAt: string | null
  hasClientPassword?: boolean
  createdAt: string
  updatedAt: string
}

export interface Gast {
  id: string
  productieNaam: string
  type: string
  naam: string
  functie: string
  organisatie: string
  planning: string
  gedeeld: boolean
  /** Optional spoken intro before the interview questions */
  introTekst: string
  /** Optional spoken outro after the interview questions */
  outroTekst: string
  /** Series / show name used in intro and outro (e.g. Cloud Talk) */
  serieNaam: string
  /** Overlay title for later thumbnails (max 30) */
  interviewTitel: string
  screenshot16x9: string
  screenshot9x16: string
  screenshot4x5: string
  thumbnail16x9: string
  thumbnail9x16: string
  thumbnail4x5: string
  questions: string[]
  /** Interviewer / host for this recording. Carried over to the next interview in the same production. */
  moderator: string
  /** Role or job title of the moderator */
  moderatorFunctie: string
  /** Premiere transcript for short-form snippets. Crew only. */
  transcript: string
  transcriptFilename: string
  intakeComplete: boolean
  status: GastStatus
  regienummer: string
  datum: string
  tijd: string
  createdAt: string
  updatedAt: string
}

export type TabId = 'productions' | 'production' | 'candidate'

export type GuestView = 'form' | 'controle' | 'camera' | 'interviewer' | null

export const GAST_TYPES = ['Keynote speaker', 'Executive', 'Participant', 'Sponsor', 'Other'] as const
export const INTAKE_LOCK_TYPES = ['Keynote speaker', 'Executive', 'Sponsor'] as const

export function intakeLockApplies(type: string): boolean {
  return (INTAKE_LOCK_TYPES as readonly string[]).includes(type)
}
export const GAST_STATUS_ORDER: GastStatus[] = ['Entered', 'Checked', 'Recorded']
export const PRODUCTIE_STATUSES: ProductieStatus[] = ['OPT', 'DEF', 'COMPL']

/** Fallback roster until the crew table has loaded. N.V.T. is an empty slot, not a person. */
export const CREW_MEMBERS = [
  'N.V.T.',
  'Rolf Trijber',
  'Maurice Antenbrink',
  'Ron Gessel',
  'Jeroen Lutmers',
  'Niels Visser',
  'Vanessa Cristina',
] as const

export const DEFAULT_SUPERVISOR = 'Rolf Trijber'
export const DEFAULT_CREW_SLOT = 'N.V.T.'

export interface CallsheetContact {
  rol: string
  naam: string
  telefoon: string
}

/** Role, phone and call time for Supervisor and Crew 2–5. The name stays on the production. */
export interface CallsheetCrewDetail {
  rol: string
  telefoon: string
  callTijd: string
}

export interface CallsheetProgramRow {
  tijd: string
  onderdeel: string
  locatie: string
  crew: string
  highlight: boolean
}

export interface CallsheetGearRow {
  categorie: string
  omschrijving: string
  aantal: string
  ok: boolean
}

export interface CallsheetData {
  opdrachtgever: string
  parkeren: string
  locatieAdres: string
  locatiePlaats: string
  programmaUrl: string
  crewKleding: string
  contacten: CallsheetContact[]
  crewDetails: CallsheetCrewDetail[]
  programma: CallsheetProgramRow[]
  apparatuur: CallsheetGearRow[]
}

/** Rolf and Maurice run the interviews and can log in to the full app. */
export const INTERVIEWER_NAMES = ['Rolf Trijber', 'Maurice Antenbrink'] as const

/** @deprecated Use INTERVIEWER_NAMES. Kept so older imports stay limited to the two interviewers. */
export const CREW_LOGIN_NAMES = INTERVIEWER_NAMES

export interface ClientContact {
  rol: string
  naam: string
  telefoon: string
}

export interface ClientRecord {
  id: string
  naam: string
  contacten: ClientContact[]
}

export interface CrewMember {
  id: string
  naam: string
  rol: string
  telefoon: string
}

export function normalizeCrewMember(value: string | null | undefined, fallback = DEFAULT_CREW_SLOT): string {
  const v = String(value || '').trim().slice(0, 80)
  return v || fallback
}

const LEGACY_GAST_STATUS: Record<string, GastStatus> = {
  Ingevoerd: 'Entered',
  Gecontroleerd: 'Checked',
  Opgenomen: 'Recorded',
  Entered: 'Entered',
  Checked: 'Checked',
  Recorded: 'Recorded',
}

const LEGACY_PRODUCTIE_STATUS: Record<string, ProductieStatus> = {
  Gepland: 'OPT',
  Gaande: 'DEF',
  Afgerond: 'COMPL',
  Planned: 'OPT',
  Active: 'DEF',
  Completed: 'COMPL',
  Option: 'OPT',
  Definitief: 'DEF',
  Definite: 'DEF',
  OPT: 'OPT',
  DEF: 'DEF',
  COMPL: 'COMPL',
}

export function normalizeGastStatus(value: string): GastStatus {
  return LEGACY_GAST_STATUS[value] || 'Entered'
}

export function normalizeProductieStatus(value: string): ProductieStatus {
  return LEGACY_PRODUCTIE_STATUS[value] || 'OPT'
}

export const CSV_HEADERS = [
  'production', 'type', 'name', 'role', 'organization', 'moderator', 'moderator_role', 'planning', 'shared',
  'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10',
  'status', 'crew_number', 'date', 'time',
] as const

/** Client template columns — without crew fields */
export const CLIENT_CSV_HEADERS = [
  'production', 'type', 'name', 'role', 'organization', 'moderator', 'moderator_role', 'planning', 'shared',
  'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10',
] as const

/** Carry-over: newest interview in this production that already has a moderator. */
export function lastModeratorForProduction(
  guests: Array<Pick<Gast, 'productieNaam' | 'moderator' | 'moderatorFunctie' | 'createdAt'>>,
  productieNaam: string,
): { moderator: string; moderatorFunctie: string } {
  const name = productieNaam.trim()
  if (!name) return { moderator: '', moderatorFunctie: '' }
  const matches = guests
    .filter((g) => g.productieNaam === name && String(g.moderator || '').trim())
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
  const last = matches[0]
  return {
    moderator: last?.moderator?.trim() || '',
    moderatorFunctie: last?.moderatorFunctie?.trim() || '',
  }
}
