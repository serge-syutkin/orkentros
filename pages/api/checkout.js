import { getStripe } from "../../lib/stripe";
import {
  MAX_QUANTITY,
  PRODUCT_PATH,
  SHIPPING_COUNTRIES,
  getSiteUrl,
} from "../../lib/shop";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
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

  const siteUrl = getSiteUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      phone_number_collection: { enabled: true },
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
