<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SanityFaqItem } from '@/lib/sanity'

const props = defineProps<{
  items: SanityFaqItem[]
}>()

const { t } = useI18n()

const schemaId = 'eventkennis-faq-schema'

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: props.items.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}))

function upsertSchema() {
  let el = document.getElementById(schemaId) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = schemaId
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(jsonLd.value)
}

function removeSchema() {
  document.getElementById(schemaId)?.remove()
}

onMounted(upsertSchema)
onUnmounted(removeSchema)
</script>

<template>
  <section v-if="items.length" class="article-faq section">
    <div class="container article-faq__inner">
      <h2 class="article-faq__title">{{ t('artikel.faqTitle') }}</h2>
      <dl class="article-faq__list">
        <div v-for="(item, i) in items" :key="i" class="article-faq__item">
          <dt class="article-faq__q">{{ item.question }}</dt>
          <dd class="article-faq__a">{{ item.answer }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.article-faq__inner {
  max-width: 860px;
}

.article-faq__title {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.article-faq__list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.article-faq__item {
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
}

.article-faq__q {
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.35;
}

.article-faq__a {
  color: var(--color-text-muted);
  line-height: 1.7;
  margin: 0;
}
</style>
