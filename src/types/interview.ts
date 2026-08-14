export type GastStatus = 'Entered' | 'Checked' | 'Recorded'
export type ProductieStatus = 'OPT' | 'DEF' | 'COMPL'

export interface InterviewSettings {
  maxChars: number
}

export type InterviewRole = 'crew' | 'client'

export interface Productie {
  id: string
  naam: string
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
  questions: string[]
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

/** Crew roster for Supervisor / Crew 2–5 dropdowns */
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

/** Crew members who can log in (excludes N.V.T.) */
export const CREW_LOGIN_NAMES = CREW_MEMBERS.filter((m) => m !== 'N.V.T.')

export function normalizeCrewMember(value: string | null | undefined, fallback = DEFAULT_CREW_SLOT): string {
  const v = String(value || '').trim()
  if ((CREW_MEMBERS as readonly string[]).includes(v)) return v
  return fallback
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
  'production', 'type', 'name', 'role', 'organization', 'planning', 'shared',
  'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8',
  'status', 'crew_number', 'date', 'time',
] as const

/** Client template columns — without crew fields */
export const CLIENT_CSV_HEADERS = [
  'production', 'type', 'name', 'role', 'organization', 'planning', 'shared',
  'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8',
] as const
