'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  Image as ImageIcon,
  Tag,
  Star,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo, AtelierEmblem } from '@/components/layout/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/account/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/account');
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetch('/api/admin/notifications')
        .then((res) => res.json())
        .then((data) => setUnreadCount(data.unreadCount || 0))
        .catch(console.error);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#17151A] flex items-center justify-center text-[#E8CFA8]">
        <span className="font-serif text-xl tracking-widest animate-pulse">
          AUTHENTICATING CONCIERGE ACCESS...
        </span>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products Catalog', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Orders & Pipeline', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Inventory & Logs', href: '/admin/inventory', icon: Boxes },
    { name: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
    { name: 'Customer Directory', href: '/admin/customers', icon: Users },
    { name: 'Banners & Hero', href: '/admin/banners', icon: ImageIcon },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Deep Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#121015] text-[#FFF9F3] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#17151A] border-b border-[#E8CFA8]/20">
        <Logo variant="admin" size="sm" />
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-white"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`${
          isMobileOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#17151A] border-r border-[#E8CFA8]/20 flex flex-col justify-between shrink-0 h-auto md:min-h-screen sticky top-0`}
      >
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-white/10">
            <Logo variant="admin" size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#641C32] text-white font-bold shadow-md shadow-[#641C32]/40'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E8CFA8]' : 'text-white/50'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Storefront Link */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-[#E8CFA8] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
          >
            <span>View Live Storefront</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/50 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-[#121015]">
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
