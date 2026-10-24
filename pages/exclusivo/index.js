import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import JsonLd from "../../components/JsonLd";
import { client } from "../../sanity/lib/client";
import { absoluteUrl } from "../../lib/site";
import { articlesSchema } from "../../lib/schema";

const PAGE_TITLE = "Contenido exclusivo — El Mundo del Orkentros";
const DESCRIPTION =
  "Relatos y leyendas de El Mundo del Orkentros, escritos por J.R. Güemes para quienes quieren adentrarse más allá de las novelas.";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

export default function Articles({ articles }) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl("/exclusivo")} />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={absoluteUrl("/exclusivo")} />
      </Head>

      <JsonLd data={articlesSchema({ articles })} />

      <Layout>
        <section className="article_hero u-section">
          <div className="u-container">
            <div className="article_hero_layout">
              <h1 className="article_title">Contenido exclusivo</h1>
            </div>
          </div>
        </section>

        <section className="article_content u-section">
          <div className="u-container-article">
            {articles.length === 0 ? (
              <p className="u-text-small">Próximamente.</p>
            ) : (
              <ul className="articles_list">
                {articles.map((a) => (
                  <li key={a.slug.current} className="articles_item">
                    <Link href={`/exclusivo/${a.slug.current}`} className="articles_item-link">
                      <span className="articles_item-title">{a.title}</span>
                      {a.publishedAt && (
                        <span className="u-text-small articles_item-date">
                          {formatDate(a.publishedAt)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const articles = await client.fetch(
    `*[_type == "article"] | order(publishedAt desc) { title, slug, publishedAt }`
  );
  return { props: { articles }, revalidate: 300 };
}
