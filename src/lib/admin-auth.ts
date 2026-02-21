import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'change-me-in-production';

function sign(value: string): string {
  return createHmac('sha256', SECRET).update(value).digest('hex');
}

export function createSession(): { value: string; signature: string } {
  const value = Buffer.from(JSON.stringify({ t: Date.now() }), 'utf-8').toString('base64url');
  const signature = sign(value);
  return { value, signature };
}

export function verifySession(cookieValue: string | undefined): boolean {
  if (!cookieValue || !SECRET || SECRET === 'change-me-in-production') return false;
  const [value, signature] = cookieValue.split('.');
  if (!value || !signature) return false;
  try {
    const expected = sign(value);
    if (expected.length !== signature.length) return false;
    if (!timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))) return false;
    const payload = JSON.parse(Buffer.from(value, 'base64url').toString('utf-8'));
    const age = Date.now() - (payload.t || 0);
    return age >= 0 && age < MAX_AGE * 1000;
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME)?.value;
  return verifySession(cookie);
}

export function buildSessionCookieValue(): string {
  const { value, signature } = createSession();
  return `${value}.${signature}`;
}