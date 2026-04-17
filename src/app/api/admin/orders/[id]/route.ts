import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getOrders, writeOrders, type OrderRecord } from '@/lib/orders-store';

const ALLOWED_STATUSES: OrderRecord['status'][] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = (await request.json()) as { status?: OrderRecord['status'] };
    if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const orders = await getOrders();
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder: OrderRecord = {
      ...orders[index],
      status: body.status,
    };

    orders[index] = updatedOrder;
    await writeOrders(orders);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
