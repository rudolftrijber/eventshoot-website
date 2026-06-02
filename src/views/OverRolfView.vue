<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import FaqBlock from '@/components/FaqBlock.vue'
import OptimizedImage from '@/components/OptimizedImage.vue'

const { t } = useI18n()

usePageSeo('overRolf', { url: 'https://eventshoot.nl/over-rolf' })
</script>

<template>
  <main>

    <!-- Hero -->
    <section class="over-hero">
      <div class="over-hero__bg">
        <OptimizedImage
          src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_werk.jpg"
          alt="Rolf Trijber aan het werk als eventfotograaf"
          preset="hero"
          :priority="true"
        />
        <div class="over-hero__overlay"></div>
      </div>
      <div class="container over-hero__content">
        <h1>{{ t('overRolf.h1') }}</h1>
        <p>{{ t('overRolf.sub') }}</p>
        <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">{{ t('overRolf.cta') }}</RouterLink>
      </div>
    </section>

    <!-- Origin story -->
    <section class="story section">
      <div class="container story__grid">
        <div class="story__text">
          <h2 class="story__motto">{{ t('overRolf.motto') }}</h2>
          <p>{{ t('overRolf.story1') }}</p>
          <p>{{ t('overRolf.story2') }}</p>
        </div>
        <div class="story__photo">
          <OptimizedImage src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_team.jpg" alt="Rolf Trijber in actie op een event" preset="content" />
        </div>
      </div>
    </section>

    <!-- Meer dan een fotograaf -->
    <section class="meer section section--blue">
      <div class="container meer__grid">
        <div class="meer__photo">
          <OptimizedImage src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_eventshoot.jpg" alt="Rolf Trijber in actie op een congres" preset="content" />
        </div>
        <div class="meer__text">
          <h2>{{ t('overRolf.meerH2') }}</h2>
          <p>{{ t('overRolf.meer1') }}</p>
          <p>{{ t('overRolf.meer2') }}</p>
        </div>
      </div>
    </section>

    <!-- Langetermijnrelaties -->
    <section class="relaties section">
      <div class="container relaties__grid">
        <div class="relaties__text">
          <h2>{{ t('overRolf.relatiesH2') }}</h2>
          <p>{{ t('overRolf.relaties1') }}</p>
          <p>{{ t('overRolf.relaties2') }}</p>
          <p class="relaties__cta-tekst">{{ t('overRolf.relaties3') }}</p>
        </div>
        <div class="relaties__photo">
          <OptimizedImage src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_interview.jpg" alt="Rolf Trijber bij een interview op locatie" preset="content" />
        </div>
      </div>
    </section>

    <!-- Buiten de lens -->
    <section class="buiten section">
      <div class="container buiten__inner">
        <h2 class="buiten__title">{{ t('overRolf.buitenH2') }}</h2>
        <p class="buiten__text">{{ t('overRolf.buiten1') }}</p>
        <p class="buiten__link-wrap">
          <RouterLink to="/gallery" class="buiten__link">{{ t('overRolf.buitenLink') }}</RouterLink>
        </p>
      </div>
    </section>

    <!-- Actie kaarten -->
    <section class="actie section">
      <div class="container">
        <h2 class="actie__title">{{ t('overRolf.actieH2') }}</h2>
        <div class="actie__grid">
          <div class="actie__card">
            <h3>{{ t('overRolf.actie1H3') }}</h3>
            <p>{{ t('overRolf.actie1P') }}</p>
            <a href="tel:+31625177728" class="btn btn--primary">{{ t('overRolf.actie1Btn') }}</a>
          </div>
          <div class="actie__card">
            <h3>{{ t('overRolf.actie2H3') }}</h3>
            <p>{{ t('overRolf.actie2P') }}</p>
            <RouterLink to="/tarieven" class="btn btn--primary">{{ t('overRolf.actie2Btn') }}</RouterLink>
          </div>
          <div class="actie__card">
            <h3>{{ t('overRolf.actie3H3') }}</h3>
            <p>{{ t('overRolf.actie3P') }}</p>
            <RouterLink to="/eventvideo" class="btn btn--primary">{{ t('overRolf.actie3Btn') }}</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <FaqBlock page="over-rolf" />

  </main>
</template>

<style scoped>
/* Hero */
.over-hero {
  position: relative;
  aspect-ratio: 16/9;
  min-height: 420px;
  display: flex;
  align-items: center;
}

.over-hero__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.over-hero__bg :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.over-hero__bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.over-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 100%);
}

.over-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 680px;
}

.over-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.over-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  margin-bottom: 2rem;
  line-height: 1.75;
}

/* Origin story */
.story__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.story__motto {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  font-style: italic;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.story__text p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.78);
  line-height: 1.85;
  margin-bottom: 1rem;
}

.story__photo :deep(picture),
.story__photo :deep(img) {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 16/9;
}

/* Meer dan een fotograaf */
.meer__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.meer__photo {
  display: flex;
  justify-content: center;
}

.meer__photo :deep(picture) {
  width: 80%;
  margin: 0 auto;
}

.meer__photo :deep(img) {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 4/5;
}

.meer__text h2 {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.meer__text p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.78);
  line-height: 1.85;
  margin-bottom: 1rem;
}

/* Langetermijnrelaties */
.relaties__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.relaties__text h2 {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.relaties__text p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.78);
  line-height: 1.85;
  margin-bottom: 1rem;
}

.relaties__cta-tekst {
  color: #fff !important;
  font-weight: 600;
}

.relaties__photo :deep(picture),
.relaties__photo :deep(img) {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 4/5;
}

/* Buiten de lens */
.buiten {
  background: rgba(255, 140, 0, 0.42) !important;
}

.buiten__inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.buiten__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
}

.buiten__text {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.9);
  line-height: 1.85;
  margin-bottom: 1.25rem;
}

.buiten__passie {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.buiten__link-wrap {
  margin-top: 1.5rem;
}

.buiten__link {
  color: #fff;
  text-decoration: underline;
  font-weight: 600;
}
.buiten__link:hover {
  opacity: 0.8;
}

/* Actie kaarten */
.actie__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
}

.actie__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.actie__card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.actie__card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.actie__card p {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.65;
  flex: 1;
}

@media (max-width: 900px) {
  .story__grid,
  .meer__grid,
  .relaties__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .meer__photo { order: -1; }
}

@media (max-width: 768px) {
  .actie__grid { grid-template-columns: 1fr; }
  .over-hero { aspect-ratio: unset; width: 100%; }
}
</style>
