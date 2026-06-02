<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'

const { locale } = useI18n()
const isEnglish = computed(() => locale.value.startsWith('en'))

onMounted(() => {
  useSeo({
    title: isEnglish.value ? 'Page not found | Eventshoot.nl' : 'Pagina niet gevonden | Eventshoot.nl',
    description: isEnglish.value
      ? 'This page could not be found.'
      : 'Deze pagina kon niet worden gevonden.',
    url: 'https://eventshoot.nl/404',
    locale: isEnglish.value ? 'en' : 'nl',
  })

  let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (!robots) {
    robots = document.createElement('meta')
    robots.setAttribute('name', 'robots')
    document.head.appendChild(robots)
  }
  robots.setAttribute('content', 'noindex, follow')
})

onUnmounted(() => {
  const robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if (robots?.getAttribute('content') === 'noindex, follow') {
    robots.remove()
  }
})
</script>

<template>
  <main class="not-found">
    <section class="section">
      <div class="container not-found__inner">
        <p class="not-found__code">404</p>
        <h1>{{ isEnglish ? 'Page not found' : 'Pagina niet gevonden' }}</h1>
        <p class="not-found__text">
          {{
            isEnglish
              ? 'The page you are looking for no longer exists or has moved.'
              : 'De pagina die je zoekt bestaat niet meer of is verplaatst.'
          }}
        </p>
        <div class="not-found__actions">
          <RouterLink to="/" class="btn btn--primary">
            {{ isEnglish ? 'Back to home' : 'Terug naar home' }}
          </RouterLink>
          <RouterLink to="/kennismaken" class="btn btn--outline">
            {{ isEnglish ? 'Get in touch' : 'Kennismaken' }}
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.not-found {
  padding-top: 8rem;
}

.not-found__inner {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.not-found__code {
  font-size: clamp(2.5rem, 8vw, 5rem);
  color: var(--color-blue);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.not-found h1 {
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  margin-bottom: 1rem;
}

.not-found__text {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin-bottom: 2rem;
}

.not-found__actions {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
