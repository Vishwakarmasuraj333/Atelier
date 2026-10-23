'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Sparkles,
  Loader2,
  Package,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    brand: 'Maison Éclat',
    categoryId: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    stock: '',
    description: '',
    shortDesc: '',
    tags: '',
    isFeatured: false,
    imageUrl1: '',
    imageUrl2: '',
  });

  const fetchProducts = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`/api/products?limit=100&search=${encodeURIComponent(search)}`),
        fetch('/api/categories'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProducts(pData.products || []);
      setCategories(cData.categories || []);
      if (cData.categories?.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: cData.categories[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: `ATL-PROD-${Math.floor(100 + Math.random() * 900)}`,
      brand: 'Maison Éclat',
      categoryId: categories[0]?.id || '',
      price: '',
      comparePrice: '',
      costPrice: '',
      stock: '10',
      description: '',
      shortDesc: '',
      tags: '',
      isFeatured: false,
      imageUrl1: '',
      imageUrl2: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brand: product.brand,
      categoryId: product.categoryId,
      price: String(product.price),
      comparePrice: product.comparePrice ? String(product.comparePrice) : '',
      costPrice: product.costPrice ? String(product.costPrice) : '',
      stock: String(product.stock),
      description: product.description,
      shortDesc: product.shortDesc || '',
      tags: product.tags || '',
      isFeatured: product.isFeatured || false,
      imageUrl1: product.images[0]?.url || '',
      imageUrl2: product.images[1]?.url || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
    setFormData((prev) => ({ ...prev, name, slug: editingProduct ? prev.slug : slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    const images = [];
    if (formData.imageUrl1) images.push({ url: formData.imageUrl1, isPrimary: true, sortOrder: 0 });
    if (formData.imageUrl2) images.push({ url: formData.imageUrl2, isPrimary: false, sortOrder: 1 });
    if (images.length === 0) {
      images.push({
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        isPrimary: true,
        sortOrder: 0,
      });
    }

    const payload = {
      name: formData.name,
      slug: formData.slug,
      sku: formData.sku,
      brand: formData.brand,
      categoryId: formData.categoryId,
      price: parseFloat(formData.price),
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
      stock: parseInt(formData.stock, 10) || 0,
      description: formData.description,
      shortDesc: formData.shortDesc,
      tags: formData.tags,
      isFeatured: formData.isFeatured,
      images,
      variants: [],
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you certain you wish to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalog Operations</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Product Management
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Piece</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="flex items-center gap-4 bg-[#17151A] p-4 rounded-2xl border border-[#E8CFA8]/30">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or brand..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 outline-none focus:border-[#E8CFA8]"
          />
        </div>
        <span className="text-xs text-white/50">{products.length} products</span>
      </div>

      {/* Products Table */}
      <div className="bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-[#E8CFA8]">
              <tr>
                <th className="p-4">Piece</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-white/50">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#E8CFA8]" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-white/50">
                    No products found in catalog.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-14 relative rounded-xl overflow-hidden bg-gray-800 shrink-0">
                        {prod.images[0]?.url && (
                          <Image src={prod.images[0].url} alt="" fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white max-w-xs truncate">{prod.name}</h4>
                        <span className="text-[10px] text-[#B83B5E] font-semibold">{prod.brand}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-white/70">{prod.sku}</td>
                    <td className="p-4">{prod.category?.name || 'Unassigned'}</td>
                    <td className="p-4 font-serif font-bold text-white">{formatPrice(prod.price)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          prod.stock <= 3
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      {prod.isFeatured && (
                        <span className="px-2 py-0.5 bg-[#E8CFA8]/20 text-[#E8CFA8] text-[10px] font-bold rounded-md">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-[#E8CFA8] rounded-xl transition-colors"
                        title="Edit Piece"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-xl transition-colors"
                        title="Delete Piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#17151A] rounded-3xl border border-[#E8CFA8]/50 shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-serif text-xl font-normal text-white">
                {editingProduct ? 'Edit Haute Masterpiece' : 'Introduce New Creation'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-900/40 border border-red-500 text-red-200 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Bespoke Melton Coat"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Maison / Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#17151A] border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Compare Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Total Inventory Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl1}
                  onChange={(e) => setFormData({ ...formData, imageUrl1: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  Secondary Image URL (Hover Swap)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl2}
                  onChange={(e) => setFormData({ ...formData, imageUrl2: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-[#641C32]"
                />
                <label htmlFor="featured" className="text-white/80 font-medium">
                  Feature in Haute Highlights & Frontpage
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 text-white/70 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#641C32] hover:bg-[#B83B5E] text-white font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
