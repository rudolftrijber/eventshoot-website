<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navLinks = [
  { label: 'Eventfotografie', to: '/eventfotografie' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Eventvideo', to: '/eventvideo' },
  { label: 'Tarieven', to: '/tarieven' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]
</script>

<template>
  <div class="topbar">
    <a href="tel:+31625177728" class="topbar__phone">
      Vragen? Bel Rolf &mdash; 06 251 777 28
    </a>
  </div>

  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="container navbar__inner">
      <RouterLink to="/" class="navbar__logo" @click="menuOpen = false">
        <img src="/logo.svg" alt="Eventshoot.nl" class="navbar__logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
        <span class="navbar__logo-text" style="display:none">Eventshoot.nl</span>
      </RouterLink>

      <nav class="navbar__nav" :class="{ 'navbar__nav--open': menuOpen }">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="navbar__link"
          :class="{ 'navbar__link--active': route.path.startsWith(link.to) }"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <button class="navbar__burger" @click="menuOpen = !menuOpen" :aria-label="menuOpen ? 'Menu sluiten' : 'Menu openen'">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
/* ── Topbalk ────────────────────────────────────────────── */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
  background: rgba(49, 159, 232, 0.70);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(49, 159, 232, 0.40);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
}

.topbar__phone {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.02em;
  transition: color var(--transition), text-shadow var(--transition);
  text-decoration: none;
}

.topbar__phone:hover {
  color: #ffffff;
  text-shadow: 0 0 14px rgba(255, 255, 255, 0.8);
}

/* ── Navbar ─────────────────────────────────────────────── */
.navbar {
  position: fixed;
  top: 36px;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 5, 0.45);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.navbar__inner {
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 76px;
}

.navbar__logo {
  flex-shrink: 0;
}

.navbar__logo-img {
  height: 64px;
  width: auto;
}

.navbar__logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
}

.navbar__link {
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #ffffff;
  border-radius: 6px;
  transition: color var(--transition);
}

.navbar__link:hover {
  color: var(--color-accent);
}

.navbar__link--active {
  color: var(--color-blue);
}

.navbar__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
}

.navbar__burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all var(--transition);
}

@media (max-width: 768px) {
  .navbar__burger {
    display: flex;
  }

  .navbar__nav {
    display: none;
    position: fixed;
    top: 112px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-bg);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-left: 0;
  }

  .navbar__nav--open {
    display: flex;
  }

  .navbar__link {
    font-size: 1.25rem;
    padding: 0.75rem 2rem;
  }
}
</style>
