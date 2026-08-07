<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  en?: string
  nl?: string
}>(), {
  en: 'Keep the questions short. Long questions are hard to deliver, put the interviewer too much in the spotlight, and lose the guest halfway. The guest is the most important person on camera. Leave room for deepening and improvisation, that authenticity helps the interview. You can always react or ask a follow-up.',
  nl: 'Houd de vragen kort. Lange vragen zijn moeilijk om uit te spreken, zetten de interviewer te veel in de schijnwerpers en verliezen de gast onderweg. De gast is de belangrijkste persoon voor de camera. Ruimte overhouden voor verdieping en improvisatie komt het interview ten goede qua authenticiteit. Je kunt altijd reageren of een vervolgvraag stellen.',
})

const open = ref(false)
</script>

<template>
  <div class="ia-tip">
    <button
      class="ia-tip__toggle"
      type="button"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="ia-tip__title">Tip</span>
      <span class="ia-tip__chevron" aria-hidden="true">{{ open ? '▾' : '▸' }}</span>
    </button>
    <div v-if="open" class="ia-tip__body">
      <p class="ia-tip__text">{{ en }}</p>
      <p class="ia-tip__text ia-tip__text--nl">{{ nl }}</p>
    </div>
  </div>
</template>
