<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'

export interface BriefProduction {
  naam: string
  serie: string
  when: string
  status: string
  locatie: string
  crew: string[]
}

export interface BriefCandidate {
  naam: string
  functie: string
  organisatie: string
  meta: string
  planning: string
  moderator: string
  moderatorFunctie: string
  intro: string
  outro: string
  questions: string[]
}

const props = defineProps<{
  open: boolean
  production: BriefProduction
  candidates: BriefCandidate[]
  embedded?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

type BriefPage = {
  candidateIndex: number
  continued: boolean
  showIntro: boolean
  showOutro: boolean
  questions: string[]
  questionOffset: number
}

const pages = ref<BriefPage[]>([])
const innerEls: (HTMLElement | null)[] = []
let fillPromise: Promise<void> | null = null
let fillToken = 0

const candidateCount = computed(() => props.candidates.length)

function setInnerRef(index: number, el: unknown) {
  innerEls[index] = el instanceof HTMLElement ? el : null
}

function clonePages(list: BriefPage[]): BriefPage[] {
  return list.map((page) => ({ ...page, questions: [...page.questions] }))
}

function withOffsets(list: BriefPage[]): BriefPage[] {
  const used: number[] = []
  return list.map((page) => {
    const offset = used[page.candidateIndex] || 0
    used[page.candidateIndex] = offset + page.questions.length
    return { ...page, questionOffset: offset }
  })
}

function blankPage(candidateIndex: number, continued = false): BriefPage {
  return {
    candidateIndex,
    continued,
    showIntro: false,
    showOutro: false,
    questions: [],
    questionOffset: 0,
  }
}

function pageOverflows(index: number): boolean {
  const el = innerEls[index]
  if (!el || el.clientHeight < 40) return false
  return el.scrollHeight > el.clientHeight + 1
}

async function waitLayout() {
  await nextTick()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

async function waitForInner(index: number) {
  for (let attempt = 0; attempt < 8; attempt++) {
    await waitLayout()
    if (innerEls[index]) return
  }
}

function candidateAt(index: number): BriefCandidate | undefined {
  return props.candidates[index]
}

function scriptQuestions(candidate: BriefCandidate): string[] {
  return candidate.questions.map((q) => q.trim()).filter(Boolean)
}

async function fillPages() {
  const token = ++fillToken
  innerEls.length = 0
  if (!props.open || !props.candidates.length) {
    pages.value = []
    return
  }

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try { await document.fonts.ready } catch { /* measurement still works without webfonts */ }
  }
  if (token !== fillToken) return

  const result: BriefPage[] = []

  for (let c = 0; c < props.candidates.length; c++) {
    const candidate = props.candidates[c]
    result.push(blankPage(c))
    pages.value = withOffsets(clonePages(result))
    await waitForInner(result.length - 1)
    if (token !== fillToken) return

    const intro = candidate.intro.trim()
    if (intro) {
      result[result.length - 1].showIntro = true
      pages.value = withOffsets(clonePages(result))
      await waitForInner(result.length - 1)
      if (token !== fillToken) return
      if (pageOverflows(result.length - 1)) {
        result[result.length - 1].showIntro = false
        result.push({ ...blankPage(c, true), showIntro: true })
        pages.value = withOffsets(clonePages(result))
        await waitForInner(result.length - 1)
        if (token !== fillToken) return
      }
    }

    for (const question of scriptQuestions(candidate)) {
      const index = result.length - 1
      result[index].questions.push(question)
      pages.value = withOffsets(clonePages(result))
      await waitForInner(index)
      if (token !== fillToken) return
      if (!pageOverflows(index)) continue

      result[index].questions.pop()
      result.push({ ...blankPage(c, true), questions: [question] })
      pages.value = withOffsets(clonePages(result))
      await waitForInner(result.length - 1)
      if (token !== fillToken) return
    }

    const outro = candidate.outro.trim()
    if (!outro) continue
    const index = result.length - 1
    result[index].showOutro = true
    pages.value = withOffsets(clonePages(result))
    await waitForInner(index)
    if (token !== fillToken) return
    if (!pageOverflows(index)) continue

    result[index].showOutro = false
    result.push({ ...blankPage(c, true), showOutro: true })
    pages.value = withOffsets(clonePages(result))
  }
}

const dataSignature = computed(() => JSON.stringify({
  open: props.open,
  production: props.production,
  candidates: props.candidates,
}))

watch(dataSignature, () => {
  fillPromise = fillPages()
}, { immediate: true })

watch(
  () => props.open && !props.embedded,
  (open) => {
    document.body.classList.toggle('ia-brief-print-open', open)
  },
  { immediate: true },
)

let previousTitle = ''

onUnmounted(() => {
  if (!props.embedded) document.body.classList.remove('ia-brief-print-open')
  if (previousTitle) {
    document.title = previousTitle
    previousTitle = ''
  }
})

function pdfFileBaseName(): string {
  const prod = (props.production.naam || '').trim()
  const single = props.candidates.length === 1 ? (props.candidates[0]?.naam || '').trim() : ''
  const raw = single && prod ? `VPO PDF - ${single} - ${prod}` : (prod ? `VPO PDF - ${prod}` : (single ? `VPO PDF - ${single}` : 'VPO PDF'))
  return raw.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim()
}

const toolbarTitle = computed(() => {
  const name = props.production.naam.trim()
  return name ? `VPO PDF · ${name}` : 'VPO PDF'
})

async function printBrief() {
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

function hasScript(candidate: BriefCandidate | undefined): boolean {
  if (!candidate) return false
  return Boolean(candidate.intro.trim() || candidate.outro.trim() || scriptQuestions(candidate).length)
}
</script>

<template>
  <Teleport to="body" :disabled="embedded">
    <div
      v-if="open"
      class="interview-brief-print"
      :class="{ 'interview-brief-print--embedded': embedded }"
      role="dialog"
      aria-modal="true"
      aria-label="VPO PDF"
    >
      <div v-if="!embedded" class="ib-toolbar no-print">
        <h2 class="ib-toolbar__title">{{ toolbarTitle }}</h2>
        <div class="ib-toolbar__actions">
          <button class="ib-btn ib-btn--primary" type="button" @click="printBrief">Print / Save as PDF</button>
          <button class="ib-btn ib-btn--secondary" type="button" @click="emit('close')">Close</button>
        </div>
      </div>

      <article
        v-for="(page, pageIndex) in pages"
        :key="`${page.candidateIndex}-${page.continued ? 'c' : 'f'}-${page.questionOffset}-${page.questions.length}-${page.showIntro}-${page.showOutro}`"
        class="ib-sheet"
      >
        <div class="ib-sheet__inner" :ref="(el) => setInnerRef(pageIndex, el)">
          <header v-if="!page.continued" class="ib-head">
            <div class="ib-head__top">
              <div class="ib-head__titles">
                <p class="ib-prod">{{ production.naam || 'Production' }}</p>
                <p v-if="production.when" class="ib-when">{{ production.when }}</p>
              </div>
              <img
                class="ib-logo"
                src="/images/logos/ES_logo_pos.png"
                alt="Eventshoot.nl"
                width="160"
                height="36"
              />
            </div>
            <p v-if="production.serie" class="ib-serie">{{ production.serie }}</p>

            <div class="ib-block">
              <div class="ib-label">Production</div>
              <dl class="ib-facts">
                <template v-if="production.locatie">
                  <dt>Where</dt>
                  <dd>{{ production.locatie }}</dd>
                </template>
                <template v-if="production.status">
                  <dt>Status</dt>
                  <dd>{{ production.status }}</dd>
                </template>
                <template v-if="production.crew.length">
                  <dt>Crew</dt>
                  <dd>{{ production.crew.join(', ') }}</dd>
                </template>
              </dl>
            </div>

            <div v-if="candidateAt(page.candidateIndex)" class="ib-person">
              <div class="ib-label">
                Candidate
                <span v-if="candidateCount > 1" class="ib-label__count">{{ page.candidateIndex + 1 }} of {{ candidateCount }}</span>
              </div>
              <h1 class="ib-name">{{ candidateAt(page.candidateIndex)?.naam || 'Name' }}</h1>
              <p v-if="candidateAt(page.candidateIndex)?.functie" class="ib-role">
                {{ candidateAt(page.candidateIndex)?.functie }}
              </p>
              <p v-if="candidateAt(page.candidateIndex)?.organisatie" class="ib-org">
                {{ candidateAt(page.candidateIndex)?.organisatie }}
              </p>
              <p v-if="candidateAt(page.candidateIndex)?.meta" class="ib-meta">
                {{ candidateAt(page.candidateIndex)?.meta }}
              </p>
              <p v-if="candidateAt(page.candidateIndex)?.planning" class="ib-planning">
                {{ candidateAt(page.candidateIndex)?.planning }}
              </p>
            </div>

            <div class="ib-block">
              <div class="ib-label">Interviewed by</div>
              <template v-if="candidateAt(page.candidateIndex)?.moderator">
                <p class="ib-mod-name">{{ candidateAt(page.candidateIndex)?.moderator }}</p>
                <p v-if="candidateAt(page.candidateIndex)?.moderatorFunctie" class="ib-mod-role">
                  {{ candidateAt(page.candidateIndex)?.moderatorFunctie }}
                </p>
              </template>
              <p v-else class="ib-empty">Not set yet</p>
            </div>
          </header>

          <header v-else class="ib-head">
            <div class="ib-head__top">
              <div class="ib-head__titles">
                <p class="ib-prod">{{ production.naam || 'Production' }}</p>
                <p class="ib-continued">{{ candidateAt(page.candidateIndex)?.naam || 'Candidate' }} · continued</p>
              </div>
              <img
                class="ib-logo"
                src="/images/logos/ES_logo_pos.png"
                alt="Eventshoot.nl"
                width="160"
                height="36"
              />
            </div>
          </header>

          <div
            v-if="page.showIntro && candidateAt(page.candidateIndex)?.intro.trim()"
            class="ib-block"
          >
            <div class="ib-label">Intro</div>
            <p class="ib-text">{{ candidateAt(page.candidateIndex)?.intro }}</p>
          </div>

          <div v-if="page.questions.length" class="ib-block">
            <div class="ib-label">{{ page.questionOffset === 0 ? 'Questions' : 'Questions (continued)' }}</div>
            <ol class="ib-questions">
              <li v-for="(q, i) in page.questions" :key="`${page.questionOffset}-${i}`">
                <span class="ib-qnum">{{ page.questionOffset + i + 1 }}.</span>
                <span>{{ q }}</span>
              </li>
            </ol>
          </div>

          <div
            v-if="page.showOutro && candidateAt(page.candidateIndex)?.outro.trim()"
            class="ib-block"
          >
            <div class="ib-label">Outro</div>
            <p class="ib-text">{{ candidateAt(page.candidateIndex)?.outro }}</p>
          </div>

          <p
            v-if="!page.continued && !hasScript(candidateAt(page.candidateIndex))"
            class="ib-empty"
          >
            No questions yet
          </p>
        </div>
        <p class="ib-foot">{{ pageIndex + 1 }} / {{ pages.length }}</p>
      </article>

      <p v-if="!embedded" class="ib-hint no-print">
        Vodcast Production Overview. Use Print / Save as PDF. A candidate continues on the next page when the questions do not fit.
      </p>
    </div>
  </Teleport>
</template>

<style scoped>
.interview-brief-print {
  position: fixed;
  inset: 0;
  z-index: 5000;
  overflow: auto;
  background: rgba(49, 159, 232, 0.72);
  padding: 1rem 1rem 2rem;
  color: #fff;
  font-family: var(--font-base, system-ui, sans-serif);
}

.interview-brief-print.interview-brief-print--embedded {
  position: static;
  inset: auto;
  z-index: auto;
  overflow: visible;
  background: transparent;
  padding: 0;
  color: #111;
}

.ib-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  max-width: 210mm;
  margin: 0 auto 1rem;
  color: #fff;
}

.ib-toolbar__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}

.ib-toolbar__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ib-btn {
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

.ib-btn--primary {
  background: #ff7b00;
  color: #fff;
}

.ib-btn--primary:hover {
  background: #e06e00;
}

.ib-btn--secondary {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}

.ib-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.28);
}

.ib-sheet {
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  padding: 12mm 14mm 8mm;
  box-sizing: border-box;
  background: #fff;
  color: #111;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 20, 60, 0.18);
  display: flex;
  flex-direction: column;
}

.ib-sheet + .ib-sheet {
  margin-top: 10mm;
}

.interview-brief-print--embedded .ib-sheet:first-child {
  margin-top: 10mm;
}

.ib-sheet__inner {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 3.2mm;
}

.ib-sheet__inner > * {
  flex: 0 0 auto;
}

.ib-head__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6mm;
}

.ib-head__titles {
  min-width: 0;
  flex: 1 1 auto;
}

.ib-logo {
  flex: 0 0 auto;
  width: 38mm;
  height: auto;
  display: block;
}

.ib-prod {
  margin: 0;
  font-size: 10pt;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.25;
}

.ib-when,
.ib-continued {
  margin: 0.8mm 0 0;
  font-size: 11pt;
  line-height: 1.3;
  color: #222;
}

.ib-continued {
  font-weight: 600;
}

.ib-serie {
  margin: 1.5mm 0 0;
  font-size: 12pt;
  font-weight: 600;
  color: #1b9cfc;
  line-height: 1.3;
}

.ib-block {
  display: flex;
  flex-direction: column;
  gap: 1mm;
}

.ib-label {
  font-size: 10pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #1b9cfc;
}

.ib-label__count {
  margin-left: 2mm;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  color: #5aa7e0;
}

.ib-facts {
  display: grid;
  grid-template-columns: 22mm 1fr;
  column-gap: 3mm;
  row-gap: 1.2mm;
  margin: 0;
}

.ib-facts dt {
  margin: 0;
  font-size: 9pt;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #1b9cfc;
}

.ib-facts dd {
  margin: 0;
  font-size: 12pt;
  line-height: 1.3;
  color: #111;
}

.ib-person {
  display: flex;
  flex-direction: column;
  gap: 0.6mm;
  margin-top: 1mm;
  padding-top: 3mm;
  border-top: 0.35mm solid #e4e4e7;
}

.ib-name {
  margin: 0;
  font-size: 22pt;
  line-height: 1.12;
  font-weight: 700;
  color: #111;
}

.ib-role,
.ib-org,
.ib-meta,
.ib-planning,
.ib-mod-name,
.ib-mod-role {
  margin: 0;
  line-height: 1.3;
  color: #222;
}

.ib-role,
.ib-mod-name {
  font-size: 13pt;
}

.ib-org,
.ib-mod-role,
.ib-planning {
  font-size: 12pt;
  color: #444;
}

.ib-meta {
  margin-top: 0.6mm;
  font-size: 11pt;
  color: #555;
}

.ib-text {
  margin: 0;
  font-size: 12pt;
  line-height: 1.35;
  white-space: pre-wrap;
  color: #111;
}

.ib-questions {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ib-questions li {
  display: flex;
  gap: 2.5mm;
  margin-bottom: 2.2mm;
  font-size: 12.5pt;
  line-height: 1.32;
  color: #111;
}

.ib-questions li > span:last-child {
  flex: 1 1 auto;
  min-width: 0;
}

.ib-qnum {
  flex: 0 0 auto;
  font-weight: 700;
  color: #1b9cfc;
}

.ib-empty {
  margin: 0;
  color: #888;
  font-style: italic;
  font-size: 12.5pt;
}

.ib-foot {
  flex: 0 0 auto;
  margin: 2mm 0 0;
  font-size: 9pt;
  color: #888;
  text-align: right;
}

.ib-hint {
  max-width: 210mm;
  margin: 0.75rem auto 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

@media print {
  .interview-brief-print {
    position: static !important;
    inset: auto !important;
    background: #fff !important;
    padding: 0 !important;
    overflow: visible !important;
    color: #111 !important;
  }

  .ib-sheet {
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    break-after: page;
    page-break-after: always;
  }

  .ib-sheet:last-child {
    break-after: auto;
    page-break-after: auto;
  }

  .ib-sheet,
  .ib-sheet__inner,
  .ib-label,
  .ib-serie,
  .ib-qnum,
  .ib-facts dt {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .ib-logo {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }

  html,
  body {
    background: #fff !important;
    color: #111 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  body.ia-brief-print-open #app {
    display: none !important;
  }

  body.ia-brief-print-open .interview-brief-print {
    display: block !important;
    background: #fff !important;
  }

  body.ia-brief-print-open .no-print {
    display: none !important;
  }
}
</style>
