'use server';

import { getSupabaseAdmin } from '@/lib/supabase';

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

/** Converts a joined auth.users + customer_profiles row to CustomerRecord. */
function rowToCustomer(
  profile: Record<string, unknown>,
  email: string
): CustomerRecord {
  return {
    id: profile.id as string,
    firstName: profile.first_name as string,
    lastName: profile.last_name as string,
    email,
    phone: profile.phone as string,
    addressLine1: profile.address_line1 as string,
    addressLine2: (profile.address_line2 as string) || undefined,
    city: profile.city as string,
    postalCode: profile.postal_code as string,
    createdAt: profile.created_at as string,
    updatedAt: profile.updated_at as string,
  };
}

export async function getCustomers(): Promise<CustomerRecord[]> {
  try {
    const supabase = getSupabaseAdmin();

    // Fetch all user emails from auth.users via admin API
    const { data: usersData, error: usersError } =
      await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (usersError) throw usersError;

    const emailMap = new Map(usersData.users.map((u) => [u.id, u.email ?? '']));

    const { data: profiles, error: profilesError } = await supabase
      .from('customer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;
    return (profiles ?? []).map((p) =>
      rowToCustomer(p as Record<string, unknown>, emailMap.get(p.id as string) ?? '')
    );
  } catch (error) {
    console.error('getCustomers failed:', error);
    return [];
  }
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
 * Create a new customer account using Supabase Auth.
 *
 * Uses `signUp` (anon client) so Supabase automatically sends a 6-digit OTP
 * confirmation email. Returns `requiresVerification: true` when the user must
 * enter that OTP before the account is active.
 */
export async function registerCustomer(
  input: RegisterInput
): Promise<{ customer?: CustomerRecord; error?: string; requiresVerification?: boolean }> {
  const supabase = getSupabaseAdmin();
  const { createClient } = await import('@supabase/supabase-js');

  // Use the anon client for signUp — this triggers the OTP confirmation email
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const email = input.email.trim().toLowerCase();

  const { data: signUpData, error: signUpError } = await anonClient.auth.signUp({
    email,
    password: input.password,
  });

  if (signUpError) {
    if (
      signUpError.message?.toLowerCase().includes('already') ||
      signUpError.message?.toLowerCase().includes('registered')
    ) {
      return { error: 'An account with this email already exists.' };
    }
    return { error: signUpError.message };
  }

  if (!signUpData.user) {
    return { error: 'Registration failed. Please try again.' };
  }

  // Supabase returns identities=[] when the email is already registered
  // (it fakes success to prevent email enumeration)
  if ((signUpData.user.identities ?? []).length === 0) {
    return { error: 'An account with this email already exists.' };
  }

  const userId = signUpData.user.id;
  const now = new Date().toISOString();

  // Insert profile immediately — service role bypasses RLS for unconfirmed users
  const { error: profileError } = await supabase.from('customer_profiles').insert({
    id: userId,
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    phone: input.phone.trim(),
    address_line1: input.addressLine1.trim(),
    address_line2: input.addressLine2?.trim() ?? '',
    city: input.city.trim(),
    postal_code: input.postalCode.trim(),
    created_at: now,
    updated_at: now,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId);
    return { error: 'Failed to create profile. Please try again.' };
  }

  // If email confirmation is disabled in the project, session is returned immediately
  const requiresVerification = signUpData.session === null;

  return {
    requiresVerification,
    customer: {
      id: userId,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      phone: input.phone.trim(),
      addressLine1: input.addressLine1.trim(),
      addressLine2: input.addressLine2?.trim() || undefined,
      city: input.city.trim(),
      postalCode: input.postalCode.trim(),
      createdAt: now,
      updatedAt: now,
    },
  };
}

/**
 * Verify email + password via Supabase Auth.
 * Returns the public customer record on success, null on failure.
 */
export async function authenticateCustomer(
  email: string,
  password: string
): Promise<CustomerRecord | null> {
  const supabase = getSupabaseAdmin();

  // Use the anon client to sign in — service role cannot call signInWithPassword
  const { createClient } = await import('@supabase/supabase-js');
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (signInError || !signInData.user) return null;

  const userId = signInData.user.id;

  const { data: profile, error: profileError } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) return null;

  return rowToCustomer(profile as Record<string, unknown>, signInData.user.email ?? email);
}

/** Update an existing customer's profile by email. */
export async function updateCustomerProfile(
  email: string,
  updates: Partial<Omit<CustomerRecord, 'id' | 'email' | 'createdAt'>>
): Promise<CustomerRecord | null> {
  const supabase = getSupabaseAdmin();

  // Find the user by email
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });
  if (usersError) return null;

  const user = usersData.users.find(
    (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
  );
  if (!user) return null;

  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.firstName !== undefined) row.first_name = updates.firstName;
  if (updates.lastName !== undefined) row.last_name = updates.lastName;
  if (updates.phone !== undefined) row.phone = updates.phone;
  if (updates.addressLine1 !== undefined) row.address_line1 = updates.addressLine1;
  if (updates.addressLine2 !== undefined) row.address_line2 = updates.addressLine2;
  if (updates.city !== undefined) row.city = updates.city;
  if (updates.postalCode !== undefined) row.postal_code = updates.postalCode;

  const { data, error } = await supabase
    .from('customer_profiles')
    .update(row)
    .eq('id', user.id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToCustomer(data as Record<string, unknown>, email);
}
