import Head from "next/head";
import { useState } from "react";
import Layout from "../components/Layout";
import { getStripe } from "../lib/stripe";
import { MAX_QUANTITY, formatPrice } from "../lib/shop";

const TITLE = "El Despertar de la Llama Azul";
const PAGE_TITLE = `${TITLE} — El Mundo del Orkentros`;
const DESCRIPTION =
  "Un joven con la Llama Azul dentro. Una bestia de las sombras que despertará. Y una isla destinada a la destrucción. Primera novela de la saga de la Llama Azul, de J.R. Güemes.";

export async function getStaticProps() {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;
  let price = null;

  // Stripe is the single source of truth for the price: never hardcode it here,
  // or the page and the checkout will drift apart.
  if (stripe && priceId) {
    try {
      const stripePrice = await stripe.prices.retrieve(priceId);
      price = { amount: stripePrice.unit_amount, currency: stripePrice.currency };
    } catch (err) {
      console.error("Could not load the book price from Stripe:", err);
    }
  }

  return { props: { price }, revalidate: 3600 };
}

export default function Libro({ price }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar el pago. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="product" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        {/* REMOVE AT LAUNCH. The shop still runs on Stripe test keys, where a
            purchase charges nothing — this page must not reach search results
            until the live keys are in place. */}
        <meta name="robots" content="noindex" />
      </Head>

      <Layout>
        <section className="book_hero u-section">
          <div className="u-container-article">
            <div className="book_layout">
              {/* Placeholder until the real cover artwork arrives. */}
              <div className="book_cover book_cover--placeholder" aria-hidden="true">
                <span className="book_cover-rune">ᚠ</span>
              </div>

              <div className="book_info">
                <h1 className="article_title">{TITLE}</h1>
                <p className="u-text-small book_author">J.R. Güemes</p>

                <p className="u-text-regular book_logline">
                  Un joven con la Llama Azul dentro.
                  <br />
                  Una bestia de las sombras que despertará.
                  <br />
                  Y una isla destinada a la destrucción.
                </p>

                {price ? (
                  <div className="book_buy">
                    <p className="book_price">{formatPrice(price.amount, price.currency)}</p>
                    <p className="u-text-small book_shipping">Envío incluido en México.</p>

                    <div className="book_quantity">
                      <span className="u-text-small">Cantidad</span>
                      <div className="book_quantity-control">
                        <button
                          type="button"
                          className="book_quantity-btn"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1 || loading}
                          aria-label="Quitar un ejemplar"
                        >
                          −
                        </button>
                        <span className="book_quantity-value" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="book_quantity-btn"
                          onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                          disabled={quantity >= MAX_QUANTITY || loading}
                          aria-label="Añadir un ejemplar"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="button book_button"
                      onClick={handleBuy}
                      disabled={loading}
                    >
                      <div>{loading ? "UN MOMENTO…" : "COMPRAR AHORA"}</div>
                    </button>

                    {error && (
                      <p className="u-text-small book_error" role="alert">
                        {error}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="u-text-small book_error">
                    La venta no está disponible en este momento.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="book_content u-section">
          <div className="u-container-article">
            <h2 className="book_heading">Sinopsis</h2>
            <p className="u-text-regular book_text">
              Tras una larga época de Armonía, Ertudom se enfrenta al cumplimiento de
              oscuras profecías que amenazan con desatar el Kaolieset, la destrucción del
              mundo. Belard, un joven que apenas ha dejado de ser un niño, valiente e
              impulsivo, deberá avanzar entre la desconfianza de líderes codiciosos
              encargados de mantener la paz y los sucesos caóticos que desenterrarán el
              pasado. Mientras una bestia de las sombras despierta y la oscuridad cubre la
              mente de los hombres, Belard tendrá que encontrar la verdad sobre la Joya y
              los secretos de Ertudom antes de que la Llama Azul lo consuma todo.
            </p>

            <h2 className="book_heading">Presentación</h2>
            <p className="u-text-regular book_text">
              El Despertar de la Llama Azul es la primera novela de la saga que abre la
              puerta a El Mundo del Orkentros, un mundo nuevo y original de fantasía creado
              por J.R. Güemes.
            </p>
            <p className="u-text-regular book_text">
              Todo se originó gracias a un sueño que el autor tuvo en 2021 y la escritura de
              un cuento que se convirtió en una novela. Allí, en el sueño, conoció a Midi en
              un bosque cubierto de nieve, mientras se ocultaban de una bestia de oscuridad,
              conocida hoy como el Valtheeriond.
            </p>
            <p className="u-text-regular book_text">
              El Mundo del Orkentros se inspira en las culturas celta y nórdica. Tiene su
              propia mitología, su propio lenguaje, su propia magia, sus propias leyes y su
              propia oscuridad que debe enfrentar.
            </p>
            <p className="u-text-regular book_text">Bienvenido, viajero/a.</p>
          </div>
        </section>
      </Layout>
    </>
  );
}
