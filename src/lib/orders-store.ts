'use server';

import { promises as fs } from 'fs';
import path from 'path';

export interface OrderItem {
  id: string;
  name: string;
  selectedSize: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

const ORDERS_PATH = path.join(process.cwd(), 'data', 'orders.json');

export async function getOrders(): Promise<OrderRecord[]> {
  try {
    const data = await fs.readFile(ORDERS_PATH, 'utf-8');
    const parsed = JSON.parse(data) as OrderRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeOrders(orders: OrderRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8');
}
