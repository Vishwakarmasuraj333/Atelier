'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, ArrowRight } from 'lucide-react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#641C32] text-[#FFF9F3] text-xs py-2.5 px-4 tracking-wider uppercase border-b border-[#E8CFA8]/30 transition-all duration-300 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-[#E8CFA8]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-medium text-[11px]">Complimentary Express Delivery Over $300</span>
        </div>

        <div className="flex-1 text-center font-serif md:text-xs text-[11px] font-medium tracking-widest">
          <span>HAUTE SAISON ÉDITION — ENJOY 20% OFF WITH CODE </span>
          <Link href="/products" className="font-bold underline text-[#E8CFA8] hover:text-white ml-1 inline-flex items-center gap-1">
            LUXE20 <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="hidden lg:inline-block text-[10px] text-[#E8CFA8] hover:underline uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded">
            Admin Portal
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="text-[#E8CFA8]/70 hover:text-white p-0.5 transition-colors"
            aria-label="Close announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
