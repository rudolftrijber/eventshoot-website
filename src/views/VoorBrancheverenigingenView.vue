<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UspGrid from '@/components/UspGrid.vue'
import RolfContact from '@/components/RolfContact.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Voor brancheverenigingen | Eventshoot.nl',
    description: 'Één content-partner voor je jaarcongres, ledendagen en vakdagen. Geleverd binnen 48 uur, klaar voor je ledencommunicatie.',
    url: 'https://eventshoot.nl/voor/brancheverenigingen',
  })
})

const pijnpunten = [
  'Je jaarcongres is voorbij en er zijn nauwelijks bruikbare beelden',
  'De foto\'s die leden sturen zijn te wisselvallig voor je nieuwsbrief',
  'Je wilt de volgende editie beter promoten, maar mist beeldmateriaal',
  'Je marketingbudget is beperkt, maar kwaliteit moet toch professioneel zijn',
]

const waarom = [
  'Eén leverancier voor foto\'s, aftermovie en sprekersinterviews',
  'Levering binnen 48 uur, klaar voor je ledencommunicatie',
  'Ervaring met congressen van 50 tot 1.000+ deelnemers',
  'Afstemming met jouw technische dienst en locatie vooraf',
  'Herhaalbaar: dezelfde stijl elk jaar, herkenbaar voor je leden',
]
</script>

<template>
  <main>
    <section class="voor-hero section">
      <div class="container">
        <p class="voor-hero__label">Voor brancheverenigingen</p>
        <h1 class="voor-hero__h1">Voor brancheverenigingen.</h1>
        <p class="voor-hero__sub">Eén content-partner voor je jaarcongres, ledendagen en vakdagen. Geleverd binnen 48 uur, klaar voor je ledencommunicatie.</p>
        <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">Kennismaken</RouterLink>
      </div>
    </section>

    <section class="pijn section section--dark">
      <div class="container">
        <h2 class="pijn__title">Herken je dit?</h2>
        <ul class="pijn__list">
          <li v-for="item in pijnpunten" :key="item">
            <span class="pijn__dot">·</span>{{ item }}
          </li>
        </ul>
      </div>
    </section>

    <section class="waarom section">
      <div class="container">
        <h2 class="waarom__title">Waarom Eventshoot.nl voor brancheverenigingen.</h2>
        <ul class="waarom__list">
          <li v-for="item in waarom" :key="item">
            <span class="waarom__check">✓</span>{{ item }}
          </li>
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
