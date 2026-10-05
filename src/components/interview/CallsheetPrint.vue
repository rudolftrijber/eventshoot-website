<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import InterviewBriefPrint, {
  type BriefCandidate,
  type BriefProduction,
} from '@/components/interview/InterviewBriefPrint.vue'
import type { CallsheetContact, CallsheetData, CallsheetGearRow, CallsheetProgramRow, CrewMember } from '@/types/interview'
import { DEFAULT_CREW_SLOT } from '@/types/interview'
import { dutchLongDate, formatUur, hydrateCrewDetails, normalizeCallsheet } from '@/utils/callsheet'

const props = defineProps<{
  open: boolean
  naam: string
  datum: string
  startTijd: string
  eindTijd: string
  locatieNaam: string
  land: string
  sheet: CallsheetData
  crewNames: string[]
  clientName: string
  clientContacts: CallsheetContact[]
  crewDirectory: CrewMember[]
  briefProduction: BriefProduction
  briefCandidates: BriefCandidate[]
}>()

const emit = defineEmits<{
  close: []
}>()

const PROGRAM_PER_PAGE = 16

const sheet = computed(() => hydrateCrewDetails(normalizeCallsheet(props.sheet), props.crewNames))
const dateLabel = computed(() => dutchLongDate(props.datum))
const dateHeading = computed(() => dateLabel.value ? dateLabel.value.charAt(0).toLowerCase() + dateLabel.value.slice(1) : '')
const subtitle = computed(() => [props.naam.trim(), props.locatieNaam.trim()].filter(Boolean).join(', '))
const programHref = computed(() => {
  const raw = sheet.value.programmaUrl.trim()
  if (!raw) return ''
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
})

const contacts = computed(() => {
  const fromClient = props.clientContacts.filter((row) => row.rol || row.naam || row.telefoon)
  const filled = fromClient.length
    ? fromClient
    : sheet.value.contacten.filter((row) => row.rol || row.naam || row.telefoon)
  if (filled.length) return filled
  return [
    { rol: '', naam: '', telefoon: '' },
    { rol: '', naam: '', telefoon: '' },
    { rol: '', naam: '', telefoon: '' },
  ]
})

const crewRows = computed(() => props.crewNames
  .map((naam, index) => {
    const name = (naam || '').trim()
    const known = props.crewDirectory.find((person) => person.naam === name)
    const stored = sheet.value.crewDetails[index]
    return {
      naam: name,
      rol: known ? known.rol : (stored?.rol || ''),
      telefoon: known ? known.telefoon : (stored?.telefoon || ''),
      callTijd: stored?.callTijd || '',
    }
  })
  .filter((row) => row.naam && row.naam !== DEFAULT_CREW_SLOT))

const programPages = computed(() => {
  const filled = sheet.value.programma.filter((row) => row.tijd || row.onderdeel || row.locatie || row.crew)
  const rows = filled.length
    ? filled
    : Array.from({ length: 8 }, () => ({ tijd: '', onderdeel: '', locatie: '', crew: '', highlight: false }))
  const pages: CallsheetProgramRow[][] = []
  for (let i = 0; i < rows.length; i += PROGRAM_PER_PAGE) {
    pages.push(rows.slice(i, i + PROGRAM_PER_PAGE))
  }
  return pages
})

const gearPages = computed(() => {
  const rows = sheet.value.apparatuur.length
    ? sheet.value.apparatuur
    : [{ categorie: 'Overig', omschrijving: '', aantal: '', ok: false }]
  const pages: CallsheetGearRow[][] = []
  for (let i = 0; i < rows.length; i += 18) pages.push(rows.slice(i, i + 18))
  return pages
})

const pageCount = computed(() => 1 + programPages.value.length + gearPages.value.length)
const hasBrief = computed(() => props.briefCandidates.length > 0)

function gearCategory(page: CallsheetGearRow[], index: number): string {
  const current = page[index]?.categorie || ''
  if (index === 0) return current
  return current === page[index - 1]?.categorie ? '' : current
}

function pdfFileBaseName(): string {
  const name = props.naam.trim()
  return (name ? `Callsheet - ${name}` : 'Callsheet').replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim()
}

let previousTitle = ''

function printSheet() {
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

watch(
  () => props.open,
  (open) => {
    document.body.classList.toggle('ia-brief-print-open', open)
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.classList.remove('ia-brief-print-open')
  if (previousTitle) document.title = previousTitle
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="callsheet-print"
      :class="{ 'callsheet-print--no-brief': !hasBrief }"
      role="dialog"
      aria-modal="true"
      aria-label="Callsheet"
    >
      <div class="cs-toolbar no-print">
        <h2 class="cs-toolbar__title">Callsheet{{ naam.trim() ? ` · ${naam.trim()}` : '' }}</h2>
        <div class="cs-toolbar__actions">
          <button class="cs-btn cs-btn--primary" type="button" @click="printSheet">Print / Save as PDF</button>
          <button class="cs-btn cs-btn--secondary" type="button" @click="emit('close')">Close</button>
        </div>
      </div>

      <article class="cs-sheet">
        <header class="cs-top">
          <div>
            <p class="cs-kicker">Callsheet</p>
            <h1 class="cs-title">Callsheet{{ dateHeading ? `, ${dateHeading}` : '' }}</h1>
            <p v-if="subtitle" class="cs-sub">{{ subtitle }}</p>
          </div>
          <p class="cs-brand">Eventshoot.nl</p>
        </header>

        <h2 class="cs-section">1 Algemene informatie</h2>
        <table class="cs-facts">
          <tbody>
            <tr>
              <th>Event</th>
              <td>{{ naam || '' }}</td>
              <th>Datum</th>
              <td>{{ dateLabel }}</td>
            </tr>
            <tr>
              <th>Opdrachtgever</th>
              <td>{{ clientName || sheet.opdrachtgever }}</td>
              <th>Parkeren</th>
              <td>{{ sheet.parkeren }}</td>
            </tr>
            <tr>
              <th>Locatie naam</th>
              <td>{{ locatieNaam }}</td>
              <th>Locatie adres</th>
              <td>{{ sheet.locatieAdres }}</td>
            </tr>
            <tr>
              <th>Locatie plaats</th>
              <td>{{ sheet.locatiePlaats }}</td>
              <th>Locatie land</th>
              <td>{{ land }}</td>
            </tr>
            <tr>
              <th>Start event</th>
              <td>{{ formatUur(startTijd) }}</td>
              <th>Einde event</th>
              <td>{{ formatUur(eindTijd) }}</td>
            </tr>
          </tbody>
        </table>

        <h3 class="cs-label">Crew kleding</h3>
        <p class="cs-text">{{ sheet.crewKleding }}</p>

        <h3 class="cs-label">Informatie / link</h3>
        <p class="cs-text">
          <a v-if="programHref" class="cs-link" :href="programHref">{{ sheet.programmaUrl }}</a>
        </p>

        <h3 class="cs-label">Contactpersonen opdrachtgever</h3>
        <table class="cs-table">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Naam</th>
              <th>Telefoon</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contact, index) in contacts" :key="`c-${index}`">
              <td>{{ contact.rol }}</td>
              <td>{{ contact.naam }}</td>
              <td>{{ contact.telefoon }}</td>
            </tr>
          </tbody>
        </table>

        <h3 class="cs-label">Crew members</h3>
        <table class="cs-table">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Naam</th>
              <th>Telefoon</th>
              <th>Call tijd</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in crewRows" :key="`crew-${index}`">
              <td>{{ member.rol }}</td>
              <td>{{ member.naam }}</td>
              <td>{{ member.telefoon }}</td>
              <td>{{ member.callTijd ? formatUur(member.callTijd) : '' }}</td>
            </tr>
            <tr v-if="!crewRows.length">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <footer class="cs-foot">
          <p>Vragen? Bel of app Rolf Trijber op 06 251 777 28 of mail rolf@eventshoot.nl.</p>
          <p>Eventshoot.nl, interne callsheet, niet voor verspreiding buiten het team.</p>
          <span>1 / {{ pageCount }}</span>
        </footer>
      </article>

      <article
        v-for="(rows, pageIndex) in programPages"
        :key="`program-${pageIndex}`"
        class="cs-sheet"
      >
        <header class="cs-top cs-top--compact">
          <div>
            <p class="cs-kicker">Callsheet</p>
            <h2 class="cs-section cs-section--page">2 Programma en tijdschema</h2>
          </div>
          <p class="cs-brand">Eventshoot.nl</p>
        </header>
        <p v-if="pageIndex === 0" class="cs-lead">
          Vul hieronder het tijdschema van de dag in. Markeer tijdgebonden of belangrijke momenten, zoals een keynote, dik of gearceerd, zodat ze voor de crew in één oogopslag opvallen.
        </p>
        <table class="cs-table">
          <thead>
            <tr>
              <th class="cs-col-time">Tijd</th>
              <th>Programma-onderdeel</th>
              <th>Locatie / zaal</th>
              <th>Crew</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="`p-${pageIndex}-${index}`" :class="{ 'cs-row--mark': row.highlight }">
              <td>{{ row.tijd ? formatUur(row.tijd) : '' }}</td>
              <td>{{ row.onderdeel }}</td>
              <td>{{ row.locatie }}</td>
              <td>{{ row.crew }}</td>
            </tr>
          </tbody>
        </table>
        <footer class="cs-foot">
          <p>Vragen? Bel of app Rolf Trijber op 06 251 777 28 of mail rolf@eventshoot.nl.</p>
          <p>Eventshoot.nl, interne callsheet, niet voor verspreiding buiten het team.</p>
          <span>{{ pageIndex + 2 }} / {{ pageCount }}</span>
        </footer>
      </article>

      <article
        v-for="(rows, pageIndex) in gearPages"
        :key="`gear-${pageIndex}`"
        class="cs-sheet"
        :class="{ 'cs-sheet--last': !hasBrief && pageIndex === gearPages.length - 1 }"
      >
        <header class="cs-top cs-top--compact">
          <div>
            <p class="cs-kicker">Callsheet</p>
            <h2 class="cs-section cs-section--page">3 Apparatuur en materiaal</h2>
          </div>
          <p class="cs-brand">Eventshoot.nl</p>
        </header>
        <p v-if="pageIndex === 0" class="cs-lead">
          Vink per categorie af welke apparatuur is ingepakt. Pas de categorieën aan op de productie, of vul een eigen categorie in.
        </p>
        <table class="cs-table">
          <thead>
            <tr>
              <th>Omschrijving</th>
              <th class="cs-col-qty">Aantal</th>
              <th class="cs-col-ok">Ok</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, index) in rows" :key="`g-${pageIndex}-${index}`">
              <tr v-if="gearCategory(rows, index)" class="cs-row--cat">
                <td colspan="3">{{ gearCategory(rows, index) }}</td>
              </tr>
              <tr>
                <td>{{ row.omschrijving }}</td>
                <td>{{ row.aantal }}</td>
                <td>
                  <span class="cs-box" :class="{ 'cs-box--on': row.ok }" aria-hidden="true"></span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <footer class="cs-foot">
          <p>Vragen? Bel of app Rolf Trijber op 06 251 777 28 of mail rolf@eventshoot.nl.</p>
          <p>Eventshoot.nl, interne callsheet, niet voor verspreiding buiten het team.</p>
          <span>{{ 1 + programPages.length + pageIndex + 1 }} / {{ pageCount }}</span>
        </footer>
      </article>

      <InterviewBriefPrint
        v-if="hasBrief"
        embedded
        :open="open"
        :production="briefProduction"
        :candidates="briefCandidates"
      />

      <p class="cs-hint no-print">
        Eerst het callsheet, daarna het interviewprogramma. Gebruik Print / Save as PDF.
      </p>
    </div>
  </Teleport>
</template>

<style scoped>
.callsheet-print {
  position: fixed;
  inset: 0;
  z-index: 5000;
  overflow: auto;
  background: rgba(49, 159, 232, 0.72);
  padding: 1rem 1rem 2rem;
  color: #fff;
  font-family: var(--font-base, "Segoe UI", Calibri, sans-serif);
}

.cs-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  max-width: 210mm;
  margin: 0 auto 1rem;
}

.cs-toolbar__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.cs-toolbar__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cs-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.5rem 0.95rem;
  border-radius: 8px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.cs-btn--primary {
  background: #ff7b00;
  color: #fff;
}

.cs-btn--secondary {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}

.cs-sheet {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 12mm 12mm 10mm;
  box-sizing: border-box;
  background: #fff;
  color: #111;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 20, 60, 0.18);
  display: flex;
  flex-direction: column;
}

.cs-sheet + .cs-sheet {
  margin-top: 10mm;
}

.cs-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8mm;
  margin-bottom: 5mm;
}

.cs-top--compact {
  margin-bottom: 3mm;
}

.cs-kicker,
.cs-section,
.cs-label {
  color: #1b9cfc;
}

.cs-kicker {
  margin: 0;
  font-size: 11pt;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cs-title {
  margin: 1mm 0 0;
  font-size: 16pt;
  line-height: 1.2;
  font-weight: 700;
  color: #111;
}

.cs-sub {
  margin: 1.5mm 0 0;
  font-size: 11pt;
  line-height: 1.3;
  color: #333;
}

.cs-brand {
  margin: 1mm 0 0;
  flex: 0 0 auto;
  font-size: 13pt;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111;
  line-height: 1;
}

.cs-section {
  margin: 0 0 2.5mm;
  font-size: 13pt;
  font-weight: 700;
}

.cs-section--page {
  margin-top: 1mm;
  color: #1b9cfc;
}

.cs-label {
  margin: 4mm 0 1mm;
  font-size: 10pt;
  font-weight: 700;
}

.cs-text,
.cs-lead {
  margin: 0;
  font-size: 10.5pt;
  line-height: 1.35;
  color: #222;
}

.cs-lead {
  margin-bottom: 3mm;
}

.cs-link {
  color: #1b9cfc;
  word-break: break-all;
}

.cs-facts,
.cs-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.cs-facts th,
.cs-facts td,
.cs-table th,
.cs-table td {
  border: 0.25mm solid #c5d0dc;
  padding: 1.6mm 2mm;
  font-size: 10pt;
  line-height: 1.3;
  vertical-align: top;
  text-align: left;
}

.cs-facts th,
.cs-table th {
  width: 32mm;
  background: #f3f8fd;
  color: #145f96;
  font-weight: 700;
}

.cs-facts td {
  width: auto;
}

.cs-table {
  margin-top: 1mm;
}

.cs-col-time {
  width: 28mm;
}

.cs-col-qty {
  width: 22mm;
}

.cs-col-ok {
  width: 16mm;
}

.cs-row--mark td {
  background: #e8f4fd;
  font-weight: 700;
}

.cs-row--cat td {
  background: #f7f7f8;
  font-weight: 700;
  color: #145f96;
}

.cs-box {
  display: inline-block;
  width: 4.2mm;
  height: 4.2mm;
  border: 0.4mm solid #145f96;
  border-radius: 0.4mm;
  vertical-align: middle;
}

.cs-box--on {
  background: #1b9cfc;
  box-shadow: inset 0 0 0 0.7mm #fff;
}

.cs-foot {
  margin-top: auto;
  padding-top: 4mm;
  font-size: 8.5pt;
  line-height: 1.35;
  color: #555;
}

.cs-foot p {
  margin: 0;
}

.cs-foot span {
  display: block;
  margin-top: 1mm;
  text-align: right;
}

.cs-hint {
  max-width: 210mm;
  margin: 0.75rem auto 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.92);
}

@media print {
  .callsheet-print {
    position: static !important;
    background: #fff !important;
    padding: 0 !important;
    overflow: visible !important;
    color: #111 !important;
  }

  .cs-sheet {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    break-after: page;
    page-break-after: always;
  }

  .cs-sheet--last {
    break-after: auto;
    page-break-after: auto;
  }

  .cs-kicker,
  .cs-section,
  .cs-label,
  .cs-facts th,
  .cs-table th,
  .cs-row--mark td,
  .cs-row--cat td,
  .cs-box--on {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>

<style>
@media print {
  body.ia-brief-print-open .callsheet-print {
    display: block !important;
    position: static !important;
    background: #fff !important;
    padding: 0 !important;
    overflow: visible !important;
  }
}
</style>
