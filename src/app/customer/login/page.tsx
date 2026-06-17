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

type Mode = 'signin' | 'register';

const inputClass =
  'w-full border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-700/30 transition';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');

  // Shared
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register-only
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState<SavedCustomer | null>(null);

  // If a customer is already saved locally, greet them.
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (!savedRaw) return;
      const saved = JSON.parse(savedRaw) as SavedCustomer;
      if (saved?.email) {
        setAlreadyLoggedIn(saved);
        setEmail(saved.email);
      }
    } catch {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }
  }, []);

  const resetMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    resetMessages();
    setPassword('');
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    resetMessages();

    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string; customer?: SavedCustomer };

      if (!response.ok || !data.customer) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data.customer));
      setSuccessMessage('Signed in. Redirecting...');
      setTimeout(() => router.push('/checkout'), 600);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    resetMessages();

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          addressLine1,
          addressLine2,
          city,
          postalCode,
        }),
      });
      const data = (await response.json()) as { error?: string; customer?: SavedCustomer };

      if (!response.ok || !data.customer) {
        throw new Error(data.error || 'Could not create your account.');
      }

      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data.customer));
      setSuccessMessage('Account created. Redirecting...');
      setTimeout(() => router.push('/checkout'), 600);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    setAlreadyLoggedIn(null);
    setEmail('');
    setPassword('');
    resetMessages();
  };

  return (
    <section className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16 pt-14 sm:pt-16">
      <header className="mb-8 text-center">
        <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Account</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="font-description text-neutral-600 mt-2 text-sm">
          {mode === 'signin'
            ? 'Sign in to check out faster.'
            : 'Save your details for a quicker checkout next time.'}
        </p>
      </header>

      {alreadyLoggedIn ? (
        <div className="border border-neutral-200 rounded-xl p-6 text-center space-y-4">
          <p className="text-neutral-700">
            You&apos;re signed in as{' '}
            <span className="font-semibold">{alreadyLoggedIn.email}</span>.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/checkout')}
              className="flex-1 bg-neutral-800 text-neutral-50 py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Go to checkout
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 border border-neutral-300 py-3 rounded-md hover:bg-neutral-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="grid grid-cols-2 mb-6 border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => switchMode('signin')}
              className={`py-3 text-sm font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-neutral-800 text-neutral-50'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`py-3 text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-neutral-800 text-neutral-50'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-800 text-neutral-50 py-3 rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                  className={inputClass}
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className={inputClass}
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Address line 1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
                autoComplete="address-line1"
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Address line 2 (optional)"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                autoComplete="address-line2"
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  autoComplete="address-level2"
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  autoComplete="postal-code"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-800 text-neutral-50 py-3 rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {errorMessage && (
            <p className="text-sm text-red-600 mt-4 text-center" role="alert">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-sm text-emerald-700 mt-4 text-center">{successMessage}</p>
          )}
        </>
      )}
    </section>
  );
}
