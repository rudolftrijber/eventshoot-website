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
    title: 'Voor eventbureaus & DMCs | Eventshoot.nl',
    description: 'Vaste content-partner achter de schermen. Wij produceren, jullie leveren één pakket aan jullie klant.',
    url: 'https://eventshoot.nl/voor/eventbureaus',
  })
})

const pijnpunten = [
  'Jij bent verantwoordelijk voor het totaalplaatje, inclusief het visuele resultaat. Een zwakke fotograaf kan dat beeld volledig verpesten.',
  'Je hebt geen tijd om een briefing van tien pagina\'s te schrijven. Je wil een professional die de sfeer aanvoelt en zelfstandig werkt.',
  'Je klant wil content snel, liefst nog dezelfde dag. Dat vraagt om iemand die begrijpt hoe de eventwereld werkt.',
  'Je zoekt geen zzp\'er die je elke keer opnieuw moet uitleggen wat je verwacht, maar een vaste partner die je vertrouwt.',
]

const waarom = [
  'Volledige eventreportage (foto + video).',
  'Same-day highlights voor sociale media van je klant.',
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
      image="/eventshoot-92.jpg"
    />

    <MottoStrip body="Ik snap hoe een runsheet werkt, wat je klant verwacht en waarom timing op locatie alles is. Geen uitleg nodig, geen briefing van tien pagina's. Jij hoeft me niet te managen: ik vind mijn weg. Event na event, betrouwbaar en op niveau." />

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
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">Bekijk pakketten</RouterLink>
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
