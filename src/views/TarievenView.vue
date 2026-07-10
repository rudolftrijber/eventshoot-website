<script setup lang="ts">
import { computed } from 'vue'
import ClientLogoCarousel from '@/components/ClientLogoCarousel.vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PricingCard from '@/components/PricingCard.vue'
import UspGrid from '@/components/UspGrid.vue'
import FaqBlock from '@/components/FaqBlock.vue'
import OptimizedImage from '@/components/OptimizedImage.vue'
import { usePageSeo } from '@/composables/usePageSeo'

const { t, locale } = useI18n()

const isEnglish = computed(() => locale.value.startsWith('en'))

const onepagerPdf = computed(() =>
  isEnglish.value
    ? '/DATA_EVENTSHOOT/FILES/ES_onepager_ENG.pdf'
    : '/DATA_EVENTSHOOT/FILES/Eventshoot_tarievenoverzicht_nl.pdf',
)

const onepagerDownloadName = computed(() =>
  isEnglish.value
    ? 'Eventshoot_pricing_overview_EN.pdf'
    : 'Eventshoot_tarievenoverzicht_nl.pdf',
)

usePageSeo('tarieven', { url: 'https://eventshoot.nl/tarieven' })

const packages = computed(() => [
  {
    name: 'Highlight',
    price: '€825',
    description: t('pkg.highlightDesc'),
    features: [t('pkg.f4uur'), t('pkg.f100foto'), t('pkg.fSocial'), t('pkg.f48uurFotoAftermovie')],
    image: '/DATA_EVENTSHOOT/SITE_IMAGES/PRIJZEN/PHOTO.png',
    highlighted: false,
  },
  {
    name: 'Headline',
    price: '€2.250',
    description: t('pkg.headlineDesc'),
    features: [t('pkg.f8uur'), t('pkg.f150foto'), t('pkg.fSocial'), t('pkg.fCorporate'), t('pkg.fInterviews'), t('pkg.fDeliverySplit')],
    image: '/DATA_EVENTSHOOT/SITE_IMAGES/PRIJZEN/VIDEO.png',
    highlighted: true,
  },
  {
    name: 'Heroes',
    price: '€3.450',
    description: t('pkg.heroesDesc'),
    features: [t('pkg.f10uur3crew'), t('pkg.f200foto'), t('pkg.fSocial'), t('pkg.fCorporate'), t('pkg.fInterviewsHeroes'), t('pkg.fDeliverySplit')],
    image: '/DATA_EVENTSHOOT/SITE_IMAGES/PRIJZEN/INTERVIEWS.png',
    highlighted: false,
  },
])

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
            :href="onepagerPdf"
            :download="onepagerDownloadName"
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

    <!-- Event Vodcast Recording -->
    <section class="vodcast section section--dark">
      <div class="container vodcast__grid">

        <!-- Links: inleiding -->
        <div class="vodcast__left">
          <h2 class="vodcast__title">{{ t('tarieven.vodcastTitle') }}</h2>
          <p class="vodcast__intro">{{ t('tarieven.vodcastIntro') }}</p>
          <h3 class="vodcast__why-title">{{ t('tarieven.vodcastWhyTitle') }}</h3>
          <ul class="vodcast__why-list">
            <li>{{ t('tarieven.vodcastWhy1') }}</li>
            <li>{{ t('tarieven.vodcastWhy2') }}</li>
            <li>{{ t('tarieven.vodcastWhy3') }}</li>
            <li>{{ t('tarieven.vodcastWhy4') }}</li>
          </ul>
        </div>

        <!-- Rechts: pakket + prijs + CTA -->
        <div class="vodcast__right">
          <div class="vodcast__card">
            <p class="vodcast__card-eyebrow">{{ t('tarieven.vodcastWhatTitle') }}</p>
            <ul class="vodcast__list">
              <li>{{ t('tarieven.vodcastFeature1') }}</li>
              <li>{{ t('tarieven.vodcastFeature2') }}</li>
              <li>{{ t('tarieven.vodcastFeature3') }}</li>
              <li>{{ t('tarieven.vodcastFeature4') }}</li>
            </ul>
            <div class="vodcast__meta-rows">
              <div class="vodcast__price-row">
                <span>{{ t('tarieven.vodcastPriceLine1') }}</span>
                <span>{{ t('tarieven.vodcastPriceAmount1') }}</span>
              </div>
              <div class="vodcast__price-row">
                <span>{{ t('tarieven.vodcastPriceLine2') }}</span>
                <span>{{ t('tarieven.vodcastPriceAmount2') }}</span>
              </div>
            </div>
            <div class="vodcast__price-block">
              <p class="vodcast__price">{{ t('tarieven.vodcastPrice') }} <span>{{ t('tarieven.vodcastPricePer') }}</span></p>
              <p class="vodcast__sub">{{ t('tarieven.vodcastSub') }}</p>
            </div>
            <RouterLink to="/kennismaken" class="btn btn--primary btn--full">{{ t('tarieven.vodcastCta') }}</RouterLink>
            <a
              href="/DATA_EVENTSHOOT/FILES/Eventshoot_Vodcast_Onepager.pdf"
              download="Eventshoot_Vodcast_Onepager.pdf"
              class="vodcast__download"
            >
              {{ t('tarieven.vodcastDownload') }}
            </a>
          </div>
        </div>

      </div>
    </section>

    <UspGrid />

    <FaqBlock page="tarieven" />

    <ClientLogoCarousel :label="t('tarieven.trust')" />
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

.vodcast {
}

.vodcast__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}

.vodcast__title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 1.5rem;
  line-height: 1.15;
}

.vodcast__intro {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.vodcast__why-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 1.75rem 0 0.75rem;
}

.vodcast__why-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.vodcast__why-list li {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.75);
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.5;
}

.vodcast__why-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-blue);
  font-weight: 700;
}

.vodcast__card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.vodcast__card-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin: 0;
}

.vodcast__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
}

.vodcast__list li {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.5;
}

.vodcast__list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-accent);
  font-weight: 700;
}

.vodcast__meta-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.25rem;
}

.vodcast__price-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.75);
}

.vodcast__price-row span:last-child {
  color: rgba(255,255,255,0.9);
  font-weight: 600;
  white-space: nowrap;
}

.vodcast__price-block {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.25rem;
}

.vodcast__price {
  font-size: 2.75rem;
  font-weight: 900;
  color: var(--color-accent);
  line-height: 1;
  margin: 0 0 0.25rem;
}

.vodcast__price span {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255,255,255,0.55);
}

.vodcast__sub {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.45);
  margin: 0;
}

.vodcast__download {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.55);
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.vodcast__download:hover {
  color: #fff;
}

.btn--full {
  width: 100%;
  text-align: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .tarieven-hero { aspect-ratio: unset; width: 100%; }
}

@media (max-width: 900px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin: 0 auto;
  }

  .vodcast__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}
</style>
