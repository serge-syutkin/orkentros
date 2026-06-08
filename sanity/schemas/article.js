export const article = {
  name: 'article',
  title: 'Artículo',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Extracto (descripción SEO)',
      type: 'text',
      rows: 3,
      description: 'Breve descripción del artículo para buscadores y redes sociales (máx. 160 caracteres).',
      validation: (Rule) => Rule.max(160).warning('Supera los 160 caracteres recomendados para SEO.'),
    },
    {
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
    },
    {
      name: 'coverImage',
      title: 'Imagen de portada (opcional)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
    },
    {
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
}
