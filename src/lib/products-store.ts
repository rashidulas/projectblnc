'use server';

import type { Product, ProductInput } from '@/data/products';
import { products as fallbackProducts, withProductSlug } from '@/data/products';
import { getDb } from '@/lib/mongodb';

const COLLECTION = 'products';

/**
 * Returns all products from MongoDB. If the database is unreachable or empty,
 * falls back to the bundled seed data so the storefront never renders blank.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<ProductInput>(COLLECTION)
      .find({}, { projection: { _id: 0 } })
      .toArray();
    if (!docs.length) return fallbackProducts;
    return docs.map(withProductSlug);
  } catch (error) {
    console.error('getProducts failed, using fallback seed:', error);
    return fallbackProducts;
  }
}

/**
 * Replaces the entire products collection with the provided list.
 * Kept for API compatibility with the previous file-based store.
 */
export async function writeProducts(products: Product[]): Promise<void> {
  const db = await getDb();
  const collection = db.collection<ProductInput>(COLLECTION);
  const withSlugs = products.map(withProductSlug);
  // Replace the whole set atomically-ish: clear then insert.
  await collection.deleteMany({});
  if (withSlugs.length) {
    await collection.insertMany(withSlugs.map((p) => ({ ...p })));
  }
}
