'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
  X,
  Sparkles,
  Loader2,
  Filter,
} from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = async () => {
    try {
      const url = statusFilter
        ? `/api/orders?admin=true&status=${statusFilter}`
        : `/api/orders?admin=true`;
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || '');
    setStatusComment('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber,
          comment: statusComment || `Status updated to ${newStatus} by Executive Concierge.`,
        }),
      });

      if (res.ok) {
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CFA8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mt-1">
            Orders & Shipments
          </h1>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/50" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#17151A] border border-[#E8CFA8]/40 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none"
          >
            <option value="">All Statuses ({orders.length})</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#17151A] rounded-3xl border border-[#E8CFA8]/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-[#E8CFA8]">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#E8CFA8]" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-white/50">
                    No orders found matching filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">#{ord.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{ord.user?.name || 'Guest'}</p>
                      <p className="text-[10px] text-white/50">{ord.user?.email}</p>
                    </td>
                    <td className="p-4 text-white/70">{formatDateTime(ord.createdAt)}</td>
                    <td className="p-4 font-serif font-bold text-[#E8CFA8]">{formatPrice(ord.grandTotal)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === 'DELIVERED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ord.status === 'CANCELLED'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-[#641C32] text-white'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openOrderModal(ord)}
                        className="px-3 py-1.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-[11px] font-bold rounded-xl transition-colors"
                      >
                        Update Status
                      </button>
                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        target="_blank"
                        className="p-2 bg-white/5 hover:bg-white/10 text-[#E8CFA8] rounded-xl inline-block"
                        title="View Public Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#17151A] rounded-3xl border border-[#E8CFA8]/50 shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-serif text-xl font-normal text-white">
                  Update Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-white/50">{selectedOrder.user?.name} • {formatPrice(selectedOrder.grandTotal)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  Change Fulfillment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121015] border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                >
                  <option value="PENDING">PENDING (Order Placed)</option>
                  <option value="CONFIRMED">CONFIRMED (Payment Verified)</option>
                  <option value="PROCESSING">PROCESSING (Packaging & Ribbons)</option>
                  <option value="PACKED">PACKED (Ready for Courier)</option>
                  <option value="SHIPPED">SHIPPED (In Transit)</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY (With Driver)</option>
                  <option value="DELIVERED">DELIVERED (Client Signed)</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  FedEx / Courier Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. ATELIER-FEDEX-92837492"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  Timeline Progress Comment
                </label>
                <textarea
                  rows={2}
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="e.g. Hand-packaged in archival box and collected by FedEx courier."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#E8CFA8]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 bg-white/5 text-white/70 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-[#641C32] hover:bg-[#B83B5E] text-white font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  {isUpdating ? 'Updating...' : 'Save & Notify Patron'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
