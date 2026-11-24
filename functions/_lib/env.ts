export interface Env {
  ASSETS: Fetcher;

  // Supabase (server only). SUPABASE_SECRET_KEY is the "secret" API key
  // (sb_secret_...) or the legacy service_role key.
  SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;

  // CloudMailin outbound. Both values come from the SMTP credentials page.
  CLOUDMAILIN_SMTP_USERNAME?: string;
  CLOUDMAILIN_API_TOKEN?: string;
  CLOUDMAILIN_TEST_MODE?: string;

  MAIL_FROM?: string; // e.g. "Onyx <concierge@yourdomain.com>"
  MAIL_NOTIFY_TO?: string; // where staff notifications go
  MAIL_REPLY_TO?: string; // reply address on guest emails

  IP_HASH_SALT?: string;
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGINS?: string; // comma separated extra origins
  DRY_RUN?: string; // "1": validate and log only, no database, no email
}

export type Ctx = EventContext<Env, string, Record<string, unknown>>;

export function supabaseKey(env: Env): string | undefined {
  return env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
}

export function isDryRun(env: Env): boolean {
  return env.DRY_RUN === "1";
}

export function isConfigured(env: Env): boolean {
  return Boolean(
    env.SUPABASE_URL &&
      supabaseKey(env) &&
      env.CLOUDMAILIN_SMTP_USERNAME &&
      env.CLOUDMAILIN_API_TOKEN &&
      env.MAIL_FROM &&
      env.MAIL_NOTIFY_TO &&
      env.IP_HASH_SALT,
  );
}
