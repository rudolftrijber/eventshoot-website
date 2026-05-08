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

      <a href="tel:+31625177728" class="navbar__phone">06 251 77728</a>

      <button class="navbar__burger" @click="menuOpen = !menuOpen" :aria-label="menuOpen ? 'Menu sluiten' : 'Menu openen'">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  transition: background var(--transition), box-shadow var(--transition);
}

.navbar--scrolled {
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 0 var(--color-border);
}

.navbar__inner {
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 70px;
}

.navbar__logo {
  flex-shrink: 0;
}

.navbar__logo-img {
  height: 36px;
  width: auto;
}

.navbar__logo-text {
  font-size: 1.25rem;
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
  color: var(--color-text-muted);
  border-radius: 6px;
  transition: color var(--transition), background var(--transition);
}

.navbar__link:hover,
.navbar__link--active {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.06);
}

.navbar__link--active {
  color: var(--color-accent);
}

.navbar__phone {
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
  white-space: nowrap;
  transition: color var(--transition);
}

.navbar__phone:hover {
  color: var(--color-accent-hover);
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

  .navbar__phone {
    display: none;
  }

  .navbar__nav {
    display: none;
    position: fixed;
    top: 70px;
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
