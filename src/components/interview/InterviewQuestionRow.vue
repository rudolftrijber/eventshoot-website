<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

defineProps<{
  index: number
  total: number
  disabled?: boolean
}>()

const question = defineModel<string>({ required: true })

const emit = defineEmits<{
  move: [index: number, dir: -1 | 1]
  remove: [index: number]
}>()
</script>

<template>
  <div class="ia-question-row">
    <span class="ia-question-row__num" aria-hidden="true">{{ index + 1 }}</span>
    <textarea
      v-model="question"
      class="ia-textarea"
      rows="1"
      :placeholder="`Question ${index + 1}`"
      :aria-label="`Question ${index + 1}`"
      :disabled="disabled"
    />
    <div class="ia-question-row__tools">
      <button
        class="ia-iconbtn ia-iconbtn--move"
        type="button"
        title="Move up"
        :aria-label="`Move question ${index + 1} up`"
        :disabled="disabled || index === 0"
        @click.stop="emit('move', index, -1)"
      >
        <ChevronUpIcon aria-hidden="true" />
      </button>
      <button
        class="ia-iconbtn ia-iconbtn--move"
        type="button"
        title="Move down"
        :aria-label="`Move question ${index + 1} down`"
        :disabled="disabled || index === total - 1"
        @click.stop="emit('move', index, 1)"
      >
        <ChevronDownIcon aria-hidden="true" />
      </button>
      <button
        class="ia-iconbtn ia-iconbtn--delete"
        type="button"
        title="Remove question"
        :aria-label="`Remove question ${index + 1}`"
        :disabled="disabled || total <= 1"
        @click.stop="emit('remove', index)"
      >🗑️</button>
    </div>
  </div>
</template>
