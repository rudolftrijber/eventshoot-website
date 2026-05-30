export type ContentLocale = 'nl' | 'en'

export function contentLocaleFromPath(path: string): ContentLocale {
  return path.startsWith('/en/event-knowledge') ? 'en' : 'nl'
}

export function eventkennisListPath(locale: ContentLocale): string {
  return locale === 'en' ? '/en/event-knowledge' : '/eventkennis'
}

export function eventkennisArticlePath(locale: ContentLocale, slug: string): string {
  return `${eventkennisListPath(locale)}/${slug}`
}

export function isEventkennisRoute(path: string): boolean {
  return path === '/eventkennis'
    || path.startsWith('/eventkennis/')
    || path === '/en/event-knowledge'
    || path.startsWith('/en/event-knowledge/')
}
