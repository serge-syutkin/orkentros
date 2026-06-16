import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Página no encontrada — El Mundo del Orkentros</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page-wrapper">
        <div className="main-wrapper">
          <Header />

          <section className="error_section u-section">
            <div className="error_content">
              <h1 className="hero_heading">
                Esta página
                <br />
                se perdió
                <br />
                en el Orkentros
              </h1>
            </div>
            <Link href="/" className="button error_button">
              <div>Ir a inicio</div>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
