'use server';

import { promises as fs } from 'fs';
import path from 'path';

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

const CUSTOMERS_PATH = path.join(process.cwd(), 'data', 'customers.json');

export async function getCustomers(): Promise<CustomerRecord[]> {
  try {
    const data = await fs.readFile(CUSTOMERS_PATH, 'utf-8');
    const parsed = JSON.parse(data) as CustomerRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeCustomers(customers: CustomerRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(CUSTOMERS_PATH), { recursive: true });
  await fs.writeFile(CUSTOMERS_PATH, JSON.stringify(customers, null, 2), 'utf-8');
}
