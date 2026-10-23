import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#641C32]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maison Domains</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#17151A] font-normal mt-2">
            Curated Categories
          </h1>
          <p className="text-xs md:text-sm text-[#17151A]/60 mt-2">
            Explore our distinct realms of haute tailoring, Swiss automatic horology, fine leathercraft, and niche olfactory creations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-[420px] rounded-3xl overflow-hidden border border-[#E8CFA8]/40 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-8 text-white"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                />
              )}

              {/* Gradient Shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#17151A]/95 via-[#17151A]/40 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8CFA8] font-bold">
                  {cat._count?.products || 0} Pieces Available
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-normal group-hover:text-[#E8CFA8] transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-[#FFF9F3]/70 line-clamp-2 leading-relaxed font-light">
                    {cat.description}
                  </p>
                )}

                <div className="pt-3 flex items-center justify-between text-xs uppercase tracking-wider font-bold text-[#E8CFA8] border-t border-white/15">
                  <span>Explore Portfolio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
