# Werkwijze — Eventshoot website

## Belangrijkste regel

**Rolf is geen programmeur. Rolf test in Chrome. Cursor regelt alles technische.**

### Rolf hoeft nooit

- Terminal-commando's te draaien
- Verborgen bestanden te zoeken (`.env.local`, etc.)
- `.env.local` of andere config-bestanden te bewerken
- Database-URL's zelf in bestanden te plakken
- Te schakelen tussen Vercel-dashboard, Neon en Cursor
- Te begrijpen wat push, deploy of git betekent

### Als Cursor iets nodig heeft dat alleen Rolf kan

Bijvoorbeeld een database-wachtwoord of login-gegevens uit Neon/Vercel:

1. Cursor vraagt het **één keer**, duidelijk, in de chat
2. Rolf **plakt de waarde in de chat** (kopiëren + plakken is genoeg)
3. Cursor verwerkt het zelf — Rolf hoeft geen bestanden te openen

**Niet doen:** Rolf door meerdere technische stappen leiden (bestand zoeken, terminal, opslaan, herstarten). Dat maakt het onnodig complex.

---

## Rolf's rol (2 stappen)

1. Open **http://localhost:5173/interview-app** in **Chrome**
2. Vertel wat je ziet en wat er moet veranderen

Eventueel: **Cmd+Shift+R** voor harde refresh als iets niet verandert.

Klaar.

---

## Cursors rol

- Code aanpassen
- Geheimen en database instellen (`.env.local`, etc.)
- Dev-server starten en herstarten
- Demo-data laden en API-problemen oplossen
- Pushen naar productie als Rolf tevreden is
- Vercel-build afwachten en bevestigen wanneer live

---

## Finetune-fase Interview App (nu)

| | |
|---|---|
| **Waar Rolf werkt** | http://localhost:5173/interview-app (Chrome) |
| **Waar Rolf níet werkt** | eventshoot.nl (alleen eindcontrole na push) |
| **Wachtwoord** | Aan op productie; lokaal via `.env.local` (zie `npm run setup:env`) |
| **Database** | Cursor regelt `.env.local` — Rolf plakt URL alleen in chat als gevraagd |

Pas als alles lokaal goed werkt → Cursor pusht → Rolf checkt eventshoot.nl.

---

## Als alles werkt: online zetten

1. Rolf zegt: "push naar productie" of "zet het live"
2. Cursor pusht en bevestigt wanneer Vercel klaar is
3. Rolf checkt https://eventshoot.nl/interview-app (Cmd+Shift+R)
4. Cursor zet wachtwoord weer aan op productie

---

## Waarom lokaal finetunen?

| Lokaal (nu) | Productie (later) |
|---|---|
| Wijzigingen direct zichtbaar | Wachten op push + Vercel (~1–2 min) |
| Geen wachtwoord | Wachtwoord verplicht |
| Cursor fixt direct | Cache en vertraging |

---

## Problemen — wie doet wat?

| Probleem | Wie lost op |
|---|---|
| "Ik zie geen verschil" | Cursor herstart dev-server; Rolf doet Cmd+Shift+R |
| Demo-data laadt niet | Cursor — niet Rolf |
| API-fout | Cursor — niet Rolf |
| Iets moet anders in de app | Rolf beschrijft het; Cursor past aan |

Rolf meldt alleen **wat hij ziet** (screenshot of beschrijving). Cursor lost de techniek op.

---

## Website-pagina's (niet Interview App)

Home, Tarieven, Eventfotografie, etc.: Rolf opent http://localhost:5173 in Chrome. Cursor regelt de rest.

---

## Voor Cursor (interne notitie)

Bij elke technische actie zelf uitvoeren: terminal, `.env.local`, `npm run dev`, `git push`. Vraag Rolf alleen om informatie die niet uit de codebase of Vercel CLI te halen is — en dan alleen als plakken in de chat.
