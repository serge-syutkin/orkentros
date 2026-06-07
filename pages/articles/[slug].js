import Head from "next/head";
import Link from "next/link";

// This page will be wired to Sanity CMS in Phase 2.
// For now it renders a placeholder.
export default function Article() {
  return (
    <>
      <Head>
        <title>Artículo — El Universo de Orkentros</title>
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
                <h1 className="article_title">Título del artículo</h1>
                <p className="article_date u-text-small">Fecha</p>
              </div>
            </div>
          </section>
          <section className="article_content u-section">
            <div className="u-container-article">
              <div className="article_rte w-richtext">
                <p>Contenido del artículo próximamente.</p>
              </div>
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
                  <Link href="/articles" className="button">
                    <div>← Todos los artículos</div>
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

export async function getStaticPaths() {
  // Phase 2: will fetch slugs from Sanity
  return { paths: [], fallback: false };
}

export async function getStaticProps() {
  // Phase 2: will fetch article data from Sanity by slug
  return { props: {} };
}
