import Stripe from "stripe";

let stripe = null;

// Server-side only. Returns null when the secret key is missing so that builds
// and local runs without a configured Stripe account still work — the pages
// degrade to "store unavailable" instead of crashing.
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}
