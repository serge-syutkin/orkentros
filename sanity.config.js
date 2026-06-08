import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { article } from './sanity/schemas/article'

export default defineConfig({
  name: 'orkentros',
  title: 'El Universo de Orkentros',
  projectId: '4mczpphj',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: [article],
  },
})
