export type GastStatus = 'Ingevoerd' | 'Gecontroleerd' | 'Opgenomen'
export type ProductieStatus = 'Gepland' | 'Gaande' | 'Afgerond'

export interface InterviewSettings {
  maxChars: number
}

export interface Productie {
  id: string
  naam: string
  datum: string
  status: ProductieStatus
  vragen: string[]
  archivedAt: string | null
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
  status: GastStatus
  regienummer: string
  datum: string
  tijd: string
  createdAt: string
  updatedAt: string
}

export type TabId =
  | 'nieuw'
  | 'overzicht'
  | 'producties'
  | 'controle'
  | 'camera'
  | 'interviewer'
  | 'dashboard'
  | 'archief'

export const GAST_TYPES = ['Keynote spreker', 'Executive', 'Deelnemer', 'Overig'] as const
export const GAST_STATUS_ORDER: GastStatus[] = ['Ingevoerd', 'Gecontroleerd', 'Opgenomen']
export const PRODUCTIE_STATUSES: ProductieStatus[] = ['Gepland', 'Gaande', 'Afgerond']

export const CSV_HEADERS = [
  'productienaam', 'type', 'naam', 'functie', 'planning', 'gedeeld',
  'vraag1', 'vraag2', 'vraag3', 'vraag4', 'vraag5', 'vraag6', 'vraag7',
  'status', 'regienummer', 'datum', 'tijd',
] as const

/** Kolommen voor opdrachtgevers — zonder crew-velden (status, regienummer, datum, tijd) */
export const CLIENT_CSV_HEADERS = [
  'productienaam', 'type', 'naam', 'functie', 'planning', 'gedeeld',
  'vraag1', 'vraag2', 'vraag3', 'vraag4', 'vraag5', 'vraag6', 'vraag7',
] as const
