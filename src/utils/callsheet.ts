import type {
  CallsheetContact,
  CallsheetCrewDetail,
  CallsheetData,
  CallsheetGearRow,
  CallsheetProgramRow,
} from '@/types/interview'
import { DEFAULT_CREW_SLOT } from '@/types/interview'

export const DEFAULT_CREW_KLEDING =
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

const WEEKDAYS = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']
const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']

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
    programmaUrl: text(value.programmaUrl),
    crewKleding: text(value.crewKleding) || DEFAULT_CREW_KLEDING,
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

export function dutchLongDate(iso: string): string {
  const match = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return ''
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return ''
  const label = `${WEEKDAYS[date.getDay()]} ${day} ${MONTHS[month - 1]} ${year}`
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatUur(time: string): string {
  const value = time.trim()
  if (!value) return ''
  return /uur/i.test(value) ? value : `${value} uur`
}
