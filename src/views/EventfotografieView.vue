<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UspGrid from '@/components/UspGrid.vue'
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
  { n: 1, title: 'Korte briefing vooraf', text: 'We stemmen af wat voor jou belangrijk is: de sleutelmomente, de gewenste sfeer en eventuele aandachtspunten.' },
  { n: 2, title: 'Aanwezigheid op het event', text: 'Rolf weet wanneer hij wel en niet in beeld moet zijn. Discreet, maar altijd op het juiste moment.' },
  { n: 3, title: 'Selectie en nabewerking', text: 'Alleen de beste beelden, professioneel nabewerkt op kleur en belichting.' },
  { n: 4, title: 'Online levering binnen 48 uur', text: 'Klaar voor gebruik terwijl het event nog top of mind is. Je ontvangt een downloadlink.' },
  { n: 5, title: 'Optioneel: cornerlogo', text: 'Op alle foto\'s voor extra merkzichtbaarheid op social media posts.' },
]

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
          src="https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-70-1-scaled.jpg"
          alt="Eventfotograaf bij zakelijk congres"
        />
        <div class="ef-hero__overlay"></div>
      </div>
      <div class="container ef-hero__content">
        <h1>Eventfotografie die werkt,<br>ook na het event.</h1>
        <p>Goede eventfotografie is meer dan mooie plaatjes. Het zijn de beelden die je deelnemers terugzien op LinkedIn, die nieuwe inschrijvers overtuigen en die jouw event een gezicht geven. Eventshoot.nl levert dat. Altijd scherp, altijd op tijd.</p>
        <RouterLink to="/contact" class="btn btn--primary btn--lg">Vrijblijvend contact</RouterLink>
      </div>
    </section>

    <!-- Service overview -->
    <section class="overview section">
      <div class="container overview__inner">
        <div class="overview__text">
          <h2 class="overview__title">Van congres tot netwerkborrel,<br>alles in beeld.</h2>
          <p class="overview__desc">Of het nu gaat om een congresfotograaf inhuren voor 500 aanwezigen of een besloten seminar voor 30 mensen: Rolf past zich aan aan de situatie. Geen opvallende flitsopstelling, geen ongemakkelijke poses. Gewoon echte momenten, vastgelegd met oog voor detail.</p>
          <ul class="overview__list">
            <li v-for="type in eventTypes" :key="type">{{ type }}</li>
          </ul>
        </div>
        <div class="overview__image">
          <img src="/images/Eventshoot_GOLDEN_HOUR.jpg" alt="Eventfotografie in actie" />
        </div>
      </div>
    </section>

    <!-- Werkproces -->
    <section class="process section section--dark">
      <div class="container">
        <SectionHeading title="Hoe het werkt, van boeking tot levering." subtitle="Vijf stappen, geen gedoe." />
        <div class="process__steps">
          <div v-for="step in steps" :key="step.n" class="process__step">
            <div class="process__num">{{ step.n }}</div>
            <div>
              <h3 class="process__title">{{ step.title }}</h3>
              <p class="process__text">{{ step.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Video -->
    <section class="video-upsell section">
      <div class="container video-upsell__inner">
        <div class="video-upsell__image">
          <img src="/images/Eventshoot_SPOTLIGHT.jpg" alt="Eventvideo en aftermovie" />
        </div>
        <div class="video-upsell__text">
          <h2 class="video-upsell__title">Liever ook video?<br>Geen tweede leverancier nodig.</h2>
          <p class="video-upsell__desc">Bij het Gouden uur en Spotlight pakket verzorgt Eventshoot.nl ook een social aftermovie, perfect voor LinkedIn. Wil je meer? Het Spotlight pakket bevat bovendien een corporate aftermovie én interviews met sprekers of deelnemers voor op je website. Zo heb je met één event foto én video in handen.</p>
          <RouterLink to="/tarieven" class="btn btn--primary">Bekijk onze pakketten</RouterLink>
        </div>
      </div>
    </section>

    <!-- USP grid -->
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
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.overview__list li::before {
  content: '';
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}

.overview__image img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  aspect-ratio: 4/3;
}

/* Werkproces */
.process__steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 700px;
  margin-top: 2rem;
}

.process__step {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.process__num {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: var(--color-accent);
  color: #0f0f0f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
}

.process__title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.process__text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
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
@media (max-width: 768px) {
  .overview__inner,
  .video-upsell__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .video-upsell__image {
    order: -1;
  }
}
</style>
