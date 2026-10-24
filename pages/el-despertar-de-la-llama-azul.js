import Head from "next/head";
import { useState } from "react";
import Layout from "../components/Layout";
import JsonLd from "../components/JsonLd";
import { client } from "../sanity/lib/client";
import { getStripe } from "../lib/stripe";
import { MAX_QUANTITY, PRODUCT_PATH, SALE_STARTS_AT, formatPrice } from "../lib/shop";
import { absoluteUrl } from "../lib/site";
import { bookSchema } from "../lib/schema";
import Testimonials from "../components/Testimonials";

const TITLE = "El Despertar de la Llama Azul";

// SALE_STARTS_AT comes from lib/shop so the page and the checkout route can
// never disagree about when the shop opens. It is read on the server and
// passed down, so the page cannot contradict itself after hydration, and the
// five-minute revalidation flips it without a deploy.
const PAGE_TITLE = `${TITLE} — El Mundo del Orkentros`;
const COVER = "/portada-llama-azul.webp";
// The same cover as a JPEG, for link previews only. Facebook and WhatsApp
// render WebP previews unreliably, and WhatsApp is where this link will
// travel most; the page itself keeps the lighter WebP.
const SOCIAL_IMAGE = "/portada-llama-azul.jpg";
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

  // Reviews are filed as drafts and approved by being published, so the draft
  // filter is what keeps unread ones off the page. The copy number stays
  // behind: it is for J.R. to check a review against the copies he sent.
  let testimonials = [];
  try {
    testimonials = await client.fetch(
      `*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(submittedAt desc) {
        "id": _id, name, comment, submittedAt
      }`
    );
  } catch (err) {
    console.error("Could not load testimonials:", err);
  }

  // Five minutes rather than an hour: an approved review that takes an hour to
  // show up reads as broken to whoever just approved it.
  return {
    props: { price, testimonials, onSale: Date.now() >= SALE_STARTS_AT },
    revalidate: 300,
  };
}

export default function Libro({ price, testimonials, onSale }) {
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
        <meta property="og:url" content={absoluteUrl(PRODUCT_PATH)} />
        {/* The cover is portrait, so a shared link shows it tall rather than
            cropped to a banner. A 1200×630 composition would sit better, but
            the real cover beats no image at all. */}
        <meta property="og:image" content={absoluteUrl(SOCIAL_IMAGE)} />
        <meta property="og:image:width" content="1122" />
        <meta property="og:image:height" content="1402" />
        <meta property="og:image:alt" content={`Portada de ${TITLE}`} />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={absoluteUrl(SOCIAL_IMAGE)} />
        <link rel="canonical" href={absoluteUrl(PRODUCT_PATH)} />
      </Head>

      <JsonLd data={bookSchema({ price, onSale, description: DESCRIPTION })} />

      <Layout>
        <section className="book_hero u-section">
          <div className="u-container-article">
            <div className="book_layout">
              {/* Provisional artwork; the author will replace it with photos
                  of the printed book. */}
              <img
                className="book_cover"
                src={COVER}
                width={1121}
                height={1401}
                alt={`Portada de ${TITLE}, de J.R. Güemes`}
              />

              <div className="book_info">
                <h1 className="article_title">{TITLE}</h1>
                <p className="u-text-small book_author">J.R. Güemes</p>

                <p className="u-text-regular book_logline">
                  Los primeros 500 ejemplares numerados.
                  <br />
                  Autografiado por el autor y dedicado a tu nombre.
                  <br />
                  Hasta agotar existencias.
                </p>

                {price ? (
                  <div className="book_buy">
                    <p className="book_price">{formatPrice(price.amount, price.currency)}</p>
                    <p className="u-text-small book_shipping">Envío incluido en México.</p>

                    {/* The price stays visible before the sale opens — it tells
                        a visitor something without offering them a purchase
                        they cannot complete. The controls do not. */}
                    {onSale && (
                      <>
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
                      </>
                    )}

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
              Un joven con la Llama Azul dentro. Una bestia de las sombras que
              despertará. Y una isla destinada a la destrucción.
            </p>
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

        <Testimonials testimonials={testimonials} />
      </Layout>
    </>
  );
}
