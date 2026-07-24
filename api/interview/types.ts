export type GastStatus = 'Entered' | 'Checked' | 'Recorded'
export type ProductieStatus = 'Planned' | 'Active' | 'Completed'
export type GastType = 'Keynote speaker' | 'Executive' | 'Participant' | 'Sponsor' | 'Other' | ''

export interface InterviewSettings {
  maxChars: number
}

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
  planning: string
  gedeeld: boolean
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
  Gepland: 'Planned',
  Gaande: 'Active',
  Afgerond: 'Completed',
  Planned: 'Planned',
  Active: 'Active',
  Completed: 'Completed',
}

export function normalizeGastStatus(value: string): GastStatus {
  return LEGACY_GAST_STATUS[value] || 'Entered'
}

export function normalizeProductieStatus(value: string): ProductieStatus {
  return LEGACY_PRODUCTIE_STATUS[value] || 'Planned'
}

export const CREW_MEMBERS = [
  'N.V.T.',
  'Rolf Trijber',
  'Maurice Antenbrink',
  'Ron Gessel',
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
