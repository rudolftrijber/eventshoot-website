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
          <p class="aanbod__text">Met het Content Year jaarcontract heb je drie events per jaar op Heroes-niveau, voorrang in de agenda en een doorlopende stijl.</p>
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
