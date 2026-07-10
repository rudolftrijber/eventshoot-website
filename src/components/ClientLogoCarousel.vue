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
            loading="lazy"
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
}

.trust__label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 1.5rem;
}

.trust__track-wrap {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.trust__track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}

.trust__track:hover {
  animation-play-state: paused;
}

.trust__slide {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 0 2rem;
}

.trust__logo {
  height: 120px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
