<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UspGrid from '@/components/UspGrid.vue'
import PricingCard from '@/components/PricingCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import FaqBlock from '@/components/FaqBlock.vue'
import BackgroundVideo from '@/components/BackgroundVideo.vue'
import { useSeo } from '@/composables/useSeo'
import { useEmailJS } from '@/composables/useEmailJS'

const { t } = useI18n()

onMounted(() => {
  useSeo({
    title: 'Eventshoot.nl | Jouw event is een goudmijn aan content',
    description: 'Professionele eventfotografie en video voor congressen, jaarcongressen en bedrijfsevents. 25+ kant-en-klare items binnen 48 uur. Gemaakt door mensen, niet door AI.',
  })

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
  { file: 'beelegal.png', name: 'BeeLegal' },
  { file: 'powermatching.png', name: 'Powermatching' },
  { file: 'vectocon.png', name: 'Vectocon' },
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
        <BackgroundVideo
          video-class="hero__video"
          fallback-class="hero__video"
          fallback-src="/eventshoot-57.jpg"
          src="/images/eventshoot.nl_hero_homepagina_v9%20(1080p).mp4"
        />
        <div class="hero__overlay"></div>
      </div>
      <div class="container hero__content">
        <h1 class="hero__title">{{ t('home.h1') }}</h1>
        <p class="hero__subtitle">{{ t('home.sub') }}</p>
        <div class="hero__ctas">
          <RouterLink to="/kennismaken" class="btn btn--primary btn--lg">{{ t('home.cta1') }}</RouterLink>
          <RouterLink to="/tarieven" class="btn btn--outline btn--lg">{{ t('home.cta2') }}</RouterLink>
        </div>
      </div>
    </section>

    <!-- Motto strook -->
    <section class="intro">
      <div class="container intro__inner">
        <h2 class="intro__title">{{ t('home.motto') }}</h2>
        <p class="intro__text">{{ t('home.mottoSub') }}</p>
      </div>
    </section>

    <!-- Trust logos carrousel -->
    <section class="trust">
      <p class="trust__label">{{ t('home.trust') }}</p>
      <div class="trust__track-wrap">
        <div class="trust__track">
          <div class="trust__slide" v-for="n in 2" :key="n">
            <img v-for="logo in logos" :key="logo.file + n" :src="`/DATA_EVENTSHOOT/SITE_IMAGES/OPDRACHTGEVERS/${logo.file}`" :alt="logo.name" class="trust__logo" />
          </div>
        </div>
      </div>
    </section>

    <!-- USPs -->
    <UspGrid />

    <!-- Featured package -->
    <section class="featured section section--dark">
      <div class="container">
        <SectionHeading
          :title="t('home_featured.title')"
          :subtitle="t('home_featured.sub')"
        />
        <div class="featured__card-wrap">
          <PricingCard
            :name="t('home_featured.pkgName')"
            price="€2.250"
            :description="t('home_featured.pkgDesc')"
            :features="[t('home_featured.pkgFeature1'), t('home_featured.pkgFeature2'), t('home_featured.pkgFeature3'), t('home_featured.pkgFeature4'), t('home_featured.pkgFeature5'), t('home_featured.pkgFeature6')]"
            image="/DATA_EVENTSHOOT/SITE_IMAGES/PRIJZEN/VIDEO.png"
            :highlighted="true"
          />
        </div>
        <div class="featured__more">
          <RouterLink to="/tarieven" class="btn btn--outline">{{ t('home_featured.allPackages') }}</RouterLink>
        </div>
      </div>
    </section>

    <!-- Checklist banner -->
    <section class="checklist-banner">
      <div class="container checklist-banner__content">
        <h2 class="checklist-banner__title">{{ t('home_featured.checklistTitle') }}</h2>
        <p class="checklist-banner__sub">{{ t('home_featured.checklistSub') }}</p>
        <template v-if="!checklistSubmitted">
          <form class="checklist-form" @submit.prevent="submitChecklistEmail" novalidate>
            <input
              v-model="checklistEmail"
              type="email"
              :placeholder="t('home_featured.checklistPlaceholder')"
              required
              autocomplete="email"
              class="checklist-form__input"
            />
            <button type="submit" class="checklist-banner__btn" :disabled="checklistSubmitting">
              {{ checklistSubmitting ? t('home_featured.checklistBusy') : t('home_featured.checklistBtn') }}
            </button>
          </form>
          <p v-if="checklistError" class="checklist-form__error">{{ t('home_featured.checklistError') }}</p>
          <p class="checklist-form__privacy">{{ t('home_featured.checklistPrivacy') }}</p>
        </template>
        <template v-else>
          <p class="checklist-banner__success">{{ t('home_featured.checklistSuccess') }}</p>
        </template>
      </div>
    </section>

    <FaqBlock page="home" />

    <!-- Google Reviews -->
    <section class="reviews">
      <div class="container">
        <SectionHeading :title="t('home_featured.reviewsTitle')" />
        <div class="elfsight-app-4ed38ed1-21e2-4238-bb5c-d1127391e146"></div>
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

.hero__video,
.hero__bg :deep(img) {
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
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 1.5rem;
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
  height: 120px;
  width: auto;
  object-fit: contain;
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
  border: none;
  box-shadow: none;
  background: transparent;
}

.reviews :deep(.elfsight-app),
.reviews :deep([class*='elfsight-app']) {
  border: none !important;
  box-shadow: none !important;
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
