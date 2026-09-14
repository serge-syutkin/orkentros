// Shop-wide settings shared by the product page and the checkout API route.

// Hard cap on how many copies one order may contain. The API route re-checks
// this, so editing it here is enough — the browser is never trusted.
export const MAX_QUANTITY = 5;

// The book's page. Stripe's cancel_url points back here, so keeping the path
// in one place stops the two from drifting apart if the page is ever renamed.
export const PRODUCT_PATH = "/el-despertar-de-la-llama-azul";

// Countries Stripe will let the buyer ship to. The price already includes
// delivery inside Mexico, so adding a country here also means adding a
// shipping rate for it in Stripe.
export const SHIPPING_COUNTRIES = ["MX"];

// Absolute origin used for Stripe's success/cancel redirects. Netlify sets URL
// (production) and DEPLOY_PRIME_URL (deploy previews) automatically, so the
// same code works locally, in previews and in production.
export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL ||
    "http://localhost:3000"
  );
}

export function formatPrice(amount, currency) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
