<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import SectionHeading from '@/components/SectionHeading.vue'
import { client, urlFor, postsQuery, type SanityPost } from '@/lib/sanity'
import { useSeo } from '@/composables/useSeo'

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
    <section class="eventkennis section">
      <div class="container">
        <SectionHeading
          title="Eventkennis."
          subtitle="Praktische artikelen over eventcontent, eventfotografie en zichtbaarheid na je event. Onderhouden door Rolf Trijber."
        />

        <div v-if="loading" class="ek__state">
          <div class="ek__spinner"></div>
          <p>Artikelen laden…</p>
        </div>

        <div v-else-if="error" class="ek__state">
          <p>Kon artikelen niet laden. Controleer de Sanity configuratie.</p>
        </div>

        <div v-else-if="posts.length === 0" class="ek__state">
          <p>Nog geen artikelen gepubliceerd. Voeg ze toe via de Sanity Studio.</p>
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
                :src="urlFor(post.mainImage).width(600).height(340).url()"
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
.eventkennis { padding-top: 8rem; }

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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.ek__card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color var(--transition), transform var(--transition);
}
.ek__card:hover { border-color: var(--color-accent); transform: translateY(-3px); }

.ek__img-wrap { aspect-ratio: 16/9; overflow: hidden; }
.ek__img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.ek__card:hover .ek__img-wrap img { transform: scale(1.04); }
.ek__img-placeholder { width: 100%; height: 100%; background: var(--color-border); }

.ek__body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.ek__meta { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--color-text-muted); }
.ek__title { font-size: 1.05rem; font-weight: 700; line-height: 1.3; color: var(--color-text); }
.ek__excerpt { font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.6; flex: 1; }
.ek__read { font-size: 0.875rem; font-weight: 600; color: var(--color-accent); }

@media (max-width: 900px) { .ek__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .ek__grid { grid-template-columns: 1fr; } }
</style>
