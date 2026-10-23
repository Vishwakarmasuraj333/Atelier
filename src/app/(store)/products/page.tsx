'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, X, ArrowUpDown, Loader2, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync with searchParams
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch Categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  // Fetch Products based on active filters
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (sortBy) params.set('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedCategory, searchQuery, minPrice, maxPrice, selectedBrand, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('');
    setSortBy('newest');
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(searchQuery) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(selectedBrand) ||
    sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-[#E8CFA8]/40 pb-8 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#641C32]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maison Collection</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#17151A] font-normal mt-2">
            {selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`
              : 'All Haute Masterpieces'}
          </h1>
          <p className="text-xs md:text-sm text-[#17151A]/60 mt-1 max-w-xl">
            Explore meticulously tailored virgin wool coats, pure mulberry silk gowns, Swiss automatic horology, and niche perfumes.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-4 py-2.5 bg-white border border-[#E8CFA8] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#17151A]"
            >
              <Filter className="w-3.5 h-3.5 text-[#641C32]" />
              <span>Filters</span>
            </button>
            <span className="text-xs text-[#17151A]/60 font-medium">
              Showing <strong className="text-[#17151A]">{products.length}</strong> creations
            </span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#17151A]/60 hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-[#E8CFA8] rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-[#17151A] outline-none focus:border-[#641C32]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-[#17151A]/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs text-[#17151A]/50 uppercase tracking-wider font-semibold">Active:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#641C32] text-white text-xs">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#641C32] text-white text-xs">
                Search: &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedBrand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#641C32] text-white text-xs">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#641C32] text-white text-xs">
                Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-[#641C32] hover:underline font-bold ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Main Grid & Filter Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-8 bg-white p-6 rounded-3xl border border-[#E8CFA8]/40 h-fit shadow-xs`}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 font-serif text-lg font-medium text-[#17151A]">
                <SlidersHorizontal className="w-4 h-4 text-[#641C32]" />
                <span>Refine Catalog</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-[#B83B5E] hover:underline font-medium"
              >
                Clear
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#17151A]">Categories</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-[#641C32] text-white font-bold' : 'text-[#17151A]/70 hover:bg-[#F4F1EF]'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full flex items-center justify-between text-left text-xs py-1.5 px-2 rounded-lg transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-[#641C32] text-white font-bold'
                        : 'text-[#17151A]/70 hover:bg-[#F4F1EF]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-60">({cat._count?.products || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#17151A]">Price Range ($)</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#17151A]">Maison & Brand</h4>
              <div className="space-y-1.5">
                {['Maison Éclat', 'Atelier Sartorial', 'Horlogerie Royale', 'Parfums d’Or', 'Studio Mineral'].map((b) => (
                  <label key={b} className="flex items-center gap-2 text-xs text-[#17151A]/80 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === b}
                      onChange={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                      className="accent-[#641C32]"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#641C32] animate-spin" />
                <p className="text-xs uppercase tracking-widest text-[#17151A]/50">Curating collection...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-[#E8CFA8]/40 p-8 space-y-4">
                <p className="font-serif text-2xl text-[#17151A]">No pieces found matching your criteria</p>
                <p className="text-xs text-[#17151A]/60 max-w-md mx-auto">
                  Try adjusting your price parameters, category filters, or search terms to discover our full collection.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-[#641C32] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#B83B5E] transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#641C32]" /></div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
