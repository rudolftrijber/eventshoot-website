import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Gast, GastStatus, InterviewSettings, Productie, TabId } from '@/types/interview'

const POLL_MS = 3000

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    let message = 'Request mislukt'
    try {
      const err = JSON.parse(text) as { error?: string }
      message = err.error || message
    } catch {
      if (text && !text.includes('FUNCTION_INVOCATION_FAILED')) message = text.slice(0, 120)
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export const useInterviewStore = defineStore('interview', () => {
  const authenticated = ref(false)
  const loading = ref(false)
  const error = ref('')
  const guests = ref<Gast[]>([])
  const productions = ref<Productie[]>([])
  const settings = ref<InterviewSettings>({ maxChars: 40 })
  const activeTab = ref<TabId>('nieuw')
  const activeGuestId = ref<string | null>(null)
  const pollTimer = ref<ReturnType<typeof setInterval> | null>(null)

  const activeProductions = computed(() => productions.value.filter((p) => !p.archivedAt))
  const archivedProductions = computed(() => productions.value.filter((p) => p.archivedAt))
  const opgenomenGuests = computed(() => guests.value.filter((g) => g.status === 'Opgenomen'))
  const activeGuest = computed(() => guests.value.find((g) => g.id === activeGuestId.value) || null)

  const productieNames = computed(() => {
    const names = new Set<string>()
    guests.value.forEach((g) => { if (g.productieNaam) names.add(g.productieNaam) })
    activeProductions.value.forEach((p) => names.add(p.naam))
    return Array.from(names).sort()
  })

  async function checkAuth() {
    const data = await api<{ authenticated: boolean }>('/api/interview/login')
    authenticated.value = data.authenticated
    return data.authenticated
  }

  async function login(password: string) {
    error.value = ''
    await api('/api/interview/login', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', password }),
    })
    authenticated.value = true
    await sync()
    startPolling()
  }

  async function logout() {
    await api('/api/interview/login', {
      method: 'POST',
      body: JSON.stringify({ action: 'logout' }),
    })
    authenticated.value = false
    stopPolling()
  }

  async function sync() {
    loading.value = true
    error.value = ''
    try {
      const data = await api<{
        guests: Gast[]
        productions: Productie[]
        settings: InterviewSettings
      }>('/api/interview/sync')
      guests.value = data.guests
      productions.value = data.productions
      settings.value = data.settings
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Sync mislukt'
      if (error.value === 'Niet ingelogd') authenticated.value = false
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

  async function finalizeGuest(id: string, naam: string, functie: string) {
    return updateGuest(id, { action: 'finalize', naam, functie })
  }

  async function deleteGuest(id: string) {
    await api(`/api/interview/guests/${id}`, { method: 'DELETE' })
    await sync()
  }

  async function cycleGuestStatus(guest: Gast) {
    const order: GastStatus[] = ['Ingevoerd', 'Gecontroleerd', 'Opgenomen']
    const idx = order.indexOf(guest.status)
    const next = order[(idx + 1) % order.length]
    if (next === 'Gecontroleerd') {
      await updateGuest(guest.id, { action: 'finalize', naam: guest.naam, functie: guest.functie })
    } else {
      await updateGuest(guest.id, { status: next })
    }
  }

  async function saveProduction(payload: Partial<Productie> & { id?: string }) {
    if (payload.id) {
      await api(`/api/interview/productions/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
    } else {
      await api('/api/interview/productions', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    }
    await sync()
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

  function setTab(tab: TabId) {
    activeTab.value = tab
    window.scrollTo(0, 0)
  }

  function selectGuest(id: string | null) {
    activeGuestId.value = id
  }

  return {
    authenticated,
    loading,
    error,
    guests,
    productions,
    settings,
    activeTab,
    activeGuestId,
    activeProductions,
    archivedProductions,
    opgenomenGuests,
    activeGuest,
    productieNames,
    checkAuth,
    login,
    logout,
    sync,
    startPolling,
    stopPolling,
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
    setTab,
    selectGuest,
  }
})
