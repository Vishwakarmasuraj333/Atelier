'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    subtotal,
    totalItems,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    appliedCoupon,
    discountAmount,
    taxAmount,
    shippingFee,
    grandTotal,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCoupon(couponInput.trim().toUpperCase());
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.error || 'Invalid code');
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end bg-[#17151A]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FFF9F3] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8CFA8]/40 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#17151A]/10 flex items-center justify-between bg-white/70">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#641C32]" />
            <h3 className="font-serif text-lg font-medium text-[#17151A]">
              Bespoke Cart ({totalItems})
            </h3>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#17151A]/60 hover:text-[#641C32] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="bg-[#641C32]/5 px-5 py-3 border-b border-[#E8CFA8]/30 text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-[#641C32] font-medium">
              Add <span className="font-bold">{formatPrice(remainingForFreeShipping)}</span> more for complimentary VIP delivery.
            </p>
          ) : (
            <p className="text-[#641C32] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B83B5E]" /> You have unlocked complimentary VIP delivery!
            </p>
          )}
          <div className="w-full bg-[#E8CFA8]/40 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#641C32] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#F4F1EF] flex items-center justify-center text-[#641C32]/40">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-medium text-[#17151A]">Your shopping bag is empty</h4>
                <p className="text-xs text-[#17151A]/50 mt-1 max-w-xs">
                  Discover our curated selection of fine silk, horology, and haute tailoring.
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="mt-2 px-6 py-2.5 bg-[#641C32] text-[#FFF9F3] text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-[#B83B5E] transition-all"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-white rounded-2xl border border-[#E8CFA8]/30 shadow-xs"
              >
                <div className="w-20 h-24 relative rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  {item.product.images[0]?.url && (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#B83B5E] tracking-wider">
                        {item.product.brand}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#17151A]/40 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-semibold text-[#17151A] line-clamp-1">
                      {item.product.name}
                    </h4>
                    {item.variant && (
                      <span className="text-[11px] text-[#17151A]/60">
                        {item.variant.title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center border border-[#E8CFA8] rounded-lg overflow-hidden bg-[#FFF9F3]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#17151A]/60 hover:text-[#641C32] hover:bg-black/5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#17151A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#17151A]/60 hover:text-[#641C32] hover:bg-black/5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-[#641C32]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#17151A]/10 space-y-4 shadow-lg">
            {/* Coupon Section */}
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#17151A]/40" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo Code (e.g. LUXE20)"
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase border border-[#E8CFA8] rounded-xl outline-none focus:border-[#641C32] bg-[#FFF9F3]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-[#17151A] text-[#FFF9F3] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#641C32] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
              </form>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-[#641C32]/10 rounded-xl border border-[#641C32]/20">
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

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#17151A]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#17151A]">{formatPrice(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-[#B83B5E]">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-medium">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>VIP Express Delivery</span>
                <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-[#17151A]">
                <span>Total</span>
                <span className="text-[#641C32] text-base font-serif">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-3.5 bg-[#641C32] hover:bg-[#491424] text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="w-full py-2.5 bg-transparent border border-[#E8CFA8] text-[#17151A] text-xs font-semibold uppercase tracking-wider rounded-2xl flex items-center justify-center hover:bg-[#F4F1EF] transition-colors"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
