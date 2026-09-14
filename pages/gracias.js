import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import { getStripe } from "../lib/stripe";

const PAGE_TITLE = "Gracias por tu compra — El Mundo del Orkentros";

export async function getServerSideProps({ query }) {
  const stripe = getStripe();
  const sessionId = query.session_id;
  let order = null;

  // The session id only reaches the buyer, via Stripe's redirect. Look the
  // session up server-side so the page confirms a real, paid order.
  if (stripe && typeof sessionId === "string") {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        order = { email: session.customer_details?.email || null };
      }
    } catch (err) {
      console.error("Could not load the checkout session:", err);
    }
  }

  return { props: { order } };
}

export default function Gracias({ order }) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>

      <Layout>
        <section className="book_hero gracias_hero u-section">
          <div className="u-container-article gracias_content">
            {order ? (
              <>
                <h1 className="article_title">Gracias por tu compra</h1>
                <p className="u-text-regular book_text">
                  Tu pedido de El Despertar de la Llama Azul está confirmado.
                  {order.email
                    ? ` Hemos enviado el comprobante a ${order.email}.`
                    : " Recibirás el comprobante por correo."}
                </p>
                <p className="u-text-regular book_text">
                  Te avisaremos en cuanto el libro salga hacia tu dirección.
                </p>
              </>
            ) : (
              <>
                <h1 className="article_title">No encontramos tu pedido</h1>
                <p className="u-text-regular book_text">
                  Si acabas de pagar, revisa tu correo: el comprobante de Stripe confirma la
                  compra. Si tienes dudas, escríbenos y lo revisamos.
                </p>
              </>
            )}

            <Link href="/" className="button book_button">
              <div>VOLVER AL INICIO</div>
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
}
