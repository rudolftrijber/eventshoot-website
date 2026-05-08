<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}>()
</script>

<template>
  <div class="section-heading" :class="`section-heading--${align ?? 'center'}`">
    <h2 class="section-heading__title">{{ title }}</h2>
    <p v-if="subtitle" class="section-heading__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.section-heading {
  margin-bottom: 3rem;
}

.section-heading--center {
  text-align: center;
}

.section-heading__title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.section-heading__subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 600px;
}

.section-heading--center .section-heading__subtitle {
  margin: 0 auto;
}
</style>
