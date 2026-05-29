<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  title: string
  items: string[]
  ctaLabel?: string
  ctaTo?: string
}>()
</script>

<template>
  <section class="waarom section">
    <div class="container">
      <h2 class="waarom__title">{{ title }}</h2>
      <ul class="waarom__list">
        <li v-for="item in items" :key="item">
          <span class="waarom__check">✓</span>{{ item }}
        </li>
      </ul>

      <RouterLink
        v-if="ctaLabel && ctaTo"
        :to="ctaTo"
        class="btn btn--primary"
        style="margin-top:2rem; display:inline-flex"
      >
        {{ ctaLabel }}
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.waarom__title { font-size: clamp(1.3rem, 2.5vw, 1.85rem); font-weight: 800; margin-bottom: 1.5rem; }
.waarom__list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; max-width: 780px; }
.waarom__list li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.95rem; color: rgba(255,255,255,0.85); line-height: 1.55; }
.waarom__check { color: var(--color-accent); font-weight: 700; flex-shrink: 0; }
</style>
