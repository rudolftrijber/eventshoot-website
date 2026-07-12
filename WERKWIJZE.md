# Werkwijze — Eventshoot website

Korte handleiding voor lokaal bouwen, testen en live zetten. Voorkomt het patroon "ik zie geen verschil" door duidelijk te scheiden tussen **lokaal** en **productie**.

## Twee modi, twee URL's

| Modus | URL | Wanneer |
|---|---|---|
| **Bouwen** | http://localhost:5173 | Altijd tijdens ontwikkeling |
| **Live check** | https://eventshoot.nl | Alleen na push, als laatste controle |

Wijzigingen in de code zijn **niet** automatisch zichtbaar op eventshoot.nl. Productie verandert pas na push naar GitHub en een Vercel-build (~1–2 minuten).

## Eerste keer / omgeving instellen

```bash
npm install
npm run setup:env          # maakt .env.local aan vanuit .env.example
vercel env pull .env.local # haalt productie-variabelen op (aanbevolen)
```

Voor de Interview App zijn deze drie waarden verplicht in `.env.local`:

- `POSTGRES_URL`
- `INTERVIEW_APP_PASSWORD`
- `INTERVIEW_SESSION_SECRET`

Zonder `.env.local` werkt login lokaal niet.

## Dagelijks: lokaal ontwikkelen

```bash
npm run dev
```

Open http://localhost:5173 (of http://localhost:5173/interview-app voor de interview-app).

- UI, CSS en layout: direct zichtbaar via hot reload
- Geen Vercel-deploy nodig tijdens bouwen
- Dev-server draait op poort **5173** (`strictPort: true`)

### Interview App lokaal

- URL: http://localhost:5173/interview-app
- API-routes draaien lokaal via de Vite-plugin (`plugins/vite-local-api.ts`)
- Dezelfde Neon-database als productie (via `POSTGRES_URL` in `.env.local`)
- Demo-data wordt automatisch geladen bij eerste sync als de database leeg is
- Handmatig demo-data laden: Instellingen → **Laad demo-data**

### Demo-data via terminal (optioneel)

```bash
npm run seed:interview
```

Vereist `POSTGRES_URL` in `.env.local`.

## Naar productie

1. Lokaal testen tot het goed is
2. Commit + push naar `main`
3. Wacht op Vercel-build (~1–2 min) — dashboard optioneel open voor status
4. Hard refresh op productie (Cmd+Shift+R) of uitloggen/inloggen (Interview App)

Vercel deployt **automatisch** bij elke push naar `main`. Handmatig deployen op Vercel is alleen nodig als:

- een deploy is mislukt en je dezelfde commit opnieuw wilt uitrollen
- je bewust geen nieuwe commit wilt maken maar wel opnieuw wilt bouwen

Handmatig deployen is **geen** vervanging voor lokaal testen. De build duurt even lang als automatisch deployen.

## Veelvoorkomende valkuilen

### "Ik zie geen verschil"

Meestal een van deze drie:

1. **Oude dev-server** — meerdere `npm run dev`-processen tegelijk draaien
2. **Verkeerde URL** — productie bekijken terwijl je lokaal hebt gewijzigd
3. **Cache** — harde refresh nodig (Cmd+Shift+R)

### Oude dev-servers opruimen

```bash
# Zoek processen op poort 5173
lsof -i :5173

# Stop alle node/vite dev-processen (macOS)
pkill -f "vite"

# Start opnieuw, één terminal
npm run dev
```

### Interview App: lege productielijst

- Uitloggen → opnieuw inloggen (triggert sync + auto-seed bij lege database)
- Of: Instellingen → **Laad demo-data**
- Controleer in Vercel of `POSTGRES_URL`, `INTERVIEW_APP_PASSWORD` en `INTERVIEW_SESSION_SECRET` gezet zijn

### Lokaal vs productie herkennen

- Lokaal: badge **"Lokaal · build …"** onder het login-scherm (alleen in development)
- Productie: geen lokale badge

## Handige commando's

```bash
npm run dev              # Vite dev-server (standaard)
npm run dev:vercel       # Alternatief: Vercel dev (langzamer, dichter bij productie-API)
npm run build            # Productie-build lokaal testen
npm run preview          # Preview van productie-build
npm run type-check       # TypeScript zonder build
npm run seed:interview   # Demo producties + gasten in database
```

## Wanneer Vercel-dashboard open?

Optioneel, niet verplicht. Handig om te zien of een deploy:

- bezig is (geel)
- geslaagd is (groen)
- mislukt is (rood — klik deploy-log voor foutmelding)

Niet nodig om elke wijziging handmatig te triggeren. Push naar `main` is voldoende.

## Samenvatting

1. **Bouwen = localhost:5173**
2. **Live = pas na push + Vercel-build**
3. **Eén dev-server tegelijk**
4. **`.env.local` voor Interview App login lokaal**
5. **Vercel-dashboard = status kijken, niet dagelijks handmatig deployen**
