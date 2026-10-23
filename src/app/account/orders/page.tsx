'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
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

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs text-[#641C32] hover:underline font-bold uppercase tracking-wider mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Account
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal">
            Your Order History ({orders.length})
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#E8CFA8]/40 p-8 space-y-4">
            <Package className="w-12 h-12 text-[#E8CFA8] mx-auto" />
            <h3 className="font-serif text-2xl text-[#17151A]">No Orders Found</h3>
            <p className="text-xs text-[#17151A]/60 max-w-sm mx-auto">
              Your acquired pieces and tracking timeline will appear here once you place your first order.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3.5 bg-[#641C32] text-white text-xs font-bold uppercase tracking-widest rounded-2xl"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-6 rounded-3xl border border-[#E8CFA8]/40 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold font-mono text-base text-[#17151A]">
                      #{ord.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#641C32] text-white text-[10px] font-bold uppercase rounded-md">
                      {ord.status}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md">
                      Payment: {ord.paymentStatus}
                    </span>
                  </div>

                  <p className="text-xs text-[#17151A]/60">
                    Placed on {formatDateTime(ord.createdAt)} • {ord.items?.length || 0} unique pieces • {ord.paymentMethod}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {ord.items?.map((item: any) => (
                      <span key={item.id} className="text-[11px] bg-[#FFF9F3] px-2 py-1 rounded-lg border border-[#E8CFA8]/40 text-[#17151A]/80">
                        {item.title} (x{item.quantity})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-[#17151A]/50 uppercase tracking-wider block">Total Amount</span>
                    <span className="font-serif font-bold text-lg text-[#641C32]">
                      {formatPrice(ord.grandTotal)}
                    </span>
                  </div>

                  <Link
                    href={`/orders/${ord.orderNumber}`}
                    className="px-5 py-2.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Timeline & Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
