'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '@/data/products';
import { products as fallbackProducts } from '@/data/products';

const PRODUCTS_PATH = path.join(process.cwd(), 'data', 'products.json');

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_PATH, 'utf-8');
    const parsed = JSON.parse(data) as Product[];
    return Array.isArray(parsed) ? parsed : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function writeProducts(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(PRODUCTS_PATH), { recursive: true });
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8');
}
