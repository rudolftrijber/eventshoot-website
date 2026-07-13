<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useInterviewStore } from '@/stores/interviewStore'
import type { Gast, GuestView, Productie, TabId } from '@/types/interview'
import { GAST_TYPES, PRODUCTIE_STATUSES } from '@/types/interview'
import {
  clientTemplateCSV,
  csvRowToGuestPayload,
  downloadText,
  guestsToCSV,
  lowerthirdCSV,
  parseCSV,
  todayStr,
  formatDisplayDate,
} from '@/utils/interviewCsv'
import '@/assets/interview-app.css'
import '@/assets/interview-app-buttons.css'
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  QueueListIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/24/outline'
import type { Component } from 'vue'

const store = useInterviewStore()

const devBuildStamp = import.meta.env.DEV ? '13 jul 09:50 · compact buttons' : ''
const skipAuthMode = ref(false)
const password = ref('')
const showPassword = ref(false)
const loginError = ref('')
const apiConfigHint = ref('')
const apiConfigured = computed(() => !apiConfigHint.value)
const toast = ref('')
const settingsOpen = ref(false)
const searchBox = ref('')
const guestView = ref<GuestView>(null)
const showProdForm = ref(false)
const manualProductieId = ref<string | null>(null)
const pickProductieId = ref('')
const PICK_NEW_PRODUCTION = '__new__'

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
  { id: 'kandidaten', label: 'Kandidaten', icon: QueueListIcon },
  { id: 'producties', label: 'Producties', icon: CalendarDaysIcon },
]

const todayIso = computed(() => todayStr())

const workingProduction = computed(() => {
  const todayProd = store.activeProductions.find(
    (p) => (p.datum || '').slice(0, 10) === todayIso.value,
  )
  if (todayProd) return todayProd
  if (manualProductieId.value) {
    return store.activeProductions.find((p) => p.id === manualProductieId.value) || null
  }
  return null
})

const needsProductiePick = computed(() =>
  store.activeTab === 'kandidaten'
  && !workingProduction.value
  && guestView.value === null,
)

const dayGuests = computed(() => {
  const prod = workingProduction.value
  if (!prod) return []
  const q = searchBox.value.toLowerCase()
  return [...store.guests]
    .filter((g) => g.productieNaam === prod.naam)
    .filter((g) => !q || [g.naam, g.functie, g.regienummer, g.type].join(' ').toLowerCase().includes(q))
    .sort((a, b) =>
      (parseInt(a.regienummer) || 9999) - (parseInt(b.regienummer) || 9999)
      || a.naam.localeCompare(b.naam, 'nl'),
    )
})

const sortedProductions = computed(() =>
  [...store.activeProductions].sort((a, b) => a.naam.localeCompare(b.naam, 'nl')),
)

const maxChars = computed(() => store.settings.maxChars)

const naamOverLimit = computed(() => fNaam.value.length > maxChars.value)
const functieOverLimit = computed(() => fFunctie.value.length > maxChars.value)
const controleFunctieOver = computed(() => controleFunctie.value.length > maxChars.value)
const controleNaamOver = computed(() => controleNaam.value.length > maxChars.value)
const controleOverLimit = computed(() => controleNaamOver.value || controleFunctieOver.value)

const deelnemerPreset = computed(() => {
  if (fType.value !== 'Deelnemer') return null
  return store.activeProductions.find(
    (p) => p.naam.trim().toLowerCase() === fProductie.value.trim().toLowerCase(),
  )
})

const filteredGuests = dayGuests

const controleCandidates = computed(() =>
  dayGuests.value.filter((g) => g.status === 'Ingevoerd'),
)

const camGuest = computed(() => {
  if (store.activeGuest) return store.activeGuest
  if (!camSearch.value.trim()) return null
  return store.guests.find((g) => g.regienummer === camSearch.value.trim()) || null
})

const intGuest = computed(() => {
  if (store.activeGuest && guestView.value === 'interviewer') return store.activeGuest
  const q = intSearch.value.trim()
  if (!q) return store.activeGuest
  return store.guests.find((g) =>
    g.regienummer === q || g.naam.toLowerCase().includes(q.toLowerCase()),
  ) || null
})

const camHeaderDate = computed(() => formatDisplayDate(camGuest.value?.datum || todayStr()))
const camHeaderTime = computed(() => camGuest.value?.tijd || new Date().toTimeString().slice(0, 5))

const crewFocusMode = computed(() => {
  if (guestView.value === 'camera' && Boolean(camGuest.value?.regienummer)) return true
  if (guestView.value === 'interviewer' && Boolean(intGuest.value)) return true
  return false
})

function backToKandidaten() {
  guestView.value = null
  store.selectGuest(null)
  controleThanks.value = false
  confirmOpgenomen.value = false
  camSearch.value = ''
  intSearch.value = ''
}

function openNewGuest() {
  clearForm()
  if (workingProduction.value) fProductie.value = workingProduction.value.naam
  guestView.value = 'form'
}

function openNewProductie() {
  clearProductieForm()
  pDatum.value = todayIso.value
  pStatus.value = 'Gaande'
  showProdForm.value = true
}

function onProductiePickChange() {
  const val = pickProductieId.value
  if (val === PICK_NEW_PRODUCTION) {
    pickProductieId.value = ''
    store.setTab('producties')
    openNewProductie()
    return
  }
  if (val) manualProductieId.value = val
}

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
  if (!apiConfigured.value) return
  loginError.value = ''
  try {
    await store.login(password.value)
    password.value = ''
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Inloggen mislukt'
    if (!msg.includes('.env.local') && !msg.includes('INTERVIEW_') && !msg.includes('POSTGRES_URL')) {
      loginError.value = msg
    }
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
    backToKandidaten()
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Opslaan mislukt')
  }
}

function loadForEdit(g: Gast) {
  editingId.value = g.id
  fProductie.value = sortedProductions.value.some((p) => p.naam === g.productieNaam) ? g.productieNaam : ''
  fType.value = g.type
  fPlanning.value = g.planning
  fGedeeld.value = g.gedeeld
  fNaam.value = g.naam
  fFunctie.value = g.functie
  resetQuestions(fQuestions, g.questions)
  store.selectGuest(g.id)
  guestView.value = 'form'
}

function applyDeelnemerPreset() {
  if (fType.value !== 'Deelnemer' || !fProductie.value.trim()) return
  const preset = deelnemerPreset.value
  if (!preset?.vragen?.some((q) => q.trim())) return
  resetQuestions(fQuestions, preset.vragen)
}

async function saveProductie() {
  const naam = pNaam.value.trim()
  if (!naam) { showToast('Vul een productienaam in'); return }
  const datum = pDatum.value
  try {
    await store.saveProduction({
      id: editingProdId.value || undefined,
      naam,
      datum,
      status: pStatus.value,
      vragen: pQuestions.value.map((q) => q.trim()),
    })
    const saved = store.activeProductions.find(
      (p) =>
        p.naam === naam
        && (p.datum || '').slice(0, 10) === (datum || '').slice(0, 10),
    )
    showToast('Productie opgeslagen')
    clearProductieForm()
    showProdForm.value = false
    if (saved && (saved.datum || '').slice(0, 10) === todayIso.value) {
      manualProductieId.value = saved.id
      store.setTab('kandidaten')
    }
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
  if (controleNaam.value.length > maxChars.value || controleFunctie.value.length > maxChars.value) {
    showToast(`Naam en functie max. ${maxChars.value} tekens`)
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
  guestView.value = 'camera'
}

function goToInterviewer() {
  showCamQuestions.value = true
  guestView.value = 'interviewer'
}

async function deleteArchivedProduction(p: Productie) {
  if (!confirm(`Weet je zeker dat je productie "${p.naam}" definitief wilt verwijderen?`)) return
  await store.deleteProduction(p.id)
  showToast('Productie verwijderd')
}

async function markOpgenomen() {
  if (!intGuest.value) return
  try {
    await store.updateGuest(intGuest.value.id, { status: 'Opgenomen' })
    confirmOpgenomen.value = false
    backToKandidaten()
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
    guestView.value = 'controle'
  } else if (g.status === 'Gecontroleerd') {
    camSearch.value = g.regienummer
    guestView.value = 'camera'
  } else {
    guestView.value = 'interviewer'
  }
}

function openGuestControle(g: Gast) {
  openControle(g)
  guestView.value = 'controle'
}

function openGuestCamera(g: Gast) {
  store.selectGuest(g.id)
  camSearch.value = g.regienummer
  guestView.value = 'camera'
}

function openGuestInterviewer(g: Gast) {
  store.selectGuest(g.id)
  guestView.value = 'interviewer'
}

function pillClass(status: Gast['status']) {
  return `ia-pill ia-pill--${status.toLowerCase()}`
}

function exportCsv() {
  downloadText(`interview-intake-${todayStr()}.csv`, guestsToCSV(store.guests), 'text/csv;charset=utf-8')
}

function exportTemplate() {
  downloadText(`interview-intake-sjabloon-${todayStr()}.csv`, clientTemplateCSV(), 'text/csv;charset=utf-8')
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
  const defaultProductie = workingProduction.value?.naam || ''
  let added = 0
  for (const row of rows) {
    const payload = csvRowToGuestPayload(row)
    if (payload.naam) {
      if (!payload.productieNaam && defaultProductie) {
        payload.productieNaam = defaultProductie
      }
      await store.createGuest({
        ...payload,
        status: payload.status as Gast['status'],
      })
      added++
    }
  }
  showToast(`${added} kandidaat/kandidaten geïmporteerd`)
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

async function loadDemoData() {
  try {
    const result = await store.seedDemo()
    await store.sync()
    showToast(result.message)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Demo-data laden mislukt')
  }
}

onMounted(async () => {
  document.title = 'Interview App — Eventshoot.nl'
  const meta = document.querySelector('meta[name="robots"]') || document.createElement('meta')
  meta.setAttribute('name', 'robots')
  meta.setAttribute('content', 'noindex, nofollow')
  if (!meta.parentElement) document.head.appendChild(meta)

  try {
    const status = await store.checkAuth()
    skipAuthMode.value = Boolean(status.skipAuth)
    if (status.configured === false && status.missing?.length) {
      apiConfigHint.value = status.skipAuth
        ? [
            'Database ontbreekt lokaal. Vul POSTGRES_URL in .env.local:',
            'Vercel-dashboard → Project → Settings → Environment Variables → POSTGRES_URL → kopieer waarde',
          ].join('\n')
        : [
            'Login werkt lokaal nog niet. Maak .env.local aan met:',
            status.missing.join(', '),
            'Of zet INTERVIEW_SKIP_AUTH=true en vul alleen POSTGRES_URL in.',
          ].join('\n')
    }
    if (store.authenticated) {
      await store.sync()
      store.startPolling()
    }
  } catch (e) {
    apiConfigHint.value = e instanceof Error ? e.message : 'API niet bereikbaar'
  }
})

onUnmounted(() => {
  store.stopPolling()
})

watch(() => store.activeTab, () => {
  guestView.value = null
  store.selectGuest(null)
  showProdForm.value = false
})

watch(guestView, (view) => {
  if (view === 'controle') controleThanks.value = false
  if (view === 'camera') showCamQuestions.value = false
})

watch([fType, fProductie], () => {
  applyDeelnemerPreset()
})
</script>

<template>
  <div class="interview-app" :class="{ 'interview-app--crew-focus': crewFocusMode }">
    <header v-if="!crewFocusMode" class="ia-header">
      <img
        class="ia-header__image"
        src="/DATA_EVENTSHOOT/SITE_IMAGES/WERK/microphones.png"
        alt="Eventshoot Interview App"
      />
    </header>

    <!-- Login -->
    <template v-if="!store.authenticated">
      <div class="ia-body">
        <div class="ia-login">
          <div class="ia-login__card">
            <p v-if="devBuildStamp" class="ia-dev-badge">Lokaal · build {{ devBuildStamp }}</p>
            <p class="ia-login__intro">Log in met het crew-wachtwoord om gasten en interviews te beheren.</p>
            <p v-if="apiConfigHint" class="ia-error ia-error--block ia-error--pre">{{ apiConfigHint }}</p>
            <label class="ia-label" for="pw">Wachtwoord</label>
            <div class="ia-password-wrap">
              <input
                id="pw"
                v-model="password"
                class="ia-input ia-password-wrap__input"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                @keyup.enter="handleLogin"
              />
              <button
                class="ia-password-wrap__toggle"
                type="button"
                :title="showPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'"
                :aria-label="showPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'"
                @click="showPassword = !showPassword"
              >
                <EyeSlashIcon v-if="showPassword" class="ia-password-wrap__icon" />
                <EyeIcon v-else class="ia-password-wrap__icon" />
              </button>
            </div>
            <p v-if="loginError" class="ia-error">{{ loginError }}</p>
            <div class="ia-actions">
              <button
                class="ia-btn ia-btn--accent"
                type="button"
                :disabled="!apiConfigured"
                @click="handleLogin"
              >Inloggen</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- App -->
    <template v-else>
      <div class="ia-body">
        <div class="ia-shell">
          <header class="ia-shell__nav">
            <div class="ia-tabs-wrap">
              <nav class="ia-tabs" aria-label="Interview app menu">
                <button
                  v-for="t in tabs"
                  :key="t.id"
                  class="ia-tab ia-tab--labeled"
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
                  aria-label="Instellingen"
                  @click="settingsOpen = !settingsOpen"
                >
                  <Cog6ToothIcon class="ia-tab__icon" aria-hidden="true" />
                </button>
                <button
                  v-if="!skipAuthMode"
                  class="ia-tab ia-tab--util ia-tab--logout"
                  type="button"
                  title="Uitloggen"
                  aria-label="Uitloggen"
                  @click="store.logout()"
                >
                  <ArrowRightOnRectangleIcon class="ia-tab__icon" aria-hidden="true" />
                </button>
              </div>
            </div>
          </header>

      <p v-if="skipAuthMode && !crewFocusMode" class="ia-skip-auth-banner">Finetune-modus: wachtwoord staat uit. Alleen lokaal of bewust op Vercel gezet.</p>

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
          <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="loadDemoData">Laad demo-data</button>
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
        <!-- KANDIDATEN -->
        <section v-if="store.activeTab === 'kandidaten'">
          <div v-if="needsProductiePick" class="ia-card ia-day-empty">
            <h2 class="ia-day-empty__title">Geen productie voor vandaag</h2>
            <p class="ia-day-empty__text">
              Kies de productie waarvoor je vandaag kandidaten beheert.
            </p>
            <label class="ia-label" for="pick-productie">Productie</label>
            <select
              id="pick-productie"
              v-model="pickProductieId"
              class="ia-select"
              @change="onProductiePickChange"
            >
              <option value="" disabled>— selecteer productie —</option>
              <option v-for="p in sortedProductions" :key="p.id" :value="p.id">
                {{ p.naam }} ({{ p.datum || 'geen datum' }})
              </option>
              <option :value="PICK_NEW_PRODUCTION">+ Nieuwe productie aanmaken</option>
            </select>
          </div>

          <template v-else-if="guestView === 'form'">
            <button class="ia-back" type="button" @click="backToKandidaten">
              <ArrowLeftIcon class="ia-back__icon" aria-hidden="true" /> Terug naar lijst
            </button>
            <div class="ia-card">
              <h2 class="ia-section-title">{{ editingId ? 'Kandidaat bewerken' : 'Nieuwe kandidaat' }}</h2>
              <div class="ia-row ia-row--fields">
                <div class="ia-field">
                  <label class="ia-label">Productie</label>
                  <select v-model="fProductie" class="ia-select">
                    <option value="" disabled>— selecteer —</option>
                    <option v-for="p in sortedProductions" :key="p.id" :value="p.naam">{{ p.naam }}</option>
                  </select>
                </div>
                <div class="ia-field">
                  <label class="ia-label">Type gast</label>
                  <select v-model="fType" class="ia-select">
                    <option value="">— optioneel —</option>
                    <option v-for="t in GAST_TYPES" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
              </div>
              <div class="ia-row">
                <div>
                  <label class="ia-label">Naam</label>
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
              <input v-model="fPlanning" class="ia-input" placeholder="bijv. interview na de keynote" />
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
          </template>

          <template v-else-if="guestView === 'controle'">
            <button class="ia-back" type="button" @click="backToKandidaten">
              <ArrowLeftIcon class="ia-back__icon" aria-hidden="true" /> Terug naar lijst
            </button>
            <div v-if="controleThanks && store.activeGuest" class="ia-card ia-thanks">
              <h2>Bedankt!</h2>
              <p>Je gegevens zijn bevestigd.</p>
              <div class="ia-thanks__nr">Regie #{{ store.activeGuest.regienummer }}</div>
              <p>Geef de iPad door aan de interviewer.</p>
              <div class="ia-actions">
                <button class="ia-btn ia-btn--ok" type="button" @click="goToCameraAfterThanks">Door naar camera →</button>
              </div>
            </div>
            <div v-else-if="store.activeGuest && store.activeGuest.status === 'Ingevoerd'" class="ia-card">
              <p class="ia-controle-intro">Controleer naam en functie voor de lowerthird in de video.</p>
              <p v-if="controleOverLimit" class="ia-controle-limit ia-controle-limit--alert">
                Te lang — naam en functie mogen elk maximaal {{ maxChars }} tekens zijn.
              </p>
              <label class="ia-label">Naam</label>
              <input v-model="controleNaam" class="ia-input ia-controle-input" />
              <div class="ia-charcount" :class="{ warn: controleNaamOver }">{{ controleNaam.length }} / {{ maxChars }} tekens</div>
              <label class="ia-label">Functie</label>
              <input v-model="controleFunctie" class="ia-input ia-controle-input" />
              <div class="ia-charcount" :class="{ warn: controleFunctieOver }">{{ controleFunctie.length }} / {{ maxChars }} tekens</div>
              <div class="ia-actions" style="margin-top:1.5rem">
                <button class="ia-btn ia-btn--ok" type="button" :disabled="controleOverLimit" @click="confirmControle">
                  ✓ Gecontroleerd, dit klopt
                </button>
              </div>
            </div>
          </template>

          <template v-else-if="guestView === 'camera'">
            <button v-if="!crewFocusMode" class="ia-back" type="button" @click="backToKandidaten">
              <ArrowLeftIcon class="ia-back__icon" aria-hidden="true" /> Terug naar lijst
            </button>
            <div v-if="camGuest?.regienummer" class="ia-card ia-cam-full">
              <div class="ia-cam-full__header">
                {{ camGuest.productieNaam }} · {{ camHeaderDate }} · {{ camHeaderTime }}
              </div>
              <div class="ia-cam-full__guest">
                <div class="ia-cam-full__naam">{{ camGuest.naam }}</div>
                <div class="ia-cam-full__functie">{{ camGuest.functie }}</div>
              </div>
              <div class="ia-cam-full__number">{{ camGuest.regienummer }}</div>
              <div class="ia-actions">
                <button class="ia-btn ia-btn--accent" type="button" @click="goToInterviewer">Interviewvragen tonen →</button>
              </div>
            </div>
          </template>

          <template v-else-if="guestView === 'interviewer'">
            <button v-if="!crewFocusMode" class="ia-back" type="button" @click="backToKandidaten">
              <ArrowLeftIcon class="ia-back__icon" aria-hidden="true" /> Terug naar lijst
            </button>
            <div v-if="intGuest" class="ia-card ia-int-full">
              <div class="ia-int-full__head">
                <div class="ia-int-full__regie">Regie #{{ intGuest.regienummer || '—' }}</div>
                <div class="ia-int-full__naam">{{ intGuest.naam }}</div>
                <div class="ia-int-full__functie">{{ intGuest.functie }}</div>
              </div>
              <div v-if="intGuest.gedeeld" class="ia-int-full__warn">
                Let op: deze vragen zijn vooraf gedeeld met de gast
              </div>
              <ol class="ia-questions">
                <li v-for="(q, i) in intGuest.questions.filter(q => q)" :key="i">{{ q }}</li>
              </ol>
              <div class="ia-actions">
                <button v-if="!confirmOpgenomen" class="ia-btn ia-btn--ok" type="button" @click="confirmOpgenomen = true">✓ Opgenomen</button>
                <template v-else>
                  <span>Interview afgerond?</span>
                  <button class="ia-btn ia-btn--ok" type="button" @click="markOpgenomen">Ja, opgenomen</button>
                  <button class="ia-btn ia-btn--secondary" type="button" @click="confirmOpgenomen = false">Annuleren</button>
                </template>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="ia-card">
              <h2 class="ia-section-title">Interview kandidaten</h2>
              <p v-if="workingProduction" class="ia-list-header__sub ia-list-header__sub--tight">
                {{ workingProduction.naam }} · {{ formatDisplayDate(workingProduction.datum || todayIso) }}
              </p>
              <div class="ia-actions ia-actions--tight">
                <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="openNewGuest">
                  + Nieuwe kandidaat
                </button>
                <label class="ia-btn ia-btn--small ia-btn--secondary" style="cursor:pointer;margin:0">
                  Import CSV
                  <input type="file" accept=".csv,text/csv" hidden @change="(e) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) importCsv(f) }" />
                </label>
              </div>
              <input
                v-model="searchBox"
                class="ia-input ia-search"
                type="search"
                placeholder="Zoek op naam..."
              />
              <table class="ia-table">
                <thead>
                  <tr><th>Regie #</th><th>Naam</th><th>Functie</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  <tr v-for="g in filteredGuests" :key="g.id" class="data-row" @click="handleRowClick(g)">
                    <td>{{ g.regienummer || '—' }}</td>
                    <td>
                      <div>{{ g.naam }}</div>
                      <small v-if="g.planning" style="color:var(--color-text-muted)">{{ g.planning }}</small>
                    </td>
                    <td>{{ g.functie }}</td>
                    <td><span :class="pillClass(g.status)">{{ g.status }}</span></td>
                    <td class="ia-row-actions" @click.stop>
                      <button v-if="g.status === 'Ingevoerd'" class="ia-iconbtn" type="button" title="Controle" @click="openGuestControle(g)">✓</button>
                      <button v-if="g.regienummer" class="ia-iconbtn" type="button" title="Camera" @click="openGuestCamera(g)">📷</button>
                      <button class="ia-iconbtn" type="button" title="Interviewer" @click="openGuestInterviewer(g)">🎤</button>
                      <button class="ia-iconbtn" type="button" title="Bewerken" @click="loadForEdit(g)">✏️</button>
                      <button class="ia-iconbtn" type="button" title="Verwijderen" @click="store.deleteGuest(g.id)">🗑️</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="!filteredGuests.length" class="ia-empty">Nog geen kandidaten voor deze productie. Klik op + Nieuwe kandidaat of importeer een CSV-lijst.</p>
            </div>
          </template>
        </section>

        <!-- PRODUCTIES -->
        <section v-if="store.activeTab === 'producties'">
          <div v-if="showProdForm" class="ia-card ia-prod-form">
            <h2 class="ia-section-title">{{ editingProdId ? 'Productie bewerken' : 'Nieuwe productie' }}</h2>
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
              <button class="ia-btn ia-btn--secondary" type="button" @click="showProdForm = false">Annuleren</button>
            </div>
          </div>
          <div class="ia-card">
            <h2 class="ia-section-title">Actieve producties</h2>
            <div class="ia-actions ia-actions--tight">
              <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="openNewProductie">
                + Nieuwe productie
              </button>
            </div>
            <table class="ia-table">
              <thead><tr><th>Productie</th><th>Datum</th><th>Status</th><th>Kandidaten</th><th></th></tr></thead>
              <tbody>
                <tr v-for="p in store.activeProductions" :key="p.id">
                  <td>{{ p.naam }}</td>
                  <td>{{ p.datum ? formatDisplayDate(p.datum) : '—' }}</td>
                  <td>{{ p.status }}</td>
                  <td>{{ store.guests.filter(g => g.productieNaam === p.naam).length }}</td>
                  <td>
                    <button class="ia-iconbtn" type="button" title="Bewerken" @click="editProductie(p); showProdForm = true">✏️</button>
                    <button class="ia-iconbtn" type="button" title="Archiveren" @click="store.archiveProduction(p.id)">📦</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="!store.activeProductions.length" class="ia-empty">Nog geen producties. Klik op + Nieuwe productie om te beginnen.</p>
          </div>
          <div v-if="store.archivedProductions.length" class="ia-card">
            <h2 class="ia-section-title">Archief</h2>
            <p class="ia-list-header__sub">Gearchiveerde producties en bijbehorende kandidaten.</p>
            <table class="ia-table">
              <thead><tr><th>Productie</th><th>Datum</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr v-for="p in store.archivedProductions" :key="p.id">
                  <td>{{ p.naam }}</td>
                  <td>{{ p.datum ? formatDisplayDate(p.datum) : '—' }}</td>
                  <td>{{ p.status }}</td>
                  <td>
                    <button class="ia-iconbtn" type="button" title="Herstellen" @click="store.restoreProduction(p.id)">↩️</button>
                    <button class="ia-iconbtn" type="button" title="Definitief verwijderen" @click="deleteArchivedProduction(p)">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
        </div>
      </div>
    </template>

    <div v-if="toast" class="ia-toast">{{ toast }}</div>
  </div>
</template>
