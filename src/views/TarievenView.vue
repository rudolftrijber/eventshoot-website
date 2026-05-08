<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PricingCard from '@/components/PricingCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import UspGrid from '@/components/UspGrid.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Tarieven eventfotografie | Eventshoot.nl',
    description: 'Bekijk de pakketten voor eventfotografie en eventvideo. Daglicht vanaf €295, Gouden uur €595, Spotlight €1.495. Inclusief afmovie en 48 uur levering.',
    url: 'https://eventshoot.nl/tarieven',
  })
  injectFaqSchema()
})

function injectFaqSchema() {
  const existing = document.getElementById('faq-schema')
  if (existing) return
  const script = document.createElement('script')
  script.id = 'faq-schema'
  script.type = 'application/ld+json'
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  })
  document.head.appendChild(script)
}

const packages = [
  {
    name: 'Daglicht',
    price: '€295',
    description: 'Ideaal als je alleen professionele foto\'s nodig hebt. Perfect voor kleinere of interne events.',
    features: ['2 uur aanwezig op jouw event', '50–100 professioneel bewerkte foto\'s', 'Online galerij met downloadlink', 'Geleverd binnen 48 uur'],
    highlighted: false,
  },
  {
    name: 'Gouden uur',
    price: '€595',
    description: 'Het meest gekozen pakket. Voldoende voor LinkedIn, website en uitnodigingen.',
    features: ['4 uur aanwezig op jouw event', '100–150 professioneel bewerkte foto\'s', '1 social aftermovie (30–60 seconden)', 'Online galerij met downloadlink', 'Geleverd binnen 48 uur'],
    highlighted: true,
  },
  {
    name: 'Spotlight',
    price: '€1.495',
    description: 'Voor grotere events die meer content vereisen. Inclusief interviews en lange aftermovie.',
    features: ['~8 uur aanwezig, 2 crew', '150–200 professioneel bewerkte foto\'s', '1 social aftermovie (30–60 sec)', '1 corporate aftermovie (90–180 sec)', '15–20 interviews met sprekers/deelnemers'],
    highlighted: false,
  },
]

const faqs = [
  { q: 'Zijn de prijzen inclusief of exclusief btw?', a: 'Alle genoemde prijzen zijn exclusief 21% btw.' },
  { q: 'Kan ik ook een pakket op maat aanvragen?', a: 'Ja, neem contact op om je wensen te bespreken. Rolf maakt een passend voorstel op basis van jouw event en budget.' },
  { q: 'Hoe snel worden de foto\'s geleverd?', a: 'Standaard binnen 48 uur na het event. Spoedlevering binnen 24 uur is mogelijk in overleg.' },
  { q: 'Wat als mijn event langer duurt dan het pakket?', a: 'Extra uren zijn bij te boeken voor €95 per uur. Dit wordt vooraf afgestemd.' },
]
</script>

<template>
  <main>
    <section class="tarieven-hero section">
      <div class="container">
        <SectionHeading
          title="Transparante tarieven, geen verrassingen"
          subtitle="Kies het pakket dat past bij jouw event. Altijd inclusief professionele nabewerking en snelle levering."
        />
        <div class="pricing-grid">
          <PricingCard
            v-for="pkg in packages"
            :key="pkg.name"
            v-bind="pkg"
          />
        </div>
      </div>
    </section>

    <UspGrid />

    <!-- FAQ -->
    <section class="faq section section--dark">
      <div class="container">
        <SectionHeading title="Veelgestelde vragen" align="left" />
        <div class="faq__list">
          <div v-for="item in faqs" :key="item.q" class="faq__item">
            <h3 class="faq__q">{{ item.q }}</h3>
            <p class="faq__a">{{ item.a }}</p>
          </div>
        </div>
        <div class="faq__cta">
          <RouterLink to="/contact" class="btn btn--primary">Neem contact op</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.tarieven-hero {
  padding-top: 8rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.faq__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.faq__item {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1.5rem;
}

.faq__q {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.faq__a {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin: 0 auto;
  }
}
</style>
