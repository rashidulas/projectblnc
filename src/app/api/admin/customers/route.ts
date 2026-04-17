import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getCustomers } from '@/lib/customers-store';

export async function GET() {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const customers = await getCustomers();
  return NextResponse.json(customers);
}
