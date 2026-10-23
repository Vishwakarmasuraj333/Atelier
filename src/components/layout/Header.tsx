'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  Shield,
  Package,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Logo } from '@/components/layout/Logo';

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItems, openDrawer } = useCart();
  const { totalWishlist } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  const megaMenuData = [
    {
      title: 'Women',
      href: '/products?category=women',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      featuredText: 'Silk Evening Gowns & Mulberry Charmeuse',
      subcategories: [
        { name: 'Haute Couture Dresses', href: '/products?category=women' },
        { name: 'Pure Cashmere Knitwear', href: '/products?category=women' },
        { name: 'Silk Blouses & Camisoles', href: '/products?category=women' },
        { name: 'Tailored Trousers', href: '/products?category=women' },
      ],
    },
    {
      title: 'Men',
      href: '/products?category=men',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
      featuredText: 'Bespoke Melton Wool & Hand-Tailored Suiting',
      subcategories: [
        { name: 'Overcoats & Trench Coats', href: '/products?category=men' },
        { name: 'Goodyear Oxford Shoes', href: '/products?category=shoes' },
        { name: 'Italian Merino Knitwear', href: '/products?category=men' },
        { name: 'Sartorial Blazers', href: '/products?category=men' },
      ],
    },
    {
      title: 'Horology & Audio',
      href: '/products?category=electronics-watches',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      featuredText: 'Swiss Automatic Movements & Rose Gold',
      subcategories: [
        { name: 'Automatic Chronographs', href: '/products?category=electronics-watches' },
        { name: 'Sapphire Casebacks', href: '/products?category=electronics-watches' },
        { name: 'Artisanal Acoustics', href: '/products?category=electronics-watches' },
        { name: 'Horology Accessories', href: '/products?category=electronics-watches' },
      ],
    },
    {
      title: 'Fragrance & Beauty',
      href: '/products?category=beauty',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
      featuredText: 'Niche Extrait de Parfum & Rare Botanicals',
      subcategories: [
        { name: 'Extrait de Parfum (100ml)', href: '/products?category=beauty' },
        { name: 'Smoked Oud & Damask Rose', href: '/products?category=beauty' },
        { name: 'Restorative Serums', href: '/products?category=beauty' },
        { name: 'Artisanal Bath Elixirs', href: '/products?category=beauty' },
      ],
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFF9F3]/95 backdrop-blur-md shadow-xs border-b border-[#E8CFA8]/40 py-3'
            : 'bg-[#FFF9F3] border-b border-[#E8CFA8]/20 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#17151A] hover:text-[#641C32] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Logo variant="header" size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              <Link
                href="/products"
                className="text-xs uppercase tracking-widest font-medium text-[#17151A] hover:text-[#641C32] transition-colors"
              >
                Collection
              </Link>

              {megaMenuData.map((menu) => (
                <div
                  key={menu.title}
                  className="relative group"
                  onMouseEnter={() => setActiveMegaMenu(menu.title)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={menu.href}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-medium text-[#17151A] group-hover:text-[#641C32] transition-colors py-2"
                  >
                    <span>{menu.title}</span>
                    <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {activeMegaMenu === menu.title && (
                    <div className="absolute top-full -left-20 w-[520px] bg-[#FFF9F3] border border-[#E8CFA8]/50 shadow-2xl rounded-2xl p-6 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div>
                        <h4 className="text-[11px] uppercase tracking-widest text-[#641C32] font-bold pb-2 border-b border-[#E8CFA8]/40 mb-3">
                          Curated Silhouettes
                        </h4>
                        <ul className="space-y-2.5">
                          {menu.subcategories.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                className="text-xs text-[#17151A]/80 hover:text-[#641C32] hover:translate-x-1 inline-block transition-all"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-[#E8CFA8]/30">
                          <Link
                            href={menu.href}
                            className="text-[11px] font-bold text-[#641C32] hover:underline uppercase tracking-wider"
                          >
                            Explore All {menu.title} &rarr;
                          </Link>
                        </div>
                      </div>

                      <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-gray-100 group/img">
                        <Image
                          src={menu.image}
                          alt={menu.title}
                          fill
                          sizes="240px"
                          className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#17151A]/80 via-transparent to-transparent flex items-end p-4">
                          <p className="text-xs font-serif text-[#FFF9F3] italic leading-snug">
                            {menu.featuredText}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/categories"
                className="text-xs uppercase tracking-widest font-medium text-[#17151A] hover:text-[#641C32] transition-colors"
              >
                Categories
              </Link>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-3 md:space-x-5">
              {/* Instant Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#17151A] hover:text-[#641C32] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[#17151A] hover:text-[#641C32] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalWishlist > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B83B5E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalWishlist}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openDrawer}
                className="relative p-2 text-[#17151A] hover:text-[#641C32] transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#641C32] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-1.5 p-2 text-[#17151A] hover:text-[#641C32] transition-colors"
                  aria-label="Account Menu"
                >
                  <UserIcon className="w-5 h-5" />
                  {user && (
                    <span className="hidden md:inline text-xs font-medium text-[#17151A] max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  )}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E8CFA8]/50 shadow-xl rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {user ? (
                      <div className="space-y-1">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-[#17151A] truncate">{user.name}</p>
                          <p className="text-[11px] text-[#17151A]/60 truncate">{user.email}</p>
                          {user.role === 'ADMIN' && (
                            <span className="mt-1 inline-block px-2 py-0.5 bg-[#641C32] text-[#FFF9F3] text-[9px] font-bold uppercase rounded-full">
                              Admin Access
                            </span>
                          )}
                        </div>

                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#641C32] hover:bg-[#641C32]/10 rounded-xl transition-colors"
                          >
                            <Shield className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}

                        <Link
                          href="/account"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F4F1EF] rounded-xl transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-[#641C32]" /> My Account
                        </Link>

                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F4F1EF] rounded-xl transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#641C32]" /> Order History
                        </Link>

                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 space-y-2">
                        <Link
                          href="/account/login"
                          className="block w-full py-2 bg-[#641C32] text-[#FFF9F3] text-center text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#491424] transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/account/register"
                          className="block w-full py-2 border border-[#E8CFA8] text-center text-xs font-semibold uppercase tracking-wider text-[#17151A] rounded-xl hover:bg-[#F4F1EF] transition-colors"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8CFA8]/40 bg-[#FFF9F3] p-6 space-y-5 animate-in slide-in-from-top duration-300">
            <div className="space-y-3">
              <Link
                href="/products"
                className="block text-sm uppercase tracking-wider font-semibold text-[#17151A]"
              >
                All Products
              </Link>
              {megaMenuData.map((m) => (
                <Link
                  key={m.title}
                  href={m.href}
                  className="block text-sm uppercase tracking-wider text-[#17151A]/80 hover:text-[#641C32]"
                >
                  {m.title}
                </Link>
              ))}
              <Link
                href="/categories"
                className="block text-sm uppercase tracking-wider text-[#17151A]/80 hover:text-[#641C32]"
              >
                Categories
              </Link>
              <Link
                href="/wishlist"
                className="block text-sm uppercase tracking-wider text-[#17151A]/80 hover:text-[#641C32]"
              >
                Wishlist ({totalWishlist})
              </Link>
            </div>

            <div className="pt-4 border-t border-[#E8CFA8]/40 flex gap-2">
              <Link
                href="/account/login"
                className="flex-1 py-2.5 bg-[#641C32] text-[#FFF9F3] text-center text-xs uppercase font-bold rounded-xl"
              >
                Account
              </Link>
              <Link
                href="/admin/dashboard"
                className="flex-1 py-2.5 border border-[#641C32] text-[#641C32] text-center text-xs uppercase font-bold rounded-xl"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
