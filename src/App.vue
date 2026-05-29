<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import RolfContact from '@/components/RolfContact.vue'
import FooterSection from '@/components/FooterSection.vue'
import { RouterView } from 'vue-router'

type ElfsightWindow = Window & {
  ElfsightEmbeds?: { widgets: { initialize: () => void } }
  Elfsight?: { reload: () => void }
}

const route = useRoute()

watch(() => route.path, () => {
  setTimeout(() => {
    const w = window as ElfsightWindow
    if (w.ElfsightEmbeds?.widgets?.initialize) {
      w.ElfsightEmbeds.widgets.initialize()
    } else if (w.Elfsight?.reload) {
      w.Elfsight.reload()
    }
  }, 300)
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
