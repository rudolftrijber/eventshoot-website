<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useInterviewStore } from '@/stores/interviewStore'
import type { Gast, Productie, TabId } from '@/types/interview'
import { GAST_TYPES, PRODUCTIE_STATUSES } from '@/types/interview'
import {
  csvRowToGuestPayload,
  downloadText,
  guestsToCSV,
  lowerthirdCSV,
  parseCSV,
  todayStr,
} from '@/utils/interviewCsv'
import '@/assets/interview-app.css'
import {
  ArchiveBoxIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  MicrophoneIcon,
  PlusCircleIcon,
  QueueListIcon,
  VideoCameraIcon,
} from '@heroicons/vue/24/outline'
import type { Component } from 'vue'

const store = useInterviewStore()

const password = ref('')
const loginError = ref('')
const toast = ref('')
const settingsOpen = ref(false)
const searchBox = ref('')

// Nieuw form
const editingId = ref<string | null>(null)
const fProductie = ref('')
const fType = ref('')
const fNaam = ref('')
const fFunctie = ref('')
const fPlanning = ref('')
const fGedeeld = ref(false)
const fQuestions = ref<string[]>(['', '', '', ''])

// Productie form
const editingProdId = ref<string | null>(null)
const pNaam = ref('')
const pDatum = ref('')
const pStatus = ref<Productie['status']>('Gepland')
const pQuestions = ref<string[]>(['', '', '', ''])

// Controle
const controleThanks = ref(false)
const controleNaam = ref('')
const controleFunctie = ref('')

// Camera / Interviewer search
const camSearch = ref('')
const intSearch = ref('')
const showCamQuestions = ref(false)

// Confirm dialogs
const confirmOpgenomen = ref(false)

let toastTimer: ReturnType<typeof setTimeout> | null = null

const tabs: { id: TabId; label: string; icon: Component }[] = [
  { id: 'nieuw', label: 'Nieuw', icon: PlusCircleIcon },
  { id: 'overzicht', label: 'Overzicht', icon: QueueListIcon },
  { id: 'producties', label: 'Producties', icon: CalendarDaysIcon },
  { id: 'controle', label: 'Controle', icon: ClipboardDocumentCheckIcon },
  { id: 'camera', label: 'Camera', icon: VideoCameraIcon },
  { id: 'interviewer', label: 'Interviewer', icon: MicrophoneIcon },
  { id: 'dashboard', label: 'Dashboard', icon: ChartBarSquareIcon },
  { id: 'archief', label: 'Archief', icon: ArchiveBoxIcon },
]

const sortedProductions = computed(() =>
  [...store.activeProductions].sort((a, b) => a.naam.localeCompare(b.naam, 'nl')),
)

const fProductieCustom = ref(false)

const maxChars = computed(() => store.settings.maxChars)

function useProductieSelect() {
  fProductieCustom.value = false
  if (!sortedProductions.value.some((p) => p.naam === fProductie.value)) {
    fProductie.value = ''
  }
}

function useProductieCustom() {
  fProductieCustom.value = true
  fProductie.value = ''
}

const naamOverLimit = computed(() => fNaam.value.length > maxChars.value)
const functieOverLimit = computed(() => fFunctie.value.length > maxChars.value)
const controleFunctieOver = computed(() => controleFunctie.value.length > maxChars.value)

const deelnemerPreset = computed(() => {
  if (fType.value !== 'Deelnemer') return null
  return store.activeProductions.find(
    (p) => p.naam.trim().toLowerCase() === fProductie.value.trim().toLowerCase(),
  )
})

const filteredGuests = computed(() => {
  const q = searchBox.value.toLowerCase()
  return [...store.guests]
    .filter((g) => !q || [g.naam, g.functie, g.regienummer, g.productieNaam].join(' ').toLowerCase().includes(q))
    .sort((a, b) => (a.datum || 'zzz').localeCompare(b.datum || 'zzz')
      || ((parseInt(a.regienummer) || 9999) - (parseInt(b.regienummer) || 9999)))
})

const controleCandidates = computed(() =>
  store.guests.filter((g) => g.status === 'Ingevoerd'),
)

const camGuest = computed(() => {
  if (store.activeGuest) return store.activeGuest
  if (!camSearch.value.trim()) return null
  return store.guests.find((g) => g.regienummer === camSearch.value.trim()) || null
})

const intGuest = computed(() => {
  if (store.activeGuest && store.activeTab === 'interviewer') return store.activeGuest
  const q = intSearch.value.trim()
  if (!q) return store.activeGuest
  return store.guests.find((g) =>
    g.regienummer === q || g.naam.toLowerCase().includes(q.toLowerCase()),
  ) || null
})

const camHeaderDate = computed(() => camGuest.value?.datum || todayStr())
const camHeaderTime = computed(() => camGuest.value?.tijd || new Date().toTimeString().slice(0, 5))

const addFQ = () => addQuestion(fQuestions)
const removeFQ = (i: number) => removeQuestion(fQuestions, i)
const addPQ = () => addQuestion(pQuestions)
const removePQ = (i: number) => removeQuestion(pQuestions, i)

function showToast(msg: string) {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2000)
}

async function handleLogin() {
  loginError.value = ''
  try {
    await store.login(password.value)
    password.value = ''
  } catch (e) {
    loginError.value = e instanceof Error ? e.message : 'Inloggen mislukt'
  }
}

function addQuestion(list: { value: string[] }) {
  if (list.value.length >= 7) { showToast('Maximaal 7 vragen'); return }
  list.value.push('')
}

function removeQuestion(list: { value: string[] }, idx: number) {
  if (list.value.length <= 4) { showToast('Minimaal 4 vragen'); return }
  list.value.splice(idx, 1)
}

function resetQuestions(list: { value: string[] }, values?: string[]) {
  list.value = values?.length ? [...values] : ['', '', '', '']
  while (list.value.length < 4) list.value.push('')
}

function clearForm() {
  editingId.value = null
  fProductie.value = ''
  fProductieCustom.value = false
  fType.value = ''
  fPlanning.value = ''
  fGedeeld.value = false
  fNaam.value = ''
  fFunctie.value = ''
  resetQuestions(fQuestions)
}

async function saveGuest() {
  const naam = fNaam.value.trim()
  const functie = fFunctie.value.trim()
  if (!naam) { showToast('Vul een naam in'); return }
  if (naam.length > maxChars.value || functie.length > maxChars.value) {
    showToast(`Naam en functie max. ${maxChars.value} tekens`)
    return
  }
  const questions = fQuestions.value.map((q) => q.trim())
  const payload = {
    productieNaam: fProductie.value.trim(),
    type: fType.value,
    naam,
    functie,
    planning: fPlanning.value.trim(),
    gedeeld: fGedeeld.value,
    questions,
  }
  try {
    if (editingId.value) {
      await store.updateGuest(editingId.value, payload)
    } else {
      await store.createGuest(payload)
    }
    showToast('Opgeslagen')
    clearForm()
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Opslaan mislukt')
  }
}

function loadForEdit(g: Gast) {
  editingId.value = g.id
  fProductie.value = g.productieNaam
  fProductieCustom.value = !sortedProductions.value.some((p) => p.naam === g.productieNaam)
  fType.value = g.type
  fPlanning.value = g.planning
  fGedeeld.value = g.gedeeld
  fNaam.value = g.naam
  fFunctie.value = g.functie
  resetQuestions(fQuestions, g.questions)
  store.setTab('nieuw')
}

function usePreset() {
  const preset = deelnemerPreset.value
  if (!preset?.vragen?.some((q) => q)) return
  const hasContent = fQuestions.value.some((q) => q.trim())
  if (hasContent && !confirm('Huidige vragen overschrijven met standaardvragen?')) return
  resetQuestions(fQuestions, preset.vragen)
}

async function saveProductie() {
  const naam = pNaam.value.trim()
  if (!naam) { showToast('Vul een productienaam in'); return }
  try {
    await store.saveProduction({
      id: editingProdId.value || undefined,
      naam,
      datum: pDatum.value,
      status: pStatus.value,
      vragen: pQuestions.value.map((q) => q.trim()),
    })
    showToast('Productie opgeslagen')
    clearProductieForm()
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Opslaan mislukt')
  }
}

function clearProductieForm() {
  editingProdId.value = null
  pNaam.value = ''
  pDatum.value = ''
  pStatus.value = 'Gepland'
  resetQuestions(pQuestions)
}

function editProductie(p: Productie) {
  editingProdId.value = p.id
  pNaam.value = p.naam
  pDatum.value = p.datum
  pStatus.value = p.status
  resetQuestions(pQuestions, p.vragen)
}

function openControle(g: Gast) {
  store.selectGuest(g.id)
  controleThanks.value = false
  controleNaam.value = g.naam
  controleFunctie.value = g.functie
}

async function confirmControle() {
  if (!store.activeGuest) return
  if (controleFunctie.value.length > maxChars.value) {
    showToast(`Functie max. ${maxChars.value} tekens, kort in`)
    return
  }
  try {
    await store.finalizeGuest(store.activeGuest.id, controleNaam.value.trim(), controleFunctie.value.trim())
    controleThanks.value = true
    showToast('Bevestigd')
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Bevestigen mislukt')
  }
}

function goToCameraAfterThanks() {
  controleThanks.value = false
  showCamQuestions.value = false
  store.setTab('camera')
}

async function deleteArchivedProduction(p: Productie) {
  if (!confirm(`Weet je zeker dat je productie "${p.naam}" definitief wilt verwijderen?`)) return
  await store.deleteProduction(p.id)
  showToast('Productie verwijderd')
}

function goToInterviewer() {
  showCamQuestions.value = true
  store.setTab('interviewer')
}

async function markOpgenomen() {
  if (!intGuest.value) return
  try {
    await store.updateGuest(intGuest.value.id, { status: 'Opgenomen' })
    confirmOpgenomen.value = false
    showToast('Gemarkeerd als opgenomen')
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Mislukt')
  }
}

async function resetGuestStatus(g: Gast) {
  const prev: Record<Gast['status'], Gast['status']> = {
    Opgenomen: 'Gecontroleerd',
    Gecontroleerd: 'Ingevoerd',
    Ingevoerd: 'Ingevoerd',
  }
  await store.updateGuest(g.id, { status: prev[g.status] })
  showToast('Status teruggezet')
}

function handleRowClick(g: Gast) {
  store.selectGuest(g.id)
  if (g.status === 'Ingevoerd') {
    openControle(g)
    store.setTab('controle')
  } else {
    camSearch.value = g.regienummer
    store.setTab('camera')
  }
}

function pillClass(status: Gast['status']) {
  return `ia-pill ia-pill--${status.toLowerCase()}`
}

function exportCsv() {
  downloadText(`interview-intake-${todayStr()}.csv`, guestsToCSV(store.guests), 'text/csv;charset=utf-8')
}

function exportTemplate() {
  downloadText(`interview-sjabloon-${todayStr()}.csv`, guestsToCSV([]), 'text/csv;charset=utf-8')
}

function exportLowerthird() {
  const list = store.guests.filter((g) => g.regienummer)
  downloadText(`lowerthird-${todayStr()}.csv`, lowerthirdCSV(list), 'text/csv;charset=utf-8')
}

function exportJson() {
  downloadText(`interview-intake-${todayStr()}.json`, JSON.stringify(store.guests, null, 2), 'application/json')
}

async function importCsv(file: File) {
  const text = await file.text()
  const rows = parseCSV(text)
  let added = 0
  for (const row of rows) {
    const payload = csvRowToGuestPayload(row)
    if (payload.naam) {
      await store.createGuest({
        ...payload,
        status: payload.status as Gast['status'],
      })
      added++
    }
  }
  showToast(`${added} gast(en) geïmporteerd`)
}

async function importJson(file: File) {
  const incoming = JSON.parse(await file.text()) as Gast[]
  let added = 0
  for (const g of incoming) {
    if (!store.guests.some((x) => x.id === g.id)) {
      await store.createGuest(g)
      added++
    }
  }
  showToast(`${added} gast(en) geïmporteerd`)
}

async function saveMaxChars() {
  await store.updateMaxChars(maxChars.value)
  showToast('Instelling opgeslagen')
}

onMounted(async () => {
  document.title = 'Interview App — Eventshoot.nl'
  const meta = document.querySelector('meta[name="robots"]') || document.createElement('meta')
  meta.setAttribute('name', 'robots')
  meta.setAttribute('content', 'noindex, nofollow')
  if (!meta.parentElement) document.head.appendChild(meta)

  const ok = await store.checkAuth()
  if (ok) {
    await store.sync()
    store.startPolling()
  }
})

onUnmounted(() => {
  store.stopPolling()
})

watch(() => store.activeTab, (tab) => {
  if (tab === 'controle') controleThanks.value = false
  if (tab === 'camera') showCamQuestions.value = false
})
</script>

<template>
  <div class="interview-app">
    <div class="ia-topbar">
      <img class="ia-topbar__logo" src="/images/logos/logo.svg" alt="Eventshoot.nl" />
    </div>

    <!-- Login -->
    <template v-if="!store.authenticated">
      <div class="ia-hero">
        <img
          class="ia-hero__img"
          src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_interview_5.jpg"
          alt="Interview opname op locatie"
        />
        <div class="ia-hero__overlay" />
        <div class="ia-hero__content">
          <h1>Interview App</h1>
        </div>
      </div>
      <div class="ia-body">
        <div class="ia-login">
          <div class="ia-login__card">
            <p>Log in met het crew-wachtwoord om gasten en interviews te beheren.</p>
            <label class="ia-label" for="pw">Wachtwoord</label>
            <input
              id="pw"
              v-model="password"
              class="ia-input"
              type="password"
              autocomplete="current-password"
              @keyup.enter="handleLogin"
            />
            <p v-if="loginError" class="ia-error">{{ loginError }}</p>
            <div class="ia-actions">
              <button class="ia-btn ia-btn--accent" type="button" @click="handleLogin">Inloggen</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- App -->
    <template v-else>
      <div class="ia-hero">
        <img
          class="ia-hero__img"
          src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/rolf_trijber_interview_5.jpg"
          alt="Interview opname op locatie"
        />
        <div class="ia-hero__overlay" />
        <div class="ia-hero__content">
          <h1>Interview App</h1>
        </div>
      </div>

      <div class="ia-body">
        <div class="ia-shell">
          <header class="ia-shell__nav">
            <div class="ia-tabs-wrap">
              <nav class="ia-tabs" aria-label="Interview app menu">
                <button
                  v-for="t in tabs"
                  :key="t.id"
                  class="ia-tab"
                  :class="{ active: store.activeTab === t.id }"
                  type="button"
                  :title="t.label"
                  @click="store.setTab(t.id)"
                >
                  <component :is="t.icon" class="ia-tab__icon" aria-hidden="true" />
                  <span class="ia-tab__label">{{ t.label }}</span>
                </button>
              </nav>
              <div class="ia-tabs-utils">
                <button
                  class="ia-tab ia-tab--util"
                  :class="{ active: settingsOpen }"
                  type="button"
                  title="Instellingen"
                  @click="settingsOpen = !settingsOpen"
                >
                  <Cog6ToothIcon class="ia-tab__icon" aria-hidden="true" />
                  <span class="ia-tab__label">Instellingen</span>
                </button>
                <button class="ia-tab ia-tab--util ia-tab--logout" type="button" title="Uitloggen" @click="store.logout()">
                  <ArrowRightOnRectangleIcon class="ia-tab__icon" aria-hidden="true" />
                  <span class="ia-tab__label">Uit</span>
                </button>
              </div>
            </div>
          </header>

      <div v-if="settingsOpen" class="ia-settings">
        <div class="ia-row">
          <label class="ia-label" style="margin:0">Max. tekens naam &amp; functie</label>
          <input
            class="ia-input"
            type="number"
            min="10"
            max="200"
            :value="store.settings.maxChars"
            style="max-width:100px"
            @change="(e) => store.settings.maxChars = parseInt((e.target as HTMLInputElement).value, 10)"
          />
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="saveMaxChars">Opslaan</button>
        </div>
        <div class="ia-actions">
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="exportJson">Export JSON</button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="exportCsv">Export CSV</button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="exportTemplate">Sjabloon CSV</button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="exportLowerthird">Lowerthird CSV</button>
          <label class="ia-btn ia-btn--small ia-btn--secondary" style="cursor:pointer">
            Import CSV
            <input type="file" accept=".csv,text/csv" hidden @change="(e) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) importCsv(f) }" />
          </label>
          <label class="ia-btn ia-btn--small ia-btn--secondary" style="cursor:pointer">
            Import JSON
            <input type="file" accept="application/json" hidden @change="(e) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) importJson(f) }" />
          </label>
        </div>
      </div>

      <main class="ia-shell__main">
        <!-- NIEUW -->
        <section v-if="store.activeTab === 'nieuw'">
          <div class="ia-card">
            <div class="ia-row">
              <div>
                <label class="ia-label">Productie</label>
                <template v-if="sortedProductions.length && !fProductieCustom">
                  <select v-model="fProductie" class="ia-select">
                    <option value="" disabled>— kies productie —</option>
                    <option v-for="p in sortedProductions" :key="p.id" :value="p.naam">{{ p.naam }}</option>
                  </select>
                  <button class="ia-link-btn" type="button" @click="useProductieCustom">Of typ een andere naam</button>
                </template>
                <template v-else-if="sortedProductions.length && fProductieCustom">
                  <input v-model="fProductie" class="ia-input" placeholder="typ productienaam" />
                  <button class="ia-link-btn" type="button" @click="useProductieSelect">← Kies uit lijst</button>
                </template>
                <template v-else>
                  <input v-model="fProductie" class="ia-input" placeholder="typ productienaam" />
                  <p class="ia-hint">
                    Nog geen producties.
                    <button class="ia-link-btn" type="button" @click="store.setTab('producties')">Maak er een aan onder Producties</button>
                  </p>
                </template>
              </div>
              <div>
                <label class="ia-label">Type gast</label>
                <select v-model="fType" class="ia-select">
                  <option value="">— optioneel —</option>
                  <option v-for="t in GAST_TYPES" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
            </div>
            <div class="ia-row">
              <div>
                <label class="ia-label">Naam gast</label>
                <input v-model="fNaam" class="ia-input" placeholder="Voor- en achternaam" />
                <div class="ia-charcount" :class="{ warn: naamOverLimit }">{{ fNaam.length }} / {{ maxChars }} tekens</div>
              </div>
              <div>
                <label class="ia-label">Functie</label>
                <input v-model="fFunctie" class="ia-input" placeholder="bijv. Directeur Innovatie" />
                <div class="ia-charcount" :class="{ warn: functieOverLimit }">{{ fFunctie.length }} / {{ maxChars }} tekens</div>
              </div>
            </div>
            <label class="ia-label">Planning / tijdvak (optioneel)</label>
            <input v-model="fPlanning" class="ia-input" placeholder="bijv. interview voor de lunch" />
            <div v-if="deelnemerPreset?.vragen?.some(q => q)" class="ia-actions">
              <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="usePreset">Gebruik standaardvragen deelnemers</button>
            </div>
            <label class="ia-label">Interviewvragen (min. 4, max. 7)</label>
            <div v-for="(q, i) in fQuestions" :key="i" class="ia-question-row">
              <textarea v-model="fQuestions[i]" class="ia-textarea" rows="1" :placeholder="`Vraag ${i + 1}`" />
              <button class="ia-iconbtn" type="button" title="Verwijder" @click="removeFQ(i)">🗑️</button>
            </div>
            <div class="ia-actions">
              <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="addFQ">+ Vraag</button>
            </div>
            <div class="ia-actions">
              <input id="fGedeeld" v-model="fGedeeld" type="checkbox" />
              <label for="fGedeeld" style="margin:0">Vragen zijn vooraf gedeeld met de geïnterviewde</label>
            </div>
            <div class="ia-actions">
              <button class="ia-btn" type="button" @click="saveGuest">Opslaan</button>
              <button class="ia-iconbtn" type="button" title="Leegmaken" @click="clearForm">🗑️</button>
            </div>
          </div>
        </section>

        <!-- OVERZICHT -->
        <section v-if="store.activeTab === 'overzicht'">
          <div class="ia-card">
            <input v-model="searchBox" class="ia-input search" placeholder="Zoek op naam, regienummer, productie..." />
            <table class="ia-table">
              <thead>
                <tr><th>Regie #</th><th>Gast</th><th>Functie</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                <tr v-for="g in filteredGuests" :key="g.id" class="data-row" @click="handleRowClick(g)">
                  <td>{{ g.regienummer || '—' }}</td>
                  <td>
                    <div>{{ g.naam }}</div>
                    <small v-if="g.planning" style="color:var(--color-text-muted)">{{ g.planning }}</small>
                  </td>
                  <td>{{ g.functie }}</td>
                  <td>
                    <span :class="pillClass(g.status)" @click.stop="store.cycleGuestStatus(g)">{{ g.status }}</span>
                  </td>
                  <td>
                    <button class="ia-iconbtn" type="button" @click.stop="loadForEdit(g)">✏️</button>
                    <button class="ia-iconbtn" type="button" @click.stop="store.deleteGuest(g.id)">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="!filteredGuests.length" class="ia-empty">Nog geen gasten toegevoegd.</p>
          </div>
        </section>

        <!-- PRODUCTIES -->
        <section v-if="store.activeTab === 'producties'">
          <div class="ia-card">
            <label class="ia-label">Productienaam</label>
            <input v-model="pNaam" class="ia-input" placeholder="naam van de productie" />
            <label class="ia-label">Productiedatum</label>
            <input v-model="pDatum" class="ia-input" type="date" />
            <label class="ia-label">Status</label>
            <select v-model="pStatus" class="ia-select">
              <option v-for="s in PRODUCTIE_STATUSES" :key="s" :value="s">{{ s }}</option>
            </select>
            <label class="ia-label">Standaardvragen voor Deelnemers (min. 4, max. 7)</label>
            <div v-for="(q, i) in pQuestions" :key="i" class="ia-question-row">
              <textarea v-model="pQuestions[i]" class="ia-textarea" rows="1" />
              <button class="ia-iconbtn" type="button" @click="removePQ(i)">🗑️</button>
            </div>
            <div class="ia-actions">
              <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="addPQ">+ Vraag</button>
              <button class="ia-btn" type="button" @click="saveProductie">Opslaan</button>
              <button class="ia-iconbtn" type="button" @click="clearProductieForm">🗑️</button>
            </div>
          </div>
          <div class="ia-card">
            <table class="ia-table">
              <thead><tr><th>Productie</th><th>Datum</th><th>Status</th><th>Vragen</th><th></th></tr></thead>
              <tbody>
                <tr v-for="p in store.activeProductions" :key="p.id">
                  <td>{{ p.naam }}</td>
                  <td>{{ p.datum || '—' }}</td>
                  <td>{{ p.status }}</td>
                  <td>{{ p.vragen.filter(q => q).length }}</td>
                  <td>
                    <button class="ia-iconbtn" type="button" @click="editProductie(p)">✏️</button>
                    <button class="ia-iconbtn" type="button" @click="store.archiveProduction(p.id)">📦</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- CONTROLE -->
        <section v-if="store.activeTab === 'controle'">
          <div v-if="controleThanks && store.activeGuest" class="ia-card ia-thanks">
            <h2>Bedankt!</h2>
            <p>Je gegevens zijn bevestigd.</p>
            <div class="ia-thanks__nr">Regie #{{ store.activeGuest.regienummer }}</div>
            <p>Geef de iPad door aan de interviewer.</p>
            <button class="ia-btn ia-btn--big ia-btn--ok" type="button" @click="goToCameraAfterThanks">Door naar camera →</button>
          </div>
          <div v-else-if="store.activeGuest && store.activeGuest.status === 'Ingevoerd'" class="ia-card">
            <p class="ia-controle-intro">
              Controleer je naam en functie voor de lowerthird in de video.
              De functietitel mag maximaal {{ maxChars }} tekens bevatten.
            </p>
            <label class="ia-label">Naam</label>
            <input v-model="controleNaam" class="ia-input ia-controle-input" />
            <label class="ia-label">Functie</label>
            <input v-model="controleFunctie" class="ia-input ia-controle-input" />
            <div class="ia-charcount" :class="{ warn: controleFunctieOver }">{{ controleFunctie.length }} / {{ maxChars }} tekens</div>
            <div class="ia-actions" style="margin-top:1.5rem">
              <button class="ia-btn ia-btn--big ia-btn--ok" type="button" :disabled="controleFunctieOver" @click="confirmControle">
                ✓ Gecontroleerd, dit klopt
              </button>
            </div>
          </div>
          <div v-else class="ia-card">
            <p class="ia-controle-intro">Crew: kies een gast om de iPad aan hem of haar te geven.</p>
            <div class="ia-guest-picker">
              <button
                v-for="g in controleCandidates"
                :key="g.id"
                class="ia-guest-pick"
                type="button"
                @click="openControle(g)"
              >
                {{ g.naam }}
                <small>{{ g.functie || 'Geen functie' }} · {{ g.productieNaam }}</small>
              </button>
            </div>
            <p v-if="!controleCandidates.length" class="ia-empty">Geen gasten met status Ingevoerd.</p>
          </div>
        </section>

        <!-- CAMERA -->
        <section v-if="store.activeTab === 'camera'">
          <div v-if="camGuest?.regienummer" class="ia-card ia-cam-full">
            <div class="ia-cam-full__header">
              {{ camGuest.productieNaam }} · {{ camHeaderDate }} · {{ camHeaderTime }}
            </div>
            <div class="ia-cam-full__number">{{ camGuest.regienummer }}</div>
            <div class="ia-actions" style="justify-content:center">
              <button class="ia-btn ia-btn--accent" type="button" @click="goToInterviewer">Interviewvragen tonen →</button>
            </div>
          </div>
          <div v-else class="ia-card">
            <label class="ia-label">Zoek op regienummer</label>
            <input v-model="camSearch" class="ia-input" placeholder="Typ het regienummer..." />
            <p v-if="camSearch && !camGuest" class="ia-empty">Geen record met dit regienummer.</p>
          </div>
        </section>

        <!-- INTERVIEWER -->
        <section v-if="store.activeTab === 'interviewer'">
          <div v-if="intGuest" class="ia-card ia-int-full">
            <div class="ia-int-full__head">
              <div>
                <div class="ia-int-full__naam">{{ intGuest.naam }}</div>
                <div class="ia-int-full__functie">
                  {{ intGuest.functie }}
                  <span v-if="intGuest.functie.length > maxChars"> ⚠️ te lang voor lowerthird</span>
                </div>
              </div>
              <div class="ia-int-full__functie">Regie #{{ intGuest.regienummer || '—' }}</div>
            </div>

            <div v-if="intGuest.gedeeld" class="ia-int-full__warn">
              Let op: deze vragen zijn vooraf gedeeld met de gast
            </div>

            <div class="ia-lowerthird-wrap">
              <div class="ia-lowerthird" :key="intGuest.id + intGuest.functie">
                <div class="ia-lowerthird__naam">{{ intGuest.naam }}</div>
                <div class="ia-lowerthird__functie">{{ intGuest.functie }}</div>
              </div>
            </div>

            <ol class="ia-questions">
              <li v-for="(q, i) in intGuest.questions.filter(q => q)" :key="i">{{ q }}</li>
            </ol>
            <p v-if="!intGuest.questions.some(q => q)" class="ia-empty">Geen vragen ingevuld</p>

            <div class="ia-actions">
              <button v-if="!confirmOpgenomen" class="ia-btn ia-btn--ok" type="button" @click="confirmOpgenomen = true">✓ Opgenomen</button>
              <template v-else>
                <span>Interview afgerond?</span>
                <button class="ia-btn ia-btn--ok" type="button" @click="markOpgenomen">Ja, opgenomen</button>
                <button class="ia-btn ia-btn--secondary" type="button" @click="confirmOpgenomen = false">Annuleren</button>
              </template>
              <button
                v-if="intGuest.status === 'Opgenomen'"
                class="ia-btn ia-btn--small ia-btn--secondary"
                type="button"
                @click="resetGuestStatus(intGuest)"
              >
                Status terugzetten
              </button>
            </div>
          </div>
          <div v-else class="ia-card">
            <label class="ia-label">Zoek op regienummer of naam</label>
            <input v-model="intSearch" class="ia-input" placeholder="Typ regienummer of naam..." />
            <p v-if="intSearch && !intGuest" class="ia-empty">Geen gast gevonden.</p>
          </div>
        </section>

        <!-- DASHBOARD -->
        <section v-if="store.activeTab === 'dashboard'">
          <div class="ia-card">
            <h2 style="color:var(--color-accent);margin-bottom:0.5rem">Opgenomen interviews</h2>
            <p class="ia-dashboard-stat">{{ store.opgenomenGuests.length }}</p>
            <p style="color:var(--color-text-muted);margin-bottom:1rem">interviews vandaag afgerond</p>
            <table class="ia-table">
              <thead><tr><th>Regie #</th><th>Naam</th><th>Functie</th><th>Tijd</th><th>Productie</th></tr></thead>
              <tbody>
                <tr v-for="g in store.opgenomenGuests" :key="g.id">
                  <td>{{ g.regienummer }}</td>
                  <td>{{ g.naam }}</td>
                  <td>{{ g.functie }}</td>
                  <td>{{ g.tijd || '—' }}</td>
                  <td>{{ g.productieNaam }}</td>
                </tr>
              </tbody>
            </table>
            <p v-if="!store.opgenomenGuests.length" class="ia-empty">Nog geen opgenomen interviews.</p>
          </div>
        </section>

        <!-- ARCHIEF -->
        <section v-if="store.activeTab === 'archief'">
          <div class="ia-card">
            <h2 style="color:var(--color-accent);margin-bottom:1rem">Gearchiveerde producties</h2>
            <table class="ia-table">
              <thead><tr><th>Productie</th><th>Datum</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr v-for="p in store.archivedProductions" :key="p.id">
                  <td>{{ p.naam }}</td>
                  <td>{{ p.datum || '—' }}</td>
                  <td>{{ p.status }}</td>
                  <td>
                    <button class="ia-iconbtn" type="button" @click="store.restoreProduction(p.id)">↩️</button>
                    <button
                      class="ia-iconbtn"
                      type="button"
                      @click="deleteArchivedProduction(p)"
                    >🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="!store.archivedProductions.length" class="ia-empty">Archief is leeg.</p>
          </div>
        </section>
      </main>
        </div>
      </div>
    </template>

    <div v-if="toast" class="ia-toast">{{ toast }}</div>
  </div>
</template>
