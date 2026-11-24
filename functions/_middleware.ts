import type { Env } from "./_lib/env";

/**
 * Security headers for every page and API response.
 *
 * Next.js writes a few inline <script> tags into each exported page. Instead
 * of allowing all inline script, this middleware creates a fresh nonce per
 * request, stamps it on those tags with HTMLRewriter and names it in the
 * Content-Security-Policy. Inline styles are not used anywhere on the site,
 * so style-src stays at 'self'.
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  // Page HTML carries a per-request nonce, so it must never be revalidated
  // into a 304 (the cached body would keep an old nonce). Drop validators on
  // the way in and on the way out for navigations.
  const wantsHtml = (context.request.headers.get("accept") ?? "").includes("text/html");
  let upstream: Response;
  if (wantsHtml) {
    const req = new Request(context.request);
    req.headers.delete("if-none-match");
    req.headers.delete("if-modified-since");
    upstream = await context.next(req);
  } else {
    upstream = await context.next();
  }
  const response = new Response(upstream.body, upstream);
  const h = response.headers;
  h.delete("Access-Control-Allow-Origin");

  h.set("X-Content-Type-Options", "nosniff");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("X-Frame-Options", "DENY");
  h.set("Cross-Origin-Opener-Policy", "same-origin");
  h.set("Cross-Origin-Resource-Policy", "same-origin");
  h.set("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), browsing-topics=()");
  if (new URL(context.request.url).protocol === "https:") {
    h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  const type = h.get("content-type") ?? "";
  if (!type.includes("text/html")) {
    if (new URL(context.request.url).pathname.startsWith("/api/")) {
      h.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    }
    return response;
  }

  h.delete("ETag");
  h.delete("Last-Modified");
  h.set("Cache-Control", "private, no-cache");

  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(18))));
  const turnstile = context.env.TURNSTILE_SECRET_KEY ? " https://challenges.cloudflare.com" : "";
  h.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'${turnstile}`,
      "style-src 'self'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      `frame-src ${turnstile.trim() || "'none'"}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  );

  return new HTMLRewriter()
    .on("script", {
      element(el) {
        el.setAttribute("nonce", nonce);
      },
    })
    .transform(response);
};
