import type { TypedObject } from '@portabletext/types'
import type { SanityPost } from '@/lib/sanity'

function block(key: string, text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
  }
}

function h2(key: string, text: string) {
  return block(key, text, 'h2')
}

function lead(key: string, title: string, rest: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    listItem: 'number',
    level: 1,
    markDefs: [],
    children: [
      { _type: 'span', _key: `${key}-a`, text: title, marks: ['strong'] },
      { _type: 'span', _key: `${key}-b`, text: rest, marks: [] },
    ],
  }
}

export const goudmijnPost: SanityPost = {
  _id: 'local-nooit-meer-zonder-social-media-content',
  title: 'Je event is een goudmijn aan content: zo zit je nooit meer zonder social media content',
  seoTitle: 'Nooit meer zonder social media content',
  slug: { current: 'nooit-meer-zonder-social-media-content' },
  publishedAt: '2026-11-17T08:00:00.000Z',
  excerpt: 'Eén zakelijk event levert maanden social content. Long form voor je kanaal, short form voor LinkedIn. Download het overzicht gratis (NL en EN).',
  mainImage: null,
  imageUrl: '/event-content-goudmijn.png',
  imageAlt: 'Je event is een goudmijn aan content. Gratis document over social media content uit je zakelijke event.',
  readTime: 4,
  body: ([
    block('intro', 'Elke week iets plaatsen op LinkedIn klinkt eenvoudig, tot je er echt mee begint. Wat zet je deze week online? Wie heeft er tijd om iets te maken? En wat als het na een paar weken stilvalt? Voor veel organisaties is dat het echte probleem. Het goede nieuws: als je een zakelijk event organiseert, heb je de oplossing al in huis.'),
    h2('h-netwerken', 'Je event is meer dan netwerken'),
    block('netwerken', 'Een zakelijk event is de plek om kennis te delen en te netwerken. Maar het is ook het moment waarop alles samenkomt: keynote sprekers, sponsors, klanten en je eigen managementteam, en bijna iedereen is bereid om een interview te geven. Dat is veel kennis op één plek, en dus het ideale moment om content te produceren.'),
    h2('h-vormen', 'Twee soorten video die elkaar versterken'),
    block('vormen-in', 'Het verschil tussen long form en short form is belangrijk, en wordt vaak door elkaar gehaald.'),
    block('long', 'Long form is een vodcast van ongeveer 20 tot 25 minuten, of een eventinterview van 3 tot 6 minuten. Die plaats je op je eigen website, video- en/of podcastkanaal. Hier deel je kennis met diepgang, bouw je autoriteit op en vertrouwen, aflevering na aflevering. Een transcript maakt het ook vindbaar voor AI. Een vodcast kun je zonder extra kosten ook als podcast op Apple en Spotify aanbieden.'),
    block('short', 'Short form is een korte video van 20 tot 40 seconden, een video snack of snippet, voor social media zoals LinkedIn. Deze video\'s maken je zichtbaar voor mensen die je nog niet kennen, en eindigen met een CTA: de kijker bekijkt de hele aflevering.'),
    block('niet-social', 'Een long form interview plaats je dus niet op social media. Daar werkt short form het best.'),
    h2('h-een', 'Eén video is geen video'),
    block('een-1', 'Eén video levert zelden iets op. Het effect ontstaat pas als je periodiek zichtbaar bent, minimaal wekelijks. Mensen gaan van onbekend naar zichtbaar, volgen je, bouwen vertrouwen op, nemen contact op, denken eerst aan jou en kiezen uiteindelijk voor jou. Dat gebeurt niet na één post.'),
    block('een-2', 'Daar zit precies het probleem. Wekelijks iets maken is veel werk. Wekelijks iets plaatsen uit materiaal dat je al hebt, is dat niet.'),
    h2('h-voorbeeld', 'Een voorbeeld'),
    block('voorbeeld', 'Stel dat je op je event 20 interviews opneemt. Uit elk interview halen we minimaal twee korte video\'s, dus 40 of meer. Dat is ruim 9 maanden wekelijks iets om te plaatsen. Neem je op één eventdag 8 vodcasts op, met ongeveer 6 korte video\'s per vodcast, dan kom je op ongeveer 48 korte video\'s en ongeveer een jaar aan wekelijkse content. Dit zijn voorbeelden, het aantal hangt af van de voorbereiding en van hoeveel interviews of vodcasts je opneemt.'),
    h2('h-vijf', 'Vijf manieren om meer uit elke video te halen'),
    lead('m1', 'Eén opname, meer uitingen. ', 'Het transcript wordt een artikel, nieuwsbrief of LinkedIn tekst. De foto\'s van de dag gebruik je voor aankondigingen, je website en je nieuwsbrief.'),
    lead('m2', 'Eén doel per video. ', 'Bij short form is dat meestal: bekijk de hele aflevering. Een kijker die niet weet wat hij moet doen, doet niets.'),
    lead('m3', 'Maak het meetbaar. ', 'Kies twee cijfers, bijvoorbeeld het bereik van de snippets en het aantal bezoekers op je eigen kanaal.'),
    lead('m4', 'Begrijpelijk zonder geluid. ', 'Veel mensen scrollen met het geluid uit, dus gebruik ondertitels in je short form.'),
    lead('m5', 'Maak ook content voor je sponsoren. ', 'Geef elke sponsor video content om te delen. Je kent het vast: "Deze aflevering wordt mede mogelijk gemaakt door…". Vendoren betalen vaak mee aan de video\'s van hun distributeurs, mits hun logo of huisstijl in beeld komt.'),
    h2('h-download', 'Download het document'),
    block('download-in', 'Wil je dit overzichtelijk bij de hand hebben, of delen met je team of directie? Download het document gratis.'),
    {
      _type: 'articleDownloads',
      _key: 'downloads',
      items: [
        {
          _key: 'dl-nl',
          _type: 'articleDownload',
          label: 'Download het document (NL)',
          href: '/DATA_EVENTSHOOT/FILES/Event_content_goudmijn_NL.pdf',
        },
        {
          _key: 'dl-en',
          _type: 'articleDownload',
          label: 'Download the document (EN)',
          href: '/DATA_EVENTSHOOT/FILES/Event_content_goudmijn_EN.pdf',
        },
      ],
    },
    {
      _type: 'block',
      _key: 'cta',
      style: 'normal',
      markDefs: [{ _key: 'cta-link', _type: 'link', href: '/kennismaken' }],
      children: [
        { _type: 'span', _key: 'cta-a', text: 'Benieuwd wat dit voor jouw event kan betekenen? ', marks: [] },
        { _type: 'span', _key: 'cta-b', text: 'Maak vrijblijvend kennis', marks: ['cta-link'] },
        { _type: 'span', _key: 'cta-c', text: ' met Rolf Trijber van Eventshoot.nl.', marks: [] },
      ],
    },
  ] as TypedObject[]),
  faq: [
    {
      question: 'Wat is het verschil tussen long form en short form video?',
      answer: 'Long form is een vodcast van ongeveer 20 tot 25 minuten, of een eventinterview van 3 tot 6 minuten. Die plaats je op je eigen website, video- of podcastkanaal. Short form is een video van 20 tot 40 seconden voor social media zoals LinkedIn, en eindigt met een oproep om de hele aflevering te bekijken.',
    },
    {
      question: 'Hoeveel social content haal je uit één event?',
      answer: 'Dat hangt af van de voorbereiding. Twintig interviews leveren minimaal veertig korte video\'s, ruim negen maanden wekelijks plaatsen. Acht vodcasts met ongeveer zes korte video\'s per vodcast leveren ongeveer 48 korte video\'s, ongeveer een jaar aan wekelijkse content.',
    },
    {
      question: 'Plaats je een lang interview op LinkedIn?',
      answer: 'Een long form interview plaats je op je eigen website, video- of podcastkanaal. Op social media werkt short form het best.',
    },
    {
      question: 'Kun je een vodcast ook als podcast publiceren?',
      answer: 'Ja. Een vodcast kun je zonder extra kosten ook als podcast op Apple en Spotify aanbieden. Een transcript maakt de aflevering ook vindbaar voor AI.',
    },
  ],
}

export const localEventkennisPosts: SanityPost[] = [goudmijnPost]

export function findLocalPost(slug: string): SanityPost | null {
  return localEventkennisPosts.find(post => post.slug.current === slug) ?? null
}

export function mergeLocalPosts(posts: SanityPost[]): SanityPost[] {
  const slugs = new Set(posts.map(post => post.slug.current))
  const extra = localEventkennisPosts.filter(post => !slugs.has(post.slug.current))
  return [...posts, ...extra].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  )
}
