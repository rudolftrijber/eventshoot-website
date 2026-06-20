CLAUDE.md
This file provides guidance to Claude (in Cursor, Claude Code, or any AI assistant) when working with code in this repository.
Belangrijk: dit document is de single source of truth voor de huidige propositie, content en architectuur. Als je iets bouwt in deze repo, raadpleeg eerst dit document. Als er iets strategisch wijzigt, werk dit document bij vóór je code-wijzigingen doorvoert.

1. Project briefing
Dit project is de nieuwe website voor Eventshoot.nl — de website van Rolf Trijber, eventfotograaf en videograaf in Nederland. Het vervangt op termijn de bestaande WordPress + Elementor-site op https://eventshoot.nl. Tijdens de build blijft de oude site live; de nieuwe komt op een Vercel-preview en gaat pas live als hij compleet is.
Business context

Bedrijf: Eventshoot.nl BV
Eigenaar: Rolf Trijber (eventfotograaf en videograaf, 40+ jaar ervaring in beeldproductie, grafisch vormgever van origine)
Contact: rolf@eventshoot.nl  ·  06 251 777 28  ·  https://www.linkedin.com/in/rolftrijber/
Werkgebied: Heel Nederland
Omzetdoel: € 30k – € 60/k per jaar (bewuste keuze: bijverdienen naast pensioen, kwaliteit boven volume)

Primaire doelgroep (ideale klanten)
In volgorde van strategische prioriteit:

Brancheverenigingen met jaarcongres, ledendag of vakdag
Eventbureaus en DMC's die een vaste content-partner zoeken voor klantevents
Hotels met congresfaciliteiten die preferred-vendor relaties opbouwen
Marketing- en communicatiebureaus die productie graag uitbesteden aan een specialist
Bedrijven met eigen jaarlijkse kennisevents of user conferences

Belangrijk filter: Eventshoot.nl werkt het best als de klantorganisatie een marketeer, communicatiemedewerker of social media-manager heeft die de content uitrolt. Wij produceren, zij plaatsen. Klanten zonder iemand die content kan uitrollen zijn een slechte fit en worden bewust niet als ideale klant aangemerkt.

2. Positionering & motto
Motto (verschijnt op 5 strategische plekken in de site)

"Jouw event is een goudmijn aan content."

Letterlijke formulering. Geen varianten ("Elk event is een goudmijn" of "Een event = een goudmijn aan content" zijn niet toegestaan). Consequent identiek herhalen is wat een tagline kracht geeft.
Plaatsingen:

Home — als H2 in Strook 2 (na de Hero)
Eventfotografie — als motto-strook (brede band) tussen Hero en eerste content-blok
Eventvideo — als motto-strook (identiek aan Eventfotografie)
Over Rolf — als H2 in Strook 1
Footer — klein, onder het logo op elke pagina

Propositie

"Eén event, een complete contentbox."


Eventshoot.nl levert 25+ kant-en-klare foto's, aftermovies en interviews uit jouw zakelijke event. Gemaakt door mensen, geleverd binnen 48 uur.

De drie commerciële beloftes (in deze volgorde)

25+ kant-en-klare items per event — een complete contentbox, geen losse foto-set
Geleverd binnen 48 uur — terwijl het event nog top of mind is
Gefotografeerd en gefilmd door mensen — geen AI-gegenereerde beelden, geen stockmateriaal

Authenticiteits-claim ("Mensen, geen AI")
Eventshoot.nl gebruikt geen AI-gegenereerde video of stockbeelden. Alles wat de klant krijgt is echt opgenomen op het event, met echte mensen en professionele apparatuur. AI ondersteunt de nabewerking (selectie, transcriptie, ondertiteling, formatteren naar 25+ items in alle gewenste verhoudingen). Voor de beelden zelf: mensen.
Dit is een commercieel onderscheid, geen filosofische stellingname. Terwijl de markt overspoeld wordt met AI-gegenereerde content, positioneert Eventshoot.nl zich als de partij die écht in de zaal staat. Belangrijke implicatie: NOOIT AI-stockfoto's gebruiken in mockups, demo's, hero-images of placeholder-content. Altijd echte event-foto's uit /public/ (of als die ontbreken: een grijze placeholder met "echte foto volgt").
Toon & stijl
Professioneel, direct, geen poespas. Vermijd marketingjargon. Gebruik concrete cijfers waar mogelijk (25+, 48 uur, 4 of 8 uur aanwezigheid). Schrijf in tweede persoon ("Je marketeer..."). Senioriteit blijkt uit het werk, niet uit de uitspraken — vermijd zelfverklarende lof.
Schrijfregels voor alle pagina's:

Gebruik komma's, geen em-dashes (—). Em-dashes vervangen door komma's of door bijwoorden ("zoals", "met") zodat zinnen natuurlijk lezen.
"Eventshoot.nl" altijd met hoofdletter (in body-tekst), behalve in URL's en e-mailadressen (lowercase).
Motto altijd letterlijk: "Jouw event is een goudmijn aan content."


3. De vier USP's (één-keer-schrijven, vier-keer-plaatsen)
Deze vier USP-blokken komen identiek terug op Home, Eventfotografie, Portfolio/Werk en Tarieven. Eén component (UspGrid4) dat overal opnieuw wordt gebruikt.
USP 1 — 40+ jaar ervaring

Senioriteit als productiekracht. Veertig jaar in beeldproductie zit ingebakken in wat je krijgt. Geen onzekere handen, geen gemiste momenten. Een scherp oog voor wat zich aandient, en het sociale gemak om in twee tonen te schakelen: de taal van technici én die van de directiekamer.

USP 2 — Mensen, geen AI

Eventshoot.nl gebruikt geen AI-gegenereerde video of stockbeelden. Alles wat je krijgt is echt opgenomen op jouw event, met echte mensen en professionele apparatuur. Voor de nabewerking, zoals selectie, transcriptie en ondertiteling, gebruiken we AI. Voor de beelden zelf, mensen.

USP 3 — Vooraf afgestemd met de locatie

Backdrop, beeldwand, podiumlicht, presentatieformat, groepsfoto-moment en interviewlocatie worden samen met techniek doorgenomen voordat de eerste gast binnenkomt. Dia's met een donkere achtergrond in plaats van andersom, beter voor de deelnemers én voor het beeld. Geen toeval, wel verschil.

USP 4 — Geleverd binnen 48 uur

Je bestanden zijn binnen twee dagen klaar voor je marketeer, terwijl het event nog vers in het geheugen zit. In de juiste formaten voor elk kanaal: horizontaal voor de website, 4:5 voor LinkedIn en verticaal voor Stories en Reels. Geen extra nabewerking nodig, direct te plaatsen.


4. Site-structuur
Top-navigatie (6 items + 1 CTA-knop)
Drie dropdowns plus drie directe items, plus de Kennismaken-knop in afwijkende kleur rechts.
Diensten ▾      Voor wie ▾                          Werk    Tarieven    Over ▾           [Kennismaken]
├ Eventfotografie  ├ Brancheverenigingen                                  ├ Over Rolf
└ Eventvideo       ├ Eventbureaus & DMC's                                 └ Eventkennis
                   ├ Hotels met congresfaciliteiten
                   └ Bedrijven met eigen events
URL-structuur is flat — /eventfotografie/ niet /diensten/eventfotografie/. Dropdown is alleen een visueel mechanisme, URL's blijven onafhankelijk.
Telefoonregel boven de header
"Vragen? Bel Rolf — 06 251 777 28" → tel:+31625177728
Sitemap (alle pagina's, gegroepeerd)
#HoofdmenuSub-paginaURLDoel1(Logo)Home/Conversie-anker2Diensten ▾Eventfotografie/eventfotografie/Service-landing3Eventvideo/eventvideo/Service-landing4Voor wie ▾Brancheverenigingen/voor/brancheverenigingen/Outreach-landing5Eventbureaus & DMC's/voor/eventbureaus/Outreach-landing6Hotels met congresfaciliteiten/voor/hotels/Outreach-landing7Bedrijven met eigen events/voor/bedrijven/Outreach-landing8WerkOverview + case-detail templates/werk/Bewijs / portfolio9Tarieven—/tarieven/Conversie10Over ▾Over Rolf/over-rolf/Vertrouwen11Eventkennis/eventkennis/AI-vindbaarheid (knowledge base)12Kennismaken (CTA)—/kennismaken/Conversie13(Footer)Privacy & Disclaimer/privacy/Juridisch
Dynamische pagina-templates:

/werk/{case-slug}/ — case detail (gevuld via Sanity of statisch)
/eventkennis/{artikel-slug}/ — artikel detail (gevuld via Sanity)

Footer (vier kolommen)
Kolom 1: Brand + contactKolom 2: Pagina'sKolom 3: Voor wieKolom 4: Eventkennis (dynamisch)LogoEventfotografieBrancheverenigingen5 meest recente artikelenMottoEventvideoEventbureaus & DMC's"Alle artikelen →"📞 06 251 777 28WerkHotels✉ rolf@eventshoot.nlTarievenBedrijven[LinkedIn]Over RolfKennismaken
Bottom bar (donker, kleine letters): © Eventshoot.nl BV — 2026 · Privacy & Disclaimer · Algemene voorwaarden (PDF) · KvK · BTW

5. Pagina-content per pagina
Per pagina staan hier de exacte H1, sub-tekst, meta-tags en componenten in volgorde. Houd je hier strikt aan tijdens de build.
Home (/)

H1: Eventcontent die maandenlang doorwerkt.
Sub: Eén event, een complete contentbox. Eventshoot.nl levert 25+ kant-en-klare foto's, aftermovies en interviews uit jouw zakelijke event. Gemaakt door mensen, geleverd binnen 48 uur. Voor congressen, jaarcongressen, ledendagen en bedrijfsbijeenkomsten in heel Nederland.
Meta title: Eventshoot.nl — Jouw event is een goudmijn aan content
Meta desc: Professionele eventfotografie en video voor congressen, jaarcongressen en bedrijfsevents. 25+ kant-en-klare items binnen 48 uur. Gemaakt door mensen, niet door AI.
Componenten (in volgorde): HeaderBar → HeroVideo → MottoStrip (motto als H2 + body) → LogoCarousel → UspGrid4 → FeaturedPackageBlock (Headline-pakket meest gekozen) → ChecklistBlock ("Herken jij jezelf hierin?") → CtaBlock → ReviewsEmbed → BelRolfStrip → FooterBar

Eventfotografie (/eventfotografie/)

H1: Eventfotografie, binnen 48 uur.
Sub: Professionele eventfotografie voor congressen, jaarcongressen, ledendagen, seminars en bedrijfsbijeenkomsten in heel Nederland. Foto's die je marketeer direct kan plaatsen op LinkedIn, je website en in je nieuwsbrief.
Componenten: HeaderBar → HeroImage → MottoBar → VoorWieBulletBlock ("Van congres tot ledendag, alles in beeld") → WerkwijzeBlock → CrossSellBlock (Liever ook video?) → UspGrid4 → ReviewsEmbed → BelRolfStrip → FooterBar

Eventvideo (/eventvideo/)

H1: Eventvideo en aftermovies.
Sub: Korte social aftermovies voor LinkedIn, lange corporate aftermovies voor je website, en interviews met sprekers en deelnemers.
Componenten: HeaderBar → HeroImage → MottoBar (identiek aan Eventfotografie) → VideoTypeBlock ×3 (Social aftermovie / Corporate aftermovie / Event interviews) → VideoTypeBlock (Event promotievideo) → UspGrid4 → ReviewsEmbed → BelRolfStrip → FooterBar

Werk (/werk/)

H1: Werk dat voor zichzelf spreekt.
Sub: Een selectie uit congressen, jaarcongressen, ledendagen en bedrijfsbijeenkomsten die we hebben mogen vastleggen.
Componenten: HeaderBar → HeroImage → CaseGrid (case-cards) → ImageGallery (50+ foto's) → CtaBlock → UspGrid4 → ReviewsEmbed → BelRolfStrip → FooterBar

Case-detail template (/werk/{slug}/)

H1: [Klantnaam] — [Event-type] {jaar}
Componenten: HeaderBar → HeroSimple → CaseFactsBlock → CaseStoryBlock → CaseMetricsBlock → ImageGallery → VideoEmbed (indien aanwezig) → TestimonialQuote → CtaBlock → BelRolfStrip → FooterBar

Tarieven (/tarieven/)

H1: Tarieven voor eventcontent.
Sub: Drie pakketten plus een jaarcontract voor organisaties met meerdere events per jaar. Vooraf duidelijk, geen verrassingen achteraf.
Componenten: HeaderBar → HeroImage → TarievenIntroBlock → PackagesGrid3 → ContentYearStrip → AanvullendeDienstenBlock → UspGrid4 → ReviewsEmbed → BelRolfStrip → FooterBar

Eventkennis overview (/eventkennis/)

H1: Eventkennis.
Sub: Praktische artikelen over eventcontent, eventfotografie en zichtbaarheid na je event. Onderhouden door Rolf Trijber.
Componenten: HeaderBar → HeroSimple → ArticleGrid → CategoryFilter → BelRolfStrip → FooterBar

Artikel-detail template (/eventkennis/{slug}/)

H1: [De vraag, letterlijk als H1] — uit de Sanity-content
Componenten: HeaderBar → ArticleHero → ArticleBody (PortableText via @portabletext/vue) → TableOfContents → FaqBlock (met FAQ-schema markup voor AI-vindbaarheid) → AuthorBio → RelatedArticles → CtaBlock → FooterBar

Over Rolf (/over-rolf/)

H1: Rolf Trijber, achter Eventshoot.nl.
Sub: Eventfotograaf en videograaf met 40+ jaar ervaring in beeldproductie. Gespecialiseerd in zakelijke events: congressen, jaarcongressen, ledendagen en bedrijfsbijeenkomsten in heel Nederland.
Componenten: HeaderBar → HeroImage (portret Rolf) → MottoBlock (motto als H2 + body waarom) → VerwachtingBlock → ActieKaartenStrip (3 kaarten: Last-minute / Groot congres / Ook video nodig?) → BelRolfStrip → FooterBar

Kennismaken (/kennismaken/)

H1: Even kennismaken?
Sub: Een korte kennismaking duurt 20 minuten. Daarna weet je precies welk pakket bij je event past, en of we elkaar liggen.
Componenten: HeaderBar → HeroSimple → ContactOptionsBlock (3 opties: telefoon / e-mail / agenda) → AgendaEmbed (Cal.com of vergelijkbaar) → ContactForm (via EmailJS, al geïnstalleerd) → FaqBlock → FooterBar

Voor-wie landings (alle 4)
URLH1Sub/voor/brancheverenigingen/Voor brancheverenigingen.Eén content-partner voor je jaarcongres, ledendagen en vakdagen. Geleverd binnen 48 uur, klaar voor je ledencommunicatie./voor/eventbureaus/Voor eventbureaus en DMC's.Vaste content-partner achter de schermen. Wij produceren, jullie leveren één pakket aan jullie klant./voor/hotels/Voor hotels met congresfaciliteiten.Eventcontent voor de congressen die jullie hosten. Plus marketingbeelden van jullie eigen faciliteiten./voor/bedrijven/Voor bedrijven met eigen events.User conferences, klantdagen, bedrijfsbijeenkomsten. Eén productiedag, een contentbox waar je marketeer maanden mee vooruit kan.
Componenten per audience-pagina: HeaderBar → HeroImage → PainPointBlock → WaaromVoorJullieBlock → ContentYearTeaser → CaseTeaser (indien beschikbaar) → UspGrid4 → BelRolfStrip → FooterBar

6. Pakketten & tarieven
Drie losse pakketten
PakketPrijs (excl. BTW)AanwezigheidFoto'sAftermovieInterviewsCrewBeste fitHIGHLIGHT€ 8954 uur100–150Social (45–90 sec)—1Kleiner event, social-onlyHEADLINE (meest gekozen)€ 2.2508 uur150–250Social10–15 één-camera2Jaarcongres, ledendagHEROES€ 3.4508 uur200–300Social + Corporate (90–180 sec)15–20 één-camera2Hoog-profile congres
Alle pakketten inclusief: pre-production meeting, AI-ondertiteling, post-production met één correctieronde, levering binnen 48 uur (Highlight: 24 uur), drone/timelapse alleen bij Heroes (indien mogelijk).
Content Year jaarcontract (aparte strook, geen vierde pakket)

€ 775 per maand (= € 9.300 per jaar)
3 events per jaar op Heroes-niveau
8 uur aanwezigheid per event
Voorrang in de agenda
Doorlopende stijl, één aanspreekpunt
Visueel duidelijk onderscheiden van de drie losse pakketten op de Tarieven-pagina. Andere achtergrondkleur, "jaarcontract"-label, aparte CTA-knop.

Aanvullende diensten

Same-day levering direct na het event: € 425 / € 650 / € 925 (Highlight / Headline / Heroes)
Human ondertiteling (98% correct, ipv AI): € 13 per minuut (alleen Headline en Heroes)
Event promotievideo voor volgende editie: op offerte

Tarieven excl. BTW. Reisuren en transportkosten separaat.

7. Tech stack

Vue 3 met Composition API en <script setup lang="ts">
TypeScript
Vite (build tool)
Vue Router 4 (routing, lazy imports voor niet-Home views)
Pinia (state management, Composition API met defineStore)
Sanity CMS (/studio/) — voor Eventkennis-artikelen en cases

@sanity/client voor data-fetching
@sanity/image-url voor image-URL's
@portabletext/vue voor het renderen van rich text uit Sanity


Cloudinary voor image-optimalisatie en hosting (geïnstalleerd, te configureren)
EmailJS (@emailjs/browser) voor het contactformulier op /kennismaken/
@heroicons/vue voor icoontjes
Hosting: Vercel (deploy via GitHub main branch)

Commands
bashnpm run dev          # start dev server (http://localhost:5173)
npm run build        # type-check + production build
npm run preview      # preview production build lokaal
npm run type-check   # TypeScript check zonder emitting
npm run lint         # eslint --fix op .vue/.ts/.tsx bestanden
Sanity Studio
bashcd studio
npm run dev          # start Sanity Studio op http://localhost:3333

8. Architecture & conventions

src/main.ts — entry; mount Vue, registreer Pinia en Vue Router
src/router/index.ts — route definities. Home eager-loaded, overige views via lazy imports (() => import(...))
src/stores/ — Pinia stores via Composition API
src/views/ — pagina-componenten, één per route. Views koppelen componenten en stores.
src/components/ — herbruikbare UI-componenten zonder directe router/store afhankelijkheden
src/assets/main.css — globale reset en basisstijlen; eenmalig geïmporteerd in main.ts
/studio/ — losstaande Sanity Studio app, eigen package.json
/public/ — echte event-foto's en video's (eventshoot-XX.jpg, gbl_cyprus_aftermovie, etc.). Gebruik altijd deze, nooit AI-gegenereerd stock.

Path alias
@ verwijst naar src/. Gebruik dit voor alle niet-relatieve imports: import Foo from '@/components/Foo.vue'.
Component conventies

Gebruik <script setup lang="ts"> voor alle componenten
Props en emits zijn getypeerd: defineProps<{...}>() en defineEmits<{...}>()
Scoped styles (<style scoped>) hebben de voorkeur; globale stijlen gaan in src/assets/
Eén bestand per component
Bestandsnaam in PascalCase: HeroVideo.vue, niet hero-video.vue


9. Component-bibliotheek
Lijst van alle herbruikbare componenten die in de site voorkomen. Eén keer bouwen, op meerdere pagina's hergebruiken.
Layout (op elke pagina)

HeaderBar.vue — logo, telefoon-strook bovenaan, top-nav (3 dropdowns + 3 directe items), Kennismaken-knop rechts, mobile burger menu
FooterBar.vue — 4 kolommen (zie sectie 4) + bottom bar
BelRolfStrip.vue — "Vragen? Bel Rolf" + telefoon-button + LinkedIn-icoon, boven de footer

Hero-varianten

HeroVideo.vue — alleen Home. Achtergrondvideo, donkere overlay, H1 + sub + 2 CTA-knoppen
HeroImage.vue — service- en voor-wie-pagina's. Statisch beeld, donkere overlay, H1 + sub
HeroSimple.vue — Kennismaken, Eventkennis-overview, Privacy. Alleen H1 + sub, geen achtergrondbeeld
ArticleHero.vue — Eventkennis-artikelen. Categorie-label + H1 + sub + publicatiedatum + leestijd

Reusable content-blokken

MottoBar.vue — brede band, donkere achtergrond, gecentreerd. Alleen de motto-zin in groot lettertype (40–60pt). Geen body, geen CTA. (Gebruikt op Eventfotografie en Eventvideo.)
MottoStrip.vue — motto als H2 + body eronder (gebruikt op Home Strook 2)
MottoBlock.vue — motto als H2 met body eronder, voor Over Rolf Strook 1
UspGrid4.vue — vier USP-tegels (zie sectie 3). Identiek op Home, Eventfotografie, Werk en Tarieven.
PackagesGrid3.vue — drie pakketkaarten (Highlight / Headline meest-gekozen / Heroes)
ContentYearStrip.vue — aparte visueel onderscheiden strook voor het jaarcontract
LogoCarousel.vue — "Vertrouwd door" met klant-logo's
ReviewsEmbed.vue — Elfsight Google reviews-widget (zelfde als huidige WordPress-site)
CtaBlock.vue — "Klaar voor…?" + body + grote CTA-knop. Varianten per pagina.
ChecklistBlock.vue — "Herken jij jezelf hierin?" met checkmark-bullets
FaqBlock.vue — vraag-en-antwoord onderaan dienstpagina's en artikelen. Met FAQ-schema markup voor AI-vindbaarheid (JSON-LD).

Werk- en kennisbank-specifiek

CaseGrid.vue — raster van case-cards
CaseStoryBlock.vue, CaseFactsBlock.vue, CaseMetricsBlock.vue — per case-detail-pagina
ImageGallery.vue — masonry-grid via Cloudinary, lazy-loaded
VideoEmbed.vue — Vimeo of Bunny.net embed met poster-image
TestimonialQuote.vue — één pakkende quote met naam, functie en bedrijfslogo
ArticleGrid.vue — raster van artikel-cards
ArticleBody.vue — Sanity PortableText render
TableOfContents.vue — sticky inhoudsopgave voor lange artikelen
AuthorBio.vue — "Geschreven door Rolf Trijber" onder elk artikel
RelatedArticles.vue — 3 gerelateerde artikelen onderaan elk artikel
ActieKaartenStrip.vue — 3 actie-kaarten zoals nu op Over Rolf

Pagina-specifieke blokken

VoorWieBulletBlock.vue — "Van congres tot ledendag, alles in beeld" met bullets (Eventfotografie)
WerkwijzeBlock.vue — werkproces in stappen
CrossSellBlock.vue — "Liever ook video?" → CTA naar Tarieven
VideoTypeBlock.vue — één video-type met titel + body + embed (Eventvideo)
FeaturedPackageBlock.vue — "Het Headline-pakket is meest gekozen" (Home)
TarievenIntroBlock.vue — "Welk pakket past bij jouw event?"
AanvullendeDienstenBlock.vue — mini-tabel met same-day en human ondertiteling
PainPointBlock.vue — voor de Voor-wie pagina's, specifieke pijn per doelgroep
WaaromVoorJullieBlock.vue — voor de Voor-wie pagina's, waarom Eventshoot.nl voor jullie
ContentYearTeaser.vue — kortere variant van ContentYearStrip voor Voor-wie pagina's
CaseTeaser.vue — één case op homepage of Voor-wie pagina
VerwachtingBlock.vue — "Wat je van mij kunt verwachten" + 6 bullets (Over Rolf)
ContactOptionsBlock.vue — 3 opties naast elkaar (telefoon / e-mail / agenda)
AgendaEmbed.vue — Cal.com of vergelijkbare embed
ContactForm.vue — via EmailJS


10. Design richting
Belangrijk: behoud de visuele stijl van de huidige eventshoot.nl (WordPress + Elementor versie). Geen redesign. Fetch de live site (https://eventshoot.nl), inspecteer kleuren, typografie, spacing en knop-stijlen, en neem die over.
Huidige visuele kenmerken (te behouden):

Donkere achtergronden (#111 / #1a1a2e tinten)
Witte / lichtgrijze tekst op donker
Blauwe accentkleur voor headings (#1B9CFC of vergelijkbaar)
Oranje CTA-knoppen (warm oranje, contrasterend met blauw)
Sans-serif typografie (Inter, DM Sans of Calibri-achtig)
Ruime witruimte tussen blokken
Hero met donkere overlay over event-foto
Telefoonregel boven de header
Footer met logo + kolommen + bottom bar in nog donkerder grijs

Niet redesignen, wel ordenen. De huidige stijl werkt — replicateer hem in code. Design tokens komen vanzelf uit een inspectie van de live site (kleurwaarden, font-sizes, spacing-stappen).

11. SEO & AI-vindbaarheid
Per pagina vereist

Eén <h1> per pagina, kort (3–7 woorden), bevat het primaire keyword
Meta title (≤ 60 chars) en meta description (≤ 160 chars) — zie sectie 5
Canonical URL in <head>
OpenGraph en Twitter Card tags voor sociale shares
JSON-LD structured data:

Organization op de Home
Service op Eventfotografie en Eventvideo
Article op elk Eventkennis-artikel
FAQPage op elke FaqBlock
LocalBusiness met adres en openingstijden



URL-conventie

Lowercase, met streepjes: /over-rolf/, niet /Over_Rolf/
Trailing slash consistent (kies één style, blijf consistent)
Geen URL-parameters voor content (?id=123); altijd slugs

Eventkennis-artikelen (de AI-magneet)
Elk artikel moet beantwoord zijn op een specifieke vraagintentie. Patroon:

H1 = de vraag (letterlijk zoals iemand het Google/ChatGPT vraagt)
Eerste alinea = direct antwoord (1–2 zinnen, bevat het keyword) — dit is wat AI-systemen overnemen
Daarna verdieping met H2/H3-koppen in vraagvorm
FAQ-blok onderaan met gerelateerde vragen + antwoorden (met JSON-LD FAQPage schema)
Datum en auteur zichtbaar (Article schema)


12. Build status & volgorde
Huidige status (mei 2026)
De Vercel-build (https://eventshoot-website.vercel.app) staat op de oude propositie van vóór de strategische sessies. Wat er nu staat:

Home, Eventfotografie, Portfolio, Eventvideo, Tarieven, Contact zijn aanwezig
Met de oude H1's, oude pakketten (Daglicht/Gouden uur/Spotlight), oude USP's
Sanity Studio is opgezet maar (nog) niet gevuld met content
Cloudinary is geïnstalleerd maar (nog) niet geconfigureerd
EmailJS is geïnstalleerd maar (nog) niet gekoppeld aan formulier

Plan: 25 werkdagen, 5 weken
Week 1 — Foundation:

Update CLAUDE.md (✓ dit document)
Inspecteer eventshoot.nl en leg design-tokens vast in een tokens.css of tailwind-equivalent
HeaderBar + FooterBar + BelRolfStrip — de layout-componenten
UspGrid4 + MottoBar + LogoCarousel + ReviewsEmbed — herbruikbare blokken
Home opnieuw opbouwen met nieuwe content

Week 2 — Service-pagina's:

HeroImage + WerkwijzeBlock + VoorWieBulletBlock + CrossSellBlock
Eventfotografie en Eventvideo herschrijven
PackagesGrid3 + ContentYearStrip + AanvullendeDienstenBlock
Tarieven herschrijven

Week 3 — Werk, Over, Kennismaken:

CaseGrid + ImageGallery + Werk-pagina
CaseStoryBlock + één Case-detail (template)
MottoBlock + VerwachtingBlock + ActieKaartenStrip + Over Rolf
ContactOptionsBlock + AgendaEmbed + Kennismaken-pagina

Week 4 — Voor-wie landings:

PainPointBlock + 4 voor-wie pagina's
Privacy-pagina

Week 5 — Eventkennis:

Sanity-schema voor Article
ArticleGrid + ArticleHero + ArticleBody (PortableText) + Eventkennis-overview
FaqBlock + AuthorBio + RelatedArticles + één artikel als template
Schrijven van 5 evergreen artikelen

Critical do's

✅ Behoud de huidige tech-stack (Vue 3 + Vite + Sanity + Cloudinary + EmailJS) — niet wisselen naar React/Next.js
✅ Behoud de visuele stijl van eventshoot.nl — geen redesign
✅ Gebruik echte event-foto's uit /public/
✅ Houd H1's kort met het primaire keyword
✅ Plaats de motto-zin altijd letterlijk identiek
✅ Bouw één pagina per werkdag — geen weekenden, geen sprints
✅ Update dit CLAUDE.md-bestand als strategie wijzigt

Critical don'ts

❌ Geen AI-gegenereerde stockfoto's — ondergraaft de hele propositie
❌ Geen oude pakketnamen (Daglicht / Gouden uur / Spotlight) — altijd Highlight / Headline / Heroes
❌ Geen oude USP's ("Één aanspreekpunt" / "Representatief op elk niveau") — gebruik de nieuwe vier
❌ Geen Eventkennis onder een ander label (zoals "Blog" of "Kennisbank")
❌ Geen restructuring van URL's per kwartaal — kies één structuur en houd vast
❌ Geen em-dashes (—) in body-tekst — gebruik komma's of bijwoorden


13. Referentiedocumenten
Deze documenten leven naast de codebase en bevatten alle strategische en redactionele beslissingen:

Eventshoot_Sitemap_v2 — sitemap met helicopter-view, alle pagina-specs en componentbibliotheek
Eventshoot_Website_Teksten_v3 — exacte teksten per pagina per strook (de bron voor copy-paste)
Eventshoot_Onepager_v5 — propositie, motto, USP's, pakketten in onepager-vorm (commerciële bron)
Strategisch_advies_Eventshoot_Rolf_Trijber — strategische onderbouwing van keuzes (positionering, doelgroep, prijsstrategie)
Workflow_Eventshoot_werkblad — wekelijks ritme voor sales & content (1 post/week + 15–20 outreach-touches/dag)

Bij twijfel over een specifieke pagina of een specifieke regel: raadpleeg eerst dit CLAUDE.md, daarna het juiste referentiedocument.

Laatste update: mei 2026 — na strategische sessies en onepager v5.

---

## 3. Event-termen — welke event-types Eventshoot.nl bedient

Niet alle event-types passen bij de propositie. Deze lijst is leidend voor alle hero-zinnen, meta-tags en "Voor welke events"-secties.

### Kerntermen (5 — gebruik in hero-zinnen en SEO-titels)

- Congressen
- Conferenties
- Ledendagen / vakdagen
- Seminars
- Bedrijfsbijeenkomsten

### Aanvullende termen (per pagina, waar relevant)

- Jaarcongressen — alleen om jaarlijks-terugkerend te benadrukken
- Symposia — academisch / wetenschappelijk
- User conferences — B2B SaaS / scale-ups
- Award-uitreikingen
- Aandeelhoudersvergaderingen (AVA's)
- Productlanceringen / launch events
- Beurzen en vakbeurzen
- Jubilea en lustra
- Klantdagen

### Niet bedienen (passen niet bij de propositie)

- Bedrijfsfeesten en personeelsfeesten (informeel, andere fotograaf-stijl)
- Bruiloften, partijen, communies
- Teamuitjes, heisessies (te besloten, te klein voor de pakketten)
- Open dagen voor consumenten

### Gebruiksregels

1. Hero-zinnen: maximaal 5 termen uit de kerngroep
2. "Voor welke events"-secties: 8–12 termen mag
3. Voor-wie pagina's prioriteren termen die bij die doelgroep horen:
   - Brancheverenigingen: jaarcongressen, ledendagen, vakdagen, ALV's
   - Eventbureaus & DMC's: alle types (white-label)
   - Hotels met congresfaciliteiten: congressen, conferenties, AVA's, productlanceringen
   - Bedrijven met eigen events: user conferences, productlanceringen, klantdagen, aandeelhoudersvergaderingen

### Standaard hero-subkop per dienstpagina

- **Home:** "Voor congressen, conferenties, ledendagen en bedrijfsbijeenkomsten in heel Nederland."
- **Eventfotografie:** "Professionele eventfotografie voor congressen, conferenties, ledendagen, seminars en bedrijfsbijeenkomsten in heel Nederland."
- **Eventvideo:** "Eventvideo's voor congressen, conferenties, productlanceringen en bedrijfsbijeenkomsten in heel Nederland."

### Belangrijk: vermijd dubbel benoemen

"Congressen, jaarcongressen" is dubbelop — een jaarcongres ís een congres. Schrijf óf "congressen" (omvat jaarcongressen) óf, als je het jaarlijkse karakter wilt benadrukken, alleen "jaarcongressen". Niet beide.


## X. Data-architectuur

Drie soorten content, drie opslaglocaties:

1. **Website-assets** → Cloudinary (cdn voor foto/video) of `/public/` (kleine assets)
2. **Klant-levering** → browse-galerij op `/klanten/{slug}/` (unlisted, `noindex`) + bulk/hoge res via **Swiss Transfer** (niet WeTransfer)
3. **Bronbestanden** → Lokaal `~/Documents/DATA_EVENTSHOOT/` + externe SSD backup

NOOIT bronbestanden (RAW, Lightroom-catalog) committeren naar de repo.

### Klant-levering (twee kanalen)

**Browse-galerij op de site** (`/klanten/{slug}/`): klant bekijkt foto's en video's, downloadt losse bestanden via de lightbox. Pagina is niet geïndexeerd. Config per klant: `public/klanten/{slug}.json`. Foto's in `public/def/{Folder}/` (+ `manifest.json` via `node scripts/generate-manifest.js {Folder}`) of Cloudinary via `api/klanten/[slug].ts`. Nieuwe klant: JSON + foto's + manifest + push; OG-preview via `scripts/prerender-klanten.mjs` bij build.

**Bulk/hoge resolutie** → **Swiss Transfer**. Rolf stuurt het volledige pakket (alle bestanden, printkwaliteit) via Swiss Transfer, vaak samen met telefonisch contact. De site-galerij is géén vervanging voor die levering: browsen en los downloaden, niet het complete archief in één keer.

Gebruik **Swiss Transfer**, niet WeTransfer — dat is de vaste werkwijze voor bulk-levering aan klanten.


## Website content — doelgroeppagina's
Websiteteksten per doelgroep staan in aparte .md-bestanden in deze map:
- `brancheverenigingen.md`
- `eventbureaus-dmcs.md`
- `hotels-congresfaciliteiten.md`
- `bedrijven-eigen-events.md`

Gebruik deze als basis bij het bouwen of aanpassen van de betreffende pagina's.
Schrijfstijl: direct, geen jargon, doelgroepgericht, in het Nederlands.
Motto van het bedrijf: "Jouw zakelijke evenement is een goudmijn aan content."

- [Over Rolf paginatekst](overrolf.md)
---