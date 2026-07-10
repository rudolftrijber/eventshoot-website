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

usePageSeo('voorBureaus', { url: 'https://eventshoot.nl/voor/eventbureaus' })

const pijnpunten = computed(() => [
  t('bureaus.pain1'),
  t('bureaus.pain2'),
  t('bureaus.pain3'),
  t('bureaus.pain4'),
])

const waarom = computed(() => [
  t('bureaus.offer1'),
  t('bureaus.offer2'),
  t('bureaus.offer3'),
  t('bureaus.offer4'),
  t('bureaus.offer5'),
])

</script>

<template>
  <main>
    <VoorWieHero
      :label="t('bureaus.label')"
      :title="t('bureaus.h1')"
      :sub="t('bureaus.sub')"
      :cta-label="t('bureaus.cta')"
      cta-to="/kennismaken"
      image="/eventshoot-70.jpg"
    />

    <MottoStrip :body="t('bureaus.mottoBody')" />

    <PainPointBlock :title="t('bureaus.painTitle')" :items="pijnpunten" />

    <CaseTeaser :photos="[
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-51.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-52.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-53.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-66.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-74.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-76.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-107.jpg',
    ]" />

    <section class="aanbod section">
      <div class="container aanbod__inner">
        <div class="aanbod__wat">
          <h2 class="aanbod__title">{{ t('bureaus.offerTitle') }}</h2>
          <ul class="aanbod__list">
            <li v-for="item in waarom" :key="item">
              <span class="aanbod__check">✓</span>{{ item }}
            </li>
          </ul>
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">{{ t('bureaus.offerCta') }}</RouterLink>
        </div>
        <div class="aanbod__jaar">
          <h2 class="aanbod__title">{{ t('bureaus.yearTitle') }}</h2>
          <p class="aanbod__text">{{ t('bureaus.yearDesc') }}</p>
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">{{ t('bureaus.yearCta') }}</RouterLink>
        </div>
      </div>
    </section>

    <UspGrid />

    <ClientLogoCarousel :label="t('bureaus.trust')" />

    <FaqBlock page="voor-eventbureaus" />

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
