'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LuxuryBarChart } from '@/components/admin/Charts';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics?range=1y')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-[#E8CFA8] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#FFF9F3]/60">
          Aggregating Financial Metrics...
        </p>
      </div>
    );
  }

  const { metrics, chartData } = data;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Financial Telemetry</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Deep Commercial Analytics
          </h1>
        </div>
      </div>

      {/* Advanced KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#17151A] p-6 rounded-3xl border border-[#E8CFA8]/30 space-y-2">
          <span className="text-xs uppercase text-white/50 font-bold">Total Gross Revenue</span>
          <h3 className="font-serif text-3xl font-bold text-white">{formatPrice(metrics.totalRevenue)}</h3>
          <p className="text-[11px] text-emerald-400">100% Real-time database aggregated</p>
        </div>

        <div className="bg-[#17151A] p-6 rounded-3xl border border-[#E8CFA8]/30 space-y-2">
          <span className="text-xs uppercase text-white/50 font-bold">Average Order Value (AOV)</span>
          <h3 className="font-serif text-3xl font-bold text-white">{formatPrice(metrics.averageOrderValue)}</h3>
          <p className="text-[11px] text-[#E8CFA8]">Premium basket density</p>
        </div>

        <div className="bg-[#17151A] p-6 rounded-3xl border border-[#E8CFA8]/30 space-y-2">
          <span className="text-xs uppercase text-white/50 font-bold">Total Orders Settled</span>
          <h3 className="font-serif text-3xl font-bold text-white">{metrics.totalOrders}</h3>
          <p className="text-[11px] text-white/60">Verified transaction receipts</p>
        </div>

        <div className="bg-[#17151A] p-6 rounded-3xl border border-[#E8CFA8]/30 space-y-2">
          <span className="text-xs uppercase text-white/50 font-bold">Active Catalog Base</span>
          <h3 className="font-serif text-3xl font-bold text-white">{metrics.totalProducts} Pieces</h3>
          <p className="text-[11px] text-white/60">Across 7 luxury departments</p>
        </div>
      </div>

      {/* Bar Chart Breakdown */}
      <div className="bg-[#17151A] p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/30 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-normal text-white">Order Volume vs Revenue</h3>
          <span className="text-xs text-[#E8CFA8] font-mono">Aggregated Daily Trends</span>
        </div>

        <LuxuryBarChart data={chartData} />
      </div>
    </div>
  );
}
