<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import SectionHeading from '@/components/SectionHeading.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Eventfotografie voor congressen & seminars | Eventshoot.nl',
    description: 'Professionele eventfotografie voor congressen, seminars, netwerkbijeenkomsten en bedrijfsevents door heel Nederland. 48 uur levering, 40+ jaar ervaring.',
    url: 'https://eventshoot.nl/eventfotografie',
  })
  injectServiceSchema()
})

function injectServiceSchema() {
  const existing = document.getElementById('service-schema')
  if (existing) return
  const script = document.createElement('script')
  script.id = 'service-schema'
  script.type = 'application/ld+json'
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Eventfotografie',
    name: 'Professionele eventfotografie',
    provider: { '@type': 'LocalBusiness', name: 'Eventshoot.nl' },
    areaServed: 'Nederland',
    description: 'Professionele eventfotografie voor congressen, seminars en zakelijke bijeenkomsten.',
  })
  document.head.appendChild(script)
}

const steps = [
  { n: 1, title: 'Korte briefing vooraf', text: 'We stemmen af wat voor jou belangrijk is: de sleutelmomenten, de gewenste sfeer en eventuele aandachtspunten.' },
  { n: 2, title: 'Aanwezigheid op het event', text: 'Rolf weet wanneer hij wel en niet in beeld moet zijn. Discreet, maar altijd op het juiste moment.' },
  { n: 3, title: 'Selectie en nabewerking', text: 'Alleen de beste beelden, professioneel nabewerkt op kleur en belichting.' },
  { n: 4, title: 'Online levering binnen 48 uur', text: 'Klaar voor gebruik terwijl het event nog top of mind is. Je ontvangt een downloadlink.' },
  { n: 5, title: 'Blijf zichtbaar na het event', text: 'Gebruik de beelden periodiek op LinkedIn, in nieuwsbrieven en op je website. Eén event, weken aan content.' },
]

const carouselPhotos = [
  '/eventshoot-50.jpg', '/eventshoot-54.jpg', '/eventshoot-57.jpg',
  '/eventshoot-59.jpg', '/eventshoot-70.jpg', '/eventshoot-75.jpg',
  '/eventshoot-78.jpg', '/eventshoot-81.jpg', '/eventshoot-84.jpg',
  '/eventshoot-88.jpg', '/eventshoot-92.jpg', '/eventshoot-96.jpg',
  '/eventshoot-101.jpg', '/eventshoot-104.jpg',
]

const carouselIndex = ref(0)

function prevSlide() {
  carouselIndex.value = (carouselIndex.value - 1 + carouselPhotos.length) % carouselPhotos.length
}

function nextSlide() {
  carouselIndex.value = (carouselIndex.value + 1) % carouselPhotos.length
}

onMounted(() => {
  setInterval(nextSlide, 3500)
})

const eventTypes = [
  'Congressen en seminars',
  'Netwerkbijeenkomsten en borrels',
  'Award-uitreikingen en jubileums',
  'Interne bedrijfsevents en townhalls',
  'Beurzen en productlanceringen',
]
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="ef-hero">
      <div class="ef-hero__bg">
        <img
          src="/eventshoot-77.jpg"
          alt="Eventfotograaf bij zakelijk congres"
        />
        <div class="ef-hero__overlay"></div>
      </div>
      <div class="container ef-hero__content">
        <h1>Eventfotografie, binnen 48 uur.</h1>
        <p>Professionele eventfotografie voor congressen, jaarcongressen, ledendagen, seminars en bedrijfsbijeenkomsten in heel Nederland. Foto's die je marketeer direct kan plaatsen op LinkedIn, je website en in je nieuwsbrief.</p>
        <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">Vrijblijvend kennismaken</RouterLink>
      </div>
    </section>

    <!-- Motto strook -->
    <section class="motto-bar">
      <div class="container motto-bar__inner">
        <p class="motto-bar__text">Jouw event is een goudmijn aan content.</p>
      </div>
    </section>

    <!-- Service overview -->
    <section class="overview section">
      <div class="container overview__inner">
        <div class="overview__text">
          <h2 class="overview__title">Van congres tot netwerkborrel,<br>alles in beeld.</h2>
          <p class="overview__desc">Of het nu gaat om een congresfotograaf inhuren voor 500 aanwezigen of een besloten seminar voor 30 mensen: Rolf past zich aan aan de situatie. Geen opvallende flitsopstelling, geen ongemakkelijke poses. Gewoon echte momenten, vastgelegd met oog voor detail.</p>
          <ul class="overview__list">
            <li v-for="type in eventTypes" :key="type">
              <span class="overview__check">✓</span>{{ type }}
            </li>
          </ul>
        </div>
        <div class="overview__image">
          <img src="/eventshoot-88.jpg" alt="Eventfotografie in actie" />
        </div>
      </div>
    </section>

    <!-- Werkproces -->
    <section class="process section section--blue">
      <div class="container">
        <SectionHeading title="Hoe het werkt, van boeking tot levering." subtitle="Vijf stappen, geen gedoe." />
        <div class="process__grid">
          <div v-for="step in steps" :key="step.n" class="process__card">
            <div class="process__num">{{ step.n }}</div>
            <h3 class="process__title">{{ step.title }}</h3>
            <p class="process__text">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Video -->
    <section class="video-upsell section">
      <div class="container video-upsell__inner">
        <div class="video-upsell__image">
          <img src="/rolf_interview.png" alt="Rolf Trijber bij een interview shoot" />
        </div>
        <div class="video-upsell__text">
          <h2 class="video-upsell__title">Liever ook video?<br>Geen tweede leverancier nodig.</h2>
          <p class="video-upsell__desc">Bij het Headline en Heroes pakket verzorgt Eventshoot.nl ook een social aftermovie, perfect voor LinkedIn. Wil je meer? Het Heroes pakket bevat bovendien een corporate aftermovie én interviews met sprekers of deelnemers voor op je website. Zo heb je met één event foto én video in handen.</p>
          <RouterLink to="/tarieven" class="btn btn--primary">Bekijk onze pakketten</RouterLink>
          <RouterLink to="/eventvideo" class="btn btn--primary">Bekijk de video mogelijkheden</RouterLink>
        </div>
      </div>
    </section>

    <!-- Foto carousel -->
    <section class="carousel section section--blue">
      <div class="container">
        <SectionHeading title="Zo ziet ons werk eruit" subtitle="Een selectie uit onze portfolio." />
        <div class="carousel__track-wrap">
          <button class="carousel__btn carousel__btn--prev" @click="prevSlide" aria-label="Vorige">&#8249;</button>
          <div class="carousel__track">
            <div
              v-for="(photo, i) in carouselPhotos"
              :key="photo"
              class="carousel__slide"
              :class="{ 'carousel__slide--active': i === carouselIndex, 'carousel__slide--prev': i === (carouselIndex - 1 + carouselPhotos.length) % carouselPhotos.length, 'carousel__slide--next': i === (carouselIndex + 1) % carouselPhotos.length }"
            >
              <img :src="photo" :alt="`Eventfotografie ${i + 1}`" />
            </div>
          </div>
          <button class="carousel__btn carousel__btn--next" @click="nextSlide" aria-label="Volgende">&#8250;</button>
        </div>
        <div class="carousel__cta">
          <RouterLink to="/werk" class="btn btn--primary">Bekijk het werk</RouterLink>
        </div>
      </div>
    </section>

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
.ef-hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.ef-hero__bg {
  position: absolute;
  inset: 0;
}

.ef-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ef-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 100%);
}

.ef-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 680px;
}

.ef-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.ef-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  margin-bottom: 2rem;
  line-height: 1.75;
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

/* Service overview */
.overview__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.overview__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}

.overview__desc {
  font-size: 0.975rem;
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: 1.5rem;
}

.overview__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.overview__list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
}

.overview__check {
  color: var(--color-accent);
  font-weight: 700;
  flex-shrink: 0;
}

.overview__image img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  aspect-ratio: 4/3;
}

/* Werkproces */
.process__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.25rem;
  margin-top: 2rem;
}

.process__card {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: background var(--transition);
}

.process__card:hover {
  background: rgba(0, 0, 0, 0.50);
}

.process__num {
  width: 36px;
  height: 36px;
  background: var(--color-accent);
  color: #0f0f0f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.process__title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.process__text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
}

/* Video upsell */
.video-upsell__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.video-upsell__image img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  aspect-ratio: 4/3;
}

.video-upsell__text .btn {
  display: inline-flex;
  margin-right: 0.75rem;
  margin-top: 0.5rem;
}

.video-upsell__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}

.video-upsell__desc {
  font-size: 0.975rem;
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: 1.75rem;
}

/* Carousel */
.carousel__track-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.carousel__track {
  flex: 1;
  position: relative;
  height: 480px;
  overflow: hidden;
  border-radius: 12px;
}

.carousel__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.6s ease, transform 0.6s ease;
  pointer-events: none;
}

.carousel__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel__slide--active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
  z-index: 2;
}

.carousel__slide--prev,
.carousel__slide--next {
  opacity: 0;
  z-index: 1;
}

.carousel__btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.15);
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  transition: background var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel__btn:hover {
  background: var(--color-accent);
}

.carousel__cta {
  text-align: center;
  margin-top: 2rem;
}

/* Reviews */
.reviews {
  padding: 4rem 0;
}

/* Rolf */
.rolf {
  padding: 4rem 0;
  background: rgba(0,0,0,0.2);
}

.rolf__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.rolf__photo-wrap {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-accent);
}

.rolf__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rolf__title {
  font-size: 1.5rem;
  font-weight: 700;
}

.rolf__phone {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
  transition: color var(--transition);
}

.rolf__phone:hover {
  color: var(--color-accent-hover);
}

.rolf__linkedin {
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.rolf__linkedin:hover {
  color: var(--color-accent);
}

.rolf__linkedin svg {
  width: 44px;
  height: 44px;
}

/* Responsive */
@media (max-width: 900px) {
  .process__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .overview__inner,
  .video-upsell__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .video-upsell__image {
    order: -1;
  }

  .process__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
