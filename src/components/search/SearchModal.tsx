'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#17151A]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full bg-[#FFF9F3] border-b border-[#E8CFA8]/40 shadow-2xl p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-6 border-b border-[#17151A]/10">
            <div className="flex items-center space-x-3 w-full">
              <Search className="w-6 h-6 text-[#641C32]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cashmere, timepieces, gowns, leather..."
                className="w-full text-xl md:text-2xl font-serif text-[#17151A] bg-transparent outline-none placeholder:text-[#17151A]/30"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#17151A]/60 hover:text-[#641C32] rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Trending Searches */}
          {!query && (
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#641C32]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trending In Haute Couture</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Silk Evening Gown',
                  'Swiss Automatic Watch',
                  'Melton Wool Coat',
                  'Saddle Leather Tote',
                  'Travertine Lamp',
                  'Nuit Velours Parfum',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 rounded-full border border-[#E8CFA8] text-xs font-medium text-[#17151A] hover:bg-[#641C32] hover:text-[#FFF9F3] hover:border-[#641C32] transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Search Results */}
          {isLoading ? (
            <div className="py-12 flex justify-center items-center text-[#641C32]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : query && results.length > 0 ? (
            <div className="pt-6">
              <div className="text-xs uppercase tracking-widest text-[#17151A]/50 font-medium mb-4">
                Found {results.length} Curated Masterpieces
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-[#E8CFA8] hover:bg-[#F4F1EF] transition-all group"
                  >
                    <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {product.images[0]?.url && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#B83B5E] font-medium">
                        {product.brand}
                      </span>
                      <h4 className="text-sm font-medium text-[#17151A] truncate group-hover:text-[#641C32] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm font-bold text-[#641C32] mt-0.5">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#17151A]/20 group-hover:text-[#641C32] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#641C32] hover:underline"
                >
                  View All Search Results <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : query && !isLoading ? (
            <div className="py-10 text-center text-[#17151A]/60">
              <p className="font-serif text-lg">No products found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#17151A]/40 mt-1">Try searching for &apos;dress&apos;, &apos;watch&apos;, or &apos;coat&apos;</p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
