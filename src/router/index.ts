import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/eventfotografie', name: 'eventfotografie', component: () => import('../views/EventfotografieView.vue') },
    { path: '/portfolio', name: 'portfolio', component: () => import('../views/PortfolioView.vue') },
    { path: '/eventvideo', name: 'eventvideo', component: () => import('../views/EventvideoView.vue') },
    { path: '/tarieven', name: 'tarieven', component: () => import('../views/TarievenView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
    { path: '/blog', name: 'blog', component: () => import('../views/BlogView.vue') },
    { path: '/blog/:slug', name: 'blog-post', component: () => import('../views/BlogPostView.vue') },
  ],
})

export default router
