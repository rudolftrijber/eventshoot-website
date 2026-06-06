<script setup lang="ts">
import { computed } from 'vue'
import { getVideoEmbed, type KlantVideo } from '@/lib/videoEmbed'

const props = defineProps<{
  video: KlantVideo
}>()

const embed = computed(() => getVideoEmbed(props.video))
</script>

<template>
  <div class="klant-video__frame">
    <iframe
      v-if="embed.kind === 'vimeo' || embed.kind === 'iframe'"
      :src="embed.kind === 'vimeo' ? embed.src : embed.src"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    />
    <a
      v-else
      :href="embed.href"
      class="btn btn--primary"
      target="_blank"
      rel="noopener"
    >
      Bekijk video
    </a>
  </div>
</template>

<style scoped>
.klant-video__frame {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  max-width: 900px;
}

.klant-video__frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
