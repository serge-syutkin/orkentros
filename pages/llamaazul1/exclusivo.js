import Head from "next/head";
import Layout from "../../components/Layout";

// Reached by direct link only. Nothing on the site points here, this page is
// absent from the sitemap, and the noindex below is what actually keeps it
// out of search: an unlinked address still reaches Google through browsers,
// referrers and whoever forwards the link. robots.txt would be the wrong
// tool — a crawler has to be let in to read the noindex.
const PAGE_TITLE = "Contenido exclusivo — El Mundo del Orkentros";

export default function LlamaAzulExclusivo() {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>

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
            {/* Placeholder. The same wrapper the articles use, so the real
                text will land with the styling already settled. */}
            <div className="article_rte w-richtext">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>

              <h2>Duis aute irure</h2>

              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>

              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </p>

              <blockquote>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt.
              </blockquote>

              <h2>Neque porro quisquam</h2>

              <p>
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit, sed quia non numquam eius modi
                tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem.
              </p>

              <ul>
                <li>Ut enim ad minima veniam, quis nostrum exercitationem.</li>
                <li>Quis autem vel eum iure reprehenderit qui in ea voluptate.</li>
                <li>At vero eos et accusamus et iusto odio dignissimos ducimus.</li>
              </ul>

              <p>
                Et harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus, omnis
                voluptas assumenda est, omnis dolor repellendus.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
