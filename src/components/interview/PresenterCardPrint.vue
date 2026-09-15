<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'

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

type CardPanel = {
  kind: 'first' | 'continued'
  questions: string[]
  questionOffset: number
  showIntro: boolean
  showOutro: boolean
}

const packedPanels = ref<CardPanel[]>([])
const innerEls: (HTMLElement | null)[] = []
let fillPromise: Promise<void> | null = null
let fillToken = 0

function setInnerRef(index: number, el: unknown) {
  innerEls[index] = el instanceof HTMLElement ? el : null
}

function clonePanels(list: CardPanel[]): CardPanel[] {
  return list.map((panel) => ({
    ...panel,
    questions: [...panel.questions],
  }))
}

function withOffsets(list: CardPanel[]): CardPanel[] {
  let offset = 0
  return list.map((panel) => {
    const next = { ...panel, questionOffset: offset }
    offset += panel.questions.length
    return next
  })
}

function firstPanel(): CardPanel {
  return {
    kind: 'first',
    questions: [],
    questionOffset: 0,
    showIntro: Boolean(intro.value),
    showOutro: false,
  }
}

function panelOverflows(index: number): boolean {
  const el = innerEls[index]
  if (!el) return false
  return el.scrollHeight > el.clientHeight + 1
}

async function waitLayout() {
  await nextTick()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

async function waitForInner(index: number) {
  for (let attempt = 0; attempt < 8; attempt++) {
    await waitLayout()
    if (innerEls[index]) return
  }
}

async function fillPanels() {
  const token = ++fillToken
  if (!props.open) {
    packedPanels.value = withOffsets([firstPanel()])
    return
  }

  const result: CardPanel[] = [firstPanel()]
  packedPanels.value = withOffsets(clonePanels(result))
  await waitForInner(0)
  if (token !== fillToken) return

  for (const question of questions.value) {
    const index = result.length - 1
    result[index].questions.push(question)
    packedPanels.value = withOffsets(clonePanels(result))
    await waitForInner(index)
    if (token !== fillToken) return
    if (!panelOverflows(index)) continue

    result[index].questions.pop()
    result.push({
      kind: 'continued',
      questions: [question],
      questionOffset: 0,
      showIntro: false,
      showOutro: false,
    })
    packedPanels.value = withOffsets(clonePanels(result))
    await waitForInner(result.length - 1)
    if (token !== fillToken) return
  }

  if (!outro.value) return

  const index = result.length - 1
  result[index].showOutro = true
  packedPanels.value = withOffsets(clonePanels(result))
  await waitForInner(index)
  if (token !== fillToken) return
  if (!panelOverflows(index)) return

  result[index].showOutro = false
  result.push({
    kind: 'continued',
    questions: [],
    questionOffset: 0,
    showIntro: false,
    showOutro: true,
  })
  packedPanels.value = withOffsets(clonePanels(result))
}

const sheets = computed(() => {
  const list = packedPanels.value
  const out: CardPanel[][] = []
  for (let i = 0; i < list.length; i += 2) out.push(list.slice(i, i + 2))
  return out
})

watch(
  () => props.open,
  (open) => {
    document.body.classList.toggle('ia-presenter-print-open', open)
  },
  { immediate: true },
)

watch(
  () => [
    props.open,
    questions.value.join('\n'),
    intro.value,
    outro.value,
    props.naam,
    props.functie,
    props.organisatie,
    props.productieNaam,
    props.productieDatum,
    props.serieNaam,
  ],
  () => {
    fillPromise = fillPanels()
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

async function printCard() {
  if (fillPromise) await fillPromise
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

      <div v-for="(sheet, sheetIndex) in sheets" :key="sheetIndex" class="pc-sheet">
        <article
          v-for="(panel, panelIndex) in sheet"
          :key="`${sheetIndex}-${panel.kind}-${panel.questionOffset}-${panel.questions.length}`"
          class="pc-panel"
        >
          <div class="pc-crop" aria-hidden="true">
            <span class="pc-crop__mark pc-crop__mark--tl" />
            <span class="pc-crop__mark pc-crop__mark--tr" />
            <span class="pc-crop__mark pc-crop__mark--bl" />
            <span class="pc-crop__mark pc-crop__mark--br" />
          </div>
          <div class="pc-panel__inner" :ref="(el) => setInnerRef(sheetIndex * 2 + panelIndex, el)">
            <header v-if="panel.kind === 'first'" class="pc-head">
              <div class="pc-head__top">
                <p v-if="productieNaam || productieDatum" class="pc-prod">
                  <span v-if="productieNaam">{{ productieNaam }}</span>
                  <span v-if="productieNaam && productieDatum"> · </span>
                  <span v-if="productieDatum">{{ productieDatum }}</span>
                </p>
                <p v-else class="pc-prod">&nbsp;</p>
                <img
                  class="pc-logo"
                  src="/images/logos/ES_logo_pos.png"
                  alt="Eventshoot.nl"
                  width="160"
                  height="36"
                />
              </div>
              <p v-if="serie" class="pc-serie">{{ serie }}</p>
              <h1 class="pc-name">{{ naam || 'Name' }}</h1>
              <p v-if="functie" class="pc-role">{{ functie }}</p>
              <p v-if="organisatie" class="pc-org">{{ organisatie }}</p>
            </header>
            <header v-else class="pc-head">
              <div class="pc-head__top">
                <div v-if="panel.questions.length" class="pc-label">Questions (continued)</div>
                <div v-else class="pc-label">Outro</div>
                <img
                  class="pc-logo"
                  src="/images/logos/ES_logo_pos.png"
                  alt="Eventshoot.nl"
                  width="160"
                  height="36"
                />
              </div>
            </header>

            <div v-if="panel.showIntro && intro" class="pc-block">
              <div class="pc-label">Intro</div>
              <p class="pc-text">{{ intro }}</p>
            </div>

            <div v-if="panel.questions.length" class="pc-block">
              <div v-if="panel.kind === 'first'" class="pc-label">Questions</div>
              <ol class="pc-questions">
                <li v-for="(q, i) in panel.questions" :key="i">
                  <span class="pc-qnum">{{ panel.questionOffset + i + 1 }}.</span>
                  <span>{{ q }}</span>
                </li>
              </ol>
            </div>
            <p v-else-if="panel.kind === 'first' && !intro" class="pc-empty">No questions yet</p>

            <div v-if="panel.showOutro && outro" class="pc-block">
              <div v-if="panel.questions.length" class="pc-label">Outro</div>
              <p class="pc-text">{{ outro }}</p>
            </div>
          </div>
        </article>
      </div>

      <p class="pc-cut-hint no-print">
        Cut along each dashed line (19 × 13 cm). A third card prints on the next page when the questions do not fit on two.
      </p>
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
  padding: 12mm 8mm;
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

.pc-sheet + .pc-sheet {
  margin-top: 10mm;
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
  position: static;
  flex: 0 0 auto;
  width: 38mm;
  height: auto;
  display: block;
}

.pc-panel__inner {
  height: 100%;
  padding: 7mm 8mm 8mm 8mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2.5mm;
  overflow: hidden;
  background: #fff;
  color: #111;
}

.pc-head {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.pc-head__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6mm;
}

.pc-head__top .pc-prod,
.pc-head__top .pc-label {
  min-width: 0;
  flex: 1 1 auto;
  margin-bottom: 0;
}

.pc-block,
.pc-text,
.pc-questions {
  width: 100%;
  max-width: none;
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

.pc-questions li > span:last-child {
  flex: 1 1 auto;
  min-width: 0;
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
    gap: 8mm;
    background: #fff !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .pc-sheet + .pc-sheet {
    break-before: page;
    page-break-before: always;
    margin-top: 0 !important;
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
    margin: 10mm;
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
