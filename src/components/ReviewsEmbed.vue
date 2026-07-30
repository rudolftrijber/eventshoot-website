<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { mountElfsightWidget } from '@/lib/elfsight'

const WIDGET_ID = '4ed38ed1-21e2-4238-bb5c-d1127391e146'

const host = ref<HTMLElement | null>(null)
let cancelled = false

onMounted(async () => {
  cancelled = false
  if (!host.value) return
  await mountElfsightWidget(host.value, WIDGET_ID)
  if (cancelled && host.value) host.value.replaceChildren()
})

onUnmounted(() => {
  cancelled = true
  host.value?.replaceChildren()
})
</script>

<template>
  <div ref="host" class="reviews-embed" aria-label="Google reviews"></div>
</template>

<style scoped>
.reviews-embed {
  width: 100%;
  min-height: 120px;
  border: none;
  box-shadow: none;
}

.reviews-embed :deep(.elfsight-app),
.reviews-embed :deep([class*='elfsight-app']) {
  border: none !important;
  box-shadow: none !important;
}
</style>
