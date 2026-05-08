# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Briefing: Eventshoot.nl Rebuild

Dit project is een nagebouwde versie van **eventshoot.nl** — de website van Rolf Trijber, een professional event- en bedrijfsfotograaf/videograaf in Nederland.

### Business context
- **Bedrijf**: Eventshoot.nl BV
- **Eigenaar**: Rolf (senior fotograaf, 40+ jaar ervaring)
- **Telefoon**: 06 251 77728 / +31625177728
- **Doelgroep**: Marketingmanagers, eventorganisatoren, corporate communicatieteams
- **Diensten**: Eventfotografie en -videografie voor congressen, seminars, netwerkbijeenkomsten, award-uitreikingen, beurzen en bedrijfsevents door heel Nederland

### Toon & positionering
Professioneel, direct, geen poespas. Kernboodschap: *"Jouw zakelijke event verdient meer dan een paar telefoonfotos."* — snelle levering, één aanspreekpunt, corporate kwaliteit.

---

## Pagina's & content

### Home (`/`)
**Hero**: "Jouw zakelijke event verdient meer dan een paar telefoonfotos."
Tagline: professionele diensten voor congressen/conferenties en zakelijke bijeenkomsten door Nederland, snel geleverd, direct bruikbaar.
CTA-knoppen: **"Neem contact op"** en **"Bekijk de paketten"**

**Vertrouwenslogos** (opdrachtgevers): GBL, Gladwell, Datto, S2Grupo, Koers, Dux, SCPA, EvaScript, Dell

**4 USP-blokken**:
1. *"40+ jaar oog voor het moment"* — senior fotograaf, veertig jaar vakervaring
2. *"Één aanspreekpunt, geen gedoe"* — eenvoudige communicatie zonder verrassingen
3. *"Representatief op elk niveau"* — aanpassing aan elke event-atmosfeer
4. *"Geleverd binnen 48 uur"* — snelle levering

**Uitgelicht pakket**: Gouden uur — €595 (meest gekozen)

---

### Eventfotografie (`/eventfotografie/`)
Kernboodschap: "Eventfotografie die werkt ook na het event" — goede foto's overtuigen nieuwe inschrijvers.

**Werkproces**:
1. Korte briefing vooraf
2. Discrete aanwezigheid op het event
3. Selectie en professionele nabewerking
4. Levering binnen 48 uur online
5. Optioneel: cornerlogo voor merkzichtbaarheid

**Event types**: congressen & seminars, netwerkbijeenkomsten, award-uitreikingen, bedrijfsevents, beurzen & productlanceringen

---

### Portfolio (`/portfolio/`)
**Titel**: "Zien hoe we werken? Hier is het bewijs."
**Subtitel**: "Elk event is anders, de kwaliteit is altijd hetzelfde."
Grid-galerie zonder vaste categorieën. Slogan: *"Foto's zeggen meer dan een tarievenlijst."*

---

### Eventvideo (`/eventvideo/`)
Social media aftermovies (30–90 sec) en lange corporate aftermovies. Pakket afhankelijk — zie tarieven.

---

### Tarieven (`/tarieven/`)
Drie pakketten:

| Pakket | Prijs | Inhoud |
|--------|-------|--------|
| **Daglicht** | €295 | 2 uur aanwezig, 50–100 bewerkte foto's. Ideaal voor kleinere of interne events. |
| **Gouden uur** *(meest gekozen)* | €595 | 4 uur aanwezig, 100–150 bewerkte foto's, 1 social aftermovie (30–60 sec). Voor LinkedIn, websites en uitnodigingen. |
| **Spotlight** | €1.495 | ~8 uur, 2 crew, 150–200 bewerkte foto's, social aftermovie (30–60 sec), corporate aftermovie (90–180 sec), 15–20 interviews met sprekers/deelnemers. |

---

### Contact (`/contact/`)
**Titel**: "Neem contact op"
**Intro**: Rolf reageert persoonlijk binnen 24 uur — geen geautomatiseerde reacties, geen callcenters.

**Formuliervelden**: Naam, E-mail, Telefoon, bericht ("Vertel me over je event, dan kijk ik wat ik voor je kan doen"), knop: **Verstuur**

**Directe telefoon**: 06 251 777 28

---

### Footer (alle pagina's)
Links: Over Rolf | Privacy & Disclaimer | Algemene voorwaarden | Tariefenoverzicht (PDF) | LinkedIn
Copyright: © Eventshoot.nl BV – 2026

---

## Design richting

- **Stijl**: Donker, modern, professioneel — corporate fotografie uitstraling
- **Kleurenpalet**: Donkere achtergronden (#111 of #1a1a2e), witte/lichtgrijze tekst, goudgele of oranjeactige accent voor "Gouden uur" highlight, neutrale grijstinten voor kaders
- **Typografie**: Modern sans-serif (bijv. Inter of DM Sans)
- **Opmaak**: Ruime witruimte, grote headlines, foto's prominent
- **CTA-knoppen**: Contrasterende accentkleur (goud/geel of warm oranje tint past bij "Gouden uur" branding)
- **Navigatie top**: Links + telefoonnummer rechts in header

---

## Tech Stack

Vue 3 (Composition API met `<script setup>`), TypeScript, Vite, Vue Router 4, Pinia.

## Commands

```bash
npm run dev          # start dev server (http://localhost:5173)
npm run build        # type-check + production build
npm run preview      # preview production build lokaal
npm run type-check   # TypeScript check zonder emitting
```

## Architecture

- **`src/main.ts`** — app entry point; monteert Vue, registreert Pinia en Vue Router.
- **`src/router/index.ts`** — route definities. Home is eager-loaded; overige views gebruiken lazy imports (`() => import(...)`).
- **`src/stores/`** — Pinia stores via Composition API (`defineStore` met setup functie).
- **`src/views/`** — pagina-level componenten, één per route. Views koppelen componenten en stores.
- **`src/components/`** — herbruikbare UI componenten zonder directe router/store afhankelijkheden.
- **`src/assets/main.css`** — globale reset en basisstijlen; eenmalig geïmporteerd in `main.ts`.

## Path Alias

`@` verwijst naar `src/`. Gebruik dit voor alle niet-relatieve imports (bijv. `import Foo from '@/components/Foo.vue'`).

## Component conventies

- Gebruik `<script setup lang="ts">` voor alle componenten.
- Props en emits zijn getypeerd met `defineProps<{...}>()` / `defineEmits<{...}>()`.
- Scoped styles (`<style scoped>`) hebben de voorkeur; globale stijlen gaan in `src/assets/`.
