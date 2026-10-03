export type TranscriptGuest = {
  id: string
  naam: string
}

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function nameParts(naam: string): string[] {
  return fold(naam).split(' ').filter((part) => part.length >= 2)
}

/** Higher means the file more clearly belongs to this candidate. */
export function transcriptMatchScore(filename: string, text: string, naam: string): number {
  const name = fold(naam)
  const parts = nameParts(naam)
  if (!name || !parts.length) return 0
  const file = fold(filename.replace(/\.(txt|srt|vtt)$/i, ''))
  const sample = fold(text.slice(0, 12000))
  const first = parts[0]
  const last = parts[parts.length - 1]
  let score = 0
  if (file.includes(name)) score += 100
  if (sample.includes(name)) score += 60
  if (parts.length > 1 && file.includes(first) && file.includes(last)) score += 50
  else if (last.length >= 4 && file.includes(last)) score += 35
  if (parts.length > 1 && sample.includes(first) && sample.includes(last)) score += 30
  return score
}

/**
 * Links each file to at most one candidate.
 * A close score between two candidates stays unassigned so a person can choose.
 */
export function assignTranscriptGuests(
  files: { key: string, filename: string, text: string }[],
  guests: TranscriptGuest[],
  alreadyTaken: string[] = [],
): Map<string, string> {
  const ranked = files.map((file) => ({
    key: file.key,
    scores: guests
      .map((guest) => ({
        id: guest.id,
        score: transcriptMatchScore(file.filename, file.text, guest.naam),
      }))
      .filter((row) => row.score >= 35)
      .sort((a, b) => b.score - a.score),
  }))

  const taken = new Set(alreadyTaken.filter(Boolean))
  const assigned = new Map<string, string>()
  const queue = [...ranked].sort((a, b) => (b.scores[0]?.score || 0) - (a.scores[0]?.score || 0))
  for (const item of queue) {
    const best = item.scores.find((row) => !taken.has(row.id))
    if (!best) continue
    const rival = item.scores.find((row) => row.id !== best.id && !taken.has(row.id))
    if (rival && best.score - rival.score < 15) continue
    taken.add(best.id)
    assigned.set(item.key, best.id)
  }
  return assigned
}
