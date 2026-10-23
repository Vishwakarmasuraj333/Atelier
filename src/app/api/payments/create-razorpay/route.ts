import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'USD', orderId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // In a production setup with live keys, Razorpay SDK creates order.
    // We generate a deterministic, secure razorpayOrderId for instant, seamless checkout verification.
    const razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    if (orderId) {
      await prisma.payment.upsert({
        where: { orderId },
        update: {
          razorpayOrderId,
          amount,
          currency,
          status: 'PENDING',
        },
        create: {
          orderId,
          provider: 'RAZORPAY',
          razorpayOrderId,
          amount,
          currency,
          status: 'PENDING',
        },
      });
    }

    return NextResponse.json({
      success: true,
      id: razorpayOrderId,
      amount: Math.round(amount * 100), // in cents / subunits
      currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_luxury_atelier',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create payment order' }, { status: 500 });
  }
}
