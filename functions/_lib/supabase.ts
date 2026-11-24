import { type Env, supabaseKey } from "./env";

function headers(env: Env, extra: Record<string, string> = {}): Record<string, string> {
  const key = supabaseKey(env)!;
  return { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", ...extra };
}

function endpoint(env: Env, table: string, query = ""): string {
  return `${env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${table}${query}`;
}

export type InsertResult = { ok: true } | { ok: false; conflict: boolean; status: number };

/** Insert one row through PostgREST using the server-side secret key.
 *  Row Level Security is on for every table with no public policies, so this
 *  key (which never leaves the Function) is the only way in. */
export async function insert(env: Env, table: string, row: Record<string, unknown>, opts: { ignoreDuplicates?: string } = {}): Promise<InsertResult> {
  const query = opts.ignoreDuplicates ? `?on_conflict=${opts.ignoreDuplicates}` : "";
  const prefer = opts.ignoreDuplicates ? "return=minimal,resolution=ignore-duplicates" : "return=minimal";
  const res = await fetch(endpoint(env, table, query), {
    method: "POST",
    headers: headers(env, { prefer }),
    body: JSON.stringify(row),
  });
  if (res.ok) return { ok: true };
  console.error(`supabase insert into ${table} failed`, res.status, (await res.text()).slice(0, 300));
  return { ok: false, conflict: res.status === 409, status: res.status };
}

export async function update(env: Env, table: string, match: string, patch: Record<string, unknown>): Promise<void> {
  const res = await fetch(endpoint(env, table, `?${match}`), {
    method: "PATCH",
    headers: headers(env, { prefer: "return=minimal" }),
    body: JSON.stringify(patch),
  });
  if (!res.ok) console.error(`supabase update of ${table} failed`, res.status);
}

/** How many submissions this caller has made since `sinceIso`. */
export async function recentCount(env: Env, kind: string, ipHash: string, sinceIso: string, limit: number): Promise<number> {
  const q = `?select=id&kind=eq.${kind}&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(sinceIso)}&limit=${limit + 1}`;
  const res = await fetch(endpoint(env, "request_log", q), { headers: headers(env) });
  if (!res.ok) {
    console.error("supabase rate lookup failed", res.status);
    return 0; // fail open: a database hiccup should not block a real guest
  }
  const rows = (await res.json()) as unknown[];
  return rows.length;
}
