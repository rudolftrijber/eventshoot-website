<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInterviewStore } from '@/stores/interviewStore'
import { MAX_PNG_BYTES, PNG_RATIOS, type PngRatioId } from '@/types/interview'

const RATIO_TOLERANCE = 0.08

const props = defineProps<{
  ratio: PngRatioId
  kind: 'production-png' | 'guest-screenshot'
  disabled?: boolean
}>()

const url = defineModel<string>({ default: '' })

const store = useInterviewStore()
const busy = ref(false)
const error = ref('')
const inputId = `png-${props.kind}-${props.ratio}`

const spec = PNG_RATIOS.find((r) => r.id === props.ratio)!
const isOverlay = computed(() => props.kind === 'production-png')
const slotLabel = computed(() =>
  isOverlay.value ? `PNG ${spec.label}` : `Screenshot ${spec.label}`,
)
const accept = computed(() =>
  isOverlay.value ? 'image/png,.png' : 'image/jpeg,image/jpg,.jpg,.jpeg',
)
const idleHint = computed(() => (isOverlay.value ? 'PNG, transparent' : 'JPG still'))

function isAllowedImage(file: File): boolean {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  if (isOverlay.value) {
    return type === 'image/png' || name.endsWith('.png')
  }
  return type === 'image/jpeg' || type === 'image/jpg' || name.endsWith('.jpg') || name.endsWith('.jpeg')
}

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

function imageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read image'))
    }
    img.src = objectUrl
  })
}

async function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  error.value = ''
  if (!file) return

  if (!isAllowedImage(file)) {
    error.value = isOverlay.value ? 'Use a transparent .png file' : 'Use a .jpg still'
    return
  }
  if (file.size > MAX_PNG_BYTES) {
    error.value = 'Image max 3 MB'
    return
  }

  try {
    const { width, height } = await imageSize(file)
    const actual = width / height
    const delta = Math.abs(actual - spec.ratio) / spec.ratio
    if (delta > RATIO_TOLERANCE) {
      error.value = `Must be ${spec.label} (this file is ${width}×${height})`
      return
    }

    busy.value = true
    const dataUrl = await readDataUrl(file)
    const result = await store.uploadPng({
      kind: props.kind,
      ratio: props.ratio,
      dataUrl,
    })
    url.value = result.url
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Upload failed'
  } finally {
    busy.value = false
  }
}

function removeFile() {
  url.value = ''
  error.value = ''
}
</script>

<template>
  <div class="ia-png-slot">
    <label class="ia-label" :for="inputId">{{ slotLabel }}</label>
    <div
      class="ia-png-slot__box"
      :class="{
        'ia-png-slot__box--filled': url,
        'ia-png-slot__box--busy': busy,
        [`ia-png-slot__box--${ratio}`]: true,
      }"
    >
      <img v-if="url" :src="url" :alt="slotLabel" class="ia-png-slot__preview" />
      <div v-else class="ia-png-slot__empty">
        <span class="ia-png-slot__ratio">{{ spec.label }}</span>
        <span class="ia-png-slot__hint">{{ busy ? 'Uploading…' : idleHint }}</span>
      </div>
      <input
        :id="inputId"
        class="ia-png-slot__input"
        type="file"
        :accept="accept"
        :disabled="disabled || busy"
        @change="onPick"
      />
    </div>
    <div class="ia-png-slot__meta">
      <p v-if="error" class="ia-hint ia-hint--warn" style="margin:0">{{ error }}</p>
      <button
        v-if="url && !disabled"
        class="ia-btn ia-btn--small ia-btn--secondary"
        type="button"
        @click="removeFile"
      >
        Remove
      </button>
      <slot name="actions" />
    </div>
    <slot name="after" />
  </div>
</template>
