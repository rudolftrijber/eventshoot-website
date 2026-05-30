<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchFaqForPage, urlFor, type SanitySiteFaqItem } from '@/lib/sanity'
import type { FaqPageKey } from '@/lib/faqPages'

export interface FaqFallbackItem {
  question: string
  answer: string
}

const props = defineProps<{
  page: FaqPageKey
  fallback?: FaqFallbackItem[]
  subtitle?: string
}>()

const { t, locale } = useI18n()

const items = ref<SanitySiteFaqItem[]>([])
const loading = ref(true)
const fromSanity = ref(false)
const openIndex = ref<number | null>(0)

const displayItems = computed(() => {
  if (fromSanity.value && items.value.length) return items.value
  if (props.fallback?.length) {
    return props.fallback.map((item, i) => ({
      _id: `fallback-${i}`,
      question: item.question,
      answer: item.answer,
      image: null,
    }))
  }
  return []
})

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

const schemaId = computed(() => `faq-schema-${props.page}`)

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: displayItems.value.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}))

function upsertSchema() {
  if (!displayItems.value.length) return
  let el = document.getElementById(schemaId.value) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = schemaId.value
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(jsonLd.value)
}

function removeSchema() {
  document.getElementById(schemaId.value)?.remove()
}

async function load() {
  loading.value = true
  try {
    const result = await fetchFaqForPage(props.page, locale.value)
    items.value = result
    fromSanity.value = result.length > 0
  } catch {
    items.value = []
    fromSanity.value = false
  } finally {
    loading.value = false
    upsertSchema()
  }
}

onMounted(load)
onUnmounted(removeSchema)
watch(locale, load)
watch(displayItems, upsertSchema, { deep: true })
</script>

<template>
  <section v-if="!loading && displayItems.length" class="faq-block section">
    <div class="container faq-block__grid">

      <!-- Links: titel -->
      <div class="faq-block__left">
        <h2 class="faq-block__title">{{ t('faq.title') }}</h2>
        <p v-if="subtitle" class="faq-block__sub">{{ subtitle }}</p>
      </div>

      <!-- Rechts: accordion -->
      <div class="faq-block__right">
        <div
          v-for="(item, i) in displayItems"
          :key="item._id"
          class="faq-item"
          :class="{ 'faq-item--open': openIndex === i }"
        >
          <button class="faq-item__trigger" @click="toggle(i)">
            <span class="faq-item__q">{{ item.question }}</span>
            <span class="faq-item__arrow" :class="{ 'faq-item__arrow--open': openIndex === i }">›</span>
          </button>
          <div class="faq-item__body" :class="{ 'faq-item__body--open': openIndex === i }">
            <div class="faq-item__inner">
              <p class="faq-item__a">{{ item.answer }}</p>
              <figure v-if="item.image?.asset" class="faq-item__figure">
                <img
                  :src="urlFor(item.image).width(800).url()"
                  :alt="item.image.alt || item.question"
                  loading="lazy"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.faq-block {
  background: rgba(255, 140, 0, 0.42) !important;
}

.faq-block__grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 5rem;
  align-items: center;
}

.faq-block__left {
  position: sticky;
  top: 8rem;
}

.faq-block__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.25rem;
}

.faq-block__sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.75;
}

/* Accordion items */
.faq-item {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.faq-item:first-child {
  border-top: 1px solid rgba(255,255,255,0.1);
}

.faq-item__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 1.25rem 0;
  text-align: left;
}

.faq-item__q {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  line-height: 1.4;
  transition: color 0.2s;
}

.faq-item--open .faq-item__q {
  color: var(--color-accent);
}

.faq-item__arrow {
  font-size: 1.5rem;
  color: var(--color-accent);
  flex-shrink: 0;
  line-height: 1;
  transition: transform 0.25s ease;
  display: inline-block;
}

.faq-item__arrow--open {
  transform: rotate(90deg);
}

/* Animating body */
.faq-item__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
  overflow: hidden;
}

.faq-item__body--open {
  grid-template-rows: 1fr;
}

.faq-item__inner {
  overflow: hidden;
}

.faq-item__a {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.75;
  padding-bottom: 1.25rem;
  margin: 0;
}

.faq-item__figure {
  margin: 0 0 1.25rem;
}

.faq-item__figure img {
  width: 100%;
  max-width: 480px;
  border-radius: var(--radius);
  display: block;
}

@media (max-width: 768px) {
  .faq-block__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .faq-block__left {
    position: static;
  }
}
</style>
