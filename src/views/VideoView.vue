<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useSeo } from '@/composables/useSeo'

const SCRIPT_SRC = 'https://luteijnmedia.bbvms.com/ch/1472.js'
const CHANNEL_TARGET = 'eventshoot-video-channel'
const host = ref<HTMLElement | null>(null)
let scriptEl: HTMLScriptElement | null = null

onMounted(() => {
  useSeo({
    title: 'Video | Eventshoot.nl',
    description: 'Video van Eventshoot.nl.',
    url: 'https://eventshoot.nl/video',
  })

  if (!host.value) return
  host.value.innerHTML = ''

  scriptEl = document.createElement('script')
  scriptEl.type = 'text/javascript'
  scriptEl.src = SCRIPT_SRC
  scriptEl.async = true
  scriptEl.setAttribute('data-target', `#${CHANNEL_TARGET}`)
  host.value.appendChild(scriptEl)
})

onUnmounted(() => {
  scriptEl?.remove()
  scriptEl = null
  if (host.value) host.value.innerHTML = ''
})
</script>

<template>
  <main class="video-page">
    <div :id="CHANNEL_TARGET" ref="host" class="video-page__channel" />
  </main>
</template>

<style scoped>
.video-page {
  /* Onder de vaste topbalk (36px) + navigatie (76px), boven de footer */
  position: relative;
  z-index: 1;
  margin-top: 112px;
  width: 100%;
  background: #000;
  padding: 0 0 2.5rem;
}

.video-page__channel {
  width: 100%;
  max-width: 100%;
  background: #000;
}
</style>
