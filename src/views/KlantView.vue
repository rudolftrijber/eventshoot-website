<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()

interface KlantData {
  slug: string
  title: string
  subtitle: string
  heroImage: string
  videos: string[]
  photos: string[]
}

const klant = ref<KlantData | null>(null)
const notFound = ref(false)
const lightboxIndex = ref<number | null>(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/klanten/${route.params.slug}`)
    if (!res.ok) throw new Error('not found')
    const data = await res.json()
    klant.value = data
    useSeo({
      title: `${data.title} | Eventshoot.nl`,
      description: data.subtitle,
    })
  } catch {
    notFound.value = true
  }
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const currentPhoto = computed(() =>
  lightboxIndex.value !== null && klant.value ? klant.value.photos[lightboxIndex.value] : null
)

function openLightbox(i: number) {
  lightboxIndex.value = i
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

function prevPhoto() {
  if (lightboxIndex.value === null || !klant.value) return
  lightboxIndex.value = (lightboxIndex.value - 1 + klant.value.photos.length) % klant.value.photos.length
}

function nextPhoto() {
  if (lightboxIndex.value === null || !klant.value) return
  lightboxIndex.value = (lightboxIndex.value + 1) % klant.value.photos.length
}

function onKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'Escape') closeLightbox()
}

function vimeoId(url: string) {
  const match = url.match(/vimeo\.com\/(\d+)(?:\/([a-f0-9]+))?/)
  if (!match) return null
  return { id: match[1], hash: match[2] }
}

function vimeoSrc(url: string) {
  const v = vimeoId(url)
  if (!v) return ''
  return `https://player.vimeo.com/video/${v.id}${v.hash ? '?h=' + v.hash : ''}?title=0&byline=0&portrait=0`
}

async function downloadPhoto(url: string) {
  const filename = url.split('/').pop() || 'foto.jpg'
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.target = '_blank'
  a.click()
}
</script>

<template>
  <main>
    <!-- Not found -->
    <div v-if="notFound" class="klant-notfound">
      <h1>Pagina niet gevonden</h1>
      <p>Deze leveringspagina bestaat niet of is verlopen.</p>
    </div>

    <template v-else-if="klant">
      <!-- Hero -->
      <section class="klant-hero">
        <div class="klant-hero__bg">
          <img :src="klant.heroImage" :alt="klant.title" />
          <div class="klant-hero__overlay"></div>
        </div>
        <div class="container klant-hero__content">
          <p class="klant-hero__eyebrow">Exclusief voor jou</p>
          <h1 class="klant-hero__title">{{ klant.title }}</h1>
          <p class="klant-hero__subtitle">{{ klant.subtitle }}</p>
        </div>
      </section>

      <!-- Video's -->
      <section v-if="klant.videos.length" class="klant-videos section">
        <div class="container">
          <h2 class="klant-section-title">Jouw video('s)</h2>
          <div class="klant-videos__grid" :class="{ 'klant-videos__grid--single': klant.videos.length === 1 }">
            <div v-for="(video, i) in klant.videos" :key="i" class="klant-video-wrap">
              <iframe
                :src="vimeoSrc(video)"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <!-- Foto's -->
      <section class="klant-photos section">
        <div class="container">
          <div class="klant-photos__header">
            <h2 class="klant-section-title">Jouw foto's ({{ klant.photos.length }})</h2>
            <p class="klant-photos__hint">Klik op een foto om te vergroten of te downloaden.</p>
          </div>
          <div class="klant-photos__grid">
            <div
              v-for="(photo, i) in klant.photos"
              :key="i"
              class="klant-photo-item"
              @click="openLightbox(i)"
            >
              <img :src="photo" :alt="`Foto ${i + 1}`" loading="lazy" />
              <div class="klant-photo-item__hover">🔍</div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxIndex !== null && klant" class="klant-lightbox" @click.self="closeLightbox">
        <button class="klant-lightbox__close" @click="closeLightbox">✕</button>
        <button class="klant-lightbox__prev" @click="prevPhoto">&#8249;</button>
        <div class="klant-lightbox__img-wrap">
          <img :src="currentPhoto!" :alt="`Foto ${lightboxIndex! + 1}`" />
        </div>
        <button class="klant-lightbox__next" @click="nextPhoto">&#8250;</button>
        <div class="klant-lightbox__toolbar">
          <span class="klant-lightbox__counter">{{ lightboxIndex! + 1 }} / {{ klant.photos.length }}</span>
          <button class="klant-lightbox__action-btn" @click="downloadPhoto(currentPhoto!)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download
          </button>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
/* Hero */
.klant-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.klant-hero__bg {
  position: absolute;
  inset: 0;
}

.klant-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.klant-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.30) 100%);
}

.klant-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 700px;
}

.klant-hero__eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
}

.klant-hero__title {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1rem;
}

.klant-hero__subtitle {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  line-height: 1.75;
}

/* Section title */
.klant-section-title {
  font-size: clamp(1.3rem, 2.5vw, 1.75rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
}

/* Video's */
.klant-videos__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.klant-videos__grid--single {
  grid-template-columns: 1fr;
  max-width: 800px;
}

.klant-video-wrap {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
}

.klant-video-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Foto's */
.klant-photos__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.klant-photos__hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.klant-photos__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.klant-photo-item {
  position: relative;
  cursor: pointer;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 8px;
}

.klant-photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.klant-photo-item:hover img {
  transform: scale(1.05);
}

.klant-photo-item__hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.klant-photo-item:hover .klant-photo-item__hover {
  opacity: 1;
}

/* Not found */
.klant-notfound {
  padding: 12rem 2rem 6rem;
  text-align: center;
}

/* Lightbox */
.klant-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.klant-lightbox__img-wrap {
  max-width: 90vw;
  max-height: 80vh;
}

.klant-lightbox__img-wrap img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.klant-lightbox__close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  font-size: 1.25rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.klant-lightbox__prev,
.klant-lightbox__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
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
  transition: background var(--transition);
}

.klant-lightbox__prev { left: 1.5rem; }
.klant-lightbox__next { right: 1.5rem; }

.klant-lightbox__prev:hover,
.klant-lightbox__next:hover { background: rgba(255,255,255,0.2); }

.klant-lightbox__toolbar {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
  border-radius: 50px;
  padding: 0.6rem 1.25rem;
}

.klant-lightbox__counter {
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
}

.klant-lightbox__action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  font-size: 0.8rem;
  padding: 0.35rem 0.85rem;
  border-radius: 50px;
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition);
}

.klant-lightbox__action-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

@media (max-width: 768px) {
  .klant-photos__grid { grid-template-columns: repeat(2, 1fr); }
  .klant-videos__grid { grid-template-columns: 1fr; }
}
</style>
