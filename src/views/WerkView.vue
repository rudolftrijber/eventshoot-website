<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import SectionHeading from '@/components/SectionHeading.vue'
import UspGrid from '@/components/UspGrid.vue'
import { useSeo } from '@/composables/useSeo'

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

async function copyLink() {
  await navigator.clipboard.writeText(window.location.origin + currentPhoto.value!.src)
  shareCopied.value = true
  setTimeout(() => { shareCopied.value = false }, 2500)
}
</script>

<template>
  <main>
    <section class="werk section">
      <div class="container">
        <SectionHeading
          title="Werk dat voor zichzelf spreekt."
          subtitle="Een selectie uit congressen, jaarcongressen, ledendagen en bedrijfsbijeenkomsten."
        />
        <div class="werk__grid">
          <div
            v-for="(photo, i) in photos"
            :key="photo.src"
            class="werk__item"
            @click="openLightbox(i)"
          >
            <img :src="photo.src" :alt="photo.alt" loading="lazy" />
            <div class="werk__hover">
              <span>🔍</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <UspGrid />

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
            <a :href="currentPhoto!.src" :download="currentPhoto!.src.split('/').pop()" class="lightbox__action-btn" title="Download">
              Download
            </a>
            <button class="lightbox__action-btn" @click="copyLink" title="Kopieer link">
              {{ shareCopied ? 'Gekopieerd!' : 'Link kopiëren' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.werk {
  padding-top: 8rem;
}

.werk__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.werk__item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  cursor: pointer;
  aspect-ratio: 4/3;
}

.werk__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  .werk__grid { grid-template-columns: repeat(2, 1fr); }
  .lightbox__prev { left: 0.5rem; }
  .lightbox__next { right: 0.5rem; }
}

@media (max-width: 480px) {
  .werk__grid { grid-template-columns: 1fr; }
}
</style>
