<script setup lang="ts">
import { ref, onMounted } from 'vue'
import OptimizedImage from '@/components/OptimizedImage.vue'

const props = withDefaults(
  defineProps<{
    src: string
    fallbackSrc?: string
    videoClass?: string
    fallbackClass?: string
    fallbackAlt?: string
  }>(),
  {
    videoClass: '',
    fallbackClass: '',
    fallbackAlt: '',
  },
)

const showVideo = ref(false)
const videoEl = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const narrow = window.matchMedia('(max-width: 768px)').matches
  const saveData = 'connection' in navigator && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData

  if (reducedMotion || narrow || saveData) return

  showVideo.value = true
  requestAnimationFrame(() => {
    videoEl.value?.play().catch(() => {})
  })
})
</script>

<template>
  <video
    v-if="showVideo"
    ref="videoEl"
    :class="videoClass"
    :src="src"
    autoplay
    muted
    loop
    playsinline
    preload="none"
  />
  <OptimizedImage
    v-else-if="fallbackSrc"
    :src="fallbackSrc"
    :alt="fallbackAlt"
    preset="hero"
    decorative
    :priority="true"
    :img-class="fallbackClass || videoClass"
  />
</template>
