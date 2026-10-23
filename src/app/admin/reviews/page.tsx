'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews?all=true');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voice of Patron</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Review Moderation Queue
          </h1>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-[#E8CFA8]">
              <tr>
                <th className="p-4">Piece</th>
                <th className="p-4">Author</th>
                <th className="p-4">Rating & Title</th>
                <th className="p-4">Commentary</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#E8CFA8]" />
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/50">
                    No reviews in queue.
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white max-w-[160px] truncate">
                      {rev.product?.name}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{rev.user?.name}</p>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex text-amber-400 mb-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className="font-bold text-white">{rev.title}</p>
                    </td>
                    <td className="p-4 max-w-sm text-white/70">{rev.comment}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rev.isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {rev.isApproved ? 'Published' : 'Pending Approval'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => toggleApproval(rev.id, rev.isApproved)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          rev.isApproved
                            ? 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/60'
                            : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                        }`}
                      >
                        {rev.isApproved ? 'Unpublish' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-xl"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
