import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { TypedObject } from '@portabletext/types'
import type { ContentLocale } from '@/lib/eventkennisPaths'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2026-05-08',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: object) {
  return builder.image(source)
}

export interface SanityFaqItem {
  question: string
  answer: string
}

export interface SanityPostAlternate {
  slug: { current: string }
  language: ContentLocale
}

export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  language?: ContentLocale
  publishedAt: string
  excerpt: string
  mainImage: { asset: object; alt?: string } | null
  readTime: number
  body?: TypedObject[]
  faq?: SanityFaqItem[]
  alternate?: SanityPostAlternate | null
}

const postFields = `_id, title, slug, language, publishedAt, excerpt, mainImage, readTime`

export const postsQuery = `*[_type == "blogPost" && coalesce(language, "nl") == $lang] | order(publishedAt desc) {
  ${postFields}
}`

export const postBySlugQuery = `*[_type == "blogPost" && slug.current == $slug && coalesce(language, "nl") == $lang][0] {
  ${postFields},
  body,
  faq,
  "alternate": coalesce(
    *[_type == "blogPost" && translationOf._ref == ^._id && coalesce(language, "nl") != coalesce(^.language, "nl")][0]{ slug, language },
    select(defined(translationOf) => translationOf->{ slug, language })
  )
}`

export const alternateSlugQuery = `*[_type == "blogPost" && slug.current == $slug && coalesce(language, "nl") == $lang][0] {
  "alternate": coalesce(
    *[_type == "blogPost" && translationOf._ref == ^._id && coalesce(language, "nl") != coalesce(^.language, "nl")][0]{ slug, language },
    select(defined(translationOf) => translationOf->{ slug, language })
  )
}`
