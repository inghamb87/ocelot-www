import type { Env } from "./env";

const MAX_BODY_BYTES = 16 * 1024;

export function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const fail = (status: number, message: string, fields?: Record<string, string>) =>
  json({ ok: false, message, ...(fields ? { fields } : {}) }, status);

export function methodNotAllowed(): Response {
  const res = fail(405, "This address only accepts POST requests.");
  res.headers.set("allow", "POST");
  return res;
}

/** Same-origin check. Browsers always send Origin on a fetch POST, so a
 *  missing or foreign Origin means the request did not come from our pages. */
export function originAllowed(request: Request, env: Env): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const self = new URL(request.url).origin;
  if (origin === self) return true;
  const extra = (env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return extra.includes(origin);
}

/** Read a small JSON object body. Returns null for anything else. */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) return null;
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return null;
  const buf = await request.arrayBuffer();
  if (buf.byteLength > MAX_BODY_BYTES) return null;
  try {
    const data: unknown = JSON.parse(new TextDecoder().decode(buf));
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** One-way hash of the caller's address. The raw address is never stored. */
export async function ipHash(request: Request, env: Env): Promise<string> {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  return sha256Hex(`${env.IP_HASH_SALT ?? "dev-salt"}:${ip}`);
}

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/O or 1/I

export function newReference(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `${prefix}-${out}`;
}
