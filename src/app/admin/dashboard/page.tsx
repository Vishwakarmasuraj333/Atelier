'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { LuxuryAreaChart, LuxuryDonutChart } from '@/components/admin/Charts';

const COLORS = ['#641C32', '#B83B5E', '#E8CFA8', '#D4AF37', '#8E889B', '#4A2E18'];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (isLoading || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-[#E8CFA8] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#FFF9F3]/60">
          Aggregating Real Database Metrics...
        </p>
      </div>
    );
  }

  const { metrics, chartData, categoryData, topProducts, recentOrders } = data;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Overview</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Maison Analytics Dashboard
          </h1>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2 bg-[#17151A] p-1.5 rounded-2xl border border-[#E8CFA8]/30">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: '1y', label: '1 Year' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeRange === t.id
                  ? 'bg-[#641C32] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="p-6 bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">Total Revenue</span>
            <div className="p-2.5 bg-[#641C32]/30 rounded-2xl text-[#E8CFA8]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-3xl font-bold text-white">
              {formatPrice(metrics.totalRevenue)}
            </h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Real database verified revenue
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">Total Orders</span>
            <div className="p-2.5 bg-[#B83B5E]/30 rounded-2xl text-[#B83B5E]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-3xl font-bold text-white">
              {metrics.totalOrders}
            </h3>
            <p className="text-[11px] text-white/60">
              Avg Value: {formatPrice(metrics.averageOrderValue)}
            </p>
          </div>
        </div>

        {/* Active Customers */}
        <div className="p-6 bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">Patron Accounts</span>
            <div className="p-2.5 bg-[#E8CFA8]/20 rounded-2xl text-[#E8CFA8]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-3xl font-bold text-white">
              {metrics.totalCustomers}
            </h3>
            <p className="text-[11px] text-white/60">Registered clientele</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">Low Stock Alerts</span>
            <div className="p-2.5 bg-amber-500/20 rounded-2xl text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-3xl font-bold text-white">
              {metrics.lowStockCount}
            </h3>
            <Link href="/admin/inventory" className="text-[11px] text-amber-400 hover:underline">
              Inspect inventory logs &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Growth Trend Area Chart */}
        <div className="lg:col-span-8 bg-[#17151A] p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-normal text-white">Revenue Timeline</h3>
              <p className="text-xs text-white/60">Real transaction volume over the selected window</p>
            </div>
            <span className="text-xs bg-[#641C32]/40 text-[#E8CFA8] px-3 py-1 rounded-full font-bold border border-[#E8CFA8]/30">
              Live DB Telemetry
            </span>
          </div>

          <LuxuryAreaChart data={chartData} />
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="lg:col-span-4 bg-[#17151A] p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-normal text-white">Sales by Category</h3>
            <p className="text-xs text-white/60">Volume share across luxury departments</p>
          </div>

          <LuxuryDonutChart data={categoryData} />

          <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
            {categoryData.slice(0, 4).map((c: any, idx: number) => (
              <div key={c.name} className="flex items-center justify-between text-white/80">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span>{c.name}</span>
                </div>
                <span className="font-bold text-white">${c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Masterpieces */}
        <div className="bg-[#17151A] p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-serif text-xl font-normal text-white">Top Performing Pieces</h3>
            <Link href="/admin/products" className="text-xs text-[#E8CFA8] hover:underline">
              View Catalog &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 relative rounded-xl overflow-hidden bg-gray-800 shrink-0">
                    {p.images[0]?.url && <Image src={p.images[0].url} alt="" fill sizes="48px" className="object-cover" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]">{p.name}</h4>
                    <span className="text-[10px] text-[#E8CFA8] uppercase font-semibold">{p.category?.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-sm text-[#E8CFA8] block">{formatPrice(p.price)}</span>
                  <span className="text-[10px] text-white/50">{p.stock} units in stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Stream */}
        <div className="bg-[#17151A] p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-serif text-xl font-normal text-white">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-[#E8CFA8] hover:underline">
              Fulfillment &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((ord: any) => (
              <div key={ord.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">#{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 bg-[#641C32] text-[10px] font-bold uppercase rounded-md text-white">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">
                    {ord.user?.name || 'Guest'} • {formatDateTime(ord.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-sm text-[#E8CFA8] block">
                    {formatPrice(ord.grandTotal)}
                  </span>
                  <Link href={`/admin/orders`} className="text-[11px] text-[#E8CFA8] hover:underline">
                    Process &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
