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

/** First cut panel: identity + intro + first questions */
const panel1Questions = computed(() => {
  const all = questions.value
  if (!all.length) return []
  // Keep first panel readable with larger type
  const max = intro.value ? 4 : 5
  return all.slice(0, Math.min(max, all.length))
})

/** Second cut panel: remaining questions + outro */
const panel2Questions = computed(() => {
  const all = questions.value
  if (all.length <= panel1Questions.value.length) return []
  return all.slice(panel1Questions.value.length)
})

const showPanel2 = computed(() => panel2Questions.value.length > 0 || Boolean(outro.value))

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
  // Small delay so the browser paints the print layout cleanly
  requestAnimationFrame(() => window.print())
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="presenter-card-print"
      role="dialog"
      aria-modal="true"
      aria-label="Presenter card"
    >
      <div class="pc-toolbar no-print">
        <div class="pc-toolbar__text">
          <strong>Presenter card</strong>
          <span>A4 portrait · 2 cut panels (slightly smaller than A5) · print on white paper</span>
        </div>
        <div class="pc-toolbar__actions">
          <button class="ia-btn" type="button" @click="printCard">Print / Save as PDF</button>
          <button class="ia-btn ia-btn--secondary" type="button" @click="emit('close')">Close</button>
        </div>
      </div>

      <!-- One printable sheet: up to two stacked cut panels -->
      <div class="pc-sheet">
        <!-- Panel 1 -->
        <article class="pc-panel">
          <img
            class="pc-logo"
            src="/images/logos/ES_logo_pos.png"
            alt="Eventshoot.nl"
            width="160"
            height="36"
          />
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

            <div v-if="panel1Questions.length" class="pc-block">
              <div class="pc-label">Questions</div>
              <ol class="pc-questions">
                <li v-for="(q, i) in panel1Questions" :key="i">
                  <span class="pc-qnum">{{ i + 1 }}.</span>
                  <span>{{ q }}</span>
                </li>
              </ol>
            </div>
            <p v-else-if="!intro" class="pc-empty">No questions yet</p>
          </div>
        </article>

        <!-- Panel 2 -->
        <article v-if="showPanel2" class="pc-panel">
          <img
            class="pc-logo"
            src="/images/logos/ES_logo_pos.png"
            alt="Eventshoot.nl"
            width="160"
            height="36"
          />
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

            <div v-if="panel2Questions.length" class="pc-block">
              <div class="pc-label">Questions (continued)</div>
              <ol class="pc-questions">
                <li v-for="(q, i) in panel2Questions" :key="i">
                  <span class="pc-qnum">{{ panel1Questions.length + i + 1 }}.</span>
                  <span>{{ q }}</span>
                </li>
              </ol>
            </div>

            <div v-if="outro" class="pc-block">
              <div class="pc-label">Outro</div>
              <p class="pc-text">{{ outro }}</p>
            </div>
          </div>
        </article>
      </div>

      <p class="pc-cut-hint no-print">Cut along each dashed line (slightly smaller than A5). Stick onto the pre-printed presenter cards.</p>
    </div>
  </Teleport>
</template>

<style scoped>
.presenter-card-print {
  position: fixed;
  inset: 0;
  z-index: 5000;
  overflow: auto;
  background: #e8e8ec;
  padding: 1rem 1rem 2rem;
  color: #111;
}

.pc-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  max-width: 210mm;
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

.pc-sheet {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 10mm 5mm;
  box-sizing: border-box;
  background: #fff;
  color: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8mm;
}

/* Slightly smaller than A5 landscape (210 × 148): 200 × 130 mm (13 cm high) */
.pc-panel {
  position: relative;
  width: 200mm;
  height: 130mm;
  flex: 0 0 auto;
  background: #fff;
  color: #111;
  border: 1.5px dashed #222;
  box-sizing: border-box;
  overflow: hidden;
}

.pc-logo {
  position: absolute;
  top: 4mm;
  right: 5mm;
  width: 42mm;
  height: auto;
  z-index: 2;
  display: block;
}

.pc-panel__inner {
  height: 100%;
  padding: 5mm 8mm 5mm 7mm;
  padding-right: 50mm; /* room for logo */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2.5mm;
  overflow: hidden;
  background: #fff;
  color: #111;
}

.pc-crop__mark {
  position: absolute;
  width: 4mm;
  height: 4mm;
  border-color: #111;
  border-style: solid;
  border-width: 0;
  z-index: 1;
}

.pc-crop__mark--tl { top: -1px; left: -1px; border-top-width: 1.5px; border-left-width: 1.5px; }
.pc-crop__mark--tr { top: -1px; right: -1px; border-top-width: 1.5px; border-right-width: 1.5px; }
.pc-crop__mark--bl { bottom: -1px; left: -1px; border-bottom-width: 1.5px; border-left-width: 1.5px; }
.pc-crop__mark--br { bottom: -1px; right: -1px; border-bottom-width: 1.5px; border-right-width: 1.5px; }

.pc-prod {
  margin: 0 0 0.5mm;
  font-size: 9pt;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pc-name {
  margin: 0;
  font-size: 18pt;
  line-height: 1.12;
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
  font-size: 15pt;
}

.pc-label {
  font-size: 9pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #1b9cfc;
  margin-bottom: 1mm;
}

.pc-text {
  margin: 0;
  font-size: 11pt;
  line-height: 1.3;
  white-space: pre-wrap;
  color: #111;
}

.pc-questions {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pc-questions li {
  display: flex;
  gap: 2.5mm;
  margin-bottom: 2mm;
  font-size: 11pt;
  line-height: 1.28;
  color: #111;
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
  font-size: 11pt;
}

.pc-cut-hint {
  max-width: 210mm;
  margin: 0.75rem auto 0;
  font-size: 0.8rem;
  color: #444;
  text-align: center;
}

@media print {
  .presenter-card-print {
    position: static !important;
    inset: auto !important;
    background: #fff !important;
    padding: 0 !important;
    overflow: visible !important;
    color: #111 !important;
  }

  .pc-sheet {
    width: 100% !important;
    min-height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    gap: 6mm;
    background: #fff !important;
    box-shadow: none !important;
  }

  .pc-panel,
  .pc-panel__inner {
    background: #fff !important;
    color: #111 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .pc-logo {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 8mm;
  }

  html,
  body {
    background: #fff !important;
    color: #111 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Hide entire app chrome — no dark leftover pages */
  body.ia-presenter-print-open #app {
    display: none !important;
  }

  body.ia-presenter-print-open .presenter-card-print {
    display: block !important;
    background: #fff !important;
  }

  body.ia-presenter-print-open .no-print {
    display: none !important;
  }
}
</style>
