export type GastStatus = 'Entered' | 'Checked' | 'Recorded'
export type ProductieStatus = 'OPT' | 'DEF' | 'COMPL'
export type GastType = 'Keynote speaker' | 'Executive' | 'Participant' | 'Sponsor' | 'Other' | ''

export interface InterviewSettings {
  maxChars: number
}

export type PngRatioId = '16x9' | '9x16' | '4x5'

export const MAX_GENERAL_TITLE_CHARS = 30
export const MAX_INTERVIEW_TITLE_CHARS = 30
export const MAX_PNG_BYTES = 3 * 1024 * 1024

export const PNG_RATIOS: Array<{ id: PngRatioId; label: string; ratio: number }> = [
  { id: '16x9', label: '16:9', ratio: 16 / 9 },
  { id: '9x16', label: '9:16', ratio: 9 / 16 },
  { id: '4x5', label: '4:5', ratio: 4 / 5 },
]

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
  supervisor: string
  crew2: string
  crew3: string
  crew4: string
  crew5: string
  vragen: string[]
  archivedAt: string | null
  hasClientPassword?: boolean
  /** Crew-only: recoverable client password for display */
  clientPasswordStored?: string
  clientPassword?: string
  createdAt: string
  updatedAt: string
}

export interface Gast {
  id: string
  productieNaam: string
  type: GastType | string
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
  intakeComplete: boolean
  status: GastStatus
  regienummer: string
  datum: string
  tijd: string
  createdAt: string
  updatedAt: string
}

export interface SyncPayload {
  guests: Gast[]
  productions: Productie[]
  settings: InterviewSettings
  serverTime: string
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

export function normalizeCrewMember(value: string | null | undefined, fallback = DEFAULT_CREW_SLOT): string {
  const v = String(value || '').trim()
  if ((CREW_MEMBERS as readonly string[]).includes(v)) return v
  return fallback
}
