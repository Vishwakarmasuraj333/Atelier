'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag, DollarSign, Sparkles, Loader2 } from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patron Relations</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Client Directory ({customers.length})
          </h1>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-[#E8CFA8]">
              <tr>
                <th className="p-4">Client Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#E8CFA8]" />
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#641C32] text-white font-serif flex items-center justify-center font-bold text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white text-sm">{c.name}</span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="flex items-center gap-1.5 text-white/80">
                        <Mail className="w-3 h-3 text-[#E8CFA8]" /> {c.email}
                      </p>
                      {c.phone && (
                        <p className="flex items-center gap-1.5 text-white/50 text-[11px]">
                          <Phone className="w-3 h-3 text-[#E8CFA8]" /> {c.phone}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-white/60">{formatDateTime(c.createdAt)}</td>
                    <td className="p-4 font-bold text-white">{c.ordersCount} orders</td>
                    <td className="p-4 font-serif font-bold text-[#E8CFA8] text-sm">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {c.isActive ? 'Active Patron' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
