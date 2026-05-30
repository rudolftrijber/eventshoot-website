import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/eventfotografie', name: 'eventfotografie', component: () => import('../views/EventfotografieView.vue') },
    { path: '/eventvideo', name: 'eventvideo', component: () => import('../views/EventvideoView.vue') },
    { path: '/werk', name: 'werk', component: () => import('../views/WerkView.vue') },
    { path: '/werk/:slug', redirect: '/werk' },
    { path: '/tarieven', name: 'tarieven', component: () => import('../views/TarievenView.vue') },
    { path: '/eventkennis', name: 'eventkennis', component: () => import('../views/EventkennisView.vue') },
    { path: '/eventkennis/:slug', name: 'eventkennis-artikel', component: () => import('../views/EventkennisArtikelView.vue') },
    { path: '/over-rolf', name: 'over-rolf', component: () => import('../views/OverRolfView.vue') },
    { path: '/kennismaken', name: 'kennismaken', component: () => import('../views/KennismakenView.vue') },
    { path: '/voor/brancheverenigingen', name: 'voor-brancheverenigingen', component: () => import('../views/VoorBrancheverenigingenView.vue') },
    { path: '/voor/eventbureaus', name: 'voor-eventbureaus', component: () => import('../views/VoorEventbureausView.vue') },
    { path: '/voor/hotels', name: 'voor-hotels', component: () => import('../views/VoorHotelsView.vue') },
    { path: '/voor/bedrijven', name: 'voor-bedrijven', component: () => import('../views/VoorBedrijvenView.vue') },
    { path: '/gallery', name: 'gallery', component: () => import('../views/GalleryView.vue') },
    { path: '/privacy', name: 'privacy', component: () => import('../views/PrivacyView.vue') },
    // Redirects voor oude URL's
    { path: '/portfolio', redirect: '/werk' },
    { path: '/blog', redirect: '/eventkennis' },
    { path: '/blog/:slug', redirect: to => `/eventkennis/${to.params.slug}` },
    { path: '/contact', redirect: '/kennismaken' },
    // Client delivery (aparte functie, geen werk-case)
    { path: '/klanten/:slug', name: 'klant', component: () => import('../views/LeontineView.vue') },
    { path: '/leontine', name: 'leontine', component: () => import('../views/LeontineView.vue') },
  ],
})

export default router
