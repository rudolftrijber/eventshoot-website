import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'eventshoot-studio',
  title: 'Eventshoot.nl — Nieuwsbeheer',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Inhoud')
          .items([
            S.listItem()
              .title('Nieuwsartikelen')
              .child(S.documentTypeList('blogPost').title('Alle artikelen')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
