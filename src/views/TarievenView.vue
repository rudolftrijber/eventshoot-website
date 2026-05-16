<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PricingCard from '@/components/PricingCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import UspGrid from '@/components/UspGrid.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Tarieven voor eventcontent | Eventshoot.nl',
    description: 'Drie pakketten voor eventfotografie en eventvideo. Highlight vanaf €895, Headline €2.250, Heroes €3.450. Inclusief aftermovie en levering binnen 48 uur.',
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
    name: 'Highlight',
    price: '€895',
    description: 'Ideaal voor een kleiner event of als je social-only content nodig hebt.',
    features: ['4 uur aanwezig op jouw event', '100–150 professioneel bewerkte foto\'s', '1 social aftermovie (45–90 seconden)', 'Levering binnen 24 uur', 'Online galerij met downloadlink'],
    image: '/images/Eventshoot_DAGLICHT.jpg',
    highlighted: false,
  },
  {
    name: 'Headline',
    price: '€2.250',
    description: 'Het meest gekozen pakket. Voor jaarcongres, ledendag of groter bedrijfsevent.',
    features: ['8 uur aanwezig op jouw event', '150–250 professioneel bewerkte foto\'s', '1 social aftermovie (45–90 seconden)', '10–15 sprekersinterviews (één camera)', 'Geleverd binnen 48 uur', 'Online galerij met downloadlink'],
    image: '/images/Eventshoot_GOLDEN_HOUR.jpg',
    highlighted: true,
  },
  {
    name: 'Heroes',
    price: '€3.450',
    description: 'Voor hoog-profile congressen met maximale contentbehoefte.',
    features: ['8 uur aanwezig, 2 crew', '200–300 professioneel bewerkte foto\'s', '1 social aftermovie (45–90 sec)', '1 corporate aftermovie (90–180 sec)', '15–20 sprekersinterviews (één camera)', 'Drone/timelapse indien mogelijk', 'Geleverd binnen 48 uur'],
    image: '/images/Eventshoot_SPOTLIGHT.jpg',
    highlighted: false,
  },
]

const faqs = [
  { q: 'Zijn de prijzen inclusief of exclusief btw?', a: 'Alle genoemde prijzen zijn exclusief 21% btw. Reisuren en transportkosten worden separaat berekend.' },
  { q: 'Kan ik ook een pakket op maat aanvragen?', a: 'Ja, neem contact op om je wensen te bespreken. Rolf maakt een passend voorstel op basis van jouw event en budget.' },
  { q: 'Hoe snel worden de bestanden geleverd?', a: 'Standaard binnen 48 uur na het event. Het Highlight-pakket wordt binnen 24 uur geleverd. Same-day levering direct na het event is mogelijk: €425 (Highlight), €650 (Headline) of €925 (Heroes).' },
  { q: 'Wat als mijn event langer duurt dan het pakket?', a: 'Extra uren zijn bij te boeken. Dit wordt vooraf afgestemd zodat er geen verrassingen zijn.' },
  { q: 'Zijn er meerdere events per jaar?', a: 'Ja, het Content Year jaarcontract is bedoeld voor organisaties met 3 of meer events per jaar. Voor €775 per maand (€9.300 per jaar) krijg je 3 events op Heroes-niveau, voorrang in de agenda en een doorlopende stijl.' },
]
</script>

<template>
  <main>
    <section class="tarieven-hero section">
      <div class="container">
        <SectionHeading
          title="Tarieven voor eventcontent."
          subtitle="Drie pakketten plus een jaarcontract voor organisaties met meerdere events per jaar. Vooraf duidelijk, geen verrassingen achteraf."
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

    <!-- Content Year jaarcontract -->
    <section class="content-year section section--dark">
      <div class="container">
        <div class="content-year__inner">
          <div class="content-year__label">Jaarcontract</div>
          <h2 class="content-year__title">Content Year</h2>
          <p class="content-year__price">€ 775 <span>per maand</span></p>
          <p class="content-year__sub">€ 9.300 per jaar, excl. btw</p>
          <ul class="content-year__list">
            <li>3 events per jaar op Heroes-niveau</li>
            <li>8 uur aanwezigheid per event</li>
            <li>Voorrang in de agenda</li>
            <li>Doorlopende stijl, één aanspreekpunt</li>
          </ul>
          <RouterLink to="/kennismaken" class="btn btn--primary">Interesse? Plan een gesprek</RouterLink>
        </div>
      </div>
    </section>

    <UspGrid />

    <!-- Aanvullende diensten -->
    <section class="extra section">
      <div class="container">
        <SectionHeading title="Aanvullende diensten" align="left" />
        <table class="extra__table">
          <tbody>
            <tr>
              <td>Same-day levering direct na het event</td>
              <td>€ 425 / € 650 / € 925 <span class="extra__note">(Highlight / Headline / Heroes)</span></td>
            </tr>
            <tr>
              <td>Human ondertiteling (98% correct, i.p.v. AI)</td>
              <td>€ 13 per minuut <span class="extra__note">(alleen Headline en Heroes)</span></td>
            </tr>
            <tr>
              <td>Event promotievideo voor volgende editie</td>
              <td>Op offerte</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

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
          <RouterLink to="/kennismaken" class="btn btn--primary">Kennismaken</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.tarieven-hero {
  padding-top: 8rem;
  background: transparent !important;
}


.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: stretch;
  margin: 3rem 0 6rem;
}

.content-year {
  background: rgba(27, 156, 252, 0.15);
  border-top: 1px solid rgba(27, 156, 252, 0.3);
  border-bottom: 1px solid rgba(27, 156, 252, 0.3);
}

.content-year__inner {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.content-year__label {
  display: inline-block;
  background: var(--color-blue);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
}

.content-year__title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.content-year__price {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-accent);
  line-height: 1;
}

.content-year__price span {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255,255,255,0.6);
}

.content-year__sub {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.5);
  margin-top: -0.5rem;
}

.content-year__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.content-year__list li {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.85);
  padding-left: 1.5rem;
  position: relative;
}

.content-year__list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-accent);
  font-weight: 700;
}

.extra__table {
  width: 100%;
  max-width: 700px;
  border-collapse: collapse;
}

.extra__table tr {
  border-bottom: 1px solid var(--color-border);
}

.extra__table td {
  padding: 1rem 0.5rem;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  vertical-align: middle;
}

.extra__table td:last-child {
  text-align: right;
  font-weight: 600;
  color: #fff;
}

.extra__note {
  font-size: 0.78rem;
  font-weight: 400;
  color: rgba(255,255,255,0.5);
  display: block;
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
