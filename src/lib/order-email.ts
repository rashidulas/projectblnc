import nodemailer from 'nodemailer';
import type { OrderRecord } from '@/lib/orders-store';

function formatCurrency(amount: number) {
  return `${amount.toFixed(2)} BDT`;
}

function buildItemsText(order: OrderRecord) {
  return order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ${formatCurrency(
          item.price * item.quantity
        )}`
    )
    .join('\n');
}

export async function sendOrderNotificationEmail(order: OrderRecord): Promise<void> {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.ORDERS_NOTIFY_EMAIL;
  const from = process.env.ORDERS_FROM_EMAIL || user;
  const secure = process.env.SMTP_SECURE === 'true';
  const port = Number(portRaw || (secure ? 465 : 587));

  if (!host || !user || !pass || !to || !from || !Number.isFinite(port)) {
    console.warn('Order email skipped: SMTP/notification environment variables are missing.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const subject = `New Order ${order.orderNumber} - ${formatCurrency(order.total)}`;
  const text = `New order received

Order: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleString()}
Status: ${order.status}

Customer:
${order.customer.firstName} ${order.customer.lastName}
Email: ${order.customer.email}
Phone: ${order.customer.phone}

Shipping Address:
${order.shippingAddress.addressLine1}
${order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}\n` : ''}${order.shippingAddress.city}, ${order.shippingAddress.postalCode}

Items:
${buildItemsText(order)}

Subtotal: ${formatCurrency(order.subtotal)}
Shipping: ${formatCurrency(order.shippingFee)}
Total: ${formatCurrency(order.total)}
`;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
}
