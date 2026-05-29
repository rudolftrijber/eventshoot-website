<script setup lang="ts">
/** Wit overhemd, buiten — evenshoot_Rolf_Trijber.png (niet rolf_trijber_4.jpg) */
const rolfPortrait =
  '/DATA_EVENTSHOOT/SITE_IMAGES/ROLF/evenshoot_Rolf_Trijber.png?v=20260525'
</script>

<template>
  <section class="rolf">
    <div class="rolf__inner">
      <div class="rolf__photo-wrap">
        <img
          :src="rolfPortrait"
          alt="Rolf Trijber, Eventfotograaf"
          class="rolf__photo"
          width="200"
          height="200"
          decoding="async"
        />
      </div>
      <h2 class="rolf__title">Vragen? Bel Rolf</h2>
      <a href="tel:+31625177728" class="rolf__phone">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
        06 251 777 28
      </a>
      <a href="https://www.linkedin.com/in/rolftrijber" target="_blank" rel="noopener" class="rolf__linkedin">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
.rolf {
  padding: 4rem 0;
  background: #cce8fb;
  color: #111;
  border: none;
  outline: none;
  box-shadow: none;
}

.rolf__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.rolf__photo-wrap {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}

.rolf__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
}

.rolf__title {
  font-size: 1.5rem;
  font-weight: 100;
}

.rolf__phone {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
  transition: color var(--transition);
}

.rolf__phone:hover {
  color: var(--color-accent-hover);
}

.rolf__linkedin {
  color: #555;
  transition: color var(--transition);
}

.rolf__linkedin:hover {
  color: var(--color-accent);
}

.rolf__linkedin svg {
  width: 44px;
  height: 44px;
}
</style>
