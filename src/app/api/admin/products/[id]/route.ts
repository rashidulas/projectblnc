import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getProducts, writeProducts } from '@/lib/products-store';
import { slugifyProductName, type Product } from '@/data/products';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const body = (await request.json()) as Partial<Product>;
    const products = await getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    const existing = products[index];
    const updated: Product = {
      ...existing,
      ...body,
      id: existing.id,
      name: body.name ?? existing.name,
      slug: slugifyProductName(body.name ?? existing.name),
      category: (body.category as Product['category']) ?? existing.category,
      price: body.price != null ? Number(body.price) : existing.price,
      description: body.description ?? existing.description,
      images: body.images ? (Array.isArray(body.images) ? body.images : [body.images]) : existing.images,
      modelImages: body.modelImages
        ? (Array.isArray(body.modelImages) ? body.modelImages : [body.modelImages])
        : existing.modelImages,
      sizes: body.sizes ? (Array.isArray(body.sizes) ? body.sizes : existing.sizes) : existing.sizes,
    };
    products[index] = updated;
    await writeProducts(products);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  await writeProducts(filtered);
  return NextResponse.json({ ok: true });
}