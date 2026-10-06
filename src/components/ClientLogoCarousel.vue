<script setup lang="ts">
import { CLIENT_LOGOS, CLIENT_LOGO_BASE_PATH } from '@/data/clientLogos.generated'

defineProps<{
  label: string
}>()
</script>

<template>
  <section class="trust">
    <p class="trust__label">{{ label }}</p>
    <div class="trust__track-wrap">
      <div class="trust__track">
        <div class="trust__slide" v-for="n in 2" :key="n">
          <img
            v-for="logo in CLIENT_LOGOS"
            :key="logo.file + n"
            :src="`${CLIENT_LOGO_BASE_PATH}/${logo.file}`"
            :alt="logo.name"
            class="trust__logo"
            width="600"
            height="300"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust {
  padding: 5rem 0;
  background: transparent;
  overflow: hidden;
  max-width: 100%;
}

.trust__label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 1.5rem;
}

.trust__track-wrap {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.trust__track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
  will-change: transform;
}

@media (hover: hover) and (pointer: fine) {
  .trust__track:hover {
    animation-play-state: paused;
  }
}

.trust__slide {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  gap: 4rem;
  padding: 0 2rem;
}

.trust__logo {
  height: 120px;
  width: 240px;
  max-width: none;
  object-fit: contain;
  flex: 0 0 auto;
}

@keyframes marquee {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
</style>
