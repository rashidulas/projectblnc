import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getOrders } from '@/lib/orders-store';

export async function GET() {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await getOrders();
  return NextResponse.json(orders);
}
