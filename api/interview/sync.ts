import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'interview_session'

function getSecret(): string {
  return process.env.INTERVIEW_SESSION_SECRET || ''
}

function getSessionToken(req: VercelRequest): string | null {
  const cookie = req.headers.cookie
  if (!cookie) return null
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

function verifySessionToken(token: string | null): boolean {
  if (!token) return false
  const secret = getSecret()
  if (!secret) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!verifySessionToken(getSessionToken(req))) {
    res.status(401).json({ error: 'Niet ingelogd' })
    return
  }

  try {
    const { neon } = await import('@neondatabase/serverless')
    const url = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING
    if (!url) {
      res.status(500).json({ error: 'POSTGRES_URL ontbreekt' })
      return
    }
    const sql = neon(url)

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
        status TEXT NOT NULL DEFAULT 'Gepland',
        vragen JSONB NOT NULL DEFAULT '[]',
        archived_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
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
        status TEXT NOT NULL DEFAULT 'Ingevoerd',
        regienummer TEXT,
        datum DATE,
        tijd TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `

    const settingsRows = await sql`SELECT max_chars FROM interview_settings WHERE id = 1`
    const guests = await sql`SELECT * FROM interview_gasten ORDER BY created_at DESC`
    const productions = await sql`SELECT * FROM interview_producties ORDER BY updated_at DESC`

    res.status(200).json({
      guests: guests.map((row: Record<string, unknown>) => ({
        id: String(row.id),
        productieNaam: String(row.productie_naam || ''),
        type: String(row.type || ''),
        naam: String(row.naam),
        functie: String(row.functie || ''),
        planning: String(row.planning || ''),
        gedeeld: Boolean(row.gedeeld),
        questions: Array.isArray(row.questions) ? row.questions.map(String) : [],
        status: String(row.status),
        regienummer: row.regienummer ? String(row.regienummer) : '',
        datum: row.datum ? String(row.datum).slice(0, 10) : '',
        tijd: row.tijd ? String(row.tijd) : '',
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
      })),
      productions: productions.map((row: Record<string, unknown>) => ({
        id: String(row.id),
        naam: String(row.naam),
        datum: row.datum ? String(row.datum).slice(0, 10) : '',
        status: String(row.status),
        vragen: Array.isArray(row.vragen) ? row.vragen.map(String) : [],
        archivedAt: row.archived_at ? String(row.archived_at) : null,
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
      })),
      settings: { maxChars: (settingsRows[0] as { max_chars: number } | undefined)?.max_chars ?? 40 },
      serverTime: new Date().toISOString(),
    })
  } catch (err) {
    console.error('interview sync error:', err)
    res.status(500).json({ error: 'Sync mislukt' })
  }
}
