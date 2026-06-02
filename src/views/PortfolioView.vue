<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import SectionHeading from '@/components/SectionHeading.vue'
import OptimizedImage from '@/components/OptimizedImage.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Portfolio eventfotografie | Eventshoot.nl',
    description: 'Bekijk een selectie van professionele eventfoto\'s van congressen, seminars en zakelijke bijeenkomsten door heel Nederland.',
    url: 'https://eventshoot.nl/portfolio',
  })
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const photos = [
  { src: '/eventshoot-50.jpg',  alt: 'Eventfotografie congres Nederland' },
  { src: '/eventshoot-52.jpg',  alt: 'Zakelijk evenement fotografie' },
  { src: '/eventshoot-53.jpg',  alt: 'Seminar fotograaf' },
  { src: '/eventshoot-54.jpg',  alt: 'Congres fotografie' },
  { src: '/eventshoot-56.jpg',  alt: 'Professionele eventfotografie' },
  { src: '/eventshoot-57.jpg',  alt: 'Evenement fotograaf' },
  { src: '/eventshoot-58.jpg',  alt: 'Zakelijk congres fotografie' },
  { src: '/eventshoot-59.jpg',  alt: 'Netwerkbijeenkomst fotografie' },
  { src: '/eventshoot-62.jpg',  alt: 'Award uitreiking fotografie' },
  { src: '/eventshoot-70.jpg',  alt: 'Bedrijfsevenement fotografie' },
  { src: '/eventshoot-75.jpg',  alt: 'Beurs fotografie Nederland' },
  { src: '/eventshoot-77.jpg',  alt: 'Productlancering fotografie' },
  { src: '/eventshoot-78.jpg',  alt: 'Congres spreker fotografie' },
  { src: '/eventshoot-79.jpg',  alt: 'Zakelijk event reportage' },
  { src: '/eventshoot-81.jpg',  alt: 'Seminar fotoreportage' },
  { src: '/eventshoot-82.jpg',  alt: 'Congres deelnemers fotografie' },
  { src: '/eventshoot-83.jpg',  alt: 'Eventfotografie briefing' },
  { src: '/eventshoot-84.jpg',  alt: 'Corporate event fotografie' },
  { src: '/eventshoot-85.jpg',  alt: 'Zakelijk seminar fotografie' },
  { src: '/eventshoot-88.jpg',  alt: 'Congres fotografie Nederland' },
  { src: '/eventshoot-89.jpg',  alt: 'Evenement reportage fotografie' },
  { src: '/eventshoot-92.jpg',  alt: 'Award uitreiking fotograaf' },
  { src: '/eventshoot-94.jpg',  alt: 'Bijeenkomst fotografie' },
  { src: '/eventshoot-95.jpg',  alt: 'Zakelijk evenement Nederland' },
  { src: '/eventshoot-96.jpg',  alt: 'Congres en seminar fotografie' },
  { src: '/eventshoot-98.jpg',  alt: 'Professionele event fotograaf' },
  { src: '/eventshoot-101.jpg', alt: 'Corporate fotografie evenement' },
  { src: '/eventshoot-102.jpg', alt: 'Zakelijke bijeenkomst fotografie' },
  { src: '/eventshoot-104.jpg', alt: 'Event fotoreportage Nederland' },
  { src: '/eventshoot-105.jpg', alt: 'Congres fotografie reportage' },
]

const lightboxIndex = ref<number | null>(null)
const shareCopied = ref(false)

const currentPhoto = computed(() =>
  lightboxIndex.value !== null ? photos[lightboxIndex.value] : null
)

const shareUrl = computed(() => window.location.origin + '/portfolio')
const shareText = 'Bekijk deze professionele eventfoto\'s van Eventshoot.nl'

function shareLinkedIn() {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`, '_blank')
}

function shareFacebook() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`, '_blank')
}

function shareX() {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareText)}`, '_blank')
}

function shareWhatsApp() {
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl.value)}`, '_blank')
}

async function copyLink() {
  await navigator.clipboard.writeText(window.location.origin + currentPhoto.value!.src)
  shareCopied.value = true
  setTimeout(() => { shareCopied.value = false }, 2500)
}

function openLightbox(index: number) {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
  shareCopied.value = false
}

function prevPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + photos.length) % photos.length
}

function nextPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % photos.length
}

function onKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'Escape') closeLightbox()
}

async function sharePhoto() {
  if (!currentPhoto.value) return
  const url = window.location.origin + currentPhoto.value.src
  if (navigator.share) {
    await navigator.share({ title: currentPhoto.value.alt, url })
  } else {
    await navigator.clipboard.writeText(url)
    shareCopied.value = true
    setTimeout(() => { shareCopied.value = false }, 2500)
  }
}
</script>

<template>
  <main>
    <section class="portfolio section">
      <div class="container">
        <SectionHeading
          title="Zien hoe we werken? Hier is het bewijs."
          subtitle="Elk event is anders, de kwaliteit is altijd hetzelfde."
        />
        <div class="portfolio__grid">
          <div
            v-for="(photo, i) in photos"
            :key="photo.src"
            class="portfolio__item"
            @click="openLightbox(i)"
          >
            <OptimizedImage :src="photo.src" :alt="photo.alt" preset="thumb" />
            <div class="portfolio__hover">
              <span>🔍</span>
            </div>
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

        <!-- Toolbar: counter + acties -->
        <div class="lightbox__toolbar">
          <span class="lightbox__counter">{{ lightboxIndex! + 1 }} / {{ photos.length }}</span>
          <div class="lightbox__actions">
            <a :href="currentPhoto!.src" :download="currentPhoto!.src.split('/').pop()" class="lightbox__action-btn" title="Download">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download
            </a>
            <button class="lightbox__action-btn" @click="shareLinkedIn" title="Delen op LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </button>
            <button class="lightbox__action-btn" @click="shareFacebook" title="Delen op Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
            <button class="lightbox__action-btn" @click="shareX" title="Delen op X">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </button>
            <button class="lightbox__action-btn" @click="shareWhatsApp" title="Delen via WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </button>
            <button class="lightbox__action-btn" @click="copyLink" title="Kopieer link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              {{ shareCopied ? 'Gekopieerd!' : 'Link' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.portfolio {
  padding-top: 8rem;
}

.portfolio__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.portfolio__item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  cursor: pointer;
  aspect-ratio: 4/3;
}

.portfolio__item :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.portfolio__item :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.portfolio__item:hover :deep(img) {
  transform: scale(1.04);
}

.portfolio__hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 1.5rem;
}

.portfolio__item:hover .portfolio__hover {
  opacity: 1;
}

/* Lightbox */
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
  transition: background var(--transition);
}

.lightbox__close:hover { background: rgba(255,255,255,0.2); }

.lightbox__prev,
.lightbox__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: background var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__prev { left: 1.5rem; }
.lightbox__next { right: 1.5rem; }

.lightbox__prev:hover,
.lightbox__next:hover { background: rgba(255,255,255,0.2); }

/* Toolbar onderaan */
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
  gap: 0.75rem;
}

.lightbox__action-btn {
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
  text-decoration: none;
  transition: background var(--transition), border-color var(--transition);
  white-space: nowrap;
}

.lightbox__action-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

@media (max-width: 768px) {
  .portfolio__grid { grid-template-columns: repeat(2, 1fr); }
  .lightbox__prev { left: 0.5rem; }
  .lightbox__next { right: 0.5rem; }
}

@media (max-width: 480px) {
  .portfolio__grid { grid-template-columns: 1fr; }
}
</style>
