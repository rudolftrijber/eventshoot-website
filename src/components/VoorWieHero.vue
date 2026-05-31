<script setup lang="ts">
import { RouterLink } from 'vue-router'
import OptimizedImage from '@/components/OptimizedImage.vue'

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
  >
    <template v-if="image">
      <div class="voor-hero__bg">
        <OptimizedImage
          :src="image"
          alt=""
          preset="hero"
          decorative
          img-class="voor-hero__bg-img"
          :priority="true"
        />
      </div>
      <div class="voor-hero__overlay" />
    </template>
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
  padding-top: 0;
  min-height: 70vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.voor-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.voor-hero__bg :deep(img),
.voor-hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.voor-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1;
}
.voor-hero__content {
  position: relative;
  z-index: 2;
  padding-top: 9rem;
  padding-bottom: 5rem;
}
</style>
