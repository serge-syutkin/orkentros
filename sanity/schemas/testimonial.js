// Reader reviews, submitted from the book page. They arrive as drafts, which
// the API will not serve without a token, and only reach the site when J.R.
// publishes them — an open form on a public page collects spam, so nothing
// goes out unread. The copy number is never shown publicly; it is there so he
// can check a review against the copies he actually sent.
export const testimonial = {
  name: 'testimonial',
  title: 'Reseña',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    },
    {
      name: 'copyNumber',
      title: 'Número de ejemplar',
      type: 'string',
      description: 'Solo para verificar la compra. No se muestra en la página.',
      validation: (Rule) =>
        Rule.required().regex(/^\d{1,10}$/, { name: 'solo dígitos' }),
    },
    {
      name: 'comment',
      title: 'Comentario',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required().min(10).max(1000),
    },
    {
      name: 'submittedAt',
      title: 'Fecha de envío',
      type: 'datetime',
      readOnly: true,
    },
  ],
  orderings: [
    {
      title: 'Más recientes primero',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { name: 'name', copyNumber: 'copyNumber', comment: 'comment' },
    prepare: ({ name, copyNumber, comment }) => ({
      title: `${name} · ejemplar ${copyNumber}`,
      subtitle: comment?.slice(0, 80) ?? '',
    }),
  },
}
