import type {
  CallsheetContact,
  CallsheetCrewDetail,
  CallsheetData,
  CallsheetGearRow,
  CallsheetProgramRow,
} from '@/types/interview'
import { DEFAULT_CREW_SLOT } from '@/types/interview'

export const DEFAULT_CREW_KLEDING =
  'Blue Eventshoot.nl jacket, polo, neat blue jeans and white trainers.'

const LEGACY_CREW_KLEDING =
  'Blauwe Eventshoot.nl jas, polo, een nette blauwe spijkerbroek en witte gympen.'

export const ROLF_PHONE = '06 251 777 28'

/** Known numbers. Other crew phones are filled on the callsheet of the production. */
export const CREW_DIRECTORY: Record<string, { telefoon: string; rol: string }> = {
  'Rolf Trijber': { telefoon: ROLF_PHONE, rol: 'Supervisor' },
  'Maurice Antenbrink': { telefoon: '', rol: '' },
  'Ron Gessel': { telefoon: '', rol: '' },
  'Jeroen Lutmers': { telefoon: '', rol: '' },
  'Niels Visser': { telefoon: '', rol: '' },
  'Vanessa Cristina': { telefoon: '', rol: '' },
}

export const GEAR_CATEGORIES = [
  'Fotografie apparatuur',
  'Video / Aftermovie apparatuur',
  'Vodcast / Livestream apparatuur',
  'Overig',
] as const

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function emptyContact(): CallsheetContact {
  return { rol: '', naam: '', telefoon: '' }
}

export function emptyProgramRow(): CallsheetProgramRow {
  return { tijd: '', onderdeel: '', locatie: '', crew: '', highlight: false }
}

export function emptyGearRow(categorie = 'Extra categorie'): CallsheetGearRow {
  return { categorie, omschrijving: '', aantal: '', ok: false }
}

export function defaultGear(): CallsheetGearRow[] {
  return GEAR_CATEGORIES.map((categorie) => emptyGearRow(categorie))
}

export function defaultCrewDetails(): CallsheetCrewDetail[] {
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
    locatieContact: '',
    locatieTelefoon: '',
    programmaUrl: '',
    crewKleding: DEFAULT_CREW_KLEDING,
    contacten: [emptyContact(), emptyContact(), emptyContact()],
    crewDetails: defaultCrewDetails(),
    programma: [],
    apparatuur: defaultGear(),
  }
}

function text(value: unknown): string {
  return String(value ?? '').trim()
}

export function normalizeCallsheet(value: Partial<CallsheetData> | null | undefined): CallsheetData {
  const base = emptyCallsheet()
  if (!value || typeof value !== 'object') return base

  const contacten = Array.isArray(value.contacten)
    ? value.contacten.slice(0, 8).map((row) => ({
      rol: text(row?.rol),
      naam: text(row?.naam),
      telefoon: text(row?.telefoon),
    }))
    : base.contacten

  const incomingCrew = Array.isArray(value.crewDetails) ? value.crewDetails : null
  const crewDetails = (incomingCrew || base.crewDetails).slice(0, 5).map((row, index) => ({
    rol: text(row?.rol) || (incomingCrew ? '' : base.crewDetails[index]?.rol || ''),
    telefoon: text(row?.telefoon) || (incomingCrew ? '' : base.crewDetails[index]?.telefoon || ''),
    callTijd: text(row?.callTijd),
  }))
  while (crewDetails.length < 5) {
    crewDetails.push({ rol: '', telefoon: '', callTijd: '' })
  }

  const programma = Array.isArray(value.programma)
    ? value.programma.slice(0, 40).map((row) => ({
      tijd: text(row?.tijd),
      onderdeel: text(row?.onderdeel),
      locatie: text(row?.locatie),
      crew: text(row?.crew),
      highlight: Boolean(row?.highlight),
    }))
    : []

  const apparatuur = Array.isArray(value.apparatuur) && value.apparatuur.length
    ? value.apparatuur.slice(0, 24).map((row) => ({
      categorie: text(row?.categorie) || 'Overig',
      omschrijving: text(row?.omschrijving),
      aantal: text(row?.aantal),
      ok: Boolean(row?.ok),
    }))
    : base.apparatuur

  return {
    opdrachtgever: text(value.opdrachtgever),
    parkeren: text(value.parkeren),
    locatieAdres: text(value.locatieAdres),
    locatiePlaats: text(value.locatiePlaats),
    locatieContact: text(value.locatieContact),
    locatieTelefoon: text(value.locatieTelefoon),
    programmaUrl: text(value.programmaUrl),
    crewKleding: crewClothing(text(value.crewKleding)),
    contacten: contacten.length ? contacten : [emptyContact()],
    crewDetails,
    programma,
    apparatuur,
  }
}

export function crewDirectoryPhone(name: string): string {
  return CREW_DIRECTORY[name]?.telefoon || ''
}

export function defaultRoleFor(name: string, slotIndex: number): string {
  if (!name || name === DEFAULT_CREW_SLOT) return ''
  if (slotIndex === 0) return 'Supervisor'
  return CREW_DIRECTORY[name]?.rol || ''
}

export function hydrateCrewDetails(
  sheet: CallsheetData,
  names: string[],
): CallsheetData {
  return {
    ...sheet,
    crewDetails: sheet.crewDetails.map((detail, index) => {
      const name = names[index] || ''
      if (!name || name === DEFAULT_CREW_SLOT) {
        return { rol: '', telefoon: '', callTijd: '' }
      }
      return {
        rol: detail.rol.trim() || defaultRoleFor(name, index),
        telefoon: detail.telefoon.trim() || crewDirectoryPhone(name),
        callTijd: detail.callTijd,
      }
    }),
  }
}

function callsheetDateParts(iso: string): { day: number; month: number; year: number; weekday: number } | null {
  const match = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return null
  return { day, month, year, weekday: date.getDay() }
}

export function englishLongDate(iso: string): string {
  const parts = callsheetDateParts(iso)
  if (!parts) return ''
  return `${WEEKDAYS[parts.weekday]} ${parts.day} ${MONTHS[parts.month - 1]} ${parts.year}`
}

export function englishShortDate(iso: string): string {
  const parts = callsheetDateParts(iso)
  if (!parts) return ''
  return `${WEEKDAYS_SHORT[parts.weekday]} ${parts.day} ${MONTHS_SHORT[parts.month - 1]} ${parts.year}`
}

export function formatCallsheetTime(time: string): string {
  return time.trim().replace(/\s*uur\s*$/i, '').trim()
}

function crewClothing(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed === LEGACY_CREW_KLEDING) return DEFAULT_CREW_KLEDING
  return trimmed
}
