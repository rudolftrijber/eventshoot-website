import { getSql } from './database.js'
import { clipText } from './sanitize.js'

export interface DirectoryContact {
  rol: string
  naam: string
  telefoon: string
}

export interface DirectoryClient {
  id: string
  naam: string
  contacten: DirectoryContact[]
}

export interface DirectoryCrew {
  id: string
  naam: string
  rol: string
  telefoon: string
}

const MAX_CONTACTS = 8

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function cleanContacts(value: unknown): DirectoryContact[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, MAX_CONTACTS).map((row) => {
    const contact = row && typeof row === 'object' ? row as Record<string, unknown> : {}
    return {
      rol: clipText(contact.rol, 80),
      naam: clipText(contact.naam, 120),
      telefoon: clipText(contact.telefoon, 40),
    }
  }).filter((row) => row.rol || row.naam || row.telefoon)
}

export async function fetchClients(): Promise<DirectoryClient[]> {
  const sql = await getSql()
  const clients = await sql`
    SELECT id, naam
    FROM interview_clients
    ORDER BY LOWER(naam)
  ` as Array<{ id: string; naam: string }>
  const contacts = await sql`
    SELECT client_id, rol, naam, telefoon
    FROM interview_client_contacts
    ORDER BY sort_order, id
  ` as Array<{ client_id: string; rol: string; naam: string; telefoon: string }>
  return clients.map((client) => ({
    id: String(client.id),
    naam: String(client.naam),
    contacten: contacts
      .filter((row) => row.client_id === client.id)
      .map((row) => ({
        rol: String(row.rol || ''),
        naam: String(row.naam || ''),
        telefoon: String(row.telefoon || ''),
      })),
  }))
}

export async function saveClient(input: {
  id?: string
  naam: string
  contacten: unknown
}): Promise<DirectoryClient> {
  const sql = await getSql()
  const naam = clipText(input.naam, 160)
  if (!naam) throw new Error('Client name is required')
  const id = clipText(input.id, 64) || uid()
  const contacten = cleanContacts(input.contacten)
  const dupes = await sql`
    SELECT id FROM interview_clients
    WHERE LOWER(naam) = LOWER(${naam}) AND id <> ${id}
    LIMIT 1
  `
  if (dupes.length) throw new Error('A client with that name already exists')

  await sql`
    INSERT INTO interview_clients (id, naam)
    VALUES (${id}, ${naam})
    ON CONFLICT (id) DO UPDATE
    SET naam = EXCLUDED.naam, updated_at = NOW()
  `
  await sql`DELETE FROM interview_client_contacts WHERE client_id = ${id}`
  for (let index = 0; index < contacten.length; index += 1) {
    const contact = contacten[index]
    await sql`
      INSERT INTO interview_client_contacts (id, client_id, sort_order, rol, naam, telefoon)
      VALUES (${uid()}, ${id}, ${index}, ${contact.rol}, ${contact.naam}, ${contact.telefoon})
    `
  }
  const saved = (await fetchClients()).find((client) => client.id === id)
  if (!saved) throw new Error('Client could not be saved')
  return saved
}

export async function deleteClient(id: string): Promise<boolean> {
  const sql = await getSql()
  await sql`UPDATE interview_producties SET client_id = NULL, updated_at = NOW() WHERE client_id = ${id}`
  const rows = await sql`DELETE FROM interview_clients WHERE id = ${id} RETURNING id`
  return rows.length > 0
}

export async function fetchCrew(): Promise<DirectoryCrew[]> {
  const sql = await getSql()
  const rows = await sql`
    SELECT id, naam, rol, telefoon
    FROM interview_crew
    ORDER BY sort_order, LOWER(naam)
  ` as Array<{ id: string; naam: string; rol: string; telefoon: string }>
  return rows.map((row) => ({
    id: String(row.id),
    naam: String(row.naam),
    rol: String(row.rol || ''),
    telefoon: String(row.telefoon || ''),
  }))
}

export async function saveCrew(input: {
  id?: string
  naam: string
  rol?: string
  telefoon?: string
}): Promise<DirectoryCrew> {
  const sql = await getSql()
  const naam = clipText(input.naam, 80)
  if (!naam || naam.toUpperCase() === 'N.V.T.') throw new Error('Enter a crew name')
  const id = clipText(input.id, 64) || uid()
  const rol = clipText(input.rol, 80)
  const telefoon = clipText(input.telefoon, 40)
  const dupes = await sql`
    SELECT id FROM interview_crew
    WHERE LOWER(naam) = LOWER(${naam}) AND id <> ${id}
    LIMIT 1
  `
  if (dupes.length) throw new Error('A crew member with that name already exists')
  const sortRows = await sql`SELECT COALESCE(MAX(sort_order), 0)::int AS n FROM interview_crew`
  const nextSort = Number((sortRows[0] as { n?: number } | undefined)?.n || 0) + 1
  await sql`
    INSERT INTO interview_crew (id, naam, rol, telefoon, sort_order)
    VALUES (${id}, ${naam}, ${rol}, ${telefoon}, ${nextSort})
    ON CONFLICT (id) DO UPDATE
    SET naam = EXCLUDED.naam, rol = EXCLUDED.rol, telefoon = EXCLUDED.telefoon, updated_at = NOW()
  `
  const saved = (await fetchCrew()).find((person) => person.id === id)
  if (!saved) throw new Error('Crew member could not be saved')
  return saved
}

export async function deleteCrew(id: string): Promise<boolean> {
  const sql = await getSql()
  const rows = await sql`DELETE FROM interview_crew WHERE id = ${id} RETURNING id`
  return rows.length > 0
}
