export const FAQ_PAGE_KEYS = [
  'home',
  'kennismaken',
  'eventfotografie',
  'eventvideo',
  'tarieven',
  'over-rolf',
  'voor-brancheverenigingen',
  'voor-eventbureaus',
  'voor-hotels',
  'voor-bedrijven',
  'event-vodcast-recording',
] as const

export type FaqPageKey = (typeof FAQ_PAGE_KEYS)[number]
