import { getStripe } from "../../lib/stripe";
import {
  MAX_QUANTITY,
  PRODUCT_PATH,
  SALE_STARTS_AT,
  SHIPPING_COUNTRIES,
  getSiteUrl,
} from "../../lib/shop";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // The page hides its buy button before the sale opens, but this route is
  // reachable on its own and the keys behind it are live money.
  if (Date.now() < SALE_STARTS_AT) {
    return res.status(403).json({ error: "La venta aún no ha comenzado." });
  }

  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    console.error("Checkout called without STRIPE_SECRET_KEY or STRIPE_PRICE_ID");
    return res.status(500).json({ error: "La tienda no está disponible ahora." });
  }

  // The quantity comes from the browser, so clamp it instead of trusting it.
  const requested = Number.parseInt(req.body?.quantity, 10);
  const quantity = Math.min(Math.max(Number.isNaN(requested) ? 1 : requested, 1), MAX_QUANTITY);

  const siteUrl = getSiteUrl(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      phone_number_collection: { enabled: true },
      // Every copy is signed and dedicated by hand, so the name has to be
      // collected with the order. Stripe keeps one set of custom fields per
      // session, not per line item: an order of several copies carries a
      // single dedication.
      custom_fields: [
        {
          key: "dedicatoria",
          label: { type: "custom", custom: "Dedicado a" },
          type: "text",
          optional: false,
          text: { maximum_length: 60 },
        },
      ],
      locale: "es",
      success_url: `${siteUrl}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${PRODUCT_PATH}`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session failed:", err);
    return res.status(500).json({ error: "No se pudo iniciar el pago. Inténtalo de nuevo." });
  }
}
