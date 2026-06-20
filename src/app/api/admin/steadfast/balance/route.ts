import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getOrderById, attachCourierInfo } from '@/lib/orders-store';
import { createConsignment } from '@/lib/steadfast';

/**
 * POST /api/admin/orders/[id]/ship
 *
 * Books a Steadfast parcel for the given order, saves the returned
 * consignment_id + tracking_code, and sets order status to 'shipped'.
 *
 * Admin-only. Idempotency: if the order already has a consignment, we refuse
 * to book a second one (prevents duplicate parcels on a double click).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Guard against double-booking.
    if (order.courier?.consignmentId) {
      return NextResponse.json(
        {
          error: 'This order already has a Steadfast consignment.',
          consignmentId: order.courier.consignmentId,
          trackingCode: order.courier.trackingCode,
        },
        { status: 409 }
      );
    }

    // Steadfast wants ONE recipient_address string — combine the parts.
    const addr = order.shippingAddress;
    const recipientAddress = [
      addr.addressLine1,
      addr.addressLine2,
      addr.city,
      addr.postalCode,
    ]
      .filter((part) => part && part.trim().length > 0)
      .join(', ');

    const recipientName =
      `${order.customer.firstName} ${order.customer.lastName}`.trim();

    // COD: collect the full order total. For a prepaid flow, set this to 0.
    const consignment = await createConsignment({
      invoice: order.orderNumber,
      recipient_name: recipientName,
      recipient_phone: order.customer.phone,
      recipient_address: recipientAddress,
      cod_amount: Math.round(order.total),
      note: `BLNC order ${order.orderNumber}`,
    });

    const updated = await attachCourierInfo(id, {
      consignmentId: String(consignment.consignment_id),
      trackingCode: consignment.tracking_code,
      status: consignment.status ?? 'in_review',
    });

    return NextResponse.json({
      message: 'Parcel booked with Steadfast.',
      order: updated,
      consignment: {
        consignmentId: String(consignment.consignment_id),
        trackingCode: consignment.tracking_code,
        status: consignment.status,
      },
    });
  } catch (error) {
    console.error('Steadfast booking failed:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to book parcel.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
