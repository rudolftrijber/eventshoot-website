<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import RolfContact from '@/components/RolfContact.vue'
import FooterSection from '@/components/FooterSection.vue'
import { RouterView } from 'vue-router'

onMounted(() => {
  const existing = document.querySelector('script[src*="elfsightcdn"]')
  if (existing) existing.remove()
  const script = document.createElement('script')
  script.src = 'https://elfsightcdn.com/platform.js'
  script.async = true
  script.onload = () => {
    const w = window as Window & { Elfsight?: { initialize: () => void } }
    if (w.Elfsight) w.Elfsight.initialize()
  }
  document.head.appendChild(script)
})
</script>

<template>
  <div class="app-bg">
    <video
      class="app-bg__video"
      src="/images/es_bokey_bckgrnd_v1-1080p.mp4"
      autoplay
      muted
      loop
      playsinline
    />
  </div>

  <NavBar />
  <RouterView />
  <RolfContact />
  <FooterSection />
</template>

<style>
/* Vaste video-achtergrond over de hele site */
.app-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.app-bg__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
}

/* Secties volledig transparant */
.section {
  background: transparent !important;
}

.section--dark {
  background: rgba(0, 0, 0, 0.40) !important;
}

.section--blue {
  background: rgba(49, 159, 232, 0.40) !important;
}

/* Geen zichtbare scheidslijn boven/voor de footer */
.reviews,
.rolf,
.footer {
  border: none !important;
  box-shadow: none !important;
}

/* Elfsight-reviews widget: geen randlijn onder reviews */
.elfsight-app,
[class*='elfsight-app'] {
  border: none !important;
  box-shadow: none !important;
}
</style>
