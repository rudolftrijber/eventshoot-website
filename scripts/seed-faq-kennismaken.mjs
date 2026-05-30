/**
 * Seed de 4 Kennismaken-FAQ's naar Sanity.
 * Gebruik: SANITY_TOKEN=<token> node scripts/seed-faq-kennismaken.mjs
 */

import { createClient } from '@sanity/client'

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'pn3eisnr'
const DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_TOKEN

if (!TOKEN) {
  console.error('❌  Geen token. Gebruik: SANITY_TOKEN=sk... node scripts/seed-faq-kennismaken.mjs')
  console.error('    Token aanmaken: sanity.io/manage → project → API → Tokens (Editor)')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  useCdn: false,
  apiVersion: '2026-05-08',
})

const items = [
  {
    _id: 'faq-kennismaken-1',
    sortOrder: 1,
    questionNl: 'Hoe snel reageert Rolf?',
    answerNl: 'Doorgaans binnen een paar uur op werkdagen. Rolf reageert persoonlijk, geen callcenter.',
    questionEn: 'How quickly does Rolf respond?',
    answerEn: 'Usually within a few hours on working days. Rolf responds personally, no call centre.',
  },
  {
    _id: 'faq-kennismaken-2',
    sortOrder: 2,
    questionNl: 'Wat kost een kennismaking?',
    answerNl: 'Een kennismaking is gratis en vrijblijvend. Geen verplichtingen.',
    questionEn: 'How much does an introductory call cost?',
    answerEn: 'An introductory call is free and without obligation. No commitments.',
  },
  {
    _id: 'faq-kennismaken-3',
    sortOrder: 3,
    questionNl: 'Kan ik ook last-minute boeken?',
    answerNl: 'Bel direct: 06 251 777 28. Rolf probeert altijd iets te regelen als de agenda het toelaat.',
    questionEn: 'Can I book last-minute?',
    answerEn: 'Call directly: +31 6 251 777 28. Rolf always tries to arrange something if the calendar allows.',
  },
  {
    _id: 'faq-kennismaken-4',
    sortOrder: 4,
    questionNl: 'Werkt Rolf door heel Nederland?',
    answerNl: 'Ja, Eventshoot.nl is actief door heel Nederland. Reiskosten worden separaat berekend.',
    questionEn: 'Does Rolf work throughout the Netherlands?',
    answerEn: 'Yes, Eventshoot.nl is active throughout the Netherlands. Travel costs are calculated separately.',
  },
]

async function run() {
  console.log(`\n📋 FAQ Kennismaken seeden → Sanity (${PROJECT_ID} / ${DATASET})\n`)

  for (const item of items) {
    await client.createOrReplace({
      _type: 'faqItem',
      _id: item._id,
      active: true,
      category: 'algemeen',
      showOn: ['kennismaken'],
      sortOrder: item.sortOrder,
      questionNl: item.questionNl,
      answerNl: item.answerNl,
      questionEn: item.questionEn,
      answerEn: item.answerEn,
    })
    console.log(`  ✅  ${item.questionNl}`)
  }

  console.log('\n✨ Klaar. Open http://localhost:5173/kennismaken om te controleren.\n')
}

run().catch(err => {
  console.error('❌ Fout:', err.message)
  process.exit(1)
})
