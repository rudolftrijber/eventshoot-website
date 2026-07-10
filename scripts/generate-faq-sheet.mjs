/**
 * Genereert FAQ-importsheet voor Sanity Studio.
 * Run: node scripts/generate-faq-sheet.mjs
 */

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../data/FAQ-import-eventshoot.csv')

const faqs = [
  // ── HOME (6) ──────────────────────────────────────────────────────────────
  {
    page: 'home', category: 'algemeen', order: 1,
    qNl: 'Wat levert professionele eventcontent concreet op na mijn event?',
    aNl: 'Eén event levert 25+ kant-en-klare items op: foto\'s, aftermovies en interviews in de formaten die je marketeer direct kan plaatsen. Je haalt maanden content uit één productiedag, terwijl het event nog vers in het geheugen zit.',
    qEn: 'What does professional event content deliver after my event?',
    aEn: 'One event yields 25+ ready-to-use items: photos, aftermovies and interviews in formats your marketing team can publish directly. You get months of content from a single production day, while the event is still top of mind.',
  },
  {
    page: 'home', category: 'algemeen', order: 2,
    qNl: 'Voor welke soorten events werkt Eventshoot.nl het best?',
    aNl: 'Eventshoot.nl is gespecialiseerd in zakelijke events: congressen, conferenties, ledendagen, seminars en bedrijfsbijeenkomsten. Informele feesten en consumentenevents vallen buiten onze focus.',
    qEn: 'Which types of events is Eventshoot.nl best suited for?',
    aEn: 'Eventshoot.nl specialises in corporate events: congresses, conferences, member days, seminars and business meetings. Informal parties and consumer events are outside our focus.',
  },
  {
    page: 'home', category: 'algemeen', order: 3,
    qNl: 'Hoe snel is de content klaar na afloop?',
    aNl: 'Standaard binnen 48 uur na het event. Same-day levering is mogelijk als add-on. Zo kan je marketeer posten terwijl deelnemers het event nog bespreken op LinkedIn.',
    qEn: 'How quickly is the content ready after the event?',
    aEn: 'Standard delivery within 48 hours after the event. Same-day delivery is available as an add-on. Your marketing team can post while attendees are still discussing the event on LinkedIn.',
  },
  {
    page: 'home', category: 'algemeen', order: 4,
    qNl: 'Gebruikt Eventshoot.nl AI voor de beelden?',
    aNl: 'Nee. Alles wat je krijgt is echt opgenomen op jouw event, met echte mensen en professionele apparatuur. AI wordt alleen gebruikt in de nabewerking, zoals selectie, transcriptie en ondertiteling.',
    qEn: 'Does Eventshoot.nl use AI for the visuals?',
    aEn: 'No. Everything you receive is genuinely recorded at your event, with real people and professional equipment. AI is only used in post-production, such as selection, transcription and subtitling.',
  },
  {
    page: 'home', category: 'algemeen', order: 5,
    qNl: 'Moet mijn organisatie iemand hebben die de content uitrolt?',
    aNl: 'Ja, dat werkt het best. Eventshoot.nl produceert, jij plaatst. Een marketeer, communicatiemedewerker of social media-manager die de content op LinkedIn, je website en in je nieuwsbrief zet, is de ideale fit.',
    qEn: 'Does my organisation need someone to publish the content?',
    aEn: 'Yes, that works best. Eventshoot.nl produces, you publish. A marketer, communications officer or social media manager who posts on LinkedIn, your website and newsletter is the ideal fit.',
  },
  {
    page: 'home', category: 'algemeen', order: 6,
    qNl: 'Werken jullie door heel Nederland?',
    aNl: 'Ja. Eventshoot.nl is actief door heel Nederland. Reis- en transportkosten worden separaat berekend en vooraf besproken.',
    qEn: 'Do you work throughout the Netherlands?',
    aEn: 'Yes. Eventshoot.nl is active throughout the Netherlands. Travel and transport costs are calculated separately and discussed in advance.',
  },

  // ── EVENTFOTOGRAFIE (6) ───────────────────────────────────────────────────
  {
    page: 'eventfotografie', category: 'eventfotografie', order: 1,
    qNl: 'Hoeveel foto\'s ontvang ik na een event?',
    aNl: 'Afhankelijk van het pakket ontvang je 100 tot 300 bewerkte foto\'s. Het Highlight-pakket levert 100–150 foto\'s, Headline 150–200 en Heroes 200–300. Allemaal kant-en-klaar voor direct gebruik.',
    qEn: 'How many photos do I receive after an event?',
    aEn: 'Depending on the package you receive 100 to 300 edited photos. The Highlight package delivers 100–150 photos, Headline 150–200 and Heroes 200–300. All ready for immediate use.',
  },
  {
    page: 'eventfotografie', category: 'eventfotografie', order: 2,
    qNl: 'In welke formaten worden de foto\'s geleverd?',
    aNl: 'Horizontaal voor je website, 4:5 voor LinkedIn en verticaal voor Stories en Reels. Je marketeer hoeft niets meer bij te snijden of te formatteren.',
    qEn: 'In which formats are the photos delivered?',
    aEn: 'Horizontal for your website, 4:5 for LinkedIn and vertical for Stories and Reels. Your marketing team does not need to crop or reformat anything.',
  },
  {
    page: 'eventfotografie', category: 'eventfotografie', order: 3,
    qNl: 'Valt de fotograaf op tijdens het event?',
    aNl: 'Nee. Rolf werkt discreet en zelfstandig. Hij kent het programma, stemt vooraf af met locatie en techniek, en legt de sleutelmomenten vast zonder in de weg te lopen.',
    qEn: 'Is the photographer obtrusive during the event?',
    aEn: 'No. Rolf works discreetly and independently. He knows the programme, aligns with the venue and AV team in advance, and captures key moments without getting in the way.',
  },
  {
    page: 'eventfotografie', category: 'eventfotografie', order: 4,
    qNl: 'Kunnen jullie ook een groepsfoto regelen?',
    aNl: 'Ja. Groepsfoto-momenten worden vooraf afgestemd, inclusief timing en locatie op het programma. Rolf schakelt makkelijk tussen technici en directiekamer.',
    qEn: 'Can you also arrange a group photo?',
    aEn: 'Yes. Group photo moments are agreed in advance, including timing and location on the programme. Rolf moves easily between technical staff and boardroom level.',
  },
  {
    page: 'eventfotografie', category: 'eventfotografie', order: 5,
    qNl: 'Wat als het podium donker is of de slides slecht leesbaar zijn?',
    aNl: 'Dat bespreken we vooraf met locatie en techniek. Backdrop, podiumlicht en presentatieformat worden doorgenomen voordat de eerste gast binnenkomt. Geen toeval, wel verschil.',
    qEn: 'What if the stage is dark or slides are hard to read?',
    aEn: 'We discuss this in advance with the venue and AV team. Backdrop, stage lighting and presentation format are reviewed before the first guest arrives. No guesswork.',
  },
  {
    page: 'eventfotografie', category: 'eventfotografie', order: 6,
    qNl: 'Kan ik foto en video combineren in één opdracht?',
    aNl: 'Ja. De pakketten Headline en Heroes combineren foto en video standaard. Liever alleen foto? Dat kan ook. Bekijk de pakketten op de tarievenpagina of plan een kennismaking.',
    qEn: 'Can I combine photo and video in one assignment?',
    aEn: 'Yes. The Headline and Heroes packages combine photo and video as standard. Prefer photo only? That is possible too. See the packages on the pricing page or schedule an introductory call.',
  },

  // ── EVENTVIDEO (6) ───────────────────────────────────────────────────────
  {
    page: 'eventvideo', category: 'eventvideo', order: 1,
    qNl: 'Welke soorten eventvideo\'s maakt Eventshoot.nl?',
    aNl: 'Social aftermovies (45–90 sec voor LinkedIn), corporate aftermovies (90–180 sec voor je website), event interviews met sprekers en deelnemers, en event promotievideo\'s voor de volgende editie.',
    qEn: 'What types of event videos does Eventshoot.nl produce?',
    aEn: 'Social aftermovies (45–90 sec for LinkedIn), corporate aftermovies (90–180 sec for your website), event interviews with speakers and attendees, and event promo videos for the next edition.',
  },
  {
    page: 'eventvideo', category: 'eventvideo', order: 2,
    qNl: 'Hoe lang duurt een aftermovie?',
    aNl: 'De social aftermovie duurt 45–90 seconden, ideaal voor LinkedIn. Het Headline- en Heroes-pakket leveren daarnaast een corporate aftermovie van 90–180 seconden voor je website.',
    qEn: 'How long is an aftermovie?',
    aEn: 'The social aftermovie runs 45–90 seconds, ideal for LinkedIn. The Headline and Heroes packages also include a corporate aftermovie of 90–180 seconds for your website.',
  },
  {
    page: 'eventvideo', category: 'eventvideo', order: 3,
    qNl: 'Zitten ondertitels standaard inbegrepen?',
    aNl: 'Ja. AI-ondertiteling zit in alle pakketten inbegrepen. Human ondertiteling (98% correct) is beschikbaar als add-on voor Headline en Heroes.',
    qEn: 'Are subtitles included as standard?',
    aEn: 'Yes. AI subtitling is included in all packages. Human subtitling (98% accuracy) is available as an add-on for Headline and Heroes.',
  },
  {
    page: 'eventvideo', category: 'eventvideo', order: 4,
    qNl: 'Hoeveel interviews kan ik verwachten?',
    aNl: 'In het Headline-pakket 10–15 één-camera interviews, in Heroes 25–30. Ideaal voor quotes op LinkedIn en content voor je volgende editie.',
    qEn: 'How many interviews can I expect?',
    aEn: 'The Headline package includes 10–15 single-camera interviews, Heroes 25–30. Ideal for LinkedIn quotes and content for your next edition.',
  },
  {
    page: 'eventvideo', category: 'eventvideo', order: 5,
    qNl: 'Kan ik de video dezelfde dag nog online zetten?',
    aNl: 'Ja, same-day levering is mogelijk als add-on (vanaf € 425 afhankelijk van pakket). Handig als je direct na afloop wilt posten op social media.',
    qEn: 'Can I publish the video on the same day?',
    aEn: 'Yes, same-day delivery is available as an add-on (from € 425 depending on package). Useful if you want to post on social media immediately after the event.',
  },
  {
    page: 'eventvideo', category: 'eventvideo', order: 6,
    qNl: 'Wie bepaalt wat er in de video komt?',
    aNl: 'Dat stemmen we vooraf af in de pre-production meeting. Jij geeft aan welke momenten, sprekers en sfeer belangrijk zijn. Daarna werkt Rolf zelfstandig op locatie.',
    qEn: 'Who decides what goes into the video?',
    aEn: 'We align this in advance during the pre-production meeting. You indicate which moments, speakers and atmosphere matter. Rolf then works independently on site.',
  },

  // ── BRANCHEVERENIGINGEN (6) ───────────────────────────────────────────────
  {
    page: 'voor-brancheverenigingen', category: 'voor-wie', order: 1,
    qNl: 'Wij organiseren maar twee events per jaar. Is dat genoeg voor een samenwerking?',
    aNl: 'Jazeker. Eventshoot.nl werkt ook voor verenigingen met minder frequente events. We bespreken vooraf wat je nodig hebt en stemmen het aanbod daarop af.',
    qEn: 'We only organise two events per year. Is that enough for a partnership?',
    aEn: 'Absolutely. Eventshoot.nl also works with associations that hold events less frequently. We discuss your needs in advance and tailor the offer.',
  },
  {
    page: 'voor-brancheverenigingen', category: 'voor-wie', order: 2,
    qNl: 'Kunnen jullie content leveren die onze ledenwerving ondersteunt?',
    aNl: 'Ja. Professionele beelden van echte ledendagen en jaarcongressen laten zien wat lidmaatschap waard is. Foto\'s en video\'s zijn klaar voor je website, nieuwsbrief en social media.',
    qEn: 'Can you deliver content that supports our member recruitment?',
    aEn: 'Yes. Professional visuals from real member days and annual congresses show the value of membership. Photos and videos are ready for your website, newsletter and social media.',
  },
  {
    page: 'voor-brancheverenigingen', category: 'voor-wie', order: 3,
    qNl: 'Kunnen jullie ook interviews met sprekers of leden verzorgen?',
    aNl: 'Ja. Op aanvraag verzorg ik korte interviewopnames met sprekers, bestuurders of leden, als aanvulling op de eventreportage.',
    qEn: 'Can you also conduct interviews with speakers or members?',
    aEn: 'Yes. On request I produce short interview recordings with speakers, board members or members, as a supplement to the event coverage.',
  },
  {
    page: 'voor-brancheverenigingen', category: 'voor-wie', order: 4,
    qNl: 'Hoe snel ontvangen we het materiaal na ons jaarcongres?',
    aNl: 'Standaard binnen 48 uur. Same-day levering is ook mogelijk, ideaal als je snel iets op social media wilt zetten terwijl het congres nog trending is.',
    qEn: 'How quickly do we receive the material after our annual congress?',
    aEn: 'Standard delivery within 48 hours. Same-day delivery is also possible, ideal if you want to post on social media while the congress is still trending.',
  },
  {
    page: 'voor-brancheverenigingen', category: 'voor-wie', order: 5,
    qNl: 'Werken jullie samen met onze vaste AV-partner op locatie?',
    aNl: 'Ja. Backdrop, podiumlicht, presentatieformat en interviewlocatie worden vooraf afgestemd met techniek. Rolf schakelt soepel met technische teams.',
    qEn: 'Do you work with our regular AV partner on site?',
    aEn: 'Yes. Backdrop, stage lighting, presentation format and interview location are agreed in advance with the AV team. Rolf works smoothly with technical crews.',
  },
  {
    page: 'voor-brancheverenigingen', category: 'voor-wie', order: 6,
    qNl: 'Wat als ons budget beperkt is?',
    aNl: 'Neem contact op voor een eerlijk gesprek. Ik denk graag mee in wat haalbaar is, zodat je toch professionele content overhoudt van je belangrijkste event.',
    qEn: 'What if our budget is limited?',
    aEn: 'Get in touch for an honest conversation. I am happy to think along about what is feasible, so you still get professional content from your most important event.',
  },

  // ── EVENTBUREAUS (6) ──────────────────────────────────────────────────────
  {
    page: 'voor-eventbureaus', category: 'voor-wie', order: 1,
    qNl: 'Kunnen jullie als vaste content-partner achter de schermen werken?',
    aNl: 'Ja. Eventshoot.nl is gebouwd voor bureaus die een betrouwbare partner zoeken event na event. Ik lees het runsheet, werk zelfstandig en lever wat jij en je klant nodig hebben.',
    qEn: 'Can you work as a fixed content partner behind the scenes?',
    aEn: 'Yes. Eventshoot.nl is built for agencies looking for a reliable partner event after event. I read the run sheet, work independently and deliver what you and your client need.',
  },
  {
    page: 'voor-eventbureaus', category: 'voor-wie', order: 2,
    qNl: 'Leveren jullie white-label, zonder Eventshoot.nl branding?',
    aNl: 'Ja. Op aanvraag lever ik content zonder eigen branding, zodat je het onder de naam van jouw bureau aan je klant kunt presenteren.',
    qEn: 'Do you deliver white-label, without Eventshoot.nl branding?',
    aEn: 'Yes. On request I deliver content without my own branding, so you can present it to your client under your agency name.',
  },
  {
    page: 'voor-eventbureaus', category: 'voor-wie', order: 3,
    qNl: 'Hoe kort van tevoren kunnen jullie ingepland worden?',
    aNl: 'Dat hangt van de agenda af. Neem zo vroeg mogelijk contact op, maar bel gerust last-minute: 06 251 777 28. Ik doe mijn best als het kan.',
    qEn: 'How late can you still be booked?',
    aEn: 'That depends on the calendar. Contact me as early as possible, but call for last-minute requests: +31 6 251 777 28. I do my best when it is possible.',
  },
  {
    page: 'voor-eventbureaus', category: 'voor-wie', order: 4,
    qNl: 'Moet ik een uitgebreide briefing schrijven?',
    aNl: 'Nee. Een kort vooroverleg en het runsheet zijn meestal genoeg. Ik snap hoe de eventwereld werkt en vind mijn weg op locatie.',
    qEn: 'Do I need to write an extensive briefing?',
    aEn: 'No. A short pre-meeting and the run sheet are usually enough. I understand how the events world works and find my way on site.',
  },
  {
    page: 'voor-eventbureaus', category: 'voor-wie', order: 5,
    qNl: 'Kunnen jullie same-day highlights leveren voor de klant?',
    aNl: 'Ja. Same-day levering is beschikbaar als add-on. Ideaal als je klant direct na afloop content wil op social media.',
    qEn: 'Can you deliver same-day highlights for the client?',
    aEn: 'Yes. Same-day delivery is available as an add-on. Ideal if your client wants content on social media immediately after the event.',
  },
  {
    page: 'voor-eventbureaus', category: 'voor-wie', order: 6,
    qNl: 'Werken jullie ook buiten Nederland?',
    aNl: 'Ja. Ik werk door heel Nederland en op aanvraag ook in het buitenland. Reiskosten worden separaat berekend.',
    qEn: 'Do you also work outside the Netherlands?',
    aEn: 'Yes. I work throughout the Netherlands and abroad on request. Travel costs are calculated separately.',
  },

  // ── HOTELS (6) ────────────────────────────────────────────────────────────
  {
    page: 'voor-hotels', category: 'voor-wie', order: 1,
    qNl: 'Waarom hebben wij als hotel content van echte events nodig?',
    aNl: 'Lege zalen verkopen geen events. Authentieke beelden van echte congressen laten eventplanners zien wat jouw locatie kan als er mensen in de zaal zitten. Dat werkt sterker dan studiofoto\'s zonder publiek.',
    qEn: 'Why do we as a hotel need content from real events?',
    aEn: 'Empty rooms do not sell events. Authentic visuals from real congresses show event planners what your venue can do with people in the room. That works better than studio shots without an audience.',
  },
  {
    page: 'voor-hotels', category: 'voor-wie', order: 2,
    qNl: 'Moeten wij toestemming vragen aan de eventorganisator?',
    aNl: 'Dat regelen we vooraf samen. In de meeste gevallen volstaat een korte melding aan de organisator. Ik werk altijd discreet en professioneel.',
    qEn: 'Do we need permission from the event organiser?',
    aEn: 'We arrange that together in advance. In most cases a brief notice to the organiser is sufficient. I always work discreetly and professionally.',
  },
  {
    page: 'voor-hotels', category: 'voor-wie', order: 3,
    qNl: 'Hoe vaak kunnen we jullie inzetten?',
    aNl: 'Dat bepaal je zelf. Per event schakelen kan, maar een vaste samenwerking bij terugkerende congressen geeft doorlopende marketingbeelden van je faciliteiten.',
    qEn: 'How often can we use your services?',
    aEn: 'That is up to you. Booking per event is possible, but a fixed partnership for recurring congresses provides ongoing marketing visuals of your facilities.',
  },
  {
    page: 'voor-hotels', category: 'voor-wie', order: 4,
    qNl: 'Mag de eventorganisator de content ook gebruiken?',
    aNl: 'Dat bespreken we vooraf. Het is mogelijk om content te delen met beide partijen. In dat geval stemmen we de rechten en het gebruik af.',
    qEn: 'Can the event organiser also use the content?',
    aEn: 'We discuss that in advance. It is possible to share content with both parties. In that case we agree on rights and usage.',
  },
  {
    page: 'voor-hotels', category: 'voor-wie', order: 5,
    qNl: 'Leveren jullie ook video naast foto?',
    aNl: 'Ja. Foto en video kunnen gecombineerd worden, zodat je voor website, social media en salesmateriaal het juiste formaat hebt.',
    qEn: 'Do you also deliver video in addition to photo?',
    aEn: 'Yes. Photo and video can be combined, so you have the right format for your website, social media and sales materials.',
  },
  {
    page: 'voor-hotels', category: 'voor-wie', order: 6,
    qNl: 'Kunnen jullie ook onze lege vergaderzalen professioneel fotograferen?',
    aNl: 'Onze focus ligt op events met publiek en sfeer. Voor lege zaalfoto\'s kun je beter een interieurfotograaf inschakelen. Tijdens echte events leg ik je ruimte op z\'n best vast.',
    qEn: 'Can you also photograph our empty meeting rooms professionally?',
    aEn: 'Our focus is on events with audience and atmosphere. For empty room shots an interior photographer is a better fit. During real events I capture your space at its best.',
  },

  // ── BEDRIJVEN (6) ─────────────────────────────────────────────────────────
  {
    page: 'voor-bedrijven', category: 'voor-wie', order: 1,
    qNl: 'Wij organiseren één user conference per jaar. Is dat genoeg?',
    aNl: 'Absoluut. Juist dan is het belangrijk dat je er alles uithaalt. Eén productiedag levert een contentbox waar je marketeer maanden mee vooruit kan: foto\'s, aftermovie, interviews en social cuts.',
    qEn: 'We organise one user conference per year. Is that enough?',
    aEn: 'Absolutely. That is exactly when it matters to get everything out of it. One production day delivers a content box your marketing team can use for months: photos, aftermovie, interviews and social cuts.',
  },
  {
    page: 'voor-bedrijven', category: 'voor-wie', order: 2,
    qNl: 'Onze marketeer heeft weinig tijd na het event. Hoe helpt Eventshoot.nl?',
    aNl: 'Alle content wordt kant-en-klaar geleverd in de juiste formaten. Geen extra nabewerking nodig, direct te plaatsen op LinkedIn, je website en in je nieuwsbrief.',
    qEn: 'Our marketer has little time after the event. How does Eventshoot.nl help?',
    aEn: 'All content is delivered ready-to-use in the right formats. No extra editing needed, publish directly on LinkedIn, your website and in your newsletter.',
  },
  {
    page: 'voor-bedrijven', category: 'voor-wie', order: 3,
    qNl: 'Kunnen jullie interviews met klanten of sprekers verzorgen?',
    aNl: 'Ja. Het Headline-pakket bevat 10–15 interviews, Heroes 25–30. Handig voor testimonials, LinkedIn-posts en content voor je volgende editie.',
    qEn: 'Can you conduct interviews with customers or speakers?',
    aEn: 'Yes. The Headline package includes 10–15 interviews, Heroes 25–30. Useful for testimonials, LinkedIn posts and content for your next edition.',
  },
  {
    page: 'voor-bedrijven', category: 'voor-wie', order: 4,
    qNl: 'Hoe ver van tevoren moeten we boeken?',
    aNl: 'Zo vroeg mogelijk, zeker voor grote events. Neem contact op en we kijken wat de agenda toelaat. Last-minute kan soms ook.',
    qEn: 'How far in advance should we book?',
    aEn: 'As early as possible, especially for large events. Get in touch and we check what the calendar allows. Last-minute is sometimes possible too.',
  },
  {
    page: 'voor-bedrijven', category: 'voor-wie', order: 5,
    qNl: 'Wat is het verschil tussen foto-only en een complete contentbox?',
    aNl: 'Foto-only levert je beelden voor website en social. Een complete contentbox voegt aftermovie, interviews en meerdere social formaten toe. Bekijk de pakketten Highlight, Headline en Heroes op de tarievenpagina.',
    qEn: 'What is the difference between photo-only and a complete content box?',
    aEn: 'Photo-only gives you visuals for website and social. A complete content box adds aftermovie, interviews and multiple social formats. See the Highlight, Headline and Heroes packages on the pricing page.',
  },
  {
    page: 'voor-bedrijven', category: 'voor-wie', order: 6,
    qNl: 'Kunnen we de content ook intern gebruiken?',
    aNl: 'Ja. Foto\'s en video\'s zijn geschikt voor interne communicatie, onboarding, salespresentaties en je jaarverslag.',
    qEn: 'Can we also use the content internally?',
    aEn: 'Yes. Photos and videos are suitable for internal communications, onboarding, sales presentations and your annual report.',
  },

  // ── TARIEVEN (6) ──────────────────────────────────────────────────────────
  {
    page: 'tarieven', category: 'tarieven', order: 1,
    qNl: 'Wat kosten de pakketten?',
    aNl: 'Highlight € 825 (4 uur), Headline € 2.250 (8 uur, meest gekozen) en Heroes € 3.450 (10 uur, foto + video). Alle prijzen excl. BTW. Reis- en transportkosten separaat.',
    qEn: 'What do the packages cost?',
    aEn: 'Highlight € 825 (4 hours), Headline € 2,250 (8 hours, most popular) and Heroes € 3,450 (10 hours, photo + video). All prices excl. VAT. Travel and transport costs separate.',
  },
  {
    page: 'tarieven', category: 'tarieven', order: 2,
    qNl: 'Wat zit standaard inbegrepen bij elk pakket?',
    aNl: 'Een online pre-production meeting, post-production met één correctieronde en AI-ondertiteling op video\'s (met controle op naamweergave). Reisuren, reis- en transportkosten en btw komen daar bovenop.',
    qEn: 'What is included as standard in every package?',
    aEn: 'An online pre-production meeting, post-production with one revision round and AI subtitling on videos (with name display checks). Travel time, travel and transport costs and VAT are additional.',
  },
  {
    page: 'tarieven', category: 'tarieven', order: 3,
    qNl: 'Zitten reiskosten in de prijs?',
    aNl: 'Nee. Reis- en transportkosten worden separaat berekend en vooraf besproken. Eventshoot.nl werkt door heel Nederland.',
    qEn: 'Are travel costs included in the price?',
    aEn: 'No. Travel and transport costs are calculated separately and discussed in advance. Eventshoot.nl works throughout the Netherlands.',
  },
  {
    page: 'tarieven', category: 'tarieven', order: 4,
    qNl: 'Wat zijn de add-ons?',
    aNl: 'Same-day levering (€ 425 / € 650 / € 925), human ondertiteling € 13 per minuut (Headline/Heroes), en event promotievideo op offerte.',
    qEn: 'What are the add-ons?',
    aEn: 'Same-day delivery (€ 425 / € 650 / € 925), human subtitling € 13 per minute (Headline/Heroes), and event promo video on quote.',
  },
  {
    page: 'tarieven', category: 'tarieven', order: 5,
    qNl: 'Zit een correctieronde inbegrepen?',
    aNl: 'Ja. Post-production met één correctieronde zit in alle pakketten inbegrepen.',
    qEn: 'Is a revision round included?',
    aEn: 'Yes. Post-production with one revision round is included in all packages.',
  },
  {
    page: 'tarieven', category: 'tarieven', order: 6,
    qNl: 'Hoe kies ik het juiste pakket?',
    aNl: 'Highlight past bij kleinere events en social-only. Headline is de standaard voor een jaarcongres of ledendag. Heroes is voor hoog-profile congressen met foto én video. Twijfel? Plan een gratis kennismaking van 20 minuten.',
    qEn: 'How do I choose the right package?',
    aEn: 'Highlight suits smaller events and social-only. Headline is the standard for an annual congress or member day. Heroes is for high-profile congresses with photo and video. Unsure? Schedule a free 20-minute introductory call.',
  },

  // ── OVER ROLF (6) ─────────────────────────────────────────────────────────
  {
    page: 'over-rolf', category: 'algemeen', order: 1,
    qNl: 'Wie is Rolf Trijber?',
    aNl: 'Rolf Trijber is eventfotograaf en videograaf met 40+ jaar ervaring in beeldproductie. Hij is gespecialiseerd in zakelijke events door heel Nederland: congressen, conferenties, ledendagen en bedrijfsbijeenkomsten.',
    qEn: 'Who is Rolf Trijber?',
    aEn: 'Rolf Trijber is an event photographer and videographer with 40+ years of experience in visual production. He specialises in corporate events throughout the Netherlands: congresses, conferences, member days and business meetings.',
  },
  {
    page: 'over-rolf', category: 'algemeen', order: 2,
    qNl: 'Werk je alleen of met een team?',
    aNl: 'Rolf is je vaste aanspreekpunt en regisseur op locatie. Voor grotere congressen schakelt hij een vast netwerk van freelancers in: second shooters, videografen en assistenten. Jij hebt één contactpersoon, de productie schaal je mee.',
    qEn: 'Do you work alone or with a team?',
    aEn: 'Rolf is your fixed point of contact and director on site. For larger congresses he brings in a trusted network of freelancers: second shooters, videographers and assistants. You have one contact person, production scales with your event.',
  },
  {
    page: 'over-rolf', category: 'algemeen', order: 3,
    qNl: 'Waarom kiezen klanten voor langetermijnsamenwerking?',
    aNl: 'Eventshoot.nl is gebouwd op vaste relaties, niet op eenmalige klussen. Klanten zoals GBL Alliance werken al jaren samen met Rolf. Doorlopende stijl, kennis van je event en meedenken over opzet en vormgeving maken elk jaar het beeld sterker.',
    qEn: 'Why do clients choose long-term collaboration?',
    aEn: 'Eventshoot.nl is built on lasting relationships, not one-off jobs. Clients such as GBL Alliance have worked with Rolf for years. Consistent style, knowledge of your event and input on setup and design make the visuals stronger every year.',
  },
  {
    page: 'over-rolf', category: 'algemeen', order: 4,
    qNl: 'Wat maakt Rolf anders dan een jonge eventfotograaf?',
    aNl: 'Veertig jaar productie-ervaring zit ingebakken in wat je krijgt. Geen onzekere handen, geen gemiste momenten. Plus het sociale gemak om te schakelen tussen technici en directiekamer.',
    qEn: 'What makes Rolf different from a young event photographer?',
    aEn: 'Forty years of production experience is built into what you receive. No uncertain hands, no missed moments. Plus the social ease to switch between technical staff and the boardroom.',
  },
  {
    page: 'over-rolf', category: 'algemeen', order: 5,
    qNl: 'Ben je ook grafisch vormgever?',
    aNl: 'Ja, Rolf is van origine grafisch vormgever. Compositie, kleur en typografie zitten in elk beeld dat je ontvangt, of het nu een foto, aftermovie of interview is.',
    qEn: 'Are you also a graphic designer?',
    aEn: 'Yes, Rolf originally trained as a graphic designer. Composition, colour and typography are present in every visual you receive, whether photo, aftermovie or interview.',
  },
  {
    page: 'over-rolf', category: 'algemeen', order: 6,
    qNl: 'Hoe neem ik contact op met Rolf?',
    aNl: 'Bel 06 251 777 28, mail rolf@eventshoot.nl of plan een kennismaking via de contactpagina. Rolf reageert persoonlijk, geen callcenter.',
    qEn: 'How do I contact Rolf?',
    aEn: 'Call +31 6 251 777 28, email rolf@eventshoot.nl or schedule an introductory call via the contact page. Rolf responds personally, no call centre.',
  },

  // ── KENNISMAKEN (6) ───────────────────────────────────────────────────────
  {
    page: 'kennismaken', category: 'algemeen', order: 1,
    qNl: 'Hoe snel reageert Rolf?',
    aNl: 'Doorgaans binnen een paar uur op werkdagen. Rolf reageert persoonlijk, geen callcenter.',
    qEn: 'How quickly does Rolf respond?',
    aEn: 'Usually within a few hours on working days. Rolf responds personally, no call centre.',
  },
  {
    page: 'kennismaken', category: 'algemeen', order: 2,
    qNl: 'Wat kost een kennismaking?',
    aNl: 'Een kennismaking is gratis en vrijblijvend. Geen verplichtingen.',
    qEn: 'How much does an introductory call cost?',
    aEn: 'An introductory call is free and without obligation. No commitments.',
  },
  {
    page: 'kennismaken', category: 'algemeen', order: 3,
    qNl: 'Kan ik ook last-minute boeken?',
    aNl: 'Bel direct: 06 251 777 28. Rolf probeert altijd iets te regelen als de agenda het toelaat.',
    qEn: 'Can I book last-minute?',
    aEn: 'Call directly: +31 6 251 777 28. Rolf always tries to arrange something if the calendar allows.',
  },
  {
    page: 'kennismaken', category: 'algemeen', order: 4,
    qNl: 'Wat gebeurt er tijdens een kennismaking van 20 minuten?',
    aNl: 'We bespreken je event, doelgroep, gewenste content en welk pakket past. Daarna weet je of we elkaar liggen en wat de vervolgstap is.',
    qEn: 'What happens during a 20-minute introductory call?',
    aEn: 'We discuss your event, audience, desired content and which package fits. Afterwards you know if we are a good match and what the next step is.',
  },
  {
    page: 'kennismaken', category: 'algemeen', order: 5,
    qNl: 'Kan ik een checklist of onepager downloaden?',
    aNl: 'Ja. Op de homepage kun je een content checklist downloaden. Tijdens de kennismaking stuur ik je ook graag de onepager met pakketten en werkwijze toe.',
    qEn: 'Can I download a checklist or one-pager?',
    aEn: 'Yes. On the homepage you can download a content checklist. During the introductory call I am happy to send you the one-pager with packages and workflow.',
  },
  {
    page: 'kennismaken', category: 'algemeen', order: 6,
    qNl: 'Werkt Rolf door heel Nederland?',
    aNl: 'Ja, Eventshoot.nl is actief door heel Nederland. Reiskosten worden separaat berekend.',
    qEn: 'Does Rolf work throughout the Netherlands?',
    aEn: 'Yes, Eventshoot.nl is active throughout the Netherlands. Travel costs are calculated separately.',
  },
]

const HEADERS = [
  'Actief',
  'Categorie',
  'Tonen op pagina\'s',
  'Volgorde',
  'Vraag (NL)',
  'Antwoord (NL)',
  'Vraag (EN)',
  'Antwoord (EN)',
  'Beeld (optioneel)',
  'Alt-tekst NL',
  'Alt-tekst EN',
]

function esc(val) {
  return `"${String(val ?? '').replace(/"/g, '""')}"`
}

const rows = faqs.map(f => [
  'ja',
  f.category,
  f.page,
  f.order,
  f.qNl,
  f.aNl,
  f.qEn,
  f.aEn,
  '',
  '',
  '',
].map(esc).join(';'))

const csv = '\uFEFF' + HEADERS.map(h => esc(h)).join(';') + '\n' + rows.join('\n')
writeFileSync(OUT, csv, 'utf8')
console.log(`✅ ${faqs.length} FAQ-items geschreven naar:\n   ${OUT}`)
