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
    title: 'Voor bedrijven met eigen events | Eventshoot.nl',
    description: 'User conferences, klantdagen, bedrijfsbijeenkomsten. Eén productiedag, een contentbox waar je marketeer maanden mee vooruit kan.',
    url: 'https://eventshoot.nl/voor/bedrijven',
  })
})

const pijnpunten = [
  'Je organiseert een klantdag, productlancering of personeelsevenement, maar de fotografie is een bijgedachte tot twee dagen van tevoren.',
  'Iemand van marketing of HR krijgt de camera in handen gedrukt terwijl ze eigenlijk iets heel anders moeten doen.',
  'Na het event heb je een map vol matige foto\'s waar je weinig mee kunt op LinkedIn, in je jaarverslag of in je nieuwsbrief.',
  'Je weet dat je event een goudmijn is aan content, maar je haalt er structureel te weinig uit.',
]

const waarom = [
  'Professionele eventfoto\'s, leverbaar binnen 48 uur.',
  'Sfeerfilm of aftermovie.',
  'Social media cuts, verticaal en horizontaal.',
  'Sprekersportretten.',
  'Optioneel: interviews met klanten of collega\'s.',
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
      image="/eventshoot-85.jpg"
    />

    <MottoStrip body="Je steekt energie, geld en tijd in je event. Het zou zonde zijn als de enige herinnering een map met telefoonbeelden is. Eventshoot.nl zet elk zakelijk event om in een contentbron: voor je LinkedIn, je nieuwsbrief, je jaarverslag en je volgende sales pitch." />

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
