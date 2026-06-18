import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getProducts, insertProduct } from '@/lib/products-store';
import { slugifyProductName, type Product } from '@/data/products';

export async function GET() {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = (await request.json()) as Partial<Product>;
    const {
      name,
      category,
      price,
      description,
      images = [],
      modelImages = [],
      sizes = [],
      previewImage,
      video,
      stock,
    } = body;
    if (!name || !category || price == null || !description || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price, description, images' },
        { status: 400 }
      );
    }
    const slug = slugifyProductName(name);
    const products = await getProducts();
    if (products.some((p) => p.slug === slug || (body.id && p.id === body.id))) {
      return NextResponse.json(
        { error: 'Product with this slug or id already exists' },
        { status: 400 }
      );
    }
    const id =
      body.id ||
      slug.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const finalSizes = Array.isArray(sizes) && sizes.length ? sizes : ['XS', 'S', 'M', 'L', 'XL'];
    const finalStock =
      stock && typeof stock === 'object'
        ? stock
        : Object.fromEntries(finalSizes.map((s) => [s, 10]));
    const newProduct: Product = {
      id: products.some((p) => p.id === id) ? `${id}-${Date.now()}` : id,
      name,
      slug,
      category: category as Product['category'],
      price: Number(price),
      description,
      images: Array.isArray(images) ? images : [images],
      modelImages: Array.isArray(modelImages) ? modelImages : modelImages ? [modelImages] : [],
      sizes: finalSizes,
      stock: finalStock,
      previewImage,
      video,
    };
    await insertProduct(newProduct);
    return NextResponse.json(newProduct);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
