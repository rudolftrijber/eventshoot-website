<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getVideoEmbed, type KlantVideo } from '@/lib/videoEmbed'

const props = defineProps<{
  video: KlantVideo
}>()

const pending = computed(() => !props.video.url)
const embed = computed(() => (pending.value ? null : getVideoEmbed(props.video)))
const scriptHost = ref<HTMLElement | null>(null)
let scriptEl: HTMLScriptElement | null = null

onMounted(() => {
  if (!embed.value || embed.value.kind !== 'script' || !scriptHost.value) return

  scriptEl = document.createElement('script')
  scriptEl.type = 'text/javascript'
  scriptEl.src = embed.value.src
  scriptEl.async = true
  scriptHost.value.appendChild(scriptEl)
})

onUnmounted(() => {
  scriptEl?.remove()
  scriptEl = null
})

function onIframeLoad(event: Event) {
  const iframe = event.target as HTMLIFrameElement
  if (!iframe.src.includes('bbvms.com')) return
  if (iframe.src.includes('#!referrer=')) return
  iframe.src += `#!referrer=${encodeURIComponent(location.href)}&realReferrer=${encodeURIComponent(document.referrer)}`
}
</script>

<template>
  <div class="klant-video__frame" :class="{ 'klant-video__frame--pending': pending }">
    <p v-if="pending" class="klant-video__pending">Deze video volgt.</p>
    <iframe
      v-else-if="embed && (embed.kind === 'vimeo' || embed.kind === 'iframe')"
      :src="embed.src"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      @load="onIframeLoad"
    />
    <div v-else-if="embed?.kind === 'script'" ref="scriptHost" class="klant-video__script" />
    <a
      v-else-if="embed?.kind === 'link'"
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

.klant-video__frame--pending {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
}

.klant-video__pending {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.klant-video__frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.klant-video__script {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.klant-video__script :deep(iframe) {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
