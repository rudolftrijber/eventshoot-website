<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  label: string
  title: string
  sub: string
  ctaLabel: string
  ctaTo: string
}>()
</script>

<template>
  <section class="voor-hero section">
    <div class="container">
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
</style>
