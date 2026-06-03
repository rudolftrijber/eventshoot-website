import { onUnmounted, watch, type Ref } from 'vue'
import type { SanityPost } from '@/lib/sanity'

const SCHEMA_ID = 'article-schema'
const PUBLISHER_LOGO = 'https://eventshoot.nl/images/logos/logo.svg'

export function useArticleSchema(
  post: Ref<SanityPost | null>,
  articleUrl: Ref<string | undefined>,
  imageUrl?: Ref<string | undefined>,
) {
  function removeSchema() {
    document.getElementById(SCHEMA_ID)?.remove()
  }

  function upsertSchema() {
    const p = post.value
    const url = articleUrl.value
    if (!p || !url) {
      removeSchema()
      return
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: p.title,
      description: p.excerpt,
      url,
      inLanguage: 'nl-NL',
      datePublished: p.publishedAt || undefined,
      author: {
        '@type': 'Person',
        name: 'Rolf Trijber',
        url: 'https://eventshoot.nl/over-rolf',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Eventshoot.nl',
        logo: {
          '@type': 'ImageObject',
          url: PUBLISHER_LOGO,
        },
      },
      ...(imageUrl?.value ? { image: [imageUrl.value] } : {}),
    }

    let el = document.getElementById(SCHEMA_ID) as HTMLScriptElement | null
    if (!el) {
      el = document.createElement('script')
      el.id = SCHEMA_ID
      el.type = 'application/ld+json'
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(schema)
  }

  watch([post, articleUrl, () => imageUrl?.value], upsertSchema, { deep: true })
  onUnmounted(removeSchema)
}
