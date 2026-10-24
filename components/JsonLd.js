// A native script tag rather than next/script: JSON-LD is data for crawlers,
// not code to execute, and Next's own guide says so.
//
// JSON.stringify leaves HTML untouched, so a "</script>" inside a title typed
// into Sanity would close this tag early and the rest would be parsed as
// markup. Escaping "<" shuts that door.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
