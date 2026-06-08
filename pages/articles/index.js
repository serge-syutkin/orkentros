import Head from "next/head";
import Link from "next/link";
import { client } from "../../sanity/lib/client";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

export default function Articles({ articles }) {
  return (
    <>
      <Head>
        <title>Artículos — El Universo de Orkentros</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="fixed-top">
            <p className="name u-text-small">J.R. Güemes</p>
            <p className="u-text-small">Fantasía épica y oscura</p>
            <p className="u-text-small">Inspirado en la mitología celta y vikinga</p>
          </div>

          <section className="article_hero u-section">
            <div className="u-container">
              <div className="article_hero_layout">
                <h1 className="article_title">Artículos</h1>
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
                      <Link href={`/articles/${a.slug.current}`} className="articles_item-link">
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

          <section className="footer u-section">
            <div className="u-container-100">
              <div className="footer_layout">
                <div className="footer_title_wrap">
                  <h1 className="hero_heading">
                    El mundo
                    <br />
                    del orkentros
                  </h1>
                </div>
                <div className="footer_bottom">
                  <Link href="/" className="button">
                    <div>← Inicio</div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const articles = await client.fetch(
    `*[_type == "article"] | order(publishedAt desc) { title, slug, publishedAt }`
  );
  return { props: { articles }, revalidate: 300 };
}
