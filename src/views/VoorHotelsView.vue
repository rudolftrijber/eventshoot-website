<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UspGrid from '@/components/UspGrid.vue'
import MottoStrip from '@/components/MottoStrip.vue'
import VoorWieHero from '@/components/VoorWieHero.vue'
import PainPointBlock from '@/components/PainPointBlock.vue'
import { RouterLink } from 'vue-router'
import CaseTeaser from '@/components/CaseTeaser.vue'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

onMounted(() => {
  useSeo({
    title: 'Voor hotels met congresfaciliteiten | Eventshoot.nl',
    description: 'Eventcontent voor de congressen die jullie hosten. Plus marketingbeelden van jullie eigen faciliteiten.',
    url: 'https://eventshoot.nl/voor/hotels',
  })
})

const pijnpunten = computed(() => [
  t('hotels.pain1'),
  t('hotels.pain2'),
  t('hotels.pain3'),
  t('hotels.pain4'),
])

const waarom = computed(() => [
  t('hotels.offer1'),
  t('hotels.offer2'),
  t('hotels.offer3'),
  t('hotels.offer4'),
  t('hotels.offer5'),
])

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
      :label="t('hotels.label')"
      :title="t('hotels.h1')"
      :sub="t('hotels.sub')"
      :cta-label="t('hotels.cta')"
      cta-to="/kennismaken"
      image="/eventshoot-88.jpg"
    />

    <MottoStrip :body="t('hotels.mottoBody')" />

    <PainPointBlock :title="t('hotels.painTitle')" :items="pijnpunten" />

    <CaseTeaser :photos="[
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-55.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-56.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-59.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-72.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-75.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-89.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-91.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-92.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-97.jpg',
    ]" />

    <section class="aanbod section">
      <div class="container aanbod__inner">
        <div class="aanbod__wat">
          <h2 class="aanbod__title">{{ t('hotels.offerTitle') }}</h2>
          <ul class="aanbod__list">
            <li v-for="item in waarom" :key="item">
              <span class="aanbod__check">✓</span>{{ item }}
            </li>
          </ul>
          <RouterLink to="/kennismaken" class="btn btn--primary aanbod__cta">{{ t('hotels.offerCta') }}</RouterLink>
        </div>
        <div class="aanbod__jaar">
          <h2 class="aanbod__title">{{ t('hotels.yearTitle') }}</h2>
          <p class="aanbod__text">{{ t('hotels.yearDesc') }}</p>
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">{{ t('hotels.yearCta') }}</RouterLink>
        </div>
      </div>
    </section>

    <UspGrid />

    <section class="trust">
      <p class="trust__label">{{ t('hotels.trust') }}</p>
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
