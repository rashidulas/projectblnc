'use server';

import { getSupabaseAdmin } from '@/lib/supabase';

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

/** Converts a DB row (snake_case) to the OrderRecord shape used by the app. */
function rowToOrder(row: Record<string, unknown>): OrderRecord {
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    createdAt: row.created_at as string,
    customer: {
      firstName: row.customer_first_name as string,
      lastName: row.customer_last_name as string,
      email: row.customer_email as string,
      phone: row.customer_phone as string,
    },
    shippingAddress: {
      addressLine1: row.shipping_address_line1 as string,
      addressLine2: row.shipping_address_line2 as string | undefined,
      city: row.shipping_city as string,
      postalCode: row.shipping_postal_code as string,
    },
    items: (row.items as OrderItem[]) ?? [],
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee),
    total: Number(row.total),
    status: row.status as OrderRecord['status'],
  };
}

export async function getOrders(): Promise<OrderRecord[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => rowToOrder(row as Record<string, unknown>));
  } catch (error) {
    console.error('getOrders failed:', error);
    return [];
  }
}

/**
 * Atomically reserves the next order sequence number using a Postgres function.
 * Concurrent checkouts will never get the same number.
 */
export async function getNextOrderNumber(): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('next_order_number');
  if (error) throw error;
  const seq = (data as number) ?? 1;
  return `BLNC-${String(seq).padStart(5, '0')}`;
}

/** Insert a single new order. */
export async function insertOrder(order: OrderRecord): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('orders').insert({
    id: order.id,
    order_number: order.orderNumber,
    created_at: order.createdAt,
    customer_first_name: order.customer.firstName,
    customer_last_name: order.customer.lastName,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    shipping_address_line1: order.shippingAddress.addressLine1,
    shipping_address_line2: order.shippingAddress.addressLine2 ?? '',
    shipping_city: order.shippingAddress.city,
    shipping_postal_code: order.shippingAddress.postalCode,
    items: order.items,
    subtotal: order.subtotal,
    shipping_fee: order.shippingFee,
    total: order.total,
    status: order.status,
  });
  if (error) throw error;
}

/** Update an order's status by its id. Returns the updated order or null. */
export async function updateOrderStatus(
  id: string,
  status: OrderRecord['status']
): Promise<OrderRecord | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data ? rowToOrder(data as Record<string, unknown>) : null;
}

/** Replace the entire orders table. Kept for API compatibility. */
export async function writeOrders(orders: OrderRecord[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.from('orders').delete().neq('id', '');
  if (orders.length > 0) {
    const rows = orders.map((order) => ({
      id: order.id,
      order_number: order.orderNumber,
      created_at: order.createdAt,
      customer_first_name: order.customer.firstName,
      customer_last_name: order.customer.lastName,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      shipping_address_line1: order.shippingAddress.addressLine1,
      shipping_address_line2: order.shippingAddress.addressLine2 ?? '',
      shipping_city: order.shippingAddress.city,
      shipping_postal_code: order.shippingAddress.postalCode,
      items: order.items,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      total: order.total,
      status: order.status,
    }));
    const { error } = await supabase.from('orders').insert(rows);
    if (error) throw error;
  }
}
