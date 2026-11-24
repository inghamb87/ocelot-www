export type ApiResult<T = Record<string, unknown>> =
  | { ok: true; data: T }
  | { ok: false; message: string; fields?: Record<string, string> };

const GENERIC = "Something went wrong on our side and your details were not sent. Try again in a moment.";

/** POST JSON to a same-origin Pages Function and normalize the outcome. */
export async function postJson<T = Record<string, unknown>>(path: string, body: unknown): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
    });
  } catch {
    return { ok: false, message: "We could not reach the server. Check your connection and try again." };
  }
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }
  const j = (json ?? {}) as { ok?: boolean; message?: string; fields?: Record<string, string> };
  if (res.ok && j.ok) return { ok: true, data: j as T };
  if (res.status === 429) {
    return { ok: false, message: j.message ?? "Too many requests from this connection. Wait a few minutes and try again." };
  }
  return { ok: false, message: j.message ?? GENERIC, fields: j.fields };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
