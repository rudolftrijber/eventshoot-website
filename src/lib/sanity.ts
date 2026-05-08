import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2026-05-08',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt: string
  mainImage: SanityImageSource & { alt?: string }
  readTime: number
  body: unknown[]
}

export const postsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, slug, publishedAt, excerpt, mainImage, readTime
}`

export const postBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, publishedAt, excerpt, mainImage, readTime, body
}`
