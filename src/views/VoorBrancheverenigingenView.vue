<script setup lang="ts">
import { onMounted } from 'vue'
import UspGrid from '@/components/UspGrid.vue'
import MottoStrip from '@/components/MottoStrip.vue'
import VoorWieHero from '@/components/VoorWieHero.vue'
import PainPointBlock from '@/components/PainPointBlock.vue'
import WaaromVoorJullieBlock from '@/components/WaaromVoorJullieBlock.vue'
import ContentYearTeaser from '@/components/ContentYearTeaser.vue'
import CaseTeaser from '@/components/CaseTeaser.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Voor brancheverenigingen | Eventshoot.nl',
    description: 'Één content-partner voor je jaarcongres, ledendagen en vakdagen. Geleverd binnen 48 uur, klaar voor je ledencommunicatie.',
    url: 'https://eventshoot.nl/voor/brancheverenigingen',
  })
})

const pijnpunten = [
  'Je organiseert elk jaar meerdere evenementen voor je leden, maar achteraf is er nauwelijks beeldmateriaal om op terug te kijken of mee te communiceren.',
  'Je wil laten zien dat lidmaatschap waarde heeft, maar je mist de content om dat visueel te bewijzen richting nieuwe en bestaande leden.',
  'Iemand uit het team maakt snel wat foto’s met de telefoon, maar dat straalt niet het niveau uit dat jouw vereniging verdient.',
  'De kans om van elk event een contentmoment te maken glipt telkens door je vingers.',
]

const waarom = [
  'Professionele eventfoto’s, leverbaar binnen 48 uur.',
  'Sfeerimpressie video van 1 tot 2 minuten.',
  'Social media cuts, verticaal en horizontaal.',
  'Sprekersportretten en panelshots.',
  'Same-day highlight reel, als je snel iets wil posten.',
]
</script>

<template>
  <main>
    <VoorWieHero
      label="Voor brancheverenigingen"
      title="Voor brancheverenigingen."
      sub="Eén content-partner voor je jaarcongres, ledendagen en vakdagen. Geleverd binnen 48 uur, klaar voor je ledencommunicatie."
      cta-label="Vraag een kennismaking aan"
      cta-to="/kennismaken"
      image="/eventshoot-94.jpg"
    />

    <MottoStrip body="Sprekers, deelnemers, reacties, sfeer, hoogtepunten. Elk jaarcongres of ledendag levert tientallen bruikbare momenten op. Eventshoot.nl zet die om in een complete contentbox: 25+ kant-en-klare foto's, aftermovies en interviews. Klaar voor je ledencommunicatie, terwijl het event nog top of mind is." />

    <PainPointBlock title="Dit herken je vast" :items="pijnpunten" />

    <CaseTeaser />

    <WaaromVoorJullieBlock
      title="Wat je krijgt"
      :items="waarom"
      cta-label="Bekijk pakketten"
      cta-to="/tarieven"
    />

    <ContentYearTeaser />

    <UspGrid />
  </main>
</template>
