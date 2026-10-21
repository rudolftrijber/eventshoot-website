export type GblDay = {
  id: string
  date: string
  label: string
  labelNl: string
  hours: string
  hoursNl: string
  location: string
  locationNl: string
  slots: GblSlot[]
}

export type GblSlot = {
  id: string
  start: string
  end: string
}

function clock(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function halfHours(date: string, from: string, until: string): GblSlot[] {
  const [fromH, fromM] = from.split(':').map(Number)
  const [untilH, untilM] = until.split(':').map(Number)
  const startMin = fromH * 60 + fromM
  const endMin = untilH * 60 + untilM
  const slots: GblSlot[] = []
  for (let t = startMin; t + 30 <= endMin; t += 30) {
    const start = clock(t)
    slots.push({ id: `${date}T${start}`, start, end: clock(t + 30) })
  }
  return slots
}

export const GBL_DAYS: GblDay[] = [
  {
    id: 'wed',
    date: '2026-11-04',
    label: 'Wednesday 4 November',
    labelNl: 'Woensdag 4 november',
    hours: '12:00 to 17:30',
    hoursNl: '12:00 tot 17:30',
    location: 'Meeting room, PRK office',
    locationNl: 'Vergaderruimte PRK office',
    slots: halfHours('2026-11-04', '12:00', '17:30'),
  },
  {
    id: 'thu',
    date: '2026-11-05',
    label: 'Thursday 5 November',
    labelNl: 'Donderdag 5 november',
    hours: '15:00 to 18:00',
    hoursNl: '15:00 tot 18:00',
    location: 'Near the conference hall',
    locationNl: 'In de buurt van de conferentiezaal',
    slots: halfHours('2026-11-05', '15:00', '18:00'),
  },
  {
    id: 'fri',
    date: '2026-11-06',
    label: 'Friday 6 November',
    labelNl: 'Vrijdag 6 november',
    hours: '13:30 to 17:00',
    hoursNl: '13:30 tot 17:00',
    location: 'Meeting room, PRK office',
    locationNl: 'Vergaderruimte PRK office',
    slots: halfHours('2026-11-06', '13:30', '17:00'),
  },
]

const slotIndex = new Map<string, { day: GblDay; slot: GblSlot }>()
for (const day of GBL_DAYS) {
  for (const slot of day.slots) slotIndex.set(slot.id, { day, slot })
}

export function findSlot(slotId: string): { day: GblDay; slot: GblSlot } | null {
  return slotIndex.get(slotId) ?? null
}
