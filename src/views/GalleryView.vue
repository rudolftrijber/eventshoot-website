<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Persoonlijk portfolio | Rolf Trijber',
    description: 'Fotografie buiten het eventcircuit. Portretten, reisfotografie, beauty en meer van Rolf Trijber.',
    url: 'https://eventshoot.nl/gallery',
  })
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const photos = [
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/181212-BLACK_4215.jpg', alt: 'Persoonlijke fotografie Rolf Trijber' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/1Ljpg.jpg', alt: 'Fotografie Rolf Trijber' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/A7R00427-bewerkt.jpg', alt: 'Portretfotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/A7R00738.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/Amsterdam_2014_DSC00123.jpg', alt: 'Amsterdam fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/DSC01215.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/DSC02870.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/DSC05917-bewerkt.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/DSC09259.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/HD_A7R3391-bewerkt.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/KPN-2.jpg', alt: 'KPN fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/Muur_new-52.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/Muur_new-58.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/Wolfert_Schoolfoto.jpg', alt: 'Schoolfoto' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/_A7R2929-bewerkt.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/_A7R5694 kopie.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/_A7R6864 kopie.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/_DSC5757-bewerkt-bewerkt-2.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/_DSC8587-bewerkt_pp_2-bewerkt.jpg', alt: 'Fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/ami.jpg', alt: 'Portretfotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/amy-61.jpg', alt: 'Portretfotografie Amy' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/beauty_fashion_fotografie-11.jpg', alt: 'Beauty en fashion fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/beauty_fashion_fotografie-15.jpg', alt: 'Beauty en fashion fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/beauty_fashion_fotografie-8.jpg', alt: 'Beauty en fashion fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/bibian_mentel-2.jpg', alt: 'Bibian Mentel' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/carl_frederique-54.jpg', alt: 'Portretfotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/cockpit-51.jpg', alt: 'Cockpit fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/fotograaf-rolf-trijber-31.jpg', alt: 'Fotografie Rolf Trijber' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/fotograaf-rolf-trijber-32.jpg', alt: 'Fotografie Rolf Trijber' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/fotograaf-rolf-trijber-4.jpg', alt: 'Fotografie Rolf Trijber' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/fotostduio-rolf-glamour--3.jpg', alt: 'Glamour fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/ibiza_2-56.jpg', alt: 'Ibiza fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/kimberky-51.jpg', alt: 'Portretfotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/kindportret_DSC04696.jpg', alt: 'Kindportret' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/kindportret_DSC04795.jpg', alt: 'Kindportret' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/kindportret_DSC04837.jpg', alt: 'Kindportret' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/loyd_jazz-58.jpg', alt: 'Jazz fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/parijs-51.jpg', alt: 'Parijs fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-1.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-2.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-3.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-4.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-5.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-6.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-7.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-8.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-9.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-10.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/party-festival-fotografie-13.jpg', alt: 'Party en festival fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/portret_fotografie_-6.jpg', alt: 'Portretfotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/rolf_trijber_11_9_24-50.jpg', alt: 'Fotografie Rolf Trijber' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/rolf_trijber_29_08_2024-50.jpg', alt: 'Fotografie Rolf Trijber' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/venice-51.jpg', alt: 'Venetië fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/vrij]-51.jpg', alt: 'Vrijwerk fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/vrijwerk-51.jpg', alt: 'Vrijwerk fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/wijdemeren-51.jpg', alt: 'Wijdemeren fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/wijdemeren-52.jpg', alt: 'Wijdemeren fotografie' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/zakelijke_portretfoto-1.jpg', alt: 'Zakelijke portretfoto' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/zakelijke_portretfoto-2.jpg', alt: 'Zakelijke portretfoto' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/zakelijke_portretfoto-4.jpg', alt: 'Zakelijke portretfoto' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/zakelijke_portretfoto-5.jpg', alt: 'Zakelijke portretfoto' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/zakelijke_portretfoto-6.jpg', alt: 'Zakelijke portretfoto' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/zakelijke_portretfoto-13.jpg', alt: 'Zakelijke portretfoto' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/zakelijke_portretfoto-21.jpg', alt: 'Zakelijke portretfoto' },
  { src: '/DATA_EVENTSHOOT/SITE_IMAGES/PORTFOLIO/CELEST_DEX.jpg', alt: 'Fotografie' },
]

const lightboxIndex = ref<number | null>(null)

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
</script>

<template>
  <main>
    <section class="gallery section">
      <div class="container">
        <div class="gallery__header">
          <h1>Persoonlijk portfolio.</h1>
          <p>Fotografie buiten het eventcircuit. Portretten, reisfotografie, beauty, jazz en meer.</p>
        </div>
        <div class="gallery__grid">
          <div
            v-for="(photo, i) in photos"
            :key="photo.src"
            class="gallery__item"
            @click="openLightbox(i)"
          >
            <img :src="photo.src" :alt="photo.alt" loading="lazy" />
            <div class="gallery__hover">
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
        <div class="lightbox__toolbar">
          <span class="lightbox__counter">{{ lightboxIndex! + 1 }} / {{ photos.length }}</span>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.gallery {
  padding-top: 8rem;
}

.gallery__header {
  margin-bottom: 3rem;
}

.gallery__header h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.gallery__header p {
  font-size: 1rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.7;
}

.gallery__grid {
  columns: 3;
  column-gap: 0.75rem;
}

.gallery__item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  cursor: pointer;
  break-inside: avoid;
  margin-bottom: 0.75rem;
}

.gallery__item img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.gallery__item:hover img {
  transform: scale(1.04);
}

.gallery__hover {
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

.gallery__item:hover .gallery__hover {
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

@media (max-width: 768px) {
  .gallery__grid { columns: 2; }
  .lightbox__prev { left: 0.5rem; }
  .lightbox__next { right: 0.5rem; }
}

@media (max-width: 480px) {
  .gallery__grid { columns: 1; }
}
</style>
