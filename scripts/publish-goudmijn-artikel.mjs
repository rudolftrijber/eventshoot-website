/**
 * Publiceer het Eventkennis-artikel over social content uit je event.
 * Gebruik: SANITY_TOKEN=sk... node scripts/publish-goudmijn-artikel.mjs
 */

import { createReadStream } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'pn3eisnr'
const DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_TOKEN || process.env.SANITY_AUTH_TOKEN
const SLUG = 'nooit-meer-zonder-social-media-content'

if (!TOKEN) {
  console.error('Geen SANITY_TOKEN. Gebruik: SANITY_TOKEN=sk... node scripts/publish-goudmijn-artikel.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  useCdn: false,
  apiVersion: '2026-05-08',
})

function key() {
  return Math.random().toString(36).slice(2, 10)
}

function block(text, style = 'normal') {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }
}

function h2(text) {
  return block(text, 'h2')
}

function lead(title, rest) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'number',
    level: 1,
    markDefs: [],
    children: [
      { _type: 'span', _key: key(), text: title, marks: ['strong'] },
      { _type: 'span', _key: key(), text: rest, marks: [] },
    ],
  }
}

function linkParagraph(parts) {
  const markDefs = []
  const children = parts.map(part => {
    const marks = []
    if (part.href) {
      const markKey = key()
      markDefs.push({ _key: markKey, _type: 'link', href: part.href })
      marks.push(markKey)
    }
    return { _type: 'span', _key: key(), text: part.text, marks }
  })
  return { _type: 'block', _key: key(), style: 'normal', markDefs, children }
}

const seoTitle = 'Nooit meer zonder social media content'
const excerpt = 'Eén zakelijk event levert maanden social content. Long form voor je kanaal, short form voor LinkedIn. Download het overzicht gratis (NL en EN).'

const title = 'Je event is een goudmijn aan content: zo zit je nooit meer zonder social media content'
const fullSeoTitle = `${seoTitle} | Eventshoot.nl`

console.log(`SEO-titel: ${fullSeoTitle.length} tekens`)
console.log(`Metabeschrijving: ${excerpt.length} tekens`)
if (fullSeoTitle.length > 60) throw new Error(`SEO-titel te lang: ${fullSeoTitle.length}`)
if (excerpt.length > 160) throw new Error(`Metabeschrijving te lang: ${excerpt.length}`)

const body = [
  block('Elke week iets plaatsen op LinkedIn klinkt eenvoudig, tot je er echt mee begint. Wat zet je deze week online? Wie heeft er tijd om iets te maken? En wat als het na een paar weken stilvalt? Voor veel organisaties is dat het echte probleem. Het goede nieuws: als je een zakelijk event organiseert, heb je de oplossing al in huis.'),
  h2('Je event is meer dan netwerken'),
  block('Een zakelijk event is de plek om kennis te delen en te netwerken. Maar het is ook het moment waarop alles samenkomt: keynote sprekers, sponsors, klanten en je eigen managementteam, en bijna iedereen is bereid om een interview te geven. Dat is veel kennis op één plek, en dus het ideale moment om content te produceren.'),
  h2('Twee soorten video die elkaar versterken'),
  block('Het verschil tussen long form en short form is belangrijk, en wordt vaak door elkaar gehaald.'),
  block('Long form is een vodcast van ongeveer 20 tot 25 minuten, of een eventinterview van 3 tot 6 minuten. Die plaats je op je eigen website, video- en/of podcastkanaal. Hier deel je kennis met diepgang, bouw je autoriteit op en vertrouwen, aflevering na aflevering. Een transcript maakt het ook vindbaar voor AI. Een vodcast kun je zonder extra kosten ook als podcast op Apple en Spotify aanbieden.'),
  block('Short form is een korte video van 20 tot 40 seconden, een video snack of snippet, voor social media zoals LinkedIn. Deze video\'s maken je zichtbaar voor mensen die je nog niet kennen, en eindigen met een CTA: de kijker bekijkt de hele aflevering.'),
  block('Een long form interview plaats je dus niet op social media. Daar werkt short form het best.'),
  h2('Eén video is geen video'),
  block('Eén video levert zelden iets op. Het effect ontstaat pas als je periodiek zichtbaar bent, minimaal wekelijks. Mensen gaan van onbekend naar zichtbaar, volgen je, bouwen vertrouwen op, nemen contact op, denken eerst aan jou en kiezen uiteindelijk voor jou. Dat gebeurt niet na één post.'),
  block('Daar zit precies het probleem. Wekelijks iets maken is veel werk. Wekelijks iets plaatsen uit materiaal dat je al hebt, is dat niet.'),
  h2('Een voorbeeld'),
  block('Stel dat je op je event 20 interviews opneemt. Uit elk interview halen we minimaal twee korte video\'s, dus 40 of meer. Dat is ruim 9 maanden wekelijks iets om te plaatsen. Neem je op één eventdag 8 vodcasts op, met ongeveer 6 korte video\'s per vodcast, dan kom je op ongeveer 48 korte video\'s en ongeveer een jaar aan wekelijkse content. Dit zijn voorbeelden, het aantal hangt af van de voorbereiding en van hoeveel interviews of vodcasts je opneemt.'),
  h2('Vijf manieren om meer uit elke video te halen'),
  lead('Eén opname, meer uitingen. ', 'Het transcript wordt een artikel, nieuwsbrief of LinkedIn tekst. De foto\'s van de dag gebruik je voor aankondigingen, je website en je nieuwsbrief.'),
  lead('Eén doel per video. ', 'Bij short form is dat meestal: bekijk de hele aflevering. Een kijker die niet weet wat hij moet doen, doet niets.'),
  lead('Maak het meetbaar. ', 'Kies twee cijfers, bijvoorbeeld het bereik van de snippets en het aantal bezoekers op je eigen kanaal.'),
  lead('Begrijpelijk zonder geluid. ', 'Veel mensen scrollen met het geluid uit, dus gebruik ondertitels in je short form.'),
  lead('Maak ook content voor je sponsoren. ', 'Geef elke sponsor video content om te delen. Je kent het vast: "Deze aflevering wordt mede mogelijk gemaakt door…". Vendoren betalen vaak mee aan de video\'s van hun distributeurs, mits hun logo of huisstijl in beeld komt.'),
  h2('Download het document'),
  block('Wil je dit overzichtelijk bij de hand hebben, of delen met je team of directie? Download het document gratis.'),
  {
    _type: 'articleDownloads',
    _key: key(),
    items: [
      {
        _key: key(),
        _type: 'articleDownload',
        label: 'Download het document (NL)',
        href: '/DATA_EVENTSHOOT/FILES/Event_content_goudmijn_NL.pdf',
      },
      {
        _key: key(),
        _type: 'articleDownload',
        label: 'Download the document (EN)',
        href: '/DATA_EVENTSHOOT/FILES/Event_content_goudmijn_EN.pdf',
      },
    ],
  },
  linkParagraph([
    { text: 'Benieuwd wat dit voor jouw event kan betekenen? ' },
    { text: 'Maak vrijblijvend kennis', href: '/kennismaken' },
    { text: ' met Rolf Trijber van Eventshoot.nl.' },
  ]),
]

const faq = [
  {
    _key: key(),
    _type: 'articleFaqItem',
    question: 'Wat is het verschil tussen long form en short form video?',
    answer: 'Long form is een vodcast van ongeveer 20 tot 25 minuten, of een eventinterview van 3 tot 6 minuten. Die plaats je op je eigen website, video- of podcastkanaal. Short form is een video van 20 tot 40 seconden voor social media zoals LinkedIn, en eindigt met een oproep om de hele aflevering te bekijken.',
  },
  {
    _key: key(),
    _type: 'articleFaqItem',
    question: 'Hoeveel social content haal je uit één event?',
    answer: 'Dat hangt af van de voorbereiding. Twintig interviews leveren minimaal veertig korte video\'s, ruim negen maanden wekelijks plaatsen. Acht vodcasts met ongeveer zes korte video\'s per vodcast leveren ongeveer 48 korte video\'s, ongeveer een jaar aan wekelijkse content.',
  },
  {
    _key: key(),
    _type: 'articleFaqItem',
    question: 'Plaats je een lang interview op LinkedIn?',
    answer: 'Een long form interview plaats je op je eigen website, video- of podcastkanaal. Op social media werkt short form het best.',
  },
  {
    _key: key(),
    _type: 'articleFaqItem',
    question: 'Kun je een vodcast ook als podcast publiceren?',
    answer: 'Ja. Een vodcast kun je zonder extra kosten ook als podcast op Apple en Spotify aanbieden. Een transcript maakt de aflevering ook vindbaar voor AI.',
  },
]

const imagePath = join(__dirname, '../public/event-content-goudmijn.png')

async function uploadImage() {
  const asset = await client.assets.upload('image', createReadStream(imagePath), {
    filename: 'event-content-goudmijn.png',
    contentType: 'image/png',
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: 'Je event is een goudmijn aan content. Gratis document over social media content uit je zakelijke event.',
  }
}

async function run() {
  const existingId = await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]._id`,
    { slug: SLUG },
  )
  const _id = existingId || 'eventkennis-nooit-meer-zonder-social-media-content'
  console.log(existingId ? `Bijwerken: ${_id}` : `Nieuw artikel: ${_id}`)

  const mainImage = await uploadImage()

  await client.createOrReplace({
    _id,
    _type: 'blogPost',
    title,
    seoTitle,
    slug: { _type: 'slug', current: SLUG },
    publishedAt: '2026-11-17T08:00:00.000Z',
    excerpt,
    readTime: 4,
    mainImage,
    body,
    faq,
  })

  console.log(`Gepubliceerd: /eventkennis/${SLUG}`)
}

run().catch(err => {
  console.error(err.message || err)
  process.exit(1)
})
