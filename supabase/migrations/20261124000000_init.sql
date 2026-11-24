-- Onyx: initial schema.
--
-- Access model: Row Level Security is ON for every table and there are NO
-- policies for the anon or authenticated roles. The browser never talks to
-- Supabase. Only the Cloudflare Pages Functions do, using the secret key,
-- which bypasses RLS. Manage records in the Supabase dashboard.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- bookings
create table if not exists public.booking_requests (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  reference            text not null unique check (reference ~ '^ONX-[2-9A-HJ-NP-Z]{7}$'),
  status               text not null default 'pending'
                         check (status in ('pending', 'confirmed', 'unavailable', 'cancelled', 'spam')),

  property_slug        text not null check (char_length(property_slug) <= 80),
  property_name        text not null check (char_length(property_name) <= 160),
  room_id              text not null check (char_length(room_id) <= 80),
  room_name            text not null check (char_length(room_name) <= 160),

  check_in             date not null,
  check_out            date not null,
  nights               integer not null check (nights between 1 and 60),
  adults               integer not null check (adults between 1 and 12),
  children             integer not null default 0 check (children between 0 and 8),
  flexible_dates       boolean not null default false,

  first_name           text not null check (char_length(first_name) between 1 and 80),
  last_name            text not null check (char_length(last_name) between 1 and 80),
  email                text not null check (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  phone                text check (char_length(phone) <= 24),
  country              text check (char_length(country) <= 80),
  interests            text[] not null default '{}',
  notes                text check (char_length(notes) <= 2000),

  upgrade_requested    boolean not null default true,
  from_rate_usd        numeric(10, 2),
  estimated_total_usd  numeric(10, 2),
  estimated_credit_usd numeric(10, 2),

  newsletter_opt_in    boolean not null default false,
  consent_at           timestamptz not null,
  guest_email_sent     boolean,
  staff_email_sent     boolean,

  -- Staff fields, filled in from the dashboard.
  confirmed_rate_usd   numeric(10, 2),
  staff_notes          text,

  ip_hash              text check (char_length(ip_hash) = 64),
  user_agent           text check (char_length(user_agent) <= 300),

  constraint booking_dates_in_order check (check_out > check_in)
);

create index if not exists booking_requests_created_idx on public.booking_requests (created_at desc);
create index if not exists booking_requests_status_idx on public.booking_requests (status, created_at desc);
create index if not exists booking_requests_email_idx on public.booking_requests (email);

-- --------------------------------------------------------------- inquiries
create table if not exists public.inquiries (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  reference        text not null unique check (reference ~ '^ONQ-[2-9A-HJ-NP-Z]{7}$'),
  status           text not null default 'new' check (status in ('new', 'replied', 'closed', 'spam')),
  kind             text not null check (kind in ('trip', 'general')),
  name             text not null check (char_length(name) between 1 and 120),
  email            text not null check (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  phone            text check (char_length(phone) <= 24),
  destination      text check (char_length(destination) <= 160),
  dates            text check (char_length(dates) <= 120),
  travelers        text check (char_length(travelers) <= 160),
  message          text not null check (char_length(message) between 10 and 4000),
  consent_at       timestamptz not null,
  guest_email_sent boolean,
  staff_email_sent boolean,
  staff_notes      text,
  ip_hash          text check (char_length(ip_hash) = 64)
);

create index if not exists inquiries_created_idx on public.inquiries (created_at desc);

-- -------------------------------------------------------------- newsletter
create table if not exists public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  email           text not null unique check (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  source          text not null default 'footer' check (char_length(source) <= 40),
  unsubscribed_at timestamptz,
  ip_hash         text check (char_length(ip_hash) = 64)
);

-- ------------------------------------------------------------- rate limits
-- One row per accepted form submission. Holds no personal data beyond a
-- salted hash of the caller's address. Safe to purge rows older than a day.
create table if not exists public.request_log (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind       text not null check (kind in ('booking', 'inquiry', 'newsletter')),
  ip_hash    text not null check (char_length(ip_hash) = 64)
);

create index if not exists request_log_lookup_idx on public.request_log (ip_hash, kind, created_at desc);

-- ------------------------------------------------------------- housekeeping
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists booking_requests_set_updated_at on public.booking_requests;
create trigger booking_requests_set_updated_at
  before update on public.booking_requests
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------ access
alter table public.booking_requests       enable row level security;
alter table public.inquiries              enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.request_log            enable row level security;

-- Belt and braces: remove any default grants to the public API roles.
revoke all on public.booking_requests       from anon, authenticated;
revoke all on public.inquiries              from anon, authenticated;
revoke all on public.newsletter_subscribers from anon, authenticated;
revoke all on public.request_log            from anon, authenticated;
