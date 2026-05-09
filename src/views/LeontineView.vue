<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSeo } from '@/composables/useSeo'

onMounted(async () => {
  useSeo({
    title: 'Leontine — Jouw foto\'s | Eventshoot.nl',
    description: 'Jouw professionele eventfoto\'s van Eventshoot.nl.',
  })
  const res = await fetch('/def/Leontine/manifest.json')
  const data = await res.json()
  photos.value = data.photos
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const photos = ref<string[]>([])
const lightboxIndex = ref<number | null>(null)
const currentPhoto = computed(() => lightboxIndex.value !== null ? photos.value[lightboxIndex.value] : null)

function openLightbox(i: number) { lightboxIndex.value = i; document.body.style.overflow = 'hidden' }
function closeLightbox() { lightboxIndex.value = null; document.body.style.overflow = '' }
function prevPhoto() { if (lightboxIndex.value === null) return; lightboxIndex.value = (lightboxIndex.value - 1 + photos.value.length) % photos.value.length }
function nextPhoto() { if (lightboxIndex.value === null) return; lightboxIndex.value = (lightboxIndex.value + 1) % photos.value.length }
function onKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'Escape') closeLightbox()
}
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero__overlay"></div>
      <div class="container hero__content">
        <p class="hero__eyebrow">Exclusief voor jou</p>
        <h1>Leontine — Jouw event in beeld</h1>
        <p class="hero__sub">Hier zijn jouw foto's, klaar om te downloaden en te gebruiken. Veel plezier ermee!</p>
        <p class="hero__count" v-if="photos.length">{{ photos.length }} foto's beschikbaar</p>
      </div>
    </section>

    <!-- Grid -->
    <section class="grid-section section">
      <div class="container">
        <div class="photo-grid" v-if="photos.length">
          <div v-for="(photo, i) in photos" :key="photo" class="photo-item" @click="openLightbox(i)">
            <img :src="photo" :alt="`Foto ${i + 1}`" loading="lazy" />
            <div class="photo-item__hover">🔍</div>
          </div>
        </div>
        <p v-else class="loading">Foto's laden…</p>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxIndex !== null" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox__close" @click="closeLightbox">✕</button>
        <button class="lightbox__prev" @click="prevPhoto">&#8249;</button>
        <div class="lightbox__img-wrap">
          <img :src="currentPhoto!" :alt="`Foto ${lightboxIndex! + 1}`" />
        </div>
        <button class="lightbox__next" @click="nextPhoto">&#8250;</button>
        <div class="lightbox__toolbar">
          <span class="lightbox__counter">{{ lightboxIndex! + 1 }} / {{ photos.length }}</span>
          <a :href="currentPhoto!" :download="currentPhoto!.split('/').pop()" class="lightbox__btn">
            ↓ Download
          </a>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.3);
}
.hero__overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%); }
.hero__content { position: relative; z-index: 1; padding-top: 8rem; padding-bottom: 4rem; max-width: 700px; }
.hero__eyebrow { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.75rem; }
.hero__content h1 { font-size: clamp(1.75rem, 3.5vw, 3rem); font-weight: 800; margin-bottom: 1rem; line-height: 1.15; }
.hero__sub { font-size: 1rem; color: rgba(255,255,255,0.82); line-height: 1.75; margin-bottom: 0.75rem; }
.hero__count { font-size: 0.85rem; color: var(--color-accent); font-weight: 600; }

.photo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
.photo-item { position: relative; cursor: pointer; aspect-ratio: 4/3; overflow: hidden; border-radius: 8px; }
.photo-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
.photo-item:hover img { transform: scale(1.05); }
.photo-item__hover { position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; opacity: 0; transition: opacity 0.2s; }
.photo-item:hover .photo-item__hover { opacity: 1; }
.loading { color: var(--color-text-muted); text-align: center; padding: 4rem 0; }

.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.lightbox__img-wrap { max-width: 90vw; max-height: 80vh; }
.lightbox__img-wrap img { max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px; }
.lightbox__close { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 1.25rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; }
.lightbox__prev, .lightbox__next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 2.5rem; width: 52px; height: 52px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--transition); }
.lightbox__prev { left: 1.5rem; } .lightbox__next { right: 1.5rem; }
.lightbox__prev:hover, .lightbox__next:hover { background: rgba(255,255,255,0.2); }
.lightbox__toolbar { position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 1.25rem; background: rgba(0,0,0,0.55); backdrop-filter: blur(8px); border-radius: 50px; padding: 0.6rem 1.25rem; }
.lightbox__counter { color: rgba(255,255,255,0.6); font-size: 0.85rem; }
.lightbox__btn { display: inline-flex; align-items: center; gap: 0.4rem; background: none; border: 1px solid rgba(255,255,255,0.25); color: #fff; font-size: 0.8rem; padding: 0.35rem 0.85rem; border-radius: 50px; cursor: pointer; text-decoration: none; transition: background var(--transition); }
.lightbox__btn:hover { background: var(--color-accent); border-color: var(--color-accent); }

@media (max-width: 768px) { .photo-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
