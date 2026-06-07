<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ClientPhotoLightbox from '@/components/ClientPhotoLightbox.vue'
import KlantVideoEmbed from '@/components/KlantVideoEmbed.vue'
import type { KlantVideo } from '@/lib/videoEmbed'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()

interface KlantPhoto {
  url: string
  thumbUrl: string
  filename: string
}

interface KlantData {
  slug: string
  title: string
  subtitle: string
  heroImage: string
  videos: KlantVideo[]
  photos: KlantPhoto[]
}

const klant = ref<KlantData | null>(null)
const notFound = ref(false)
const loading = ref(true)
const lightboxIndex = ref<number | null>(null)
const currentPage = ref(1)

const PHOTOS_PER_PAGE = 30

const totalPages = computed(() =>
  klant.value ? Math.ceil(klant.value.photos.length / PHOTOS_PER_PAGE) : 0,
)

const visiblePhotos = computed(() => {
  if (!klant.value) return []
  const start = (currentPage.value - 1) * PHOTOS_PER_PAGE
  return klant.value.photos.slice(start, start + PHOTOS_PER_PAGE)
})

const lightboxPhotos = computed(() =>
  visiblePhotos.value.map(p => ({ url: p.url, filename: p.filename })),
)

const heroCountText = computed(() => {
  if (!klant.value) return ''

  const photoCount = klant.value.photos.length
  const videoCount = klant.value.videos.length
  const parts: string[] = []

  if (photoCount) {
    parts.push(`${photoCount} foto${photoCount === 1 ? '' : "'s"}`)
  }
  if (videoCount) {
    parts.push(`${videoCount} video${videoCount === 1 ? '' : "'s"}`)
  }

  if (!parts.length) return ''
  return `${parts.join(' en ')} beschikbaar`
})

function absoluteUrl(path: string) {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `https://eventshoot.nl${path.startsWith('/') ? path : `/${path}`}`
}

function applyNoIndex() {
  let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (!robots) {
    robots = document.createElement('meta')
    robots.setAttribute('name', 'robots')
    document.head.appendChild(robots)
  }
  robots.setAttribute('content', 'noindex, nofollow')
}

async function loadPhotosFromManifest(folder: string): Promise<KlantPhoto[]> {
  const manifestRes = await fetch(`/def/${folder}/manifest.json`)
  if (!manifestRes.ok) return []

  const manifest = await manifestRes.json() as { photos: string[] }
  return manifest.photos.map((photoPath) => {
    const filename = photoPath.split('/').pop() || photoPath
    return { url: photoPath, thumbUrl: photoPath, filename }
  })
}

async function loadKlantFromStatic(slug: string): Promise<KlantData> {
  const configRes = await fetch(`/klanten/${slug}.json`)
  if (!configRes.ok) throw new Error('not found')

  const config = await configRes.json() as Omit<KlantData, 'photos' | 'heroImage'> & {
    localFolder?: string
    heroImage?: string
  }

  const photos = config.localFolder
    ? await loadPhotosFromManifest(config.localFolder)
    : []

  return {
    slug: config.slug,
    title: config.title,
    subtitle: config.subtitle,
    heroImage: config.heroImage || photos[0]?.url || '',
    videos: config.videos ?? [],
    photos,
  }
}

async function loadKlantData(slug: string): Promise<KlantData> {
  try {
    const apiRes = await fetch(`/api/klanten/${slug}`)
    const contentType = apiRes.headers.get('content-type') ?? ''
    if (apiRes.ok && contentType.includes('application/json')) {
      return await apiRes.json() as KlantData
    }
  } catch {
    /* API niet beschikbaar, val terug op statische bestanden */
  }

  return loadKlantFromStatic(slug)
}

onMounted(async () => {
  applyNoIndex()
  const slug = String(route.params.slug).toLowerCase()

  try {
    const data = await loadKlantData(slug)
    klant.value = data
    useSeo({
      title: `${data.title} | Eventshoot.nl`,
      description: data.subtitle,
      image: absoluteUrl(data.heroImage),
      url: `https://eventshoot.nl/klanten/${slug}`,
      locale: 'nl',
    })
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }

  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

function goToPage(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openLightbox(index: number) {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

function prevPhoto() {
  if (lightboxIndex.value === null || !klant.value) return
  lightboxIndex.value =
    (lightboxIndex.value - 1 + visiblePhotos.value.length) % visiblePhotos.value.length
}

function nextPhoto() {
  if (lightboxIndex.value === null || !klant.value) return
  lightboxIndex.value = (lightboxIndex.value + 1) % visiblePhotos.value.length
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
    <div v-if="loading" class="klant-state">
      <p>Leveringspagina laden…</p>
    </div>

    <div v-else-if="notFound" class="klant-state">
      <h1>Pagina niet gevonden</h1>
      <p>Deze leveringspagina bestaat niet of is verlopen.</p>
    </div>

    <template v-else-if="klant">
      <section class="klant-hero">
        <div class="klant-hero__bg">
          <img v-if="klant.heroImage" :src="klant.heroImage" :alt="klant.title" />
          <div class="klant-hero__overlay"></div>
        </div>
        <div class="container klant-hero__content">
          <p class="klant-hero__eyebrow">Exclusief voor jou</p>
          <h1 class="klant-hero__title">{{ klant.title }}</h1>
          <p class="klant-hero__subtitle">{{ klant.subtitle }}</p>
          <p v-if="heroCountText" class="klant-hero__count">{{ heroCountText }}</p>
        </div>
      </section>

      <section class="klant-photos section">
        <div class="container">
          <div class="klant-photos__grid">
            <div
              v-for="(photo, i) in visiblePhotos"
              :key="photo.filename + i"
              class="klant-photo-item"
              @click="openLightbox(i)"
            >
              <img :src="photo.thumbUrl" :alt="photo.filename" loading="lazy" />
              <div class="klant-photo-item__meta">{{ photo.filename }}</div>
              <div class="klant-photo-item__hover">🔍</div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="klant-pagination">
            <button
              v-for="page in totalPages"
              :key="page"
              class="klant-page-btn"
              :class="{ 'klant-page-btn--active': currentPage === page }"
              type="button"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </section>

      <section v-for="(video, i) in klant.videos" :key="i" class="klant-video section">
        <div class="container">
          <h2 class="klant-section-title">{{ video.title }}</h2>
          <KlantVideoEmbed :video="video" />
        </div>
      </section>
    </template>

    <ClientPhotoLightbox
      v-if="lightboxIndex !== null"
      :photos="lightboxPhotos"
      :index="lightboxIndex"
      @close="closeLightbox"
      @prev="prevPhoto"
      @next="nextPhoto"
    />
  </main>
</template>

<style scoped>
.klant-state {
  padding: 12rem 2rem 6rem;
  text-align: center;
  color: var(--color-text-muted);
}

.klant-hero {
  position: relative;
  min-height: 50vh;
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

.klant-hero__count {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--color-accent);
  font-weight: 600;
}

.klant-section-title {
  font-size: clamp(1.3rem, 2.5vw, 1.75rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.klant-photos__grid {
  columns: 3;
  column-gap: 0.75rem;
}

.klant-photo-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  cursor: pointer;
  break-inside: avoid;
  margin-bottom: 0.75rem;
}

.klant-photo-item img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.klant-photo-item:hover img {
  transform: scale(1.03);
}

.klant-photo-item__meta {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.45rem 0.6rem;
  font-size: 0.68rem;
  color: #fff;
  background: linear-gradient(transparent, rgba(0,0,0,0.75));
  opacity: 0;
  transition: opacity 0.2s;
}

.klant-photo-item:hover .klant-photo-item__meta {
  opacity: 1;
}

.klant-photo-item__hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.klant-photo-item:hover .klant-photo-item__hover {
  opacity: 1;
}

.klant-pagination {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 3rem;
}

.klant-page-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  background: none;
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.klant-page-btn--active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

@media (max-width: 768px) {
  .klant-photos__grid { columns: 2; }
}

@media (max-width: 480px) {
  .klant-photos__grid { columns: 1; }
}
</style>
