<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import OptimizedImage from '@/components/OptimizedImage.vue'

const props = withDefaults(
  defineProps<{
    photos: string[]
    alt?: string
    intervalMs?: number
    autoplay?: boolean
  }>(),
  {
    alt: 'Eventfoto Eventshoot.nl',
    intervalMs: 3500,
    autoplay: true,
  },
)

const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const prevIndex = computed(
  () => (current.value - 1 + props.photos.length) % props.photos.length,
)
const nextIndex = computed(
  () => (current.value + 1) % props.photos.length,
)

function shouldLoad(i: number) {
  return i === current.value || i === prevIndex.value || i === nextIndex.value
}

function prev() {
  current.value = prevIndex.value
}

function next() {
  current.value = nextIndex.value
}

onMounted(() => {
  if (props.autoplay && props.photos.length > 1) {
    timer = setInterval(next, props.intervalMs)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

defineExpose({ prev, next, current })
</script>

<template>
  <div class="photo-carousel">
    <button
      v-if="photos.length > 1"
      class="photo-carousel__btn photo-carousel__btn--prev"
      type="button"
      @click="prev"
      aria-label="Vorige foto"
    >
      &#8249;
    </button>

    <div class="photo-carousel__track">
      <div
        v-for="(photo, i) in photos"
        :key="photo"
        class="photo-carousel__slide"
        :class="{
          'photo-carousel__slide--active': i === current,
          'photo-carousel__slide--prev': i === prevIndex,
          'photo-carousel__slide--next': i === nextIndex,
        }"
      >
        <OptimizedImage
          v-if="shouldLoad(i)"
          :src="photo"
          :alt="`${alt} ${i + 1}`"
          preset="carousel"
          :img-class="'photo-carousel__img'"
          :priority="i === current && current === 0"
        />
      </div>
    </div>

    <button
      v-if="photos.length > 1"
      class="photo-carousel__btn photo-carousel__btn--next"
      type="button"
      @click="next"
      aria-label="Volgende foto"
    >
      &#8250;
    </button>
  </div>
</template>

<style scoped>
.photo-carousel {
  position: relative;
}

.photo-carousel__track {
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 12px;
}

.photo-carousel__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.6s ease, transform 0.6s ease;
  pointer-events: none;
}

.photo-carousel__slide :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.photo-carousel__slide :deep(.photo-carousel__img),
.photo-carousel__slide :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-carousel__slide--active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
  z-index: 2;
}

.photo-carousel__slide--prev,
.photo-carousel__slide--next {
  opacity: 0;
  z-index: 1;
}

.photo-carousel__btn {
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

.photo-carousel__btn--prev { left: 0.75rem; }
.photo-carousel__btn--next { right: 0.75rem; }

.photo-carousel__btn:hover {
  background: var(--color-accent);
}
</style>
