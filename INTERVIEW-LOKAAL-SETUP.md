?? Waarom # Database lokaal instellen

Cursor toont `.env.local` niet (verborgen bestand). Gebruik één van deze manieren:

## Manier 1 — Terminal (makkelijkst)

```bash
cd ~/Documents/CURSOR
npm run open:env
```

TextEdit opent `.env.local`. Plak daar je database-URL.

## Manier 2 — Plak hieronder, daarna sync

1. Kopieer uit Neon: **Show secret** → kopieer `POSTGRES_URL=` regel
2. Plak de waarde hieronder tussen de aanhalingstekens (alleen `postgresql://...`)
3. Sla dit bestand op
4. Run in terminal: `npm run sync:env`

---

POSTGRES_URL_HIER_PLAKKEN=""
