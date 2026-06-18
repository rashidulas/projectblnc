/**
 * One-time seed: loads products from data/products.json into Supabase.
 * Run:  node scripts/seed-products.mjs
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * from your .env.local automatically.
 */
import { readFileSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = new URL('../.env.local', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

// ── Load products ────────────────────────────────────────────────────────────
let products;
const jsonPath = new URL('../data/products.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
if (existsSync(jsonPath)) {
  products = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${products.length} products from data/products.json`);
} else {
  // Fall back to the built-in seed from src/data/products.ts (as JSON)
  const seedPath = new URL('../src/data/products-seed.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
  if (existsSync(seedPath)) {
    products = JSON.parse(readFileSync(seedPath, 'utf-8'));
    console.log(`Loaded ${products.length} products from products-seed.json`);
  } else {
    console.error(
      'No product data found. Create data/products.json or src/data/products-seed.json'
    );
    process.exit(1);
  }
}

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

// ── Seed ─────────────────────────────────────────────────────────────────────
const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

try {
  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug ?? slugify(p.name),
    category: p.category,
    price: Number(p.price),
    description: p.description ?? '',
    images: p.images ?? [],
    model_images: p.modelImages ?? p.model_images ?? [],
    preview_image: p.previewImage ?? p.preview_image ?? null,
    video: p.video ?? null,
    sizes: p.sizes ?? ['XS', 'S', 'M', 'L', 'XL'],
    stock: p.stock ?? Object.fromEntries((p.sizes ?? ['XS', 'S', 'M', 'L', 'XL']).map((s) => [s, 10])),
  }));

  // Clear existing products
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '');
  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase.from('products').insert(rows);
  if (insertError) throw insertError;

  console.log(`✓ Seeded ${rows.length} products into Supabase`);

  // Ensure counter exists
  const { error: counterError } = await supabase
    .from('counters')
    .upsert({ id: 'orderNumber', seq: 0 }, { onConflict: 'id', ignoreDuplicates: true });
  if (counterError) throw counterError;
  console.log('✓ Order counter initialized');

} catch (err) {
  console.error('Seed failed:', err.message ?? err);
  process.exit(1);
}
