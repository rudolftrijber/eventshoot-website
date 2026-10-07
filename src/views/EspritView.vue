<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Esprit | Eventshoot.nl',
    description: 'Testpagina met de Esprit Vimeo-showcase.',
    url: 'https://eventshoot.nl/esprit',
  })

  let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (!robots) {
    robots = document.createElement('meta')
    robots.setAttribute('name', 'robots')
    document.head.appendChild(robots)
  }
  robots.setAttribute('content', 'noindex, nofollow')
})

onUnmounted(() => {
  const robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (robots?.getAttribute('content') === 'noindex, nofollow') {
    robots.remove()
  }
})
</script>

<template>
  <main class="esprit">
    <h1 class="esprit__title">Esprit</h1>
    <div class="esprit__frame">
      <iframe
        src="https://vimeo.com/showcase/12442809/embed2"
        title="Esprit Vimeo-showcase"
        allow="autoplay; fullscreen; picture-in-picture; gyroscope; accelerometer; clipboard-write; encrypted-media; web-share"
        allowfullscreen
        frameborder="0"
      />
    </div>
  </main>
</template>

<style scoped>
.esprit {
  width: 100%;
  margin-top: 112px;
}

.esprit__title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.esprit__frame {
  position: relative;
  width: 100%;
  height: 0;
  padding: 56.25% 0 0 0;
  background: #111;
}

.esprit__frame iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
