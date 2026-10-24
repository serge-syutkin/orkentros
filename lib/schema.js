import {
  SITE_URL,
  SITE_NAME,
  AUTHOR_NAME,
  AUTHOR_ID,
  absoluteUrl,
} from "./site";
import { PRODUCT_PATH } from "./shop";

const BOOK_TITLE = "El Despertar de la Llama Azul";
// The JPEG, not the WebP the page displays: a crawler that cannot decode WebP
// should still get an image, and this one is identical in content.
const BOOK_COVER = "/portada-llama-azul.jpg";

// The author as a node of his own, so everything that names him points at one
// entity instead of describing him again and drifting.
function author() {
  return {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: AUTHOR_NAME,
    url: `${SITE_URL}/`,
    jobTitle: "Escritor",
    sameAs: ["https://jrguemes.substack.com"],
  };
}

export function homeSchema({ description }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description,
        inLanguage: "es",
        publisher: { "@id": AUTHOR_ID },
      },
      author(),
    ],
  };
}

export function bookSchema({ price, onSale, description }) {
  // Two types on purpose. Book carries author, inLanguage and later the ISBN;
  // Product is what a search engine reads a price and an availability from.
  // Book descends from CreativeWork, not from Product, so the page claims
  // both rather than giving one of them up.
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Book", "Product"],
    "@id": `${absoluteUrl(PRODUCT_PATH)}#libro`,
    name: BOOK_TITLE,
    url: absoluteUrl(PRODUCT_PATH),
    description,
    image: absoluteUrl(BOOK_COVER),
    inLanguage: "es",
    author: author(),
    // isbn, numberOfPages and bookFormat are absent because the author has
    // not supplied them. Leaving them out costs less than guessing wrong.
  };

  // Without a price from Stripe the page already tells the visitor the shop
  // is unavailable; an offer with no price would contradict it.
  if (price) {
    const currency = price.currency.toUpperCase();

    schema.offers = {
      "@type": "Offer",
      url: absoluteUrl(PRODUCT_PATH),
      price: (price.amount / 100).toFixed(2),
      priceCurrency: currency,
      // Bound to the same moment the page and the checkout route read, so the
      // markup cannot advertise a copy that cannot yet be bought.
      availability: onSale
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      seller: { "@id": AUTHOR_ID },
      // "Envío incluido en México" stated where a crawler can read it.
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "MX",
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency,
        },
      },
    };
  }

  return schema;
}

export function articlesSchema({ articles }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/exclusivo")}#coleccion`,
    url: absoluteUrl("/exclusivo"),
    name: "Contenido exclusivo",
    inLanguage: "es",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/exclusivo/${article.slug.current}`),
        name: article.title,
      })),
    },
  };
}
