import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { TypedObject } from '@portabletext/types'
import type { FaqPageKey } from '@/lib/faqPages'
import { getFaqForPage } from '@/lib/siteFaq'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'pn3eisnr',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2026-05-08',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: object) {
  return builder.image(source)
}

export function isSanityConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SANITY_PROJECT_ID || 'pn3eisnr')
}

export interface ArticleFaqItem {
  question: string
  answer: string
}

export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt: string
  mainImage: { asset: object; alt?: string } | null
  readTime: number
  body?: TypedObject[]
  faq?: ArticleFaqItem[]
}

export interface SanitySiteFaqItem {
  _id: string
  question: string
  answer: string
  image?: {
    asset: object
    alt?: string
  } | null
}

const postFields = `_id, title, slug, publishedAt, excerpt, mainImage, readTime`

export const postsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  ${postFields}
}`

export const postBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  ${postFields},
  body,
  faq
}`

export async function fetchFaqForPage(page: FaqPageKey, lang: string): Promise<SanitySiteFaqItem[]> {
  return getFaqForPage(page, lang)
}
