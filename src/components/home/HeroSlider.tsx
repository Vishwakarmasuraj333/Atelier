'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  ctaText: string;
  ctaUrl: string;
}

export function HeroSlider({ initialBanners = [] }: { initialBanners?: BannerSlide[] }) {
  const slides = initialBanners.length > 0 ? initialBanners : [
    {
      id: '1',
      title: 'DEFINE YOUR EVERYDAY',
      subtitle: 'Bespoke silhouettes, rare materials, and timeless design curated for the modern connoisseur.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
      ctaText: 'EXPLORE COLLECTION',
      ctaUrl: '/products',
    },
    {
      id: '2',
      title: 'THE SUMMER SILK EDIT',
      subtitle: 'Effortless fluid dresses and fine gauge Italian knits for warm summer evenings.',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1920&q=80',
      ctaText: 'SHOP WOMEN',
      ctaUrl: '/products?category=women',
    },
    {
      id: '3',
      title: 'HAUTE HORLOGERIE',
      subtitle: 'Swiss precision movements housed in hand-finished rose gold cases.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80',
      ctaText: 'DISCOVER TIMEPIECES',
      ctaUrl: '/products?category=electronics-watches',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <section className="relative w-full h-[620px] md:h-[740px] bg-[#17151A] overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center scale-105 animate-pulse duration-[10000ms]"
          />
          {/* Luxury Vignette & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#17151A]/85 via-[#17151A]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17151A]/80 via-transparent to-[#17151A]/30" />
        </div>
      ))}

      {/* Floating Champagne Particles Decor */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-[#E8CFA8]/30 rounded-full blur-[1px] animate-bounce" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-[#E8CFA8]/40 rounded-full blur-[1px] animate-pulse" />
      </div>

      {/* Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#641C32]/60 backdrop-blur-md border border-[#E8CFA8]/40 text-[#E8CFA8] text-xs font-semibold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maison Atelier • Édit 2026</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#FFF9F3] tracking-tight leading-[1.08]">
            {active.title}
          </h1>

          <p className="text-sm sm:text-base text-[#FFF9F3]/80 font-light leading-relaxed max-w-xl">
            {active.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={active.ctaUrl}
              className="px-8 py-4 bg-[#641C32] hover:bg-[#B83B5E] text-[#FFF9F3] text-xs font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-[#641C32]/50 transition-all flex items-center gap-2 group"
            >
              <span>{active.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/categories"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#FFF9F3] border border-white/20 text-xs font-semibold uppercase tracking-[0.2em] rounded-2xl transition-all"
            >
              Explore Lookbook
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center space-x-4">
        {/* Navigation Dots */}
        <div className="flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-[#E8CFA8]' : 'w-2 bg-white/30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-black/40 hover:bg-[#641C32] text-white border border-white/10 backdrop-blur-md transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-black/40 hover:bg-[#641C32] text-white border border-white/10 backdrop-blur-md transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
