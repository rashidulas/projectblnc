import { NextRequest, NextResponse } from 'next/server';
import { buildSessionCookieValue } from '@/lib/admin-auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Admin login is not configured. Set ADMIN_PASSWORD.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    const cookieValue = buildSessionCookieValue();
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_session', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
