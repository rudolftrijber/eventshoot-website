<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PricingCard from '@/components/PricingCard.vue'
import UspGrid from '@/components/UspGrid.vue'
import FaqBlock from '@/components/FaqBlock.vue'
import OptimizedImage from '@/components/OptimizedImage.vue'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

onMounted(() => {
  useSeo({
    title: 'Tarieven voor eventcontent | Eventshoot.nl',
    description: 'Drie pakketten voor eventfotografie en eventvideo. Highlight vanaf €895, Headline €2.250, Heroes €3.450. Inclusief aftermovie en levering binnen 48 uur.',
    url: 'https://eventshoot.nl/tarieven',
  })
})

const packages = computed(() => [
  {
    name: 'Highlight',
    price: '€895',
    description: t('pkg.highlightDesc'),
    features: [t('pkg.f4uur'), t('pkg.f100foto'), t('pkg.fSocial'), t('pkg.f24uur'), t('pkg.fGalerij')],
    image: '/DATA_EVENTSHOOT/SITE_IMAGES/PRIJZEN/PHOTO.png',
    highlighted: false,
  },
  {
    name: 'Headline',
    price: '€2.250',
    description: t('pkg.headlineDesc'),
    features: [t('pkg.f8uur'), t('pkg.f150foto'), t('pkg.fSocial'), t('pkg.fInterviews'), t('pkg.f48uur'), t('pkg.fGalerij')],
    image: '/DATA_EVENTSHOOT/SITE_IMAGES/PRIJZEN/VIDEO.png',
    highlighted: true,
  },
  {
    name: 'Heroes',
    price: '€3.450',
    description: t('pkg.heroesDesc'),
    features: [t('pkg.f8uur2crew'), t('pkg.f200foto'), t('pkg.fSocial'), t('pkg.fCorporate'), t('pkg.fInterviews'), t('pkg.fDrone'), t('pkg.f48uur')],
    image: '/DATA_EVENTSHOOT/SITE_IMAGES/PRIJZEN/INTERVIEWS.png',
    highlighted: false,
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
    <section class="tarieven-hero">
      <div class="tarieven-hero__bg">
        <OptimizedImage src="/eventshoot-84.jpg" alt="Eventfotografie tarieven Eventshoot.nl" preset="hero" :priority="true" />
        <div class="tarieven-hero__overlay"></div>
      </div>
      <div class="container tarieven-hero__content">
        <h1>{{ t('tarieven.h1') }}</h1>
        <p>{{ t('tarieven.sub') }}</p>
        <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">{{ t('tarieven.cta') }}</RouterLink>
      </div>
    </section>

    <!-- Pakketten -->
    <section class="pricing section">
      <div class="container">
        <div class="pricing-grid">
          <PricingCard
            v-for="pkg in packages"
            :key="pkg.name"
            v-bind="pkg"
          />
        </div>
        <div class="download-cta">
          <p class="download-cta__sub">{{ t('tarieven.downloadText') }}</p>
          <a
            href="/DATA_EVENTSHOOT/FILES/Eventshoot_onepager.pdf"
            download
            class="btn btn--primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" style="flex-shrink:0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {{ t('tarieven.downloadBtn') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Motto strook -->
    <section class="motto-bar">
      <div class="container motto-bar__inner">
        <p class="motto-bar__text">{{ t('tarieven.motto') }}</p>
      </div>
    </section>

    <!-- Content Year jaarcontract -->
    <section class="content-year section section--dark">
      <div class="container content-year__grid">

        <!-- Links: inleiding -->
        <div class="content-year__left">
          <h2 class="content-year__title">{{ t('tarieven.jaarcontract') }}</h2>
          <p class="content-year__intro">{{ t('tarieven.jaarLeft1') }}</p>
          <p class="content-year__intro">{{ t('tarieven.jaarLeft2') }}</p>
          <h3 class="content-year__why-title">{{ t('tarieven.jaarWhyTitle') }}</h3>
          <ul class="content-year__why-list">
            <li>{{ t('tarieven.jaarWhy1') }}</li>
            <li>{{ t('tarieven.jaarWhy2') }}</li>
            <li>{{ t('tarieven.jaarWhy3') }}</li>
            <li>{{ t('tarieven.jaarWhy4') }}</li>
          </ul>
        </div>

        <!-- Rechts: wat je krijgt + prijs + CTA -->
        <div class="content-year__right">
          <div class="content-year__card">
            <p class="content-year__card-eyebrow">{{ t('tarieven.jaarWhatTitle') }}</p>
            <ul class="content-year__list">
              <li>{{ t('tarieven.jaarFeature1') }}</li>
              <li>{{ t('tarieven.jaarFeature2') }}</li>
              <li>{{ t('tarieven.jaarFeature3') }}</li>
              <li>{{ t('tarieven.jaarFeature4') }}</li>
              <li>{{ t('tarieven.jaarFeature5') }}</li>
              <li>{{ t('tarieven.jaarFeature6') }}</li>
              <li>{{ t('tarieven.jaarFeature7') }}</li>
              <li>{{ t('tarieven.jaarFeature8') }}</li>
            </ul>
            <div class="content-year__price-block">
              <p class="content-year__price">{{ t('tarieven.jaarPrice') }} <span>{{ t('tarieven.jaarPricePer') }}</span></p>
              <p class="content-year__sub">{{ t('tarieven.jaarSub') }}</p>
            </div>
            <RouterLink to="/kennismaken" class="btn btn--primary btn--full">{{ t('tarieven.jaarCta') }}</RouterLink>
          </div>
        </div>

      </div>
    </section>

    <UspGrid />

    <FaqBlock page="tarieven" />

    <!-- Vertrouwd door organisaties -->
    <section class="trust">
      <p class="trust__label">{{ t('tarieven.trust') }}</p>
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
.tarieven-hero {
  position: relative;
  aspect-ratio: 16/9;
  min-height: 420px;
  display: flex;
  align-items: center;
}

.tarieven-hero__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.tarieven-hero__bg :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.tarieven-hero__bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tarieven-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 100%);
}

.tarieven-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 680px;
}

.tarieven-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.tarieven-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  margin-bottom: 2rem;
  line-height: 1.75;
}


.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: stretch;
  margin: 3rem 0 2rem;
}

.download-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.download-cta__sub {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.65);
  margin: 0;
}

.download-cta .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
}

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

.content-year {
}

.content-year__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}

.content-year__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.5rem;
}

.content-year__title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 1.5rem;
  line-height: 1.15;
}

.content-year__intro {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.content-year__why-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 1.75rem 0 0.75rem;
}

.content-year__why-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.content-year__why-list li {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.75);
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.5;
}

.content-year__why-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-blue);
  font-weight: 700;
}

.content-year__card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.content-year__card-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin: 0;
}

.content-year__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
}

.content-year__list li {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.5;
}

.content-year__list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-accent);
  font-weight: 700;
}

.content-year__price-block {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.25rem;
}

.content-year__price {
  font-size: 2.75rem;
  font-weight: 900;
  color: var(--color-accent);
  line-height: 1;
  margin: 0 0 0.25rem;
}

.content-year__price span {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255,255,255,0.55);
}

.content-year__sub {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.45);
  margin: 0;
}

.btn--full {
  width: 100%;
  text-align: center;
  justify-content: center;
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

.trust__track:hover {
  animation-play-state: paused;
}

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
  flex-shrink: 0;
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@media (max-width: 900px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin: 0 auto;
  }

  .content-year__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}
</style>
