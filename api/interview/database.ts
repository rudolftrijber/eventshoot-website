import type { Gast, GastStatus, InterviewSettings, Productie, ProductieStatus } from './types.js'
import {
  DEFAULT_CREW_SLOT,
  DEFAULT_SUPERVISOR,
  normalizeCrewMember,
  normalizeGastStatus,
  normalizeProductieStatus,
} from './types.js'
import { hashClientPassword, verifyClientPassword, clientPasswordNeedsRehash, encryptClientPassword, decryptClientPassword } from './auth.js'

let schemaReady: Promise<void> | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sqlClient: any = null

export async function getSql() {
  if (!sqlClient) {
    const { neon } = await import('@neondatabase/serverless')
    const url = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING
    if (!url) throw new Error('POSTGRES_URL ontbreekt in environment variables')
    sqlClient = neon(url)
  }
  return sqlClient
}

export async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = initSchema()
  }
  await schemaReady
}

async function initSchema(): Promise<void> {
  const sql = await getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS interview_settings (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      max_chars INTEGER NOT NULL DEFAULT 40,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    INSERT INTO interview_settings (id, max_chars)
    VALUES (1, 40)
    ON CONFLICT (id) DO NOTHING
  `
  await sql`
    CREATE TABLE IF NOT EXISTS interview_producties (
      id TEXT PRIMARY KEY,
      naam TEXT NOT NULL,
      datum DATE,
      status TEXT NOT NULL DEFAULT 'OPT',
      vragen JSONB NOT NULL DEFAULT '[]',
      archived_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS interview_producties_naam_active_idx
    ON interview_producties (LOWER(naam))
    WHERE archived_at IS NULL
  `
  await sql`
    CREATE TABLE IF NOT EXISTS interview_gasten (
      id TEXT PRIMARY KEY,
      productie_naam TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT '',
      naam TEXT NOT NULL,
      functie TEXT NOT NULL DEFAULT '',
      planning TEXT NOT NULL DEFAULT '',
      gedeeld BOOLEAN NOT NULL DEFAULT FALSE,
      questions JSONB NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'Entered',
      regienummer TEXT,
      datum DATE,
      tijd TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS interview_gasten_status_idx ON interview_gasten (status)`
  await sql`CREATE INDEX IF NOT EXISTS interview_gasten_datum_idx ON interview_gasten (datum)`
  await sql`CREATE INDEX IF NOT EXISTS interview_gasten_productie_idx ON interview_gasten (productie_naam)`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS client_password_hash TEXT`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS client_password_enc TEXT`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS locatie TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS land TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS start_tijd TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS eind_datum DATE`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS eind_tijd TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS supervisor TEXT NOT NULL DEFAULT 'Rolf Trijber'`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS crew2 TEXT NOT NULL DEFAULT 'N.V.T.'`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS crew3 TEXT NOT NULL DEFAULT 'N.V.T.'`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS crew4 TEXT NOT NULL DEFAULT 'N.V.T.'`
  await sql`ALTER TABLE interview_producties ADD COLUMN IF NOT EXISTS crew5 TEXT NOT NULL DEFAULT 'N.V.T.'`
  await sql`ALTER TABLE interview_gasten ADD COLUMN IF NOT EXISTS intake_complete BOOLEAN NOT NULL DEFAULT FALSE`
  await sql`ALTER TABLE interview_gasten ADD COLUMN IF NOT EXISTS organisatie TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE interview_gasten ADD COLUMN IF NOT EXISTS intro_tekst TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE interview_gasten ADD COLUMN IF NOT EXISTS outro_tekst TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE interview_gasten ADD COLUMN IF NOT EXISTS serie_naam TEXT NOT NULL DEFAULT ''`
  await sql`
    CREATE TABLE IF NOT EXISTS interview_rate_limits (
      bucket_key TEXT PRIMARY KEY,
      hits INTEGER NOT NULL DEFAULT 0,
      window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

function formatDateValue(value: unknown): string {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const s = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const parsed = new Date(s)
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  return ''
}

function toDateParam(datum: string): string | null {
  const formatted = formatDateValue(datum)
  return formatted || null
}

function formatTimeValue(value: unknown): string {
  if (!value) return ''
  const s = String(value).trim()
  const m = s.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return ''
  return `${m[1].padStart(2, '0')}:${m[2]}`
}

function rowToProductie(row: Record<string, unknown>): Productie {
  const hash = row.client_password_hash ? String(row.client_password_hash) : ''
  const stored = decryptClientPassword(row.client_password_enc ? String(row.client_password_enc) : '')
  return {
    id: String(row.id),
    naam: String(row.naam),
    datum: formatDateValue(row.datum),
    startTijd: formatTimeValue(row.start_tijd),
    eindDatum: formatDateValue(row.eind_datum),
    eindTijd: formatTimeValue(row.eind_tijd),
    status: normalizeProductieStatus(String(row.status)),
    locatie: String(row.locatie || ''),
    land: String(row.land || ''),
    supervisor: normalizeCrewMember(String(row.supervisor || ''), DEFAULT_SUPERVISOR),
    crew2: normalizeCrewMember(String(row.crew2 || ''), DEFAULT_CREW_SLOT),
    crew3: normalizeCrewMember(String(row.crew3 || ''), DEFAULT_CREW_SLOT),
    crew4: normalizeCrewMember(String(row.crew4 || ''), DEFAULT_CREW_SLOT),
    crew5: normalizeCrewMember(String(row.crew5 || ''), DEFAULT_CREW_SLOT),
    vragen: Array.isArray(row.vragen) ? row.vragen.map(String) : [],
    archivedAt: row.archived_at ? String(row.archived_at) : null,
    hasClientPassword: Boolean(hash),
    clientPasswordStored: stored || undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function rowToGast(row: Record<string, unknown>): Gast {
  return {
    id: String(row.id),
    productieNaam: String(row.productie_naam || ''),
    type: String(row.type || ''),
    naam: String(row.naam),
    functie: String(row.functie || ''),
    organisatie: String(row.organisatie || ''),
    planning: String(row.planning || ''),
    gedeeld: Boolean(row.gedeeld),
    introTekst: String(row.intro_tekst || ''),
    outroTekst: String(row.outro_tekst || ''),
    serieNaam: String(row.serie_naam || ''),
    questions: Array.isArray(row.questions) ? row.questions.map(String) : [],
    intakeComplete: Boolean(row.intake_complete),
    status: normalizeGastStatus(String(row.status)),
    regienummer: row.regienummer ? String(row.regienummer) : '',
    datum: formatDateValue(row.datum),
    tijd: row.tijd ? String(row.tijd) : '',
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export async function fetchSettings(): Promise<InterviewSettings> {
  const sql = await getSql()
  const rows = await sql`SELECT max_chars FROM interview_settings WHERE id = 1`
  const row = rows[0] as { max_chars: number } | undefined
  return { maxChars: row?.max_chars ?? 40 }
}

export async function updateSettings(maxChars: number): Promise<InterviewSettings> {
  const sql = await getSql()
  await sql`
    UPDATE interview_settings
    SET max_chars = ${maxChars}, updated_at = NOW()
    WHERE id = 1
  `
  return { maxChars }
}

export async function fetchProductiesByClientPassword(password: string): Promise<Productie[]> {
  const sql = await getSql()
  const rows = await sql`
    SELECT * FROM interview_producties
    WHERE archived_at IS NULL AND client_password_hash IS NOT NULL
  `
  const matched: Array<{ productie: Productie; hash: string; id: string }> = []
  for (const row of rows) {
    const record = row as Record<string, unknown>
    const hash = record.client_password_hash ? String(record.client_password_hash) : ''
    if (!hash || !verifyClientPassword(password, hash)) continue
    matched.push({
      productie: rowToProductie(record),
      hash,
      id: String(record.id),
    })
  }

  // Upgrade legacy HMAC hashes to scrypt after a successful login.
  const nextHash = matched.some((m) => clientPasswordNeedsRehash(m.hash))
    ? hashClientPassword(password)
    : null
  if (nextHash) {
    for (const item of matched) {
      if (!clientPasswordNeedsRehash(item.hash)) continue
      await sql`
        UPDATE interview_producties
        SET client_password_hash = ${nextHash}, updated_at = NOW()
        WHERE id = ${item.id}
      `
    }
  }

  return matched.map((m) => m.productie)
}

export async function fetchProducties(includeArchived = false): Promise<Productie[]> {
  const sql = await getSql()
  const rows = includeArchived
    ? await sql`SELECT * FROM interview_producties ORDER BY updated_at DESC`
    : await sql`SELECT * FROM interview_producties WHERE archived_at IS NULL ORDER BY updated_at DESC`
  return rows.map((row) => rowToProductie(row as Record<string, unknown>))
}

export async function fetchGuests(): Promise<Gast[]> {
  const sql = await getSql()
  const rows = await sql`SELECT * FROM interview_gasten ORDER BY created_at DESC`
  return rows.map((row) => rowToGast(row as Record<string, unknown>))
}

export async function createGuest(data: Omit<Gast, 'createdAt' | 'updatedAt'>): Promise<Gast> {
  const sql = await getSql()
  const rows = await sql`
    INSERT INTO interview_gasten (
      id, productie_naam, type, naam, functie, organisatie, planning, gedeeld,
      intro_tekst, outro_tekst, serie_naam,
      questions, intake_complete, status, regienummer, datum, tijd
    ) VALUES (
      ${data.id}, ${data.productieNaam}, ${data.type}, ${data.naam}, ${data.functie},
      ${data.organisatie || ''},
      ${data.planning}, ${data.gedeeld},
      ${data.introTekst || ''}, ${data.outroTekst || ''}, ${data.serieNaam || ''},
      ${JSON.stringify(data.questions)}::jsonb,
      ${Boolean(data.intakeComplete)}, ${data.status}, ${data.regienummer || null},
      ${toDateParam(data.datum)}, ${data.tijd || null}
    )
    RETURNING *
  `
  return rowToGast(rows[0] as Record<string, unknown>)
}

export async function updateGuest(id: string, patch: Partial<Gast>): Promise<Gast | null> {
  const sql = await getSql()
  const existing = await sql`SELECT * FROM interview_gasten WHERE id = ${id}`
  if (!existing.length) return null
  const current = rowToGast(existing[0] as Record<string, unknown>)
  const next = { ...current, ...patch, id }

  const rows = await sql`
    UPDATE interview_gasten SET
      productie_naam = ${next.productieNaam},
      type = ${next.type},
      naam = ${next.naam},
      functie = ${next.functie},
      organisatie = ${next.organisatie || ''},
      planning = ${next.planning},
      gedeeld = ${next.gedeeld},
      intro_tekst = ${next.introTekst || ''},
      outro_tekst = ${next.outroTekst || ''},
      serie_naam = ${next.serieNaam || ''},
      questions = ${JSON.stringify(next.questions)}::jsonb,
      intake_complete = ${Boolean(next.intakeComplete)},
      status = ${next.status},
      regienummer = ${next.regienummer || null},
      datum = ${toDateParam(next.datum)},
      tijd = ${next.tijd || null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rowToGast(rows[0] as Record<string, unknown>)
}

export async function deleteGuest(id: string): Promise<boolean> {
  const sql = await getSql()
  const rows = await sql`DELETE FROM interview_gasten WHERE id = ${id} RETURNING id`
  return rows.length > 0
}

export async function createProductie(
  data: Omit<Productie, 'createdAt' | 'updatedAt' | 'archivedAt' | 'hasClientPassword'>,
  clientPassword?: string,
): Promise<Productie> {
  const sql = await getSql()
  const hash = clientPassword?.trim() ? hashClientPassword(clientPassword.trim()) : null
  const enc = clientPassword?.trim() ? encryptClientPassword(clientPassword.trim()) : null
  const rows = await sql`
    INSERT INTO interview_producties (
      id, naam, datum, start_tijd, eind_datum, eind_tijd, status,
      locatie, land, supervisor, crew2, crew3, crew4, crew5,
      vragen, client_password_hash, client_password_enc
    )
    VALUES (
      ${data.id}, ${data.naam}, ${toDateParam(data.datum)}, ${formatTimeValue(data.startTijd)},
      ${toDateParam(data.eindDatum)}, ${formatTimeValue(data.eindTijd)}, ${data.status},
      ${data.locatie || ''}, ${data.land || ''},
      ${normalizeCrewMember(data.supervisor, DEFAULT_SUPERVISOR)},
      ${normalizeCrewMember(data.crew2)}, ${normalizeCrewMember(data.crew3)},
      ${normalizeCrewMember(data.crew4)}, ${normalizeCrewMember(data.crew5)},
      ${JSON.stringify(data.vragen)}::jsonb, ${hash}, ${enc}
    )
    RETURNING *
  `
  return rowToProductie(rows[0] as Record<string, unknown>)
}

export async function updateProductie(id: string, patch: Partial<Productie>): Promise<Productie | null> {
  const sql = await getSql()
  const existing = await sql`SELECT * FROM interview_producties WHERE id = ${id}`
  if (!existing.length) return null
  const current = rowToProductie(existing[0] as Record<string, unknown>)
  const next = { ...current, ...patch, id }

  let clientPasswordHash: string | null | undefined
  let clientPasswordEnc: string | null | undefined
  if ('clientPassword' in patch) {
    const raw = String((patch as { clientPassword?: string }).clientPassword ?? '').trim()
    clientPasswordHash = raw ? hashClientPassword(raw) : null
    clientPasswordEnc = raw ? encryptClientPassword(raw) : null
  }
  const currentHash = (existing[0] as { client_password_hash?: string | null }).client_password_hash || null
  const currentEnc = (existing[0] as { client_password_enc?: string | null }).client_password_enc || null
  const nextHash = clientPasswordHash !== undefined ? clientPasswordHash : currentHash
  const nextEnc = clientPasswordEnc !== undefined ? clientPasswordEnc : currentEnc

  const rows = await sql`
    UPDATE interview_producties SET
      naam = ${next.naam},
      datum = ${toDateParam(next.datum)},
      start_tijd = ${formatTimeValue(next.startTijd)},
      eind_datum = ${toDateParam(next.eindDatum)},
      eind_tijd = ${formatTimeValue(next.eindTijd)},
      status = ${next.status},
      locatie = ${next.locatie || ''},
      land = ${next.land || ''},
      supervisor = ${normalizeCrewMember(next.supervisor, DEFAULT_SUPERVISOR)},
      crew2 = ${normalizeCrewMember(next.crew2)},
      crew3 = ${normalizeCrewMember(next.crew3)},
      crew4 = ${normalizeCrewMember(next.crew4)},
      crew5 = ${normalizeCrewMember(next.crew5)},
      vragen = ${JSON.stringify(next.vragen)}::jsonb,
      archived_at = ${next.archivedAt},
      client_password_hash = ${nextHash},
      client_password_enc = ${nextEnc},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rowToProductie(rows[0] as Record<string, unknown>)
}

export async function deleteProductie(id: string): Promise<boolean> {
  const sql = await getSql()
  const rows = await sql`DELETE FROM interview_producties WHERE id = ${id} RETURNING id`
  return rows.length > 0
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function nowTimeStr(): string {
  return new Date().toTimeString().slice(0, 5)
}

export async function nextRegienummer(datum: string): Promise<string> {
  const sql = await getSql()
  const rows = await sql`
    SELECT regienummer FROM interview_gasten
    WHERE datum = ${datum}::date AND regienummer IS NOT NULL
  `
  const nums = rows
    .map((r) => parseInt(String((r as { regienummer: string }).regienummer), 10))
    .filter((n) => !Number.isNaN(n))
  return nums.length ? String(Math.max(...nums) + 1) : '1'
}

export async function finalizeGuest(guest: Gast): Promise<Gast> {
  const datum = guest.datum || todayStr()
  const tijd = guest.tijd || nowTimeStr()
  const regienummer = guest.regienummer || await nextRegienummer(datum)
  const updated = await updateGuest(guest.id, {
    ...guest,
    datum,
    tijd,
    regienummer,
    status: 'Checked',
  })
  return updated || guest
}
