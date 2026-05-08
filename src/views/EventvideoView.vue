<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import SectionHeading from '@/components/SectionHeading.vue'
import UspGrid from '@/components/UspGrid.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Eventvideo & aftermovie | Eventshoot.nl',
    description: 'Professionele eventvideo\'s en aftermovies voor LinkedIn, je website en corporate gebruik. Social aftermovie (30–60 sec) tot lange corporate aftermovie.',
    url: 'https://eventshoot.nl/eventvideo',
  })
})

const videoTypes = [
  {
    title: 'Social aftermovie',
    duration: '30–60 seconden',
    ideal: 'LinkedIn, Instagram, website-header',
    desc: 'Energieke, strak gemonteerde samenvatting van de sfeer en hoogtepunten van jouw event. Perfect voor social media.',
    icon: '📱',
  },
  {
    title: 'Corporate aftermovie',
    duration: '90–180 seconden',
    ideal: 'Website, jaarverslag, intern',
    desc: 'Een uitgebreider verhaal: context, inhoud, reacties van deelnemers en een sterke afsluiting. Ideaal voor je website of jaarverslag.',
    icon: '🎬',
  },
  {
    title: 'Sprekersinterviews',
    duration: '1–3 minuten per interview',
    ideal: 'Website, thought leadership',
    desc: '15–20 interviews met sprekers of deelnemers. Eén camera, helder geluid, professioneel gemonteerd. Alleen beschikbaar in het Spotlight pakket.',
    icon: '🎙️',
  },
]

const packages = [
  { name: 'Daglicht', video: false, text: 'Alleen foto\'s, geen video.' },
  { name: 'Gouden uur', video: true, text: '1 social aftermovie (30–60 sec).' },
  { name: 'Spotlight', video: true, text: 'Social aftermovie + corporate aftermovie + 15–20 interviews.' },
]
</script>

<template>
  <main>
    <section class="ev-hero">
      <div class="ev-hero__bg">
        <img
          src="https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-77-1-scaled.jpg"
          alt="Eventvideo opname tijdens zakelijk congres"
        />
        <div class="ev-hero__overlay"></div>
      </div>
      <div class="container ev-hero__content">
        <h1>Eventvideo die mensen écht bekijken</h1>
        <p>Een aftermovie van 60 seconden doet meer voor je merkbeleving dan een pagina vol tekst. Wij maken video die je deelnemers aan het delen krijgt.</p>
        <RouterLink to="/contact" class="btn btn--primary btn--lg">Bespreek jouw event</RouterLink>
      </div>
    </section>

    <!-- Video types -->
    <section class="video-types section">
      <div class="container">
        <SectionHeading title="Welke video past bij jouw event?" />
        <div class="video-types__grid">
          <div v-for="t in videoTypes" :key="t.title" class="video-types__card">
            <span class="video-types__icon">{{ t.icon }}</span>
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

    <!-- Packages table -->
    <section class="ev-packages section section--dark">
      <div class="container">
        <SectionHeading title="Video per pakket" />
        <div class="ev-packages__table">
          <div v-for="pkg in packages" :key="pkg.name" class="ev-packages__row">
            <span class="ev-packages__name">{{ pkg.name }}</span>
            <span class="ev-packages__status" :class="pkg.video ? 'ev-packages__status--yes' : 'ev-packages__status--no'">
              {{ pkg.video ? '✓' : '✕' }}
            </span>
            <span class="ev-packages__desc">{{ pkg.text }}</span>
          </div>
        </div>
        <div class="ev-packages__cta">
          <RouterLink to="/tarieven" class="btn btn--primary">Bekijk alle pakketten & tarieven</RouterLink>
        </div>
      </div>
    </section>

    <UspGrid />
  </main>
</template>

<style scoped>
.ev-hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.ev-hero__bg {
  position: absolute;
  inset: 0;
}

.ev-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ev-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%);
}

.ev-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 7rem;
  padding-bottom: 4rem;
  max-width: 620px;
}

.ev-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.ev-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 2rem;
  line-height: 1.7;
}

.video-types__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.video-types__card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color var(--transition);
}

.video-types__card:hover {
  border-color: var(--color-accent);
}

.video-types__icon {
  font-size: 2rem;
}

.video-types__title {
  font-size: 1.1rem;
  font-weight: 700;
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
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.ev-packages__table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 700px;
  margin: 0 auto 2.5rem;
}

.ev-packages__row {
  display: grid;
  grid-template-columns: 160px 40px 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.ev-packages__name {
  font-weight: 700;
}

.ev-packages__status {
  font-weight: 800;
  font-size: 1.1rem;
}

.ev-packages__status--yes { color: var(--color-accent); }
.ev-packages__status--no { color: #555; }

.ev-packages__desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.ev-packages__cta {
  text-align: center;
}

@media (max-width: 768px) {
  .video-types__grid {
    grid-template-columns: 1fr;
  }
}
</style>
