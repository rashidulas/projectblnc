import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, writeCustomers, type CustomerRecord } from '@/lib/customers-store';

interface CustomerLoginBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerLoginBody;
    const { firstName, lastName, email, phone, addressLine1, addressLine2, city, postalCode } = body;

    if (!firstName || !lastName || !email || !phone || !addressLine1 || !city || !postalCode) {
      return NextResponse.json({ error: 'Missing required customer fields' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();
    const customers = await getCustomers();
    const existingIndex = customers.findIndex((customer) => customer.email === normalizedEmail);

    const customer: CustomerRecord = {
      id:
        existingIndex >= 0
          ? customers[existingIndex].id
          : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim() ?? '',
      city: city.trim(),
      postalCode: postalCode.trim(),
      createdAt: existingIndex >= 0 ? customers[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.unshift(customer);
    }
    await writeCustomers(customers);

    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save customer information' }, { status: 500 });
  }
}
