<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useSeo } from '@/composables/useSeo'

const SCRIPT_SRC = 'https://luteijnmedia.bbvms.com/ch/1499.js'
const CHANNEL_TARGET = 'leaseweb-bb-channel'
const host = ref<HTMLElement | null>(null)
let scriptEl: HTMLScriptElement | null = null

onMounted(() => {
  document.documentElement.classList.add('page-leaseweb')
  useSeo({
    title: 'Leaseweb | Eventshoot.nl',
    description: 'Testpagina voor het Leaseweb-videokanaal.',
    url: 'https://eventshoot.nl/leaseweb',
  })

  let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (!robots) {
    robots = document.createElement('meta')
    robots.setAttribute('name', 'robots')
    document.head.appendChild(robots)
  }
  robots.setAttribute('content', 'noindex, nofollow')

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
  document.documentElement.classList.remove('page-leaseweb')
  scriptEl?.remove()
  scriptEl = null
  if (host.value) host.value.innerHTML = ''
  const robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (robots?.getAttribute('content') === 'noindex, nofollow') {
    robots.remove()
  }
})
</script>

<template>
  <main class="lw-channel-page">
    <div :id="CHANNEL_TARGET" ref="host" class="lw-channel-page__host" />
  </main>
</template>

<style scoped>
.lw-channel-page {
  position: relative;
  z-index: 1;
  margin-top: 112px;
  width: 100%;
  min-height: calc(100vh - 112px);
  background: #002d56;
  padding: 0 0 2.5rem;
}

.lw-channel-page__host {
  position: static;
  width: 100%;
  max-width: 100%;
  height: auto;
  overflow: visible;
  background: #002d56;
}

.lw-channel-page__host :deep(.bb-channel-wrapper) {
  position: static !important;
  height: auto !important;
  overflow: visible !important;
}
</style>

<style>
html.page-leaseweb,
html.page-leaseweb body,
html.page-leaseweb .app-bg {
  background: #002d56 !important;
}
html.page-leaseweb .app-bg video,
html.page-leaseweb .app-bg__video {
  display: none !important;
}
html.page-leaseweb .footer,
html.page-leaseweb .footer__bottom {
  background: rgba(0, 0, 5, 0.45);
  backdrop-filter: blur(10px);
}
</style>
