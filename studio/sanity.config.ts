import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'eventshoot-studio',
  title: 'Eventshoot.nl — Contentbeheer',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Inhoud')
          .items([
            S.listItem()
              .title('FAQ')
              .child(
                S.documentTypeList('faqItem')
                  .title('Alle FAQ-items')
                  .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
              ),
            S.divider(),
            S.listItem()
              .title('Eventkennis')
              .child(
                S.documentTypeList('blogPost')
                  .title('Alle artikelen')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
