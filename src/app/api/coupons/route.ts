import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { CouponSchema } from '@/lib/validations';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { usages: true } },
      },
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const data = CouponSchema.parse(body);

    const existing = await prisma.coupon.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'COUPON_CREATED',
        entity: 'Coupon',
        entityId: coupon.id,
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create coupon' },
      { status: error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN' ? 403 : 400 }
    );
  }
}
