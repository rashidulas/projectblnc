'use server';

import { getDb } from '@/lib/mongodb';

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

const COLLECTION = 'orders';
const COUNTER_COLLECTION = 'counters';

export async function getOrders(): Promise<OrderRecord[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<OrderRecord>(COLLECTION)
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return docs;
  } catch (error) {
    console.error('getOrders failed:', error);
    return [];
  }
}

/**
 * Atomically reserve the next order sequence number.
 * Uses a MongoDB counter document so concurrent checkouts can't collide
 * (the old file-based approach used orders.length + 1, which had a race).
 */
export async function getNextOrderNumber(): Promise<string> {
  const db = await getDb();
  const result = await db
    .collection<{ _id: string; seq: number }>(COUNTER_COLLECTION)
    .findOneAndUpdate(
      { _id: 'orderNumber' },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
  const seq = result?.seq ?? 1;
  return `BLNC-${String(seq).padStart(5, '0')}`;
}

/**
 * Insert a single order. Preferred over writeOrders for new orders.
 */
export async function insertOrder(order: OrderRecord): Promise<void> {
  const db = await getDb();
  await db.collection<OrderRecord>(COLLECTION).insertOne({ ...order });
}

/**
 * Update an order's status by its id. Returns the updated order or null.
 */
export async function updateOrderStatus(
  id: string,
  status: OrderRecord['status']
): Promise<OrderRecord | null> {
  const db = await getDb();
  const result = await db
    .collection<OrderRecord>(COLLECTION)
    .findOneAndUpdate(
      { id },
      { $set: { status } },
      { returnDocument: 'after', projection: { _id: 0 } }
    );
  return result ?? null;
}

/**
 * Replace the entire orders collection. Kept for API compatibility.
 */
export async function writeOrders(orders: OrderRecord[]): Promise<void> {
  const db = await getDb();
  const collection = db.collection<OrderRecord>(COLLECTION);
  await collection.deleteMany({});
  if (orders.length) {
    await collection.insertMany(orders.map((o) => ({ ...o })));
  }
}
