'use client';

import { FormEvent, useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
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
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);
  const CUSTOMER_STORAGE_KEY = 'projectblnc-customer';

  const shippingFee = cart.length > 0 ? 120 : 0;
  const grandTotal = cartTotal + shippingFee;

  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (!savedRaw) return;
      const saved = JSON.parse(savedRaw) as {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        postalCode?: string;
      };
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

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            firstName,
            lastName,
            email,
            phone,
          },
          shippingAddress: {
            addressLine1,
            addressLine2,
            city,
            postalCode,
          },
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            selectedSize: item.selectedSize,
            quantity: item.quantity,
            price: item.price,
            image: item.images[0],
          })),
          subtotal: cartTotal,
          shippingFee,
          total: grandTotal,
        }),
      });

      const data = (await response.json()) as { error?: string; orderNumber?: string };
      if (!response.ok || !data.orderNumber) {
        throw new Error(data.error || 'Failed to place order');
      }

      setPlacedOrderNumber(data.orderNumber);
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          addressLine1,
          addressLine2,
          city,
          postalCode,
        })
      );
      clearCart();
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setPostalCode('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12">
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Secure checkout</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Checkout</h1>
      </header>

      {placedOrderNumber && (
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold text-emerald-900">Order placed successfully</h2>
          <p className="text-sm text-emerald-800 mt-1">
            Your order number is <span className="font-semibold">{placedOrderNumber}</span>.
          </p>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="border border-neutral-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="font-description text-neutral-600 mb-6">
            Add products to your cart before continuing to checkout.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-black text-white px-5 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="border border-neutral-200 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Contact details</h2>
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
              </div>
            </div>

            <div className="border border-neutral-200 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          </div>

          <aside className="border border-neutral-200 rounded-xl p-5 sm:p-6 h-fit lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold mb-4">Order summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex items-center gap-3 border-b border-neutral-200 pb-4"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500">Size: {item.selectedSize}</p>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{(item.price * item.quantity).toFixed(2)} BDT</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-6 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span>{cartTotal.toFixed(2)} BDT</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span>{shippingFee.toFixed(2)} BDT</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold pt-1">
                <span>Total</span>
                <span>{grandTotal.toFixed(2)} BDT</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-black text-white py-3 rounded-md hover:opacity-90 transition-opacity">
              {isSubmitting ? 'Placing order...' : 'Place order'}
            </button>
            {errorMessage && (
              <p className="text-sm text-red-600 mt-3" role="alert">
                {errorMessage}
              </p>
            )}
          </aside>
        </form>
      )}
    </section>
  );
}
