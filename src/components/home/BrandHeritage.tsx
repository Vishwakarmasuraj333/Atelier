'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Award, Globe, Gem } from 'lucide-react';

export function BrandHeritage() {
  return (
    <section className="py-24 bg-[#17151A] text-[#FFF9F3] relative overflow-hidden border-y border-[#E8CFA8]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Large Portrait Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[#E8CFA8]/30 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
                alt="Sartorial artisan cutting melton wool"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[#E8CFA8]/30 shadow-2xl mt-8">
              <Image
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
                alt="Mulberry silk drape texture"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Brand Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Atelier Heritage</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-tight text-white">
              BORN IN PARIS. <br />
              <span className="gold-gradient-text italic font-serif">PERFECTED FOR TIME.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#FFF9F3]/70 leading-relaxed">
              Founded on the belief that true luxury lies in uncompromising materials, quiet distinction, and deliberate craft. We work directly with fifth-generation fabric mills in Biella, master horologists in Le Locle, and perfume composers in Grasse to produce numbered, limited collections.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#E8CFA8]">
                  <Gem className="w-4 h-4" />
                  <span className="font-serif text-xl font-bold text-white">100%</span>
                </div>
                <p className="text-[11px] text-[#FFF9F3]/60">Pure 22-Momme Mulberry Silk & Grade-A Cashmere</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#E8CFA8]">
                  <Globe className="w-4 h-4" />
                  <span className="font-serif text-xl font-bold text-white">35+</span>
                </div>
                <p className="text-[11px] text-[#FFF9F3]/60">Countries with White-Glove VIP Express Delivery</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all"
              >
                <span>Read The Manifesto</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
