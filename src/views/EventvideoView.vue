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
    <section class="ev-hero">
      <div class="ev-hero__bg">
        <img src="/DATA_EVENTSHOOT/SITE_IMAGES/VIDEO/eventshoot-71.jpg" alt="Eventvideo opname tijdens zakelijk congres" />
        <div class="ev-hero__overlay"></div>
      </div>
      <div class="container ev-hero__content">
        <h1>Eventvideo en aftermovies.</h1>
        <p>Eventvideo's voor congressen, conferenties, productlanceringen en bedrijfsbijeenkomsten in heel Nederland. Van social aftermovie voor LinkedIn tot corporate aftermovie met sprekersinterviews.</p>
        <div class="ev-hero__btns">
          <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">Kennismaken</RouterLink>
          <RouterLink to="/tarieven" class="btn btn--outline btn--lg">Bekijk de pakketten</RouterLink>
        </div>
      </div>
    </section>

    <!-- Motto strook -->
    <section class="motto-bar">
      <div class="container motto-bar__inner">
        <p class="motto-bar__text">Jouw event is een goudmijn aan content.</p>
      </div>
    </section>

    <!-- Video voorbeelden: 4 stroken -->
    <section class="ev-block ev-block--1 section">
      <div class="container ev-block__inner ev-block__inner--normal">
        <div class="ev-block__video">
          <video autoplay muted loop playsinline>
            <source src="/DATA_EVENTSHOOT/VIDEOS/short_aftermovie_ljubljana_2_v1-1080p (1).mp4" type="video/mp4" />
          </video>
        </div>
        <div class="ev-block__text">
          <h2 class="ev-block__title">Social aftermovie (45–90 seconden)</h2>
          <p class="ev-block__desc">Energieke, strak gemonteerde samenvatting van de sfeer en hoogtepunten. Perfect om te delen op LinkedIn terwijl het event nog vers is. Zit in het Highlight, Headline en Heroes pakket.</p>
          <RouterLink to="/tarieven" class="btn btn--primary">Bekijk pakketten</RouterLink>
        </div>
      </div>
    </section>

    <section class="ev-block ev-block--2 section">
      <div class="container ev-block__inner ev-block__inner--reversed">
        <div class="ev-block__video">
          <video autoplay muted loop playsinline>
            <source src="/DATA_EVENTSHOOT/VIDEOS/dell_forum_aftermovie_v1-1080p (1).mp4" type="video/mp4" />
          </video>
        </div>
        <div class="ev-block__text">
          <h2 class="ev-block__title">Corporate aftermovie (90–180 seconden)</h2>
          <p class="ev-block__desc">Een uitgebreider verhaal: context, inhoud en reacties van deelnemers. Ideaal voor je website, jaarverslag of intern gebruik. Inclusief sprekersinterviews. Zit in het Heroes pakket.</p>
          <RouterLink to="/tarieven" class="btn btn--primary">Bekijk het Heroes pakket</RouterLink>
        </div>
      </div>
    </section>

    <section class="ev-block ev-block--3 section">
      <div class="container ev-block__inner ev-block__inner--normal">
        <div class="ev-block__video">
          <video autoplay muted loop playsinline>
            <source src="/DATA_EVENTSHOOT/VIDEOS/gbl_new_president_v1 (1080p).mp4" type="video/mp4" />
          </video>
        </div>
        <div class="ev-block__text">
          <h2 class="ev-block__title">Sprekersinterviews (1–3 min per interview)</h2>
          <p class="ev-block__desc">15–20 interviews met sprekers of deelnemers. Eén camera, helder geluid, professioneel gemonteerd. Levert weken aan content op voor LinkedIn en je website. Zit in het Headline en Heroes pakket.</p>
          <RouterLink to="/kennismaken" class="btn btn--primary">Plan een gesprek</RouterLink>
        </div>
      </div>
    </section>

    <section class="ev-block ev-block--4 section">
      <div class="container ev-block__inner ev-block__inner--reversed">
        <div class="ev-block__video">
          <video autoplay muted loop playsinline>
            <source src="/DATA_EVENTSHOOT/VIDEOS/collective_video_v4-1080p (1).mp4" type="video/mp4" />
          </video>
        </div>
        <div class="ev-block__text">
          <h2 class="ev-block__title">Event promotievideo (op maat)</h2>
          <p class="ev-block__desc">Gebruik beelden van dit jaar om inschrijvingen voor de volgende editie te stimuleren. Collega's delen het, het netwerk groeit. Op offerte beschikbaar naast elk pakket.</p>
          <RouterLink to="/kennismaken" class="btn btn--primary">Vraag een offerte aan</RouterLink>
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

    <!-- Logo carousel -->
    <section class="trust">
      <p class="trust__label">Vertrouwd door organisaties als…</p>
      <div class="trust__track-wrap">
        <div class="trust__track">
          <div class="trust__slide" v-for="n in 2" :key="n">
            <img v-for="logo in logos" :key="logo.file + n" :src="`/DATA_EVENTSHOOT/SITE_IMAGES/OPDRACHTGEVERS/${logo.file}`" :alt="logo.name" class="trust__logo" />
          </div>
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

/* Motto bar */
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

/* Video blokken */
.ev-block--1,
.ev-block--3 {
  background: transparent;
}

.ev-block--2,
.ev-block--4 {
  background: rgba(49, 159, 232, 0.40);
}

.ev-block__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.ev-block__inner--reversed {
  direction: rtl;
}

.ev-block__inner--reversed > * {
  direction: ltr;
}

.ev-block__video {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
}

.ev-block__video iframe,
.ev-block__video video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.ev-block__title {
  font-size: clamp(1.3rem, 2.2vw, 1.85rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}

.ev-block__desc {
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

/* Logo carousel */
.trust {
  padding: 2.5rem 0;
  overflow: hidden;
}

.trust__label {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.trust__track-wrap {
  overflow: hidden;
}

.trust__track {
  display: flex;
  width: max-content;
  animation: scroll-logos 30s linear infinite;
}

.trust__slide {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding-right: 3rem;
}

.trust__logo {
  height: 80px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.6;
  transition: opacity 0.2s;
}

.trust__logo:hover { opacity: 1; }

@keyframes scroll-logos {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
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
  .ev-block__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    direction: ltr;
  }
  .video-types__grid { grid-template-columns: 1fr; }
  .ev-packages__row {
    grid-template-columns: 1fr;
  }
}
</style>
