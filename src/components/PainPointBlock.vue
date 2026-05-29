<script setup lang="ts">
defineProps<{
  title: string
  items: string[]
}>()
</script>

<template>
  <section class="pijn section section--dark">
    <div class="container">
      <h2 class="pijn__title">{{ title }}</h2>
      <ul class="pijn__list">
        <li v-for="item in items" :key="item">
          <span class="pijn__dot">·</span>{{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.pijn__title { font-size: clamp(1.3rem, 2.5vw, 1.85rem); font-weight: 800; margin-bottom: 1.5rem; }
.pijn__list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; max-width: 780px; }
.pijn__list li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.95rem; color: rgba(255,255,255,0.85); line-height: 1.55; }
.pijn__dot { color: rgba(255,255,255,0.35); font-size: 1.5rem; flex-shrink: 0; line-height: 1; }
</style>
