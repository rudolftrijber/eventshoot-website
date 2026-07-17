<script setup lang="ts">
import { ref } from 'vue'

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
    <p v-if="open" class="ia-tip__text">
      Keep the questions short. Long questions are hard to deliver, put the interviewer too much in the spotlight, and lose the guest halfway. The guest is the most important person on camera. You can always react or ask a follow-up.
    </p>
  </div>
</template>
