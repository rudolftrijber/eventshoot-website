<script setup lang="ts">
import { computed } from 'vue'
import {
  optSrcSet,
  optFallbackSrc,
  presetWidths,
  presetSizes,
  stripImageQuery,
  type ImagePreset,
} from '@/lib/imageUrls'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    preset?: ImagePreset
    sizes?: string
    priority?: boolean
    width?: number | string
    height?: number | string
    decorative?: boolean
    imgClass?: string
  }>(),
  {
    preset: 'content',
    priority: false,
    decorative: false,
  },
)

const srcset = computed(() => optSrcSet(props.src, presetWidths(props.preset)))
const fallbackSrc = computed(() => optFallbackSrc(props.src, props.preset))
const sizesAttr = computed(() => props.sizes ?? presetSizes(props.preset))
const originalSrc = computed(() => stripImageQuery(props.src))
</script>

<template>
  <picture>
    <source type="image/webp" :srcset="srcset" :sizes="sizesAttr" />
    <img
      :src="fallbackSrc"
      :alt="decorative ? '' : alt"
      :width="width"
      :height="height"
      :class="imgClass"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      @error="($event.target as HTMLImageElement).src = originalSrc"
    />
  </picture>
</template>
