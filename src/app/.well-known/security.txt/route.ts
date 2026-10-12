import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

// RFC 9116 security.txt, generated from the single contact source (CONTACT_EMAIL) and the canonical
// site URL. There is no PGP key yet, so no Encryption field is published. Expires must stay within a
// year: renew this date when the file is reviewed.
const EXPIRES = "2027-10-11T00:00:00.000Z";

export function GET() {
  const body = [
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Expires: ${EXPIRES}`,
    "Preferred-Languages: tr, en",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
