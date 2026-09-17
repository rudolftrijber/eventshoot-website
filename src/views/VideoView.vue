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
  padding-top: 7.5rem;
  padding-bottom: 2.5rem;
  background: #000;
  min-height: 100vh;
}

.video-page__channel {
  width: 100%;
  max-width: 100%;
}
</style>
