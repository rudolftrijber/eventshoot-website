/**
 * Genereert public/llms.txt volgens https://llmstxt.org/
 */
import { createClient } from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BASE = 'https://eventshoot.nl'

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'pn3eisnr',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2026-05-08',
})

function link(name, url, note) {
  return note ? `- [${name}](${url}): ${note}` : `- [${name}](${url})`
}

async function main() {
  let posts = []
  try {
    posts = await client.fetch(
      `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        excerpt
      }`,
    )
  } catch (err) {
    console.warn('Sanity niet bereikbaar, llms.txt zonder artikelen:', err.message)
  }

  const eventkennisLines = posts.length
    ? posts.map(p => link(p.title, `${BASE}/eventkennis/${p.slug}`, p.excerpt || 'Artikel over eventcontent'))
    : [link('Eventkennis overzicht', `${BASE}/eventkennis`, 'Praktische artikelen over eventfotografie en zichtbaarheid na je event')]

  const content = `# Eventshoot.nl

> Professionele eventfotografie en eventvideo voor congressen, conferenties, ledendagen, seminars en bedrijfsbijeenkomsten in heel Nederland. Eén event, een complete contentbox: 25+ kant-en-klare foto's, aftermovies en interviews, geleverd binnen 48 uur. Gemaakt door mensen op locatie, geen AI-beelden.

Eventshoot.nl is de website van Rolf Trijber, eventfotograaf en videograaf met 40+ jaar ervaring in beeldproductie. Werkgebied: heel Nederland. Contact: rolf@eventshoot.nl, 06 251 777 28.

Kernbeloftes (in deze volgorde): 25+ kant-en-klare items per event, geleverd binnen 48 uur, gefotografeerd en gefilmd door mensen. Motto: "Jouw event is een goudmijn aan content."

Pakketten (excl. BTW): Highlight €895 (4 uur, social aftermovie), Headline €2.250 (8 uur, meest gekozen), Heroes €3.450 (8 uur, social + corporate aftermovie + interviews). Jaarcontract Content Year: €775/maand, 3 events per jaar op Heroes-niveau.

Ideale klanten: brancheverenigingen, eventbureaus en DMC's, hotels met congresfaciliteiten, bedrijven met eigen events, en marketingbureaus. De klant heeft iemand die content kan uitrollen (marketeer of communicatiemedewerker).

## Diensten

${link('Home', `${BASE}/`, 'Propositie, USP\'s, pakketten en reviews')}
${link('Eventfotografie', `${BASE}/eventfotografie`, 'Foto\'s voor LinkedIn, website en nieuwsbrief, binnen 48 uur')}
${link('Eventvideo', `${BASE}/eventvideo`, 'Social aftermovies, corporate aftermovies en interviews')}
${link('Werk / portfolio', `${BASE}/werk`, 'Selectie congressen, jaarcongressen en bedrijfsbijeenkomsten')}
${link('Tarieven', `${BASE}/tarieven`, 'Highlight, Headline, Heroes en Content Year jaarcontract')}

## Voor wie

${link('Brancheverenigingen', `${BASE}/voor/brancheverenigingen`, 'Jaarcongres, ledendagen en vakdagen')}
${link('Eventbureaus en DMC\'s', `${BASE}/voor/eventbureaus`, 'Vaste content-partner achter de schermen')}
${link('Hotels met congresfaciliteiten', `${BASE}/voor/hotels`, 'Eventcontent voor gehoste congressen')}
${link('Bedrijven met eigen events', `${BASE}/voor/bedrijven`, 'User conferences, klantdagen en bedrijfsbijeenkomsten')}

## Contact en vertrouwen

${link('Kennismaken', `${BASE}/kennismaken`, 'Korte kennismaking, telefoon, e-mail of agenda')}
${link('Over Rolf Trijber', `${BASE}/over-rolf`, 'Achtergrond, verwachtingen en werkwijze')}

## Eventkennis

${eventkennisLines.join('\n')}

## Optional

${link('Privacy en disclaimer', `${BASE}/privacy`, 'Juridische informatie')}
${link('Sitemap', `${BASE}/sitemap.xml`, 'Machineleesbare lijst van publieke pagina\'s')}
`

  const out = path.join(ROOT, 'public', 'llms.txt')
  fs.writeFileSync(out, content, 'utf8')
  console.log(`llms.txt geschreven: ${posts.length} Eventkennis-artikelen`)
}

main()
