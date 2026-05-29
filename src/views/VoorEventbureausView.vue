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
    title: 'Voor eventbureaus & DMCs | Eventshoot.nl',
    description: 'Vaste content-partner achter de schermen. Wij produceren, jullie leveren één pakket aan jullie klant.',
    url: 'https://eventshoot.nl/voor/eventbureaus',
  })
})

const pijnpunten = [
  'Jij bent verantwoordelijk voor het totaalplaatje, inclusief het visuele resultaat. Een zwakke fotograaf kan dat beeld volledig verpesten.',
  'Je hebt geen tijd om een briefing van tien pagina’s te schrijven. Je wil een professional die de sfeer aanvoelt en zelfstandig werkt.',
  'Je klant wil content snel, liefst nog dezelfde dag. Dat vraagt om iemand die begrijpt hoe de eventwereld werkt.',
  'Je zoekt geen zzp’er die je elke keer opnieuw moet uitleggen wat je verwacht, maar een vaste partner die je vertrouwt.',
]

const waarom = [
  'Volledige eventreportage, foto en video.',
  'Same-day highlights voor social media van je klant.',
  'Sprekersportretten, sfeerbeelden, detailopnames.',
  'Snelle levering voor klantrapportages.',
  'White-label mogelijk, content op naam van jouw bureau.',
]
</script>

<template>
  <main>
    <VoorWieHero
      label="Voor eventbureaus en DMC's"
      title="Voor eventbureaus en DMC's."
      sub="Vaste content-partner achter de schermen. Wij produceren, jullie leveren één pakket aan jullie klant."
      cta-label="Plan een kennismaking"
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
