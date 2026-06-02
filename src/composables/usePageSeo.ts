import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'

export type PageSeoKey =
  | 'home'
  | 'eventfotografie'
  | 'eventvideo'
  | 'werk'
  | 'tarieven'
  | 'kennismaken'
  | 'overRolf'
  | 'voorBranche'
  | 'voorBureaus'
  | 'voorHotels'
  | 'voorBedrijven'
  | 'eventkennis'
  | 'privacy'
  | 'gallery'

type PageSeoOptions = {
  url?: string
  image?: string
  /** Altijd NL-meta (bijv. Eventkennis, alleen NL-content). */
  fixedLocale?: 'nl' | 'en'
}

export function usePageSeo(page: PageSeoKey, options: PageSeoOptions = {}) {
  const { t, locale } = useI18n()

  const apply = () => {
    const loc =
      options.fixedLocale ?? (locale.value.startsWith('en') ? 'en' : 'nl')

    useSeo({
      title: t(`seo.${page}.title`),
      description: t(`seo.${page}.description`),
      url: options.url,
      image: options.image,
      locale: loc,
    })
  }

  onMounted(apply)
  watch(locale, apply)
}
