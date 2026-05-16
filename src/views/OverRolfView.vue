<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UspGrid from '@/components/UspGrid.vue'
import RolfContact from '@/components/RolfContact.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Over Rolf Trijber | Eventshoot.nl',
    description: 'Eventfotograaf en videograaf met 40+ jaar ervaring in beeldproductie. Gespecialiseerd in zakelijke events: congressen, jaarcongressen, ledendagen en bedrijfsbijeenkomsten.',
    url: 'https://eventshoot.nl/over-rolf',
  })
})

const verwachtingen = [
  'Vooraf een korte briefing zodat niets wordt gemist',
  'Discrete aanwezigheid, geen opvallende flitsopstelling',
  'Afstemming met de techniek van de locatie',
  'Selectie en professionele nabewerking van de beste beelden',
  'Levering binnen 48 uur via een online galerij',
  'Eén aanspreekpunt van boeking tot levering',
]
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="over-hero section">
      <div class="container over-hero__inner">
        <div class="over-hero__text">
          <h1 class="over-hero__h1">Jouw event is een goudmijn aan content.</h1>
          <p class="over-hero__name">Rolf Trijber, achter Eventshoot.nl.</p>
          <p class="over-hero__sub">Eventfotograaf en videograaf met 40+ jaar ervaring in beeldproductie. Gespecialiseerd in zakelijke events: congressen, jaarcongressen, ledendagen en bedrijfsbijeenkomsten in heel Nederland.</p>
          <RouterLink to="/kennismaken" class="btn btn--primary">Kennismaken</RouterLink>
        </div>
        <div class="over-hero__photo">
          <img src="/rolf_trijber_4.jpg" alt="Rolf Trijber, eventfotograaf" />
        </div>
      </div>
    </section>

    <!-- Wat je van mij kunt verwachten -->
    <section class="verwacht section section--dark">
      <div class="container">
        <h2 class="verwacht__title">Wat je van mij kunt verwachten.</h2>
        <ul class="verwacht__list">
          <li v-for="item in verwachtingen" :key="item">
            <span class="verwacht__check">✓</span>{{ item }}
          </li>
        </ul>
      </div>
    </section>

    <!-- USPs -->
    <UspGrid />

    <!-- Actie kaarten -->
    <section class="actie section">
      <div class="container">
        <h2 class="actie__title">Wat kan ik voor jou doen?</h2>
        <div class="actie__grid">
          <div class="actie__card">
            <h3>Last-minute boeking</h3>
            <p>Event aanstaande week en nog geen fotograaf? Bel direct: 06 251 777 28. Ik probeer altijd iets te regelen.</p>
            <a href="tel:+31625177728" class="btn btn--outline">Bel Rolf</a>
          </div>
          <div class="actie__card">
            <h3>Groot congres</h3>
            <p>Jaarcongres of ledendag met 200+ deelnemers? Het Headline of Heroes pakket is hiervoor gemaakt, inclusief aftermovie en interviews.</p>
            <RouterLink to="/tarieven" class="btn btn--outline">Bekijk pakketten</RouterLink>
          </div>
          <div class="actie__card">
            <h3>Ook video nodig?</h3>
            <p>Foto én video in één productiedag. Geen tweede leverancier, geen afstemming. Eén aanspreekpunt, één stijl, één factuur.</p>
            <RouterLink to="/eventvideo" class="btn btn--outline">Meer over video</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <RolfContact />
  </main>
</template>

<style scoped>
.over-hero {
  padding-top: 9rem;
}

.over-hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.over-hero__h1 {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: var(--color-accent);
}

.over-hero__name {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.25rem;
}

.over-hero__sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.75;
  margin-bottom: 2rem;
}

.over-hero__photo img {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 4/5;
}

.verwacht__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 2rem;
}

.verwacht__list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 800px;
}

.verwacht__list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.5;
}

.verwacht__check {
  color: var(--color-accent);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

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
  background: rgba(0,0,0,0.35);
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

@media (max-width: 768px) {
  .over-hero__inner { grid-template-columns: 1fr; gap: 2.5rem; }
  .verwacht__list { grid-template-columns: 1fr; }
  .actie__grid { grid-template-columns: 1fr; }
}
</style>
