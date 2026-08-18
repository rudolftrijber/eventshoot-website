import { createI18n } from 'vue-i18n'
import nl from './locales/nl'
import en from './locales/en'

function initialLocale() {
  if (typeof window === 'undefined') return 'nl'
  if (window.location.pathname.startsWith('/en/')) return 'en'
  return localStorage.getItem('lang') || 'nl'
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'nl',
  messages: { nl, en },
})
