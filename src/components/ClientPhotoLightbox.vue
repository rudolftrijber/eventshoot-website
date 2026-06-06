<script setup lang="ts">
import { computed } from 'vue'

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

const current = computed(() => props.photos[props.index])

async function copyFilename() {
  if (!current.value) return
  try {
    await navigator.clipboard.writeText(current.value.filename)
  } catch {
    /* clipboard optional */
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="lightbox" @click.self="emit('close')">
      <button class="lightbox__close" type="button" @click="emit('close')">✕</button>
      <button class="lightbox__prev" type="button" @click="emit('prev')">&#8249;</button>

      <div class="lightbox__img-wrap">
        <img :src="current.url" :alt="current.filename" />
      </div>

      <button class="lightbox__next" type="button" @click="emit('next')">&#8250;</button>

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
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__prev { left: 1.5rem; }
.lightbox__next { right: 1.5rem; }

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
}

.lightbox__icon-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

@media (max-width: 768px) {
  .lightbox__prev { left: 0.5rem; }
  .lightbox__next { right: 0.5rem; }
  .lightbox__filename { max-width: 180px; }
}
</style>
