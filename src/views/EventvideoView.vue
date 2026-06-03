<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/SectionHeading.vue'
import UspGrid from '@/components/UspGrid.vue'
import FaqBlock from '@/components/FaqBlock.vue'
import OptimizedImage from '@/components/OptimizedImage.vue'
import { usePageSeo } from '@/composables/usePageSeo'

const { t } = useI18n()

usePageSeo('eventvideo', { url: 'https://eventshoot.nl/eventvideo' })

onMounted(() => {
  const existing = document.getElementById('service-schema-eventvideo')
  if (existing) return
  const script = document.createElement('script')
  script.id = 'service-schema-eventvideo'
  script.type = 'application/ld+json'
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Eventvideo',
    name: 'Eventvideo en aftermovies',
    provider: { '@type': 'LocalBusiness', name: 'Eventshoot.nl' },
    areaServed: 'Nederland',
    description: 'Eventvideo\'s en aftermovies voor congressen en zakelijke events.',
  })
  document.head.appendChild(script)
})

const videoTypes = computed(() => [
  {
    title: t('ev.type1Title'),
    duration: t('ev.type1Duration'),
    ideal: t('ev.type1Ideal'),
    desc: t('ev.type1Desc'),
  },
  {
    title: t('ev.type2Title'),
    duration: t('ev.type2Duration'),
    ideal: t('ev.type2Ideal'),
    desc: t('ev.type2Desc'),
  },
  {
    title: t('ev.type3Title'),
    duration: t('ev.type3Duration'),
    ideal: t('ev.type3Ideal'),
    desc: t('ev.type3Desc'),
  },
  {
    title: t('ev.type4Title'),
    duration: t('ev.type4Duration'),
    ideal: t('ev.type4Ideal'),
    desc: t('ev.type4Desc'),
  },
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
    <!-- Hero -->
    <section class="ev-hero">
      <div class="ev-hero__bg">
        <OptimizedImage
          src="/DATA_EVENTSHOOT/SITE_IMAGES/VIDEO/eventshoot-71.jpg"
          alt="Eventvideo opname tijdens zakelijk congres"
          preset="hero"
          :priority="true"
        />
        <div class="ev-hero__overlay"></div>
      </div>
      <div class="container ev-hero__content">
        <h1>{{ t('ev.h1') }}</h1>
        <p>{{ t('ev.sub') }}</p>
        <div class="ev-hero__btns">
          <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">{{ t('ev.cta1') }}</RouterLink>
          <RouterLink to="/tarieven" class="btn btn--outline btn--lg">{{ t('ev.cta2') }}</RouterLink>
        </div>
      </div>
    </section>

    <!-- Motto strook -->
    <section class="motto-bar">
      <div class="container motto-bar__inner">
        <p class="motto-bar__text">{{ t('ev.motto') }}</p>
      </div>
    </section>

    <!-- Video voorbeelden: 4 stroken -->
    <section class="ev-block ev-block--1 section">
      <div class="container ev-block__inner ev-block__inner--normal">
        <div class="ev-block__video">
          <iframe src="https://player.vimeo.com/video/1139974588?h=d77d047995&background=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="ev-block__text">
          <h2 class="ev-block__title">{{ t('ev.block1Title') }}</h2>
          <p class="ev-block__desc">{{ t('ev.block1Desc') }}</p>
          <RouterLink to="/tarieven" class="btn btn--primary">{{ t('ev.block1Cta') }}</RouterLink>
        </div>
      </div>
    </section>

    <section class="ev-block ev-block--2 section">
      <div class="container ev-block__inner ev-block__inner--reversed">
        <div class="ev-block__video">
          <iframe src="https://player.vimeo.com/video/1177248996?background=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="ev-block__text">
          <h2 class="ev-block__title">{{ t('ev.block2Title') }}</h2>
          <p class="ev-block__desc">{{ t('ev.block2Desc') }}</p>
          <RouterLink to="/tarieven" class="btn btn--primary">{{ t('ev.block2Cta') }}</RouterLink>
        </div>
      </div>
    </section>

    <section class="ev-block ev-block--3 section">
      <div class="container ev-block__inner ev-block__inner--normal">
        <div class="ev-block__video">
          <iframe src="https://player.vimeo.com/video/1085449090?background=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="ev-block__text">
          <h2 class="ev-block__title">{{ t('ev.block3Title') }}</h2>
          <p class="ev-block__desc">{{ t('ev.block3Desc') }}</p>
          <RouterLink to="/kennismaken" class="btn btn--primary">{{ t('ev.block3Cta') }}</RouterLink>
        </div>
      </div>
    </section>

    <section class="ev-block ev-block--4 section">
      <div class="container ev-block__inner ev-block__inner--reversed">
        <div class="ev-block__video">
          <iframe src="https://player.vimeo.com/video/1196606331?background=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="ev-block__text">
          <h2 class="ev-block__title">{{ t('ev.block4Title') }}</h2>
          <p class="ev-block__desc">{{ t('ev.block4Desc') }}</p>
          <RouterLink to="/kennismaken" class="btn btn--primary">{{ t('ev.block4Cta') }}</RouterLink>
        </div>
      </div>
    </section>

    <!-- Video types -->
    <section class="video-types section section--blue">
      <div class="container">
        <SectionHeading :title="t('ev.typesTitle')" :subtitle="t('ev.typesSub')" />
        <div class="video-types__grid">
          <div v-for="t in videoTypes" :key="t.title" class="video-types__card">
            <h3 class="video-types__title">{{ t.title }}</h3>
            <div class="video-types__meta">
              <span>⏱ {{ t.duration }}</span>
              <span>✓ {{ t.ideal }}</span>
            </div>
            <p class="video-types__desc">{{ t.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Logo carousel -->
    <section class="trust">
      <p class="trust__label">{{ t('ev.trust') }}</p>
      <div class="trust__track-wrap">
        <div class="trust__track">
          <div class="trust__slide" v-for="n in 2" :key="n">
            <img v-for="logo in logos" :key="logo.file + n" :src="`/DATA_EVENTSHOOT/SITE_IMAGES/OPDRACHTGEVERS/${logo.file}`" :alt="logo.name" class="trust__logo" />
          </div>
        </div>
      </div>
    </section>

    <!-- USP -->
    <UspGrid />

    <FaqBlock page="eventvideo" />

    <!-- Reviews -->
    <section class="reviews">
      <div class="container">
        <SectionHeading :title="t('ev.reviewsTitle')" />
        <div class="elfsight-app-4ed38ed1-21e2-4238-bb5c-d1127391e146"></div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Hero */
.ev-hero {
  position: relative;
  aspect-ratio: 16/9;
  min-height: 420px;
  display: flex;
  align-items: center;
}

.ev-hero__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.ev-hero__bg :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.ev-hero__bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ev-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 100%);
}

.ev-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 680px;
}

.ev-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.ev-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  margin-bottom: 2rem;
  line-height: 1.75;
}

.ev-hero__btns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Motto bar */
.motto-bar {
  background: rgba(255, 140, 0, 0.42);
  padding: 3rem 0;
}

.motto-bar__inner {
  text-align: center;
}

.motto-bar__text {
  font-size: clamp(1.4rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #fff;
  font-style: italic;
}

/* Video blokken */
.ev-block--1,
.ev-block--3 {
  background: transparent;
}

.ev-block--2,
.ev-block--4 {
  background: rgba(49, 159, 232, 0.40);
}

.ev-block__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.ev-block__inner--reversed {
  direction: rtl;
}

.ev-block__inner--reversed > * {
  direction: ltr;
}

.ev-block__video {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
}

.ev-block__video iframe,
.ev-block__video video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.ev-block__title {
  font-size: clamp(1.3rem, 2.2vw, 1.85rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}

.ev-block__desc {
  font-size: 0.975rem;
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: 1.75rem;
}

/* Video types */
.video-types__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-top: 2rem;
}

.video-types__card {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: background var(--transition);
}

.video-types__card:hover {
  background: rgba(0, 0, 0, 0.50);
}

.video-types__title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.video-types__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-accent);
  font-weight: 500;
}

.video-types__desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
}

/* Logo carousel */
.trust {
  padding: 2.5rem 0;
  overflow: hidden;
}

.trust__label {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.trust__track-wrap {
  overflow: hidden;
}

.trust__track {
  display: flex;
  width: max-content;
  animation: scroll-logos 30s linear infinite;
}

.trust__slide {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding-right: 3rem;
}

.trust__logo {
  height: 120px;
  width: auto;
  object-fit: contain;
}

@keyframes scroll-logos {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Reviews */
.reviews {
  padding: 4rem 0;
}

/* Responsive */
@media (max-width: 900px) {
  .video-types__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .ev-hero { aspect-ratio: unset; width: 100%; }

  .ev-block__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    direction: ltr;
  }
  .video-types__grid { grid-template-columns: 1fr; }
  .ev-packages__row {
    grid-template-columns: 1fr;
  }
}
</style>
