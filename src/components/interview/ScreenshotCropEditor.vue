<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { PNG_RATIOS, type PngRatioId } from '@/types/interview'
import { cropStillToJpeg } from '@/utils/composeInterviewThumbnail'

const MIN_ZOOM = 1
const MAX_ZOOM = 4

const props = defineProps<{
  src: string
  ratio: PngRatioId
  overlayUrl?: string
}>()

const emit = defineEmits<{
  confirm: [dataUrl: string]
  cancel: []
}>()

const spec = PNG_RATIOS.find((r) => r.id === props.ratio)!
const frameEl = ref<HTMLElement | null>(null)
const stillEl = ref<HTMLImageElement | null>(null)
const frameW = ref(0)
const frameH = ref(0)
const imgW = ref(0)
const imgH = ref(0)
const zoom = ref(MIN_ZOOM)
const offsetX = ref(0)
const offsetY = ref(0)
const busy = ref(false)
const error = ref('')
const overlayBroken = ref(false)

const pointers = new Map<number, { x: number; y: number }>()
let pinchStartDist = 0
let pinchStartZoom = MIN_ZOOM
let dragLast: { x: number; y: number } | null = null

const coverScale = computed(() => {
  if (!imgW.value || !imgH.value || !frameW.value || !frameH.value) return 1
  return Math.max(frameW.value / imgW.value, frameH.value / imgH.value)
})

const drawWidth = computed(() => imgW.value * coverScale.value * zoom.value)
const drawHeight = computed(() => imgH.value * coverScale.value * zoom.value)

const imgStyle = computed(() => ({
  width: `${drawWidth.value}px`,
  height: `${drawHeight.value}px`,
  transform: `translate(${offsetX.value}px, ${offsetY.value}px)`,
}))

function clampOffsets() {
  const maxX = 0
  const maxY = 0
  const minX = frameW.value - drawWidth.value
  const minY = frameH.value - drawHeight.value
  offsetX.value = Math.min(maxX, Math.max(minX, offsetX.value))
  offsetY.value = Math.min(maxY, Math.max(minY, offsetY.value))
}

function centerOnCover() {
  zoom.value = MIN_ZOOM
  offsetX.value = (frameW.value - drawWidth.value) / 2
  offsetY.value = (frameH.value - drawHeight.value) / 2
  clampOffsets()
}

function measureFrame() {
  const el = frameEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  frameW.value = rect.width
  frameH.value = rect.height
  clampOffsets()
}

function setZoom(next: number, originX?: number, originY?: number) {
  const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next))
  const ox = originX ?? frameW.value / 2
  const oy = originY ?? frameH.value / 2
  const oldW = drawWidth.value
  const oldH = drawHeight.value
  if (!oldW || !oldH) {
    zoom.value = clamped
    clampOffsets()
    return
  }
  const relX = (ox - offsetX.value) / oldW
  const relY = (oy - offsetY.value) / oldH
  zoom.value = clamped
  offsetX.value = ox - relX * drawWidth.value
  offsetY.value = oy - relY * drawHeight.value
  clampOffsets()
}

function onStillLoad() {
  const img = stillEl.value
  if (!img) return
  imgW.value = img.naturalWidth
  imgH.value = img.naturalHeight
  overlayBroken.value = false
  nextTick(() => {
    measureFrame()
    centerOnCover()
  })
}

function pointerDistance() {
  const pts = [...pointers.values()]
  if (pts.length < 2) return 0
  const dx = pts[0].x - pts[1].x
  const dy = pts[0].y - pts[1].y
  return Math.hypot(dx, dy)
}

function onPointerDown(event: PointerEvent) {
  if (busy.value) return
  frameEl.value?.setPointerCapture(event.pointerId)
  const point = { x: event.clientX, y: event.clientY }
  pointers.set(event.pointerId, point)
  if (pointers.size === 1) {
    dragLast = point
  } else if (pointers.size === 2) {
    dragLast = null
    pinchStartDist = pointerDistance()
    pinchStartZoom = zoom.value
  }
}

function onPointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pointers.size === 2 && pinchStartDist > 0) {
    const dist = pointerDistance()
    setZoom(pinchStartZoom * (dist / pinchStartDist))
    return
  }
  if (pointers.size === 1 && dragLast) {
    offsetX.value += event.clientX - dragLast.x
    offsetY.value += event.clientY - dragLast.y
    dragLast = { x: event.clientX, y: event.clientY }
    clampOffsets()
  }
}

function onPointerUp(event: PointerEvent) {
  pointers.delete(event.pointerId)
  if (pointers.size < 2) {
    pinchStartDist = 0
  }
  if (pointers.size === 1) {
    const remaining = [...pointers.values()][0]
    dragLast = remaining || null
  } else {
    dragLast = null
  }
}

function onWheel(event: WheelEvent) {
  event.preventDefault()
  const local = frameEl.value?.getBoundingClientRect()
  const ox = local ? event.clientX - local.left : undefined
  const oy = local ? event.clientY - local.top : undefined
  const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08
  setZoom(zoom.value * factor, ox, oy)
}

function nudgeZoom(delta: number) {
  setZoom(zoom.value + delta)
}

async function confirmCrop() {
  const img = stillEl.value
  if (!img || !imgW.value || !frameW.value) return
  busy.value = true
  error.value = ''
  try {
    const dataUrl = cropStillToJpeg(img, props.ratio, {
      width: frameW.value,
      height: frameH.value,
      offsetX: offsetX.value,
      offsetY: offsetY.value,
      drawWidth: drawWidth.value,
      drawHeight: drawHeight.value,
    })
    emit('confirm', dataUrl)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not crop still'
    busy.value = false
  }
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && !busy.value) emit('cancel')
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  window.addEventListener('keydown', onKey)
  nextTick(() => {
    measureFrame()
    if (stillEl.value?.complete && stillEl.value.naturalWidth) onStillLoad()
    if (frameEl.value) {
      resizeObserver = new ResizeObserver(() => measureFrame())
      resizeObserver.observe(frameEl.value)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  resizeObserver?.disconnect()
})

watch(() => props.src, () => {
  imgW.value = 0
  imgH.value = 0
  overlayBroken.value = false
  nextTick(() => {
    if (stillEl.value?.complete && stillEl.value.naturalWidth) onStillLoad()
  })
})
</script>

<template>
  <div class="ia-crop" role="dialog" aria-modal="true" aria-labelledby="ia-crop-title">
    <div class="ia-crop__dialog">
        <h2 id="ia-crop-title" class="ia-crop__title">Position still {{ spec.label }}</h2>
        <p class="ia-crop__hint">
          Drag to move, scroll or use the slider to zoom. Confirm when the guest sits right in the frame.
          Thumbnail generation then adds the PNG overlay and titles.
        </p>
        <div class="ia-crop__stage">
          <div
            ref="frameEl"
            class="ia-crop__frame"
            :class="`ia-crop__frame--${ratio}`"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @wheel="onWheel"
          >
            <img
              ref="stillEl"
              class="ia-crop__img"
              :crossorigin="/^https?:/i.test(src) ? 'anonymous' : undefined"
              :src="src"
              alt=""
              draggable="false"
              :style="imgStyle"
              @load="onStillLoad"
            />
            <img
              v-if="overlayUrl && !overlayBroken"
              class="ia-crop__overlay"
              :src="overlayUrl"
              alt=""
              draggable="false"
              @error="overlayBroken = true"
            />
          </div>
        </div>
        <div class="ia-crop__zoom">
          <button class="ia-crop__zoom-btn" type="button" :disabled="busy" @click="nudgeZoom(-0.12)">−</button>
          <input
            class="ia-crop__slider"
            type="range"
            :min="MIN_ZOOM"
            :max="MAX_ZOOM"
            step="0.01"
            :value="zoom"
            :disabled="busy"
            aria-label="Zoom"
            @input="setZoom(Number(($event.target as HTMLInputElement).value))"
          />
          <button class="ia-crop__zoom-btn" type="button" :disabled="busy" @click="nudgeZoom(0.12)">+</button>
        </div>
        <p v-if="error" class="ia-crop__error">{{ error }}</p>
        <div class="ia-crop__actions">
          <button class="ia-btn ia-btn--secondary" type="button" :disabled="busy" @click="emit('cancel')">
            Cancel
          </button>
          <button class="ia-btn ia-btn--accent" type="button" :disabled="busy || !imgW" @click="confirmCrop">
            {{ busy ? 'Saving…' : 'Confirm position' }}
          </button>
        </div>
      </div>
    </div>
</template>
