<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UspGrid from '@/components/UspGrid.vue'
import RolfContact from '@/components/RolfContact.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Voor hotels met congresfaciliteiten | Eventshoot.nl',
    description: 'Eventcontent voor de congressen die jullie hosten. Plus marketingbeelden van jullie eigen faciliteiten.',
    url: 'https://eventshoot.nl/voor/hotels',
  })
})

const pijnpunten = [
  'Klanten vragen om professionele beelden van hun event op jullie locatie',
  'Jullie eigen congresruimtes zijn moeilijk goed vast te leggen',
  'Je wilt een vaste preferred vendor die je kunt aanbevelen',
  'Beeldmateriaal is verouderd of niet professioneel genoeg voor sales',
]

const waarom = [
  'Vaste partner voor zowel event-content als faciliteitsbeelden',
  'Ervaring met hotelcongressen en de specifieke lichtomstandigheden',
  'Afstemming met jullie technische dienst en event-coördinatie',
  'Levering binnen 48 uur, zodat klanten snel kunnen communiceren',
  'Preferred vendor constructie beschikbaar voor vast samenwerkingsverband',
]
</script>

<template>
  <main>
    <section class="voor-hero section">
      <div class="container">
        <p class="voor-hero__label">Voor hotels met congresfaciliteiten</p>
        <h1 class="voor-hero__h1">Voor hotels met congresfaciliteiten.</h1>
        <p class="voor-hero__sub">Eventcontent voor de congressen die jullie hosten. Plus marketingbeelden van jullie eigen faciliteiten.</p>
        <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">Kennismaken</RouterLink>
      </div>
    </section>

    <section class="pijn section section--dark">
      <div class="container">
        <h2 class="pijn__title">Herken je dit?</h2>
        <ul class="pijn__list">
          <li v-for="item in pijnpunten" :key="item"><span class="pijn__dot">·</span>{{ item }}</li>
        </ul>
      </div>
    </section>

    <section class="waarom section">
      <div class="container">
        <h2 class="waarom__title">Waarom Eventshoot.nl voor hotels.</h2>
        <ul class="waarom__list">
          <li v-for="item in waarom" :key="item"><span class="waarom__check">✓</span>{{ item }}</li>
        </ul>
        <RouterLink to="/kennismaken" class="btn btn--primary" style="margin-top:2rem; display:inline-flex">Gesprek inplannen</RouterLink>
      </div>
    </section>

    <UspGrid />
    <RolfContact />
  </main>
</template>

<style scoped>
.voor-hero { padding-top: 9rem; }
.voor-hero__label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.75rem; }
.voor-hero__h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 1.25rem; }
.voor-hero__sub { font-size: 1.05rem; color: rgba(255,255,255,0.75); line-height: 1.75; max-width: 620px; margin-bottom: 2rem; }
.pijn__title, .waarom__title { font-size: clamp(1.3rem, 2.5vw, 1.85rem); font-weight: 800; margin-bottom: 1.5rem; }
.pijn__list, .waarom__list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; max-width: 680px; }
.pijn__list li, .waarom__list li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.95rem; color: rgba(255,255,255,0.85); line-height: 1.55; }
.pijn__dot { color: rgba(255,255,255,0.35); font-size: 1.5rem; flex-shrink: 0; line-height: 1; }
.waarom__check { color: var(--color-accent); font-weight: 700; flex-shrink: 0; }
</style>
