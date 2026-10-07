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
  <main>
    <section class="esprit section">
      <div class="container esprit__inner">
        <h1>Esprit</h1>
        <div class="esprit__frame">
          <iframe
            src="https://vimeo.com/showcase/12442809/embed2"
            title="Esprit Vimeo-showcase"
            allow="autoplay; fullscreen; picture-in-picture; gyroscope; accelerometer; clipboard-write; encrypted-media; web-share"
            allowfullscreen
            frameborder="0"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.esprit {
  padding-top: 9rem;
  padding-bottom: 4rem;
}

.esprit__inner {
  max-width: 1100px;
}

.esprit h1 {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  margin-bottom: 1.5rem;
}

.esprit__frame {
  position: relative;
  width: 100%;
  height: 0;
  /* Showcase is hoger dan 16:9: hero plus het raster van 10 video's. */
  padding-bottom: 320%;
  background: #111;
  border-radius: 12px;
  overflow: hidden;
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
