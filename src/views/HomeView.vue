<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import UspGrid from '@/components/UspGrid.vue'
import PricingCard from '@/components/PricingCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import { useSeo } from '@/composables/useSeo'
import { useEmailJS } from '@/composables/useEmailJS'

onMounted(() => {
  useSeo({
    title: 'Eventfotograaf Nederland | Eventshoot.nl',
    description: 'Professionele eventfotografie en eventvideo voor congressen, seminars en zakelijke bijeenkomsten. 40+ jaar ervaring. Geleverd binnen 48 uur.',
  })

  // Elfsight widget hertriggeren bij terugkeer op de pagina
  const w = window as Window & { Elfsight?: { initialize: () => void } }
  if (w.Elfsight) w.Elfsight.initialize()
})

const { send } = useEmailJS()

const checklistEmail = ref('')
const checklistSubmitting = ref(false)
const checklistSubmitted = ref(false)
const checklistError = ref(false)

async function submitChecklistEmail() {
  checklistSubmitting.value = true
  checklistError.value = false
  try {
    await send(import.meta.env.VITE_EMAILJS_CHECKLIST_TEMPLATE_ID, {
      from_email: checklistEmail.value,
      message: 'Heeft de Evenementen Content Checklist gedownload via eventshoot.nl',
    })
    checklistSubmitted.value = true
    triggerDownload()
  } catch {
    checklistError.value = true
  } finally {
    checklistSubmitting.value = false
  }
}

function triggerDownload() {
  const link = document.createElement('a')
  link.href = '/images/Checklist_Eventfotografie_aftermovie_interviews.pdf'
  link.download = 'Evenementen_Content_Checklist_Eventshoot.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

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
]

const teaserImages = [
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-50-1-scaled.jpg', alt: 'Eventfotografie congres Nederland' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-52-1.jpg', alt: 'Zakelijk evenement fotograaf' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-53-1.jpg', alt: 'Eventfotograaf seminar' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-54-1-scaled.jpg', alt: 'Congres fotografie Nederland' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-56-1.jpg', alt: 'Professionele eventfotografie' },
  { src: 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-57-1-scaled.jpg', alt: 'Evenement fotograaf zakelijk' },
]
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero__bg">
        <video
          class="hero__video"
          src="/images/eventshoot.nl_hero_homepagina_v9%20(1080p).mp4"
          autoplay
          muted
          loop
          playsinline
        />
        <div class="hero__overlay"></div>
      </div>
      <div class="container hero__content">
        <h1 class="hero__title">Jouw zakelijke event verdient meer dan een paar telefoonfotos.</h1>
        <p class="hero__subtitle">Professionele eventfotografie en -video voor congressen, conferenties en zakelijke bijeenkomsten door heel Nederland. Snel geleverd, direct bruikbaar.</p>
        <div class="hero__ctas">
          <RouterLink to="/contact" class="btn btn--primary btn--lg">Neem contact op</RouterLink>
          <RouterLink to="/tarieven" class="btn btn--outline btn--lg">Bekijk de paketten</RouterLink>
        </div>
      </div>
    </section>

    <!-- Intro strook -->
    <section class="intro">
      <div class="container intro__inner">
        <h2 class="intro__title">Meer dan beelden. Bruikbare content</h2>
        <p class="intro__text">Een goed verzorgd event verdient beelden die dat ook uitstralen. Eventshoot.nl is de vaste eventfotograaf voor congresorganisaties, eventbureau's en bedrijven door heel Nederland. Rolf legt de energie, de interactie en de gezichten vast die jouw event tot leven brengen, op LinkedIn, je website en in je volgende uitnodiging.</p>
      </div>
    </section>

    <!-- Trust logos carrousel -->
    <section class="trust">
      <p class="trust__label">Vertrouwd door organisaties als…</p>
      <div class="trust__track-wrap">
        <div class="trust__track">
          <div class="trust__slide" v-for="n in 2" :key="n">
            <img v-for="logo in logos" :key="logo.file + n" :src="`/images/klanten/${logo.file}`" :alt="logo.name" class="trust__logo" />
          </div>
        </div>
      </div>
    </section>

    <!-- USPs -->
    <UspGrid />

    <!-- Video CTA -->
    <section class="video-cta">
      <div class="container video-cta__inner">
        <h2 class="video-cta__title">Ook video nodig op je evenement?</h2>
        <p class="video-cta__sub">Van een snelle social aftermovie tot een volledige corporate productie,<br>bekijk wat mogelijk is.</p>
        <RouterLink to="/eventvideo" class="btn btn--primary">Bekijk eventvideo</RouterLink>
      </div>
    </section>

    <!-- Featured package -->
    <section class="featured section section--dark">
      <div class="container">
        <SectionHeading
          title="Het meest gekozen pakket"
          subtitle="Voor de meeste events is het Gouden uur pakket de perfecte match."
        />
        <div class="featured__card-wrap">
          <PricingCard
            name="Gouden uur"
            price="€595"
            description="Voldoende voor LinkedIn, website en uitnodigingen."
            :features="['4 uur aanwezig op jouw event', '100–150 professioneel bewerkte foto\'s', '1 social aftermovie (30–60 seconden)', 'Geleverd binnen 48 uur', 'Online galerij met downloadlink']"
            image="/images/Eventshoot_GOLDEN_HOUR.jpg"
            :highlighted="true"
          />
        </div>
        <div class="featured__more">
          <RouterLink to="/tarieven" class="btn btn--outline">Alle pakketten bekijken</RouterLink>
        </div>
      </div>
    </section>

    <!-- Checklist banner -->
    <section class="checklist-banner">
      <div class="container checklist-banner__content">
        <h2 class="checklist-banner__title">Download gratis onze Event Content Checklist</h2>
        <p class="checklist-banner__sub">Zorg dat je foto- en videograaf precies weet wat je nodig hebt. Niets missen, altijd bruikbare beelden. Gratis te downloaden.</p>
        <template v-if="!checklistSubmitted">
          <form class="checklist-form" @submit.prevent="submitChecklistEmail" novalidate>
            <input
              v-model="checklistEmail"
              type="email"
              placeholder="jouw@emailadres.nl"
              required
              autocomplete="email"
              class="checklist-form__input"
            />
            <button type="submit" class="checklist-banner__btn" :disabled="checklistSubmitting">
              {{ checklistSubmitting ? 'Moment…' : 'Downloaden' }}
            </button>
          </form>
          <p v-if="checklistError" class="checklist-form__error">Er ging iets mis. Probeer het opnieuw.</p>
          <p class="checklist-form__privacy">Geen spam. Je kunt je op elk moment afmelden.</p>
        </template>
        <template v-else>
          <p class="checklist-banner__success">
            ✓ Download begint zo. Je ontvangt geen spam — beloofd.
          </p>
        </template>
      </div>
    </section>

    <!-- Google Reviews -->
    <section class="reviews">
      <div class="container">
        <SectionHeading title="Wat klanten zeggen" />
        <div class="elfsight-app-4ed38ed1-21e2-4238-bb5c-d1127391e146"></div>
      </div>
    </section>

    <!-- Rolf sectie -->
    <section class="rolf">
      <div class="rolf__inner">
        <div class="rolf__photo-wrap">
          <img src="/rolf_trijber_4.jpg" alt="Rolf Trijber — Eventfotograaf" class="rolf__photo" />
        </div>
        <h2 class="rolf__title">Vragen? Bel Rolf</h2>
        <a href="tel:+31625177728" class="rolf__phone">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
          06 251 777 28
        </a>
        <a href="https://www.linkedin.com/in/rolftrijber" target="_blank" rel="noopener" class="rolf__linkedin">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero__bg {
  position: absolute;
  inset: 0;
}

.hero__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.60) 100%);
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  padding-top: 9rem;
  padding-bottom: 4rem;
}

.hero__title {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  color: #fff;
}

.hero__subtitle {
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: rgba(255,255,255,0.8);
  margin-bottom: 2rem;
  line-height: 1.7;
  max-width: 580px;
}

.hero__ctas {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.intro {
  background: rgba(255, 140, 0, 0.42);
  padding: 5.5rem 0;
}

.intro__inner {
  text-align: center;
  max-width: 780px;
  margin: 0 auto;
}

.intro__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
}

.intro__text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
}

.trust {
  padding: 5rem 0;
  background: transparent;
  overflow: hidden;
}

.trust__label {
  font-size: 0.78rem;
  color: var(--color-blue);
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}

.trust__track-wrap {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.trust__track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}

.trust__track:hover {
  animation-play-state: paused;
}

.trust__slide {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 0 2rem;
}

.trust__logo {
  height: 150px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 1;
  flex-shrink: 0;
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.featured__card-wrap {
  max-width: 420px;
  margin: 0 auto 2rem;
}

.featured__more {
  text-align: center;
}

.teaser__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.teaser__item img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: var(--radius);
  transition: transform var(--transition);
}

.teaser__item img:hover {
  transform: scale(1.02);
}

.video-cta {
  background: rgba(49, 159, 232, 0.25);
  padding: 4rem 0;
}

.video-cta__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  max-width: 700px;
  margin: 0 auto;
}

.video-cta__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700;
  color: #fff;
}

.video-cta__sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
}

.reviews {
  padding: 4rem 0;
}

.rolf {
  display: flex;
  justify-content: center;
  background: rgba(49, 159, 232, 0.40);
}

.rolf__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 5rem 2rem;
}

.rolf__photo-wrap {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  overflow: hidden;
  border: none;
}

.rolf__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rolf__title {
  font-size: 1.75rem;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.01em;
}

.rolf__phone {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  text-decoration: none;
  transition: background var(--transition), transform var(--transition);
}

.rolf__phone:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.rolf__linkedin {
  color: rgba(255,255,255,0.7);
  transition: color var(--transition);
}

.rolf__linkedin:hover {
  color: #fff;
}

.rolf__linkedin svg {
  width: 44px;
  height: 44px;
}

.checklist-banner {
  padding: 5.5rem 0;
  background: rgba(255, 140, 0, 0.42);
  text-align: center;
}

.checklist-banner__content {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.checklist-banner__title {
  font-size: clamp(1.2rem, 2.2vw, 1.6rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}

.checklist-banner__sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  max-width: 560px;
}

.checklist-form {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  max-width: 520px;
}

.checklist-form .checklist-banner__btn {
  margin-top: 0;
}

.checklist-form__input {
  flex: 1;
  min-width: 220px;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: none;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  outline: none;
  transition: background var(--transition);
}

.checklist-form__input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.checklist-form__input:focus {
  background: rgba(255, 255, 255, 0.25);
}

.checklist-form__privacy {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
  margin-top: -0.25rem;
}

.checklist-form__error {
  font-size: 0.85rem;
  color: #ffcdd2;
  margin-top: -0.5rem;
}

.checklist-banner__success {
  font-size: 1.05rem;
  color: #fff;
  font-weight: 600;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}

.checklist-banner__btn {
  display: inline-flex;
  align-items: center;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  border: none;
  text-decoration: none;
  transition: background var(--transition), transform var(--transition);
  margin-top: 0.5rem;
  cursor: pointer;
}

.checklist-banner__btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.checklist-banner__btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .teaser__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
