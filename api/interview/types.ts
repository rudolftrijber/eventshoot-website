export type GastStatus = 'Entered' | 'Checked' | 'Recorded'
export type ProductieStatus = 'Planned' | 'Active' | 'Completed'
export type GastType = 'Keynote speaker' | 'Executive' | 'Participant' | 'Sponsor' | 'Other' | ''

export interface InterviewSettings {
  maxChars: number
}

export interface Productie {
  id: string
  naam: string
  datum: string
  status: ProductieStatus
  locatie: string
  land: string
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
