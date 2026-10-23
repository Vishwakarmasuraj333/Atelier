'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Instagram, Twitter, Facebook, Sparkles, Shield, Truck, RotateCcw } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#17151A] text-[#FFF9F3] pt-16 pb-12 border-t border-[#E8CFA8]/20">
      {/* Value Propositions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#FFF9F3]/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#641C32] flex items-center justify-center text-[#E8CFA8] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium tracking-wide">Artisanal Craftsmanship</h4>
              <p className="text-xs text-[#FFF9F3]/60 mt-1">
                Every piece is tailored using ethically sourced 22-momme silk and virgin Italian wool.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#641C32] flex items-center justify-center text-[#E8CFA8] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium tracking-wide">VIP White-Glove Shipping</h4>
              <p className="text-xs text-[#FFF9F3]/60 mt-1">
                Complimentary insured priority courier with signature delivery on orders over $300.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#641C32] flex items-center justify-center text-[#E8CFA8] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium tracking-wide">Bespoke Concierge Returns</h4>
              <p className="text-xs text-[#FFF9F3]/60 mt-1">
                Enjoy 30 days of seamless returns with our complimentary courier collection service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="footer" size="lg" />
            <p className="text-xs text-[#FFF9F3]/60 max-w-sm leading-relaxed pt-2">
              Elevating the everyday through timeless silhouettes, Swiss horology, and rare olfactory creations. Handcrafted in limited series for discerning connoisseurs.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h5 className="text-xs uppercase tracking-widest font-semibold text-[#E8CFA8] mb-2">
                Join The Private Salon
              </h5>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-[#E8CFA8] bg-[#641C32]/40 p-3 rounded-xl border border-[#E8CFA8]/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome to the Salon. Your exclusive code is LUXE20.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email for private salon access"
                    className="flex-1 px-4 py-2.5 bg-[#FFF9F3]/5 border border-[#FFF9F3]/20 rounded-xl text-xs text-white placeholder:text-[#FFF9F3]/40 outline-none focus:border-[#E8CFA8]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#641C32] hover:bg-[#B83B5E] text-[#FFF9F3] text-xs uppercase tracking-wider font-bold rounded-xl transition-all"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column: Collections */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold text-[#E8CFA8] mb-4">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-[#FFF9F3]/70">
              <li>
                <Link href="/products?category=women" className="hover:text-[#E8CFA8] transition-colors">
                  Haute Couture (Women)
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="hover:text-[#E8CFA8] transition-colors">
                  Sartorial Tailoring (Men)
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics-watches" className="hover:text-[#E8CFA8] transition-colors">
                  Swiss Horology Timepieces
                </Link>
              </li>
              <li>
                <Link href="/products?category=beauty" className="hover:text-[#E8CFA8] transition-colors">
                  Niche Extrait de Parfum
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-[#E8CFA8] transition-colors">
                  Full-Grain Leather Goods
                </Link>
              </li>
              <li>
                <Link href="/products?category=home" className="hover:text-[#E8CFA8] transition-colors">
                  Sculptural Living & Decor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Client Care */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold text-[#E8CFA8] mb-4">
              Client Concierge
            </h5>
            <ul className="space-y-2 text-xs text-[#FFF9F3]/70">
              <li>
                <Link href="/account/orders" className="hover:text-[#E8CFA8] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#E8CFA8] transition-colors">
                  Client Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#E8CFA8] transition-colors">
                  Saved Masterpieces
                </Link>
              </li>
              <li>
                <span className="text-[#FFF9F3]/50">White-Glove Delivery Guide</span>
              </li>
              <li>
                <span className="text-[#FFF9F3]/50">Authentication & Certificate</span>
              </li>
            </ul>
          </div>

          {/* Column: Admin & Social */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold text-[#E8CFA8] mb-4">
              Management
            </h5>
            <ul className="space-y-2 text-xs text-[#FFF9F3]/70">
              <li>
                <Link href="/admin/dashboard" className="text-[#E8CFA8] hover:underline font-semibold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="hover:text-[#E8CFA8] transition-colors">
                  Catalog Inventory
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="hover:text-[#E8CFA8] transition-colors">
                  Fulfillment Pipeline
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-[#E8CFA8] transition-colors">
                  Financial Analytics
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-[#FFF9F3]/10 flex items-center space-x-3 text-[#FFF9F3]/60">
              <a href="#" className="p-2 hover:text-[#E8CFA8] hover:bg-white/5 rounded-full transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 hover:text-[#E8CFA8] hover:bg-white/5 rounded-full transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 hover:text-[#E8CFA8] hover:bg-white/5 rounded-full transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Legal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#FFF9F3]/10 text-[11px] text-[#FFF9F3]/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Atelier Éclat Haute Société. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <span>Privacy Policy</span>
          <span>Terms of Sale</span>
          <span>Cookie Preferences</span>
          <span>Security Architecture</span>
        </div>
      </div>
    </footer>
  );
}
