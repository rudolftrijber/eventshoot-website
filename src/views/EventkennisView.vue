<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { client, urlFor, postsQuery, type SanityPost } from '@/lib/sanity'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

onMounted(() => {
  useSeo({
    title: 'Eventkennis | Eventshoot.nl',
    description: 'Praktische artikelen over eventcontent, eventfotografie en zichtbaarheid na je event. Onderhouden door Rolf Trijber.',
    url: 'https://eventshoot.nl/eventkennis',
  })
  loadPosts()
})

const posts = ref<SanityPost[]>([])
const loading = ref(true)
const error = ref(false)

async function loadPosts() {
  try {
    posts.value = await client.fetch(postsQuery)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="ek-hero">
      <div class="ek-hero__bg">
        <img src="/eventshoot-78.jpg" alt="Eventkennis door Rolf Trijber" />
        <div class="ek-hero__overlay"></div>
      </div>
      <div class="container ek-hero__content">
        <h1>{{ t('eventkennis.h1') }}</h1>
        <p>{{ t('eventkennis.sub') }}</p>
      </div>
    </section>

    <section class="eventkennis section">
      <div class="container">

        <div v-if="loading" class="ek__state">
          <div class="ek__spinner"></div>
          <p>{{ t('eventkennis.loading') }}</p>
        </div>

        <div v-else-if="error" class="ek__state">
          <p>{{ t('eventkennis.error') }}</p>
        </div>

        <div v-else-if="posts.length === 0" class="ek__state">
          <p>{{ t('eventkennis.empty') }}</p>
        </div>

        <div v-else class="ek__grid">
          <RouterLink
            v-for="post in posts"
            :key="post._id"
            :to="`/eventkennis/${post.slug.current}`"
            class="ek__card"
          >
            <div class="ek__img-wrap">
              <img
                v-if="post.mainImage"
                :src="urlFor(post.mainImage).width(600).url()"
                :alt="post.mainImage.alt || post.title"
                loading="lazy"
              />
              <div v-else class="ek__img-placeholder"></div>
            </div>
            <div class="ek__body">
              <div class="ek__meta">
                <span>{{ formatDate(post.publishedAt) }}</span>
                <span>{{ post.readTime }} min leestijd</span>
              </div>
              <h2 class="ek__title">{{ post.title }}</h2>
              <p class="ek__excerpt">{{ post.excerpt }}</p>
              <span class="ek__read">Lees verder &rarr;</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.ek-hero {
  position: relative;
  min-height: 45vh;
  display: flex;
  align-items: center;
}

.ek-hero__bg {
  position: absolute;
  inset: 0;
}

.ek-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ek-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 100%);
}

.ek-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 680px;
}

.ek-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.ek-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  line-height: 1.75;
}

.eventkennis { padding-top: 3rem; }

.ek__state {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.ek__spinner {
  width: 36px; height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.ek__grid {
  columns: 3;
  column-gap: 1.5rem;
}

.ek__card {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: var(--radius);
  overflow: hidden;
  display: block;
  break-inside: avoid;
  margin-bottom: 1.5rem;
  transition: border-color var(--transition), transform var(--transition);
}
.ek__card:hover { transform: translateY(-3px); }

.ek__img-wrap { overflow: hidden; }
.ek__img-wrap img { width: 100%; height: auto; display: block; transition: transform 0.3s; }
.ek__card:hover .ek__img-wrap img { transform: scale(1.04); }
.ek__img-placeholder { width: 100%; height: 160px; background: var(--color-border); }

.ek__body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ek__meta { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--color-text-muted); }
.ek__title { font-size: 1.05rem; font-weight: 700; line-height: 1.3; color: var(--color-text); }
.ek__excerpt { font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.6; }
.ek__read { font-size: 0.875rem; font-weight: 600; color: var(--color-accent); }

@media (max-width: 900px) { .ek__grid { columns: 2; } }
@media (max-width: 600px) { .ek__grid { columns: 1; } }
</style>
