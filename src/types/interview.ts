export type GastStatus = 'Entered' | 'Checked' | 'Recorded'
export type ProductieStatus = 'Planned' | 'Active' | 'Completed'

export interface InterviewSettings {
  maxChars: number
}

export type InterviewRole = 'crew' | 'client'

export interface Productie {
  id: string
  naam: string
  datum: string
  status: ProductieStatus
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

export type TabId = 'productions' | 'production' | 'candidate'

export type GuestView = 'form' | 'controle' | 'camera' | 'interviewer' | null

export const GAST_TYPES = ['Keynote speaker', 'Executive', 'Participant', 'Sponsor', 'Other'] as const
export const INTAKE_LOCK_TYPES = ['Keynote speaker', 'Executive', 'Sponsor'] as const

export function intakeLockApplies(type: string): boolean {
  return (INTAKE_LOCK_TYPES as readonly string[]).includes(type)
}
export const GAST_STATUS_ORDER: GastStatus[] = ['Entered', 'Checked', 'Recorded']
export const PRODUCTIE_STATUSES: ProductieStatus[] = ['Planned', 'Active', 'Completed']

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

export const CSV_HEADERS = [
  'production', 'type', 'name', 'role', 'planning', 'shared',
  'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7',
  'status', 'crew_number', 'date', 'time',
] as const

/** Client template columns — without crew fields */
export const CLIENT_CSV_HEADERS = [
  'production', 'type', 'name', 'role', 'planning', 'shared',
  'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7',
] as const
