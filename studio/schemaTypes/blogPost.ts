import { defineField, defineType } from 'sanity'

const languageOptions = [
  { title: 'Nederlands', value: 'nl' },
  { title: 'English', value: 'en' },
]

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Eventkennis-artikel',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Taal',
      type: 'string',
      options: { list: languageOptions, layout: 'radio' },
      initialValue: 'nl',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'translationOf',
      title: 'Vertaling van (NL-bronartikel)',
      type: 'reference',
      to: [{ type: 'blogPost' }],
      description:
        'Alleen invullen bij Engelse artikelen: koppel aan het Nederlandse bronartikel. NL-artikelen laten leeg.',
      hidden: ({ document }) => document?.language !== 'en',
    }),
    defineField({
      name: 'title',
      title: 'Titel (H1)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicatiedatum',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Samenvatting (voor overzichtspagina)',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(300),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hoofdafbeelding',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst (voor SEO)',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'readTime',
      title: 'Leestijd (minuten)',
      type: 'number',
      initialValue: 3,
    }),
    defineField({
      name: 'body',
      title: 'Inhoud',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normaal', value: 'normal' },
            { title: 'Kop 2', value: 'h2' },
            { title: 'Kop 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Vet', value: 'strong' },
              { title: 'Cursief', value: 'em' },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Veelgestelde vragen (FAQ)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'Vraag & antwoord',
          fields: [
            defineField({
              name: 'question',
              title: 'Vraag',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Antwoord',
              type: 'text',
              rows: 4,
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', date: 'publishedAt', language: 'language' },
    prepare({ title, media, date, language }) {
      const langLabel = language === 'en' ? 'EN' : 'NL'
      return {
        title: `[${langLabel}] ${title}`,
        media,
        subtitle: date ? new Date(date).toLocaleDateString('nl-NL') : 'Geen datum',
      }
    },
  },
  orderings: [
    {
      title: 'Nieuwste eerst',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
