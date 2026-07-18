<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useInterviewStore } from '@/stores/interviewStore'
import type { Gast, GuestView, Productie } from '@/types/interview'
import { GAST_TYPES, intakeLockApplies, PRODUCTIE_STATUSES } from '@/types/interview'
import {
  downloadText,
  guestsToCSV,
  lowerthirdCSV,
  todayStr,
  formatDisplayDate,
} from '@/utils/interviewCsv'
import '@/assets/interview-app.css?v=tip-bilingual'
import '@/assets/interview-app-buttons.css'
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  SparklesIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'
import { PencilSquareIcon as PencilSquareSolidIcon } from '@heroicons/vue/24/solid'
import ParticipantDefaultsCard from '@/components/interview/ParticipantDefaultsCard.vue'
import ShortQuestionsTip from '@/components/interview/ShortQuestionsTip.vue'

const store = useInterviewStore()

const devBuildStamp = import.meta.env.DEV ? '13 jul 09:50 · compact buttons' : ''
const skipAuthMode = ref(false)
const password = ref('')
const showPassword = ref(false)
const showPClientPassword = ref(false)
const loginError = ref('')
const apiConfigHint = ref('')
const apiConfigured = computed(() => !apiConfigHint.value)
const toast = ref('')
const tipOpen = ref(false)
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
const fIntakeComplete = ref(false)
const fQuestions = ref<string[]>(['', '', '', ''])

// Productie form
const editingProdId = ref<string | null>(null)
const pNaam = ref('')
const pDatum = ref('')
const pStatus = ref<Productie['status']>('Planned')
const pLocatie = ref('')
const pLand = ref('')
const pClientPassword = ref('')
const editingProdHasClientPassword = ref(false)
const pQuestions = ref<string[]>(['', '', '', ''])

// Controle
const controleNaam = ref('')
const controleFunctie = ref('')

// Camera / Interviewer search
const camSearch = ref('')
const intSearch = ref('')
const showCamQuestions = ref(false)

// Confirm dialogs
const confirmOpgenomen = ref(false)

// AI question assistant
type AiPrepAnswers = { sector: string; specialism: string; timeliness: string; customPrompt: string }
type AiStep = 'idle' | 'prep' | 'preview'

const AI_PREP_FIELDS: Array<{ key: 'sector' | 'specialism' | 'timeliness'; label: string; placeholder: string }> = [
  { key: 'sector', label: '1. Sector / industry', placeholder: 'e.g. healthcare, IT, government' },
  { key: 'specialism', label: '2. Specialism or angle', placeholder: 'e.g. technology, policy, day-to-day practice' },
  { key: 'timeliness', label: '3. Current topics', placeholder: 'e.g. what is happening now in the sector or at this event' },
]

const aiGuestLanguage = ref<'nl' | 'en'>('nl')
const aiGuestAddress = ref<'u' | 'jij'>('u')
const aiProdLanguage = ref<'nl' | 'en'>('nl')
const aiProdAddress = ref<'u' | 'jij'>('u')

const emptyAiPrep = (): AiPrepAnswers => ({ sector: '', specialism: '', timeliness: '', customPrompt: '' })

const aiGuestStep = ref<AiStep>('idle')
const aiGuestPrep = ref<AiPrepAnswers>(emptyAiPrep())
const aiGuestLoading = ref(false)
const aiGuestPreview = ref<string[] | null>(null)
const aiGuestSelected = ref<boolean[]>([])

const aiProdStep = ref<AiStep>('idle')
const aiProdPrep = ref<AiPrepAnswers>(emptyAiPrep())
const aiProdLoading = ref(false)
const aiProdPreview = ref<string[] | null>(null)
const aiProdSelected = ref<boolean[]>([])

let toastTimer: ReturnType<typeof setTimeout> | null = null

const todayIso = computed(() => todayStr())

const workingProduction = computed(() => {
  const list = store.activeProductions
  if (!manualProductieId.value) return null
  return list.find((p) => p.id === manualProductieId.value) || null
})

const navTitle = computed(() => '')

const navBackLabel = computed(() => {
  if (guestView.value === 'camera' || guestView.value === 'interviewer' || guestView.value === 'controle') {
    return 'Production'
  }
  if (store.activeTab === 'candidate') return 'Production'
  if (editingQuestions.value || editingCandidates.value) return 'Production'
  if (showProdForm.value && store.activeTab === 'production') return 'Production'
  if (isNewProduction.value) return 'Production(s)'
  return 'Production(s)'
})

const editingQuestions = ref(false)
const editingCandidates = ref(false)
const isNewProduction = ref(false)

const productionScreenOpen = computed(() =>
  store.activeTab === 'production'
  && !guestView.value
  && (Boolean(workingProduction.value) || isNewProduction.value),
)

const productionHeading = computed(() => {
  if (isNewProduction.value) return pNaam.value.trim() || 'New production'
  return workingProduction.value?.naam || 'Production'
})

const productionMeta = computed(() => {
  const parts: string[] = []
  if (isNewProduction.value) {
    parts.push(pDatum.value ? formatDisplayDate(pDatum.value) : 'No date')
    parts.push(pStatus.value)
    if (pLocatie.value.trim()) parts.push(pLocatie.value.trim())
    if (pLand.value.trim()) parts.push(pLand.value.trim())
    return parts.join(' · ')
  }
  const prod = workingProduction.value
  if (!prod) return ''
  parts.push(prod.datum ? formatDisplayDate(prod.datum) : 'No date')
  parts.push(prod.status)
  if (prod.locatie?.trim()) parts.push(prod.locatie.trim())
  if (prod.land?.trim()) parts.push(prod.land.trim())
  return parts.join(' · ')
})

const guestFormLocked = computed(() =>
  store.isClient && fIntakeComplete.value && intakeLockApplies(fType.value),
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
  if (fType.value !== 'Participant') return null
  return store.activeProductions.find(
    (p) => p.naam.trim().toLowerCase() === fProductie.value.trim().toLowerCase(),
  )
})

const filteredGuests = dayGuests

function productionGuests(p: Productie) {
  return store.guests.filter((g) => g.productieNaam === p.naam)
}

function productionCounts(p: Productie) {
  const list = productionGuests(p)
  return {
    total: list.length,
    entered: list.filter((g) => g.status === 'Entered').length,
    checked: list.filter((g) => g.status === 'Checked').length,
    recorded: list.filter((g) => g.status === 'Recorded').length,
  }
}

const workingProductionCounts = computed(() => {
  if (!workingProduction.value) return null
  return productionCounts(workingProduction.value)
})

const controleCandidates = computed(() =>
  dayGuests.value.filter((g) => g.status === 'Entered'),
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

const showNavBack = computed(() => {
  if (!store.authenticated) return false
  if (guestView.value) return true
  if (showProdForm.value) return true
  if (editingQuestions.value || editingCandidates.value) return true
  if (isNewProduction.value) return true
  return store.activeTab !== 'productions'
})

function handleNavBack() {
  settingsOpen.value = false
  if (guestView.value && guestView.value !== 'form') {
    clearGuestOverlay()
    return
  }
  if (isNewProduction.value && store.activeTab === 'production') {
    isNewProduction.value = false
    showProdForm.value = false
    editingQuestions.value = false
    editingCandidates.value = false
    clearProductieForm()
    store.setTab('productions')
    return
  }
  if (editingQuestions.value) {
    editingQuestions.value = false
    loadDefaultQuestions(workingProduction.value)
    return
  }
  if (editingCandidates.value) {
    editingCandidates.value = false
    return
  }
  if (showProdForm.value) {
    showProdForm.value = false
    if (workingProduction.value) editProductie(workingProduction.value)
    return
  }
  if (store.activeTab === 'candidate') {
    clearGuestOverlay()
    store.setTab('production')
    return
  }
  if (store.activeTab === 'production') {
    manualProductieId.value = null
    pickProductieId.value = ''
    showProdForm.value = false
    editingQuestions.value = false
    editingCandidates.value = false
    clearProductieForm()
    store.setTab('productions')
  }
}

function clearGuestOverlay() {
  guestView.value = null
  store.selectGuest(null)
  confirmOpgenomen.value = false
  camSearch.value = ''
  intSearch.value = ''
  editingId.value = null
}

function backToKandidaten() {
  clearGuestOverlay()
  if (store.activeTab === 'candidate') store.setTab('production')
}

function openNewGuest() {
  clearForm()
  if (workingProduction.value) fProductie.value = workingProduction.value.naam
  store.setTab('candidate')
  guestView.value = 'form'
}

function openNewProductie() {
  clearProductieForm()
  resetQuestions(pQuestions)
  resetProdAi()
  pDatum.value = todayIso.value
  pStatus.value = 'Active'
  isNewProduction.value = true
  manualProductieId.value = null
  pickProductieId.value = ''
  searchBox.value = ''
  showProdForm.value = true
  editingQuestions.value = false
  editingCandidates.value = false
  clearGuestOverlay()
  store.setTab('production')
}

function onProductiePickChange() {
  const val = pickProductieId.value
  if (val === PICK_NEW_PRODUCTION) {
    pickProductieId.value = workingProduction.value?.id || ''
    openNewProductie()
    return
  }
  if (val) {
    manualProductieId.value = val
    const prod = store.activeProductions.find((p) => p.id === val)
    if (prod) loadDefaultQuestions(prod)
  }
}

function onListProductieChange() {
  onProductiePickChange()
  searchBox.value = ''
  clearGuestOverlay()
}

function toggleEditProduction() {
  if (!store.isCrew && !isNewProduction.value) return
  if (showProdForm.value) {
    if (isNewProduction.value) {
      showProdForm.value = false
      return
    }
    showProdForm.value = false
    if (workingProduction.value) {
      editProductie(workingProduction.value)
    }
    return
  }
  if (!isNewProduction.value && workingProduction.value) {
    editProductie(workingProduction.value)
  }
  showProdForm.value = true
}

function toggleEditQuestions() {
  if (editingQuestions.value) {
    editingQuestions.value = false
    if (!isNewProduction.value) loadDefaultQuestions(workingProduction.value)
    return
  }
  editingQuestions.value = true
}

function toggleEditCandidates() {
  editingCandidates.value = !editingCandidates.value
}

function enterProduction(p: Productie) {
  isNewProduction.value = false
  manualProductieId.value = p.id
  pickProductieId.value = p.id
  searchBox.value = ''
  showProdForm.value = false
  editingQuestions.value = false
  editingCandidates.value = false
  clearGuestOverlay()
  loadDefaultQuestions(p)
  store.setTab('production')
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
    const msg = e instanceof Error ? e.message : 'Login failed'
    if (!msg.includes('.env.local') && !msg.includes('INTERVIEW_') && !msg.includes('POSTGRES_URL')) {
      loginError.value = msg
    }
  }
}

function addQuestion(list: { value: string[] }) {
  if (list.value.length >= 7) { showToast('Maximum 7 questions'); return }
  list.value.push('')
}

function removeQuestion(list: { value: string[] }, idx: number) {
  if (list.value.length <= 1) {
    showToast('At least one question row is required')
    return
  }
  list.value.splice(idx, 1)
}

function resetQuestions(list: { value: string[] }, values?: string[]) {
  list.value = values?.length ? [...values] : ['', '', '', '']
  while (list.value.length < 4) list.value.push('')
}

function productionByName(name: string) {
  const trimmed = name.trim().toLowerCase()
  if (!trimmed) return null
  return store.activeProductions.find((p) => p.naam.trim().toLowerCase() === trimmed) || null
}

function participantDefaultsForForm() {
  const prod = productionByName(fProductie.value)
  if (fType.value !== 'Participant' || !prod) return []
  return prod.vragen.map((q) => q.trim()).filter(Boolean)
}

function resetGuestAi() {
  aiGuestStep.value = 'idle'
  aiGuestPrep.value = emptyAiPrep()
  aiGuestPreview.value = null
  aiGuestSelected.value = []
}

function resetProdAi() {
  aiProdStep.value = 'idle'
  aiProdPrep.value = emptyAiPrep()
  aiProdPreview.value = null
  aiProdSelected.value = []
}

function prepIsComplete(prep: AiPrepAnswers) {
  const structured = Boolean(prep.sector.trim() && prep.specialism.trim() && prep.timeliness.trim())
  const ownPrompt = Boolean(prep.customPrompt.trim())
  return structured || ownPrompt
}

function openGuestAiPrep() {
  const productionName = fProductie.value.trim()
  if (!productionName) {
    showToast('Select a production first')
    return
  }
  if (!fNaam.value.trim()) {
    showToast('Enter a name first')
    return
  }
  aiGuestPreview.value = null
  aiGuestSelected.value = []
  aiGuestStep.value = 'prep'
}

async function generateGuestAiProposal() {
  if (!prepIsComplete(aiGuestPrep.value)) {
    showToast('Fill the 3 briefing fields, or write your own prompt')
    return
  }

  const productionName = fProductie.value.trim()
  const prod = productionByName(productionName)
  aiGuestLoading.value = true
  aiGuestPreview.value = null
  try {
    const result = await store.suggestQuestions({
      scope: 'guest',
      productionName,
      productionDate: prod?.datum,
      guestType: fType.value || 'Other',
      name: fNaam.value.trim(),
      role: fFunctie.value.trim(),
      planning: fPlanning.value.trim(),
      productionDefaults: participantDefaultsForForm(),
      prepAnswers: {
        sector: aiGuestPrep.value.sector.trim(),
        specialism: aiGuestPrep.value.specialism.trim(),
        timeliness: aiGuestPrep.value.timeliness.trim(),
        customPrompt: aiGuestPrep.value.customPrompt.trim(),
      },
      language: aiGuestLanguage.value,
      addressForm: aiGuestAddress.value,
    })
    aiGuestPreview.value = result.questions.slice(0, 4)
    aiGuestSelected.value = aiGuestPreview.value.map(() => true)
    aiGuestStep.value = 'preview'
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'AI suggestion failed')
  } finally {
    aiGuestLoading.value = false
  }
}

function applyGuestAiPreview() {
  if (!aiGuestPreview.value?.length) return
  const picked = aiGuestPreview.value.filter((_, i) => aiGuestSelected.value[i])
  if (!picked.length) {
    showToast('Select at least one question')
    return
  }
  resetQuestions(fQuestions, picked)
  resetGuestAi()
  showToast('Selected questions applied — review before saving')
}

function dismissGuestAi() {
  resetGuestAi()
}

function productionNameForAi() {
  return (
    workingProduction.value?.naam?.trim()
    || pNaam.value.trim()
    || ''
  )
}

function productionDateForAi() {
  return workingProduction.value?.datum || pDatum.value || undefined
}

function openProdAiPrep() {
  if (!productionNameForAi()) {
    showToast(isNewProduction.value ? 'Enter a production name first' : 'Select a production first')
    return
  }
  aiProdPreview.value = null
  aiProdSelected.value = []
  aiProdStep.value = 'prep'
}

async function generateProdAiProposal() {
  if (!prepIsComplete(aiProdPrep.value)) {
    showToast('Fill the 3 briefing fields, or write your own prompt')
    return
  }

  const productionName = productionNameForAi()
  if (!productionName) {
    showToast(isNewProduction.value ? 'Enter a production name first' : 'Select a production first')
    return
  }
  const productionDate = productionDateForAi()
  aiProdLoading.value = true
  aiProdPreview.value = null
  try {
    const result = await store.suggestQuestions({
      scope: 'production',
      productionName,
      productionDate,
      prepAnswers: {
        sector: aiProdPrep.value.sector.trim(),
        specialism: aiProdPrep.value.specialism.trim(),
        timeliness: aiProdPrep.value.timeliness.trim(),
        customPrompt: aiProdPrep.value.customPrompt.trim(),
      },
      language: aiProdLanguage.value,
      addressForm: aiProdAddress.value,
    })
    aiProdPreview.value = result.questions.slice(0, 4)
    aiProdSelected.value = aiProdPreview.value.map(() => true)
    aiProdStep.value = 'preview'
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'AI suggestion failed')
  } finally {
    aiProdLoading.value = false
  }
}

function applyProductionAiPreview() {
  if (!aiProdPreview.value?.length) return
  const picked = aiProdPreview.value.filter((_, i) => aiProdSelected.value[i])
  if (!picked.length) {
    showToast('Select at least one question')
    return
  }
  resetQuestions(pQuestions, picked)
  resetProdAi()
  showToast('Selected questions applied — review before saving')
}

function dismissProductionAiPreview() {
  resetProdAi()
}

function clearForm() {
  editingId.value = null
  fProductie.value = ''
  fType.value = ''
  fPlanning.value = ''
  fGedeeld.value = false
  fNaam.value = ''
  fFunctie.value = ''
  fIntakeComplete.value = false
  resetQuestions(fQuestions)
  resetGuestAi()
}

async function saveGuest() {
  const naam = fNaam.value.trim()
  const functie = fFunctie.value.trim()
  if (!naam) { showToast('Enter a name'); return }
  if (naam.length > maxChars.value || functie.length > maxChars.value) {
    showToast(`Name and role max. ${maxChars.value} characters`)
    return
  }
  const questions = fQuestions.value.map((q) => q.trim()).filter(Boolean)
  const payload = {
    productieNaam: fProductie.value.trim(),
    type: fType.value,
    naam,
    functie,
    planning: fPlanning.value.trim(),
    gedeeld: fGedeeld.value,
    intakeComplete: intakeLockApplies(fType.value) ? fIntakeComplete.value : false,
    questions,
  }
  try {
    if (editingId.value) {
      await store.updateGuest(editingId.value, payload)
    } else {
      await store.createGuest(payload)
    }
    showToast('Saved')
    clearForm()
    clearGuestOverlay()
    store.setTab('production')
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Save failed')
  }
}

function loadForEdit(g: Gast) {
  editingId.value = g.id
  fProductie.value = sortedProductions.value.some((p) => p.naam === g.productieNaam) ? g.productieNaam : ''
  fType.value = g.type
  fPlanning.value = g.planning
  fGedeeld.value = g.gedeeld
  fIntakeComplete.value = g.intakeComplete
  fNaam.value = g.naam
  fFunctie.value = g.functie
  resetQuestions(fQuestions, g.questions)
  resetGuestAi()
  store.selectGuest(g.id)
  store.setTab('candidate')
  guestView.value = 'form'
}

function applyDeelnemerPreset() {
  if (editingId.value) return
  if (fType.value !== 'Participant' || !fProductie.value.trim()) return
  const preset = deelnemerPreset.value
  if (!preset?.vragen?.some((q) => q.trim())) return
  resetQuestions(fQuestions, preset.vragen)
}

async function saveProductie() {
  const naam = pNaam.value.trim()
  if (!naam) { showToast('Enter a production name'); return }
  const vragen = pQuestions.value.map((q) => q.trim()).filter(Boolean)
  const datum = pDatum.value
  try {
    const payload: Partial<Productie> & { id?: string; clientPassword?: string } = {
      id: editingProdId.value || undefined,
      naam,
      datum,
      status: pStatus.value,
      locatie: pLocatie.value.trim(),
      land: pLand.value.trim(),
      vragen,
    }
    if (pClientPassword.value.trim()) {
      payload.clientPassword = pClientPassword.value.trim()
    }
    const saved = await store.saveProduction(payload)
    if (!store.activeProductions.some((p) => p.id === saved.id)) {
      showToast('Save failed — production not visible after save')
      return
    }
    showToast('Production saved')
    isNewProduction.value = false
    showProdForm.value = false
    editingQuestions.value = false
    editingCandidates.value = false
    enterProduction(saved)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Save failed')
  }
}

function clearProductieForm() {
  editingProdId.value = null
  pNaam.value = ''
  pDatum.value = ''
  pStatus.value = 'Planned'
  pLocatie.value = ''
  pLand.value = ''
  pClientPassword.value = ''
  showPClientPassword.value = false
  editingProdHasClientPassword.value = false
  resetQuestions(pQuestions)
  resetProdAi()
}

function editProductie(p: Productie) {
  editingProdId.value = p.id
  pNaam.value = p.naam
  pDatum.value = p.datum
  pStatus.value = p.status
  pLocatie.value = p.locatie || ''
  pLand.value = p.land || ''
  pClientPassword.value = ''
  showPClientPassword.value = false
  editingProdHasClientPassword.value = Boolean(p.hasClientPassword)
  resetQuestions(pQuestions, p.vragen)
}

async function removeClientAccess() {
  if (!editingProdId.value) return
  try {
    await store.saveProduction({ id: editingProdId.value, clientPassword: '' })
    editingProdHasClientPassword.value = false
    pClientPassword.value = ''
    showPClientPassword.value = false
    showToast('Client access removed')
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Failed')
  }
}

async function saveClientDefaultQuestions() {
  if (isNewProduction.value) {
    editingQuestions.value = false
    showToast('Questions ready — save production details to keep them')
    return
  }
  const prod = workingProduction.value
  if (!prod) {
    showToast('Select a production first')
    return
  }
  const vragen = pQuestions.value.map((q) => q.trim()).filter(Boolean)
  try {
    await store.saveProduction({ id: prod.id, vragen })
    showToast('Default questions saved')
    resetProdAi()
    editingQuestions.value = false
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Save failed')
  }
}

function openProductionForEdit(p: Productie) {
  enterProduction(p)
  editProductie(p)
  showProdForm.value = true
}

function cancelProductionEdit() {
  if (isNewProduction.value) {
    isNewProduction.value = false
    showProdForm.value = false
    editingQuestions.value = false
    editingCandidates.value = false
    clearProductieForm()
    store.setTab('productions')
    return
  }
  showProdForm.value = false
  if (workingProduction.value) editProductie(workingProduction.value)
}

function loadDefaultQuestions(prod: Productie | null) {
  if (!prod) return
  resetQuestions(pQuestions, prod.vragen)
  resetProdAi()
}

function openControle(g: Gast) {
  store.selectGuest(g.id)
  controleNaam.value = g.naam
  controleFunctie.value = g.functie
}

async function confirmControle() {
  if (!store.activeGuest) return
  if (controleNaam.value.length > maxChars.value || controleFunctie.value.length > maxChars.value) {
    showToast(`Name and role max. ${maxChars.value} characters`)
    return
  }
  try {
    const id = store.activeGuest.id
    await store.finalizeGuest(id, controleNaam.value.trim(), controleFunctie.value.trim())
    const guest = store.guests.find((g) => g.id === id)
    if (guest && guest.status !== 'Checked') {
      await store.updateGuest(id, { status: 'Checked' })
    }
    window.alert('Please return the iPad to the crew member.')
    backToKandidaten()
    showToast('Status: Checked')
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Confirmation failed')
  }
}

function goToInterviewer() {
  showCamQuestions.value = true
  guestView.value = 'interviewer'
}

async function deleteArchivedProduction(p: Productie) {
  if (!confirm(`Are you sure you want to permanently delete production "${p.naam}"?`)) return
  await store.deleteProduction(p.id)
  showToast('Production deleted')
}

async function markOpgenomen() {
  if (!intGuest.value) return
  try {
    await store.updateGuest(intGuest.value.id, { status: 'Recorded' })
    confirmOpgenomen.value = false
    backToKandidaten()
    showToast('Marked as recorded')
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Failed')
  }
}

async function resetGuestStatus(g: Gast) {
  const prev: Record<Gast['status'], Gast['status']> = {
    Recorded: 'Checked',
    Checked: 'Entered',
    Entered: 'Entered',
  }
  await store.updateGuest(g.id, { status: prev[g.status] })
  showToast('Status reverted')
}

async function cycleGuestStatusFromList(g: Gast) {
  if (!store.isCrew) return
  try {
    await store.cycleGuestStatus(g)
    const updated = store.guests.find((x) => x.id === g.id)
    showToast(`Status: ${updated?.status || 'updated'}`)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Failed')
  }
}

function openGuestControle(g: Gast) {
  openControle(g)
  guestView.value = 'controle'
}

function guestHasQuestions(g: Gast) {
  return g.questions.some((q) => q.trim())
}

function openGuestCamera(g: Gast) {
  if (!guestHasQuestions(g)) {
    showToast('No interview questions yet')
    return
  }
  store.selectGuest(g.id)
  camSearch.value = g.regienummer
  guestView.value = 'camera'
}

function openGuestInterviewer(g: Gast) {
  if (!guestHasQuestions(g)) {
    showToast('No interview questions yet')
    return
  }
  store.selectGuest(g.id)
  guestView.value = 'interviewer'
}

function pillClass(status: Gast['status']) {
  const slug: Record<Gast['status'], string> = {
    Entered: 'entered',
    Checked: 'checked',
    Recorded: 'recorded',
  }
  return `ia-pill ia-pill--${slug[status]}`
}

function exportCsv() {
  downloadText(`interview-intake-${todayStr()}.csv`, guestsToCSV(store.guests), 'text/csv;charset=utf-8')
}

function exportLowerthird() {
  const list = store.guests.filter((g) => g.regienummer)
  downloadText(`lowerthird-${todayStr()}.csv`, lowerthirdCSV(list), 'text/csv;charset=utf-8')
}

function exportJson() {
  downloadText(`interview-intake-${todayStr()}.json`, JSON.stringify(store.guests, null, 2), 'application/json')
}

async function saveMaxChars() {
  await store.updateMaxChars(maxChars.value)
  showToast('Setting saved')
}

async function loadDemoData() {
  try {
    const result = await store.seedDemo()
    await store.sync()
    showToast(result.message)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Failed to load demo data')
  }
}

onMounted(async () => {
  document.title = 'Event Interview App — Eventshoot.nl'
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
            'Database missing locally. Add POSTGRES_URL to .env.local:',
            'Vercel dashboard → Project → Settings → Environment Variables → POSTGRES_URL → copy value',
          ].join('\n')
        : [
            'Login does not work locally yet. Create .env.local with:',
            status.missing.join(', '),
            'Or set INTERVIEW_SKIP_AUTH=true and add POSTGRES_URL only.',
          ].join('\n')
    }
    if (store.authenticated) {
      await store.sync()
      store.startPolling()
    }
  } catch (e) {
    apiConfigHint.value = e instanceof Error ? e.message : 'API unreachable'
  }
})

onUnmounted(() => {
  store.stopPolling()
})

watch(() => store.activeTab, (tab) => {
  guestView.value = null
  store.selectGuest(null)
  if (tab !== 'production') {
    showProdForm.value = false
    editingQuestions.value = false
    editingCandidates.value = false
  }
})

watch(guestView, (view) => {
  if (view === 'camera') showCamQuestions.value = false
})

watch([fType, fProductie], () => {
  applyDeelnemerPreset()
})

watch(
  () => workingProduction.value?.id ?? '',
  (id, prevId) => {
    pickProductieId.value = id || ''
    // Only reload defaults when the selected production changes.
    // Sync polling replaces production objects every few seconds and must not reset AI prep.
    if (id === prevId) return
    const prod = workingProduction.value
    if (prod && prod.id === id) loadDefaultQuestions(prod)
  },
  { immediate: true },
)

watch(showProdForm, (open) => {
  if (!open) loadDefaultQuestions(workingProduction.value)
})

watch(() => store.role, (role) => {
  if (!role) return
  store.setTab('productions')
  guestView.value = null
  settingsOpen.value = false
  showProdForm.value = false
  editingQuestions.value = false
  editingCandidates.value = false
  isNewProduction.value = false
  manualProductieId.value = null
  pickProductieId.value = ''
})
</script>

<template>
  <div class="interview-app" :class="{ 'interview-app--crew-focus': crewFocusMode }">
    <header v-if="!crewFocusMode" class="ia-brand">
      <img
        class="ia-brand__logo"
        src="/DATA_EVENTSHOOT/SITE_IMAGES/EIA_LOGO_NEG.svg"
        alt="Event Interview App"
      />
    </header>

    <!-- Login -->
    <template v-if="!store.authenticated">
      <div class="ia-login-page">
        <div class="ia-body ia-body--login">
          <div class="ia-login">
            <div class="ia-login__card">
              <p v-if="devBuildStamp" class="ia-dev-badge">Local · build {{ devBuildStamp }}</p>
              <p class="ia-login__intro">Log in with your crew or client password.</p>
              <p v-if="apiConfigHint" class="ia-error ia-error--block ia-error--pre">{{ apiConfigHint }}</p>
              <label class="ia-label" for="pw">Password</label>
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
                  :title="showPassword ? 'Hide password' : 'Show password'"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
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
                >Log in</button>
              </div>
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
                  v-if="showNavBack"
                  class="ia-tab ia-tab--labeled ia-tab--back"
                  type="button"
                  :title="navBackLabel"
                  @click="handleNavBack"
                >
                  <ArrowLeftIcon class="ia-tab__icon" aria-hidden="true" />
                  <span class="ia-tab__label">{{ navBackLabel }}</span>
                </button>
                <div
                  v-if="navTitle"
                  class="ia-nav-title"
                  :class="{ 'ia-nav-title--solo': !showNavBack }"
                >
                  {{ navTitle }}
                </div>
              </nav>
              <div class="ia-tabs-utils">
                <button
                  v-if="store.isCrew"
                  class="ia-tab ia-tab--util"
                  :class="{ active: settingsOpen }"
                  type="button"
                  title="Settings"
                  aria-label="Settings"
                  @click="settingsOpen = !settingsOpen"
                >
                  <Cog6ToothIcon class="ia-tab__icon" aria-hidden="true" />
                </button>
                <button
                  v-if="!skipAuthMode"
                  class="ia-tab ia-tab--util ia-tab--logout"
                  type="button"
                  title="Log out"
                  aria-label="Log out"
                  @click="store.logout()"
                >
                  <ArrowRightOnRectangleIcon class="ia-tab__icon" aria-hidden="true" />
                </button>
              </div>
            </div>
          </header>

      <p v-if="skipAuthMode && !crewFocusMode" class="ia-skip-auth-banner">Finetune mode: password is off. Local only or set intentionally on Vercel.</p>
      <p v-else-if="store.isClient && !crewFocusMode" class="ia-client-banner">Client view — open a production, set Participant defaults, add candidates, and mark intake complete.</p>

      <div v-if="settingsOpen && store.isCrew" class="ia-settings">
        <div class="ia-row">
          <label class="ia-label" style="margin:0">Max. characters for name &amp; role</label>
          <input
            class="ia-input"
            type="number"
            min="10"
            max="200"
            :value="store.settings.maxChars"
            style="max-width:100px"
            @change="(e) => store.settings.maxChars = parseInt((e.target as HTMLInputElement).value, 10)"
          />
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="saveMaxChars">Save</button>
        </div>
        <div class="ia-actions">
          <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="loadDemoData">Load demo data</button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="exportJson">Export JSON</button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="exportCsv">Export CSV</button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="exportLowerthird">Lowerthird CSV</button>
        </div>
      </div>

      <main class="ia-shell__main">
        <!-- CANDIDATE DETAIL -->
        <section v-if="store.activeTab === 'candidate' && (!guestView || guestView === 'form')">
            <div class="ia-card">
              <h2 class="ia-section-title">{{ editingId ? 'Edit candidate' : 'New candidate' }}</h2>
              <p v-if="guestFormLocked" class="ia-hint ia-hint--warn">Intake complete — unlock below to edit fields.</p>
              <div class="ia-row ia-row--fields">
                <div class="ia-field">
                  <label class="ia-label">Production</label>
                  <input
                    class="ia-input"
                    type="text"
                    :value="fProductie"
                    disabled
                  />
                </div>
                <div class="ia-field">
                  <label class="ia-label">Candidate type</label>
                  <select v-model="fType" class="ia-select" :disabled="guestFormLocked">
                    <option value="">— optional —</option>
                    <option v-for="t in GAST_TYPES" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
              </div>
              <div class="ia-row">
                <div>
                  <label class="ia-label">Name</label>
                  <input v-model="fNaam" class="ia-input" placeholder="First and last name" :disabled="guestFormLocked" />
                  <div class="ia-charcount" :class="{ warn: naamOverLimit }">{{ fNaam.length }} / {{ maxChars }} characters</div>
                </div>
                <div>
                  <label class="ia-label">Role</label>
                  <input v-model="fFunctie" class="ia-input" placeholder="e.g. Director of Innovation" :disabled="guestFormLocked" />
                  <div class="ia-charcount" :class="{ warn: functieOverLimit }">{{ fFunctie.length }} / {{ maxChars }} characters</div>
                </div>
              </div>
              <label class="ia-label">Schedule / time slot (optional)</label>
              <input v-model="fPlanning" class="ia-input" placeholder="e.g. interview after the keynote" :disabled="guestFormLocked" />
              <div class="ia-question-head">
                <label class="ia-label ia-label--inline">Interview questions (max. 7)</label>
                <button
                  v-if="aiGuestStep === 'idle' && !guestFormLocked"
                  class="ia-btn ia-btn--small ia-btn--secondary ia-btn--ai"
                  type="button"
                  @click="openGuestAiPrep"
                >
                  <SparklesIcon class="ia-btn__icon" aria-hidden="true" />
                  Suggest questions
                </button>
              </div>
              <ShortQuestionsTip />
              <p v-if="fType === 'Participant'" class="ia-hint">
                Production default questions are used as a basis for Participants only.
              </p>
              <p v-else-if="fType" class="ia-hint">
                {{ fType }} questions are generated separately from production defaults.
              </p>
              <div v-if="aiGuestStep === 'prep'" class="ia-ai-preview ia-ai-preview--prep">
                <p class="ia-ai-preview__title">Briefing for AI — fill the 3 fields, or write your own prompt</p>
                <div class="ia-ai-options">
                  <div class="ia-ai-options__group">
                    <span class="ia-ai-options__label">Language</span>
                    <button
                      class="ia-ai-toggle"
                      :class="{ 'ia-ai-toggle--active': aiGuestLanguage === 'nl' }"
                      type="button"
                      @click="aiGuestLanguage = 'nl'"
                    >NL</button>
                    <button
                      class="ia-ai-toggle"
                      :class="{ 'ia-ai-toggle--active': aiGuestLanguage === 'en' }"
                      type="button"
                      @click="aiGuestLanguage = 'en'"
                    >ENG</button>
                  </div>
                  <div v-if="aiGuestLanguage === 'nl'" class="ia-ai-options__group">
                    <span class="ia-ai-options__label">Address</span>
                    <button
                      class="ia-ai-toggle"
                      :class="{ 'ia-ai-toggle--active': aiGuestAddress === 'u' }"
                      type="button"
                      @click="aiGuestAddress = 'u'"
                    >u</button>
                    <button
                      class="ia-ai-toggle"
                      :class="{ 'ia-ai-toggle--active': aiGuestAddress === 'jij' }"
                      type="button"
                      @click="aiGuestAddress = 'jij'"
                    >jij</button>
                  </div>
                </div>
                <div v-for="field in AI_PREP_FIELDS" :key="field.key" class="ia-ai-prep-field">
                  <label class="ia-label">{{ field.label }}</label>
                  <input
                    v-model="aiGuestPrep[field.key]"
                    class="ia-input"
                    :placeholder="field.placeholder"
                  />
                </div>
                <div class="ia-ai-prep-field">
                  <label class="ia-label">4. Prompt (optional)</label>
                  <textarea
                    v-model="aiGuestPrep.customPrompt"
                    class="ia-textarea"
                    rows="3"
                    placeholder="Write your own prompt — e.g. focus on practical examples, avoid jargon…"
                  />
                </div>
                <div class="ia-actions ia-actions--tight">
                  <button
                    class="ia-btn ia-btn--small ia-btn--accent"
                    type="button"
                    :disabled="guestFormLocked || aiGuestLoading || !prepIsComplete(aiGuestPrep)"
                    @click="generateGuestAiProposal"
                  >
                    {{ aiGuestLoading ? 'Generating…' : 'Generate proposal (max. 4)' }}
                  </button>
                  <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="dismissGuestAi">
                    Cancel
                  </button>
                </div>
              </div>
              <div v-else-if="aiGuestStep === 'preview' && aiGuestPreview" class="ia-ai-preview">
                <p class="ia-ai-preview__title">AI proposal — select questions to use (max. 4)</p>
                <ul class="ia-ai-preview__pick">
                  <li v-for="(q, i) in aiGuestPreview" :key="i">
                    <label class="ia-ai-pick">
                      <input v-model="aiGuestSelected[i]" type="checkbox" />
                      <span>{{ q }}</span>
                    </label>
                  </li>
                </ul>
                <div class="ia-actions ia-actions--tight">
                  <button class="ia-btn ia-btn--small ia-btn--accent" type="button" :disabled="guestFormLocked" @click="applyGuestAiPreview">
                    Use selected questions
                  </button>
                  <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="dismissGuestAi">
                    Dismiss
                  </button>
                </div>
              </div>
              <div v-for="(q, i) in fQuestions" :key="`guest-q-${i}-${fQuestions.length}`" class="ia-question-row">
                <textarea v-model="fQuestions[i]" class="ia-textarea" rows="1" :placeholder="`Question ${i + 1}`" :disabled="guestFormLocked" />
                <button
                  class="ia-iconbtn ia-iconbtn--delete"
                  type="button"
                  title="Remove question"
                  :disabled="fQuestions.length <= 1 || guestFormLocked"
                  @click.stop="removeFQ(i)"
                >🗑️</button>
              </div>
              <div class="ia-actions">
                <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" :disabled="guestFormLocked" @click="addFQ">+ Question</button>
              </div>
              <ShortQuestionsTip
                en="Prefer not to share (all) questions in advance. When someone is interviewed about their own field or expertise, they usually open up naturally, and that authenticity is what you want on camera. There should always be room to skip a question. An interview should mainly be enjoyable to watch, and sharing every question up front often makes answers rehearsed and flat, with less room for the interviewer to improvise. If a client still wants to share something, they can do that themselves by email. Eventshoot.nl only facilitates."
                nl="Deel bij voorkeur niet (alle) vragen van tevoren. Als iemand over het eigen vak of expertise wordt geïnterviewd, gaat het gesprek meestal vanzelf open, en die authenticiteit wil je op camera. Er moet altijd ruimte zijn om een vraag over te slaan. Een interview moet vooral prettig zijn om naar te kijken. Alle vragen vooraf delen maakt antwoorden vaak ingestudeerd en vlak, met minder ruimte voor de interviewer om te improviseren. Wil een opdrachtgever toch iets delen, dan kan dat zelf per e-mail. Eventshoot.nl faciliteert alleen."
              />
              <div v-if="intakeLockApplies(fType)" class="ia-actions">
                <input id="fIntakeComplete" v-model="fIntakeComplete" type="checkbox" />
                <label for="fIntakeComplete" style="margin:0">Intake complete</label>
              </div>
              <div class="ia-actions">
                <input id="fGedeeld" v-model="fGedeeld" type="checkbox" :disabled="guestFormLocked" />
                <label for="fGedeeld" style="margin:0">Questions were shared with the interviewee in advance</label>
              </div>
              <div class="ia-actions">
                <button class="ia-btn" type="button" @click="saveGuest">Save</button>
                <button class="ia-btn ia-btn--secondary" type="button" @click="handleNavBack">Cancel</button>
                <button v-if="store.isCrew" class="ia-iconbtn" type="button" title="Clear" @click="clearForm">🗑️</button>
              </div>
            </div>
        </section>

        <!-- CREW OVERLAYS -->
        <template v-if="guestView === 'controle'">
            <div v-if="store.activeGuest && store.activeGuest.status === 'Entered'" class="ia-card">
              <p class="ia-controle-intro">Check name and role for the lower third in the video.</p>
              <p v-if="controleOverLimit" class="ia-controle-limit ia-controle-limit--alert">
                Too long — name and role may each be at most {{ maxChars }} characters.
              </p>
              <label class="ia-label">Name</label>
              <input v-model="controleNaam" class="ia-input ia-controle-input" />
              <div class="ia-charcount" :class="{ warn: controleNaamOver }">{{ controleNaam.length }} / {{ maxChars }} characters</div>
              <label class="ia-label">Role</label>
              <input v-model="controleFunctie" class="ia-input ia-controle-input" />
              <div class="ia-charcount" :class="{ warn: controleFunctieOver }">{{ controleFunctie.length }} / {{ maxChars }} characters</div>
              <div class="ia-actions" style="margin-top:1.5rem">
                <button class="ia-btn ia-btn--ok" type="button" :disabled="controleOverLimit" @click="confirmControle">
                  ✓ Checked, looks good
                </button>
              </div>
            </div>
          </template>

          <template v-if="guestView === 'camera'">
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
                <button class="ia-btn ia-btn--accent" type="button" @click="goToInterviewer">Show interview questions →</button>
              </div>
            </div>
          </template>

          <template v-if="guestView === 'interviewer'">
            <div v-if="intGuest" class="ia-card ia-int-full">
              <div class="ia-int-full__head">
                <div class="ia-int-full__regie">Crew #{{ intGuest.regienummer || '—' }}</div>
                <div class="ia-int-full__naam">{{ intGuest.naam }}</div>
                <div class="ia-int-full__functie">{{ intGuest.functie }}</div>
              </div>
              <div v-if="intGuest.gedeeld" class="ia-int-full__warn">
                Note: these questions were shared with the guest in advance
              </div>
              <ol class="ia-questions">
                <li v-for="(q, i) in intGuest.questions.filter(q => q)" :key="i">
                  <span class="ia-questions__num">{{ i + 1 }}.</span>
                  <span class="ia-questions__text">{{ q }}</span>
                </li>
              </ol>
              <div class="ia-actions">
                <button v-if="!confirmOpgenomen" class="ia-btn ia-btn--ok" type="button" @click="confirmOpgenomen = true">✓ Recorded</button>
                <template v-else>
                  <span>Interview complete?</span>
                  <button class="ia-btn ia-btn--ok" type="button" @click="markOpgenomen">Yes, recorded</button>
                  <button class="ia-btn ia-btn--secondary" type="button" @click="confirmOpgenomen = false">Cancel</button>
                </template>
              </div>
            </div>
          </template>

        <!-- PRODUCTION DETAIL (new + existing share the same 3 sections) -->
        <section v-if="productionScreenOpen">
            <!-- A: Production details -->
            <div class="ia-card ia-prod-top">
              <div class="ia-prod-detail-head">
                <div>
                  <p v-if="!isNewProduction" class="ia-hint" style="margin:0 0 0.25rem">Event Interviews</p>
                  <h2 class="ia-section-title" style="margin:0">{{ productionHeading }}</h2>
                  <p v-if="!showProdForm" class="ia-hint" style="margin:0.35rem 0 0">{{ productionMeta }}</p>
                </div>
                <button
                  v-if="store.isCrew && !isNewProduction"
                  class="ia-editbtn"
                  :class="{ 'ia-editbtn--active': showProdForm }"
                  type="button"
                  :title="showProdForm ? 'Edit mode — tap to close' : 'View mode — tap to edit'"
                  :aria-label="showProdForm ? 'Edit mode — tap to close' : 'View mode — tap to edit'"
                  :aria-pressed="showProdForm"
                  @click="toggleEditProduction"
                >
                  <PencilSquareSolidIcon v-if="showProdForm" class="ia-editbtn__icon" aria-hidden="true" />
                  <PencilSquareIcon v-else class="ia-editbtn__icon" aria-hidden="true" />
                </button>
              </div>
              <div v-if="workingProductionCounts && !isNewProduction" class="ia-progress-chips">
                <span class="ia-progress-chip">Total {{ workingProductionCounts.total }}</span>
                <span class="ia-progress-chip ia-progress-chip--entered">Entered {{ workingProductionCounts.entered }}</span>
                <span class="ia-progress-chip ia-progress-chip--checked">Checked {{ workingProductionCounts.checked }}</span>
                <span class="ia-progress-chip ia-progress-chip--recorded">Recorded {{ workingProductionCounts.recorded }}</span>
              </div>

              <div
                v-if="showProdForm && store.isCrew"
                class="ia-prod-form"
                :class="{ 'ia-prod-form--inline': !isNewProduction }"
              >
                <label class="ia-label">Production name</label>
                <input v-model="pNaam" class="ia-input" placeholder="name of the production" />
                <label class="ia-label">Production date</label>
                <input v-model="pDatum" class="ia-input" type="date" />
                <label class="ia-label">Location</label>
                <input v-model="pLocatie" class="ia-input" placeholder="venue or city" />
                <label class="ia-label">Country</label>
                <input v-model="pLand" class="ia-input" placeholder="e.g. Netherlands" />
                <label class="ia-label">Status</label>
                <select v-model="pStatus" class="ia-select">
                  <option v-for="s in PRODUCTIE_STATUSES" :key="s" :value="s">{{ s }}</option>
                </select>
                <label class="ia-label">Client password (optional)</label>
                <div class="ia-password-wrap">
                  <input
                    v-model="pClientPassword"
                    class="ia-input ia-password-wrap__input"
                    :type="showPClientPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    :placeholder="editingProdHasClientPassword ? 'Leave empty to keep current password' : 'Set password for client login'"
                  />
                  <button
                    class="ia-password-wrap__toggle"
                    type="button"
                    :title="showPClientPassword ? 'Hide password' : 'Show password'"
                    :aria-label="showPClientPassword ? 'Hide password' : 'Show password'"
                    @click="showPClientPassword = !showPClientPassword"
                  >
                    <EyeSlashIcon v-if="showPClientPassword" class="ia-password-wrap__icon" />
                    <EyeIcon v-else class="ia-password-wrap__icon" />
                  </button>
                </div>
                <p v-if="editingProdHasClientPassword" class="ia-hint">Client access is active for this production.</p>
                <div v-if="editingProdHasClientPassword" class="ia-actions ia-actions--tight">
                  <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="removeClientAccess">
                    Remove client access
                  </button>
                </div>
                <div class="ia-actions">
                  <button class="ia-btn" type="button" @click="saveProductie">Save</button>
                  <button class="ia-btn ia-btn--secondary" type="button" @click="cancelProductionEdit">Cancel</button>
                </div>
              </div>
            </div>

            <!-- B: Default participant questions -->
            <div class="ia-card">
              <div class="ia-prod-detail-head">
                <div>
                  <h2 class="ia-section-title" style="margin:0">Default questions for Participants</h2>
                  <p class="ia-hint" style="margin:0.35rem 0 0">
                    These defaults are used when you add a Participant.
                  </p>
                </div>
                <button
                  class="ia-editbtn"
                  :class="{ 'ia-editbtn--active': editingQuestions }"
                  type="button"
                  :title="editingQuestions ? 'Edit mode — tap to close' : 'View mode — tap to edit'"
                  :aria-label="editingQuestions ? 'Edit mode — tap to close' : 'View mode — tap to edit'"
                  :aria-pressed="editingQuestions"
                  @click="toggleEditQuestions"
                >
                  <PencilSquareSolidIcon v-if="editingQuestions" class="ia-editbtn__icon" aria-hidden="true" />
                  <PencilSquareIcon v-else class="ia-editbtn__icon" aria-hidden="true" />
                </button>
              </div>
              <template v-if="!editingQuestions">
                <ol v-if="pQuestions.some((q) => q.trim())" class="ia-questions ia-questions--preview">
                  <li v-for="(q, i) in pQuestions.filter((q) => q.trim())" :key="`pq-view-${i}`">
                    <span class="ia-questions__num">{{ i + 1 }}.</span>
                    <span class="ia-questions__text">{{ q }}</span>
                  </li>
                </ol>
                <p v-else class="ia-empty">No default questions yet. Tap the pencil to add some.</p>
              </template>
              <ParticipantDefaultsCard
                v-else
                embedded
                v-model:questions="pQuestions"
                v-model:ai-prep="aiProdPrep"
                v-model:ai-language="aiProdLanguage"
                v-model:ai-address="aiProdAddress"
                v-model:ai-selected="aiProdSelected"
                :ai-step="aiProdStep"
                :ai-loading="aiProdLoading"
                :ai-preview="aiProdPreview"
                :prep-complete="prepIsComplete(aiProdPrep)"
                @open-ai="openProdAiPrep"
                @generate="generateProdAiProposal"
                @apply="applyProductionAiPreview"
                @dismiss="dismissProductionAiPreview"
                @add-question="addPQ"
                @remove-question="removePQ"
                @save="saveClientDefaultQuestions"
              />
            </div>

            <!-- C: Interview candidates -->
            <div class="ia-card">
              <div class="ia-prod-detail-head">
                <div>
                  <h2 class="ia-section-title" style="margin:0">Interview candidates</h2>
                  <p v-if="isNewProduction" class="ia-hint" style="margin:0.35rem 0 0">
                    Save production details first, then add candidates.
                  </p>
                </div>
                <button
                  v-if="!isNewProduction"
                  class="ia-editbtn"
                  :class="{ 'ia-editbtn--active': editingCandidates }"
                  type="button"
                  :title="editingCandidates ? 'Edit mode — tap to close' : 'View mode — tap to edit'"
                  :aria-label="editingCandidates ? 'Edit mode — tap to close' : 'View mode — tap to edit'"
                  :aria-pressed="editingCandidates"
                  @click="toggleEditCandidates"
                >
                  <PencilSquareSolidIcon v-if="editingCandidates" class="ia-editbtn__icon" aria-hidden="true" />
                  <PencilSquareIcon v-else class="ia-editbtn__icon" aria-hidden="true" />
                </button>
              </div>

              <template v-if="isNewProduction">
                <p class="ia-empty">Candidates become available after you save this production.</p>
              </template>
              <template v-else>
                <div v-if="editingCandidates" class="ia-actions ia-actions--tight">
                  <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="openNewGuest">
                    + New candidate
                  </button>
                </div>
                <input
                  v-model="searchBox"
                  class="ia-input ia-search"
                  type="search"
                  placeholder="Search by name..."
                />
                <table class="ia-table">
                  <thead>
                    <tr>
                      <th v-if="store.isCrew">Crew #</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="g in filteredGuests"
                      :key="g.id"
                      class="data-row"
                      :class="{ 'data-row--clickable': editingCandidates || store.isClient }"
                      @click="(editingCandidates || store.isClient) && loadForEdit(g)"
                    >
                      <td v-if="store.isCrew">{{ g.regienummer || '—' }}</td>
                      <td>
                        <div>{{ g.naam }}</div>
                        <small v-if="g.planning" style="color:var(--color-text-muted)">{{ g.planning }}</small>
                        <small v-if="g.intakeComplete" class="ia-intake-badge">Intake complete</small>
                      </td>
                      <td>{{ g.functie }}</td>
                      <td @click.stop>
                        <button
                          v-if="store.isCrew"
                          type="button"
                          :class="pillClass(g.status)"
                          :title="`Change status (now ${g.status})`"
                          @click="cycleGuestStatusFromList(g)"
                        >{{ g.status }}</button>
                        <span v-else :class="pillClass(g.status)">{{ g.status }}</span>
                      </td>
                      <td class="ia-row-actions" @click.stop>
                        <!-- Edit mode: candidate detail + delete -->
                        <template v-if="editingCandidates">
                          <button class="ia-iconbtn" type="button" title="Edit" @click="loadForEdit(g)">✏️</button>
                          <button
                            v-if="!g.intakeComplete || store.isCrew"
                            class="ia-iconbtn"
                            type="button"
                            title="Delete"
                            @click="store.deleteGuest(g.id)"
                          >🗑️</button>
                        </template>
                        <!-- Production mode (crew): phase actions only -->
                        <template v-else-if="store.isCrew">
                          <button
                            v-if="g.status === 'Entered'"
                            class="ia-iconbtn"
                            type="button"
                            title="Check"
                            @click="openGuestControle(g)"
                          >✓</button>
                          <template v-else-if="g.status === 'Checked'">
                            <button
                              class="ia-iconbtn"
                              :class="{ 'ia-iconbtn--muted': !guestHasQuestions(g) }"
                              type="button"
                              :title="guestHasQuestions(g) ? 'Camera' : 'No interview questions yet'"
                              @click="openGuestCamera(g)"
                            >📷</button>
                            <button
                              class="ia-iconbtn"
                              :class="{ 'ia-iconbtn--muted': !guestHasQuestions(g) }"
                              type="button"
                              :title="guestHasQuestions(g) ? 'Interviewer' : 'No interview questions yet'"
                              @click="openGuestInterviewer(g)"
                            >🎤</button>
                          </template>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!filteredGuests.length" class="ia-empty">No candidates for this production yet.{{ editingCandidates ? ' Click + New candidate to add someone.' : ' Tap the pencil to manage candidates.' }}</p>
              </template>
            </div>
        </section>

        <!-- PRODUCTIONS LIST -->
        <section v-if="store.activeTab === 'productions' && !guestView">
          <div class="ia-card">
            <h2 class="ia-section-title">Active Production(s)</h2>
            <p class="ia-hint">Click a production to open its details, default questions and candidates.</p>
            <div v-if="store.isCrew" class="ia-table-toolbar">
              <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="openNewProductie">
                + New production
              </button>
            </div>
            <table class="ia-table">
              <thead>
                <tr>
                  <th>Production</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Candidates</th>
                  <th v-if="store.isCrew"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in store.activeProductions"
                  :key="p.id"
                  class="data-row"
                  @click="enterProduction(p)"
                >
                  <td>
                    <span class="ia-prod-name">{{ p.naam }}</span>
                  </td>
                  <td>{{ p.datum ? formatDisplayDate(p.datum) : '—' }}</td>
                  <td>{{ p.status }}</td>
                  <td>
                    <div class="ia-progress-chips ia-progress-chips--inline">
                      <span class="ia-progress-chip">Total {{ productionCounts(p).total }}</span>
                      <span class="ia-progress-chip ia-progress-chip--entered">Entered {{ productionCounts(p).entered }}</span>
                      <span class="ia-progress-chip ia-progress-chip--checked">Checked {{ productionCounts(p).checked }}</span>
                      <span class="ia-progress-chip ia-progress-chip--recorded">Recorded {{ productionCounts(p).recorded }}</span>
                    </div>
                  </td>
                  <td v-if="store.isCrew" class="ia-row-actions" @click.stop>
                    <button class="ia-iconbtn" type="button" title="Edit" @click="openProductionForEdit(p)">✏️</button>
                    <button class="ia-iconbtn" type="button" title="Archive" @click="store.archiveProduction(p.id)">📦</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="!store.activeProductions.length" class="ia-empty">
              {{ store.isCrew ? 'No productions yet. Click + New production to get started.' : 'No productions available for this login.' }}
            </p>
          </div>
          <div v-if="store.isCrew && store.archivedProductions.length" class="ia-card">
            <h2 class="ia-section-title">Archive</h2>
            <p class="ia-list-header__sub">Archived productions and their candidates.</p>
            <table class="ia-table">
              <thead><tr><th>Production</th><th>Date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr v-for="p in store.archivedProductions" :key="p.id">
                  <td>{{ p.naam }}</td>
                  <td>{{ p.datum ? formatDisplayDate(p.datum) : '—' }}</td>
                  <td>{{ p.status }}</td>
                  <td>
                    <button class="ia-iconbtn" type="button" title="Restore" @click="store.restoreProduction(p.id)">↩️</button>
                    <button class="ia-iconbtn" type="button" title="Delete permanently" @click="deleteArchivedProduction(p)">🗑️</button>
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

    <!-- Shared footer on all pages -->
    <footer v-if="!crewFocusMode" class="ia-app-footer">
      <p class="ia-app-motto">Your event is a goldmine of content</p>
      <a class="ia-app-privacy" href="/privacy/" target="_blank" rel="noopener noreferrer">Privacy</a>
    </footer>

    <div v-if="toast" class="ia-toast">{{ toast }}</div>
  </div>
</template>
