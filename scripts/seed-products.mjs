/**
 * One-time seed: loads products from data/products.json into MongoDB.
 * Usage:  node scripts/seed-products.mjs
 *
 * Reads MONGODB_URI and MONGODB_DB from your .env.local automatically.
 * Safe to re-run: it clears the products collection and re-inserts.
 */
import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Load .env.local manually (so we don't need an extra package) ---
function loadEnvLocal() {
  const envPath = join(__dirname, '..', '.env.local');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'projectblnc';

if (!uri) {
  console.error('Could not find MONGODB_URI.');
  console.error('Make sure a .env.local file exists in your project root with a MONGODB_URI line.');
  process.exit(1);
}

const productsPath = join(__dirname, '..', 'data', 'products.json');
const raw = readFileSync(productsPath, 'utf-8');
const products = JSON.parse(raw);

function slugify(name) {
  return name.trim().toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const withSlugs = products.map((p) => ({ ...p, slug: slugify(p.name) }));

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection('products');
  await col.deleteMany({});
  const result = await col.insertMany(withSlugs);
  console.log(`Seeded ${result.insertedCount} products into "${dbName}".`);

  const orders = db.collection('orders');
  const orderCount = await orders.countDocuments();
  await db.collection('counters').updateOne(
    { _id: 'orderNumber' },
    { $setOnInsert: { seq: orderCount } },
    { upsert: true }
  );
  console.log(`Order counter initialized (current orders: ${orderCount}).`);
} catch (err) {
  console.error('Seed failed:', err);
  process.exit(1);
} finally {
  await client.close();
}
