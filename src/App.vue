<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import { RouterView } from 'vue-router'
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
</style>
