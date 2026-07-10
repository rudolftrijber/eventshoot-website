import type { FaqPageKey } from '@/lib/faqPages'
import type { SanitySiteFaqItem } from '@/lib/sanity'
import { siteFaqByPage } from '@/data/siteFaq.generated'

export function getFaqForPage(page: FaqPageKey, lang: string): SanitySiteFaqItem[] {
  const langKey = lang.startsWith('en') ? 'en' : 'nl'
  return siteFaqByPage[page]?.[langKey] ?? []
}
