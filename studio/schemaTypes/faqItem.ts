import { defineField, defineType } from 'sanity'

export const faqCategories = [
  { title: 'Algemeen', value: 'algemeen' },
  { title: 'Eventfotografie', value: 'eventfotografie' },
  { title: 'Eventvideo', value: 'eventvideo' },
  { title: 'Tarieven & pakketten', value: 'tarieven' },
  { title: 'Voor wie', value: 'voor-wie' },
]

export const faqPages = [
  { title: 'Home', value: 'home' },
  { title: 'Kennismaken', value: 'kennismaken' },
  { title: 'Eventfotografie', value: 'eventfotografie' },
  { title: 'Eventvideo', value: 'eventvideo' },
  { title: 'Tarieven', value: 'tarieven' },
  { title: 'Over Rolf', value: 'over-rolf' },
  { title: 'Brancheverenigingen', value: 'voor-brancheverenigingen' },
  { title: 'Eventbureaus & DMC\'s', value: 'voor-eventbureaus' },
  { title: 'Hotels', value: 'voor-hotels' },
  { title: 'Bedrijven', value: 'voor-bedrijven' },
]

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ-item',
  type: 'document',
  fields: [
    defineField({
      name: 'active',
      title: 'Actief',
      type: 'boolean',
      initialValue: true,
      description: 'Uitgeschakelde items verschijnen nergens op de site.',
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: { list: faqCategories, layout: 'dropdown' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'showOn',
      title: 'Tonen op pagina\'s',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: faqPages },
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Volgorde',
      type: 'number',
      initialValue: 10,
      description: 'Lager = hoger in de lijst.',
    }),
    defineField({
      name: 'questionNl',
      title: 'Vraag (NL)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'answerNl',
      title: 'Antwoord (NL)',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'questionEn',
      title: 'Vraag (EN)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'answerEn',
      title: 'Antwoord (EN)',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Beeld (optioneel)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'altNl',
          title: 'Alt-tekst NL',
          type: 'string',
        }),
        defineField({
          name: 'altEn',
          title: 'Alt-tekst EN',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      questionNl: 'questionNl',
      category: 'category',
      active: 'active',
      media: 'image',
    },
    prepare({ questionNl, category, active, media }) {
      return {
        title: active ? questionNl : `[uit] ${questionNl}`,
        subtitle: category,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Volgorde',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
})
