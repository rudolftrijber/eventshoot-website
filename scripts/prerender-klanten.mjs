/**
 * Genereert per klant een index.html met OG-meta voor WhatsApp/LinkedIn crawlers.
 * Draait na vite build → dist/klanten/[slug]/index.html
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'

const BASE_URL = 'https://eventshoot.nl'
const DEFAULT_IMAGE = `${BASE_URL}/wp-content/uploads/2026/03/eventshoot-50-1-scaled.jpg`
const DIST_INDEX = join('dist', 'index.html')
const CONFIG_DIR = join('public', 'klanten')

function toAbsoluteUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function firstPhotoFromManifest(localFolder) {
  const manifestPath = join('public', 'def', localFolder, 'manifest.json')
  if (!existsSync(manifestPath)) return null
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  return manifest.photos?.[0] ?? null
}

function resolveHeroImage(config) {
  if (config.heroImage) return toAbsoluteUrl(config.heroImage)
  if (config.localFolder) {
    const first = firstPhotoFromManifest(config.localFolder)
    if (first) return toAbsoluteUrl(first)
  }
  return DEFAULT_IMAGE
}

function injectMeta(html, { title, description, image, url }) {
  const ogTags = `
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:image" content="${escapeAttr(image)}" />
    <meta property="og:url" content="${escapeAttr(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${escapeAttr(image)}" />
    <link rel="canonical" href="${escapeAttr(url)}" />`

  let result = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(description)}" />`,
    )

  if (result.includes('</head>')) {
    result = result.replace('</head>', `${ogTags}\n  </head>`)
  }

  return result
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function escapeHtml(value) {
  return escapeAttr(value)
}

if (!existsSync(DIST_INDEX)) {
  console.warn('prerender-klanten: dist/index.html niet gevonden, overgeslagen.')
  process.exit(0)
}

if (!existsSync(CONFIG_DIR)) {
  console.log('prerender-klanten: geen klanten-configs gevonden.')
  process.exit(0)
}

const template = readFileSync(DIST_INDEX, 'utf8')
const configs = readdirSync(CONFIG_DIR).filter(f => f.endsWith('.json'))

for (const file of configs) {
  const config = JSON.parse(readFileSync(join(CONFIG_DIR, file), 'utf8'))
  const slug = config.slug || basename(file, '.json')
  const title = `${config.title} | Eventshoot.nl`
  const description = config.subtitle || ''
  const url = `${BASE_URL}/klanten/${slug}`
  const image = resolveHeroImage(config)

  const html = injectMeta(template, { title, description, image, url })
  const outDir = join('dist', 'klanten', slug)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  console.log(`✓ OG-prerender: /klanten/${slug} → ${image}`)
}

console.log(`prerender-klanten: ${configs.length} pagina('s) klaar.`)
