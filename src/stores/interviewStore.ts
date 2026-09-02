import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Gast, GastStatus, InterviewRole, InterviewSettings, Productie, TabId } from '@/types/interview'

const POLL_MS = 3000
const IDLE_MS = 10 * 60 * 1000
const IDLE_ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'] as const

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
      ...options,
    })
  } catch {
    throw new Error(
      'API unavailable. Restart npm run dev. Ensure .env.local exists with INTERVIEW_APP_PASSWORD, INTERVIEW_SESSION_SECRET and POSTGRES_URL.',
    )
  }
  if (!res.ok) {
    const text = await res.text()
    let message = 'Request failed'
    try {
      const err = JSON.parse(text) as { error?: string }
      message = err.error || message
    } catch {
      if (text.includes('FUNCTION_INVOCATION_FAILED')) {
        message = 'Server API error. Deploy the latest version or use vercel dev locally.'
      } else if (text) {
        message = text.slice(0, 120)
      }
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export const useInterviewStore = defineStore('interview', () => {
  const authenticated = ref(false)
  const role = ref<InterviewRole | null>(null)
  const crewName = ref<string | null>(null)
  const clientProductionIds = ref<string[]>([])
  const loading = ref(false)
  const error = ref('')
  const guests = ref<Gast[]>([])
  const productions = ref<Productie[]>([])
  const settings = ref<InterviewSettings>({ maxChars: 40 })
  const activeTab = ref<TabId>('productions')
  const activeGuestId = ref<string | null>(null)
  const pollTimer = ref<ReturnType<typeof setInterval> | null>(null)
  const idleTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const idleLoggedOut = ref(false)
  const idleWatching = ref(false)
  let lastActivityAt = 0

  const activeProductions = computed(() => productions.value.filter((p) => !p.archivedAt))
  const archivedProductions = computed(() => productions.value.filter((p) => p.archivedAt))
  const recordedGuests = computed(() => guests.value.filter((g) => g.status === 'Recorded'))
  const activeGuest = computed(() => guests.value.find((g) => g.id === activeGuestId.value) || null)
  const isCrew = computed(() => role.value === 'crew')
  const isClient = computed(() => role.value === 'client')

  const productieNames = computed(() => {
    const names = new Set<string>()
    guests.value.forEach((g) => { if (g.productieNaam) names.add(g.productieNaam) })
    activeProductions.value.forEach((p) => names.add(p.naam))
    return Array.from(names).sort()
  })

  async function checkAuth() {
    const data = await api<{
      authenticated: boolean
      role?: InterviewRole | null
      productionIds?: string[]
      crewName?: string | null
      skipAuth?: boolean
      configured?: boolean
      missing?: string[]
    }>('/api/interview-login')
    authenticated.value = Boolean(data.skipAuth || data.authenticated)
    role.value = data.skipAuth ? 'crew' : (data.role || null)
    crewName.value = data.skipAuth ? null : (data.crewName || null)
    clientProductionIds.value = data.productionIds || []
    return data
  }

  async function login(password: string, selectedCrewName = '') {
    error.value = ''
    const data = await api<{ ok: boolean; role?: InterviewRole; productionIds?: string[]; crewName?: string }>(
      '/api/interview-login',
      {
        method: 'POST',
        body: JSON.stringify({
          action: 'login',
          password,
          crewName: selectedCrewName || undefined,
        }),
      },
    )
    authenticated.value = true
    role.value = data.role || 'crew'
    crewName.value = data.crewName || null
    clientProductionIds.value = data.productionIds || []
    idleLoggedOut.value = false
    await sync()
    startPolling()
    startIdleWatch()
  }

  function clearLocalSession() {
    authenticated.value = false
    role.value = null
    crewName.value = null
    clientProductionIds.value = []
    guests.value = []
    productions.value = []
    activeGuestId.value = null
    stopPolling()
    stopIdleWatch()
  }

  async function logout() {
    clearLocalSession()
    try {
      await api('/api/interview-login', {
        method: 'POST',
        body: JSON.stringify({ action: 'logout' }),
      })
    } catch {
      // Local logout still applies if the network call fails.
    }
  }

  async function logoutDueToIdle() {
    if (!authenticated.value) return
    idleLoggedOut.value = true
    await logout()
  }

  async function sync() {
    loading.value = true
    error.value = ''
    try {
      const data = await api<{
        guests: Gast[]
        productions: Productie[]
        settings: InterviewSettings
        role?: InterviewRole | null
        productionIds?: string[]
      }>('/api/interview/sync')
      guests.value = data.guests
      productions.value = data.productions
      settings.value = data.settings
      if (data.role) role.value = data.role
      if (data.productionIds) clientProductionIds.value = data.productionIds
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Sync failed'
      if (error.value === 'Not logged in') {
        clearLocalSession()
      }
    } finally {
      loading.value = false
    }
  }

  function startPolling() {
    stopPolling()
    pollTimer.value = setInterval(() => { void sync() }, POLL_MS)
  }

  function stopPolling() {
    if (pollTimer.value) {
      clearInterval(pollTimer.value)
      pollTimer.value = null
    }
  }

  function resetIdleTimer() {
    if (idleTimer.value) clearTimeout(idleTimer.value)
    idleTimer.value = setTimeout(() => {
      void logoutDueToIdle()
    }, IDLE_MS)
  }

  function noteActivity() {
    if (!authenticated.value) return
    lastActivityAt = Date.now()
    resetIdleTimer()
  }

  function onVisibilityChange() {
    if (typeof document === 'undefined' || document.hidden) return
    if (!authenticated.value) return
    if (lastActivityAt && Date.now() - lastActivityAt >= IDLE_MS) {
      void logoutDueToIdle()
      return
    }
    noteActivity()
  }

  function startIdleWatch() {
    if (typeof window === 'undefined') return
    stopIdleWatch()
    idleWatching.value = true
    lastActivityAt = Date.now()
    resetIdleTimer()
    for (const event of IDLE_ACTIVITY_EVENTS) {
      window.addEventListener(event, noteActivity, { capture: true, passive: true })
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
  }

  function stopIdleWatch() {
    if (idleTimer.value) {
      clearTimeout(idleTimer.value)
      idleTimer.value = null
    }
    if (typeof window === 'undefined') {
      idleWatching.value = false
      return
    }
    if (!idleWatching.value) return
    for (const event of IDLE_ACTIVITY_EVENTS) {
      window.removeEventListener(event, noteActivity, { capture: true })
    }
    document.removeEventListener('visibilitychange', onVisibilityChange)
    idleWatching.value = false
  }

  async function createGuest(payload: Partial<Gast>) {
    const data = await api<{ guest: Gast }>('/api/interview/guests', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    await sync()
    return data.guest
  }

  async function updateGuest(id: string, payload: Partial<Gast> & { action?: string }) {
    const data = await api<{ guest: Gast }>(`/api/interview/guests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    await sync()
    return data.guest
  }

  async function finalizeGuest(id: string, naam: string, functie: string, organisatie = '') {
    return updateGuest(id, { action: 'finalize', naam, functie, organisatie })
  }

  async function deleteGuest(id: string) {
    await api(`/api/interview/guests/${id}`, { method: 'DELETE' })
    await sync()
  }

  async function cycleGuestStatus(guest: Gast) {
    const order: GastStatus[] = ['Entered', 'Checked', 'Recorded']
    const idx = order.indexOf(guest.status)
    const next = order[(idx + 1) % order.length]
    if (next === 'Checked') {
      await updateGuest(guest.id, {
        action: 'finalize',
        naam: guest.naam,
        functie: guest.functie,
        organisatie: guest.organisatie,
      })
    } else {
      await updateGuest(guest.id, { status: next })
    }
  }

  function upsertProduction(production: Productie) {
    const idx = productions.value.findIndex((p) => p.id === production.id)
    if (idx >= 0) {
      productions.value[idx] = production
    } else {
      productions.value = [production, ...productions.value]
    }
  }

  async function saveProduction(payload: Partial<Productie> & { id?: string; clientPassword?: string }) {
    let production: Productie
    if (payload.id) {
      const data = await api<{ production: Productie }>(`/api/interview/productions/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      production = data.production
    } else {
      const data = await api<{ production: Productie }>('/api/interview/productions', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      production = data.production
    }
    upsertProduction(production)
    try {
      await sync()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Sync failed'
    }
    upsertProduction(production)
    return production
  }

  async function archiveProduction(id: string) {
    await api(`/api/interview/productions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'archive' }),
    })
    await sync()
  }

  async function restoreProduction(id: string) {
    await api(`/api/interview/productions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'restore' }),
    })
    await sync()
  }

  async function deleteProduction(id: string) {
    await api(`/api/interview/productions/${id}`, { method: 'DELETE' })
    await sync()
  }

  async function updateMaxChars(maxChars: number) {
    await api('/api/interview/settings', {
      method: 'PATCH',
      body: JSON.stringify({ maxChars }),
    })
    await sync()
  }

  async function seedDemo() {
    return api<{ ok: boolean; message: string; created: boolean }>('/api/interview/seed-demo', {
      method: 'POST',
      body: JSON.stringify({}),
    })
  }

  async function uploadPng(payload: {
    kind: 'production-png' | 'guest-screenshot' | 'guest-thumbnail'
    ratio: '16x9' | '9x16' | '4x5'
    dataUrl: string
    filename?: string
  }) {
    return api<{ url: string }>('/api/interview/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async function suggestQuestions(payload: {
    scope: 'guest' | 'production'
    productionName: string
    productionDate?: string
    productionContext?: string
    guestType?: string
    name?: string
    role?: string
    organization?: string
    planning?: string
    productionDefaults?: string[]
    prepAnswers: { sector: string; specialism: string; timeliness: string; customPrompt?: string }
    language?: 'nl' | 'en'
    addressForm?: 'u' | 'jij'
  }) {
    return api<{ questions: string[] }>('/api/interview/suggest-questions', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  function setTab(tab: TabId) {
    activeTab.value = tab
    window.scrollTo(0, 0)
  }

  function selectGuest(id: string | null) {
    activeGuestId.value = id
  }

  return {
    authenticated,
    role,
    crewName,
    clientProductionIds,
    isCrew,
    isClient,
    loading,
    error,
    guests,
    productions,
    settings,
    activeTab,
    activeGuestId,
    activeProductions,
    archivedProductions,
    recordedGuests,
    activeGuest,
    productieNames,
    idleLoggedOut,
    checkAuth,
    login,
    logout,
    sync,
    startPolling,
    stopPolling,
    startIdleWatch,
    stopIdleWatch,
    createGuest,
    updateGuest,
    finalizeGuest,
    deleteGuest,
    cycleGuestStatus,
    saveProduction,
    archiveProduction,
    restoreProduction,
    deleteProduction,
    updateMaxChars,
    seedDemo,
    uploadPng,
    suggestQuestions,
    setTab,
    selectGuest,
  }
})
