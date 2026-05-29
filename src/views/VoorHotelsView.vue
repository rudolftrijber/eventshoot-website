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
    title: 'Voor hotels met congresfaciliteiten | Eventshoot.nl',
    description: 'Eventcontent voor de congressen die jullie hosten. Plus marketingbeelden van jullie eigen faciliteiten.',
    url: 'https://eventshoot.nl/voor/hotels',
  })
})

const pijnpunten = [
  'Je congres- en vergaderzalen staan prachtig op de foto, maar die foto’s zijn gemaakt zonder mensen, zonder sfeer, zonder leven.',
  'Eventplanners boeken op gevoel én bewijs. Als jouw website geen echte events laat zien, kiezen ze voor een locatie die dat wél doet.',
  'Na elk event verdwijnt de content in de telefoon van een gast. Er is niemand die het professioneel vastlegt voor jouw marketingkanalen.',
  'Je wil meer zakelijke boekingen aantrekken, maar je hebt geen beeldmateriaal dat overtuigt.',
]

const waarom = [
  'Locatiebeelden met mensen en sfeer.',
  'Eventreportage bruikbaar voor jouw eigen marketing.',
  'Social media content voor meerdere kanalen.',
  'Referentiemateriaal voor eventplanners en salesgesprekken.',
  'Testimonialvideo van de organiserende partij, als extra bewijs.',
]
</script>

<template>
  <main>
    <VoorWieHero
      label="Voor hotels met congresfaciliteiten"
      title="Voor hotels met congresfaciliteiten."
      sub="Eventcontent voor de congressen die jullie hosten. Plus marketingbeelden van jullie eigen faciliteiten."
      cta-label="Plan een kennismaking"
      cta-to="/kennismaken"
    />

    <PainPointBlock title="Dit herken je vast" :items="pijnpunten" />

    <WaaromVoorJullieBlock
      title="Wat je krijgt"
      :items="waarom"
      cta-label="Neem contact op"
      cta-to="/kennismaken"
    />

    <ContentYearTeaser />
    <CaseTeaser />

    <UspGrid />
  </main>
</template>
