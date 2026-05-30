import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { client, alternateSlugQuery } from '@/lib/sanity'
import {
  contentLocaleFromPath,
  eventkennisArticlePath,
  eventkennisListPath,
  isEventkennisRoute,
  type ContentLocale,
} from '@/lib/eventkennisPaths'

export function useEventkennisLangSwitch() {
  const router = useRouter()
  const route = useRoute()
  const { locale } = useI18n()

  async function switchContentLang(target: ContentLocale) {
    locale.value = target
    localStorage.setItem('lang', target)
    document.documentElement.lang = target

    if (!isEventkennisRoute(route.path)) return

    const currentContentLocale = contentLocaleFromPath(route.path)

    if (route.params.slug && typeof route.params.slug === 'string') {
      const slug = route.params.slug
      if (target === currentContentLocale) return

      try {
        const result = await client.fetch<{ alternate?: { slug: { current: string }; language: ContentLocale } | null }>(
          alternateSlugQuery,
          { slug, lang: currentContentLocale },
        )
        if (result?.alternate?.slug?.current) {
          await router.push(eventkennisArticlePath(target, result.alternate.slug.current))
          return
        }
      } catch {
        // fall through to overview
      }
      await router.push(eventkennisListPath(target))
      return
    }

    await router.push(eventkennisListPath(target))
  }

  return { switchContentLang }
}
