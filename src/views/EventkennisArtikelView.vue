<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { PortableText } from '@portabletext/vue'
import ArticleFaqBlock from '@/components/ArticleFaqBlock.vue'
import { client, urlFor, postBySlugQuery, postsQuery, type SanityPost } from '@/lib/sanity'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()
const route = useRoute()

const post = ref<SanityPost | null>(null)
const recentPosts = ref<SanityPost[]>([])
const loading = ref(true)
const notFound = ref(false)

async function loadPost(slug: string) {
  loading.value = true
  notFound.value = false
  try {
    const [result, all] = await Promise.all([
      client.fetch<SanityPost | null>(postBySlugQuery, { slug }),
      client.fetch<SanityPost[]>(postsQuery),
    ])
    if (!result) {
      notFound.value = true
      post.value = null
      return
    }
    post.value = result
    recentPosts.value = all.filter(p => p.slug.current !== slug).slice(0, 3)
    useSeo({
      title: `${result.title} | Eventshoot.nl`,
      description: result.excerpt,
      image: result.mainImage ? urlFor(result.mainImage).width(1200).url() : undefined,
      url: `https://eventshoot.nl/eventkennis/${result.slug.current}`,
      locale: 'nl',
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
    <section class="kb-hero">
      <div class="kb-hero__bg">
        <img src="/eventshoot-78.jpg" alt="Eventkennis door Rolf Trijber" />
        <div class="kb-hero__overlay"></div>
      </div>
      <div class="container kb-hero__content">
        <h1>{{ t('artikel.kbH1') }}</h1>
        <p>{{ t('artikel.kbSub') }}</p>
        <RouterLink to="/eventkennis" class="kb-hero__back">&larr; {{ t('artikel.backAll') }}</RouterLink>
      </div>
    </section>

    <div v-if="loading" class="post-state section">
      <div class="container">
        <div class="post-spinner"></div>
        <p>{{ t('artikel.loading') }}</p>
      </div>
    </div>

    <div v-else-if="notFound" class="post-state section">
      <div class="container">
        <p>{{ t('artikel.notFound') }}</p>
        <RouterLink to="/eventkennis" class="btn btn--primary" style="margin-top:1.5rem">&larr; {{ t('artikel.backBtn') }}</RouterLink>
      </div>
    </div>

    <div v-else-if="post" class="container post__wrap">

      <div class="post__header">
        <p class="post__author">{{ t('artikel.author') }}</p>
        <p v-if="post.publishedAt" class="post__meta">{{ formatDate(post.publishedAt) }} · {{ post.readTime }} {{ t('artikel.readTimeUnit') }}</p>
        <h2 class="post__title">{{ post.title }}</h2>
        <p class="post__excerpt">{{ post.excerpt }}</p>
      </div>

      <div v-if="post.mainImage" class="post__img-wrap">
        <img
          :src="urlFor(post.mainImage).width(1200).url()"
          :alt="post.mainImage.alt || post.title"
        />
      </div>

      <div class="post__content">
        <PortableText v-if="post.body" :value="post.body" />
      </div>

      <ArticleFaqBlock v-if="post.faq?.length" :items="post.faq" />

      <RouterLink to="/eventkennis" class="post__back">&larr; {{ t('artikel.backBtn') }}</RouterLink>
    </div>

    <section v-if="recentPosts.length" class="recent section">
      <div class="container">
        <h2 class="recent__title">{{ t('artikel.moreTitle') }}</h2>
        <div class="recent__grid">
          <RouterLink
            v-for="p in recentPosts"
            :key="p._id"
            :to="`/eventkennis/${p.slug.current}`"
            class="recent__card"
          >
            <div v-if="p.mainImage" class="recent__img-wrap">
              <img :src="urlFor(p.mainImage).width(600).url()" :alt="p.title" loading="lazy" />
            </div>
            <div class="recent__body">
              <h3 class="recent__card-title">{{ p.title }}</h3>
              <span class="recent__read">{{ t('artikel.readMore') }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.kb-hero {
  position: relative;
  min-height: 45vh;
  display: flex;
  align-items: center;
}

.kb-hero__bg {
  position: absolute;
  inset: 0;
}

.kb-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.kb-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 100%);
}

.kb-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 3rem;
  max-width: 680px;
}

.kb-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.15;
}

.kb-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  line-height: 1.75;
  margin-bottom: 1.5rem;
}

.kb-hero__back {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  transition: color 0.2s;
}
.kb-hero__back:hover { color: #fff; }

.post-state { padding-top: 5rem; text-align: center; color: var(--color-text-muted); }

.post-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.post__wrap {
  padding-top: 3rem;
  padding-bottom: 5rem;
  max-width: 860px;
}

.post__header {
  margin-bottom: 2.5rem;
}

.post__author {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.post__meta {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.post__title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}

.post__excerpt {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  border-left: 3px solid var(--color-accent);
  padding-left: 1.25rem;
}

.post__img-wrap {
  margin-bottom: 2.5rem;
  border-radius: var(--radius);
  overflow: hidden;
}

.post__img-wrap img {
  width: 100%;
  height: auto;
  display: block;
}

.post__content { line-height: 1.8; font-size: 1rem; color: var(--color-text); }
:deep(.post__content p) { margin-bottom: 1.25rem; }
:deep(.post__content h2) { font-size: 1.5rem; font-weight: 700; margin: 2.5rem 0 0.75rem; }
:deep(.post__content h3) { font-size: 1.2rem; font-weight: 700; margin: 2rem 0 0.5rem; }
:deep(.post__content strong) { color: var(--color-accent); font-weight: 700; }
:deep(.post__content img) { width: 100%; border-radius: var(--radius); margin: 1.5rem 0; }

.post__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-accent);
}
.post__back:hover { color: var(--color-accent-hover); }

.recent__title {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 800;
  margin-bottom: 2rem;
}

.recent__grid {
  columns: 3;
  column-gap: 1.5rem;
}

.recent__card {
  display: block;
  break-inside: avoid;
  margin-bottom: 1.5rem;
  background: rgba(255,255,255,0.15);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.2s;
}
.recent__card:hover { transform: translateY(-3px); }

.recent__img-wrap img {
  width: 100%;
  height: auto;
  display: block;
}

.recent__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent__card-title { font-size: 0.95rem; font-weight: 700; line-height: 1.3; color: var(--color-text); }
.recent__read { font-size: 0.85rem; font-weight: 600; color: var(--color-accent); }

@media (max-width: 900px) { .recent__grid { columns: 2; } }
@media (max-width: 600px) { .recent__grid { columns: 1; } }
</style>
