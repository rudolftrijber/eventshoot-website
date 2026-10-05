import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory, RouterView } from 'vue-router'
import InterviewAppView from './views/InterviewAppView.vue'
import './assets/main.css'

const interviewMeta = { hideLayout: true, hideBackgroundVideo: true }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/interview.html', component: InterviewAppView, meta: interviewMeta },
    { path: '/interview-app', component: InterviewAppView, meta: interviewMeta },
    { path: '/interview-app/live', component: InterviewAppView, meta: { ...interviewMeta, floorMode: true } },
    { path: '/interview-app/live/:floorKey', component: InterviewAppView, meta: { ...interviewMeta, floorMode: true } },
  ],
})

const Root = {
  render: () => h('div', { class: 'interview-root' }, [h(RouterView)]),
}

function reportBootError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  let box = document.getElementById('boot-error')
  if (!box) {
    box = document.createElement('p')
    box.id = 'boot-error'
    ;(document.getElementById('app') || document.body).prepend(box)
  }
  box.hidden = false
  box.textContent = 'De interview-app startte niet: ' + message
}

try {
  const app = createApp(Root)
  app.config.errorHandler = (err) => {
    console.error(err)
    reportBootError(err)
  }
  app.use(createPinia())
  app.use(router)
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
