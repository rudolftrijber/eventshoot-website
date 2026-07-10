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

usePageSeo('voorBranche', { url: 'https://eventshoot.nl/voor/brancheverenigingen' })

const pijnpunten = computed(() => [
  t('branche.pain1'),
  t('branche.pain2'),
  t('branche.pain3'),
  t('branche.pain4'),
])

const waarom = computed(() => [
  t('branche.offer1'),
  t('branche.offer2'),
  t('branche.offer3'),
  t('branche.offer4'),
  t('branche.offer5'),
])

</script>

<template>
  <main>
    <VoorWieHero
      :label="t('branche.label')"
      :title="t('branche.h1')"
      :sub="t('branche.sub')"
      :cta-label="t('branche.cta')"
      cta-to="/kennismaken"
      image="/eventshoot-94.jpg"
    />

    <MottoStrip :body="t('branche.mottoBody')" />

    <PainPointBlock :title="t('branche.painTitle')" :items="pijnpunten" />

    <CaseTeaser :photos="[
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-62.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-65.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-84.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-50.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-88.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-102.jpg',
      '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/zakelijke-event-fotografie-8.jpg',
    ]" />

    <section class="aanbod section">
      <div class="container aanbod__inner">
        <div class="aanbod__wat">
          <h2 class="aanbod__title">{{ t('branche.offerTitle') }}</h2>
          <ul class="aanbod__list">
            <li v-for="item in waarom" :key="item">
              <span class="aanbod__check">✓</span>{{ item }}
            </li>
          </ul>
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">{{ t('branche.offerCta') }}</RouterLink>
        </div>
        <div class="aanbod__jaar">
          <h2 class="aanbod__title">{{ t('branche.yearTitle') }}</h2>
          <p class="aanbod__text">{{ t('branche.yearDesc') }}</p>
          <RouterLink to="/tarieven" class="btn btn--primary aanbod__cta">{{ t('branche.yearCta') }}</RouterLink>
        </div>
      </div>
    </section>

    <UspGrid />

    <ClientLogoCarousel :label="t('branche.trust')" />

    <FaqBlock page="voor-brancheverenigingen" />

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
