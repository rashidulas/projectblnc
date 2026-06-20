'use server';

/**
 * Steadfast Courier API client.
 *
 * SERVER-ONLY. Never import this into client components — it reads secret
 * credentials from environment variables. Keys live in .env.local (local) and
 * Vercel → Project Settings → Environment Variables (production). They are
 * NEVER stored in the database and NEVER sent to the browser.
 *
 * Required env vars:
 *   STEADFAST_API_KEY
 *   STEADFAST_SECRET_KEY
 *   STEADFAST_BASE_URL   (optional, defaults below)
 *
 * Docs: https://portal.packzy.com — endpoints create_order, status_by_cid,
 * get_balance. Auth via Api-Key / Secret-Key request headers.
 */

const BASE_URL =
  process.env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1';
const API_KEY = process.env.STEADFAST_API_KEY;
const SECRET_KEY = process.env.STEADFAST_SECRET_KEY;

/** Payload sent to Steadfast to book a parcel. */
export interface SteadfastOrderInput {
  /** Your own order reference, e.g. "BLNC-00042". */
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  /** Cash to collect on delivery, in BDT. Use 0 for prepaid. */
  cod_amount: number;
  note?: string;
}

/** Consignment object returned by a successful create_order call. */
export interface SteadfastConsignment {
  consignment_id: number;
  invoice: string;
  tracking_code: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SteadfastCreateResponse {
  status: number;
  message: string;
  consignment: SteadfastConsignment;
}

function assertConfigured(): { apiKey: string; secretKey: string } {
  if (!API_KEY || !SECRET_KEY) {
    throw new Error(
      'Steadfast is not configured. Set STEADFAST_API_KEY and STEADFAST_SECRET_KEY ' +
        'in .env.local (and in Vercel for production).'
    );
  }
  return { apiKey: API_KEY, secretKey: SECRET_KEY };
}

function authHeaders(): HeadersInit {
  const { apiKey, secretKey } = assertConfigured();
  return {
    'Content-Type': 'application/json',
    'Api-Key': apiKey,
    'Secret-Key': secretKey,
  };
}

async function parseJsonOrThrow(res: Response): Promise<unknown> {
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON response (e.g. HTML error page).
    throw new Error(
      `Steadfast returned a non-JSON response (HTTP ${res.status}). ` +
        `First 200 chars: ${text.slice(0, 200)}`
    );
  }
  if (!res.ok) {
    const message =
      (body as { message?: string })?.message ||
      `Steadfast request failed (HTTP ${res.status}).`;
    throw new Error(message);
  }
  return body;
}

/**
 * Books a single parcel with Steadfast.
 * Returns the consignment (contains consignment_id + tracking_code).
 */
export async function createConsignment(
  input: SteadfastOrderInput
): Promise<SteadfastConsignment> {
  const res = await fetch(`${BASE_URL}/create_order`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      invoice: input.invoice,
      recipient_name: input.recipient_name,
      recipient_phone: input.recipient_phone,
      recipient_address: input.recipient_address,
      cod_amount: input.cod_amount,
      note: input.note ?? '',
    }),
    cache: 'no-store',
  });

  const body = (await parseJsonOrThrow(res)) as SteadfastCreateResponse;
  if (!body?.consignment?.consignment_id) {
    throw new Error(
      body?.message || 'Steadfast did not return a consignment. Check the payload.'
    );
  }
  return body.consignment;
}

export interface SteadfastStatusResponse {
  status: number;
  delivery_status: string;
}

/** Looks up current delivery status by Steadfast consignment id. */
export async function getStatusByConsignmentId(
  consignmentId: number | string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/status_by_cid/${consignmentId}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
  });
  const body = (await parseJsonOrThrow(res)) as SteadfastStatusResponse;
  return body.delivery_status ?? 'unknown';
}

export interface SteadfastBalanceResponse {
  status: number;
  current_balance: number;
}

/**
 * Returns the current account balance. This is the SAFEST call to verify your
 * credentials work — it creates no parcel and costs nothing.
 */
export async function getBalance(): Promise<number> {
  const res = await fetch(`${BASE_URL}/get_balance`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
  });
  const body = (await parseJsonOrThrow(res)) as SteadfastBalanceResponse;
  return body.current_balance ?? 0;
}
