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
  "Iemand uit het team maakt snel wat foto's met de telefoon, maar dat straalt niet het niveau uit dat jouw vereniging verdient.",
  'De kans om van elk event een contentmoment te maken glipt telkens door je vingers.',
]

const waarom = [
  "Professionele eventfoto's, leverbaar binnen 48 uur.",
  'Sfeerimpressie video van 1 tot 2 minuten.',
  'Social media cuts, verticaal en horizontaal.',
  'Sprekersportretten en panelshots.',
  'Same-day highlight reel, als je snel iets wil posten.',
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
