'use server';

import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export interface CustomerRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

/** Internal shape stored in DB — includes the password hash. */
interface CustomerDoc extends CustomerRecord {
  passwordHash: string;
}

const COLLECTION = 'customers';
const SALT_ROUNDS = 12;

/** Strip the password hash before returning to callers. */
function toPublic(doc: CustomerDoc): CustomerRecord {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = doc;
  return rest;
}

export async function getCustomers(): Promise<CustomerRecord[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<CustomerDoc>(COLLECTION)
      .find({}, { projection: { _id: 0, passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return docs as CustomerRecord[];
  } catch (error) {
    console.error('getCustomers failed:', error);
    return [];
  }
}

export async function findCustomerByEmail(email: string): Promise<CustomerDoc | null> {
  const db = await getDb();
  const doc = await db
    .collection<CustomerDoc>(COLLECTION)
    .findOne({ email: email.trim().toLowerCase() }, { projection: { _id: 0 } });
  return doc ?? null;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}

/**
 * Create a new customer account with a hashed password.
 * Returns { customer } on success, or { error } if the email is taken.
 */
export async function registerCustomer(
  input: RegisterInput
): Promise<{ customer?: CustomerRecord; error?: string }> {
  const db = await getDb();
  const collection = db.collection<CustomerDoc>(COLLECTION);
  const email = input.email.trim().toLowerCase();

  const existing = await collection.findOne({ email });
  if (existing) {
    return { error: 'An account with this email already exists.' };
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const doc: CustomerDoc = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    phone: input.phone.trim(),
    addressLine1: input.addressLine1.trim(),
    addressLine2: input.addressLine2?.trim() ?? '',
    city: input.city.trim(),
    postalCode: input.postalCode.trim(),
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne({ ...doc });
  return { customer: toPublic(doc) };
}

/**
 * Verify email + password. Returns the public customer record on success.
 */
export async function authenticateCustomer(
  email: string,
  password: string
): Promise<CustomerRecord | null> {
  const doc = await findCustomerByEmail(email);
  if (!doc) {
    // Hash a dummy value to keep timing roughly constant against enumeration.
    await bcrypt.compare(password, '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv');
    return null;
  }
  const valid = await bcrypt.compare(password, doc.passwordHash);
  if (!valid) return null;
  return toPublic(doc);
}

/**
 * Update an existing customer's profile (not password) by email.
 */
export async function updateCustomerProfile(
  email: string,
  updates: Partial<Omit<CustomerRecord, 'id' | 'email' | 'createdAt'>>
): Promise<CustomerRecord | null> {
  const db = await getDb();
  const result = await db
    .collection<CustomerDoc>(COLLECTION)
    .findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after', projection: { _id: 0, passwordHash: 0 } }
    );
  return (result as CustomerRecord) ?? null;
}

/**
 * Replace the entire customers collection. Kept for API compatibility,
 * but note it expects full docs including passwordHash.
 */
export async function writeCustomers(customers: CustomerRecord[]): Promise<void> {
  const db = await getDb();
  const collection = db.collection<CustomerRecord>(COLLECTION);
  await collection.deleteMany({});
  if (customers.length) {
    await collection.insertMany(customers.map((c) => ({ ...c })));
  }
}
