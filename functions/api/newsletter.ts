import type { Env } from "../_lib/env";
import { guard } from "../_lib/guard";
import { fail, json, methodNotAllowed } from "../_lib/http";
import { insert } from "../_lib/supabase";
import { Checker, Invalid } from "../_lib/validate";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const g = await guard(request, env, "newsletter", 10);
  if (g instanceof Response) return g;

  let email: string;
  try {
    const c = new Checker(g.body);
    email = c.email("email");
    c.done();
  } catch (err) {
    if (err instanceof Invalid) return fail(422, "Enter an email address in the format name@example.com.", err.fields);
    throw err;
  }

  if (g.dryRun) {
    console.log("DRY_RUN newsletter signup");
    return json({ ok: true });
  }

  // Duplicates are ignored, and the reply is the same either way, so this
  // endpoint cannot be used to find out who is already subscribed.
  const saved = await insert(env, "newsletter_subscribers", { email, source: "footer", ip_hash: g.ipHash }, { ignoreDuplicates: "email" });
  if (!saved.ok) return fail(502, "We could not add you to the list. Try again in a moment.");
  return json({ ok: true });
};

export const onRequest: PagesFunction<Env> = async () => methodNotAllowed();
