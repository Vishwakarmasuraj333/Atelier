'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  Heart,
  MapPin,
  Shield,
  LogOut,
  ChevronRight,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function AccountDashboard() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account/login');
      return;
    }

    if (user) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFF9F3]">
        <Loader2 className="w-10 h-10 text-[#641C32] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="bg-white p-8 rounded-3xl border border-[#E8CFA8]/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#641C32] text-[#FFF9F3] font-serif text-2xl flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl md:text-3xl text-[#17151A] font-normal">
                  Welcome, {user.name}
                </h1>
                {user.role === 'ADMIN' && (
                  <span className="px-2.5 py-0.5 bg-[#641C32] text-white text-[10px] font-bold uppercase rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[#17151A]/60 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin/dashboard"
                className="px-5 py-2.5 bg-[#641C32] hover:bg-[#491424] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md transition-colors"
              >
                <Shield className="w-4 h-4" /> Admin Portal
              </Link>
            )}
            <button
              onClick={logout}
              className="px-5 py-2.5 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="p-6 bg-white rounded-3xl border border-[#E8CFA8]/40 shadow-xs hover:shadow-lg transition-all group flex items-start gap-4"
          >
            <div className="p-3.5 bg-[#641C32]/10 rounded-2xl text-[#641C32]">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-medium text-[#17151A] group-hover:text-[#641C32] transition-colors">
                Order History
              </h3>
              <p className="text-xs text-[#17151A]/60 mt-1">
                Track status and review invoices for {orders.length} orders.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/wishlist"
            className="p-6 bg-white rounded-3xl border border-[#E8CFA8]/40 shadow-xs hover:shadow-lg transition-all group flex items-start gap-4"
          >
            <div className="p-3.5 bg-[#B83B5E]/10 rounded-2xl text-[#B83B5E]">
              <Heart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-medium text-[#17151A] group-hover:text-[#641C32] transition-colors">
                Saved Wishlist
              </h3>
              <p className="text-xs text-[#17151A]/60 mt-1">
                Inspect items curated for future acquisition.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/products"
            className="p-6 bg-white rounded-3xl border border-[#E8CFA8]/40 shadow-xs hover:shadow-lg transition-all group flex items-start gap-4"
          >
            <div className="p-3.5 bg-[#E8CFA8]/40 rounded-2xl text-[#17151A]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-medium text-[#17151A] group-hover:text-[#641C32] transition-colors">
                Maison Catalog
              </h3>
              <p className="text-xs text-[#17151A]/60 mt-1">
                Discover the latest 2026 Haute Edition arrivals.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/40 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-serif text-xl font-normal text-[#17151A]">
              Recent Orders
            </h3>
            <Link
              href="/account/orders"
              className="text-xs font-bold text-[#641C32] hover:underline uppercase tracking-wider"
            >
              View All ({orders.length}) &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-[#17151A]/60 py-6 text-center">
              You haven&apos;t placed any orders yet.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF9F3] border border-[#E8CFA8]/30 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#17151A] font-mono text-sm">
                        #{ord.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 bg-[#641C32] text-white text-[10px] font-bold uppercase rounded-md">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#17151A]/60">
                      {formatDateTime(ord.createdAt)} • {ord.items?.length || 0} pieces
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-serif font-bold text-sm text-[#641C32]">
                      {formatPrice(ord.grandTotal)}
                    </span>
                    <Link
                      href={`/orders/${ord.orderNumber}`}
                      className="px-4 py-2 bg-white border border-[#E8CFA8] text-[#17151A] hover:bg-[#641C32] hover:text-white rounded-xl font-semibold transition-all"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
