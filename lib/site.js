// Canonical links, the sitemap and schema.org all need absolute addresses,
// and every page that carries them is built without a request — so
// getSiteUrl(req) in lib/shop.js, which reads the request headers, is no help
// here. The domain is fixed, so it lives in the code rather than in an env
// var that would have to be set in three places and could drift.
export const SITE_URL = "https://orkentros.com";
export const SITE_NAME = "El Mundo del Orkentros";
export const AUTHOR_NAME = "J.R. Güemes";

// One stable identifier for the author, referenced by every page that names
// him, so a crawler reads one person rather than a different Güemes per page.
export const AUTHOR_ID = `${SITE_URL}/#autor`;

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path}`;
}
