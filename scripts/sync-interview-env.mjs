#!/usr/bin/env node
/**
 * Sync POSTGRES_URL from INTERVIEW-LOKAAL-SETUP.md into .env.local
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const root = process.cwd()
const setupPath = join(root, 'INTERVIEW-LOKAAL-SETUP.md')
const envPath = join(root, '.env.local')

if (!existsSync(setupPath)) {
  console.error('INTERVIEW-LOKAAL-SETUP.md niet gevonden')
  process.exit(1)
}

const setup = readFileSync(setupPath, 'utf8')
const match = setup.match(/POSTGRES_URL_HIER_PLAKKEN="([^"]*)"/)
const url = match?.[1]?.trim()

if (!url || !url.startsWith('postgresql://')) {
  console.error('Plak eerst je postgresql:// URL in INTERVIEW-LOKAAL-SETUP.md')
  console.error('(tussen de aanhalingstekens bij POSTGRES_URL_HIER_PLAKKEN)')
  process.exit(1)
}

const env = `POSTGRES_URL=${url}\n`
writeFileSync(envPath, env, 'utf8')
console.log('✓ .env.local bijgewerkt')
console.log('  Herstart: pkill -f vite && npm run dev')
