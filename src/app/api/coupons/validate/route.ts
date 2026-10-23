import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 400 });
    }

    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) {
      return NextResponse.json({ error: 'This coupon is not active yet' }, { status: 400 });
    }
    if (coupon.endDate && coupon.endDate < now) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit has been reached' }, { status: 400 });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon` },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    if (user && coupon.perUserLimit) {
      const userUsageCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId: user.id },
      });
      if (userUsageCount >= coupon.perUserLimit) {
        return NextResponse.json({ error: 'You have already used this coupon' }, { status: 400 });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount * 100) / 100,
        description: coupon.description,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to validate coupon' }, { status: 500 });
  }
}
