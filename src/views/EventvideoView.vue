<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import SectionHeading from '@/components/SectionHeading.vue'
import UspGrid from '@/components/UspGrid.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Eventvideo & aftermovie | Eventshoot.nl',
    description: 'Professionele eventvideo\'s en aftermovies voor LinkedIn, je website en corporate gebruik. Social aftermovie (30–60 sec) tot lange corporate aftermovie met interviews.',
    url: 'https://eventshoot.nl/eventvideo',
  })
})

const videoTypes = [
  {
    title: 'Social aftermovie',
    duration: '45–75 seconden',
    ideal: 'LinkedIn, website, uitnodigingen',
    desc: 'Energieke, strak gemonteerde samenvatting van de sfeer en hoogtepunten. Perfect om te delen terwijl het event nog vers is.',
  },
  {
    title: 'Corporate aftermovie',
    duration: '90–180 seconden',
    ideal: 'Website, jaarverslag, intern',
    desc: 'Een uitgebreider verhaal: context, inhoud en reacties van deelnemers. Ideaal voor je website of jaarverslag.',
  },
  {
    title: 'Sprekersinterviews',
    duration: '1–3 min per interview',
    ideal: 'Website, thought leadership',
    desc: '15–20 interviews met sprekers of deelnemers. Eén camera, helder geluid, professioneel gemonteerd. Levert weken aan content op.',
  },
  {
    title: 'Event promotievideo',
    duration: 'Op maat',
    ideal: 'Registraties verhogen, volgende editie',
    desc: 'Gebruik beelden van dit jaar om inschrijvingen voor de volgende editie te stimuleren. Collega\'s delen het, het netwerk groeit.',
  },
]

const packages = [
  { name: 'Daglicht', video: false, text: 'Alleen foto\'s, geen video.' },
  { name: 'Gouden uur', video: true, text: '1 social aftermovie (30–60 sec). Direct bruikbaar voor LinkedIn.' },
  { name: 'Spotlight', video: true, text: 'Social aftermovie + corporate aftermovie + 15–20 sprekersinterviews.' },
]
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="ev-hero">
      <div class="ev-hero__bg">
        <img src="/eventshoot-77.jpg" alt="Eventvideo opname tijdens zakelijk congres" />
        <div class="ev-hero__overlay"></div>
      </div>
      <div class="container ev-hero__content">
        <h1>Eventvideo die doorwerkt,<br>lang na je event.</h1>
        <p>Een aftermovie van 60 seconden doet meer voor je merkbeleving dan een pagina vol tekst. Jouw deelnemers delen hem, nieuwe inschrijvers worden overtuigd — en jouw event leeft voort op LinkedIn, op je website en in je nieuwsbrief.</p>
        <div class="ev-hero__btns">
          <RouterLink to="/contact" class="btn btn--primary btn--lg">Neem contact op</RouterLink>
          <RouterLink to="/tarieven" class="btn btn--outline btn--lg">Bekijk de pakketten</RouterLink>
        </div>
      </div>
    </section>

    <!-- Video voorbeeld -->
    <section class="ev-showcase section">
      <div class="container ev-showcase__inner">
        <div class="ev-showcase__video">
          <iframe
            src="https://player.vimeo.com/video/1139974588?h=d77d047995&title=0&byline=0&portrait=0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="ev-showcase__text">
          <h2 class="ev-showcase__title">Zo klinkt een aftermovie van Eventshoot.nl</h2>
          <p class="ev-showcase__desc">Dit is een voorbeeld van een social aftermovie — gemonteerd op muziek, klaar om te posten. Energiek, scherp, en precies de sfeer die jouw event verdient.</p>
          <RouterLink to="/contact" class="btn btn--primary">Plan een gesprek</RouterLink>
        </div>
      </div>
    </section>

    <!-- Video types -->
    <section class="video-types section section--blue">
      <div class="container">
        <SectionHeading title="Welke video past bij jouw event?" subtitle="Van snelle social clip tot uitgebreide corporate productie." />
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

    <!-- Pakket overzicht -->
    <section class="ev-packages section section--dark">
      <div class="container">
        <SectionHeading title="Video per pakket" subtitle="Kies het pakket dat past bij jouw event en budget." />
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

    <!-- USP -->
    <UspGrid />

    <!-- Reviews -->
    <section class="reviews">
      <div class="container">
        <SectionHeading title="Wat zeggen onze opdrachtgevers" />
        <div class="elfsight-app-4ed38ed1-21e2-4238-bb5c-d1127391e146"></div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Hero */
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

/* Showcase */
.ev-showcase__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.ev-showcase__video {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
}

.ev-showcase__video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.ev-showcase__title {
  font-size: clamp(1.3rem, 2.2vw, 1.85rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}

.ev-showcase__desc {
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

/* Pakketten */
.ev-packages__table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 760px;
  margin: 2rem auto 2.5rem;
}

.ev-packages__row {
  display: grid;
  grid-template-columns: 160px 40px 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  transition: background var(--transition);
}

.ev-packages__row:hover {
  background: rgba(0, 0, 0, 0.50);
}

.ev-packages__name {
  font-weight: 700;
  color: #fff;
}

.ev-packages__status {
  font-weight: 800;
  font-size: 1.1rem;
}

.ev-packages__status--yes { color: var(--color-accent); }
.ev-packages__status--no { color: #555; }

.ev-packages__desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
}

.ev-packages__cta {
  text-align: center;
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
  .ev-showcase__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .video-types__grid { grid-template-columns: 1fr; }
  .ev-packages__row {
    grid-template-columns: 1fr;
  }
}
</style>
