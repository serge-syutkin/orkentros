import { client } from "../sanity/lib/client";
import { PRODUCT_PATH } from "../lib/shop";
import { absoluteUrl } from "../lib/site";

// Rendered per request rather than written to public/ as a static file: the
// articles come from Sanity, and a static sitemap would go stale the moment
// J.R. publishes one. The cache header keeps that from costing a Sanity query
// on every crawler hit.
function buildXml(urls) {
  const body = urls
    .map(({ loc, lastmod, priority }) =>
      [
        "  <url>",
        `    <loc>${loc}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  let articles = [];
  try {
    articles = await client.fetch(
      `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current, publishedAt, _updatedAt
      }`
    );
  } catch (err) {
    // A sitemap listing the fixed pages is worth more than a 500.
    console.error("Could not load articles for the sitemap:", err);
  }

  const urls = [
    { loc: absoluteUrl("/"), priority: "1.0" },
    { loc: absoluteUrl(PRODUCT_PATH), priority: "0.9" },
    { loc: absoluteUrl("/exclusivo"), priority: "0.6" },
    ...articles.map((article) => ({
      loc: absoluteUrl(`/exclusivo/${article.slug}`),
      lastmod: (article._updatedAt || article.publishedAt || "").slice(0, 10),
      priority: "0.5",
    })),
  ];

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(buildXml(urls));
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
