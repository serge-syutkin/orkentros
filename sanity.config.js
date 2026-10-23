import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { article } from './sanity/schemas/article'
import { homeSeo } from './sanity/schemas/homeSeo'
import { testimonial } from './sanity/schemas/testimonial'

// Singletons: one-of-a-kind documents (no create/delete, pinned in the studio)
const singletonTypes = new Set(['homeSeo'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Types that get their own hand-built list below, so they must not also appear
// in the automatic one.
const customListTypes = new Set(['testimonial'])

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
            // Reviews split by state, so what still needs reading is the first
            // thing visible instead of being mixed in with what is published.
            S.listItem()
              .title('Reseñas')
              .id('testimonials')
              .child(
                S.list()
                  .title('Reseñas')
                  .items([
                    // A review arrives as a draft and is approved by being
                    // published, so draft state is what separates the two.
                    S.listItem()
                      .title('Pendientes')
                      .id('testimonialsPending')
                      .child(
                        S.documentList()
                          .title('Pendientes')
                          .filter('_type == "testimonial" && _id in path("drafts.**")')
                          .defaultOrdering([
                            { field: 'submittedAt', direction: 'desc' },
                          ])
                      ),
                    S.listItem()
                      .title('Publicadas')
                      .id('testimonialsApproved')
                      .child(
                        S.documentList()
                          .title('Publicadas')
                          .filter('_type == "testimonial" && !(_id in path("drafts.**"))')
                          .defaultOrdering([
                            { field: 'submittedAt', direction: 'desc' },
                          ])
                      ),
                  ])
              ),
            S.divider(),
            // Everything else (Artículos, etc.) as normal lists
            ...S.documentTypeListItems().filter(
              (li) => !singletonTypes.has(li.getId()) && !customListTypes.has(li.getId())
            ),
          ]),
    }),
  ],
  schema: {
    types: [article, homeSeo, testimonial],
  },
  // For singletons, only allow publish/discard/restore — no create or delete
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
