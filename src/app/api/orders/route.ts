import { NextRequest, NextResponse } from 'next/server';
import { getOrders, writeOrders, type OrderRecord } from '@/lib/orders-store';
import { sendOrderNotificationEmail } from '@/lib/order-email';

interface CreateOrderBody {
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  shippingAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postalCode?: string;
  };
  items?: Array<{
    id?: string;
    name?: string;
    selectedSize?: string;
    quantity?: number;
    price?: number;
    image?: string;
  }>;
  subtotal?: number;
  shippingFee?: number;
  total?: number;
}

function makeOrderNumber(sequence: number) {
  return `BLNC-${String(sequence).padStart(5, '0')}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderBody;
    const { customer, shippingAddress, items, subtotal, shippingFee, total } = body;

    if (
      !customer?.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.phone ||
      !shippingAddress?.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: 'Missing required checkout fields' }, { status: 400 });
    }

    const normalizedItems = items.map((item) => ({
      id: item.id ?? '',
      name: item.name ?? '',
      selectedSize: item.selectedSize ?? '',
      quantity: Number(item.quantity ?? 0),
      price: Number(item.price ?? 0),
      image: item.image ?? '',
    }));

    if (
      normalizedItems.some(
        (item) =>
          !item.id ||
          !item.name ||
          !item.selectedSize ||
          !item.image ||
          !Number.isFinite(item.quantity) ||
          item.quantity <= 0 ||
          !Number.isFinite(item.price) ||
          item.price < 0
      )
    ) {
      return NextResponse.json({ error: 'Invalid order items' }, { status: 400 });
    }

    const recalculatedSubtotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const normalizedShippingFee = Number(shippingFee ?? 0);
    const normalizedTotal = Number(total ?? 0);

    if (!Number.isFinite(normalizedShippingFee) || normalizedShippingFee < 0) {
      return NextResponse.json({ error: 'Invalid shipping fee' }, { status: 400 });
    }

    if (
      !Number.isFinite(normalizedTotal) ||
      Math.abs(recalculatedSubtotal + normalizedShippingFee - normalizedTotal) > 0.01
    ) {
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
    }

    if (subtotal != null && Math.abs(Number(subtotal) - recalculatedSubtotal) > 0.01) {
      return NextResponse.json({ error: 'Invalid subtotal amount' }, { status: 400 });
    }

    const orders = await getOrders();
    const orderNumber = makeOrderNumber(orders.length + 1);
    const order: OrderRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        addressLine1: shippingAddress.addressLine1.trim(),
        addressLine2: shippingAddress.addressLine2?.trim() ?? '',
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
      },
      items: normalizedItems,
      subtotal: recalculatedSubtotal,
      shippingFee: normalizedShippingFee,
      total: normalizedTotal,
      status: 'pending',
    };

    orders.unshift(order);
    await writeOrders(orders);
    try {
      await sendOrderNotificationEmail(order);
    } catch (emailError) {
      console.error('Order email notification failed', emailError);
    }

    return NextResponse.json(
      {
        ok: true,
        orderNumber: order.orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
