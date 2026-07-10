<script setup lang="ts">
import { computed } from 'vue'
import ClientLogoCarousel from '@/components/ClientLogoCarousel.vue'
import { useI18n } from 'vue-i18n'
import UspGrid from '@/components/UspGrid.vue'
import MottoStrip from '@/components/MottoStrip.vue'
import VoorWieHero from '@/components/VoorWieHero.vue'
import PainPointBlock from '@/components/PainPointBlock.vue'
import { RouterLink } from 'vue-router'
import CaseTeaser from '@/components/CaseTeaser.vue'
import FaqBlock from '@/components/FaqBlock.vue'
import { usePageSeo } from '@/composables/usePageSeo'

const { t } = useI18n()

usePageSeo('voorHotels', { url: 'https://eventshoot.nl/voor/hotels' })

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

    <ClientLogoCarousel :label="t('hotels.trust')" />

    <FaqBlock page="voor-hotels" />

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
</style>
