import { NextRequest, NextResponse } from 'next/server';
import { registerCustomer } from '@/lib/customers-store';

interface RegisterBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterBody;
    const {
      firstName, lastName, email, phone, password,
      addressLine1, addressLine2, city, postalCode,
    } = body;

    if (!firstName || !lastName || !email || !phone || !password ||
        !addressLine1 || !city || !postalCode) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const { customer, error, requiresVerification } = await registerCustomer({
      firstName, lastName, email, phone, password,
      addressLine1, addressLine2, city, postalCode,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 409 });
    }

    return NextResponse.json(
      { ok: true, customer, requiresVerification: requiresVerification ?? false },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
  }
}
