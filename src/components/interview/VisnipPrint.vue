<script setup lang="ts">
import { onUnmounted, watch } from 'vue'

export type VisnipSnippetLine = {
  title: string
  start: string
  end: string
  search: string
  check: string
}

export type VisnipSection = {
  naam: string
  functie: string
  organisatie: string
  when: string
  snippets: VisnipSnippetLine[]
  error: string
}

const props = defineProps<{
  open: boolean
  productionName: string
  productionWhen: string
  sections: VisnipSection[]
}>()

const emit = defineEmits<{
  close: []
}>()

let previousTitle = ''

watch(
  () => props.open,
  (open) => {
    document.body.classList.toggle('ia-brief-print-open', open)
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.classList.remove('ia-brief-print-open')
  if (previousTitle) {
    document.title = previousTitle
    previousTitle = ''
  }
})

function pdfFileBaseName(): string {
  const prod = props.productionName.trim()
  const raw = prod ? `VISNIP PDF - ${prod}` : 'VISNIP PDF'
  return raw.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim()
}

function printList() {
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

function personLine(section: VisnipSection): string {
  return [section.functie, section.organisatie].filter(Boolean).join(', ')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="interview-brief-print visnip-print"
      role="dialog"
      aria-modal="true"
      aria-label="VISNIP PDF"
    >
      <div class="vs-toolbar no-print">
        <h2 class="vs-toolbar__title">VISNIP PDF · {{ productionName || 'Production' }}</h2>
        <div class="vs-toolbar__actions">
          <button class="vs-btn vs-btn--primary" type="button" @click="printList">Print / Save as PDF</button>
          <button class="vs-btn vs-btn--secondary" type="button" @click="emit('close')">Close</button>
        </div>
      </div>

      <article v-for="(section, index) in sections" :key="`${section.naam}-${index}`" class="vs-sheet">
        <header class="vs-head">
          <div>
            <p class="vs-kicker">{{ productionName || 'Production' }}</p>
            <p v-if="productionWhen" class="vs-when">{{ productionWhen }}</p>
          </div>
          <img
            class="vs-logo"
            src="/images/logos/ES_logo_pos.png"
            alt="Eventshoot.nl"
            width="160"
            height="36"
          />
        </header>

        <p class="vs-label">
          Vodcast {{ index + 1 }} of {{ sections.length }}
        </p>
        <h1 class="vs-name">{{ section.naam }}</h1>
        <p v-if="personLine(section)" class="vs-role">{{ personLine(section) }}</p>
        <p v-if="section.when" class="vs-when">{{ section.when }}</p>

        <p v-if="section.error" class="vs-error">{{ section.error }}</p>
        <ol v-else class="vs-list">
          <li v-for="(snippet, snippetIndex) in section.snippets" :key="snippetIndex">
            <p class="vs-title">{{ snippetIndex + 1 }}. {{ snippet.title }}</p>
            <p class="vs-time">{{ snippet.start }} → {{ snippet.end }}</p>
            <p class="vs-search">{{ snippet.search }}</p>
            <p v-if="snippet.check" class="vs-check">Check audio: {{ snippet.check }}</p>
          </li>
        </ol>
        <p class="vs-foot">20 to 40 seconds. The editor checks the audio, especially numbers and product names, then trims.</p>
      </article>
    </div>
  </Teleport>
</template>

<style scoped>
.visnip-print {
  position: fixed;
  inset: 0;
  z-index: 80;
  overflow: auto;
  padding: 1.25rem 1rem 2rem;
  background: rgba(8, 16, 32, 0.72);
}

.vs-toolbar {
  max-width: 210mm;
  margin: 0 auto 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.vs-toolbar__title {
  margin: 0;
  color: #fff;
  font-size: 1.05rem;
}

.vs-toolbar__actions {
  display: flex;
  gap: 0.5rem;
}

.vs-btn {
  border: 0;
  border-radius: 8px;
  padding: 0.55rem 0.9rem;
  font: inherit;
  cursor: pointer;
}

.vs-btn--primary {
  background: #ff7b00;
  color: #fff;
}

.vs-btn--secondary {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}

.vs-sheet {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto 10mm;
  padding: 14mm 16mm;
  box-sizing: border-box;
  background: #fff;
  color: #111;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 20, 60, 0.18);
}

.vs-head {
  display: flex;
  justify-content: space-between;
  gap: 8mm;
  align-items: flex-start;
}

.vs-kicker {
  margin: 0;
  font-size: 10pt;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #555;
}

.vs-when {
  margin: 1mm 0 0;
  font-size: 11pt;
}

.vs-logo {
  width: 38mm;
  height: auto;
}

.vs-label {
  margin: 8mm 0 1mm;
  font-size: 9pt;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #666;
}

.vs-name {
  margin: 0;
  font-size: 22pt;
  line-height: 1.15;
}

.vs-role {
  margin: 1.5mm 0 0;
  font-size: 12pt;
}

.vs-list {
  list-style: none;
  margin: 8mm 0 0;
  padding: 0;
}

.vs-list li + li {
  margin-top: 6mm;
  padding-top: 5mm;
  border-top: 0.3mm solid #ddd;
}

.vs-title {
  margin: 0;
  font-size: 13pt;
  font-weight: 700;
}

.vs-time {
  margin: 1.5mm 0 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11pt;
}

.vs-search {
  margin: 2mm 0 0;
  font-size: 11.5pt;
  line-height: 1.4;
}

.vs-check,
.vs-error {
  margin: 2mm 0 0;
  font-size: 10.5pt;
  color: #333;
}

.vs-foot {
  margin-top: 10mm;
  font-size: 9pt;
  color: #666;
}

@media print {
  .visnip-print {
    position: static;
    padding: 0;
    background: #fff;
  }

  .vs-sheet {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    break-after: page;
    page-break-after: always;
  }

  .vs-sheet:last-child {
    break-after: auto;
    page-break-after: auto;
  }
}
</style>
