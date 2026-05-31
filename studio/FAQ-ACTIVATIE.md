# FAQ activeren — stap voor stap

De FAQ's staan in **Sanity CMS**. De website haalt ze op per pagina (bijv. Kennismaken).  
Zolang Sanity leeg is, toont Kennismaken automatisch de **fallback-teksten** uit de locale-bestanden.

---

## Stap 1 — Sanity-project controleren

1. Ga naar [sanity.io/manage](https://sanity.io/manage)
2. Open je project (project-ID staat waarschijnlijk al in de code: `pn3eisnr`)
3. Noteer:
   - **Project ID**
   - **Dataset** (meestal `production`)

---

## Stap 2 — Omgevingsvariabelen invullen

### Website (hoofdmap)

Kopieer `.env.example` naar `.env` als dat nog niet bestaat:

```bash
cp .env.example .env
```

Vul in `.env` in:

```
VITE_SANITY_PROJECT_ID=jouw-project-id
VITE_SANITY_DATASET=production
```

### Sanity Studio (`studio/`)

```bash
cp studio/.env.example studio/.env
```

Vul in `studio/.env` in:

```
SANITY_STUDIO_PROJECT_ID=jouw-project-id
SANITY_STUDIO_DATASET=production
```

> **Belangrijk:** het project-ID moet in **beide** bestanden hetzelfde zijn.

---

## Stap 3 — Studio starten (schema zichtbaar maken)

In de terminal, vanuit de projectmap:

```bash
npm run studio
```

Open [http://localhost:3333](http://localhost:3333)

Je zou moeten zien:
- **FAQ** (bovenaan)
- **Eventkennis** (artikelen)

Nieuwe FAQ-items: klik **FAQ → Create new → FAQ-item**.

Velden per item:
| Veld | Wat invullen |
|------|----------------|
| Actief | Aan |
| Categorie | Onderwerp (bijv. Algemeen) |
| Tonen op pagina's | Minimaal één pagina, bijv. `Kennismaken` |
| Volgorde | 1, 2, 3… (lager = eerder in lijst) |
| Vraag/Antwoord NL | Nederlandse tekst |
| Vraag/Antwoord EN | Engelse tekst |
| Beeld | Optioneel |

---

## Stap 4 — Website starten

Nieuw terminalvenster:

```bash
npm run dev
```

Open [http://localhost:5173/kennismaken](http://localhost:5173/kennismaken)

- **Geen FAQ in Sanity yet?** → je ziet de 4 bestaande fallback-vragen
- **Na seed of handmatig invullen?** → vragen komen uit Sanity

Wissel 🇬🇧 / 🇳🇱: de FAQ toont automatisch EN of NL velden.

---

## Stap 5 — Snel starten: seed-script (optioneel)

In Sanity: **API → Tokens → Add API token** (rechten: **Editor**).

```bash
SANITY_TOKEN=sk... npm run import:faq
```

Importeert alle 60 rijen uit `data/FAQ-import-eventshoot.csv` naar Sanity (FAQ-items).

Of alleen Kennismaken (4 items):

```bash
SANITY_TOKEN=sk... npm run seed:faq
```

Dit zet de 4 Kennismaken-FAQ's in Sanity (NL + EN).

Daarna `/kennismaken` verversen.

---

## Stap 6 — FAQ op andere pagina's

Voeg in Studio een FAQ-item toe en vink bij **Tonen op pagina's** aan:

- `eventfotografie`
- `eventvideo`
- `tarieven`
- `voor-brancheverenigingen`
- enz.

In de code voeg je op die pagina toe:

```vue
<FaqBlock page="eventfotografie" />
```

(Pagina-key moet exact overeenkomen met Sanity.)

---

## Problemen oplossen

| Symptoom | Oplossing |
|----------|-----------|
| Fallback blijft zichtbaar | Check `.env` project-ID, herstart `npm run dev` |
| "Kon artikelen niet laden" | Zelfde check; dataset moet `production` zijn |
| FAQ leeg na seed | Token-rechten Editor? Juiste project-ID? |
| Wijziging niet zichtbaar | CDN-cache: wacht ~1 min of zet `useCdn: false` tijdelijk in dev |

---

## Twee soorten FAQ (onthouden)

| Type | Waar beheren | Talen |
|------|--------------|-------|
| **Site-FAQ** | Sanity → FAQ | NL + EN |
| **Artikel-FAQ** | Sanity → Eventkennis-artikel → FAQ-veld | Alleen NL |

Eventkennis verschijnt **niet** in het EN-menu en is alleen NL-content.
