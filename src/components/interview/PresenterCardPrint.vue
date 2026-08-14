<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'

const props = defineProps<{
  open: boolean
  naam: string
  functie: string
  organisatie?: string
  productieNaam?: string
  productieDatum?: string
  serieNaam?: string
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
const serie = computed(() => (props.serieNaam || '').trim())

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

let previousTitle = ''

onUnmounted(() => {
  document.body.classList.remove('ia-presenter-print-open')
  if (previousTitle) {
    document.title = previousTitle
    previousTitle = ''
  }
})

function pdfFileBaseName(): string {
  const raw = (props.naam || '').trim() || 'Presenter-card'
  return raw
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function printCard() {
  previousTitle = document.title
  document.title = pdfFileBaseName()
  const restore = () => {
    if (previousTitle) {
      document.title = previousTitle
      previousTitle = ''
    }
    window.removeEventListener('afterprint', restore)
  }
  window.addEventListener('afterprint', restore)
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
      aria-label="Presenter Card Content"
    >
      <div class="pc-toolbar no-print">
        <h2 class="pc-toolbar__title">Presenter Card Content</h2>
        <div class="pc-toolbar__actions">
          <button class="pc-btn pc-btn--primary" type="button" @click="printCard">Print / Save as PDF</button>
          <button class="pc-btn pc-btn--secondary" type="button" @click="emit('close')">Close</button>
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
              <p v-if="productieNaam || productieDatum" class="pc-prod">
                <span v-if="productieNaam">{{ productieNaam }}</span>
                <span v-if="productieNaam && productieDatum"> · </span>
                <span v-if="productieDatum">{{ productieDatum }}</span>
              </p>
              <p v-if="serie" class="pc-serie">{{ serie }}</p>
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

      <p class="pc-cut-hint no-print">Cut along each dashed line (19 × 13 cm). Stick onto the pre-printed presenter cards.</p>
    </div>
  </Teleport>
</template>

<style scoped>
.presenter-card-print {
  position: fixed;
  inset: 0;
  z-index: 5000;
  overflow: auto;
  background: rgba(49, 159, 232, 0.72);
  padding: 1rem 1rem 2rem;
  color: #fff;
  font-family: var(--font-base, system-ui, sans-serif);
}

.pc-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  max-width: 210mm;
  margin: 0 auto 1rem;
  padding: 0;
  background: transparent;
  color: #fff;
}

.pc-toolbar__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}

.pc-toolbar__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.5rem 0.95rem;
  border-radius: 8px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  cursor: pointer;
  white-space: nowrap;
}

.pc-btn--primary {
  background: #ff7b00;
  color: #fff;
}

.pc-btn--primary:hover {
  background: #e06e00;
}

.pc-btn--secondary {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}

.pc-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.28);
}

.pc-sheet {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 10mm 5mm;
  box-sizing: border-box;
  background: #fff;
  color: #111;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 20, 60, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8mm;
}

/* Cut panel: max 19 × 13 cm */
.pc-panel {
  position: relative;
  width: 190mm;
  height: 130mm;
  flex: 0 0 auto;
  background: #fff;
  color: #111;
  border: 1.25px dashed #b0b0b5;
  border-radius: 4px;
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
  width: 3.5mm;
  height: 3.5mm;
  border-color: #b0b0b5;
  border-style: solid;
  border-width: 0;
  z-index: 1;
}

.pc-crop__mark--tl { top: -1px; left: -1px; border-top-width: 1.25px; border-left-width: 1.25px; }
.pc-crop__mark--tr { top: -1px; right: -1px; border-top-width: 1.25px; border-right-width: 1.25px; }
.pc-crop__mark--bl { bottom: -1px; left: -1px; border-bottom-width: 1.25px; border-left-width: 1.25px; }
.pc-crop__mark--br { bottom: -1px; right: -1px; border-bottom-width: 1.25px; border-right-width: 1.25px; }

.pc-prod {
  margin: 0 0 0.5mm;
  font-size: 10pt;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pc-serie {
  margin: 0 0 1mm;
  font-size: 11pt;
  font-weight: 600;
  color: #1b9cfc;
}

.pc-name {
  margin: 0;
  font-size: 20pt;
  line-height: 1.12;
  font-weight: 700;
  color: #111;
}

.pc-role,
.pc-org {
  margin: 1mm 0 0;
  font-size: 13pt;
  line-height: 1.25;
  color: #222;
}

.pc-org {
  color: #444;
  font-size: 12pt;
}

.pc-label {
  font-size: 10pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #1b9cfc;
  margin-bottom: 1mm;
}

.pc-text {
  margin: 0;
  font-size: 12.5pt;
  line-height: 1.32;
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
  margin-bottom: 2.2mm;
  font-size: 12.5pt;
  line-height: 1.3;
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
  font-size: 12.5pt;
}

.pc-cut-hint {
  max-width: 210mm;
  margin: 0.75rem auto 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
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
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .pc-panel,
  .pc-panel__inner {
    background: #fff !important;
    color: #111 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .pc-panel {
    border: 1.25px dashed #b0b0b5 !important;
    border-radius: 0 !important;
  }

  .pc-crop__mark {
    border-color: #b0b0b5 !important;
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
