<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import {
  CONFERENCE,
  GBL_LOGO,
  THANKS,
  audienceById,
  parseSubmission,
  type DebriefAudience,
  type DebriefQuestion,
} from '../../api/gbl-debrief/questions'

type AdminLine = { label: string; value: string }
type AdminResponse = {
  id: string
  audience: string
  audienceTitle: string
  conferenceTitle: string
  createdAt: string
  lines: AdminLine[]
}

const ADMIN_STORAGE = 'gbl-debrief-admin-key'
const route = useRoute()

const isAdmin = computed(() => route.name === 'gbl-debrief-beheer')
const audience = computed(() => (isAdmin.value ? undefined : audienceById(String(route.meta.debrief || ''))))

const answers = reactive<Record<string, any>>({})
const honeypot = ref('')
const missing = ref<string[]>([])
const formError = ref('')
const saving = ref(false)
const sent = ref(false)

const responses = ref<AdminResponse[]>([])
const adminKey = ref('')
const adminInput = ref('')
const adminUnlocked = ref(false)
const adminMessage = ref('')
const loading = ref(false)
const loadError = ref(false)
const clearingId = ref('')

let robotsMeta: HTMLMetaElement | null = null

const participantCount = computed(() => responses.value.filter((row) => row.audience === 'participants').length)
const hostCount = computed(() => responses.value.filter((row) => row.audience === 'host').length)

function applyRobots() {
  robotsMeta = document.querySelector('meta[name="robots"]')
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta')
    robotsMeta.setAttribute('name', 'robots')
    document.head.appendChild(robotsMeta)
  }
  robotsMeta.setAttribute('content', 'noindex, nofollow')
}

function applySeo() {
  const current = audience.value
  useSeo({
    title: isAdmin.value
      ? 'GBL-debrief overzicht | Eventshoot.nl'
      : `${current?.title || 'GBL debrief'} | Eventshoot.nl`,
    description: isAdmin.value
      ? 'Privé-overzicht van de GBL-debrief.'
      : 'Private debrief for the GBL Board.',
    url: `https://eventshoot.nl${route.path}`,
    locale: isAdmin.value ? 'nl' : 'en',
  })
  applyRobots()
}

function resetForm(current: DebriefAudience | undefined) {
  for (const key of Object.keys(answers)) delete answers[key]
  honeypot.value = ''
  missing.value = []
  formError.value = ''
  sent.value = false
  if (!current) return
  for (const field of current.identity) answers[field.id] = ''
  for (const question of current.questions) {
    if (question.kind === 'matrix') {
      const row: Record<string, string> = {}
      for (const item of question.items) row[item.id] = ''
      answers[question.id] = row
    } else if (question.kind === 'text') {
      answers[question.id] = ''
    } else {
      answers[question.id] = ''
    }
  }
}

function matrixRow(question: DebriefQuestion): Record<string, string> {
  const value = answers[question.id]
  if (!value || typeof value !== 'object') return {}
  return value as Record<string, string>
}

function isMissing(id: string) {
  return missing.value.includes(id)
}

function setCell(questionId: string, itemId: string, value: string) {
  const row = answers[questionId]
  if (!row || typeof row !== 'object') return
  row[itemId] = value
}

function collectMissing(current: DebriefAudience): string[] {
  const gaps: string[] = []
  for (const field of current.identity) {
    if (field.required && !String(answers[field.id] || '').trim()) gaps.push(field.id)
  }
  for (const question of current.questions) {
    if (question.kind === 'scale' || question.kind === 'choice') {
      if (answers[question.id] === '' || answers[question.id] == null) gaps.push(question.id)
    } else if (question.kind === 'matrix') {
      const row = matrixRow(question)
      if (question.items.some((item) => !row[item.id])) gaps.push(question.id)
    } else if (question.required && !String(answers[question.id] || '').trim()) {
      gaps.push(question.id)
    }
  }
  return gaps
}

async function submit() {
  const current = audience.value
  if (!current || saving.value) return
  missing.value = collectMissing(current)
  formError.value = ''
  if (missing.value.length) {
    formError.value = 'Please answer the questions marked below.'
    await nextTick()
    document.getElementById(`q-${missing.value[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  const parsed = parseSubmission(current, answers)
  if (!parsed) {
    formError.value = 'Please check your answers and try again.'
    return
  }
  saving.value = true
  try {
    const res = await fetch('/api/gbl-debrief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audience: current.id, answers: parsed, website: honeypot.value }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    if (res.status === 429) {
      formError.value = typeof data.error === 'string' ? data.error : 'Please wait a few minutes and try again.'
      return
    }
    if (!res.ok) {
      formError.value = 'The form could not be sent. Please try again.'
      return
    }
    sent.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch {
    formError.value = 'The form could not be sent. Please try again.'
  } finally {
    saving.value = false
  }
}

function requestHeaders(): HeadersInit {
  const headers: Record<string, string> = {}
  if (adminKey.value) headers['X-Gbl-Admin-Key'] = adminKey.value
  return headers
}

async function loadAdmin() {
  loading.value = true
  loadError.value = false
  try {
    const res = await fetch('/api/gbl-debrief', { headers: requestHeaders(), cache: 'no-store' })
    if (res.status === 401) {
      adminUnlocked.value = false
      adminKey.value = ''
      sessionStorage.removeItem(ADMIN_STORAGE)
      responses.value = []
      return
    }
    if (!res.ok) throw new Error('load failed')
    const data = (await res.json()) as { responses: AdminResponse[] }
    responses.value = data.responses
    adminUnlocked.value = true
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

async function unlockAdmin() {
  adminMessage.value = ''
  adminKey.value = adminInput.value.trim()
  if (!adminKey.value) {
    adminMessage.value = 'Vul je wachtwoord in.'
    return
  }
  await loadAdmin()
  if (adminUnlocked.value) {
    sessionStorage.setItem(ADMIN_STORAGE, adminKey.value)
    adminInput.value = ''
  } else if (!loadError.value) {
    adminMessage.value = 'Dat wachtwoord klopt niet.'
  }
}

async function removeResponse(id: string) {
  if (!adminUnlocked.value || clearingId.value) return
  clearingId.value = id
  adminMessage.value = ''
  try {
    const res = await fetch('/api/gbl-debrief', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...requestHeaders() },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) {
      adminMessage.value = 'Verwijderen lukte niet. Probeer het opnieuw.'
      return
    }
    const data = (await res.json()) as { responses: AdminResponse[] }
    responses.value = data.responses
  } catch {
    adminMessage.value = 'Verwijderen lukte niet. Probeer het opnieuw.'
  } finally {
    clearingId.value = ''
  }
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function numbers(min: number, max: number) {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index)
}

watch(
  () => route.fullPath,
  () => {
    applySeo()
    if (isAdmin.value) {
      const stored = sessionStorage.getItem(ADMIN_STORAGE) || ''
      if (stored) adminKey.value = stored
      if (adminKey.value) void loadAdmin()
      return
    }
    resetForm(audience.value)
  },
  { immediate: true },
)

onMounted(() => {
  applyRobots()
})

onUnmounted(() => {
  if (robotsMeta?.getAttribute('content') === 'noindex, nofollow') robotsMeta.remove()
})
</script>

<template>
  <main class="sheet">
    <header class="sheet__intro">
      <img class="sheet__logo" :src="GBL_LOGO" alt="GBL Alliance" />
      <p class="sheet__event">{{ CONFERENCE.title }} · {{ CONFERENCE.when }}</p>

      <template v-if="isAdmin">
        <h1>GBL-debrief</h1>
        <p class="sheet__lead">Antwoorden van deelnemers en van het organiserende kantoor. Alleen voor het GBL-bestuur.</p>
      </template>

      <template v-else-if="audience && !sent">
        <h1>{{ audience.title }}</h1>
        <p v-if="audience.minutes" class="sheet__minutes">{{ audience.minutes }}</p>
        <p v-if="audience.intro" class="sheet__lead">{{ audience.intro }}</p>
        <p v-if="audience.note" class="sheet__note" :class="{ 'sheet__note--anon': audience.anonymous }">{{ audience.note }}</p>
      </template>

      <template v-else-if="sent">
        <h1>{{ THANKS.title }}</h1>
        <p class="sheet__sign">{{ THANKS.sign }}</p>
        <p class="sheet__lead">{{ THANKS.body }}</p>
      </template>
    </header>

    <section v-if="isAdmin" class="card">
      <form v-if="!adminUnlocked" class="stack" @submit.prevent="unlockAdmin">
        <label for="admin-key">Je loginwachtwoord</label>
        <p class="hint">Hetzelfde wachtwoord als bij de interview-app.</p>
        <div class="row">
          <input id="admin-key" v-model="adminInput" type="password" autocomplete="current-password" />
          <button class="btn btn--primary" type="submit">Openen</button>
        </div>
      </form>
        <p v-else class="hint">
        {{ participantCount }} deelnemers, {{ hostCount }} van het kantoor.
      </p>
      <p v-if="adminMessage" class="error" role="alert">{{ adminMessage }}</p>
      <p v-if="loading" class="hint">Antwoorden worden geladen…</p>
      <p v-else-if="loadError" class="error" role="alert">Het overzicht kon niet worden geladen. Vernieuw de pagina.</p>
      <p v-else-if="adminUnlocked && !responses.length" class="hint">Nog geen antwoorden.</p>

      <article v-for="item in responses" :key="item.id" class="response">
        <header class="response__head">
          <div>
            <h2>{{ item.audience === 'participants' ? 'Deelnemer, anoniem' : 'Organiserend kantoor' }}</h2>
            <p class="hint">{{ item.conferenceTitle }} · {{ formatWhen(item.createdAt) }}</p>
          </div>
          <button
            class="btn btn--outline btn--small"
            type="button"
            :disabled="clearingId === item.id"
            @click="removeResponse(item.id)"
          >
            Verwijderen
          </button>
        </header>
        <dl>
          <template v-for="line in item.lines" :key="line.label">
            <dt>{{ line.label }}</dt>
            <dd>{{ line.value }}</dd>
          </template>
        </dl>
      </article>
    </section>

    <form v-else-if="audience && !sent" class="card" autocomplete="off" @submit.prevent="submit">
      <p v-if="formError" class="error" role="alert">{{ formError }}</p>

      <div class="hp" aria-hidden="true">
        <label>
          Website
          <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
        </label>
      </div>

      <div
        v-for="field in audience.identity"
        :id="`q-${field.id}`"
        :key="field.id"
        class="field"
        :class="{ 'is-missing': isMissing(field.id) }"
      >
        <label :for="field.id">{{ field.label }}</label>
        <input
          :id="field.id"
          v-model="answers[field.id]"
          type="text"
          :name="field.autocomplete"
          :autocomplete="field.autocomplete"
          maxlength="120"
          required
        />
      </div>

      <fieldset
        v-for="(question, index) in audience.questions"
        :id="`q-${question.id}`"
        :key="question.id"
        class="field"
        :class="{ 'is-missing': isMissing(question.id) }"
      >
        <legend>
          <span class="num">{{ index + 1 }}</span>
          {{ question.prompt }}
          <span v-if="question.kind === 'text' && !question.required" class="optional">Optional</span>
        </legend>
        <p v-if="'hint' in question && question.hint" class="hint">{{ question.hint }}</p>

        <div v-if="question.kind === 'scale'" class="scale" role="radiogroup" :aria-label="question.prompt">
          <label v-for="n in numbers(question.min, question.max)" :key="n">
            <input v-model="answers[question.id]" type="radio" :name="question.id" :value="String(n)" />
            <span>{{ n }}</span>
          </label>
        </div>

        <div v-else-if="question.kind === 'choice'" class="choices" role="radiogroup" :aria-label="question.prompt">
          <label v-for="option in question.options" :key="option.id">
            <input v-model="answers[question.id]" type="radio" :name="question.id" :value="option.id" />
            <span>{{ option.label }}</span>
          </label>
        </div>

        <div v-else-if="question.kind === 'matrix'" class="matrix">
          <div v-for="item in question.items" :key="item.id" class="matrix__row">
            <p :id="`label-${item.id}`">{{ item.label }}</p>
            <div class="choices" role="radiogroup" :aria-labelledby="`label-${item.id}`">
              <label v-for="n in numbers(question.min, question.max)" :key="n">
                <input
                  type="radio"
                  :name="`${question.id}-${item.id}`"
                  :value="String(n)"
                  :checked="matrixRow(question)[item.id] === String(n)"
                  @change="setCell(question.id, item.id, String(n))"
                />
                <span>{{ n }}</span>
              </label>
              <label class="choices__wide">
                <input
                  type="radio"
                  :name="`${question.id}-${item.id}`"
                  value="na"
                  :checked="matrixRow(question)[item.id] === 'na'"
                  @change="setCell(question.id, item.id, 'na')"
                />
                <span>{{ question.naLabel }}</span>
              </label>
            </div>
          </div>
        </div>

        <textarea
          v-else
          v-model="answers[question.id]"
          rows="4"
          maxlength="4000"
          :required="question.required"
        />
      </fieldset>

      <button class="btn btn--primary btn--lg" type="submit" :disabled="saving">
        {{ saving ? 'Sending…' : 'Send to the GBL Board' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.sheet {
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.sheet__logo {
  display: block;
  width: 280px;
  height: 96px;
  object-fit: cover;
  object-position: center 46%;
  background: transparent;
}

.sheet__event {
  margin-top: 1rem;
  color: var(--color-blue);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

h1 {
  margin: 0.35rem 0 0.6rem;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
}

.sheet__minutes {
  margin-bottom: 0.45rem;
  font-weight: 700;
}

.sheet__lead,
.hint {
  color: var(--color-text-muted);
}

.sheet__sign {
  margin: 0 0 0.7rem;
  font-size: 1.15rem;
  font-weight: 700;
}

.sheet__note {
  margin-top: 0.9rem;
  padding: 0.8rem 0.95rem;
  border-radius: var(--radius);
  background: rgba(49, 159, 232, 0.12);
}

.sheet__note--anon {
  background: rgba(255, 123, 0, 0.14);
  color: #fff;
}

.card {
  margin-top: 1.4rem;
  padding: 1.15rem 1.1rem 1.3rem;
  background: rgba(0, 7, 40, 0.72);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.field {
  margin: 0 0 1.35rem;
  padding: 0;
  border: 0;
  min-inline-size: 0;
}

.field legend {
  padding: 0;
  font-weight: 700;
  font-size: 1.05rem;
}

.num {
  display: inline-grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  margin-right: 0.35rem;
  border-radius: 999px;
  background: rgba(49, 159, 232, 0.2);
  color: #fff;
  font-size: 0.85rem;
}

.optional {
  margin-left: 0.4rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
}

.field label,
.stack label {
  display: block;
  font-weight: 700;
}

.hint {
  margin: 0.35rem 0 0.55rem;
  font-size: 0.92rem;
}

input[type='text'],
input[type='password'],
textarea {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.75rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  font: inherit;
}

textarea {
  resize: vertical;
  min-height: 7rem;
}

.scale,
.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.7rem;
}

.scale label,
.choices label {
  position: relative;
}

.scale span,
.choices span {
  display: inline-grid;
  place-items: center;
  min-width: 2.5rem;
  min-height: 2.5rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.choices__wide span {
  padding-inline: 0.9rem;
}

.scale input,
.choices input {
  position: absolute;
  opacity: 0;
  inset: 0;
  margin: 0;
  cursor: pointer;
}

.scale label:has(input:checked) span,
.choices label:has(input:checked) span {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

.scale label:has(input:focus-visible) span,
.choices label:has(input:focus-visible) span {
  outline: 2px solid var(--color-blue);
  outline-offset: 2px;
}

.matrix__row {
  padding: 0.85rem 0;
  border-top: 1px solid var(--color-border);
}

.matrix__row p {
  font-weight: 600;
}

.is-missing {
  padding: 0.7rem;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px #ffb089;
}

.error {
  margin: 0 0 1rem;
  color: #ffb089;
  font-weight: 600;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.7rem;
}

.row input {
  flex: 1 1 180px;
  width: auto;
  margin-top: 0;
}

.btn--small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

.response {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.response__head {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: flex-start;
}

.response h2 {
  font-size: 1.05rem;
}

.response dl {
  margin-top: 0.7rem;
}

.response dt {
  margin-top: 0.65rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 700;
}

.response dd {
  white-space: pre-wrap;
}

.hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
