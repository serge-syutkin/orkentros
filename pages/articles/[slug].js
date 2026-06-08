import Head from "next/head";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure>
        <img
          src={urlFor(value).width(900).fit("max").url()}
          alt={value.alt || ""}
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {value.alt && <figcaption>{value.alt}</figcaption>}
      </figure>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  },
};

export default function Article({ article }) {
  if (!article) return null;

  return (
    <>
      <Head>
        <title>{article.title} — El Universo de Orkentros</title>
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
                <h1 className="article_title">{article.title}</h1>
                {article.publishedAt && (
                  <p className="article_date u-text-small">
                    {formatDate(article.publishedAt)}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="article_content u-section">
            <div className="u-container-article">
              <div className="article_rte w-richtext">
                {article.body && (
                  <PortableText
                    value={article.body}
                    components={portableTextComponents}
                  />
                )}
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
  const slugs = await client.fetch(
    `*[_type == "article" && defined(slug.current)].slug.current`
  );
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const article = await client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      title,
      publishedAt,
      body
    }`,
    { slug: params.slug }
  );

  if (!article) return { notFound: true };

  return { props: { article }, revalidate: 3600 };
}
