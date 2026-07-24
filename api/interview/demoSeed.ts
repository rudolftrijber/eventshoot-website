import { createGuest, createProductie, ensureSchema, fetchProducties } from './database.js'
import type { Gast, Productie } from './types.js'

export const DEMO_PRODUCTIE_ID = 'prod-dsr-2026'

const producties: Omit<Productie, 'createdAt' | 'updatedAt' | 'archivedAt' | 'hasClientPassword'>[] = [
  {
    id: 'prod-dsr-2026',
    naam: 'DSR Jaarcongres 2026',
    datum: '2026-03-18',
    startTijd: '08:00',
    eindDatum: '2026-03-18',
    eindTijd: '18:00',
    status: 'OPT',
    locatie: 'Jaarbeurs Utrecht',
    land: 'Netherlands',
    supervisor: 'Rolf Trijber',
    crew2: 'N.V.T.',
    crew3: 'N.V.T.',
    crew4: 'N.V.T.',
    crew5: 'N.V.T.',
    vragen: [
      'Wat was voor u het hoogtepunt van dit congres?',
      'Welke trend ziet u de komende jaren in de sector?',
      'Wat neemt u mee naar uw organisatie?',
      'Waarom is netwerken op een congres zo waardevol?',
    ],
  },
  {
    id: 'prod-ledendag-2026',
    naam: 'Ledendag Branchevereniging 2026',
    datum: '2026-07-12',
    startTijd: '09:00',
    eindDatum: '2026-07-12',
    eindTijd: '17:00',
    status: 'DEF',
    locatie: 'Van der Valk Hotel',
    land: 'Netherlands',
    supervisor: 'Rolf Trijber',
    crew2: 'Maurice Antenbrink',
    crew3: 'N.V.T.',
    crew4: 'N.V.T.',
    crew5: 'N.V.T.',
    vragen: [
      'Wat haalt u uit deze ledendag?',
      'Welke sessie sprak u het meest aan?',
      'Hoe helpt dit event uw dagelijkse werk?',
      'Wat zou u volgend jaar anders willen zien?',
    ],
  },
  {
    id: 'prod-techcorp-2026',
    naam: 'TechCorp User Conference',
    datum: '2026-05-22',
    startTijd: '08:30',
    eindDatum: '2026-05-22',
    eindTijd: '18:00',
    status: 'OPT',
    locatie: 'RAI Amsterdam',
    land: 'Netherlands',
    supervisor: 'Rolf Trijber',
    crew2: 'N.V.T.',
    crew3: 'N.V.T.',
    crew4: 'N.V.T.',
    crew5: 'N.V.T.',
    vragen: [
      'Wat maakt dit user conference uniek voor klanten?',
      'Welke productupdate vindt u het meest relevant?',
      'Hoe gebruikt u onze oplossing in de praktijk?',
      'Wat verwacht u van het komende jaar?',
    ],
  },
]

const gasten: Omit<Gast, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'gast-anna-berg',
    productieNaam: 'DSR Jaarcongres 2026',
    type: 'Keynote speaker',
    naam: 'Dr. Anna van Berg',
    functie: 'CEO TechCorp',
    planning: '09:30 keynote, daarna interview',
    gedeeld: true,
    questions: [
      'Wat was voor u het hoogtepunt van dit congres?',
      'Welke trend ziet u de komende jaren in de sector?',
      'Wat neemt u mee naar uw organisatie?',
      'Waarom is netwerken op een congres zo waardevol?',
    ],
    status: 'Entered',
    intakeComplete: false,
    regienummer: '',
    datum: '',
    tijd: '',
  },
  {
    id: 'gast-jan-meijer',
    productieNaam: 'DSR Jaarcongres 2026',
    type: 'Keynote speaker',
    naam: 'Prof. Jan Meijer',
    functie: 'Hoogleraar Innovatie, TU Delft',
    planning: '14:00 breakout + interview',
    gedeeld: false,
    questions: [
      'Wat verraste u vandaag het meest?',
      'Hoe vertaalt innovatie zich naar de praktijk?',
      'Welk advies geeft u aan jonge professionals?',
      'Wat is uw belangrijkste takeaway?',
    ],
    status: 'Entered',
    intakeComplete: false,
    regienummer: '',
    datum: '',
    tijd: '',
  },
  {
    id: 'gast-sophie-jansen',
    productieNaam: 'Ledendag Branchevereniging 2026',
    type: 'Participant',
    naam: 'Sophie Jansen',
    functie: 'Marketingmanager',
    planning: '11:15 interviewplek lobby',
    gedeeld: true,
    questions: [
      'Wat haalt u uit deze ledendag?',
      'Welke sessie sprak u het meest aan?',
      'Hoe helpt dit event uw dagelijkse werk?',
      'Wat zou u volgend jaar anders willen zien?',
    ],
    status: 'Checked',
    intakeComplete: false,
    regienummer: '1',
    datum: '2026-07-12',
    tijd: '11:15',
  },
  {
    id: 'gast-mark-devries',
    productieNaam: 'Ledendag Branchevereniging 2026',
    type: 'Executive',
    naam: 'Mark de Vries',
    functie: 'Directeur Communicatie',
    planning: '12:00 boardroom',
    gedeeld: true,
    questions: [
      'Waarom is deze ledendag belangrijk voor uw leden?',
      'Welke boodschap neemt u mee naar de raad van bestuur?',
      'Hoe ziet u de rol van events in uw strategie?',
      'Wat maakt deze editie geslaagd?',
    ],
    status: 'Checked',
    intakeComplete: false,
    regienummer: '2',
    datum: '2026-07-12',
    tijd: '12:00',
  },
  {
    id: 'gast-lars-bakker',
    productieNaam: 'TechCorp User Conference',
    type: 'Other',
    naam: 'Lars Bakker',
    functie: 'Moderator & host',
    planning: '16:30 afsluiting',
    gedeeld: false,
    questions: [
      'Hoe kijkt u terug op deze editie?',
      'Welk moment vond u het meest energiek?',
      'Wat maakt dit user conference uniek voor klanten?',
      'Wat verwacht u van het komende jaar?',
    ],
    status: 'Entered',
    intakeComplete: false,
    regienummer: '',
    datum: '',
    tijd: '',
  },
  {
    id: 'gast-eva-smit',
    productieNaam: 'TechCorp User Conference',
    type: 'Participant',
    naam: 'Eva Smit',
    functie: 'Product owner SaaS',
    planning: '15:00 stand B12',
    gedeeld: true,
    questions: [
      'Welke productupdate vindt u het meest relevant?',
      'Hoe gebruikt u onze oplossing in de praktijk?',
      'Wat mist u nog in het platform?',
      'Zou u dit event aanbevelen aan collega\'s?',
    ],
    status: 'Recorded',
    intakeComplete: false,
    regienummer: '3',
    datum: '2026-07-11',
    tijd: '15:42',
  },
]

export async function seedDemoData(): Promise<{ created: boolean; producties: number; gasten: number }> {
  await ensureSchema()
  const existing = await fetchProducties(true)
  if (existing.some((p) => p.id === DEMO_PRODUCTIE_ID)) {
    return { created: false, producties: 0, gasten: 0 }
  }

  for (const p of producties) {
    await createProductie(p)
  }
  for (const g of gasten) {
    await createGuest(g)
  }

  return { created: true, producties: producties.length, gasten: gasten.length }
}
