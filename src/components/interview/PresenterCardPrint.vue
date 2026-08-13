<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'

const props = defineProps<{
  open: boolean
  naam: string
  functie: string
  organisatie?: string
  productieNaam?: string
  introTekst?: string
  outroTekst?: string
  questions: string[]
}>()

const emit = defineEmits<{
  close: []
}>()

const questions = computed(() => props.questions.map((q) => q.trim()).filter(Boolean))
const intro = computed(() => (props.introTekst || '').trim())
const outro = computed(() => (props.outroTekst || '').trim())
const hasPage2 = computed(() => Boolean(outro.value))

watch(
  () => props.open,
  (open) => {
    document.body.classList.toggle('ia-presenter-print-open', open)
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.classList.remove('ia-presenter-print-open')
})

function printCard() {
  window.print()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="presenter-card-print" role="dialog" aria-modal="true" aria-label="Presenter card">
      <div class="pc-toolbar no-print">
        <div class="pc-toolbar__text">
          <strong>Presenter card</strong>
          <span>A4 landscape · cut lines slightly smaller than A5 · print on white paper</span>
        </div>
        <div class="pc-toolbar__actions">
          <button class="ia-btn" type="button" @click="printCard">Print / Save as PDF</button>
          <button class="ia-btn ia-btn--secondary" type="button" @click="emit('close')">Close</button>
        </div>
      </div>

      <!-- Page 1: identity + intro + questions -->
      <section class="pc-page">
        <div class="pc-panel">
          <div class="pc-crop" aria-hidden="true">
            <span class="pc-crop__mark pc-crop__mark--tl" />
            <span class="pc-crop__mark pc-crop__mark--tr" />
            <span class="pc-crop__mark pc-crop__mark--bl" />
            <span class="pc-crop__mark pc-crop__mark--br" />
          </div>
          <div class="pc-panel__inner">
            <header class="pc-head">
              <p v-if="productieNaam" class="pc-prod">{{ productieNaam }}</p>
              <h1 class="pc-name">{{ naam || 'Name' }}</h1>
              <p v-if="functie" class="pc-role">{{ functie }}</p>
              <p v-if="organisatie" class="pc-org">{{ organisatie }}</p>
            </header>

            <div v-if="intro" class="pc-block">
              <div class="pc-label">Intro</div>
              <p class="pc-text">{{ intro }}</p>
            </div>

            <div v-if="questions.length" class="pc-block">
              <div class="pc-label">Questions</div>
              <ol class="pc-questions">
                <li v-for="(q, i) in questions" :key="i">
                  <span class="pc-qnum">{{ i + 1 }}.</span>
                  <span>{{ q }}</span>
                </li>
              </ol>
            </div>
            <p v-else class="pc-empty">No questions yet</p>

            <p class="pc-cut-hint no-print">Cut along the dashed line (smaller than A5)</p>
          </div>
        </div>
      </section>

      <!-- Page 2: outro only (when present) -->
      <section v-if="hasPage2" class="pc-page pc-page--break">
        <div class="pc-panel">
          <div class="pc-crop" aria-hidden="true">
            <span class="pc-crop__mark pc-crop__mark--tl" />
            <span class="pc-crop__mark pc-crop__mark--tr" />
            <span class="pc-crop__mark pc-crop__mark--bl" />
            <span class="pc-crop__mark pc-crop__mark--br" />
          </div>
          <div class="pc-panel__inner">
            <header class="pc-head pc-head--compact">
              <h1 class="pc-name">{{ naam || 'Name' }}</h1>
              <p v-if="functie" class="pc-role">{{ functie }}</p>
            </header>
            <div class="pc-block">
              <div class="pc-label">Outro</div>
              <p class="pc-text">{{ outro }}</p>
            </div>
            <p class="pc-cut-hint no-print">Cut along the dashed line (smaller than A5)</p>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.presenter-card-print {
  position: fixed;
  inset: 0;
  z-index: 5000;
  overflow: auto;
  background: rgba(10, 12, 18, 0.92);
  padding: 1rem 1rem 2rem;
  color: #111;
}

.pc-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  max-width: 297mm;
  margin: 0 auto 1rem;
  padding: 0.75rem 1rem;
  background: #1a1a2e;
  border-radius: 8px;
  color: #fff;
}

.pc-toolbar__text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.85rem;
}

.pc-toolbar__text span {
  opacity: 0.7;
  font-size: 0.75rem;
}

.pc-toolbar__actions {
  display: flex;
  gap: 0.5rem;
}

.pc-page {
  display: flex;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.pc-page--break {
  page-break-before: always;
  break-before: page;
}

/* A5 landscape = 210 × 148 mm → cut panel slightly smaller */
.pc-panel {
  position: relative;
  width: 200mm;
  height: 138mm;
  background: #fff;
  color: #111;
  border: 1.5px dashed #333;
  box-sizing: border-box;
}

.pc-panel__inner {
  height: 100%;
  padding: 8mm 9mm;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4mm;
}

.pc-crop__mark {
  position: absolute;
  width: 5mm;
  height: 5mm;
  border-color: #111;
  border-style: solid;
  border-width: 0;
}

.pc-crop__mark--tl {
  top: -1px;
  left: -1px;
  border-top-width: 1.5px;
  border-left-width: 1.5px;
}

.pc-crop__mark--tr {
  top: -1px;
  right: -1px;
  border-top-width: 1.5px;
  border-right-width: 1.5px;
}

.pc-crop__mark--bl {
  bottom: -1px;
  left: -1px;
  border-bottom-width: 1.5px;
  border-left-width: 1.5px;
}

.pc-crop__mark--br {
  bottom: -1px;
  right: -1px;
  border-bottom-width: 1.5px;
  border-right-width: 1.5px;
}

.pc-prod {
  margin: 0 0 1mm;
  font-size: 9pt;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pc-name {
  margin: 0;
  font-size: 18pt;
  line-height: 1.15;
  font-weight: 700;
  color: #111;
}

.pc-role,
.pc-org {
  margin: 1mm 0 0;
  font-size: 12pt;
  line-height: 1.25;
  color: #222;
}

.pc-org {
  color: #444;
  font-size: 11pt;
}

.pc-head--compact .pc-name {
  font-size: 14pt;
}

.pc-label {
  font-size: 8pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #1b9cfc;
  margin-bottom: 1.5mm;
}

.pc-text {
  margin: 0;
  font-size: 11pt;
  line-height: 1.35;
  white-space: pre-wrap;
}

.pc-questions {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pc-questions li {
  display: flex;
  gap: 2.5mm;
  margin-bottom: 2.5mm;
  font-size: 11pt;
  line-height: 1.3;
}

.pc-qnum {
  flex: 0 0 auto;
  font-weight: 700;
  color: #1b9cfc;
}

.pc-empty {
  margin: 0;
  color: #888;
  font-style: italic;
}

.pc-cut-hint {
  margin-top: auto;
  font-size: 8pt;
  color: #888;
}

@media print {
  .presenter-card-print {
    position: static;
    inset: auto;
    background: #fff;
    padding: 0;
    overflow: visible;
  }

  .pc-page {
    margin: 0;
    width: 100%;
    min-height: 100vh;
    align-items: center;
  }

  .pc-panel {
    box-shadow: none;
  }
}
</style>

<style>
/* Global print rules: only the presenter card is visible */
@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }

  body.ia-presenter-print-open * {
    visibility: hidden !important;
  }

  body.ia-presenter-print-open .presenter-card-print,
  body.ia-presenter-print-open .presenter-card-print * {
    visibility: visible !important;
  }

  body.ia-presenter-print-open .presenter-card-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  body.ia-presenter-print-open .no-print {
    display: none !important;
    visibility: hidden !important;
  }
}
</style>
