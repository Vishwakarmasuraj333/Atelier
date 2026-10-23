'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count?: { products: number };
}

export function FeaturedCategories({ categories = [] }: { categories: CategoryItem[] }) {
  const displayCats = categories.length > 0 ? categories : [
    {
      id: '1',
      name: 'Women',
      slug: 'women',
      description: 'Haute couture & pure silk evening dresses',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '2',
      name: 'Men',
      slug: 'men',
      description: 'Italian tailored overcoats & bespoke blazers',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '3',
      name: 'Electronics & Watches',
      slug: 'electronics-watches',
      description: 'Swiss horology & rose gold automatic calibres',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '4',
      name: 'Beauty & Fragrance',
      slug: 'beauty',
      description: 'Smoked oud, Bulgarian rose & niche extrait',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '5',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Full-grain calfskin leather totes & belts',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '6',
      name: 'Shoes',
      slug: 'shoes',
      description: 'Hand-burnished Goodyear welted oxfords',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-20 bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#B83B5E] text-xs font-bold uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Distinctive Domains</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal mt-2">
              Featured Categories
            </h2>
          </div>

          <Link
            href="/categories"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-[#641C32] hover:text-[#B83B5E] inline-flex items-center gap-1.5 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCats.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-96 rounded-3xl overflow-hidden border border-[#E8CFA8]/40 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Background Image */}
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#17151A]/90 via-[#17151A]/30 to-transparent" />

              {/* Text Card Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-[#FFF9F3]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8CFA8] font-semibold">
                  Maison Collection
                </span>
                <h3 className="font-serif text-2xl font-normal text-white mt-1 group-hover:text-[#E8CFA8] transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-[#FFF9F3]/75 mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold tracking-wider uppercase text-[#E8CFA8]">
                  <span>Discover Pieces</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
