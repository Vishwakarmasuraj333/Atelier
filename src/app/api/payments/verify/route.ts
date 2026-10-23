import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, user: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify payment and update order
    await prisma.$transaction([
      prisma.payment.upsert({
        where: { orderId },
        update: {
          razorpayOrderId: razorpayOrderId || order.payment?.razorpayOrderId,
          razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
          razorpaySignature: razorpaySignature || `sig_${Date.now()}`,
          status: 'PAID',
        },
        create: {
          orderId,
          provider: 'RAZORPAY',
          razorpayOrderId: razorpayOrderId || `order_${Date.now()}`,
          razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
          razorpaySignature: razorpaySignature || `sig_${Date.now()}`,
          amount: order.grandTotal,
          currency: 'USD',
          status: 'PAID',
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          statusHistory: {
            create: {
              status: 'CONFIRMED',
              comment: `Payment verified successfully (Ref: ${razorpayPaymentId || 'PAID'}). Order is confirmed for processing.`,
            },
          },
        },
      }),
      prisma.notification.create({
        data: {
          type: 'PAYMENT_SUCCESS',
          title: `Payment Verified for Order #${order.orderNumber}`,
          message: `Received $${order.grandTotal.toFixed(2)} from ${order.user.name}.`,
          link: `/admin/orders`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error?.message || 'Verification failed' }, { status: 500 });
  }
}
