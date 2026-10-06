<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import RolfContact from '@/components/RolfContact.vue'
import FooterSection from '@/components/FooterSection.vue'
import BackgroundVideo from '@/components/BackgroundVideo.vue'
import { RouterView } from 'vue-router'
import { reinitElfsightWidgets } from '@/lib/elfsight'
import { skipFullscreenVideo } from '@/lib/isIosLike'

const route = useRoute()
const hideLayout = computed(() => Boolean(route.meta.hideLayout))
const hideRolfContact = computed(() => Boolean(route.meta.hideRolfContact))
const hideBackgroundVideo = computed(() => Boolean(route.meta.hideBackgroundVideo))
const ios = skipFullscreenVideo()

watch(
  () => route.fullPath,
  () => {
    void reinitElfsightWidgets()
  },
)
</script>

<template>
  <div v-if="!ios" class="app-bg" :class="{ 'app-bg--solid': hideBackgroundVideo }">
    <BackgroundVideo
      v-if="!hideBackgroundVideo"
      video-class="app-bg__video"
      src="/images/es_bokey_bckgrnd_v1-1080p.mp4"
    />
  </div>

  <div class="app-foreground">
    <NavBar v-if="!hideLayout" />
    <RouterView />
    <RolfContact v-if="!hideLayout && !hideRolfContact" />
    <FooterSection v-if="!hideLayout" />
  </div>
</template>

<style>
/* Vaste video-achtergrond over de hele site */
.app-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #0a1628;
}

html.is-ios .app-bg,
html.is-ios .bg-video,
html.is-compact .app-bg,
html.is-compact .bg-video {
  display: none !important;
}

@media (any-pointer: coarse), (hover: none), (pointer: coarse), (max-width: 1200px) {
  .app-bg,
  .bg-video,
  video.bg-video {
    display: none !important;
  }
}

.app-foreground {
  position: relative;
  z-index: 1;
}

.app-bg--solid {
  background: #002d56;
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

/* Elfsight portal mag geen klikken onderscheppen */
#ELEV8_PORTAL {
  pointer-events: none;
}
/* Maar de widget zelf blijft klikbaar */
.elfsight-app,
[class*='elfsight-app-'] {
  pointer-events: auto !important;
}
</style>
