import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Eventkennis-artikel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel (H1)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO-titel',
      type: 'string',
      description: 'Korte titel voor Google, zonder "| Eventshoot.nl". Leeg laten gebruikt de H1.',
      validation: Rule => Rule.max(44),
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
          lists: [
            { title: 'Opsomming', value: 'bullet' },
            { title: 'Genummerd', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Vet', value: 'strong' },
              { title: 'Cursief', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'Pad of URL',
                    type: 'string',
                    description: 'Intern pad zoals /kennismaken, of een volledige URL.',
                    validation: Rule => Rule.required(),
                  }),
                ],
              },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
        {
          type: 'object',
          name: 'articleDownloads',
          title: 'Downloadknoppen',
          fields: [
            defineField({
              name: 'items',
              title: 'Knoppen',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'articleDownload',
                  title: 'Download',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Knoptekst',
                      type: 'string',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'href',
                      title: 'Bestand of URL',
                      type: 'string',
                      description: 'Pad vanaf de site, bijvoorbeeld /DATA_EVENTSHOOT/FILES/bestand.pdf',
                      validation: Rule => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'href' },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { items: 'items' },
            prepare({ items }) {
              const count = Array.isArray(items) ? items.length : 0
              return { title: `Downloads (${count})` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Veelgestelde vragen (alleen NL, onder dit artikel)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'articleFaqItem',
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
