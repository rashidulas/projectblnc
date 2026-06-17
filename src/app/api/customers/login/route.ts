import { NextRequest, NextResponse } from 'next/server';
import { authenticateCustomer } from '@/lib/customers-store';

interface CustomerLoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerLoginBody;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const customer = await authenticateCustomer(email, password);
    if (!customer) {
      // Generic message — don't reveal whether the email exists.
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to sign in.' }, { status: 500 });
  }
}
