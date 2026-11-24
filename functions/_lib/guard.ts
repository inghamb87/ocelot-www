import { type Env, isConfigured, isDryRun } from "./env";
import { fail, ipHash, json, originAllowed, readJson } from "./http";
import { insert, recentCount } from "./supabase";

export type Guarded = { body: Record<string, unknown>; ipHash: string; dryRun: boolean } | Response;

/**
 * Shared front door for every form endpoint:
 * same-origin only, JSON only, size capped, bot checks, rate limited.
 */
export async function guard(
  request: Request,
  env: Env,
  kind: "booking" | "inquiry" | "newsletter",
  limitPerHour: number,
): Promise<Guarded> {
  if (!originAllowed(request, env)) return fail(403, "This request did not come from the Onyx site.");

  const body = await readJson(request);
  if (!body) return fail(400, "The request could not be read. Reload the page and try again.");

  // Honeypot: a hidden field people never see. Bots that fill it get a
  // success-shaped reply and nothing is stored or sent.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true, reference: "ONX-RECEIVED" });
  }
  const elapsed = body.elapsedMs;
  if (typeof elapsed !== "number" || elapsed < 1500) {
    return fail(400, "That was very fast. Check your details and send again.");
  }

  const dryRun = isDryRun(env);
  if (!dryRun && !isConfigured(env)) {
    console.error("onyx: backend environment variables are missing");
    return fail(503, "Requests are not switched on yet. Email us instead and we will reply.");
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", token);
    const ip = request.headers.get("cf-connecting-ip");
    if (ip) form.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const outcome = (await res.json().catch(() => ({}))) as { success?: boolean };
    if (!outcome.success) return fail(400, "The security check did not pass. Reload the page and try again.");
  }

  const hash = await ipHash(request, env);
  if (!dryRun) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    if ((await recentCount(env, kind, hash, since, limitPerHour)) >= limitPerHour) {
      return fail(429, "Too many requests from this connection. Wait an hour, or email us instead.");
    }
    await insert(env, "request_log", { kind, ip_hash: hash });
  }
  return { body, ipHash: hash, dryRun };
}
