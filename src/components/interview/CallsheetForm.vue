<script setup lang="ts">
import type { CallsheetData } from '@/types/interview'
import { DEFAULT_CREW_SLOT } from '@/types/interview'
import { emptyGearRow, emptyProgramRow } from '@/utils/callsheet'

const props = defineProps<{
  modelValue: CallsheetData
  crewNames: string[]
  crewDirectory: { naam: string; rol: string; telefoon: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CallsheetData]
  'add-interviews': []
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

function updateProgram(index: number, field: 'tijd' | 'onderdeel' | 'locatie' | 'crew', value: string) {
  const programma = props.modelValue.programma.map((row, i) => (
    i === index ? { ...row, [field]: value } : row
  ))
  patch({ programma })
}

function toggleProgramMark(index: number) {
  const programma = props.modelValue.programma.map((row, i) => (
    i === index ? { ...row, highlight: !row.highlight } : row
  ))
  patch({ programma })
}

function addProgramRow() {
  if (props.modelValue.programma.length >= 40) return
  patch({ programma: [...props.modelValue.programma, emptyProgramRow()] })
}

function removeProgramRow(index: number) {
  patch({ programma: props.modelValue.programma.filter((_, i) => i !== index) })
}

function updateGear(index: number, field: 'categorie' | 'omschrijving' | 'aantal', value: string) {
  const apparatuur = props.modelValue.apparatuur.map((row, i) => (
    i === index ? { ...row, [field]: value } : row
  ))
  patch({ apparatuur })
}

function toggleGear(index: number) {
  const apparatuur = props.modelValue.apparatuur.map((row, i) => (
    i === index ? { ...row, ok: !row.ok } : row
  ))
  patch({ apparatuur })
}

function addGearRow() {
  if (props.modelValue.apparatuur.length >= 24) return
  const last = props.modelValue.apparatuur[props.modelValue.apparatuur.length - 1]
  patch({ apparatuur: [...props.modelValue.apparatuur, emptyGearRow(last?.categorie || 'Extra categorie')] })
}

function removeGearRow(index: number) {
  const apparatuur = props.modelValue.apparatuur.filter((_, i) => i !== index)
  patch({ apparatuur: apparatuur.length ? apparatuur : [emptyGearRow()] })
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
      These fields go on the A4 callsheet. The interview programme, with the questions per candidate, follows in the same PDF.
      The client and crew phones come from Settings.
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
      <label class="ia-label">
        Venue city
        <input
          class="ia-input"
          :value="modelValue.locatiePlaats"
          placeholder="postcode and city"
          @input="setField('locatiePlaats', ($event.target as HTMLInputElement).value)"
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

    <div class="ia-callsheet__block">
      <div class="ia-callsheet__head">
        <h4>Programme</h4>
        <div class="ia-actions ia-actions--tight">
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="emit('add-interviews')">
            Add interview times
          </button>
          <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="addProgramRow">
            + Row
          </button>
        </div>
      </div>
      <p class="ia-hint">Mark a keynote or other fixed moment. That row is shaded on the callsheet.</p>
      <div v-for="(row, index) in modelValue.programma" :key="`prog-${index}`" class="ia-callsheet__program">
        <input
          class="ia-input"
          :value="row.tijd"
          placeholder="Time"
          aria-label="Time"
          @input="updateProgram(index, 'tijd', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="ia-input ia-callsheet__grow"
          :value="row.onderdeel"
          placeholder="Programme item"
          aria-label="Programme item"
          @input="updateProgram(index, 'onderdeel', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="ia-input"
          :value="row.locatie"
          placeholder="Room"
          aria-label="Room"
          @input="updateProgram(index, 'locatie', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="ia-input"
          :value="row.crew"
          placeholder="Crew"
          aria-label="Crew"
          @input="updateProgram(index, 'crew', ($event.target as HTMLInputElement).value)"
        />
        <label class="ia-callsheet__check">
          <input type="checkbox" :checked="row.highlight" @change="toggleProgramMark(index)" />
          Mark
        </label>
        <button class="ia-iconbtn" type="button" title="Remove row" @click="removeProgramRow(index)">🗑️</button>
      </div>
      <p v-if="!modelValue.programma.length" class="ia-empty">No schedule yet. Add rows, or put the interview times in.</p>
    </div>

    <div class="ia-callsheet__block">
      <div class="ia-callsheet__head">
        <h4>Gear</h4>
        <button class="ia-btn ia-btn--small ia-btn--secondary" type="button" @click="addGearRow">
          + Row
        </button>
      </div>
      <div v-for="(row, index) in modelValue.apparatuur" :key="`gear-${index}`" class="ia-callsheet__gear">
        <input
          class="ia-input"
          :value="row.categorie"
          placeholder="Category"
          aria-label="Category"
          @input="updateGear(index, 'categorie', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="ia-input ia-callsheet__grow"
          :value="row.omschrijving"
          placeholder="Description"
          aria-label="Description"
          @input="updateGear(index, 'omschrijving', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="ia-input ia-callsheet__qty"
          :value="row.aantal"
          placeholder="Qty"
          aria-label="Quantity"
          @input="updateGear(index, 'aantal', ($event.target as HTMLInputElement).value)"
        />
        <label class="ia-callsheet__check">
          <input type="checkbox" :checked="row.ok" @change="toggleGear(index)" />
          Packed
        </label>
        <button class="ia-iconbtn" type="button" title="Remove row" @click="removeGearRow(index)">🗑️</button>
      </div>
    </div>
  </div>
</template>
