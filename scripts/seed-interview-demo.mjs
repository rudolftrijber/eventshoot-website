/**
 * Demo-data voor Interview App: producties + gasten.
 * Gebruik: npm run seed:interview
 * Vereist: POSTGRES_URL in .env.local (vercel env pull .env.local)
 */

import { existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { neon } from '@neondatabase/serverless'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

function loadEnvFile(name) {
  const path = join(ROOT, name)
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const url =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_DATABASE_URL ||
  process.env.DATABASE_URL
if (!url) {
  console.error('❌  Geen database-URL gevonden in .env.local.')
  console.error('    Run: vercel env pull .env.local')
  console.error('    Vereist: POSTGRES_URL (of POSTGRES_PRISMA_URL)')
  process.exit(1)
}

const sql = neon(url)
const SEED_TAG = 'demo-seed-v1'

const producties = [
  {
    id: 'prod-dsr-2026',
    naam: 'DSR Jaarcongres 2026',
    datum: '2026-03-18',
    status: 'Gepland',
    vragen: [
      'Wat was voor u het hoogtepunt van dit congres?',
      'Welke trend ziet u de komende jaren in de sector?',
      'Wat neemt u mee naar uw organisatie?',
      'Waarom is netwerken op een congres zo waardevol?',
    ],
  },
  {
    id: 'prod-ledendag-2026',
    naam: 'Ledendag Branchevereniging 2026',
    datum: '2026-07-12',
    status: 'Gaande',
    vragen: [
      'Wat haalt u uit deze ledendag?',
      'Welke sessie sprak u het meest aan?',
      'Hoe helpt dit event uw dagelijkse werk?',
      'Wat zou u volgend jaar anders willen zien?',
    ],
  },
  {
    id: 'prod-techcorp-2026',
    naam: 'TechCorp User Conference',
    datum: '2026-05-22',
    status: 'Gepland',
    vragen: [
      'Wat maakt dit user conference uniek voor klanten?',
      'Welke productupdate vindt u het meest relevant?',
      'Hoe gebruikt u onze oplossing in de praktijk?',
      'Wat verwacht u van het komende jaar?',
    ],
  },
]

const gasten = [
  {
    id: 'gast-anna-berg',
    productie_naam: 'DSR Jaarcongres 2026',
    type: 'Keynote spreker',
    naam: 'Dr. Anna van Berg',
    functie: 'CEO TechCorp',
    planning: '09:30 keynote, daarna interview',
    gedeeld: true,
    questions: [
      'Wat was voor u het hoogtepunt van dit congres?',
      'Welke trend ziet u de komende jaren in de sector?',
      'Wat neemt u mee naar uw organisatie?',
      'Waarom is netwerken op een congres zo waardevol?',
    ],
    status: 'Ingevoerd',
    regienummer: null,
    datum: null,
    tijd: null,
  },
  {
    id: 'gast-jan-meijer',
    productie_naam: 'DSR Jaarcongres 2026',
    type: 'Keynote spreker',
    naam: 'Prof. Jan Meijer',
    functie: 'Hoogleraar Innovatie, TU Delft',
    planning: '14:00 breakout + interview',
    gedeeld: false,
    questions: [
      'Wat verraste u vandaag het meest?',
      'Hoe vertaalt innovatie zich naar de praktijk?',
      'Welk advies geeft u aan jonge professionals?',
      'Wat is uw belangrijkste takeaway?',
    ],
    status: 'Ingevoerd',
    regienummer: null,
    datum: null,
    tijd: null,
  },
  {
    id: 'gast-sophie-jansen',
    productie_naam: 'Ledendag Branchevereniging 2026',
    type: 'Deelnemer',
    naam: 'Sophie Jansen',
    functie: 'Marketingmanager',
    planning: '11:15 interviewplek lobby',
    gedeeld: true,
    questions: [
      'Wat haalt u uit deze ledendag?',
      'Welke sessie sprak u het meest aan?',
      'Hoe helpt dit event uw dagelijkse werk?',
      'Wat zou u volgend jaar anders willen zien?',
    ],
    status: 'Gecontroleerd',
    regienummer: '1',
    datum: '2026-07-12',
    tijd: '11:15',
  },
  {
    id: 'gast-mark-devries',
    productie_naam: 'Ledendag Branchevereniging 2026',
    type: 'Executive',
    naam: 'Mark de Vries',
    functie: 'Directeur Communicatie',
    planning: '12:00 boardroom',
    gedeeld: true,
    questions: [
      'Waarom is deze ledendag belangrijk voor uw leden?',
      'Welke boodschap neemt u mee naar de raad van bestuur?',
      'Hoe ziet u de rol van events in uw strategie?',
      'Wat maakt deze editie geslaagd?',
    ],
    status: 'Gecontroleerd',
    regienummer: '2',
    datum: '2026-07-12',
    tijd: '12:00',
  },
  {
    id: 'gast-lars-bakker',
    productie_naam: 'TechCorp User Conference',
    type: 'Overig',
    naam: 'Lars Bakker',
    functie: 'Moderator & host',
    planning: '16:30 afsluiting',
    gedeeld: false,
    questions: [
      'Hoe kijkt u terug op deze editie?',
      'Welk moment vond u het meest energiek?',
      'Wat maakt dit user conference uniek voor klanten?',
      'Wat verwacht u van het komende jaar?',
    ],
    status: 'Ingevoerd',
    regienummer: null,
    datum: null,
    tijd: null,
  },
  {
    id: 'gast-eva-smit',
    productie_naam: 'TechCorp User Conference',
    type: 'Deelnemer',
    naam: 'Eva Smit',
    functie: 'Product owner SaaS',
    planning: '15:00 stand B12',
    gedeeld: true,
    questions: [
      'Welke productupdate vindt u het meest relevant?',
      'Hoe gebruikt u onze oplossing in de praktijk?',
      'Wat mist u nog in het platform?',
      'Zou u dit event aanbevelen aan collega\'s?',
    ],
    status: 'Opgenomen',
    regienummer: '3',
    datum: '2026-07-11',
    tijd: '15:42',
  },
]

async function ensureSchema() {
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
}

async function alreadySeeded() {
  const rows = await sql`
    SELECT id FROM interview_producties WHERE id = ${producties[0].id} LIMIT 1
  `
  return rows.length > 0
}

async function run() {
  console.log('\n🎬 Interview App demo-data laden…\n')
  await ensureSchema()

  if (await alreadySeeded()) {
    console.log('ℹ️  Demo-data staat er al (DSR Jaarcongres 2026).')
    console.log('   Verwijder handmatig via de app of pas IDs aan in seed-interview-demo.mjs.\n')
    return
  }

  for (const p of producties) {
    await sql`
      INSERT INTO interview_producties (id, naam, datum, status, vragen)
      VALUES (
        ${p.id}, ${p.naam}, ${p.datum}, ${p.status}, ${JSON.stringify(p.vragen)}::jsonb
      )
    `
    console.log(`  ✅  Productie: ${p.naam}`)
  }

  for (const g of gasten) {
    await sql`
      INSERT INTO interview_gasten (
        id, productie_naam, type, naam, functie, planning, gedeeld,
        questions, status, regienummer, datum, tijd
      ) VALUES (
        ${g.id}, ${g.productie_naam}, ${g.type}, ${g.naam}, ${g.functie},
        ${g.planning}, ${g.gedeeld}, ${JSON.stringify(g.questions)}::jsonb,
        ${g.status}, ${g.regienummer}, ${g.datum}, ${g.tijd}
      )
    `
    console.log(`  ✅  Gast: ${g.naam} (${g.status})`)
  }

  console.log(`\n✨ Klaar: ${producties.length} producties, ${gasten.length} gasten (${SEED_TAG}).\n`)
}

run().catch((err) => {
  console.error('❌', err.message || err)
  process.exit(1)
})
