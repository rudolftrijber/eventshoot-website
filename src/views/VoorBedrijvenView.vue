<script setup lang="ts">
import { onMounted } from 'vue'
import UspGrid from '@/components/UspGrid.vue'
import VoorWieHero from '@/components/VoorWieHero.vue'
import PainPointBlock from '@/components/PainPointBlock.vue'
import WaaromVoorJullieBlock from '@/components/WaaromVoorJullieBlock.vue'
import ContentYearTeaser from '@/components/ContentYearTeaser.vue'
import CaseTeaser from '@/components/CaseTeaser.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Voor bedrijven met eigen events | Eventshoot.nl',
    description: 'User conferences, klantdagen, bedrijfsbijeenkomsten. Eén productiedag, een contentbox waar je marketeer maanden mee vooruit kan.',
    url: 'https://eventshoot.nl/voor/bedrijven',
  })
})

const pijnpunten = [
  'Je organiseert een klantdag, productlancering of personeelsevenement, maar de fotografie is een bijgedachte tot twee dagen van tevoren.',
  'Iemand van marketing of HR krijgt de camera in handen gedrukt terwijl ze eigenlijk iets heel anders moeten doen.',
  'Na het event heb je een map vol matige foto’s waar je weinig mee kunt op LinkedIn, in je jaarverslag of in je nieuwsbrief.',
  'Je weet dat je event een goudmijn is aan content, maar je haalt er structureel te weinig uit.',
]

const waarom = [
  'Professionele eventfoto’s, leverbaar binnen 48 uur.',
  'Sfeerfilm of aftermovie.',
  'Social media cuts, verticaal en horizontaal.',
  'Sprekersportretten.',
  'Interviews met klanten of collega’s, als je extra bewijs wil.',
]
</script>

<template>
  <main>
    <VoorWieHero
      label="Voor bedrijven met eigen events"
      title="Voor bedrijven met eigen events."
      sub="User conferences, klantdagen, bedrijfsbijeenkomsten. Eén productiedag, een contentbox waar je marketeer maanden mee vooruit kan."
      cta-label="Vraag een offerte aan"
      cta-to="/kennismaken"
    />

    <PainPointBlock title="Dit herken je vast" :items="pijnpunten" />

    <WaaromVoorJullieBlock
      title="Wat je krijgt"
      :items="waarom"
      cta-label="Bekijk pakketten"
      cta-to="/tarieven"
    />

    <ContentYearTeaser />
    <CaseTeaser />

    <UspGrid />
  </main>
</template>
