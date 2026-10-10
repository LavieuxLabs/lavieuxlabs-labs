import { CONTACT_EMAIL } from "@/lib/site";
import {
  HONEYPOT_FIELD,
  isLocale,
  sanitizeLoi,
  validateLoi,
  type LoiFields,
} from "@/lib/loi";

// Pilot / LOI request delivery. The contact form posts JSON here; the request is validated again on
// the server and sent as a plain-text email to CONTACT_EMAIL through the Resend REST API (no SDK
// dependency). Reply-To is the requester, so the team can answer straight from the inbox.
//
// Environment (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   required; without it the route answers 503 and the form offers the address.
//   RESEND_FROM      sender on a domain verified in Resend, default "LavieuxLabs <pilot@lavieuxlabs.com>".
//   RESEND_API_URL   optional override of https://api.resend.com (used by the end-to-end tests).

const MAX_BODY_BYTES = 16 * 1024;
const SOLUTION_LABELS = { pharmadeux: "PharmaDeux CDSS", shield: "Shield", academic: "Akademik İş Birliği" } as const;

// Best-effort limit per client IP: 6 accepted requests per 10 minutes. It lives in the memory of one
// server instance, so it slows down scripted abuse; it is not a guarantee across instances.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const recent = new Map<string, number[]>();

function rateLimited(ip: string, now: number) {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(ip, hits);
    return true;
  }
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return false;
}

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const asString = (v: unknown) => (typeof v === "string" ? v : "");

export async function POST(request: Request) {
  // Same-origin only: browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin) {
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      // "null" or malformed Origin.
    }
    if (!originHost || (host && originHost !== host)) return json(403, { error: "forbidden" });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, { error: "unsupported_media_type" });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "too_large" });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: "invalid_json" });
  }

  // Honeypot filled: answer like a success, send nothing.
  if (asString(body[HONEYPOT_FIELD])) return json(200, { ok: true });

  const locale = isLocale(body.locale) ? body.locale : "tr";
  const fields: LoiFields = sanitizeLoi({
    organization: asString(body.organization),
    name: asString(body.name),
    title: asString(body.title),
    email: asString(body.email),
    requestType: asString(body.requestType),
    message: asString(body.message),
    consent: body.consent === true,
  });
  const errors = validateLoi(fields, body.solution, locale);
  if (Object.keys(errors).length > 0) return json(400, { error: "invalid", fields: errors });
  const solution = body.solution as keyof typeof SOLUTION_LABELS;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip, Date.now())) return json(429, { error: "rate_limited" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[api/loi] RESEND_API_KEY is not set; request not delivered.");
    return json(503, { error: "not_configured" });
  }

  const solutionLabel = SOLUTION_LABELS[solution];
  const subject = `[${solutionLabel}] ${fields.requestType} — ${fields.organization}`;
  const text = [
    `Kurum: ${fields.organization}`,
    `İlgili kişi: ${fields.name}${fields.title ? ` (${fields.title})` : ""}`,
    `E-posta: ${fields.email}`,
    `İlgilenilen çözüm: ${solutionLabel}`,
    `Talep türü: ${fields.requestType}`,
    `Form dili: ${locale.toUpperCase()}`,
    `KVKK aydınlatma onayı: evet`,
    "",
    fields.message,
    "",
    "—",
    "lavieuxlabs.com iletişim formundan gönderildi. Yanıtla, başvuru sahibine gider.",
  ].join("\n");

  try {
    const res = await fetch(`${process.env.RESEND_API_URL ?? "https://api.resend.com"}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "LavieuxLabs <pilot@lavieuxlabs.com>",
        to: [CONTACT_EMAIL],
        reply_to: fields.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Status only: the response may echo the request, which contains personal data.
      console.error(`[api/loi] Resend responded ${res.status}`);
      return json(502, { error: "send_failed" });
    }
  } catch (error) {
    console.error("[api/loi] Resend request failed:", error instanceof Error ? error.name : "unknown");
    return json(502, { error: "send_failed" });
  }

  return json(200, { ok: true });
}
