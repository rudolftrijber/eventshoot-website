export const FAQ_PAGE_KEYS = [
  'kennismaken',
  'eventfotografie',
  'eventvideo',
  'tarieven',
  'voor-brancheverenigingen',
  'voor-eventbureaus',
  'voor-hotels',
  'voor-bedrijven',
] as const

export type FaqPageKey = (typeof FAQ_PAGE_KEYS)[number]
