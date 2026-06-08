import Head from "next/head";
import { PortableText } from "next-sanity";
import Layout from "../../components/Layout";
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
        <meta name="description" content={article.excerpt || ""} />
        <meta property="og:title" content={`${article.title} — El Universo de Orkentros`} />
        <meta property="og:description" content={article.excerpt || ""} />
        <meta property="og:type" content="article" />
        {article.coverImage && (
          <meta property="og:image" content={urlFor(article.coverImage).width(1200).height(630).fit("crop").url()} />
        )}
        <meta name="twitter:title" content={`${article.title} — El Universo de Orkentros`} />
        <meta name="twitter:description" content={article.excerpt || ""} />
        <meta name="twitter:card" content="summary_large_image" />
        {article.coverImage && (
          <meta name="twitter:image" content={urlFor(article.coverImage).width(1200).height(630).fit("crop").url()} />
        )}
      </Head>
      <Layout>
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

        {article.coverImage && (
          <section className="article_cover-section u-section">
            <div className="u-container-article">
              <img
                className="article_cover"
                src={urlFor(article.coverImage).width(1600).fit("max").url()}
                alt={article.coverImage.alt || ""}
              />
            </div>
          </section>
        )}

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
      </Layout>
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
      excerpt,
      publishedAt,
      coverImage,
      body
    }`,
    { slug: params.slug }
  );

  if (!article) return { notFound: true };

  return { props: { article }, revalidate: 3600 };
}
