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

// Absolute origin used for Stripe's success/cancel redirects.
//
// Netlify's URL / DEPLOY_PRIME_URL are only guaranteed during the build, and
// the checkout route runs later as a function, so the request's own origin is
// the reliable source — it is correct on localhost, on deploy previews and in
// production alike. NEXT_PUBLIC_SITE_URL overrides it when a deployment has to
// redirect somewhere other than the host it was reached on.
export function getSiteUrl(req) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  const headers = req?.headers ?? {};
  const host = headers["x-forwarded-host"] || headers.host;

  if (host) {
    const proto =
      headers["x-forwarded-proto"] ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`;
  }

  return process.env.DEPLOY_PRIME_URL || process.env.URL || "http://localhost:3000";
}

export function formatPrice(amount, currency) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
