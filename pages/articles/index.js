import Head from "next/head";
import Link from "next/link";

export default function Articles() {
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
                <p className="u-text-small">Próximamente — los artículos aparecerán aquí.</p>
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
                  <Link href="/" className="button">
                    <div>Volver al inicio</div>
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
