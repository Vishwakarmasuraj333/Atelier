'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Timer, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function FlashSale({ product }: { product?: any }) {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProduct = product || {
    id: 'flash-prod',
    name: 'Chronographe Imperial Rose Gold Timepiece',
    slug: 'chronographe-imperial-rose-gold-timepiece',
    brand: 'Horlogerie Royale',
    price: 2450,
    comparePrice: 2890,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80',
    description: 'Swiss certified automatic calibre with sapphire exhibition back and hand-stitched alligator strap. Strictly limited flash offering.',
  };

  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async () => {
    setIsAdding(true);
    await addToCart(flashProduct.id);
    setIsAdding(false);
  };

  return (
    <section className="py-16 bg-[#641C32] text-[#FFF9F3] relative overflow-hidden">
      {/* Decorative luxury patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B83B5E]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17151A]/90 backdrop-blur-md rounded-3xl border border-[#E8CFA8]/40 p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image View */}
            <div className="lg:col-span-6 relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900">
              <Image
                src={flashProduct.image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80'}
                alt={flashProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#641C32] text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-lg border border-[#E8CFA8]/50 shadow-md">
                Flash Salon Special • Save $440
              </div>
            </div>

            {/* Right Product Details and Live Countdown */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
                <Timer className="w-4 h-4 text-[#B83B5E] animate-pulse" />
                <span>Limited Window Private Offer</span>
              </div>

              <h3 className="font-serif text-2xl md:text-4xl font-normal text-white leading-tight">
                {flashProduct.name}
              </h3>

              <p className="text-xs text-[#FFF9F3]/70 leading-relaxed max-w-lg">
                {flashProduct.description}
              </p>

              {/* Countdown Clocks */}
              <div className="flex items-center gap-3 pt-2">
                {[
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center w-20 h-20 bg-[#FFF9F3]/10 border border-[#E8CFA8]/30 rounded-2xl"
                  >
                    <span className="font-serif text-2xl font-bold text-[#E8CFA8]">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#FFF9F3]/60">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price & Action */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-xs text-gray-400 line-through block">
                    {formatPrice(flashProduct.comparePrice)}
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#E8CFA8]">
                    {formatPrice(flashProduct.price)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleQuickAdd}
                    disabled={isAdding}
                    className="px-6 py-3.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAdding ? 'Adding...' : 'Acquire Now'}</span>
                  </button>

                  <Link
                    href={`/product/${flashProduct.slug}`}
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-2xl border border-white/10 transition-all"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
