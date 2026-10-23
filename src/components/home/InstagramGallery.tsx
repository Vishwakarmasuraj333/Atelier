'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

export function InstagramGallery() {
  const feed = [
    { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', tag: '#AtelierWomen' },
    { image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', tag: '#SartorialLife' },
    { image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', tag: '#HorlogerieRoyale' },
    { image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80', tag: '#NuitVelours' },
    { image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', tag: '#HauteLeather' },
    { image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80', tag: '#MaisonEclat' },
  ];

  return (
    <section className="py-16 bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#641C32]">
            Social Impressions
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-[#17151A] font-normal mt-1">
            @AtelierEclat on Instagram
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {feed.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-[#E8CFA8]/30 shadow-xs"
            >
              <Image
                src={item.image}
                alt={item.tag}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#641C32]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                <Instagram className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold tracking-wider">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
