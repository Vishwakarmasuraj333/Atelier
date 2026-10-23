'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export function CustomerReviews() {
  const testimonials = [
    {
      name: 'Alexander Wright',
      location: 'Beverly Hills, CA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      productName: 'Bespoke Double-Breasted Wool Coat',
      rating: 5,
      review: 'The sheer weight and drape of the virgin Italian wool are extraordinary. Delivered in an embossed linen suit bag within 48 hours. Atelier Éclat is redefining modern luxury sartorial craft.',
    },
    {
      name: 'Elena Rostova',
      location: 'Geneva, Switzerland',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      productName: 'Aura Silk Charmeuse Bias-Cut Gown',
      rating: 5,
      review: 'The 22-momme silk catches the evening light with unmatched subtlety. Wore it to the Opera Garnier gala and received non-stop compliments. Flawless stitching and hand-rolled hems.',
    },
    {
      name: 'Lord Marcus Sterling',
      location: 'Mayfair, London',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      productName: 'Chronographe Imperial Rose Gold',
      rating: 5,
      review: 'The exhibition caseback and 72-hour power reserve rival historical horology houses that cost four times as much. An impeccable addition to any serious timepiece collection.',
    },
  ];

  return (
    <section className="py-20 bg-[#FFF9F3] border-t border-[#E8CFA8]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#641C32]">
            Client Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal mt-2">
            The Word of Connoisseurs
          </h2>
          <p className="text-xs text-[#17151A]/60 mt-2">
            Read verified reviews from patrons across London, Paris, Milan, and New York.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-[#E8CFA8]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-[#E8CFA8]/50 absolute top-6 right-6" />

              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-[#17151A]/80 leading-relaxed italic font-serif text-[13px]">
                  &ldquo;{t.review}&rdquo;
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-[#B83B5E] font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Client • {t.productName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 relative rounded-full overflow-hidden border border-[#E8CFA8]">
                  <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17151A]">{t.name}</h4>
                  <p className="text-[10px] text-[#17151A]/50">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
