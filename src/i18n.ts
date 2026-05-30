import { createI18n } from 'vue-i18n'
import nl from './locales/nl'
import en from './locales/en'

const saved = localStorage.getItem('lang') || 'nl'

export const i18n = createI18n({
  legacy: false,
  locale: saved,
  fallbackLocale: 'nl',
  messages: { nl, en },
})
