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

usePageSeo('voorBedrijven', { url: 'https://eventshoot.nl/voor/bedrijven' })

const pijnpunten = computed(() => [
  t('bedrijven.pain1'),
  t('bedrijven.pain2'),
  t('bedrijven.pain3'),
  t('bedrijven.pain4'),
])

const waarom = computed(() => [
  t('bedrijven.offer1'),
  t('bedrijven.offer2'),
  t('bedrijven.offer3'),
  t('bedrijven.offer4'),
  t('bedrijven.offer5'),
])

</script>

<template>
  <main>
    <VoorWieHero
      :label="t('bedrijven.label')"
      :title="t('bedrijven.h1')"
      :sub="t('bedrijven.sub')"
      :cta-label="t('bedrijven.cta')"
      cta-to="/kennismaken"
      image="/eventshoot-85.jpg"
    />

    <MottoStrip :body="t('bedrijven.mottoBody')" />

    <PainPointBlock :title="t('bedrijven.painTitle')" :items="pijnpunten" />

    <CaseTeaser :photos="[
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-60.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-61.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-98.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-100.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-101.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-104.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-106.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/zakelijke-event-fotografie-8.jpg',
    ]" />

    <section class="aanbod section">
      <div class="container aanbod__inner">
        <div class="aanbod__wat">
          <h2 class="aanbod__title">{{ t('bedrijven.offerTitle') }}</h2>
          <ul class="aanbod__list">
            <li v-for="item in waarom" :key="item">
              <span class="aanbod__check">✓</span>{{ item }}
            </li>
          </ul>
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">{{ t('bedrijven.offerCta') }}</RouterLink>
        </div>
        <div class="aanbod__jaar">
          <h2 class="aanbod__title">{{ t('bedrijven.yearTitle') }}</h2>
          <p class="aanbod__text">{{ t('bedrijven.yearDesc') }}</p>
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">{{ t('bedrijven.yearCta') }}</RouterLink>
        </div>
      </div>
    </section>

    <UspGrid />

    <ClientLogoCarousel :label="t('bedrijven.trust')" />

    <FaqBlock page="voor-bedrijven" />

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
