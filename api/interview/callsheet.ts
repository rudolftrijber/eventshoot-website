import type {
  CallsheetContact,
  CallsheetCrewDetail,
  CallsheetData,
  CallsheetGearRow,
  CallsheetProgramRow,
} from './types.js'
import { clipText } from './sanitize.js'

export const DEFAULT_CREW_KLEDING =
  'Blauwe Eventshoot.nl jas, polo, een nette blauwe spijkerbroek en witte gympen.'

const GEAR_CATEGORIES = [
  'Fotografie apparatuur',
  'Video / Aftermovie apparatuur',
  'Vodcast / Livestream apparatuur',
  'Overig',
]

function emptyContact(): CallsheetContact {
  return { rol: '', naam: '', telefoon: '' }
}

function defaultGear(): CallsheetGearRow[] {
  return GEAR_CATEGORIES.map((categorie) => ({
    categorie,
    omschrijving: '',
    aantal: '',
    ok: false,
  }))
}

function defaultCrewDetails(): CallsheetCrewDetail[] {
  return [0, 1, 2, 3, 4].map((index) => ({
    rol: index === 0 ? 'Supervisor' : '',
    telefoon: '',
    callTijd: '',
  }))
}

export function emptyCallsheet(): CallsheetData {
  return {
    opdrachtgever: '',
    parkeren: '',
    locatieAdres: '',
    locatiePlaats: '',
    programmaUrl: '',
    crewKleding: DEFAULT_CREW_KLEDING,
    contacten: [emptyContact(), emptyContact(), emptyContact()],
    crewDetails: defaultCrewDetails(),
    programma: [],
    apparatuur: defaultGear(),
  }
}

function sanitizeUrl(value: unknown): string {
  const raw = clipText(value, 500)
  if (!raw) return ''
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const url = new URL(withScheme)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
    return url.toString()
  } catch {
    return ''
  }
}

function sanitizeContacts(value: unknown): CallsheetContact[] {
  if (!Array.isArray(value)) return [emptyContact(), emptyContact(), emptyContact()]
  const rows = value.slice(0, 8).map((row) => {
    const rec = row && typeof row === 'object' ? row as Record<string, unknown> : {}
    return {
      rol: clipText(rec.rol, 80),
      naam: clipText(rec.naam, 120),
      telefoon: clipText(rec.telefoon, 40),
    }
  })
  return rows.length ? rows : [emptyContact()]
}

function sanitizeCrewDetails(value: unknown): CallsheetCrewDetail[] {
  if (!Array.isArray(value)) return defaultCrewDetails()
  return Array.from({ length: 5 }, (_, index) => {
    const row = value[index]
    const rec = row && typeof row === 'object' ? row as Record<string, unknown> : {}
    return {
      rol: clipText(rec.rol, 80),
      telefoon: clipText(rec.telefoon, 40),
      callTijd: clipText(rec.callTijd, 20),
    }
  })
}

function sanitizeProgram(value: unknown): CallsheetProgramRow[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 40).map((row) => {
    const rec = row && typeof row === 'object' ? row as Record<string, unknown> : {}
    return {
      tijd: clipText(rec.tijd, 20),
      onderdeel: clipText(rec.onderdeel, 200),
      locatie: clipText(rec.locatie, 120),
      crew: clipText(rec.crew, 80),
      highlight: Boolean(rec.highlight),
    }
  })
}

function sanitizeGear(value: unknown): CallsheetGearRow[] {
  if (!Array.isArray(value) || !value.length) return defaultGear()
  return value.slice(0, 24).map((row) => {
    const rec = row && typeof row === 'object' ? row as Record<string, unknown> : {}
    return {
      categorie: clipText(rec.categorie, 80) || 'Overig',
      omschrijving: clipText(rec.omschrijving, 160),
      aantal: clipText(rec.aantal, 20),
      ok: Boolean(rec.ok),
    }
  })
}

export function sanitizeCallsheet(value: unknown): CallsheetData {
  const raw = typeof value === 'string'
    ? safeParse(value)
    : (value && typeof value === 'object' ? value as Record<string, unknown> : {})
  const base = emptyCallsheet()
  return {
    opdrachtgever: clipText(raw.opdrachtgever, 200),
    parkeren: clipText(raw.parkeren, 200),
    locatieAdres: clipText(raw.locatieAdres, 200),
    locatiePlaats: clipText(raw.locatiePlaats, 120),
    programmaUrl: sanitizeUrl(raw.programmaUrl),
    crewKleding: clipText(raw.crewKleding, 400) || base.crewKleding,
    contacten: sanitizeContacts(raw.contacten),
    crewDetails: sanitizeCrewDetails(raw.crewDetails),
    programma: sanitizeProgram(raw.programma),
    apparatuur: sanitizeGear(raw.apparatuur),
  }
}

function safeParse(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value) as unknown
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {}
  } catch {
    return {}
  }
}
