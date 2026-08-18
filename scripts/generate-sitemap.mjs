/**
 * Genereert public/sitemap.xml met statische pagina's + Eventkennis-artikelen uit Sanity.
 */
import { createClient } from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BASE = 'https://eventshoot.nl'

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/eventfotografie', priority: '0.9', changefreq: 'monthly' },
  { path: '/eventvideo', priority: '0.9', changefreq: 'monthly' },
  { path: '/diensten/event-vodcast-recording', priority: '0.9', changefreq: 'monthly' },
  { path: '/en/diensten/event-vodcast-recording', priority: '0.8', changefreq: 'monthly' },
  { path: '/werk', priority: '0.8', changefreq: 'monthly' },
  { path: '/tarieven', priority: '0.9', changefreq: 'monthly' },
  { path: '/kennismaken', priority: '0.9', changefreq: 'monthly' },
  { path: '/over-rolf', priority: '0.8', changefreq: 'monthly' },
  { path: '/eventkennis', priority: '0.8', changefreq: 'weekly' },
  { path: '/voor/brancheverenigingen', priority: '0.8', changefreq: 'monthly' },
  { path: '/voor/eventbureaus', priority: '0.8', changefreq: 'monthly' },
  { path: '/voor/hotels', priority: '0.8', changefreq: 'monthly' },
  { path: '/voor/bedrijven', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/gallery', priority: '0.4', changefreq: 'yearly' },
]

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'pn3eisnr',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2026-05-08',
})

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function urlEntry(loc, { priority, changefreq, lastmod }) {
  const parts = [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    priority ? `    <priority>${priority}</priority>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    '  </url>',
  ]
  return parts.filter(Boolean).join('\n')
}

async function main() {
  let posts = []
  try {
    posts = await client.fetch(
      `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current,
        publishedAt
      }`,
    )
  } catch (err) {
    console.warn('Sanity niet bereikbaar, sitemap zonder artikelen:', err.message)
  }

  const today = new Date().toISOString().slice(0, 10)
  const entries = []

  for (const page of STATIC_PAGES) {
    entries.push(
      urlEntry(`${BASE}${page.path}`, {
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: today,
      }),
    )
  }

  for (const post of posts) {
    const lastmod = post.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 10)
      : today
    entries.push(
      urlEntry(`${BASE}/eventkennis/${post.slug}`, {
        priority: '0.6',
        changefreq: 'monthly',
        lastmod,
      }),
    )
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

  const outPath = path.join(ROOT, 'public', 'sitemap.xml')
  fs.writeFileSync(outPath, xml, 'utf8')
  console.log(`sitemap.xml geschreven: ${STATIC_PAGES.length} pagina's, ${posts.length} artikelen`)
}

main()
