<script setup lang="ts">
import type { CallsheetData } from '@/types/interview'
import { DEFAULT_CREW_SLOT } from '@/types/interview'
const props = defineProps<{
  modelValue: CallsheetData
  crewNames: string[]
  crewDirectory: { naam: string; rol: string; telefoon: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CallsheetData]
}>()

const slotLabels = ['Supervisor', 'Crew 2', 'Crew 3', 'Crew 4', 'Crew 5']

function patch(partial: Partial<CallsheetData>) {
  emit('update:modelValue', { ...props.modelValue, ...partial })
}

function setField<K extends keyof CallsheetData>(key: K, value: CallsheetData[K]) {
  patch({ [key]: value } as Partial<CallsheetData>)
}

function crewInfo(index: number) {
  const name = (props.crewNames[index] || '').trim()
  return props.crewDirectory.find((person) => person.naam === name)
}

function updateCrew(index: number, field: 'rol' | 'telefoon' | 'callTijd', value: string) {
  const crewDetails = props.modelValue.crewDetails.map((row, i) => (
    i === index ? { ...row, [field]: value } : row
  ))
  patch({ crewDetails })
}

function crewActive(index: number): boolean {
  const name = (props.crewNames[index] || '').trim()
  return Boolean(name) && name !== DEFAULT_CREW_SLOT
}
</script>

<template>
  <div class="ia-callsheet">
    <h3 class="ia-form-section-title">Callsheet</h3>
    <p class="ia-hint ia-callsheet__intro">
      These fields go on the A4 callsheet. Interview candidates follow as a short list: name, role, company, time and remarks.
      The full questions stay in the VPO PDF. Client and crew phones come from Settings.
    </p>

    <div class="ia-callsheet__grid">
      <label class="ia-label">
        Parking
        <input
          class="ia-input"
          :value="modelValue.parkeren"
          placeholder="for example under the venue"
          @input="setField('parkeren', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="ia-label">
        Venue address
        <input
          class="ia-input"
          :value="modelValue.locatieAdres"
          placeholder="street and number"
          @input="setField('locatieAdres', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="ia-label ia-callsheet__wide">
        Venue city
        <input
          class="ia-input"
          :value="modelValue.locatiePlaats"
          placeholder="postcode and city"
          @input="setField('locatiePlaats', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="ia-label">
        Venue contact
        <input
          class="ia-input"
          :value="modelValue.locatieContact"
          placeholder="name at the venue"
          @input="setField('locatieContact', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="ia-label">
        Venue phone
        <input
          class="ia-input"
          :value="modelValue.locatieTelefoon"
          placeholder="phone number"
          inputmode="tel"
          @input="setField('locatieTelefoon', ($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>

    <label class="ia-label">
      Link to the event programme
      <input
        class="ia-input"
        :value="modelValue.programmaUrl"
        placeholder="https://"
        inputmode="url"
        @input="setField('programmaUrl', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="ia-label">
      Crew clothing
      <textarea
        class="ia-textarea"
        rows="2"
        :value="modelValue.crewKleding"
        @input="setField('crewKleding', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>

    <div class="ia-callsheet__block">
      <h4>Crew call times</h4>
      <p class="ia-hint">Names are chosen above. Role and phone come from Settings. Only the call time changes per production.</p>
      <div v-for="(label, index) in slotLabels" :key="label" class="ia-callsheet__crew" :class="{ 'ia-callsheet__crew--off': !crewActive(index) }">
        <div class="ia-callsheet__who">
          <span>{{ label }}</span>
          <strong>{{ crewNames[index] || 'N.V.T.' }}</strong>
        </div>
        <p class="ia-hint ia-callsheet__meta">
          {{ crewInfo(index)?.rol || 'No role' }}
          <template v-if="crewInfo(index)?.telefoon"> · {{ crewInfo(index)?.telefoon }}</template>
        </p>
        <input
          class="ia-input"
          :value="modelValue.crewDetails[index]?.callTijd || ''"
          placeholder="Call time"
          :disabled="!crewActive(index)"
          aria-label="Crew call time"
          @input="updateCrew(index, 'callTijd', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

  </div>
</template>
