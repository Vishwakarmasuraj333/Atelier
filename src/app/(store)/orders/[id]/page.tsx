'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Package,
  Truck,
  Clock,
  Printer,
  ChevronLeft,
  ShieldCheck,
  Loader2,
  XCircle,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      setOrder(data.order);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you wish to cancel this bespoke order?')) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (res.ok) {
        fetchOrder();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFF9F3]">
        <Loader2 className="w-10 h-10 text-[#641C32] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#17151A]/60 mt-3">
          Retrieving order docket...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFF9F3] text-center p-6 space-y-4">
        <h2 className="font-serif text-3xl text-[#17151A]">Order Not Found</h2>
        <p className="text-xs text-[#17151A]/60">Could not find record for #{id}.</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#641C32] text-white text-xs font-bold uppercase tracking-wider rounded-2xl"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Payment Verified' },
    { key: 'PROCESSING', label: 'Artisanal Preparation' },
    { key: 'SHIPPED', label: 'Courier Dispatched' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const statusMap: any = {
    PENDING: 0,
    CONFIRMED: 1,
    PROCESSING: 2,
    PACKED: 2,
    SHIPPED: 3,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 4,
    CANCELLED: -1,
  };

  const currentStepIndex = statusMap[order.status] ?? 0;

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8CFA8]/40">
          <div>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs text-[#641C32] hover:underline font-bold uppercase tracking-wider mb-2"
            >
              <ChevronLeft className="w-4 h-4" /> All Orders
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-[#17151A]/60 mt-1">
              Placed on {formatDateTime(order.createdAt)} • Status:{' '}
              <span className="font-bold text-[#641C32]">{order.status}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white border border-[#E8CFA8] text-xs font-semibold rounded-2xl flex items-center gap-2 hover:bg-[#F4F1EF] transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#641C32]" />
              <span>Print Invoice</span>
            </button>

            {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl hover:bg-red-100 transition-colors"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Live Timeline Tracker */}
        {order.status !== 'CANCELLED' ? (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/40 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#17151A]">
                Fulfillment Journey
              </h3>
              {order.trackingNumber && (
                <span className="text-xs bg-[#641C32]/10 text-[#641C32] font-mono px-3 py-1 rounded-full font-bold">
                  Tracking: {order.trackingNumber}
                </span>
              )}
            </div>

            <div className="relative flex flex-col md:flex-row justify-between gap-4 md:gap-0 pt-4">
              {steps.map((s, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={s.key} className="flex-1 flex flex-row md:flex-col items-center gap-3 relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                        isPassed
                          ? 'bg-[#641C32] text-white'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      } ${isCurrent ? 'ring-4 ring-[#E8CFA8]' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs font-semibold tracking-wider text-center ${
                        isPassed ? 'text-[#17151A]' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Status History Logs */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17151A]">
                  Concierge Status Notes
                </h4>
                <div className="space-y-1.5">
                  {order.statusHistory.map((h: any) => (
                    <div key={h.id} className="text-xs text-[#17151A]/70 flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#641C32] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#17151A]">{formatDateTime(h.createdAt)}:</strong> {h.comment || h.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 bg-rose-50 rounded-3xl border border-rose-200 text-rose-800 flex items-center gap-3">
            <XCircle className="w-6 h-6 shrink-0 text-rose-600" />
            <div>
              <h4 className="font-bold text-sm">Order Cancelled</h4>
              <p className="text-xs mt-0.5">This bespoke order was cancelled. Any authorization hold has been released.</p>
            </div>
          </div>
        )}

        {/* Order Details & Summary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items In Order */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#E8CFA8]/40 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#17151A] pb-3 border-b border-gray-100">
              Purchased Masterpieces
            </h3>

            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 relative rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#17151A] text-sm">{item.title}</h4>
                      <p className="text-[11px] text-[#17151A]/50">Quantity: {item.quantity}</p>
                      <p className="font-serif text-[#641C32] font-bold mt-1">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#17151A]">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal table */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-[#17151A]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#B83B5E]">
                  <span>Privilege Discount ({order.couponCode || 'PROMO'})</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Delivery</span>
                <span>{order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100 text-base font-bold text-[#17151A]">
                <span>Grand Total Paid</span>
                <span className="font-serif text-xl text-[#641C32]">{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Meta */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8CFA8]/40 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#641C32]">
                <MapPin className="w-4 h-4" />
                <span>Delivery Address</span>
              </div>
              {order.shippingAddress && (
                <div className="space-y-1 text-[#17151A]/80">
                  <p className="font-bold text-[#17151A]">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="text-[11px] text-[#17151A]/50 mt-1">Tel: {order.shippingAddress.phone}</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8CFA8]/40 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#641C32]">
                <CreditCard className="w-4 h-4" />
                <span>Payment Details</span>
              </div>
              <div className="space-y-1 text-[#17151A]/80">
                <p>Method: <strong>{order.paymentMethod}</strong></p>
                <p>Status: <span className="font-bold text-emerald-700">{order.paymentStatus}</span></p>
                {order.payment?.razorpayPaymentId && (
                  <p className="text-[11px] text-gray-500 font-mono">Ref: {order.payment.razorpayPaymentId}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
