<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import SectionHeading from '@/components/SectionHeading.vue'
import { client, urlFor, postsQuery, type SanityPost } from '@/lib/sanity'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Nieuws over eventfotografie | Eventshoot.nl',
    description: 'Tips en inzichten over eventfotografie, aftermovies en hoe je het meeste haalt uit professioneel beeldmateriaal van jouw event.',
    url: 'https://eventshoot.nl/blog',
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
    <section class="blog section">
      <div class="container">
        <SectionHeading
          title="Nieuws"
          subtitle="Tips en inzichten over eventfotografie en eventvideo."
        />

        <div v-if="loading" class="blog__state">
          <div class="blog__spinner"></div>
          <p>Artikelen laden…</p>
        </div>

        <div v-else-if="error" class="blog__state">
          <p>Kon artikelen niet laden. Controleer de Sanity configuratie.</p>
        </div>

        <div v-else-if="posts.length === 0" class="blog__state">
          <p>Nog geen artikelen gepubliceerd. Voeg ze toe via de Sanity Studio.</p>
        </div>

        <div v-else class="blog__grid">
          <RouterLink
            v-for="post in posts"
            :key="post._id"
            :to="`/blog/${post.slug.current}`"
            class="blog__card"
          >
            <div class="blog__img-wrap">
              <img
                v-if="post.mainImage"
                :src="urlFor(post.mainImage).width(600).height(340).url()"
                :alt="post.mainImage.alt || post.title"
                loading="lazy"
              />
              <div v-else class="blog__img-placeholder"></div>
            </div>
            <div class="blog__body">
              <div class="blog__meta">
                <span>{{ formatDate(post.publishedAt) }}</span>
                <span>{{ post.readTime }} min leestijd</span>
              </div>
              <h2 class="blog__title">{{ post.title }}</h2>
              <p class="blog__excerpt">{{ post.excerpt }}</p>
              <span class="blog__read">Lees verder →</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.blog {
  padding-top: 8rem;
}

.blog__state {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.blog__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.blog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.blog__card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color var(--transition), transform var(--transition);
}

.blog__card:hover {
  border-color: var(--color-accent);
  transform: translateY(-3px);
}

.blog__img-wrap {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.blog__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.blog__card:hover .blog__img-wrap img {
  transform: scale(1.04);
}

.blog__img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-border);
}

.blog__body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.blog__meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.blog__title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-text);
}

.blog__excerpt {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  flex: 1;
}

.blog__read {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
}

@media (max-width: 900px) {
  .blog__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .blog__grid { grid-template-columns: 1fr; }
}
</style>
