<script setup lang="ts">
import { onMounted } from 'vue'
import UspGrid from '@/components/UspGrid.vue'
import MottoStrip from '@/components/MottoStrip.vue'
import VoorWieHero from '@/components/VoorWieHero.vue'
import PainPointBlock from '@/components/PainPointBlock.vue'
import { RouterLink } from 'vue-router'
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
  'Je congres- en vergaderzalen staan prachtig op de foto, maar die foto\'s zijn gemaakt zonder mensen, zonder sfeer, zonder leven.',
  'Eventplanners boeken op gevoel én bewijs. Als jouw website geen echte events laat zien, kiezen ze voor een locatie die dat wél doet.',
  'Na elk event verdwijnt de content in de telefoon van een gast. Er is niemand die het professioneel vastlegt voor jouw marketingkanalen.',
  'Je wil meer zakelijke boekingen aantrekken, maar je hebt geen beeldmateriaal dat overtuigt.',
]

const waarom = [
  'Locatiebeelden met mensen en sfeer.',
  'Eventreportage bruikbaar voor jouw eigen marketing.',
  'Social media content voor meerdere kanalen.',
  'Referentiemateriaal voor eventplanners en salesgesprekken.',
  'Optioneel: testimonialvideo van de organiserende partij.',
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
      image="/eventshoot-88.jpg"
    />

    <MottoStrip body="Lege zalen verkopen geen events. Authentieke beelden van echte congressen wel. Ik kom langs bij elk event dat jij faciliteert en leg de sfeer, de ruimte en de beleving vast, zodat jij het kunt gebruiken om de volgende boeking binnen te halen." />

    <PainPointBlock title="Dit herken je vast" :items="pijnpunten" />

    <CaseTeaser />

    <section class="aanbod section">
      <div class="container aanbod__inner">
        <div class="aanbod__wat">
          <h2 class="aanbod__title">Wat je krijgt</h2>
          <ul class="aanbod__list">
            <li v-for="item in waarom" :key="item">
              <span class="aanbod__check">✓</span>{{ item }}
            </li>
          </ul>
          <RouterLink to="/kennismaken" class="btn btn--primary aanbod__cta">Neem contact op</RouterLink>
        </div>
        <div class="aanbod__jaar">
          <h2 class="aanbod__title">Meerdere events per jaar?</h2>
          <p class="aanbod__text">Met het Content Year jaarcontract heb je drie events per jaar op Heroes-niveau, voorrang in de agenda en een doorlopende stijl, voor één vaste maandelijkse prijs.</p>
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">Bekijk jaarcontract</RouterLink>
        </div>
      </div>
    </section>

    <UspGrid />

    <section class="reviews section">
      <div class="container">
        <h2 class="reviews__title">Wat zeggen onze opdrachtgevers?</h2>
        <div class="elfsight-app-4ed38ed1-21e2-4238-bb5c-d1127391e146"></div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.aanbod__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}
.aanbod__title {
  font-size: clamp(1.2rem, 2.2vw, 1.7rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
}
.aanbod__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 2rem;
}
.aanbod__list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.55;
}
.aanbod__check {
  color: var(--color-accent);
  font-weight: 700;
  flex-shrink: 0;
}
.aanbod__text {
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  margin-bottom: 2rem;
}
.aanbod__cta { display: inline-flex; }
@media (max-width: 800px) {
  .aanbod__inner { grid-template-columns: 1fr; gap: 3rem; }
}

.reviews__title {
  font-size: clamp(1.3rem, 2.5vw, 1.85rem);
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
}
</style>
