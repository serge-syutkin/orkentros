// Shop-wide settings shared by the product page and the checkout API route.

// Hard cap on how many copies one order may contain. The API route re-checks
// this, so editing it here is enough — the browser is never trusted.
export const MAX_QUANTITY = 5;

// The book's page. Stripe's cancel_url points back here, so keeping the path
// in one place stops the two from drifting apart if the page is ever renamed.
export const PRODUCT_PATH = "/el-despertar-de-la-llama-azul";

// Nothing may be bought before this moment: midnight on 29 October 2026 in
// Mexico City, UTC-6 all year since the country dropped daylight saving. The
// page hides its buy button until then, and the checkout route refuses until
// then — hiding a button is not a lock, and the money is real.
const DEFAULT_SALE_START = Date.parse("2026-10-29T06:00:00Z");

// SALE_STARTS_AT_OVERRIDE opens or closes the shop from Netlify, without a
// code change: an ISO date in the past opens it, one in the future closes it
// again. It exists so a real payment can be tested before the announced date,
// and because the run is 500 numbered copies — the sale has to be closable on
// the day they run out, and that day is not known in advance.
//
// The format is exact on purpose: 2026-10-29T06:00:00Z, UTC. Date.parse alone
// would not do — it reads "octubre 29" as October 2001 rather than failing,
// and a date in 2001 is in the past, so a typo in a Netlify field would be
// what opens the shop early. Anything that is not this shape is refused and
// the announced date stands.
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

function resolveSaleStart() {
  const override = process.env.SALE_STARTS_AT_OVERRIDE;
  if (!override) return DEFAULT_SALE_START;

  const parsed = ISO_UTC.test(override) ? Date.parse(override) : Number.NaN;
  if (Number.isNaN(parsed)) {
    console.error(
      `Ignoring SALE_STARTS_AT_OVERRIDE "${override}": expected a UTC instant ` +
        `such as 2026-10-29T06:00:00Z. The announced sale date stands.`
    );
    return DEFAULT_SALE_START;
  }

  return parsed;
}

export const SALE_STARTS_AT = resolveSaleStart();

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
