import { createI18n } from 'vue-i18n'
import nl from './locales/nl'
import en from './locales/en'

function storedLang(): string | null {
  try {
    return localStorage.getItem('lang')
  } catch {
    return null
  }
}

function initialLocale() {
  if (typeof window === 'undefined') return 'nl'
  if (window.location.pathname.startsWith('/en/')) return 'en'
  return storedLang() || 'nl'
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'nl',
  messages: { nl, en },
})
