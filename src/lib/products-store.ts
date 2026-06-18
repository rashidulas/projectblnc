'use server';

import type { Product, ProductInput } from '@/data/products';
import { products as fallbackProducts, withProductSlug } from '@/data/products';
import { getSupabaseAdmin } from '@/lib/supabase';

/** Converts a DB row (snake_case) back to the Product shape used by the app. */
function rowToProduct(row: Record<string, unknown>): Product {
  return withProductSlug({
    id: row.id as string,
    name: row.name as string,
    slug: (row.slug as string | undefined) ?? '',
    category: row.category as Product['category'],
    price: Number(row.price),
    description: row.description as string,
    images: (row.images as string[]) ?? [],
    modelImages: (row.model_images as string[]) ?? [],
    previewImage: row.preview_image as string | undefined,
    video: row.video as string | undefined,
    sizes: (row.sizes as string[]) ?? [],
    stock: (row.stock as Record<string, number>) ?? {},
  });
}

/**
 * Returns all products from Supabase. Falls back to the bundled seed data
 * if the database is unreachable or returns an empty set.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return fallbackProducts;
    return data.map(rowToProduct);
  } catch (error) {
    console.error('getProducts failed, using fallback seed:', error);
    return fallbackProducts;
  }
}

/** Replaces the entire products table with the provided list. */
export async function writeProducts(products: Product[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  const rows = products.map(withProductSlug).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    description: p.description,
    images: p.images ?? [],
    model_images: p.modelImages ?? [],
    preview_image: p.previewImage ?? null,
    video: p.video ?? null,
    sizes: p.sizes ?? [],
    stock: p.stock ?? {},
    updated_at: new Date().toISOString(),
  }));

  const { error: deleteError } = await supabase.from('products').delete().neq('id', '');
  if (deleteError) throw deleteError;

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from('products').insert(rows);
    if (insertError) throw insertError;
  }
}

/** Inserts a single new product. */
export async function insertProduct(product: ProductInput): Promise<void> {
  const supabase = getSupabaseAdmin();
  const p = withProductSlug(product);
  const { error } = await supabase.from('products').insert({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    description: p.description,
    images: p.images ?? [],
    model_images: p.modelImages ?? [],
    preview_image: p.previewImage ?? null,
    video: p.video ?? null,
    sizes: p.sizes ?? [],
    stock: p.stock ?? {},
  });
  if (error) throw error;
}

/** Updates a single product by id. */
export async function updateProduct(
  id: string,
  updates: Partial<ProductInput>
): Promise<Product | null> {
  const supabase = getSupabaseAdmin();
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) row.name = updates.name;
  if (updates.name !== undefined || updates.slug !== undefined) {
    const { slugifyProductName } = await import('@/data/products');
    row.slug = updates.slug ?? slugifyProductName(updates.name ?? '');
  }
  if (updates.category !== undefined) row.category = updates.category;
  if (updates.price !== undefined) row.price = updates.price;
  if (updates.description !== undefined) row.description = updates.description;
  if (updates.images !== undefined) row.images = updates.images;
  if (updates.modelImages !== undefined) row.model_images = updates.modelImages;
  if (updates.previewImage !== undefined) row.preview_image = updates.previewImage;
  if (updates.video !== undefined) row.video = updates.video;
  if (updates.sizes !== undefined) row.sizes = updates.sizes;
  if (updates.stock !== undefined) row.stock = updates.stock;

  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data ? rowToProduct(data as Record<string, unknown>) : null;
}

/** Deletes a product by id. */
export async function deleteProduct(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
