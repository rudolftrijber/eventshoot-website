<script setup lang="ts">
import { ClipboardDocumentIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import ShortQuestionsTip from '@/components/interview/ShortQuestionsTip.vue'
import { copyTextToClipboard, formatQuestionsForCopy } from '@/utils/interviewCsv'
import { ref } from 'vue'

type AiPrepAnswers = { sector: string; specialism: string; timeliness: string; customPrompt: string }
type AiStep = 'idle' | 'prep' | 'preview'

const AI_PREP_FIELDS: Array<{ key: 'sector' | 'specialism' | 'timeliness'; label: string; placeholder: string }> = [
  { key: 'sector', label: 'Sector / industry', placeholder: 'e.g. circular IT, healthcare, finance' },
  { key: 'specialism', label: 'Event focus', placeholder: 'e.g. sustainability, leadership, innovation' },
  { key: 'timeliness', label: 'What is topical now?', placeholder: 'e.g. regulation, talent shortage' },
]

const questions = defineModel<string[]>('questions', { required: true })
const aiPrep = defineModel<AiPrepAnswers>('aiPrep', { required: true })
const aiLanguage = defineModel<'nl' | 'en'>('aiLanguage', { required: true })
const aiAddress = defineModel<'u' | 'jij'>('aiAddress', { required: true })
const aiSelected = defineModel<boolean[]>('aiSelected', { required: true })

defineProps<{
  aiStep: AiStep
  aiLoading: boolean
  aiPreview: string[] | null
  prepComplete: boolean
  embedded?: boolean
}>()

const emit = defineEmits<{
  openAi: []
  generate: []
  apply: []
  dismiss: []
  addQuestion: []
  removeQuestion: [index: number]
  save: []
}>()

const copyHint = ref('')

async function copyAll() {
  const text = formatQuestionsForCopy(questions.value, 'Default participant questions')
  if (!text) {
    copyHint.value = 'No questions to copy'
  } else {
    const ok = await copyTextToClipboard(text)
    copyHint.value = ok ? 'Copied' : 'Copy failed'
  }
  setTimeout(() => { copyHint.value = '' }, 2000)
}
</script>

<template>
  <div :class="embedded ? 'ia-defaults-embed' : 'ia-card'">
    <div v-if="!embedded" class="ia-question-head">
      <h2 class="ia-section-title ia-section-title--inline">Default questions for Participants</h2>
      <button
        v-if="aiStep === 'idle'"
        class="ia-btn ia-btn--small ia-btn--secondary ia-btn--ai"
        type="button"
        @click="emit('openAi')"
      >
        <SparklesIcon class="ia-btn__icon" aria-hidden="true" />
        Suggest defaults
      </button>
    </div>
    <div v-else class="ia-question-head">
      <p class="ia-hint" style="margin:0">Use AI, then edit and save what you want.</p>
      <button
        v-if="aiStep === 'idle'"
        class="ia-btn ia-btn--small ia-btn--secondary ia-btn--ai"
        type="button"
        @click="emit('openAi')"
      >
        <SparklesIcon class="ia-btn__icon" aria-hidden="true" />
        Suggest defaults
      </button>
    </div>
    <p v-if="!embedded" class="ia-hint">
      These defaults are used when you add a Participant. Use AI, then edit and save what you want.
    </p>
    <ShortQuestionsTip />
    <div v-if="aiStep === 'prep'" class="ia-ai-preview ia-ai-preview--prep">
      <p class="ia-ai-preview__title">Briefing for AI — fill the 3 fields, or write your own prompt</p>
      <div class="ia-ai-options">
        <div class="ia-ai-options__group">
          <span class="ia-ai-options__label">Language</span>
          <button
            class="ia-ai-toggle"
            :class="{ 'ia-ai-toggle--active': aiLanguage === 'nl' }"
            type="button"
            @click="aiLanguage = 'nl'"
          >NL</button>
          <button
            class="ia-ai-toggle"
            :class="{ 'ia-ai-toggle--active': aiLanguage === 'en' }"
            type="button"
            @click="aiLanguage = 'en'"
          >ENG</button>
        </div>
        <div v-if="aiLanguage === 'nl'" class="ia-ai-options__group">
          <span class="ia-ai-options__label">Address</span>
          <button
            class="ia-ai-toggle"
            :class="{ 'ia-ai-toggle--active': aiAddress === 'u' }"
            type="button"
            @click="aiAddress = 'u'"
          >u</button>
          <button
            class="ia-ai-toggle"
            :class="{ 'ia-ai-toggle--active': aiAddress === 'jij' }"
            type="button"
            @click="aiAddress = 'jij'"
          >jij</button>
        </div>
      </div>
      <div v-for="field in AI_PREP_FIELDS" :key="field.key" class="ia-ai-prep-field">
        <label class="ia-label">{{ field.label }}</label>
        <input
          v-model="aiPrep[field.key]"
          class="ia-input"
          :placeholder="field.placeholder"
        />
      </div>
      <div class="ia-ai-prep-field">
        <label class="ia-label">Prompt (optional)</label>
        <textarea
          v-model="aiPrep.customPrompt"
          class="ia-textarea"
          rows="3"
          placeholder="Write your own prompt — e.g. focus on practical examples, avoid jargon…"
        />
      </div>
      <div class="ia-actions ia-actions--tight">
        <button
          class="ia-btn ia-btn--small ia-btn--accent"
          type="button"
          :disabled="aiLoading || !prepComplete"
          @click="emit('generate')"
        >
          {{ aiLoading ? 'Generating…' : 'Generate proposal (max. 4)' }}
        </button>
        <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="emit('dismiss')">
          Cancel
        </button>
      </div>
    </div>
    <div v-else-if="aiStep === 'preview' && aiPreview" class="ia-ai-preview">
      <p class="ia-ai-preview__title">AI proposal — select questions to use (max. 4)</p>
      <ul class="ia-ai-preview__pick">
        <li v-for="(q, i) in aiPreview" :key="i">
          <label class="ia-ai-pick">
            <input v-model="aiSelected[i]" type="checkbox" />
            <span>{{ q }}</span>
          </label>
        </li>
      </ul>
      <div class="ia-actions ia-actions--tight">
        <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="emit('apply')">
          Use selected questions
        </button>
        <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="emit('dismiss')">
          Dismiss
        </button>
      </div>
    </div>
    <div v-for="(q, i) in questions" :key="`dq-${i}-${questions.length}`" class="ia-question-row">
      <textarea v-model="questions[i]" class="ia-textarea" rows="1" :placeholder="`Question ${i + 1}`" />
      <button
        class="ia-iconbtn ia-iconbtn--delete"
        type="button"
        title="Remove question"
        :disabled="questions.length <= 1"
        @click.stop="emit('removeQuestion', i)"
      >🗑️</button>
    </div>
    <div class="ia-actions">
      <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="emit('addQuestion')">+ Question</button>
      <button
        class="ia-btn ia-btn--small ia-btn--secondary"
        type="button"
        title="Copy all questions"
        :disabled="!questions.some((q) => q.trim())"
        @click="copyAll"
      >
        <ClipboardDocumentIcon class="ia-btn__icon" aria-hidden="true" />
        {{ copyHint || 'Copy all' }}
      </button>
      <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="emit('save')">Save defaults</button>
    </div>
  </div>
</template>
