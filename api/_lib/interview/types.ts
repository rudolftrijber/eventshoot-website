export type GastStatus = 'Ingevoerd' | 'Gecontroleerd' | 'Opgenomen'
export type ProductieStatus = 'Gepland' | 'Gaande' | 'Afgerond'
export type GastType = 'Keynote spreker' | 'Executive' | 'Deelnemer' | 'Overig' | ''

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
  type: GastType | string
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

export interface SyncPayload {
  guests: Gast[]
  productions: Productie[]
  settings: InterviewSettings
  serverTime: string
}
