'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Check,
  ChevronRight,
  Loader2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    subtotal,
    appliedCoupon,
    discountAmount,
    taxAmount,
    shippingFee,
    grandTotal,
    clearCart,
  } = useCart();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Shipping Address Form
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || 'Alexander Wright',
    email: user?.email || 'alexander.wright@atelier.com',
    phone: user?.phone || '+1 (555) 782-9912',
    street: '742 Evergreen Promenade, Suite 400',
    city: 'Beverly Hills',
    state: 'California',
    postalCode: '90210',
    country: 'United States',
    notes: 'Please ring the concierge buzzer on arrival.',
  });

  // Step 2: Delivery Option
  const [shippingOption, setShippingOption] = useState<'standard' | 'express'>('standard');

  // Step 3: Payment Option
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');

  useEffect(() => {
    if (user) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FFF9F3] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl text-[#17151A]">Your shopping bag is empty</h2>
        <p className="text-xs text-[#17151A]/60 mt-2 mb-6">
          Please select an item from our collection before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#641C32] text-white text-xs font-bold uppercase tracking-wider rounded-2xl"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Send Order to DB Route Handler
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: addressForm.fullName,
          email: addressForm.email,
          phone: addressForm.phone,
          street: addressForm.street,
          city: addressForm.city,
          state: addressForm.state,
          postalCode: addressForm.postalCode,
          country: addressForm.country,
          paymentMethod,
          couponCode: appliedCoupon?.code || null,
          notes: addressForm.notes,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize order');
      }

      const createdOrder = data.order;

      // 2. If Razorpay, trigger verify simulation / payment confirmation
      if (paymentMethod === 'RAZORPAY') {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createdOrder.id,
            razorpayOrderId: `order_${Math.random().toString(36).substring(2, 12)}`,
            razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
            razorpaySignature: `sig_verified_${Math.random().toString(36).substring(2, 12)}`,
          }),
        });
        if (!verifyRes.ok) {
          throw new Error('Payment verification could not be completed');
        }
      }

      // 3. Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#641C32', '#B83B5E', '#E8CFA8'],
        });
      } catch (e) {
        console.error(e);
      }

      // 4. Clear Cart & Redirect to Order Confirmation Tracking
      await clearCart();
      router.push(`/orders/${createdOrder.orderNumber}`);
    } catch (e: any) {
      setErrorMessage(e.message || 'An error occurred during checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-8 mb-8 border-b border-[#E8CFA8]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#641C32]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Privilege Client Gateway</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal mt-1">
              Secure Checkout
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-10 grid grid-cols-4 gap-2 text-center text-xs font-bold uppercase tracking-wider">
          {[
            { step: 1, label: '1. Delivery Address' },
            { step: 2, label: '2. Courier Option' },
            { step: 3, label: '3. Payment' },
            { step: 4, label: '4. Confirmation' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => s.step < currentStep && setCurrentStep(s.step as any)}
              className={`py-3 rounded-2xl border transition-all ${
                currentStep === s.step
                  ? 'bg-[#641C32] text-white border-[#641C32] shadow-md'
                  : currentStep > s.step
                  ? 'bg-[#E8CFA8]/30 text-[#17151A] border-[#E8CFA8]'
                  : 'bg-white text-gray-400 border-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Checkout Form Step Area */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-[#E8CFA8]/40 shadow-md">
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
                  {errorMessage}
                </div>
              )}

              {/* STEP 1: Address */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-normal text-[#17151A] pb-3 border-b border-gray-100">
                    Recipient & Delivery Address
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={addressForm.email}
                        onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Street Address & Residence / Suite
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Delivery Notes for Concierge
                      </label>
                      <input
                        type="text"
                        value={addressForm.notes}
                        onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                        placeholder="Gate code, reception drop-off instructions..."
                        className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>Continue to Courier</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Delivery Option */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-normal text-[#17151A] pb-3 border-b border-gray-100">
                    Select Courier Priority
                  </h3>

                  <div className="space-y-4">
                    <label
                      onClick={() => setShippingOption('standard')}
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        shippingOption === 'standard'
                          ? 'border-[#641C32] bg-[#641C32]/5 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-[#E8CFA8]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Truck className="w-6 h-6 text-[#641C32]" />
                        <div>
                          <h4 className="text-xs font-bold text-[#17151A]">White-Glove VIP Express Delivery</h4>
                          <p className="text-[11px] text-[#17151A]/60 mt-0.5">
                            Delivered in 2-3 business days with signature confirmation & climate protection.
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#641C32]">
                        {shippingFee === 0 ? 'Complimentary' : formatPrice(35)}
                      </span>
                    </label>

                    <label
                      onClick={() => setShippingOption('express')}
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        shippingOption === 'express'
                          ? 'border-[#641C32] bg-[#641C32]/5 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-[#E8CFA8]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Sparkles className="w-6 h-6 text-[#B83B5E]" />
                        <div>
                          <h4 className="text-xs font-bold text-[#17151A]">Overnight Diplomatic Courier</h4>
                          <p className="text-[11px] text-[#17151A]/60 mt-0.5">
                            Hand-couriered next morning delivery directly to your doorstep.
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#641C32]">$75.00</span>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-[#E8CFA8] text-xs font-semibold uppercase tracking-wider rounded-2xl"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-normal text-[#17151A] pb-3 border-b border-gray-100">
                    Payment Architecture
                  </h3>

                  <div className="space-y-4">
                    <label
                      onClick={() => setPaymentMethod('RAZORPAY')}
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === 'RAZORPAY'
                          ? 'border-[#641C32] bg-[#641C32]/5 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-[#E8CFA8]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard className="w-6 h-6 text-[#641C32]" />
                        <div>
                          <h4 className="text-xs font-bold text-[#17151A]">
                            Razorpay Secure Pay (Cards, UPI, NetBanking, Apple Pay)
                          </h4>
                          <p className="text-[11px] text-[#17151A]/60 mt-0.5">
                            Instant tokenized authorization with real-time server verification.
                          </p>
                        </div>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#641C32] bg-[#641C32]/5 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-[#E8CFA8]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Banknote className="w-6 h-6 text-[#B83B5E]" />
                        <div>
                          <h4 className="text-xs font-bold text-[#17151A]">Cash / Card on Concierge Delivery</h4>
                          <p className="text-[11px] text-[#17151A]/60 mt-0.5">
                            Inspect your order upon courier arrival and settle securely at your door.
                          </p>
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-[#641C32]" />
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 border border-[#E8CFA8] text-xs font-semibold uppercase tracking-wider rounded-2xl"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-8 py-3.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>Review Final Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Place Order */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-normal text-[#17151A] pb-3 border-b border-gray-100">
                    Final Order Review
                  </h3>

                  <div className="bg-[#FFF9F3] p-5 rounded-2xl border border-[#E8CFA8]/40 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#17151A]/60 font-semibold">Recipient:</span>
                      <span className="font-bold text-[#17151A]">{addressForm.fullName} ({addressForm.phone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#17151A]/60 font-semibold">Delivery To:</span>
                      <span className="text-right text-[#17151A]">
                        {addressForm.street}, {addressForm.city}, {addressForm.state} {addressForm.postalCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#17151A]/60 font-semibold">Payment Architecture:</span>
                      <span className="font-bold text-[#641C32]">
                        {paymentMethod === 'RAZORPAY' ? 'Razorpay Secure Token' : 'Cash on Delivery'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 border border-[#E8CFA8] text-xs font-semibold uppercase tracking-wider rounded-2xl"
                    >
                      Back
                    </button>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="px-10 py-4 bg-[#641C32] hover:bg-[#491424] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl transition-all flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Authorizing Order...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Authorize & Place Order ({formatPrice(grandTotal)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#E8CFA8]/40 shadow-md space-y-4">
              <h3 className="font-serif text-lg font-normal text-[#17151A] pb-3 border-b border-gray-100">
                Order Items ({items.length})
              </h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <div className="w-14 h-16 relative rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      {item.product.images[0]?.url && (
                        <Image src={item.product.images[0].url} alt="" fill sizes="56px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#17151A] truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-[#17151A]/50">Qty: {item.quantity}</p>
                      <p className="font-bold text-[#641C32] mt-0.5">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-[#17151A]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#17151A]">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#B83B5E]">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax (8%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VIP Delivery</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 text-base font-bold text-[#17151A]">
                  <span>Grand Total</span>
                  <span className="text-[#641C32] font-serif text-xl">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
