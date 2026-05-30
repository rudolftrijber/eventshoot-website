/**
 * Importeer blogartikel en naar Sanity.
 * Gebruik: SANITY_TOKEN=<token> node scripts/import-blog.mjs
 */

import { createClient } from '@sanity/client'

const PROJECT_ID = 'pn3eisnr'
const DATASET = 'production'
const TOKEN = process.env.SANITY_TOKEN

if (!TOKEN) {
  console.error('❌  Geen token gevonden. Gebruik: SANITY_TOKEN=... node scripts/import-blog.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  useCdn: false,
  apiVersion: '2026-05-08',
})

function key() { return Math.random().toString(36).slice(2, 10) }

function block(text, style = 'normal') {
  return { _type: 'block', _key: key(), style, children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] }
}

function h2(text) { return block(text, 'h2') }

function bold(text) {
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [{ _key: 'b1', _type: 'strong' }],
    children: [{ _type: 'span', _key: key(), text, marks: ['strong'] }] }
}

async function uploadImage(url, filename) {
  console.log(`  ↑ Afbeelding uploaden: ${filename}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = await res.arrayBuffer()
  const asset = await client.assets.upload('image', Buffer.from(buf), { filename, contentType: 'image/jpeg' })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

// ─── Alle artikelen ────────────────────────────────────────────────────────────

const posts = [
  // ── Reeds geïmporteerd (worden overgeslagen als ze al bestaan) ──────────────
  {
    title: 'Waarom professionele eventfotografie loont voor je volgende congres',
    slug: 'waarom-professionele-eventfotografie-loont',
    publishedAt: '2026-04-15T09:00:00Z',
    excerpt: 'Telefoonfotos zijn handig, maar ze vertellen zelden het verhaal dat jouw event verdient. Lees waarom goede eventfotografie een investering is die zichzelf terugverdient.',
    readTime: 5,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-50-1-scaled.jpg',
    imageFilename: 'eventshoot-50-1-scaled.jpg',
    imageAlt: 'Professionele eventfotografie tijdens zakelijk congres',
    body: [
      block('Elk jaar organiseer je een congres of seminar. De sprekers zijn top, de locatie is perfect, de catering is geregeld. Maar achteraf heb je... een map met wazig gemaakte telefoonfotos.'),
      h2('De waarde van beeldmateriaal na het event'),
      block('Professionele eventfoto\'s leven lang na het event zelf. Ze komen terug in uitnodigingen voor de volgende editie, LinkedIn-posts van sprekers en deelnemers, je jaarverslag of website en persberichten en vakbladen.'),
      block('Een studie van Hootsuite laat zien dat berichten met professionele foto\'s gemiddeld 3× meer engagement krijgen dan berichten met telefoonfoto\'s.'),
      h2('Wat maakt een eventfoto professioneel?'),
      block('Het gaat niet alleen om een dure camera. Een goede eventfotograaf weet wanneer de beslissende momenten komen, hoe hij discreet aanwezig is zonder in de weg te lopen, en hoe hij sfeer vastlegt naast inhoud.'),
      h2('Snel geleverd, direct bruikbaar'),
      block('Bij Eventshoot.nl ontvang je alle bewerkte foto\'s binnen 48 uur. Zodat je de volgende ochtend al kunt posten.'),
    ],
  },
  {
    title: 'Wat zit er in een goede aftermovie? Dit moet je weten',
    slug: 'wat-zit-er-in-een-aftermovie',
    publishedAt: '2026-03-28T09:00:00Z',
    excerpt: 'Een aftermovie van 60 seconden kan meer doen voor je merkbeleving dan een pagina vol tekst. Maar wat maakt een aftermovie écht goed?',
    readTime: 4,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-75-1.jpg',
    imageFilename: 'eventshoot-75-1.jpg',
    imageAlt: 'Eventvideo opname tijdens zakelijk event',
    body: [
      block('Een aftermovie is geen filmpje met wat plaatjes op muziek. Een goede aftermovie vertelt een verhaal: van de verwachting vooraf tot de energie in de zaal en de samenvatting van wat er bereikt is.'),
      h2('De drie lagen van een goede aftermovie'),
      bold('1. Sfeer en beleving'),
      block('Slow-motion shots van de zaal, close-ups van luisterende gezichten, het applaus na een keynote. Dit zijn de emotionele ankers van je film.'),
      bold('2. Inhoud en context'),
      block('Quotes van sprekers, slide-flashes met kernboodschappen, een korte samenvatting van het thema. Zo begrijpt ook iemand die er niet bij was waarover het ging.'),
      bold('3. Call to action'),
      block('De beste aftermovies eindigen met een uitnodiging: "Tot volgend jaar" of "Schrijf je nu in voor editie 2027."'),
      h2('Lengte: kort is beter'),
      block('Voor LinkedIn en Instagram: 30–60 seconden. Voor je website of jaarverslag: 90–180 seconden. Bij het Gouden uur pakket maak ik standaard een social aftermovie van 30–60 seconden. Bij het Spotlight pakket ook een langere corporate versie.'),
    ],
  },
  {
    title: 'De checklist: zo brief je een eventfotograaf goed',
    slug: 'checklist-eventfotografie-briefing',
    publishedAt: '2026-03-10T09:00:00Z',
    excerpt: 'Een goede briefing vooraf is de helft van het werk. Met deze checklist zorg je dat je fotograaf precies weet wat je nodig hebt.',
    readTime: 3,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-83-1-scaled.jpg',
    imageFilename: 'eventshoot-83-1-scaled.jpg',
    imageAlt: 'Briefing eventfotograaf voor zakelijk congres',
    body: [
      block('Je hebt een fotograaf geboekt. Super. Maar het echte werk begint bij de briefing. Hoe beter jij communiceert wat je nodig hebt, hoe beter het eindresultaat.'),
      h2('Wat moet in de briefing?'),
      bold('Praktisch:'),
      block('Datum, tijdstip en locatie (inclusief adres en eventuele parkeerinstructies), naam contactpersoon op de dag en dresscode of kledingadvies.'),
      bold('Inhoudelijk:'),
      block('Wat is het doel van het event? Wie zijn de belangrijkste personen die zeker gefotografeerd moeten worden? Zijn er momenten die absoluut niet gemist mogen worden?'),
      bold('Stijl:'),
      block('Heb je voorbeelden van foto\'s die je mooi vindt? Wil je reportage-stijl of meer geposeerde foto\'s? Moet het logo of huisstijl zichtbaar zijn op de foto\'s?'),
      bold('Gebruik:'),
      block('Waar komen de foto\'s terug? Wanneer heb je de foto\'s nodig?'),
      block('Bij Eventshoot.nl doorloop ik deze checklist altijd samen met de opdrachtgever in een kort telefoongesprek vooraf. Zo kom ik goed voorbereid aan op je event.'),
    ],
  },

  // ── Nieuwe artikelen ────────────────────────────────────────────────────────
  {
    title: 'Binnen 48 uur beelden, waarom snelheid telt',
    slug: 'binnen-48-uur-beelden-waarom-snelheid-telt',
    publishedAt: '2026-04-23T09:00:00Z',
    excerpt: 'Een event is geen moment — het is een kans. Wie pas na een week beelden ontvangt, is te laat. Lees waarom timing alles bepaalt bij eventfotografie.',
    readTime: 4,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-62-1-scaled.jpg',
    imageFilename: 'eventshoot-62-1-scaled.jpg',
    imageAlt: 'Snelle beeldlevering na zakelijk event',
    body: [
      block('Een event is geen moment, maar een kans om zichtbaar te zijn, momentum te pakken en je verhaal direct te delen. Deze gelegenheid verdwijnt snel — wie pas na een week beelden ontvangt, is te laat.'),
      h2('Waarom timing alles bepaalt'),
      block('Na een event is de energie nog voelbaar, praten deelnemers erover, delen sprekers inzichten en zit LinkedIn vol eerste reacties. Dit moment is cruciaal voor content-publicatie.'),
      h2('Wat gebeurt er als je te laat bent'),
      block('Vertraagde beeldlevering resulteert in verlies van actualiteit, drastisch lagere engagement, verdwijning van het event uit het gesprek en gemiste zichtbaarheid.'),
      h2('Wat snelle levering oplevert'),
      bold('1. Directe zichtbaarheid'),
      block('Publicatie terwijl het event nog leeft in het geheugen van deelnemers.'),
      bold('2. Meer engagement'),
      block('Aansluitend op actueel bewustzijn zorgt voor meer reacties en delingen.'),
      bold('3. Sterkere positionering'),
      block('Professionele communicatie direct na het event versterkt je reputatie als organisator.'),
      h2('Hoe je snelheid slim inzet'),
      block('Een vaste structuur helpt: dag 1 foto\'s op LinkedIn, dag 2 een korte aftermovie (45–90 sec), dag 3–5 snippets, quotes en interviews.'),
      h2('Nog sneller schakelen? Dat kan.'),
      block('Same-day of 24-uurs levering is mogelijk met aanvullende kosten voor prioriteit in montage en aangepaste workflow.'),
      h2('Praktisch advies'),
      block('Plan je content vóór het event: bepaal wat je post, wanneer, en welke beelden je nodig hebt. Zo loop je niet achter de feiten aan.'),
    ],
  },
  {
    title: 'Eventfotografie vs iPhone: wat is het verschil bij zakelijke evenementen?',
    slug: 'eventfotografie-vs-iphone',
    publishedAt: '2026-04-22T09:00:00Z',
    excerpt: 'Smartphones maken tegenwoordig goede foto\'s. Maar waarom huren organisatoren van zakelijke evenementen toch nog een professionele eventfotograaf in? Het verschil zit niet in de camera.',
    readTime: 4,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-56-1.jpg',
    imageFilename: 'eventshoot-56-1.jpg',
    imageAlt: 'Professionele eventfotograaf vs smartphone fotografie',
    body: [
      block('Smartphones maken tegenwoordig goede foto\'s. De vraag rijst daarom regelmatig waarom organisatoren van zakelijke evenementen nog een professionele eventfotograaf inhuren.'),
      h2('Het verschil zit niet in de camera, maar in het resultaat'),
      block('Bij professionele eventfotografie draait het niet om één succesvolle foto, maar om een complete beeldserie die het verhaal van je zakelijke evenement vertelt — direct bruikbaar voor communicatie en marketing.'),
      h2('Timing: het juiste moment vastleggen'),
      block('Ervaren fotografen anticiperen op momenten in plaats van deze reactief vast te leggen. Cruciale interacties — een spreker die een belangrijk punt maakt, reacties uit het publiek, spontane netwerkgesprekken — kunnen niet herregisseerd worden.'),
      h2('Consistentie: van losse foto\'s naar een sterke beeldserie'),
      block('Evenementbeelden worden op meerdere platforms gebruikt: LinkedIn, websites, nieuwsbrieven en promotiekanalen. Professionaliteit vraagt consistentie in belichting, compositie en kleurgebruik.'),
      block('Een enkele goede iPhone-foto is mogelijk. Maar een samenhangende serie beelden vraagt om ervaring, overzicht en vakmanschap.'),
      h2('Content uit je event halen: meer dan alleen foto\'s'),
      block('Professionele fotografen denken strategisch na over welke momenten essentieel zijn, wie zichtbaar moet zijn, en welke content nodig is. Dit resulteert niet in losse foto\'s, maar in een visueel narratief met langetermijnwaarde.'),
      h2('Conclusie'),
      block('Het verschil ligt niet in technologie, maar in timing, consistentie en inzicht. Het gaat niet om de camera, maar om wie erachter staat.'),
    ],
  },
  {
    title: 'Je event is een goudmijn aan content, gebruik het!',
    slug: 'je-event-is-een-goudmijn-aan-content',
    publishedAt: '2026-04-01T09:00:00Z',
    excerpt: 'De meeste organisaties zien een event als een moment. Het vindt plaats, wordt vastgelegd... en dan? 90% van de waarde blijft onbenut. Terwijl het event zelf vaak duizenden euro\'s kost.',
    readTime: 4,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-79-1-scaled.jpg',
    imageFilename: 'eventshoot-79-1-scaled.jpg',
    imageAlt: 'Event als contentmachine voor zakelijke organisaties',
    body: [
      block('De meeste organisaties beschouwen evenementen als eenmalige momenten, maar ze vormen eigenlijk een contentmachine vol kennis, mensen en interactie.'),
      h2('Wat er misgaat'),
      block('Veel organisaties denken alleen aan enkele foto\'s, zien video als bijzaak, maken geen contentplan en interviewen niet. Het gevolg: 90% van de waarde blijft onbenut. En dat terwijl het event zelf vaak duizenden euro\'s kost.'),
      h2('Wat een goed vastgelegd event oplevert'),
      block('Een professioneel gedocumenteerd event produceert: 50–250 professionele foto\'s, korte en langere aftermovies, 10–20 interviewvideo\'s en maanden aan LinkedIn-content.'),
      h2('Interviews als speerpunt'),
      block('Sprekers en deelnemers zijn aanwezig en bereid kort wat te delen. Dit creëert autoriteit zonder extra productiedagen. Je hebt de experts al in de zaal — gebruik ze.'),
      h2('Praktische voorbereiding'),
      block('Het verschil zit in voorbereiding: bepaal welke verhalen je wilt ophalen, wie je interviewt, welke formats je nodig hebt en waar de content gebruikt wordt.'),
      h2('Distributie over weken'),
      block('Content verspreidt zich over weken: week 1 aftermovie, week 2–3 clips en quotes, week 4 recap. Één event, een maand aan content.'),
      h2('De fundamentele vraag'),
      block('In plaats van "wat leggen we vast?" te denken, vraag je: "welke content gaan we maken?" Een fundamenteel verschil dat het rendement van je event verveelvoudigt.'),
    ],
  },
  {
    title: 'Sprekers interviewen op je congres: zo doe je dat',
    slug: 'sprekers-interviewen-op-je-congres',
    publishedAt: '2026-03-25T09:00:00Z',
    excerpt: 'Een congres bevat enorm veel kennis en verhalen die na het event verloren gaan. Door sprekers te interviewen creëer je herbruikbare content voor maanden daarna.',
    readTime: 4,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-84-1-scaled.jpg',
    imageFilename: 'eventshoot-84-1-scaled.jpg',
    imageAlt: 'Sprekers interview tijdens congres',
    body: [
      block('Een congres bevat veel kennis en verhalen die verloren gaan na het event. Door sprekers te interviewen creëer je herbruikbare content voor maanden daarna — voor LinkedIn-video\'s, website-citaten, nieuwsbrieven en promotie van toekomstige evenementen.'),
      h2('Zo pak je het goed aan'),
      bold('1. Voorbereiding van vragen'),
      block('Bepaal vooraf wat je wilt bereiken en werk met 3–5 scherpe vragen. Vermijd standaardvragen; kies voor vragen over vakgebied-ontwikkelingen en praktische inzichten.'),
      bold('2. Gebruik de event-energie'),
      block('Film in de zaal met het publiek op de achtergrond (onscherp). Dit geeft rust in beeld maar wel de dynamiek van het event.'),
      bold('3. Compactheid'),
      block('Stuur aan op 30–90 seconden per antwoord met één inzicht per vraag. Korte antwoorden zijn directer bruikbaar op social media.'),
      bold('4. Ontspannen sfeer'),
      block('Een ontspannen spreker geeft betere antwoorden. Begin informeel, stel een makkelijke vraag als icebreaker.'),
      bold('5. Technische basis'),
      block('Zorg voor helder geluid, stabiel beeld en goede kadrering. Slechte audio is een dealbreaker — zelfs bij goede inhoud.'),
      h2('De grootste fout'),
      block('Veel event-interviews worden ad-hoc uitgevoerd zonder plan. Slechte setting, rommelige beelden en weinig bruikbare output zijn het gevolg. Goede interviews ontstaan door voorbereiding, niet door toeval.'),
      h2('Het grote voordeel'),
      block('Een event biedt directe toegang tot experts voor meerdere interviews achter elkaar — veel efficiënter dan studio-opnames op een andere dag. Gebruik die kans.'),
    ],
  },
  {
    title: 'Hoe kies je de juiste congresfotograaf voor jouw event?',
    slug: 'congresfotograaf-kiezen',
    publishedAt: '2026-03-21T09:00:00Z',
    excerpt: 'Veel organisaties kijken alleen op prijs of beschikbaarheid. Maar de fotograaf is bepalend voor hoe jouw event achteraf wordt waargenomen. Dit zijn de zeven criteria.',
    readTime: 5,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-89-1-scaled.jpg',
    imageFilename: 'eventshoot-89-1-scaled.jpg',
    imageAlt: 'Congresfotograaf kiezen voor zakelijk event',
    body: [
      block('Organisaties kijken vaak alleen op prijs of beschikbaarheid bij het kiezen van een congresfotograaf. Maar de fotograaf is bepalend voor hoe jouw event achteraf wordt waargenomen.'),
      h2('Zeven selectiecriteria'),
      bold('1. Ervaring met congressen'),
      block('Kennis van seminars, vermogen om met lastige lichtomstandigheden om te gaan en een sterk gevoel voor timing zijn onmisbaar.'),
      bold('2. Begrip van doelstellingen'),
      block('De fotograaf moet vragen stellen over LinkedIn-zichtbaarheid, interne communicatie en leadgeneratie — niet alleen over het aantal foto\'s.'),
      bold('3. Oog voor interactie'),
      block('Vastleggen van publieksreacties, breaks en netwerkmomenten. Het zijn vaak deze beelden die het meest gedeeld worden.'),
      bold('4. Representativiteit en regie'),
      block('De fotograaf moet professioneel, toegankelijk en initiatief nemend zijn — bijvoorbeeld bij het organiseren van groepsfoto\'s.'),
      bold('5. Snelheid van levering'),
      block('Eerste beelden binnen 24–48 uur voor directe social media inzet. Vraag altijd naar de standaard levertijd.'),
      bold('6. Consistente stijl'),
      block('Het portfolio moet consistent zijn in kleur, compositie en een herkenbare visuele taal. Losse goede foto\'s zijn niet genoeg.'),
      bold('7. Meedenken'),
      block('Professionele input over timing, kansen en belangrijke personen. Een goede fotograaf is een strategische partner, geen uitvoerder.'),
      h2('De veelgemaakte fout'),
      block('Fotografie wordt vaak te laat in de planning betrokken. Beter is vooraf bepalen wat je wilt laten zien en hoe de beelden gebruikt worden.'),
    ],
  },
  {
    title: 'Waarom een content checklist onmisbaar is tijdens je zakelijke event',
    slug: 'content-checklist-zakelijk-event',
    publishedAt: '2026-03-19T09:00:00Z',
    excerpt: 'Locatie, sprekers, catering — dat regel je allemaal. Maar welke content wil je uit het event halen? Dat wordt te vaak over het hoofd gezien. Met grote gevolgen.',
    readTime: 3,
    imageUrl: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-81-1-scaled.jpg',
    imageFilename: 'eventshoot-81-1-scaled.jpg',
    imageAlt: 'Content checklist voor zakelijk event',
    body: [
      block('Organiseren van zakelijke events vereist aandacht voor vele details: locatie, sprekers, programma, techniek en catering. Maar één cruciaal aspect wordt vaak over het hoofd gezien: welke content wil je uit het event halen?'),
      h2('Je event is een kans, geen moment'),
      block('Veel organisaties beschouwen content als iets voor achteraf. Dit leidt tot gemiste momenten, geen interviews, geen duidelijke verhaallijn en content met minimale waarde.'),
      h2('Wat hoort er minimaal in een goede checklist'),
      bold('1. Sfeer en overzicht'),
      block('Zaalopbouw, publiek, interactie en volle momenten. De sfeer verkoopt de volgende editie.'),
      bold('2. Sprekers en inhoud'),
      block('Sprekers op podium, close-ups, reacties uit de zaal. Dit zijn de inhoudelijke ankers van je content.'),
      bold('3. Netwerkmomenten'),
      block('Gesprekken, ontmoetingen, spontane interactie. Juist deze beelden maken een event menselijk.'),
      bold('4. Detailshots'),
      block('Branding, locatie, catering, badges. Kleine details die de beleving compleet maken.'),
      bold('5. Interviews'),
      block('Korte reacties van deelnemers, inzichten van sprekers, bruikbare quotes voor LinkedIn en je website.'),
      h2('Van event naar contentmachine'),
      block('Één event kan opleveren: foto\'s voor LinkedIn, korte video\'s, een aftermovie, website-interviews en content voor toekomstige events.'),
      h2('Conclusie'),
      block('Een event duurt één dag, maar de content kan maanden werken. Een content checklist is essentieel voor voorbereiding en helpt niets te missen. Geen checklist = reactief werken. Wel checklist = regie houden.'),
    ],
  },
]

// ─── Import uitvoeren ──────────────────────────────────────────────────────────

async function run() {
  console.log(`\n🚀 Artikelen importeren naar Sanity (project: ${PROJECT_ID})...\n`)

  for (const post of posts) {
    console.log(`📝 "${post.title}"`)

    const existing = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]._id`,
      { slug: post.slug }
    )
    if (existing) {
      console.log(`  ⏭  Al aanwezig, overgeslagen.\n`)
      continue
    }

    let mainImage = null
    if (post.imageUrl) {
      try {
        const asset = await uploadImage(post.imageUrl, post.imageFilename)
        mainImage = { ...asset, alt: post.imageAlt }
      } catch (err) {
        console.warn(`  ⚠  Afbeelding niet geüpload: ${err.message}`)
      }
    }

    await client.create({
      _type: 'blogPost',
      language: 'nl',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      publishedAt: post.publishedAt,
      excerpt: post.excerpt,
      readTime: post.readTime,
      body: post.body,
      ...(mainImage && { mainImage }),
    })

    console.log(`  ✅  Aangemaakt.\n`)
  }

  console.log('✨ Import klaar!\n')
}

run().catch(err => {
  console.error('❌ Fout tijdens import:', err.message)
  process.exit(1)
})
