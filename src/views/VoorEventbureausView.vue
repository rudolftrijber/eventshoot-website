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

const logos = [
  { file: 'gbl.png', name: 'GBL Alliance' },
  { file: 'gladwell.png', name: 'Gladwell Academy' },
  { file: 'datto.png', name: 'Datto' },
  { file: 's2grupo.png', name: 'S2Grupo' },
  { file: 'koers.png', name: 'Koers' },
  { file: 'dux.png', name: 'Dux' },
  { file: 'scpa.png', name: 'SCPA' },
  { file: 'evascript.png', name: 'EvaScript' },
  { file: 'dell.png', name: 'Dell' },
  { file: 'beelegal.png', name: 'BeeLegal' },
  { file: 'powermatching.png', name: 'Powermatching' },
  { file: 'vectocon.png', name: 'Vectocon' },
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

    <section class="trust">
      <p class="trust__label">Vertrouwd door organisaties als…</p>
      <div class="trust__track-wrap">
        <div class="trust__track">
          <div class="trust__slide" v-for="n in 2" :key="n">
            <img v-for="logo in logos" :key="logo.file + n" :src="`/DATA_EVENTSHOOT/SITE_IMAGES/OPDRACHTGEVERS/${logo.file}`" :alt="logo.name" class="trust__logo" />
          </div>
        </div>
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

.trust {
  padding: 5rem 0;
  overflow: hidden;
}
.trust__label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 1.5rem;
}
.trust__track-wrap {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
.trust__track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}
.trust__track:hover { animation-play-state: paused; }
.trust__slide {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 0 2rem;
}
.trust__logo {
  height: 120px;
  width: auto;
  object-fit: contain;
  filter: grayscale(1) brightness(1.8);
  opacity: 0.6;
  transition: filter 0.3s, opacity 0.3s;
}
.trust__logo:hover {
  filter: grayscale(0);
  opacity: 1;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
