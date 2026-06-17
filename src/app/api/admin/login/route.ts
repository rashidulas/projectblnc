import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { buildSessionCookieValue } from '@/lib/admin-auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function passwordsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still run a comparison to keep timing roughly constant.
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

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
    if (!password || typeof password !== 'string' || !passwordsMatch(password, ADMIN_PASSWORD)) {
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
