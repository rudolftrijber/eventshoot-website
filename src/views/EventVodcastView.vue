<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  CalendarDaysIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import OptimizedImage from '@/components/OptimizedImage.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import FaqBlock from '@/components/FaqBlock.vue'
import { usePageSeo } from '@/composables/usePageSeo'
import {
  SHOW_VODCAST_INVESTMENT,
  VODCAST_GALLERY,
  VODCAST_HERO,
  VODCAST_INTRO_VIMEO,
  VODCAST_ONEPAGER_EN,
  VODCAST_ONEPAGER_NL,
} from '@/data/vodcastPage'

const { t, locale, tm } = useI18n()

const videoParagraphs = computed(() => {
  const items = tm('vodcast.videoBody')
  return Array.isArray(items) ? (items as string[]) : []
})

const OG_IMAGE = 'https://eventshoot.nl/DATA_EVENTSHOOT/SITE_IMAGES/VODCAST/RT202570.jpg'
const PAGE_URL = 'https://eventshoot.nl/diensten/event-vodcast-recording'

usePageSeo('eventVodcast', { url: PAGE_URL, image: OG_IMAGE })

const showInvestment = SHOW_VODCAST_INVESTMENT

const onepagerPdf = computed(() =>
  locale.value.startsWith('en') ? VODCAST_ONEPAGER_EN : VODCAST_ONEPAGER_NL,
)

const yieldItems = computed(() => [
  { icon: CalendarDaysIcon, title: t('vodcast.yield1Title'), text: t('vodcast.yield1') },
  { icon: DevicePhoneMobileIcon, title: t('vodcast.yield2Title'), text: t('vodcast.yield2') },
  { icon: SparklesIcon, title: t('vodcast.yield3Title'), text: t('vodcast.yield3') },
  { icon: MapPinIcon, title: t('vodcast.yield4Title'), text: t('vodcast.yield4') },
])

const gallery = computed(() =>
  VODCAST_GALLERY.map(photo => ({
    src: photo.src,
    alt: t(`vodcast.${photo.altKey}`),
  })),
)

const lightboxIndex = ref<number | null>(null)

const currentPhoto = computed(() =>
  lightboxIndex.value !== null ? gallery.value[lightboxIndex.value] : null,
)

function openLightbox(index: number) {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

function prevPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value =
    (lightboxIndex.value - 1 + gallery.value.length) % gallery.value.length
}

function nextPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % gallery.value.length
}

function onKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)

  const existing = document.getElementById('service-schema-vodcast')
  if (!existing) {
    const script = document.createElement('script')
    script.id = 'service-schema-vodcast'
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Event Vodcast Recording',
      name: 'Event Vodcast Recording',
      provider: { '@type': 'LocalBusiness', name: 'Eventshoot.nl' },
      areaServed: 'Nederland',
      description: t('seo.eventVodcast.description'),
      url: PAGE_URL,
    })
    document.head.appendChild(script)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  const schema = document.getElementById('service-schema-vodcast')
  schema?.remove()
})
</script>

<template>
  <main>
    <!-- 1. Hero -->
    <section class="vod-hero">
      <div class="vod-hero__bg">
        <OptimizedImage
          :src="VODCAST_HERO"
          :alt="t('vodcast.altHero')"
          preset="hero"
          :priority="true"
        />
        <div class="vod-hero__overlay"></div>
      </div>
      <div class="container vod-hero__content">
        <h1>{{ t('vodcast.h1') }}</h1>
        <p>{{ t('vodcast.sub') }}</p>
        <div class="vod-hero__btns">
          <a href="tel:+31625177728" class="btn btn--primary btn--lg">{{ t('vodcast.ctaCall') }}</a>
          <a
            :href="onepagerPdf"
            class="btn btn--outline btn--lg"
            target="_blank"
            rel="noopener noreferrer"
          >{{ t('vodcast.ctaDownload') }}</a>
        </div>
      </div>
    </section>

    <!-- 2. Gecentreerde videostrook -->
    <section class="vod-feature">
      <div class="container">
        <h2 class="vod-feature__title">{{ t('vodcast.videoTitle') }}</h2>
        <div class="vod-feature__media">
          <iframe
            :src="VODCAST_INTRO_VIMEO"
            :title="t('vodcast.videoTitle')"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <div class="vod-feature__body">
          <p v-for="(para, i) in videoParagraphs" :key="i">{{ para }}</p>
        </div>
      </div>
    </section>

    <!-- 3. Wat het oplevert -->
    <section class="vod-yield">
      <div class="container">
        <SectionHeading :title="t('vodcast.yieldTitle')" :subtitle="t('vodcast.yieldSub')" />
        <div class="vod-yield__grid">
          <article v-for="item in yieldItems" :key="item.title" class="vod-yield__card">
            <component :is="item.icon" class="vod-yield__icon" aria-hidden="true" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. Praktisch -->
    <section class="vod-practical section">
      <div class="container">
        <div class="vod-practical__box">
          <h2>{{ t('vodcast.practicalTitle') }}</h2>
          <ul>
            <li>{{ t('vodcast.practical1') }}</li>
            <li>{{ t('vodcast.practical2') }}</li>
            <li>{{ t('vodcast.practical3') }}</li>
            <li>{{ t('vodcast.practical4') }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 6. Fotogalerij -->
    <section class="vod-gallery section section--dark">
      <div class="container">
        <SectionHeading :title="t('vodcast.galleryTitle')" />
        <div class="vod-gallery__grid">
          <button
            v-for="(photo, index) in gallery"
            :key="photo.src"
            type="button"
            class="vod-gallery__item"
            :aria-label="t('vodcast.openPhoto', { alt: photo.alt })"
            @click="openLightbox(index)"
          >
            <OptimizedImage :src="photo.src" :alt="photo.alt" preset="thumb" />
          </button>
        </div>
      </div>
    </section>

    <div class="vod-faq">
      <FaqBlock page="event-vodcast-recording" />
    </div>

    <!-- 7. Download-strook -->
    <section class="vod-download">
      <div class="container vod-download__inner">
        <h2>{{ t('vodcast.downloadTitle') }}</h2>
        <a
          :href="onepagerPdf"
          class="btn btn--primary btn--lg"
          target="_blank"
          rel="noopener noreferrer"
        >{{ t('vodcast.downloadBtn') }}</a>
      </div>
    </section>

    <!-- 8. Investering (optioneel) -->
    <section v-if="showInvestment" class="vod-invest section section--dark">
      <div class="container">
        <SectionHeading :title="t('vodcast.investTitle')" />
        <div class="vod-invest__grid">
          <article class="vod-invest__card">
            <h3>{{ t('vodcast.investFull') }}</h3>
            <p>{{ t('vodcast.investFullNote') }}</p>
          </article>
          <article class="vod-invest__card">
            <h3>{{ t('vodcast.investCapture') }}</h3>
            <p>{{ t('vodcast.investCaptureNote') }}</p>
          </article>
        </div>
      </div>
    </section>

    <div
      v-if="lightboxIndex !== null && currentPhoto"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="currentPhoto.alt"
      @click.self="closeLightbox"
    >
      <button type="button" class="lightbox__close" :aria-label="t('vodcast.closePhoto')" @click="closeLightbox">✕</button>
      <button type="button" class="lightbox__prev" :aria-label="t('vodcast.prevPhoto')" @click="prevPhoto">‹</button>
      <div class="lightbox__img-wrap">
        <img :src="currentPhoto.src" :alt="currentPhoto.alt" />
      </div>
      <button type="button" class="lightbox__next" :aria-label="t('vodcast.nextPhoto')" @click="nextPhoto">›</button>
      <div class="lightbox__toolbar">
        <span class="lightbox__counter">{{ lightboxIndex + 1 }} / {{ gallery.length }}</span>
      </div>
    </div>
  </main>
</template>

<style scoped>
.vod-hero {
  position: relative;
  aspect-ratio: 20 / 9;
  min-height: 56vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vod-hero__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.vod-hero__bg :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.vod-hero__bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vod-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
}

.vod-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 820px;
  margin: 0 auto;
  padding-top: 6.5rem;
  padding-bottom: 3.25rem;
}

.vod-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.vod-hero__content p {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 2rem;
  line-height: 1.75;
}

.vod-hero__btns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.vod-feature {
  background: rgba(49, 159, 232, 0.40);
  padding: 8.5rem 0;
}

.vod-feature__title {
  text-align: center;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 2rem;
}

.vod-feature__body {
  text-align: center;
  max-width: 760px;
  margin: 2.5rem auto 0;
}

.vod-feature__body p {
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.8;
  margin-bottom: 1.35rem;
}

.vod-feature__body p:last-child {
  margin-bottom: 0;
}

.vod-feature__media {
  position: relative;
  width: 85%;
  margin: 0 auto;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.35);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.vod-feature__video,
.vod-feature__media iframe,
.vod-feature__media :deep(picture),
.vod-feature__media :deep(img) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
}

.vod-yield {
  background: rgba(255, 140, 0, 0.42);
  padding: 5rem 0;
}

.vod-yield__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.vod-yield__card {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: background var(--transition);
}

.vod-yield__card:hover {
  background: rgba(0, 0, 0, 0.50);
}

.vod-yield__icon {
  width: 28px;
  height: 28px;
  color: #fff;
  stroke-width: 1.5;
  flex-shrink: 0;
}

.vod-yield__card h3 {
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.3;
}

.vod-yield :deep(.section-heading__subtitle) {
  color: rgba(255, 255, 255, 0.88);
}

.vod-yield__card p {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
}

.vod-practical__box {
  background: rgba(255, 255, 255, 0.10);
  border-radius: 12px;
  padding: 2.5rem 2rem;
  max-width: 820px;
  margin: 0 auto;
}

.vod-practical__box h2 {
  font-size: clamp(1.3rem, 2.2vw, 1.85rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
}

.vod-practical__box ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vod-practical__box li {
  position: relative;
  padding-left: 1.4rem;
  font-size: 0.975rem;
  color: var(--color-text-muted);
  line-height: 1.75;
}

.vod-practical__box li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}

.vod-gallery__grid {
  columns: 3;
  column-gap: 0.75rem;
}

.vod-gallery__item {
  display: block;
  width: 100%;
  padding: 0;
  margin-bottom: 0.75rem;
  border: none;
  background: none;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  break-inside: avoid;
}

.vod-gallery__item :deep(img) {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.vod-gallery__item:hover :deep(img) {
  transform: scale(1.04);
}

.vod-download {
  background: rgba(255, 140, 0, 0.42);
  padding: 3.5rem 0;
}

.vod-download__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.vod-download__inner h2 {
  font-size: clamp(1.4rem, 3vw, 2.1rem);
  font-weight: 800;
}

.vod-invest__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.vod-invest__card {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 2rem 1.75rem;
}

.vod-invest__card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--color-accent);
}

.vod-invest__card p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
}

.vod-faq :deep(.faq-block) {
  background: rgba(49, 159, 232, 0.40) !important;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__img-wrap {
  max-width: 90vw;
  max-height: 80vh;
}

.lightbox__img-wrap img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox__close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 1.25rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.lightbox__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox__prev,
.lightbox__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 2.5rem;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__prev { left: 1.5rem; }
.lightbox__next { right: 1.5rem; }

.lightbox__prev:hover,
.lightbox__next:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox__toolbar {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  border-radius: 50px;
  padding: 0.6rem 1.25rem;
}

.lightbox__counter {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .vod-yield__grid { grid-template-columns: repeat(2, 1fr); }
  .vod-invest__grid { grid-template-columns: 1fr; }
  .vod-gallery__grid { columns: 2; }
}

@media (max-width: 768px) {
  .vod-hero {
    width: 100%;
  }

  .vod-hero__content {
    padding-top: 5.5rem;
    padding-bottom: 2.5rem;
  }
}

@media (max-width: 500px) {
  .vod-yield__grid { grid-template-columns: 1fr; }
  .vod-gallery__grid { columns: 1; }
  .lightbox__prev { left: 0.5rem; }
  .lightbox__next { right: 0.5rem; }
}
</style>
