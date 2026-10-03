/**
 * Genereert per marketingpagina een index.html met OG-meta voor WhatsApp/LinkedIn.
 * Draait na vite build → dist/[pad]/index.html
 *
 * Crawlers voeren geen Vue uit, dus zonder dit zien ze altijd de algemene titel
 * uit index.html ("Eventfotograaf Nederland").
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE_URL = 'https://eventshoot.nl'
const DIST_INDEX = join('dist', 'index.html')

const PAGES = [
  {
    path: '/diensten/event-vodcast-recording',
    title: 'Event Vodcast Recording | Eventshoot.nl',
    description:
      'Ca. 40 branded video\'s uit één eventdag, voor € 3.725. Ca. 8 vodcasts van ca. 20 minuten, 3 tot 4 verticale shorts per aflevering en een BTS. Geen studio, geen cameraploeg.',
    image: `${BASE_URL}/DATA_EVENTSHOOT/SITE_IMAGES/VODCAST/RT202570.jpg`,
    locale: 'nl_NL',
  },
  {
    path: '/en/diensten/event-vodcast-recording',
    title: 'Event Vodcast Recording | Eventshoot.nl',
    description:
      'About 40 branded videos from one event day, for € 3,725. About 8 vodcasts of about 20 minutes, 3 to 4 vertical shorts per episode and a BTS. No studio, no camera crew.',
    image: `${BASE_URL}/DATA_EVENTSHOOT/SITE_IMAGES/VODCAST/RT202570.jpg`,
    locale: 'en_GB',
  },
]

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function injectMeta(html, { title, description, image, url, locale }) {
  const ogTags = `
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:image" content="${escapeAttr(image)}" />
    <meta property="og:url" content="${escapeAttr(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${escapeAttr(locale || 'nl_NL')}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${escapeAttr(image)}" />
    <link rel="canonical" href="${escapeAttr(url)}" />`

  let result = html
    .replace(/<html lang="[^"]*">/, `<html lang="${(locale || 'nl_NL').startsWith('en') ? 'en' : 'nl'}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(description)}" />`,
    )

  if (result.includes('</head>')) {
    result = result.replace('</head>', `${ogTags}\n  </head>`)
  }

  return result
}

if (!existsSync(DIST_INDEX)) {
  console.warn('prerender-pages: dist/index.html niet gevonden, overgeslagen.')
  process.exit(0)
}

const template = readFileSync(DIST_INDEX, 'utf8')

for (const page of PAGES) {
  const url = `${BASE_URL}${page.path}`
  const html = injectMeta(template, {
    title: page.title,
    description: page.description,
    image: page.image,
    url,
    locale: page.locale,
  })
  const outDir = join('dist', ...page.path.replace(/^\//, '').split('/'))
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  console.log(`✓ OG-prerender: ${page.path}`)
}

console.log(`prerender-pages: ${PAGES.length} pagina('s) klaar.`)
