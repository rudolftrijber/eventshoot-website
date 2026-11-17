<script setup lang="ts">
import type { PortableTextComponentProps } from '@portabletext/vue'

defineProps<
  PortableTextComponentProps<{
    items?: { _key?: string; label: string; href: string }[]
  }>
>()
</script>

<template>
  <div v-if="value.items?.length" class="article-downloads">
    <a
      v-for="(item, i) in value.items"
      :key="item._key || item.href"
      :href="item.href"
      class="btn"
      :class="i === 0 ? 'btn--primary' : 'btn--outline'"
      target="_blank"
      rel="noopener noreferrer"
    >{{ item.label }}</a>
  </div>
</template>

<style scoped>
.article-downloads {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0.25rem 0 1.75rem;
}

.article-downloads a.btn {
  white-space: normal;
  text-align: center;
  text-decoration: none;
  color: #fff;
}

.article-downloads a.btn--outline {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.55);
}

.article-downloads a.btn--outline:hover {
  color: #fff;
}
</style>
