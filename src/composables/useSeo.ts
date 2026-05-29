interface SeoOptions {
  title: string
  description: string
  image?: string
  url?: string
}

const BASE_URL = 'https://eventshoot.nl'
const DEFAULT_IMAGE = 'https://eventshoot.nl/wp-content/uploads/2026/03/eventshoot-50-1-scaled.jpg'

export function useSeo(options: SeoOptions) {
  const { title, description, image = DEFAULT_IMAGE, url = BASE_URL } = options

  document.title = title

  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:image', image)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:locale', 'nl_NL')
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', image)
  setCanonical(url)
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}
