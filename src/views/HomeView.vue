<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UspGrid from '@/components/UspGrid.vue'
import PricingCard from '@/components/PricingCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Eventfotograaf Nederland | Eventshoot.nl',
    description: 'Professionele eventfotografie en eventvideo voor congressen, seminars en zakelijke bijeenkomsten. 40+ jaar ervaring. Geleverd binnen 48 uur.',
  })
})

const clients = ['GBL', 'Gladwell', 'Datto', 'S2Grupo', 'Koers', 'Dux', 'SCPA', 'EvaScript', 'Dell']

const teaserImages = [
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-50-1-scaled.jpg', alt: 'Eventfotografie congres Nederland' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-52-1.jpg', alt: 'Zakelijk evenement fotograaf' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-53-1.jpg', alt: 'Eventfotograaf seminar' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-54-1-scaled.jpg', alt: 'Congres fotografie Nederland' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-56-1.jpg', alt: 'Professionele eventfotografie' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-57-1-scaled.jpg', alt: 'Evenement fotograaf zakelijk' },
]
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero__bg">
        <img
          src="https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-58-1-scaled.jpg"
          alt="Professionele eventfotograaf in actie tijdens een zakelijk congres"
          class="hero__img"
        />
        <div class="hero__overlay"></div>
      </div>
      <div class="container hero__content">
        <h1 class="hero__title">Jouw zakelijke event verdient meer dan een paar telefoonfotos.</h1>
        <p class="hero__subtitle">Professionele eventfotografie en -video voor congressen, conferenties en zakelijke bijeenkomsten door heel Nederland. Snel geleverd, direct bruikbaar.</p>
        <div class="hero__ctas">
          <RouterLink to="/contact" class="btn btn--primary btn--lg">Neem contact op</RouterLink>
          <RouterLink to="/tarieven" class="btn btn--outline btn--lg">Bekijk de paketten</RouterLink>
        </div>
      </div>
    </section>

    <!-- Trust logos -->
    <section class="trust section--dark">
      <div class="container">
        <p class="trust__label">Vertrouwd door</p>
        <div class="trust__logos">
          <span v-for="client in clients" :key="client" class="trust__logo">{{ client }}</span>
        </div>
      </div>
    </section>

    <!-- USPs -->
    <UspGrid />

    <!-- Featured package -->
    <section class="featured section section--dark">
      <div class="container">
        <SectionHeading
          title="Het meest gekozen pakket"
          subtitle="Voor de meeste events is het Gouden uur pakket de perfecte match."
        />
        <div class="featured__card-wrap">
          <PricingCard
            name="Gouden uur"
            price="€595"
            description="Voldoende voor LinkedIn, website en uitnodigingen."
            :features="['4 uur aanwezig op jouw event', '100–150 professioneel bewerkte foto\'s', '1 social aftermovie (30–60 seconden)', 'Geleverd binnen 48 uur', 'Online galerij met downloadlink']"
            :highlighted="true"
          />
        </div>
        <div class="featured__more">
          <RouterLink to="/tarieven" class="btn btn--outline">Alle pakketten bekijken</RouterLink>
        </div>
      </div>
    </section>

    <!-- Portfolio teaser -->
    <section class="teaser section">
      <div class="container">
        <SectionHeading
          title="Foto's zeggen meer dan een tarievenlijst"
          subtitle="Bekijk een selectie van recent werk."
        />
        <div class="teaser__grid">
          <div v-for="(img, i) in teaserImages" :key="i" class="teaser__item">
            <img :src="img.src" :alt="img.alt" loading="lazy" />
          </div>
        </div>
        <div class="teaser__more">
          <RouterLink to="/portfolio" class="btn btn--outline">Volledig portfolio</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero__bg {
  position: absolute;
  inset: 0;
}

.hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.7) 100%);
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  padding-top: 8rem;
  padding-bottom: 4rem;
}

.hero__title {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  color: #fff;
}

.hero__subtitle {
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: rgba(255,255,255,0.8);
  margin-bottom: 2rem;
  line-height: 1.7;
  max-width: 580px;
}

.hero__ctas {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.trust {
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.trust__label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
  text-align: center;
}

.trust__logos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.5rem;
  justify-content: center;
  align-items: center;
}

.trust__logo {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.6;
  transition: opacity var(--transition);
}

.trust__logo:hover {
  opacity: 1;
}

.featured__card-wrap {
  max-width: 420px;
  margin: 0 auto 2rem;
}

.featured__more {
  text-align: center;
}

.teaser__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.teaser__item img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: var(--radius);
  transition: transform var(--transition);
}

.teaser__item img:hover {
  transform: scale(1.02);
}

.teaser__more {
  text-align: center;
}

@media (max-width: 640px) {
  .teaser__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
