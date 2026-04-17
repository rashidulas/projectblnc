'use client';

import { FormEvent, useEffect, useState } from 'react';

interface AdminCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  updatedAt: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
  };
  items: Array<{
    id: string;
    name: string;
    selectedSize: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState('');

  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  const loadData = async () => {
    setIsLoadingData(true);
    setDataError('');
    try {
      const [customersResponse, ordersResponse] = await Promise.all([
        fetch('/api/admin/customers'),
        fetch('/api/admin/orders'),
      ]);

      if (!customersResponse.ok || !ordersResponse.ok) {
        throw new Error('Failed to load admin data');
      }

      const customersData = (await customersResponse.json()) as AdminCustomer[];
      const ordersData = (await ordersResponse.json()) as AdminOrder[];
      setCustomers(Array.isArray(customersData) ? customersData : []);
      const safeOrders = Array.isArray(ordersData) ? ordersData : [];
      setOrders(safeOrders);
      if (safeOrders.length > 0) {
        setSelectedOrderId((prev) =>
          prev && safeOrders.some((order) => order.id === prev) ? prev : safeOrders[0].id
        );
      } else {
        setSelectedOrderId(null);
      }
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Failed to load admin data');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/me');
        const data = (await response.json()) as { ok?: boolean };
        if (data.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoggingIn) return;
    setAuthError('');
    setIsLoggingIn(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setPassword('');
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setCustomers([]);
    setOrders([]);
    setSelectedOrderId(null);
  };

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

  const handleOrderStatusChange = async (orderId: string, nextStatus: AdminOrder['status']) => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    setDataError('');
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = (await response.json()) as { error?: string; status?: AdminOrder['status'] };
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order))
      );
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isAuthenticated === null) {
    return <div className="p-8 text-center text-neutral-600">Checking admin session...</div>;
  }

  if (!isAuthenticated) {
    return (
      <section className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Enter admin password to access customer and order data.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              required
              className="w-full border border-neutral-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
            />
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-black text-white py-3 rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
            {authError && (
              <p className="text-sm text-red-600" role="alert">
                {authError}
              </p>
            )}
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Admin</p>
          <h1 className="text-3xl font-bold mt-1">Customer & Order Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="border border-neutral-300 px-4 py-2 rounded-md hover:bg-neutral-100 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <p className="text-sm text-neutral-500">Saved customers</p>
          <p className="text-3xl font-bold mt-1">{customers.length}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <p className="text-sm text-neutral-500">Placed orders</p>
          <p className="text-3xl font-bold mt-1">{orders.length}</p>
        </div>
      </div>

      {isLoadingData && <p className="text-neutral-600 mb-6">Loading data...</p>}
      {dataError && (
        <p className="text-sm text-red-600 mb-6" role="alert">
          {dataError}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          {customers.length === 0 ? (
            <p className="text-sm text-neutral-500">No customers saved yet.</p>
          ) : (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {customers.map((customer) => (
                <div key={customer.id} className="border border-neutral-200 rounded-lg p-4">
                  <p className="font-semibold">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-sm text-neutral-600">{customer.email}</p>
                  <p className="text-sm text-neutral-600">{customer.phone}</p>
                  <p className="text-sm text-neutral-600 mt-1">
                    {customer.addressLine1}
                    {customer.addressLine2 ? `, ${customer.addressLine2}` : ''}, {customer.city},{' '}
                    {customer.postalCode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-neutral-500">No orders placed yet.</p>
          ) : (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`w-full text-left border rounded-lg p-4 transition-colors ${
                    selectedOrderId === order.id
                      ? 'border-black bg-neutral-50'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <span className="text-xs uppercase tracking-wide bg-neutral-100 px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-sm text-neutral-600">{order.customer.email}</p>
                  <p className="text-sm text-neutral-600 mt-1">Total: {order.total.toFixed(2)} BDT</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="mt-8 bg-white border border-neutral-200 rounded-xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-semibold">Order Details</h2>
              <p className="text-sm text-neutral-600 mt-1">
                {selectedOrder.orderNumber} - {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="order-status" className="text-sm text-neutral-600">
                Status
              </label>
              <select
                id="order-status"
                value={selectedOrder.status}
                disabled={isUpdatingStatus}
                onChange={(event) =>
                  handleOrderStatusChange(
                    selectedOrder.id,
                    event.target.value as AdminOrder['status']
                  )
                }
                className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Customer</h3>
              <p className="text-sm text-neutral-700">
                {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
              </p>
              <p className="text-sm text-neutral-600">{selectedOrder.customer.email}</p>
              <p className="text-sm text-neutral-600">{selectedOrder.customer.phone}</p>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm text-neutral-700">{selectedOrder.shippingAddress.addressLine1}</p>
              {selectedOrder.shippingAddress.addressLine2 && (
                <p className="text-sm text-neutral-700">{selectedOrder.shippingAddress.addressLine2}</p>
              )}
              <p className="text-sm text-neutral-700">
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <div className="mt-6 border border-neutral-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-neutral-600">
                      Size: {item.selectedSize} - Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{(item.price * item.quantity).toFixed(2)} BDT</p>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 mt-4 pt-3 space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>{selectedOrder.subtotal.toFixed(2)} BDT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span>{selectedOrder.shippingFee.toFixed(2)} BDT</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{selectedOrder.total.toFixed(2)} BDT</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
