import { createImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder({
  projectId: '4mczpphj',
  dataset: 'production',
})

export const urlFor = (source) => builder.image(source)
