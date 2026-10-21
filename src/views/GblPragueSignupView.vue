<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'

type Booking = {
  id: string
  firstName: string
  lastName: string
  firm: string
}

type Slot = {
  id: string
  start: string
  end: string
  booking: Booking | null
}

type Day = {
  id: string
  label: string
  labelNl: string
  hours: string
  hoursNl: string
  location: string
  locationNl: string
  closed?: boolean
  slots: Slot[]
}

type Schedule = {
  admin: boolean
  days: Day[]
}

type BookError = {
  error?: string
  dayLabel?: string
  dayLabelNl?: string
  start?: string
  end?: string
}

const ADMIN_STORAGE = 'gbl-praag-admin-key'
const route = useRoute()
const isAdmin = computed(() => route.name === 'gbl-praag-beheer')

const days = ref<Day[]>([])
const loading = ref(true)
const loadError = ref(false)
const adminKey = ref('')
const adminInput = ref('')
const adminUnlocked = ref(false)
const adminMessage = ref('')
const notice = ref('')
const formError = ref('')
const saving = ref(false)
const clearingId = ref('')
const selected = ref<{ day: Day; slot: Slot } | null>(null)
const firstName = ref('')
const lastName = ref('')
const firm = ref('')
const dialog = ref<HTMLDialogElement | null>(null)

let pollTimer = 0
let robotsMeta: HTMLMetaElement | null = null

const bookableDays = computed(() => days.value.filter((day) => !day.closed))
const openCount = computed(() =>
  bookableDays.value.reduce((sum, day) => sum + day.slots.filter((slot) => !slot.booking).length, 0),
)
const totalCount = computed(() => bookableDays.value.reduce((sum, day) => sum + day.slots.length, 0))

function dayTitle(day: Day) {
  return isAdmin.value ? day.labelNl : day.label
}

function dayMeta(day: Day) {
  return isAdmin.value ? `${day.hoursNl} · ${day.locationNl}` : `${day.hours} · ${day.location}`
}

function applyRobots() {
  robotsMeta = document.querySelector('meta[name="robots"]')
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta')
    robotsMeta.setAttribute('name', 'robots')
    document.head.appendChild(robotsMeta)
  }
  robotsMeta.setAttribute('content', 'noindex, nofollow')
}

function requestHeaders(): HeadersInit {
  const headers: Record<string, string> = {}
  if (adminKey.value) headers['X-Gbl-Admin-Key'] = adminKey.value
  return headers
}

async function load(silent = false) {
  if (!silent) loading.value = true
  loadError.value = false
  try {
    const res = await fetch('/api/gbl-prague', { headers: requestHeaders(), cache: 'no-store' })
    if (!res.ok) throw new Error('load failed')
    const data = (await res.json()) as Schedule
    days.value = data.days
    if (isAdmin.value && adminKey.value) {
      adminUnlocked.value = Boolean(data.admin)
      if (!data.admin) {
        adminKey.value = ''
        sessionStorage.removeItem(ADMIN_STORAGE)
      }
    }
  } catch {
    if (!silent) loadError.value = true
  } finally {
    if (!silent) loading.value = false
  }
}

async function openSlot(day: Day, slot: Slot) {
  if (day.closed || slot.booking || saving.value) return
  selected.value = { day, slot }
  firstName.value = ''
  lastName.value = ''
  firm.value = ''
  formError.value = ''
  await nextTick()
  dialog.value?.showModal()
}

function closeDialog() {
  dialog.value?.close()
  selected.value = null
}

async function book() {
  const current = selected.value
  if (!current || saving.value) return
  const first = firstName.value.trim()
  const last = lastName.value.trim()
  const company = firm.value.trim()
  if (!first || !last || !company) {
    formError.value = 'Enter your first name, last name and firm name.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const res = await fetch('/api/gbl-prague', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotId: current.slot.id,
        firstName: first,
        lastName: last,
        firm: company,
      }),
    })
    const data = (await res.json()) as Schedule & BookError
    if (res.status === 409 && data.error === 'already_booked') {
      formError.value = `This name already has a slot on ${data.dayLabel}, ${data.start} to ${data.end}.`
      return
    }
    if (res.status === 403 && data.error === 'closed') {
      formError.value = 'This day is not open yet.'
      await load(true)
      return
    }
    if (res.status === 409 && data.error === 'slot_taken') {
      formError.value = 'This slot was just taken. Choose another one.'
      if (data.days) days.value = data.days
      else await load(true)
      return
    }
    if (!res.ok || !data.days) {
      formError.value = 'Could not save the booking. Try again.'
      return
    }
    days.value = data.days
    notice.value = `Booked: ${current.day.label}, ${current.slot.start} to ${current.slot.end}.`
    closeDialog()
  } catch {
    formError.value = 'Could not save the booking. Try again.'
  } finally {
    saving.value = false
  }
}

async function unlockAdmin() {
  adminMessage.value = ''
  adminKey.value = adminInput.value.trim()
  if (!adminKey.value) {
    adminMessage.value = 'Vul de beheercode in.'
    return
  }
  await load(true)
  if (adminUnlocked.value) {
    sessionStorage.setItem(ADMIN_STORAGE, adminKey.value)
    adminInput.value = ''
    adminMessage.value = 'Beheer actief. Je kunt een blok vrijgeven.'
    return
  }
  adminKey.value = ''
  adminMessage.value = 'De code klopt niet.'
}

async function clearSlot(slot: Slot) {
  if (!slot.booking || clearingId.value) return
  const who = `${slot.booking.firstName} ${slot.booking.lastName}, ${slot.booking.firm}`
  if (!window.confirm(`Blok vrijgeven voor ${who}?`)) return
  clearingId.value = slot.booking.id
  adminMessage.value = ''
  try {
    const res = await fetch('/api/gbl-prague', {
      method: 'DELETE',
      headers: { ...requestHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: slot.booking.id }),
    })
    if (res.status === 401) {
      adminUnlocked.value = false
      adminKey.value = ''
      sessionStorage.removeItem(ADMIN_STORAGE)
      adminMessage.value = 'De code klopt niet. Vul hem opnieuw in.'
      return
    }
    const data = (await res.json()) as Schedule
    if (!res.ok || !data.days) {
      adminMessage.value = 'Vrijgeven lukte niet. Probeer het opnieuw.'
      return
    }
    days.value = data.days
    adminMessage.value = 'Blok vrijgegeven.'
  } catch {
    adminMessage.value = 'Vrijgeven lukte niet. Probeer het opnieuw.'
  } finally {
    clearingId.value = ''
  }
}

onMounted(() => {
  useSeo({
    title: isAdmin.value ? 'Overzicht GBL-interviews Praag | Eventshoot.nl' : 'GBL interviews, Prague | Eventshoot.nl',
    description: 'Private signup for GBL interviews in Prague.',
    url: isAdmin.value ? 'https://eventshoot.nl/gbl-praag/beheer' : 'https://eventshoot.nl/gbl-praag',
    locale: isAdmin.value ? 'nl' : 'en',
  })
  applyRobots()
  if (isAdmin.value) {
    const stored = sessionStorage.getItem(ADMIN_STORAGE) || ''
    if (stored) adminKey.value = stored
  }
  void load()
  pollTimer = window.setInterval(() => {
    if (document.visibilityState === 'visible' && !saving.value && !clearingId.value) void load(true)
  }, 15000)
})

onUnmounted(() => {
  window.clearInterval(pollTimer)
  if (robotsMeta?.getAttribute('content') === 'noindex, nofollow') robotsMeta.remove()
})
</script>

<template>
  <main class="sheet">
    <header class="sheet__intro">
      <p class="sheet__brand">Eventshoot.nl</p>
      <h1>{{ isAdmin ? 'GBL-interviews Praag' : 'GBL interviews, Prague' }}</h1>
      <p v-if="isAdmin" class="sheet__lead">
        Woensdag 4 en donderdag 5 november staan open. Vrijdag is voorlopig gesloten. Eén blok van een half uur per persoon.
      </p>
      <p v-else class="sheet__lead">
        Choose one half-hour slot on Wednesday 4 or Thursday 5 November. Leave your first name, last name and firm name.
        One slot per person.
      </p>
      <p v-if="!loading && !loadError" class="sheet__count">
        {{ isAdmin ? `${openCount} van ${totalCount} blokken vrij` : `${openCount} of ${totalCount} slots still open` }}
      </p>
      <p v-if="notice" class="sheet__notice" role="status">{{ notice }}</p>
    </header>

    <section v-if="isAdmin" class="admin">
      <h2>Overzicht voor Rolf</h2>
      <form v-if="!adminUnlocked" class="admin__form" @submit.prevent="unlockAdmin">
        <label for="admin-key">Beheercode</label>
        <div class="admin__row">
          <input id="admin-key" v-model="adminInput" type="password" autocomplete="current-password" />
          <button class="btn btn--primary" type="submit">Code controleren</button>
        </div>
      </form>
      <p v-else class="admin__ok">Beheer actief. Een vrijgegeven blok kan opnieuw worden geboekt.</p>
      <p v-if="adminMessage" class="sheet__notice" role="status">{{ adminMessage }}</p>
    </section>

    <p v-if="loading" class="sheet__status">{{ isAdmin ? 'Het schema wordt geladen…' : 'Loading the schedule…' }}</p>
    <p v-else-if="loadError" class="sheet__status">
      {{ isAdmin ? 'Het schema kon niet worden geladen. Vernieuw de pagina.' : 'The schedule could not be loaded. Refresh the page.' }}
    </p>

    <section v-for="day in days" :key="day.id" class="day" :class="{ 'day--closed': day.closed }">
      <h2>{{ dayTitle(day) }}</h2>
      <p class="day__meta">{{ dayMeta(day) }}</p>
      <p v-if="day.closed" class="day__closed">{{ isAdmin ? 'Voorlopig gesloten.' : 'Not open yet.' }}</p>
      <div class="day__table">
        <table>
          <thead>
            <tr>
              <th scope="col">{{ isAdmin ? 'Tijd' : 'Time' }}</th>
              <th scope="col">{{ isAdmin ? 'Naam' : 'Name' }}</th>
              <th scope="col">{{ isAdmin ? 'Firma' : 'Firm' }}</th>
              <th scope="col"><span class="sr-only">{{ isAdmin ? 'Actie' : 'Action' }}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in day.slots" :key="slot.id" :class="{ 'is-taken': slot.booking }">
              <th scope="row">{{ slot.start }}-{{ slot.end }}</th>
              <td>{{ slot.booking ? `${slot.booking.firstName} ${slot.booking.lastName}` : (day.closed ? (isAdmin ? 'Gesloten' : 'Closed') : (isAdmin ? 'Vrij' : 'Free')) }}</td>
              <td>{{ slot.booking?.firm || '' }}</td>
              <td class="day__action">
                <button
                  v-if="!slot.booking && !isAdmin && !day.closed"
                  class="btn btn--primary btn--small"
                  type="button"
                  @click="openSlot(day, slot)"
                >
                  Book
                </button>
                <button
                  v-else-if="slot.booking && adminUnlocked"
                  class="btn btn--outline btn--small"
                  type="button"
                  :disabled="clearingId === slot.booking.id"
                  @click="clearSlot(slot)"
                >
                  Vrijgeven
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <dialog ref="dialog" class="book" @close="selected = null">
      <form v-if="selected" @submit.prevent="book">
        <h2>{{ selected.day.label }}</h2>
        <p class="book__when">{{ selected.slot.start }} to {{ selected.slot.end }} · {{ selected.day.location }}</p>
        <label>
          First name
          <input v-model="firstName" name="given-name" autocomplete="given-name" maxlength="80" required />
        </label>
        <label>
          Last name
          <input v-model="lastName" name="family-name" autocomplete="family-name" maxlength="80" required />
        </label>
        <label>
          Firm name
          <input v-model="firm" name="organization" autocomplete="organization" maxlength="80" required />
        </label>
        <p v-if="formError" class="book__error" role="alert">{{ formError }}</p>
        <div class="book__actions">
          <button class="btn btn--primary" type="submit" :disabled="saving">
            {{ saving ? 'Saving…' : 'Book this slot' }}
          </button>
          <button class="btn btn--outline" type="button" @click="closeDialog">Cancel</button>
        </div>
      </form>
    </dialog>
  </main>
</template>

<style scoped>
.sheet {
  max-width: 880px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.sheet__brand {
  color: var(--color-blue);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

h1 {
  margin: 0.35rem 0 0.75rem;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
}

.sheet__lead,
.day__meta,
.sheet__count {
  color: var(--color-text-muted);
}

.sheet__notice {
  margin-top: 0.8rem;
  color: #fff;
}

.admin,
.day {
  margin-top: 1.5rem;
  padding: 1rem 1rem 0.4rem;
  background: rgba(0, 7, 40, 0.72);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.admin h2,
.day h2 {
  font-size: 1.25rem;
}

.admin__form label,
.book label {
  display: block;
  margin-top: 0.8rem;
  font-weight: 600;
}

.admin__row,
.book__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.7rem;
}

.admin input,
.book input {
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  font: inherit;
}

.admin__row input {
  flex: 1 1 180px;
  width: auto;
  margin-top: 0;
}

.admin__ok {
  margin: 0.4rem 0 0.8rem;
}

.day__meta {
  margin: 0.25rem 0 0.8rem;
}

.day--closed {
  opacity: 0.72;
}

.day__closed {
  margin: -0.35rem 0 0.8rem;
  font-weight: 600;
}

.day__table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.7rem 0.45rem;
  border-top: 1px solid var(--color-border);
  text-align: left;
  vertical-align: middle;
}

thead th {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 600;
}

tbody th {
  font-weight: 600;
  white-space: nowrap;
}

.is-taken td:nth-child(2),
.is-taken td:nth-child(3) {
  color: #fff;
}

.day__action {
  width: 7.5rem;
  text-align: right;
}

.btn--small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.sheet__status {
  margin-top: 1.5rem;
}

.book {
  width: min(440px, calc(100% - 2rem));
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: #00124f;
  color: #fff;
}

.book::backdrop {
  background: rgba(0, 0, 0, 0.68);
}

.book__when {
  color: var(--color-text-muted);
}

.book__error {
  margin-top: 0.8rem;
  color: #ffb089;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 640px) {
  thead {
    display: none;
  }

  tr {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.15rem 0.75rem;
    padding: 0.7rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  th,
  td {
    display: block;
    padding: 0;
    border: 0;
  }

  tbody th {
    grid-column: 1;
    grid-row: 1;
  }

  td:nth-child(2) {
    grid-column: 1;
    grid-row: 2;
  }

  td:nth-child(3) {
    grid-column: 1;
    grid-row: 3;
    color: var(--color-text-muted);
  }

  .day__action {
    grid-column: 2;
    grid-row: 1 / span 3;
    width: auto;
    align-self: center;
  }
}
</style>
