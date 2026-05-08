import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Nieuwsartikel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
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
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', date: 'publishedAt' },
    prepare({ title, media, date }) {
      return {
        title,
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
