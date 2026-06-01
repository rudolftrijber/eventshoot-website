<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import UspGrid from '@/components/UspGrid.vue'
import OptimizedImage from '@/components/OptimizedImage.vue'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

onMounted(() => {
  useSeo({
    title: 'Werk dat voor zichzelf spreekt | Eventshoot.nl',
    description: 'Een selectie uit congressen, jaarcongressen, ledendagen en bedrijfsbijeenkomsten die Eventshoot.nl heeft mogen vastleggen.',
    url: 'https://eventshoot.nl/werk',
  })
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

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

const BASE = '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/'

const allPhotos = [
  { src: BASE + 'eventshoot-50.jpg',  alt: 'Eventfotografie congres Nederland' },
  { src: BASE + 'eventshoot-51.jpg',  alt: 'Zakelijk evenement fotografie' },
  { src: BASE + 'eventshoot-52.jpg',  alt: 'Seminar fotograaf' },
  { src: BASE + 'eventshoot-53.jpg',  alt: 'Congres fotografie' },
  { src: BASE + 'eventshoot-54.jpg',  alt: 'Professionele eventfotografie' },
  { src: BASE + 'eventshoot-55.jpg',  alt: 'Evenement fotograaf' },
  { src: BASE + 'eventshoot-56.jpg',  alt: 'Zakelijk congres fotografie' },
  { src: BASE + 'eventshoot-57.jpg',  alt: 'Netwerkbijeenkomst fotografie' },
  { src: BASE + 'eventshoot-58.jpg',  alt: 'Award uitreiking fotografie' },
  { src: BASE + 'eventshoot-59.jpg',  alt: 'Bedrijfsevenement fotografie' },
  { src: BASE + 'eventshoot-60.jpg',  alt: 'Beurs fotografie Nederland' },
  { src: BASE + 'eventshoot-61.jpg',  alt: 'Productlancering fotografie' },
  { src: BASE + 'eventshoot-62.jpg',  alt: 'Congres spreker fotografie' },
  { src: BASE + 'eventshoot-63.jpg',  alt: 'Zakelijk event reportage' },
  { src: BASE + 'eventshoot-64.jpg',  alt: 'Seminar fotoreportage' },
  { src: BASE + 'eventshoot-65.jpg',  alt: 'Congres deelnemers fotografie' },
  { src: BASE + 'eventshoot-66.jpg',  alt: 'Eventfotografie briefing' },
  { src: BASE + 'eventshoot-67.jpg',  alt: 'Corporate event fotografie' },
  { src: BASE + 'eventshoot-69.jpg',  alt: 'Zakelijk seminar fotografie' },
  { src: BASE + 'eventshoot-70.jpg',  alt: 'Congres fotografie Nederland' },
  { src: BASE + 'eventshoot-72.jpg',  alt: 'Evenement reportage fotografie' },
  { src: BASE + 'eventshoot-74.jpg',  alt: 'Award uitreiking fotograaf' },
  { src: BASE + 'eventshoot-75.jpg',  alt: 'Bijeenkomst fotografie' },
  { src: BASE + 'eventshoot-76.jpg',  alt: 'Zakelijk evenement Nederland' },
  { src: BASE + 'eventshoot-77.jpg',  alt: 'Congres en seminar fotografie' },
  { src: BASE + 'eventshoot-78.jpg',  alt: 'Professionele event fotograaf' },
  { src: BASE + 'eventshoot-79.jpg',  alt: 'Corporate fotografie evenement' },
  { src: BASE + 'eventshoot-80.jpg',  alt: 'Zakelijke bijeenkomst fotografie' },
  { src: BASE + 'eventshoot-81.jpg',  alt: 'Event fotoreportage Nederland' },
  { src: BASE + 'eventshoot-82.jpg',  alt: 'Congres fotografie reportage' },
  { src: BASE + 'eventshoot-83.jpg',  alt: 'Eventfotografie zakelijk' },
  { src: BASE + 'eventshoot-84.jpg',  alt: 'Seminar fotografie' },
  { src: BASE + 'eventshoot-85.jpg',  alt: 'Congres fotografie' },
  { src: BASE + 'eventshoot-86.jpg',  alt: 'Zakelijk event Nederland' },
  { src: BASE + 'eventshoot-87.jpg',  alt: 'Evenement fotografie' },
  { src: BASE + 'eventshoot-88.jpg',  alt: 'Congres spreker' },
  { src: BASE + 'eventshoot-89.jpg',  alt: 'Bedrijfsevent fotografie' },
  { src: BASE + 'eventshoot-90.jpg',  alt: 'Professionele fotografie' },
  { src: BASE + 'eventshoot-91.jpg',  alt: 'Award ceremony fotografie' },
  { src: BASE + 'eventshoot-92.jpg',  alt: 'Zakelijk congres' },
  { src: BASE + 'eventshoot-93.jpg',  alt: 'Seminar deelnemers' },
  { src: BASE + 'eventshoot-94.jpg',  alt: 'Netwerkborrel fotografie' },
  { src: BASE + 'eventshoot-95.jpg',  alt: 'Ledendag fotografie' },
  { src: BASE + 'eventshoot-96.jpg',  alt: 'Jaarcongres fotografie' },
  { src: BASE + 'eventshoot-97.jpg',  alt: 'Congres reportage' },
  { src: BASE + 'eventshoot-98.jpg',  alt: 'Event fotograaf Nederland' },
  { src: BASE + 'eventshoot-99.jpg',  alt: 'Zakelijke bijeenkomst' },
  { src: BASE + 'eventshoot-100.jpg', alt: 'Congres fotografie' },
  { src: BASE + 'eventshoot-101.jpg', alt: 'Eventfotografie Holland' },
  { src: BASE + 'eventshoot-102.jpg', alt: 'Corporate event' },
  { src: BASE + 'eventshoot-103.jpg', alt: 'Seminar fotograaf' },
  { src: BASE + 'eventshoot-104.jpg', alt: 'Productlancering event' },
  { src: BASE + 'eventshoot-105.jpg', alt: 'Ledendag congres' },
  { src: BASE + 'eventshoot-106.jpg', alt: 'Zakelijk evenement' },
  { src: BASE + 'eventshoot-107.jpg', alt: 'Event reportage' },
  { src: BASE + 'eventshoot_121.jpg', alt: 'Congres fotografie Nederland' },
  { src: BASE + 'zakelijke-event-fotografie-8.jpg', alt: 'Zakelijke event fotografie' },
]

const PHOTOS_PER_PAGE = 29
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(allPhotos.length / PHOTOS_PER_PAGE))
const photos = computed(() => {
  const start = (currentPage.value - 1) * PHOTOS_PER_PAGE
  return allPhotos.slice(start, start + PHOTOS_PER_PAGE)
})

function goToPage(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const lightboxIndex = ref<number | null>(null)
const shareMenuOpen = ref(false)

const currentPhoto = computed(() =>
  lightboxIndex.value !== null ? photos.value[lightboxIndex.value] : null
)

function openLightbox(index: number) {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
  shareMenuOpen.value = false
}

function prevPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + photos.value.length) % photos.value.length
}

function nextPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % photos.value.length
}

function onKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'Escape') closeLightbox()
}

function toggleShareMenu() {
  shareMenuOpen.value = !shareMenuOpen.value
}

function shareOn(platform: 'linkedin' | 'facebook' | 'instagram') {
  const url = encodeURIComponent(window.location.origin + currentPhoto.value!.src)
  if (platform === 'linkedin') {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
  } else if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  } else if (platform === 'instagram') {
    const a = document.createElement('a')
    a.href = currentPhoto.value!.src
    a.download = currentPhoto.value!.src.split('/').pop()!
    a.click()
  }
  shareMenuOpen.value = false
}

watch(shareMenuOpen, (open) => {
  if (open) {
    document.addEventListener('click', () => { shareMenuOpen.value = false }, { once: true })
  }
})
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="werk-hero">
      <div class="werk-hero__bg">
        <OptimizedImage
          src="/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-57.jpg"
          alt="Eventfotografie Eventshoot.nl"
          preset="hero"
          :priority="true"
        />
        <div class="werk-hero__overlay"></div>
      </div>
      <div class="container werk-hero__content">
        <h1>{{ t('werk.h1') }}</h1>
        <p>{{ t('werk.sub') }}</p>
      </div>
    </section>

    <section class="werk section">
      <div class="container">
        <div class="werk__grid">
          <div
            v-for="(photo, i) in photos"
            :key="photo.src"
            class="werk__item"
            @click="openLightbox(i)"
          >
            <OptimizedImage :src="photo.src" :alt="photo.alt" preset="thumb" />
            <div class="werk__hover">
              <span>🔍</span>
            </div>
          </div>
        </div>

        <!-- Paginering -->
        <div class="werk__pagination">
          <button
            v-for="page in totalPages"
            :key="page"
            class="werk__page-btn"
            :class="{ 'werk__page-btn--active': currentPage === page }"
            @click="goToPage(page)"
          >{{ page }}</button>
        </div>

      </div>
    </section>

    <UspGrid />

    <!-- Vertrouwd door organisaties -->
    <section class="trust">
      <p class="trust__label">{{ t('werk.trust') }}</p>
      <div class="trust__track-wrap">
        <div class="trust__track">
          <div class="trust__slide" v-for="n in 2" :key="n">
            <img v-for="logo in logos" :key="logo.file + n" :src="`/DATA_EVENTSHOOT/SITE_IMAGES/OPDRACHTGEVERS/${logo.file}`" :alt="logo.name" class="trust__logo" />
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxIndex !== null" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox__close" @click="closeLightbox">✕</button>
        <button class="lightbox__prev" @click="prevPhoto">&#8249;</button>
        <div class="lightbox__img-wrap">
          <img :src="currentPhoto!.src" :alt="currentPhoto!.alt" />
        </div>
        <button class="lightbox__next" @click="nextPhoto">&#8250;</button>
        <div class="lightbox__toolbar">
          <span class="lightbox__counter">{{ lightboxIndex! + 1 }} / {{ photos.length }}</span>
          <div class="lightbox__actions">
            <a
              :href="currentPhoto!.src"
              :download="currentPhoto!.src.split('/').pop()"
              class="lightbox__icon-btn"
              title="Download"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </a>
            <div class="share-wrap" @click.stop>
              <button class="lightbox__icon-btn" title="Delen" @click="toggleShareMenu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
              </button>
              <div v-if="shareMenuOpen" class="share-menu">
                <button class="share-menu__item" @click="shareOn('linkedin')">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" class="share-icon share-icon--linkedin">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
                <button class="share-menu__item" @click="shareOn('facebook')">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" class="share-icon share-icon--facebook">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button class="share-menu__item" @click="shareOn('instagram')" title="Download om te delen op Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" class="share-icon share-icon--instagram">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                  Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.werk-hero {
  position: relative;
  aspect-ratio: 16/9;
  min-height: 420px;
  display: flex;
  align-items: center;
}

.werk-hero__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.werk-hero__bg :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.werk-hero__bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.werk-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 100%);
}

.werk-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 680px;
}

.werk-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.15;
}

.werk-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  line-height: 1.75;
}

.werk {
  padding-top: 3rem;
}

.werk__grid {
  columns: 3;
  column-gap: 0.75rem;
}

.werk__item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  cursor: pointer;
  break-inside: avoid;
  margin-bottom: 0.75rem;
}

.werk__item img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.werk__item:hover img {
  transform: scale(1.04);
}

.werk__hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 1.5rem;
  pointer-events: none;
}

.werk__item:hover .werk__hover {
  opacity: 1;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.93);
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
  border-radius: var(--radius);
}

.lightbox__close {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  background: rgba(255,255,255,0.1);
  border: none; color: #fff;
  font-size: 1.25rem;
  width: 40px; height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background var(--transition);
}
.lightbox__close:hover { background: rgba(255,255,255,0.2); }

.lightbox__prev,
.lightbox__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  border: none; color: #fff;
  font-size: 2rem;
  width: 50px; height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background var(--transition);
}
.lightbox__prev { left: 1.5rem; }
.lightbox__next { right: 1.5rem; }
.lightbox__prev:hover,
.lightbox__next:hover { background: rgba(255,255,255,0.2); }

.lightbox__toolbar {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  border-radius: 50px;
  padding: 0.6rem 1.25rem;
}

.lightbox__counter {
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  white-space: nowrap;
}

.lightbox__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lightbox__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  text-decoration: none;
  transition: background var(--transition), border-color var(--transition);
  flex-shrink: 0;
}
.lightbox__icon-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.share-wrap {
  position: relative;
}

.share-menu {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  background: #1a1a2e;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  overflow: hidden;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.share-menu__item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.65rem 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
  white-space: nowrap;
}
.share-menu__item:hover {
  background: rgba(255,255,255,0.08);
}

.share-icon--linkedin { color: #0A66C2; }
.share-icon--facebook { color: #1877F2; }
.share-icon--instagram { color: #E1306C; }

.werk__pagination {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 3rem;
}

.werk__page-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  background: none;
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.werk__page-btn:hover {
  border-color: var(--color-accent);
  color: #fff;
}

.werk__page-btn--active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

@media (max-width: 768px) {
  .werk__grid { columns: 2; }
  .lightbox__prev { left: 0.5rem; }
  .lightbox__next { right: 0.5rem; }
}

@media (max-width: 480px) {
  .werk__grid { columns: 1; }
}

.trust {
  padding: 5rem 0;
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
</style>
