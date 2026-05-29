<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  label: string
  title: string
  sub: string
  ctaLabel: string
  ctaTo: string
  image?: string
}>()
</script>

<template>
  <section
    class="voor-hero section"
    :class="{ 'voor-hero--with-image': image }"
    :style="image ? { backgroundImage: `url(${image})` } : {}"
  >
    <div class="voor-hero__overlay" v-if="image" />
    <div class="container voor-hero__content">
      <p class="voor-hero__label">{{ label }}</p>
      <h1 class="voor-hero__h1">{{ title }}</h1>
      <p class="voor-hero__sub">{{ sub }}</p>
      <RouterLink :to="ctaTo" class="btn btn--primary btn--lg">{{ ctaLabel }}</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.voor-hero { padding-top: 9rem; }
.voor-hero__label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.75rem; }
.voor-hero__h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 1.25rem; }
.voor-hero__sub { font-size: 1.05rem; color: rgba(255,255,255,0.75); line-height: 1.75; max-width: 720px; margin-bottom: 2rem; }

.voor-hero--with-image {
  position: relative;
  background-size: cover;
  background-position: center;
  padding-top: 0;
  min-height: 70vh;
  display: flex;
  align-items: center;
}
.voor-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}
.voor-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 9rem;
  padding-bottom: 5rem;
}
</style>
