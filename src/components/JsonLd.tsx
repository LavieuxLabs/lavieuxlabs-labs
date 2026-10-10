/**
 * Renders Schema.org structured data as a JSON-LD script tag (the approach the Next.js JSON-LD
 * guide recommends). `<` is escaped so a string value can never close the tag.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
