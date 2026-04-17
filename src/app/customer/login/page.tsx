'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SavedCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}

const CUSTOMER_STORAGE_KEY = 'projectblnc-customer';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (!savedRaw) return;
      const saved = JSON.parse(savedRaw) as SavedCustomer;
      setFirstName(saved.firstName ?? '');
      setLastName(saved.lastName ?? '');
      setEmail(saved.email ?? '');
      setPhone(saved.phone ?? '');
      setAddressLine1(saved.addressLine1 ?? '');
      setAddressLine2(saved.addressLine2 ?? '');
      setCity(saved.city ?? '');
      setPostalCode(saved.postalCode ?? '');
    } catch {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      postalCode,
    };

    try {
      const response = await fetch('/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        error?: string;
        customer?: SavedCustomer;
      };

      if (!response.ok || !data.customer) {
        throw new Error(data.error || 'Failed to save customer information');
      }

      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data.customer));
      setSuccessMessage('Information saved. Redirecting to checkout...');
      setTimeout(() => {
        router.push('/checkout');
      }, 600);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to save customer information'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Customer access</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Customer Login</h1>
        <p className="font-description text-neutral-600 mt-2">
          Save your details once and use them during checkout.
        </p>
      </header>

      <form onSubmit={onSubmit} className="border border-neutral-200 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            className="border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            className="border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="sm:col-span-2 border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            className="sm:col-span-2 border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="Address line 1"
            value={addressLine1}
            onChange={(event) => setAddressLine1(event.target.value)}
            required
            className="sm:col-span-2 border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="Address line 2 (optional)"
            value={addressLine2}
            onChange={(event) => setAddressLine2(event.target.value)}
            className="sm:col-span-2 border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
            className="border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="Postal code"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            required
            className="border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {isSubmitting ? 'Saving...' : 'Save and continue'}
        </button>

        {errorMessage && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
        {successMessage && <p className="text-sm text-emerald-700">{successMessage}</p>}
      </form>
    </section>
  );
}
