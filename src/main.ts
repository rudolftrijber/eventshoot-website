import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

import './assets/main.css'
import { isIosLike } from '@/lib/isIosLike'

if (isIosLike()) document.documentElement.classList.add('is-ios')

function reportBootError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  let box = document.getElementById('boot-error')
  if (!box) {
    box = document.createElement('p')
    box.id = 'boot-error'
    const host = document.getElementById('app') || document.body
    host.prepend(box)
  }
  box.hidden = false
  box.textContent = 'De site startte niet: ' + message
}

document.documentElement.setAttribute('data-app', 'booting')

try {
  const app = createApp(App)
  app.config.errorHandler = (err) => {
    console.error(err)
    reportBootError(err)
  }
  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  router.onError((err) => {
    console.error(err)
    reportBootError(err)
  })
  app.mount('#app')
  document.documentElement.setAttribute('data-app', 'ready')
} catch (err) {
  console.error(err)
  reportBootError(err)
}
