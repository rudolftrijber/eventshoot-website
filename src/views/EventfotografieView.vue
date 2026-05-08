<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UspGrid from '@/components/UspGrid.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Eventfotografie voor congressen & seminars | Eventshoot.nl',
    description: 'Professionele eventfotografie voor congressen, seminars, netwerk­bijeenkomsten en bedrijfsevents door heel Nederland. 48 uur levering, 40+ jaar ervaring.',
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
  { n: 1, title: 'Korte briefing vooraf', text: 'In een telefoongesprek bespreken we jouw event, de belangrijkste momenten en de gewenste stijl.' },
  { n: 2, title: 'Discrete aanwezigheid', text: 'Ik werk op de achtergrond, zodat sprekers en deelnemers zich nooit bekeken voelen.' },
  { n: 3, title: 'Selectie & nabewerking', text: 'Na het event selecteer ik de beste beelden en bewerk ze professioneel in kleur en belichting.' },
  { n: 4, title: 'Online galerij binnen 48 uur', text: 'Je ontvangt een downloadlink. De volgende ochtend kun je al posten op LinkedIn.' },
  { n: 5, title: 'Optioneel: cornerlogo', text: 'Ik voeg jouw logo toe aan de foto\'s voor extra merkzichtbaarheid in social media posts.' },
]

const eventTypes = [
  { title: 'Congressen & seminars', icon: '🎤' },
  { title: 'Netwerkbijeenkomsten', icon: '🤝' },
  { title: 'Award-uitreikingen', icon: '🏆' },
  { title: 'Bedrijfsevents', icon: '🏢' },
  { title: 'Beurzen', icon: '📊' },
  { title: 'Productlanceringen', icon: '🚀' },
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
        <h1>Eventfotografie die werkt<br>ook na het event</h1>
        <p>Goede eventfotografie is meer dan mooie plaatjes. Het zijn beelden die deelnemers op LinkedIn delen en nieuwe inschrijvers overtuigen.</p>
        <RouterLink to="/contact" class="btn btn--primary btn--lg">Vrijblijvend contact</RouterLink>
      </div>
    </section>

    <!-- Werkproces -->
    <section class="process section">
      <div class="container">
        <SectionHeading title="Zo werkt het" subtitle="Van briefing tot download in vijf stappen." />
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

    <!-- Event types -->
    <section class="event-types section section--dark">
      <div class="container">
        <SectionHeading title="Voor welk event?" subtitle="Van klein intern seminar tot internationaal congres." />
        <div class="event-types__grid">
          <div v-for="t in eventTypes" :key="t.title" class="event-types__card">
            <span class="event-types__icon">{{ t.icon }}</span>
            <span class="event-types__label">{{ t.title }}</span>
          </div>
        </div>
        <div class="event-types__cta">
          <RouterLink to="/tarieven" class="btn btn--primary">Bekijk de tarieven</RouterLink>
        </div>
      </div>
    </section>

    <UspGrid />
  </main>
</template>

<style scoped>
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
  background: linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 100%);
}

.ef-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 7rem;
  padding-bottom: 4rem;
  max-width: 640px;
}

.ef-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.ef-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 2rem;
  line-height: 1.7;
}

.process__steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 700px;
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

.event-types__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.event-types__card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: border-color var(--transition);
}

.event-types__card:hover {
  border-color: var(--color-accent);
}

.event-types__icon {
  font-size: 1.5rem;
}

.event-types__label {
  font-weight: 600;
  font-size: 0.95rem;
}

.event-types__cta {
  text-align: center;
}

@media (max-width: 640px) {
  .event-types__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
