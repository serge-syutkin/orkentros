import { createClient } from 'next-sanity'

// Server-side only: this client carries a token that can write to the dataset,
// so it must never be imported from anything that ships to the browser.
// Returns null when the token is missing, so a build or a local run without it
// degrades to "form unavailable" instead of crashing.
export function getWriteClient() {
  if (!process.env.SANITY_WRITE_TOKEN) return null

  return createClient({
    projectId: '4mczpphj',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
  })
}
