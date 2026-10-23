'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    subtotal,
    totalItems,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    discountAmount,
    taxAmount,
    shippingFee,
    grandTotal,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCoupon(couponCode.trim().toUpperCase());
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.error || 'Invalid coupon code');
    } else {
      setCouponCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FFF9F3] flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-[#E8CFA8] flex items-center justify-center text-[#641C32] mb-6 shadow-sm">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs md:text-sm text-[#17151A]/60 mt-2 max-w-md">
          Indulge in our curated selection of fine mulberry silk, Swiss automatic horology, and bespoke tailoring.
        </p>
        <Link
          href="/products"
          className="mt-8 px-8 py-4 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all"
        >
          Explore Lookbook
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8CFA8]/40">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#641C32]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Bag</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal mt-1">
              Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            Clear Entire Bag
          </button>
        </div>

        {/* Free Shipping Notification Tracker */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-[#E8CFA8]/40 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            {remainingForFreeShipping > 0 ? (
              <span className="text-[#17151A]/80 font-medium">
                Add <strong className="text-[#641C32]">{formatPrice(remainingForFreeShipping)}</strong> more to unlock complimentary White-Glove VIP Express delivery.
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> You qualify for complimentary White-Glove VIP delivery!
              </span>
            )}
            <span className="font-bold text-[#641C32]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-[#E8CFA8]/30 rounded-full h-2 mt-2.5 overflow-hidden">
            <div
              className="bg-[#641C32] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-[#E8CFA8]/30 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-28 relative rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                    {item.product.images[0]?.url && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#B83B5E] tracking-wider">
                      {item.product.brand}
                    </span>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="block font-serif text-sm md:text-base font-medium text-[#17151A] hover:text-[#641C32] transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <span className="text-xs text-[#17151A]/60 block">
                        Specification: {item.variant.title}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#641C32] sm:hidden block pt-1">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-[#E8CFA8] rounded-xl bg-[#FFF9F3]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-[#17151A]/60 hover:text-[#641C32] font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#17151A]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-[#17151A]/60 hover:text-[#641C32] font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total Line Price */}
                  <div className="text-right min-w-[90px]">
                    <span className="font-serif text-base font-bold text-[#641C32] block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-[#17151A]/40 block">
                        {formatPrice(item.price)} each
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-[#17151A]/40 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#641C32] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Browsing Pieces
              </Link>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/40 shadow-lg space-y-6 sticky top-28">
              <h3 className="font-serif text-xl font-normal text-[#17151A] pb-4 border-b border-gray-100">
                Summary of Sale
              </h3>

              {/* Promo code form */}
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block">
                    Privilege Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#17151A]/40" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. LUXE20"
                        className="w-full pl-8 pr-3 py-2.5 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs uppercase outline-none focus:border-[#641C32]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-4 py-2.5 bg-[#17151A] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#641C32] transition-colors"
                    >
                      {isApplying ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </form>
              ) : (
                <div className="flex items-center justify-between p-3 bg-[#641C32]/10 rounded-2xl border border-[#641C32]/20">
                  <div className="flex items-center gap-2 text-xs">
                    <Tag className="w-4 h-4 text-[#641C32]" />
                    <span className="font-bold text-[#641C32]">{appliedCoupon.code}</span>
                    <span className="text-[#17151A]/60">(-{formatPrice(discountAmount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs text-[#17151A]/70 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-[#17151A]">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#B83B5E]">
                    <span>Discount Applied</span>
                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax (8%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VIP Express Courier</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100 text-base font-bold text-[#17151A]">
                  <span>Total Amount</span>
                  <span className="text-[#641C32] font-serif text-xl">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-[#641C32] hover:bg-[#491424] text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:shadow-[#641C32]/40 transition-all"
              >
                <span>Proceed to VIP Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
