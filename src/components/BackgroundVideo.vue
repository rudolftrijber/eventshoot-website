<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import OptimizedImage from '@/components/OptimizedImage.vue'

withDefaults(
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
const isPlaying = ref(false)
const videoEl = ref<HTMLVideoElement | null>(null)

function armVideo(el: HTMLVideoElement) {
  el.muted = true
  el.defaultMuted = true
  el.playsInline = true
  el.autoplay = true
  el.setAttribute('muted', '')
  el.setAttribute('playsinline', '')
  el.setAttribute('webkit-playsinline', 'true')
  el.disablePictureInPicture = true
}

function tryPlay() {
  const el = videoEl.value
  if (!el || isPlaying.value) return
  armVideo(el)
  void el.play().catch(() => {
    /* Tablet/iOS mag autoplay weigeren; geen native play-knop laten zien. */
  })
}

function onPlaying() {
  isPlaying.value = true
}

function onVisibility() {
  if (!document.hidden) tryPlay()
}

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData =
    'connection' in navigator &&
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData

  if (reducedMotion || saveData) return

  showVideo.value = true
  void nextTick(() => {
    const el = videoEl.value
    if (!el) return
    armVideo(el)
    el.addEventListener('playing', onPlaying)
    el.addEventListener('canplay', tryPlay)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('touchstart', tryPlay, { passive: true })
    tryPlay()
    window.setTimeout(tryPlay, 400)
  })
})

onUnmounted(() => {
  const el = videoEl.value
  el?.removeEventListener('playing', onPlaying)
  el?.removeEventListener('canplay', tryPlay)
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('touchstart', tryPlay)
})
</script>

<template>
  <video
    v-if="showVideo"
    ref="videoEl"
    class="bg-video"
    :class="[videoClass, { 'bg-video--playing': isPlaying }]"
    :src="src"
    autoplay
    muted
    loop
    playsinline
    webkit-playsinline
    preload="auto"
    disablepictureinpicture
    controlslist="nodownload nofullscreen noremoteplayback"
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

<style scoped>
.bg-video {
  pointer-events: none;
}

.bg-video:not(.bg-video--playing) {
  opacity: 0;
}

.bg-video::-webkit-media-controls,
.bg-video::-webkit-media-controls-enclosure,
.bg-video::-webkit-media-controls-start-playback-button,
.bg-video::-webkit-media-controls-overlay-play-button {
  display: none !important;
  -webkit-appearance: none;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 0;
  height: 0;
}
</style>
