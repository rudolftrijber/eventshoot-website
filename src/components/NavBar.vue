<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)
const expanded = ref<string | null>(null)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

function isDesktop() {
  return window.innerWidth > 900
}

function onMouseEnter(name: string) {
  if (isDesktop()) expanded.value = name
}

function onMouseLeave() {
  if (isDesktop()) expanded.value = null
}

function toggleSection(name: string) {
  expanded.value = expanded.value === name ? null : name
}

function closeMenu() {
  menuOpen.value = false
  expanded.value = null
}

function onDocClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.dd')) expanded.value = null
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  document.addEventListener('mousedown', onDocClick)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('mousedown', onDocClick)
})

const diensten = [
  { label: 'Eventfotografie', to: '/eventfotografie' },
  { label: 'Eventvideo', to: '/eventvideo' },
]
const voorWie = [
  { label: 'Brancheverenigingen', to: '/voor/brancheverenigingen' },
  { label: "Eventbureaus & DMC's", to: '/voor/eventbureaus' },
  { label: 'Hotels met congresfaciliteiten', to: '/voor/hotels' },
  { label: 'Bedrijven met eigen events', to: '/voor/bedrijven' },
]
const over = [
  { label: 'Over Rolf', to: '/over-rolf' },
  { label: 'Eventkennis', to: '/eventkennis' },
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
      <RouterLink to="/" class="navbar__logo" @click="closeMenu">
        <img src="/logo.svg" alt="Eventshoot.nl" class="navbar__logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
        <span class="navbar__logo-text" style="display:none">Eventshoot.nl</span>
      </RouterLink>

      <nav class="navbar__nav" :class="{ 'navbar__nav--open': menuOpen }">

        <!-- Diensten -->
        <div class="dd" @mouseenter="onMouseEnter('diensten')" @mouseleave="onMouseLeave">
          <button class="navbar__link dd__trigger" :class="{ 'navbar__link--active': route.path.startsWith('/eventfotografie') || route.path.startsWith('/eventvideo') }" @click="toggleSection('diensten')">
            Diensten <span class="dd__arrow">▾</span>
          </button>
          <div class="dd__panel" :class="{ 'dd__panel--open': expanded === 'diensten' }">
            <RouterLink v-for="item in diensten" :key="item.to" :to="item.to" class="dd__link" @click="closeMenu">{{ item.label }}</RouterLink>
          </div>
        </div>

        <!-- Voor wie -->
        <div class="dd" @mouseenter="onMouseEnter('voor')" @mouseleave="onMouseLeave">
          <button class="navbar__link dd__trigger" :class="{ 'navbar__link--active': route.path.startsWith('/voor') }" @click="toggleSection('voor')">
            Voor wie <span class="dd__arrow">▾</span>
          </button>
          <div class="dd__panel" :class="{ 'dd__panel--open': expanded === 'voor' }">
            <RouterLink v-for="item in voorWie" :key="item.to" :to="item.to" class="dd__link" @click="closeMenu">{{ item.label }}</RouterLink>
          </div>
        </div>

        <!-- Werk -->
        <RouterLink to="/werk" class="navbar__link" :class="{ 'navbar__link--active': route.path.startsWith('/werk') }" @click="closeMenu">Werk</RouterLink>

        <!-- Tarieven -->
        <RouterLink to="/tarieven" class="navbar__link" :class="{ 'navbar__link--active': route.path === '/tarieven' }" @click="closeMenu">Tarieven</RouterLink>

        <!-- Over -->
        <div class="dd" @mouseenter="onMouseEnter('over')" @mouseleave="onMouseLeave">
          <button class="navbar__link dd__trigger" :class="{ 'navbar__link--active': route.path.startsWith('/over') || route.path.startsWith('/eventkennis') }" @click="toggleSection('over')">
            Over <span class="dd__arrow">▾</span>
          </button>
          <div class="dd__panel" :class="{ 'dd__panel--open': expanded === 'over' }">
            <RouterLink v-for="item in over" :key="item.to" :to="item.to" class="dd__link" @click="closeMenu">{{ item.label }}</RouterLink>
          </div>
        </div>

        <!-- CTA -->
        <RouterLink to="/kennismaken" class="navbar__cta" @click="closeMenu">Kennismaken</RouterLink>

      </nav>

      <button class="navbar__burger" @click="menuOpen = !menuOpen; expanded = null" :aria-label="menuOpen ? 'Menu sluiten' : 'Menu openen'">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
/* ── Topbalk ────────────────────────────────────────────── */
.topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
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
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: text-shadow var(--transition);
}
.topbar__phone:hover { text-shadow: 0 0 14px rgba(255,255,255,0.8); }

/* ── Navbar ─────────────────────────────────────────────── */
.navbar {
  position: fixed;
  top: 36px; left: 0; right: 0;
  z-index: 100;
  background: rgba(0, 0, 5, 0.45);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.navbar__inner {
  display: flex;
  align-items: center;
  height: 76px;
  gap: 0.25rem;
}

.navbar__logo { flex-shrink: 0; margin-right: 1.5rem; }
.navbar__logo-img { height: 44px; width: auto; }
.navbar__logo-text { font-size: 1.4rem; font-weight: 700; color: var(--color-text); }

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  margin-left: auto;
}

.navbar__link {
  padding: 0.4rem 0.6rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--transition);
}
.navbar__link:hover { color: var(--color-accent); }
.navbar__link--active { color: var(--color-blue); }

/* ── Dropdown ───────────────────────────────────────────── */
.dd { position: relative; }

.dd__trigger { display: flex; align-items: center; gap: 0.25rem; }
.dd__arrow { font-size: 0.85rem; opacity: 0.7; }

.dd__panel {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: rgba(8, 8, 18, 0.97);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 0.5rem;
  min-width: 220px;
  z-index: 200;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
}

.dd__panel--open { display: flex; flex-direction: column; }

.dd__panel::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
}

.dd__link {
  padding: 0.6rem 0.9rem;
  font-size: 0.875rem;
  color: rgba(255,255,255,0.8);
  border-radius: 6px;
  transition: background var(--transition), color var(--transition);
  white-space: nowrap;
}
.dd__link:hover { background: rgba(255,255,255,0.06); color: #fff; }

/* ── CTA ────────────────────────────────────────────────── */
.navbar__cta {
  margin-left: 0.75rem;
  padding: 0.5rem 1.25rem;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 8px;
  white-space: nowrap;
  transition: background var(--transition), transform var(--transition);
}
.navbar__cta:hover { background: var(--color-accent-hover); transform: translateY(-1px); }

/* ── Burger ─────────────────────────────────────────────── */
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
  display: block; width: 24px; height: 2px;
  background: var(--color-text); border-radius: 2px;
  transition: all var(--transition);
}

/* ── Mobile ─────────────────────────────────────────────── */
@media (max-width: 900px) {
  .navbar__burger { display: flex; }

  .navbar__nav {
    display: none;
    position: fixed;
    top: 112px; left: 0; right: 0; bottom: 0;
    background: var(--color-bg);
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    margin-left: 0;
    overflow-y: auto;
    padding: 1rem 0 4rem;
  }

  .navbar__nav--open { display: flex; }

  .navbar__link {
    font-size: 1.1rem;
    padding: 1rem 2rem;
    border-radius: 0;
    text-align: left;
  }

  .dd { width: 100%; }
  .dd__trigger { width: 100%; justify-content: space-between; }

  .dd__panel {
    position: static;
    border: none;
    border-radius: 0;
    background: rgba(255,255,255,0.04);
    box-shadow: none;
    padding: 0;
    min-width: unset;
  }
  .dd__panel::before { display: none; }

  .dd__link {
    padding: 0.75rem 3rem;
    border-radius: 0;
    font-size: 1rem;
  }

  .navbar__cta {
    margin: 1.5rem 2rem 0;
    text-align: center;
    padding: 0.9rem 2rem;
    font-size: 1rem;
    border-radius: 10px;
  }
}
</style>
