<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useSeo } from '@/composables/useSeo'

const SCRIPT_SRC = 'https://luteijnmedia.bbvms.com/p/dsr/c/7387338.js'
const host = ref<HTMLElement | null>(null)
let scriptEl: HTMLScriptElement | null = null

onMounted(() => {
  useSeo({
    title: 'Video test | Eventshoot.nl',
    description: 'Testpagina voor de DSR-video-embed.',
    url: 'https://eventshoot.nl/test/video',
  })

  let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (!robots) {
    robots = document.createElement('meta')
    robots.setAttribute('name', 'robots')
    document.head.appendChild(robots)
  }
  robots.setAttribute('content', 'noindex, nofollow')

  if (!host.value) return
  scriptEl = document.createElement('script')
  scriptEl.type = 'text/javascript'
  scriptEl.src = SCRIPT_SRC
  scriptEl.async = true
  host.value.appendChild(scriptEl)
})

onUnmounted(() => {
  scriptEl?.remove()
  scriptEl = null
  const robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (robots?.getAttribute('content') === 'noindex, nofollow') {
    robots.remove()
  }
})
</script>

<template>
  <main>
    <section class="test-video section">
      <div class="container test-video__inner">
        <p class="test-video__eyebrow">Testpagina, niet in het menu</p>
        <h1>DSR video-embed</h1>
        <p class="test-video__intro">
          Verklein het venster of open de pagina op je telefoon om te zien of de speler meeschaalt.
        </p>
        <div class="test-video__frame">
          <div ref="host" class="test-video__player" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.test-video {
  padding-top: 9rem;
  padding-bottom: 4rem;
}

.test-video__inner {
  max-width: 960px;
}

.test-video__eyebrow {
  color: var(--color-blue);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.test-video h1 {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  margin-bottom: 0.75rem;
}

.test-video__intro {
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 1.75rem;
}

.test-video__frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #111;
  border-radius: 12px;
  overflow: hidden;
}

.test-video__player,
.test-video__player :deep(div),
.test-video__player :deep(iframe) {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
  border: none;
}
</style>
