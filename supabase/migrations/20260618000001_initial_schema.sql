-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
create table if not exists products (
  id              text primary key,
  name            text not null,
  slug            text not null unique,
  category        text not null,
  price           numeric(10,2) not null,
  description     text not null default '',
  images          text[] not null default '{}',
  model_images    text[] not null default '{}',
  preview_image   text,
  video           text,
  sizes           text[] not null default '{}',
  stock           jsonb not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
create table if not exists orders (
  id                      text primary key,
  order_number            text not null unique,
  created_at              timestamptz not null default now(),
  customer_first_name     text not null,
  customer_last_name      text not null,
  customer_email          text not null,
  customer_phone          text not null,
  shipping_address_line1  text not null,
  shipping_address_line2  text not null default '',
  shipping_city           text not null,
  shipping_postal_code    text not null,
  items                   jsonb not null default '[]',
  subtotal                numeric(10,2) not null,
  shipping_fee            numeric(10,2) not null,
  total                   numeric(10,2) not null,
  status                  text not null default 'pending'
    check (status in ('pending','confirmed','shipped','delivered','cancelled'))
);

-- ─────────────────────────────────────────────
-- ORDER-NUMBER COUNTER  (atomic sequence)
-- ─────────────────────────────────────────────
create table if not exists counters (
  id    text primary key,
  seq   integer not null default 0
);

insert into counters (id, seq) values ('orderNumber', 0)
  on conflict (id) do nothing;

-- Atomic increment function — call this instead of incrementing in app code
create or replace function next_order_number()
returns integer
language plpgsql
as $$
declare
  v_seq integer;
begin
  update counters
     set seq = seq + 1
   where id = 'orderNumber'
  returning seq into v_seq;
  return v_seq;
end;
$$;

-- ─────────────────────────────────────────────
-- CUSTOMER PROFILES  (extends Supabase Auth users)
-- ─────────────────────────────────────────────
create table if not exists customer_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  first_name      text not null,
  last_name       text not null,
  phone           text not null default '',
  address_line1   text not null default '',
  address_line2   text not null default '',
  city            text not null default '',
  postal_code     text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- STORAGE BUCKETS
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 10485760,
   array['image/webp','image/jpeg','image/jpg','image/png','image/avif']),
  ('product-videos', 'product-videos', true, 104857600,
   array['video/mp4','video/webm','video/quicktime']),
  ('website-assets', 'website-assets', true, 10485760,
   array['image/webp','image/jpeg','image/jpg','image/png','image/avif','image/gif','image/svg+xml'])
on conflict (id) do nothing;

-- ─────────────────────────────────────────────
-- STORAGE POLICIES  (public read, auth write via service role)
-- ─────────────────────────────────────────────
-- Public read for all three buckets
create policy "Public read product-images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Public read product-videos"
  on storage.objects for select
  using ( bucket_id = 'product-videos' );

create policy "Public read website-assets"
  on storage.objects for select
  using ( bucket_id = 'website-assets' );

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
-- products: anyone can read; only service_role can write
alter table products enable row level security;
create policy "Public read products"
  on products for select using (true);

-- orders: anyone can insert (guest checkout); only service_role reads/updates
alter table orders enable row level security;
create policy "Public insert orders"
  on orders for insert with check (true);

-- customer_profiles: owner can read/update; insert on registration
alter table customer_profiles enable row level security;
create policy "Owner read profile"
  on customer_profiles for select
  using (auth.uid() = id);
create policy "Owner update profile"
  on customer_profiles for update
  using (auth.uid() = id);
create policy "Owner insert profile"
  on customer_profiles for insert
  with check (auth.uid() = id);
