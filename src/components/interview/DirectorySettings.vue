<script setup lang="ts">
import { ref } from 'vue'
import { useInterviewStore } from '@/stores/interviewStore'
import type { ClientContact } from '@/types/interview'

const emit = defineEmits<{
  toast: [message: string]
}>()

const store = useInterviewStore()

const clientId = ref('')
const clientName = ref('')
const clientContacts = ref<ClientContact[]>([emptyContact(), emptyContact()])

const crewId = ref('')
const crewName = ref('')
const crewRole = ref('')
const crewPhone = ref('')

function emptyContact(): ClientContact {
  return { rol: '', naam: '', telefoon: '' }
}

function resetClient() {
  clientId.value = ''
  clientName.value = ''
  clientContacts.value = [emptyContact(), emptyContact()]
}

function resetCrew() {
  crewId.value = ''
  crewName.value = ''
  crewRole.value = ''
  crewPhone.value = ''
}

function editClient(id: string) {
  const client = store.clients.find((row) => row.id === id)
  if (!client) return
  clientId.value = client.id
  clientName.value = client.naam
  const contacts = client.contacten.map((row) => ({ ...row }))
  clientContacts.value = contacts.length ? contacts : [emptyContact()]
}

function editCrew(id: string) {
  const person = store.crew.find((row) => row.id === id)
  if (!person) return
  crewId.value = person.id
  crewName.value = person.naam
  crewRole.value = person.rol
  crewPhone.value = person.telefoon
}

function addContact() {
  if (clientContacts.value.length >= 8) return
  clientContacts.value = [...clientContacts.value, emptyContact()]
}

function removeContact(index: number) {
  const next = clientContacts.value.filter((_, i) => i !== index)
  clientContacts.value = next.length ? next : [emptyContact()]
}

async function saveClient() {
  try {
    await store.saveClient({
      id: clientId.value || undefined,
      naam: clientName.value.trim(),
      contacten: clientContacts.value,
    })
    emit('toast', clientId.value ? 'Client updated' : 'Client saved')
    resetClient()
  } catch (err) {
    emit('toast', err instanceof Error ? err.message : 'Could not save client')
  }
}

async function removeClient(id: string, naam: string) {
  if (!window.confirm(`Remove ${naam}? Productions keep their name, the client link is cleared.`)) return
  try {
    await store.deleteClient(id)
    if (clientId.value === id) resetClient()
    emit('toast', 'Client removed')
  } catch (err) {
    emit('toast', err instanceof Error ? err.message : 'Could not remove client')
  }
}

async function saveCrew() {
  try {
    await store.saveCrewMember({
      id: crewId.value || undefined,
      naam: crewName.value.trim(),
      rol: crewRole.value.trim(),
      telefoon: crewPhone.value.trim(),
    })
    emit('toast', crewId.value ? 'Crew member updated' : 'Crew member saved')
    resetCrew()
  } catch (err) {
    emit('toast', err instanceof Error ? err.message : 'Could not save crew member')
  }
}

async function removeCrew(id: string, naam: string) {
  if (!window.confirm(`Remove ${naam} from the crew list? Existing productions keep the name.`)) return
  try {
    await store.deleteCrewMember(id)
    if (crewId.value === id) resetCrew()
    emit('toast', 'Crew member removed')
  } catch (err) {
    emit('toast', err instanceof Error ? err.message : 'Could not remove crew member')
  }
}
</script>

<template>
  <section class="ia-directory">
    <h3 class="ia-form-section-title">Clients</h3>
    <p class="ia-hint">
      One client often has several events. Add the client once, with contact 1, contact 2 and so on.
      Pick the client on the production. Those contacts go on every callsheet for that client.
    </p>

    <div class="ia-directory__form">
      <label class="ia-label">
        Client
        <input v-model="clientName" class="ia-input" placeholder="Organisation" />
      </label>
      <div v-for="(contact, index) in clientContacts" :key="`contact-${index}`" class="ia-directory__row">
        <span class="ia-directory__slot">Contact {{ index + 1 }}</span>
        <input v-model="contact.rol" class="ia-input" placeholder="Role" :aria-label="`Contact ${index + 1} role`" />
        <input v-model="contact.naam" class="ia-input" placeholder="Name" :aria-label="`Contact ${index + 1} name`" />
        <input v-model="contact.telefoon" class="ia-input" placeholder="Phone" :aria-label="`Contact ${index + 1} phone`" />
        <button class="ia-iconbtn" type="button" title="Remove contact" @click="removeContact(index)">🗑️</button>
      </div>
      <div class="ia-actions ia-actions--tight">
        <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="addContact">+ Contact</button>
        <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="saveClient">
          {{ clientId ? 'Update client' : 'Save client' }}
        </button>
        <button v-if="clientId" class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="resetClient">Cancel</button>
      </div>
    </div>

    <ul v-if="store.clients.length" class="ia-directory__list">
      <li v-for="client in store.clients" :key="client.id">
        <div>
          <strong>{{ client.naam }}</strong>
          <p v-if="client.contacten.length" class="ia-hint">
            <span v-for="(contact, index) in client.contacten" :key="`${client.id}-${index}`">
              {{ contact.naam || contact.rol || 'Contact' }}<template v-if="contact.telefoon">, {{ contact.telefoon }}</template><template v-if="index < client.contacten.length - 1"> · </template>
            </span>
          </p>
          <p v-else class="ia-hint">No contacts yet.</p>
        </div>
        <div class="ia-actions ia-actions--tight">
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="editClient(client.id)">Edit</button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="removeClient(client.id, client.naam)">Delete</button>
        </div>
      </li>
    </ul>
    <p v-else class="ia-empty">No clients yet.</p>
  </section>

  <section class="ia-directory">
    <h3 class="ia-form-section-title">Crew</h3>
    <p class="ia-hint">
      The same people on almost every production. Role and phone live here.
      N.V.T. stays the empty slot on a production, it is not a person.
    </p>

    <div class="ia-directory__form">
      <div class="ia-directory__row">
        <input v-model="crewName" class="ia-input" placeholder="Name" aria-label="Crew name" />
        <input v-model="crewRole" class="ia-input" placeholder="Role" aria-label="Crew role" />
        <input v-model="crewPhone" class="ia-input" placeholder="Phone" aria-label="Crew phone" />
      </div>
      <div class="ia-actions ia-actions--tight">
        <button class="ia-btn ia-btn--small ia-btn--accent" type="button" @click="saveCrew">
          {{ crewId ? 'Update crew member' : 'Save crew member' }}
        </button>
        <button v-if="crewId" class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="resetCrew">Cancel</button>
      </div>
    </div>

    <ul v-if="store.crew.length" class="ia-directory__list">
      <li v-for="person in store.crew" :key="person.id">
        <div>
          <strong>{{ person.naam }}</strong>
          <p class="ia-hint">
            {{ person.rol || 'No role' }}<template v-if="person.telefoon"> · {{ person.telefoon }}</template>
          </p>
        </div>
        <div class="ia-actions ia-actions--tight">
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="editCrew(person.id)">Edit</button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="removeCrew(person.id, person.naam)">Delete</button>
        </div>
      </li>
    </ul>
    <p v-else class="ia-empty">No crew yet.</p>
  </section>
</template>

<style scoped>
.ia-directory {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.ia-directory__form {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin: 0.75rem 0;
}

.ia-directory__row {
  display: grid;
  grid-template-columns: 7rem 1fr 1fr 9rem auto;
  gap: 0.45rem;
  align-items: center;
}

.ia-directory__form > .ia-directory__row:first-child {
  grid-template-columns: 1.4fr 1fr 9rem;
}

.ia-directory__slot {
  font-size: 0.8rem;
  font-weight: 650;
}

.ia-directory__list {
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.ia-directory__list li {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}

.ia-directory__list p {
  margin: 0.15rem 0 0;
}

@media (max-width: 860px) {
  .ia-directory__row,
  .ia-directory__form > .ia-directory__row:first-child,
  .ia-directory__list li {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
