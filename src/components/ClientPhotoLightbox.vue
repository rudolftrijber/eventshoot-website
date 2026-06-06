<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface LightboxPhoto {
  url: string
  filename: string
}

const props = defineProps<{
  photos: LightboxPhoto[]
  index: number
}>()

const emit = defineEmits<{
  close: []
  prev: []
  next: []
}>()

const shareMenuOpen = ref(false)

const current = computed(() => props.photos[props.index])

async function copyFilename() {
  if (!current.value) return
  try {
    await navigator.clipboard.writeText(current.value.filename)
  } catch {
    /* clipboard optional */
  }
}

function toggleShareMenu() {
  shareMenuOpen.value = !shareMenuOpen.value
}

function shareOn(platform: 'linkedin' | 'facebook' | 'instagram') {
  if (!current.value) return

  const photoUrl = current.value.url.startsWith('http')
    ? current.value.url
    : `${window.location.origin}${current.value.url}`
  const url = encodeURIComponent(photoUrl)

  if (platform === 'linkedin') {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
  } else if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  } else if (platform === 'instagram') {
    const a = document.createElement('a')
    a.href = current.value.url
    a.download = current.value.filename
    a.click()
  }

  shareMenuOpen.value = false
}

watch(shareMenuOpen, (open) => {
  if (open) {
    document.addEventListener('click', () => { shareMenuOpen.value = false }, { once: true })
  }
})

watch(() => props.index, () => {
  shareMenuOpen.value = false
})
</script>

<template>
  <Teleport to="body">
    <div class="lightbox" @click.self="emit('close')">
      <button class="lightbox__close" type="button" @click="emit('close')">✕</button>
      <div class="lightbox__img-wrap">
        <button class="lightbox__prev" type="button" @click="emit('prev')">&#8249;</button>
        <img :src="current.url" :alt="current.filename" />
        <button class="lightbox__next" type="button" @click="emit('next')">&#8250;</button>
      </div>

      <div class="lightbox__toolbar">
        <span class="lightbox__counter">{{ index + 1 }} / {{ photos.length }}</span>
        <code class="lightbox__filename">{{ current.filename }}</code>
        <div class="lightbox__actions">
          <button class="lightbox__icon-btn" type="button" title="Bestandsnaam kopiëren" @click="copyFilename">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 1.927-.184" />
            </svg>
          </button>
          <a
            :href="current.url"
            :download="current.filename"
            class="lightbox__icon-btn"
            title="Download webformaat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </a>
          <div class="share-wrap" @click.stop>
            <button class="lightbox__icon-btn" type="button" title="Delen" @click="toggleShareMenu">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            </button>
            <div v-if="shareMenuOpen" class="share-menu">
              <button class="share-menu__item" type="button" @click="shareOn('linkedin')">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" class="share-icon share-icon--linkedin">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
              <button class="share-menu__item" type="button" @click="shareOn('facebook')">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" class="share-icon share-icon--facebook">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              <button class="share-menu__item" type="button" title="Download om te delen op Instagram" @click="shareOn('instagram')">
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
</template>

<style scoped>
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
  position: relative;
  max-width: 92vw;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__img-wrap img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius);
  display: block;
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
}

.lightbox__prev,
.lightbox__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__prev { left: 0.75rem; }
.lightbox__next { right: 0.75rem; }

.lightbox__prev:hover,
.lightbox__next:hover {
  background: var(--color-accent);
}

.lightbox__toolbar {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  border-radius: 50px;
  padding: 0.6rem 1.25rem;
  max-width: calc(100vw - 2rem);
  flex-wrap: wrap;
  justify-content: center;
}

.lightbox__counter {
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  white-space: nowrap;
}

.lightbox__filename {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.08);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
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

@media (max-width: 768px) {
  .lightbox__prev { left: 0.4rem; }
  .lightbox__next { right: 0.4rem; }
  .lightbox__filename { max-width: 180px; }
}
</style>
