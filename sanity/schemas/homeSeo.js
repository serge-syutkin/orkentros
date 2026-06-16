import { ExcerptInput } from '../components/ExcerptInput'

export const homeSeo = {
  name: 'homeSeo',
  title: 'SEO de la página principal',
  type: 'document',
  fields: [
    {
      name: 'metaTitle',
      title: 'Título SEO',
      type: 'string',
      description:
        'El título azul que aparece en los resultados de Google y en la pestaña del navegador. Recomendado: 50–60 caracteres.',
      validation: (Rule) =>
        Rule.max(60).warning('Supera los 60 caracteres recomendados para Google.'),
    },
    {
      name: 'metaDescription',
      title: 'Descripción SEO',
      type: 'text',
      rows: 3,
      description:
        'El texto gris bajo el título en los resultados de Google. Recomendado: máx. 160 caracteres.',
      validation: (Rule) =>
        Rule.max(160).warning('Supera los 160 caracteres recomendados para SEO.'),
      components: { input: ExcerptInput },
    },
  ],
  preview: {
    prepare: () => ({ title: 'SEO de la página principal' }),
  },
}
