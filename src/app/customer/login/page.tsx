'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

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
const OTP_LENGTH = 6;

type Mode = 'signin' | 'register';

const inputClass =
  'w-full border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-700/30 transition';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register-only fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // OTP step
  const [otpStep, setOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [pendingCustomer, setPendingCustomer] = useState<SavedCustomer | null>(null);
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState<SavedCustomer | null>(null);

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

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const resetMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    resetMessages();
    setPassword('');
  };

  // ── Sign In ────────────────────────────────────────────────────────────────
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
      window.dispatchEvent(new Event('storage'));
      setSuccessMessage('Signed in. Redirecting...');
      setTimeout(() => router.push('/checkout'), 600);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
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
          firstName, lastName, email, phone, password,
          addressLine1, addressLine2, city, postalCode,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        customer?: SavedCustomer;
        requiresVerification?: boolean;
      };

      if (!response.ok || !data.customer) {
        throw new Error(data.error || 'Could not create your account.');
      }

      if (data.requiresVerification) {
        // Show OTP step
        setPendingCustomer(data.customer);
        setPendingEmail(data.customer.email);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpStep(true);
        setResendCooldown(60);
        resetMessages();
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        // Email confirmation disabled — log in directly
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data.customer));
        window.dispatchEvent(new Event('storage'));
        setSuccessMessage('Account created. Redirecting...');
        setTimeout(() => router.push('/checkout'), 600);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── OTP digit input ────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = [...otpDigits];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setOtpDigits(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Verify OTP ─────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    resetMessages();

    const token = otpDigits.join('');
    if (token.length < OTP_LENGTH) {
      setErrorMessage('Please enter all 6 digits.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token,
        type: 'signup',
      });

      if (error) {
        throw new Error(error.message.includes('expired') || error.message.includes('invalid')
          ? 'Invalid or expired code. Please try again or resend.'
          : error.message
        );
      }

      if (pendingCustomer) {
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(pendingCustomer));
        window.dispatchEvent(new Event('storage'));
      }

      setSuccessMessage('Email verified! Redirecting...');
      setTimeout(() => router.push('/checkout'), 600);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;
    resetMessages();
    setIsSubmitting(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
      });
      if (error) throw new Error(error.message);
      setSuccessMessage('A new code has been sent to your email.');
      setOtpDigits(['', '', '', '', '', '']);
      setResendCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Sign out ───────────────────────────────────────────────────────────────
  const handleSignOut = () => {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
    setAlreadyLoggedIn(null);
    setEmail('');
    setPassword('');
    resetMessages();
  };

  // ── OTP screen ─────────────────────────────────────────────────────────────
  if (otpStep) {
    return (
      <section className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16 pt-14 sm:pt-16">
        <header className="mb-8 text-center">
          <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Verify your email</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Check your inbox</h1>
          <p className="font-description text-neutral-600 mt-2 text-sm">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-neutral-800">{pendingEmail}</span>.
            Enter it below to confirm your account.
          </p>
        </header>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {/* OTP digit boxes */}
          <div className="flex justify-center gap-3">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={i === 0 ? handleOtpPaste : undefined}
                className="w-12 h-14 text-center text-xl font-semibold border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-neutral-700/30 transition bg-white"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otpDigits.join('').length < OTP_LENGTH}
            className="w-full bg-neutral-800 text-neutral-50 py-3 rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {isSubmitting ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isSubmitting}
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-50"
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={() => { setOtpStep(false); resetMessages(); }}
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            ← Back to registration
          </button>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 mt-4 text-center" role="alert">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-emerald-700 mt-4 text-center">{successMessage}</p>
        )}
      </section>
    );
  }

  // ── Main sign-in / register screen ─────────────────────────────────────────
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
