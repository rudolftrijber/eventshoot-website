<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { PortableText } from '@portabletext/vue'
import { client, urlFor, postBySlugQuery, type SanityPost } from '@/lib/sanity'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const post = ref<SanityPost | null>(null)
const loading = ref(true)
const notFound = ref(false)

async function loadPost(slug: string) {
  loading.value = true
  notFound.value = false
  try {
    const result = await client.fetch(postBySlugQuery, { slug })
    if (!result) { notFound.value = true; return }
    post.value = result
    useSeo({
      title: `${result.title} | Eventshoot.nl`,
      description: result.excerpt,
      image: result.mainImage ? urlFor(result.mainImage).width(1200).url() : undefined,
      url: `https://eventshoot.nl/eventkennis/${result.slug.current}`,
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => loadPost(route.params.slug as string))
watch(() => route.params.slug, slug => loadPost(slug as string))

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <main>
    <div v-if="loading" class="post-state section">
      <div class="container">
        <div class="post-spinner"></div>
      </div>
    </div>

    <div v-else-if="notFound" class="post-state section">
      <div class="container">
        <p>Artikel niet gevonden.</p>
        <RouterLink to="/eventkennis" class="btn btn--outline" style="margin-top:1.5rem">&larr; Terug naar Eventkennis</RouterLink>
      </div>
    </div>

    <div v-else-if="post" class="post">
      <div class="post__hero">
        <img
          v-if="post.mainImage"
          :src="urlFor(post.mainImage).width(1600).height(700).url()"
          :alt="post.mainImage.alt || post.title"
        />
        <div class="post__hero-overlay"></div>
        <div class="container post__hero-content">
          <div class="post__meta">{{ formatDate(post.publishedAt) }} &middot; {{ post.readTime }} min leestijd</div>
          <h1>{{ post.title }}</h1>
        </div>
      </div>

      <div class="container post__body">
        <p class="post__excerpt">{{ post.excerpt }}</p>
        <div class="post__content">
          <PortableText v-if="post.body" :value="post.body" />
        </div>
        <RouterLink to="/eventkennis" class="post__back">&larr; Terug naar Eventkennis</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.post-state { padding-top: 10rem; text-align: center; color: var(--color-text-muted); }

.post-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto;
}

@keyframes spin { to { transform: rotate(360deg); } }

.post__hero { position: relative; height: 55vh; min-height: 320px; }
.post__hero img { width: 100%; height: 100%; object-fit: cover; }
.post__hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75));
}
.post__hero-content { position: absolute; bottom: 3rem; left: 0; right: 0; }
.post__meta { font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; }
.post__hero-content h1 { font-size: clamp(1.5rem, 3vw, 2.75rem); font-weight: 800; max-width: 800px; }

.post__body { padding-top: 3rem; padding-bottom: 5rem; max-width: 760px; }
.post__excerpt {
  font-size: 1.1rem; color: var(--color-text-muted); line-height: 1.7;
  border-left: 3px solid var(--color-accent);
  padding-left: 1.25rem; margin-bottom: 2.5rem;
}
.post__content { line-height: 1.8; font-size: 1rem; color: var(--color-text); }
:deep(.post__content p) { margin-bottom: 1.25rem; }
:deep(.post__content h2) { font-size: 1.5rem; font-weight: 700; margin: 2.5rem 0 0.75rem; }
:deep(.post__content h3) { font-size: 1.2rem; font-weight: 700; margin: 2rem 0 0.5rem; }
:deep(.post__content strong) { color: var(--color-accent); font-weight: 700; }
:deep(.post__content img) { width: 100%; border-radius: var(--radius); margin: 1.5rem 0; }

.post__back {
  display: inline-flex; align-items: center; gap: 0.5rem;
  margin-top: 3rem; font-size: 0.9rem; font-weight: 600;
  color: var(--color-accent); transition: color var(--transition);
}
.post__back:hover { color: var(--color-accent-hover); }
</style>
