'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';

interface TrendingProductsProps {
  products: any[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  return (
    <section className="py-20 bg-[#FFF9F3] border-t border-[#E8CFA8]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#641C32] text-xs font-bold uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal mt-2">
              Trending Masterpieces
            </h2>
            <p className="text-xs text-[#17151A]/60 mt-1 max-w-lg">
              The season’s most coveted high-jewelry, bespoke cashmere, and limited-edition perfumery.
            </p>
          </div>

          <Link
            href="/products"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-[#641C32] hover:text-[#B83B5E] inline-flex items-center gap-1.5 group"
          >
            <span>Explore All Pieces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
