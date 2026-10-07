<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import RolfContact from '@/components/RolfContact.vue'
import FooterSection from '@/components/FooterSection.vue'
import BackgroundVideo from '@/components/BackgroundVideo.vue'
import { RouterView } from 'vue-router'
import { reinitElfsightWidgets } from '@/lib/elfsight'
import { useStillBackground } from '@/lib/isIosLike'

const STILL_LANDSCAPE = '/DATA_EVENTSHOOT/SITE_IMAGES/BACKGROUND/eventshoot_background_HDL.jpg'
const STILL_PORTRAIT = '/DATA_EVENTSHOOT/SITE_IMAGES/BACKGROUND/eventshoot_background_HDP.jpg'

const route = useRoute()
const hideLayout = computed(() => Boolean(route.meta.hideLayout))
const hideRolfContact = computed(() => Boolean(route.meta.hideRolfContact))
const hideBackgroundVideo = computed(() => Boolean(route.meta.hideBackgroundVideo))
const stillBackground = useStillBackground()

watch(
  () => route.fullPath,
  () => {
    void reinitElfsightWidgets()
  },
)
</script>

<template>
  <div class="app-bg" :class="{ 'app-bg--solid': hideBackgroundVideo && !stillBackground }">
    <picture v-if="!hideBackgroundVideo && stillBackground" class="app-bg__media">
      <source media="(orientation: portrait)" :srcset="STILL_PORTRAIT" />
      <img :src="STILL_LANDSCAPE" alt="" />
    </picture>
    <BackgroundVideo
      v-else-if="!hideBackgroundVideo"
      video-class="app-bg__video"
      :fallback-src="STILL_LANDSCAPE"
      fallback-class="app-bg__media"
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

.app-foreground {
  position: relative;
  z-index: 1;
}

.app-bg--solid {
  background: #002d56;
}

.app-bg__video,
.app-bg__media,
.app-bg__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
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
