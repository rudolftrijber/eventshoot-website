# Overdracht: Interview Intake & Lowerthird Tool

Dit document beschrijft een werkend prototype (`interview-intake-tool.html`, bijgevoegd) dat als referentie dient voor de bouw van de definitieve versie op eventshoot.nl. Het prototype bevat alle afgesproken logica en schermen, werkt volledig los in de browser (localStorage), en is bedoeld om in Cursor omgezet te worden naar een echte web-app met gedeelde database en login.

## Doel van de tool

Tijdens interviewopnames (1-camera setups en vodcasts met PTZ-camera's) moet de functietitel van gasten passen binnen circa 40 tekens voor de lowerthird, die in post-productie wordt toegevoegd. De tool laat de crew gasten vooraf invoeren, laat de gast zelf naam en functie controleren op een simpel scherm, en genereert daarna een uniek, dagelijks doorlopend regienummer dat als referentie dient tussen twee iPads: één die het nummer naar de camera houdt, één met de interviewvragen voor de interviewer.

## Aanbevolen technische stack (aansluitend op bestaande werkwijze)

Aangezien de rest van de site met Cursor, Claude Code, GitHub en Vercel wordt gebouwd, ligt het voor de hand om:

- Next.js (of het framework dat de rest van eventshoot.nl al gebruikt) te gebruiken voor de app zelf.
- Een Postgres database te koppelen die goed met Vercel samenwerkt, bijvoorbeeld Vercel Postgres, Neon, of Supabase. Supabase heeft als extra voordeel ingebouwde authenticatie, wat de loginstap hieronder vereenvoudigt.
- Login eenvoudig te houden: een middleware die op een wachtwoord uit een environment variable controleert is voldoende voor een gedeeld crew-account. Alleen als je wilt bijhouden wie welke gast heeft gecontroleerd, is een lichte login met losse accounts (bijvoorbeeld via Supabase Auth of NextAuth) de moeite waard.
- Voor het synchroon houden van de twee iPads is gewone polling (elke paar seconden opnieuw ophalen, bijvoorbeeld met SWR of React Query) ruim voldoende, een websocket-oplossing is voor dit gebruik overbodige complexiteit.
- Huisstijl van eventshoot.nl (logo, kleuren, lettertype) toepassen over de bestaande layout, de structuur en interactie kunnen ongewijzigd blijven.

## Datamodel

### Gast-record

| Veld | Type | Omschrijving |
|---|---|---|
| id | string | intern, uniek |
| productie | string | naam van de productie, gekoppeld aan Producties-tabel |
| type | string | Keynote spreker / Executive / Deelnemer / Overig / leeg |
| naam | string | max. ingestelde tekenlimiet (standaard 40) |
| functie | string | max. ingestelde tekenlimiet (standaard 40) |
| planning | string | vrij tekstveld, bijv. "interview voor de lunch" |
| gedeeld | boolean | of de vragen vooraf met de gast zijn gedeeld |
| questions | string[] | 4 tot 7 interviewvragen |
| status | string | Ingevoerd (groen) / Gecontroleerd (oranje) / Opgenomen (rood) |
| regienummer | string | leeg tot bevestiging, daarna uniek en doorlopend per dag |
| datum | string (YYYY-MM-DD) | leeg tot bevestiging, dan automatisch ingevuld |
| tijd | string (HH:MM) | leeg tot bevestiging, dan automatisch ingevuld |

### Productie-record (standaardvragen voor Deelnemers)

| Veld | Type | Omschrijving |
|---|---|---|
| naam | string | productienaam, gebruikt als sleutel |
| datum | string | productiedatum, informatief |
| vragen | string[] | standaard 4-7 vragen voor gasten van het type Deelnemer |

## Belangrijke bedrijfslogica

- **Regienummer, datum en tijd worden pas vastgelegd op het moment dat de status naar "Gecontroleerd" gaat.** Dit gebeurt eenmalig (idempotent): als er al een tijd is vastgelegd, gebeurt er niets meer bij een volgende statuswijziging. Het nummer is uniek en telt per dag op vanaf 1.
- **Tekenlimiet** voor naam en functie is één instelling (standaard 40), aanpasbaar via het instellingenpaneel, geldt voor beide velden gelijk.
- **Standaardvragen per productie**: als een gast van het type "Deelnemer" is en de gekozen productie heeft standaardvragen ingesteld, verschijnt een knop om die vragen in één keer over te nemen (overschrijft na bevestiging, niet automatisch).
- **Vragen worden nooit met de gast gedeeld** in de Controle-stap, dat scherm toont alleen naam en functie, precies om te voorkomen dat de gast de vragen al ziet (expliciete keuze na eerdere negatieve ervaring).

## Schermen

1. **Nieuw** — crew voert productie, type, naam, functie, planning en vragen in. Slaat op met status "Ingevoerd".
2. **Overzicht** — lijst van alle gasten, doorzoekbaar, met status-pil (klikbaar om handmatig door te schakelen), potlood om te bewerken, prullenbak om te verwijderen. Klikken op een rij opent Controle (als nog niet gecontroleerd) of Camera (als dat al wel zo is).
3. **Producties** — crew legt per productie een datum en standaardvragen voor Deelnemers vast.
4. **Controle** — gast-facing, toont alléén naam en functie (beide bewerkbaar), met één grote knop "Gecontroleerd, dit klopt". Bevestigen kent het regienummer toe en legt datum/tijd vast.
5. **Camera** — toont alleen het grote regienummer, verder niets, bedoeld om voor de lens te houden.
6. **Interviewer** — toont klein naam en functie, of de vragen vooraf gedeeld zijn, en de vragenlijst. Knop "Opgenomen" zet de status op rood.

## CSV import/export formaat

Kolommen, in deze volgorde:

```
productienaam, type, naam, functie, planning, gedeeld, vraag1, vraag2, vraag3, vraag4, vraag5, vraag6, vraag7, status, regienummer, datum, tijd
```

Export CSV genereert bij een lege lijst automatisch een voorbeeldregel, zodat dit bestand meteen als sjabloon dient voor wie de gastenlijst vooraf via een spreadsheet aanlevert. Foto's zitten hier bewust niet in (op verzoek verwijderd wegens complexiteit versus nut), en zijn ook niet meer in het prototype aanwezig.

## Wat nog moet gebeuren voor de live versie

- Vervang localStorage door de gekozen database, zodat beide iPads dezelfde data zien.
- Voeg de loginlaag toe.
- Zet de huisstijl van eventshoot.nl over de bestaande schermen en kleuren.
- Test de workflow met twee toestellen tegelijk (Controle/Nieuw op het ene, Camera/Interviewer op het andere) voordat het in productie gaat.
