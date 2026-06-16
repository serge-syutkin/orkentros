import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { article } from './sanity/schemas/article'
import { homeSeo } from './sanity/schemas/homeSeo'

// Singletons: one-of-a-kind documents (no create/delete, pinned in the studio)
const singletonTypes = new Set(['homeSeo'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'orkentros',
  title: 'El Mundo del Orkentros',
  projectId: '4mczpphj',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            // Pinned singleton: Homepage SEO
            S.listItem()
              .title('SEO de la página principal')
              .id('homeSeo')
              .child(S.document().schemaType('homeSeo').documentId('homeSeo')),
            S.divider(),
            // Everything else (Artículos, etc.) as normal lists
            ...S.documentTypeListItems().filter(
              (li) => !singletonTypes.has(li.getId())
            ),
          ]),
    }),
  ],
  schema: {
    types: [article, homeSeo],
  },
  // For singletons, only allow publish/discard/restore — no create or delete
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
