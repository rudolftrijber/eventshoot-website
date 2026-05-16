<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UspGrid from '@/components/UspGrid.vue'
import RolfContact from '@/components/RolfContact.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Voor bedrijven met eigen events | Eventshoot.nl',
    description: 'User conferences, klantdagen, bedrijfsbijeenkomsten. Eén productiedag, een contentbox waar je marketeer maanden mee vooruit kan.',
    url: 'https://eventshoot.nl/voor/bedrijven',
  })
})

const pijnpunten = [
  'Na je user conference of klantdag heb je nauwelijks bruikbaar beeldmateriaal',
  'Je marketeer moet zelf foto\'s maken naast de organisatie',
  'De beelden die je hebt zijn inconsistent of niet geschikt voor LinkedIn',
  'Je wilt de volgende editie groter maken, maar mist overtuigend bewijsmateriaal',
]

const waarom = [
  'Eén productiedag levert foto\'s, aftermovie en interviews op',
  '25+ kant-en-klare items, klaar voor je marketeer',
  'Levering binnen 48 uur, terwijl het event nog top of mind is',
  'In de juiste formaten voor elk kanaal: LinkedIn, website, nieuwsbrief',
  'Professioneel en representatief, ook intern',
]
</script>

<template>
  <main>
    <section class="voor-hero section">
      <div class="container">
        <p class="voor-hero__label">Voor bedrijven met eigen events</p>
        <h1 class="voor-hero__h1">Voor bedrijven met eigen events.</h1>
        <p class="voor-hero__sub">User conferences, klantdagen, bedrijfsbijeenkomsten. Eén productiedag, een contentbox waar je marketeer maanden mee vooruit kan.</p>
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
        <h2 class="waarom__title">Waarom Eventshoot.nl voor bedrijven.</h2>
        <ul class="waarom__list">
          <li v-for="item in waarom" :key="item"><span class="waarom__check">✓</span>{{ item }}</li>
        </ul>
        <RouterLink to="/tarieven" class="btn btn--primary" style="margin-top:2rem; display:inline-flex">Bekijk pakketten</RouterLink>
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
