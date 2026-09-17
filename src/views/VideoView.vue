<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSeo } from '@/composables/useSeo'

const PLAYER_BASE = 'https://luteijnmedia.bbvms.com/ch/1472.html?inheritDimensions=true'

const iframeSrc = computed(() => {
  if (typeof window === 'undefined') return PLAYER_BASE
  return `${PLAYER_BASE}#!referrer=${encodeURIComponent(window.location.href)}&realReferrer=${encodeURIComponent(document.referrer)}`
})

function onPlayerLoad(event: Event) {
  const el = event.target as HTMLIFrameElement
  if (el.src.includes('#!referrer=')) return
  el.src += `#!referrer=${encodeURIComponent(location.href)}&realReferrer=${encodeURIComponent(document.referrer)}`
}

onMounted(() => {
  useSeo({
    title: 'Video | Eventshoot.nl',
    description: 'Video van Eventshoot.nl, met header en footer van de site.',
    url: 'https://eventshoot.nl/video',
  })
})
</script>

<template>
  <main>
    <section class="video-page section">
      <div class="container video-page__inner">
        <div class="video-page__frame">
          <iframe
            class="video-page__player"
            :src="iframeSrc"
            title="Eventshoot.nl video"
            width="720"
            height="405"
            frameborder="0"
            allow="autoplay; fullscreen"
            allowfullscreen
            webkitallowfullscreen
            mozallowfullscreen
            @load="onPlayerLoad"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.video-page {
  padding-top: 9rem;
  padding-bottom: 4rem;
}

.video-page__inner {
  max-width: 960px;
}

.video-page__frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #111;
  overflow: hidden;
}

.video-page__player {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
