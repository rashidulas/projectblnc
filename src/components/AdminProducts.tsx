'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { Product } from '@/data/products';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'];
const CATEGORY_OPTIONS = ['Hoodies', 'Pants', 'T-Shirts', 'Sweats'];
const DEFAULT_STOCK = 10;

interface ProductForm {
  id?: string;
  name: string;
  category: string;
  price: string;
  description: string;
  previewImage: string;
  images: string;
  modelImages: string;
  video: string;
  sizes: string[];
  stock: Record<string, number>;
}

function emptyForm(): ProductForm {
  return {
    name: '',
    category: 'Hoodies',
    price: '',
    description: '',
    previewImage: '',
    images: '',
    modelImages: '',
    video: '',
    sizes: [...SIZE_OPTIONS],
    stock: Object.fromEntries(SIZE_OPTIONS.map((s) => [s, DEFAULT_STOCK])),
  };
}

function toForm(p: Product): ProductForm {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: String(p.price),
    description: p.description,
    previewImage: p.previewImage ?? '',
    images: (p.images ?? []).join('\n'),
    modelImages: (p.modelImages ?? []).join('\n'),
    video: p.video ?? '',
    sizes: p.sizes ?? [],
    stock: { ...Object.fromEntries((p.sizes ?? []).map((s) => [s, DEFAULT_STOCK])), ...(p.stock ?? {}) },
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(form.id);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = (await res.json()) as Product[];
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm());
    setError('');
  };

  const toggleSize = (size: string) => {
    setForm((f) => {
      const has = f.sizes.includes(size);
      const sizes = has ? f.sizes.filter((s) => s !== size) : [...f.sizes, size];
      const stock = { ...f.stock };
      if (!has && stock[size] == null) stock[size] = DEFAULT_STOCK;
      return { ...f, sizes, stock };
    });
  };

  const setStock = (size: string, value: string) => {
    const n = Math.max(0, Number(value) || 0);
    setForm((f) => ({ ...f, stock: { ...f.stock, [size]: n } }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const imageList = form.images.split('\n').map((s) => s.trim()).filter(Boolean);
      const modelList = form.modelImages.split('\n').map((s) => s.trim()).filter(Boolean);
      const preview = form.previewImage.trim() || imageList[0] || '';
      const finalImages = imageList.length ? imageList : preview ? [preview] : [];
      const payload = {
        id: form.id,
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        description: form.description.trim(),
        previewImage: preview || undefined,
        images: finalImages,
        modelImages: modelList.length ? modelList : finalImages,
        video: form.video.trim() || undefined,
        sizes: form.sizes,
        stock: Object.fromEntries(form.sizes.map((s) => [s, form.stock[s] ?? DEFAULT_STOCK])),
      };

      if (!payload.name || !payload.description || Number.isNaN(payload.price) || !finalImages.length) {
        throw new Error('Name, price, description, and at least one image are required.');
      }

      const res = await fetch(
        isEditing ? `/api/admin/products/${form.id}` : '/api/admin/products',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Save failed');
      resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || 'Delete failed');
      }
      if (form.id === id) resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const inputCls =
    'w-full border border-neutral-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-700/30 bg-white';

  return (
    <div className="mt-10 bg-neutral-50 border border-neutral-200 rounded-xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <button
          onClick={load}
          className="border border-neutral-300 px-3 py-1.5 rounded-md text-sm hover:bg-neutral-100 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>}

      {/* Add / Edit form card */}
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-5 mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            {isEditing ? `Edit: ${form.name || form.id}` : 'Add a product'}
          </h3>
          {isEditing && (
            <button type="button" onClick={resetForm} className="text-sm text-neutral-500 hover:text-neutral-900">
              + New instead
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="block text-neutral-600 mb-1">Name</span>
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-600 mb-1">Category</span>
            <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-neutral-600 mb-1">Price (BDT)</span>
            <input className={inputCls} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-600 mb-1">Preview image path</span>
            <input className={inputCls} placeholder="/models/hoodies/.../1.webp" value={form.previewImage} onChange={(e) => setForm({ ...form, previewImage: e.target.value })} />
          </label>
        </div>

        <label className="text-sm block">
          <span className="block text-neutral-600 mb-1">Description</span>
          <textarea className={inputCls} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm block">
            <span className="block text-neutral-600 mb-1">Image paths (one per line)</span>
            <textarea className={inputCls} rows={2} placeholder={'/models/.../1.webp\n/models/.../2.webp'} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          </label>
          <label className="text-sm block">
            <span className="block text-neutral-600 mb-1">Model image paths (optional)</span>
            <textarea className={inputCls} rows={2} value={form.modelImages} onChange={(e) => setForm({ ...form, modelImages: e.target.value })} />
          </label>
        </div>

        {/* Sizes + per-size stock */}
        <div>
          <span className="block text-neutral-600 text-sm mb-2">Sizes & stock (pcs)</span>
          <div className="flex flex-wrap gap-3">
            {SIZE_OPTIONS.map((size) => {
              const active = form.sizes.includes(size);
              return (
                <div key={size} className={`flex items-center gap-2 border rounded-md px-3 py-2 ${active ? 'border-neutral-800 bg-white' : 'border-neutral-200 bg-neutral-100 opacity-60'}`}>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="checkbox" checked={active} onChange={() => toggleSize(size)} />
                    <span className="font-medium w-6">{size}</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={!active}
                    value={active ? (form.stock[size] ?? DEFAULT_STOCK) : ''}
                    onChange={(e) => setStock(size, e.target.value)}
                    className="w-16 border border-neutral-300 rounded px-2 py-1 text-sm disabled:bg-neutral-100"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={saving} className="bg-neutral-900 text-neutral-50 px-5 py-2.5 rounded-md text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
            {saving ? 'Saving…' : isEditing ? 'Update product' : 'Add product'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="text-sm text-neutral-500 hover:text-neutral-900">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      {loading ? (
        <p className="text-neutral-600 text-sm">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-neutral-500 text-sm">No products yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border border-neutral-200 rounded-lg p-3 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.previewImage || p.images?.[0]} alt={p.name} className="w-14 h-20 object-cover rounded bg-neutral-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-sm text-neutral-500">{p.category} · {p.price} BDT</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(p.sizes ?? []).map((s) => (
                    <span key={s} className="text-[11px] border border-neutral-200 rounded px-1.5 py-0.5 text-neutral-600">
                      {s}·{p.stock?.[s] ?? DEFAULT_STOCK}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => { setForm(toForm(p)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="border border-neutral-300 px-3 py-1 rounded text-sm hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id, p.name)} className="border border-red-200 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
