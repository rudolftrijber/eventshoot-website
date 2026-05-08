<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionHeading from '@/components/SectionHeading.vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Portfolio eventfotografie | Eventshoot.nl',
    description: 'Bekijk een selectie van professionele eventfoto\'s van congressen, seminars en zakelijke bijeenkomsten door heel Nederland.',
    url: 'https://eventshoot.nl/portfolio',
  })
})

const BASE = 'https://eventshoot.nl/wp-content/uploads/2026/03/'

const photos = [
  { file: 'eventshoot-50-1-scaled.jpg', alt: 'Eventfotografie congres Nederland' },
  { file: 'eventshoot-52-1.jpg', alt: 'Zakelijk evenement fotografie' },
  { file: 'eventshoot-53-1.jpg', alt: 'Seminar fotograaf' },
  { file: 'eventshoot-54-1-scaled.jpg', alt: 'Congres fotografie' },
  { file: 'eventshoot-56-1.jpg', alt: 'Professionele eventfotografie' },
  { file: 'eventshoot-57-1-scaled.jpg', alt: 'Evenement fotograaf' },
  { file: 'eventshoot-58-1-scaled.jpg', alt: 'Zakelijk congres fotografie' },
  { file: 'eventshoot-59-1-scaled.jpg', alt: 'Netwerkbijeenkomst fotografie' },
  { file: 'eventshoot-62-1-scaled.jpg', alt: 'Award uitreiking fotografie' },
  { file: 'eventshoot-70-1-scaled.jpg', alt: 'Bedrijfsevenement fotografie' },
  { file: 'eventshoot-75-1.jpg', alt: 'Beurs fotografie Nederland' },
  { file: 'eventshoot-77-1-scaled.jpg', alt: 'Productlancering fotografie' },
  { file: 'eventshoot-78-1-scaled.jpg', alt: 'Congres spreker fotografie' },
  { file: 'eventshoot-79-1-scaled.jpg', alt: 'Zakelijk event reportage' },
  { file: 'eventshoot-81-1-scaled.jpg', alt: 'Seminar fotoreportage' },
  { file: 'eventshoot-82-1-scaled.jpg', alt: 'Congres deelnemers fotografie' },
  { file: 'eventshoot-83-1-scaled.jpg', alt: 'Eventfotografie briefing' },
  { file: 'eventshoot-84-1-scaled.jpg', alt: 'Corporate event fotografie' },
  { file: 'eventshoot-85-1-scaled.jpg', alt: 'Zakelijk seminar fotografie' },
  { file: 'eventshoot-88-1-scaled.jpg', alt: 'Congres fotografie Nederland' },
  { file: 'eventshoot-89-1-scaled.jpg', alt: 'Evenement reportage fotografie' },
  { file: 'eventshoot-92-1-scaled.jpg', alt: 'Award uitreiking fotograaf' },
  { file: 'eventshoot-94-1-scaled.jpg', alt: 'Bijeenkomst fotografie' },
  { file: 'eventshoot-95-1.jpg', alt: 'Zakelijk evenement Nederland' },
  { file: 'eventshoot-96-1.jpg', alt: 'Congres en seminar fotografie' },
  { file: 'eventshoot-98-1.jpg', alt: 'Professionele event fotograaf' },
  { file: 'eventshoot-101-1.jpg', alt: 'Corporate fotografie evenement' },
  { file: 'eventshoot-102-1.jpg', alt: 'Zakelijke bijeenkomst fotografie' },
  { file: 'eventshoot-104-1.jpg', alt: 'Event fotoreportage Nederland' },
  { file: 'eventshoot-105-1.jpg', alt: 'Congres fotografie reportage' },
].map(p => ({ ...p, src: BASE + p.file }))

const lightboxIndex = ref<number | null>(null)

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

onMounted(() => document.addEventListener('keydown', onKeydown))
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
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
            :key="photo.file"
            class="portfolio__item"
            @click="openLightbox(i)"
          >
            <img :src="photo.src" :alt="photo.alt" loading="lazy" />
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
        <button class="lightbox__prev" @click="prevPhoto">‹</button>
        <div class="lightbox__img-wrap">
          <img :src="photos[lightboxIndex].src" :alt="photos[lightboxIndex].alt" />
        </div>
        <button class="lightbox__next" @click="nextPhoto">›</button>
        <p class="lightbox__counter">{{ lightboxIndex + 1 }} / {{ photos.length }}</p>
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

.portfolio__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.portfolio__item:hover img {
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
  max-height: 85vh;
}

.lightbox__img-wrap img {
  max-width: 100%;
  max-height: 85vh;
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

.lightbox__close:hover {
  background: rgba(255,255,255,0.2);
}

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
.lightbox__next:hover {
  background: rgba(255,255,255,0.2);
}

.lightbox__counter {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .portfolio__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .portfolio__grid {
    grid-template-columns: 1fr;
  }
}
</style>
