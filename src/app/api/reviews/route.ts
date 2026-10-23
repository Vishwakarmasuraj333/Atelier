import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { ReviewSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const all = searchParams.get('all') === 'true';

    const where: any = {};
    if (productId) where.productId = productId;
    if (!all) where.isApproved = true;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to submit a review' }, { status: 401 });
    }

    const body = await req.json();
    const data = ReviewSchema.parse(body);

    // Check if user purchased this product
    const orderWithProduct = await prisma.order.findFirst({
      where: {
        userId: user.id,
        items: {
          some: { productId: data.productId },
        },
      },
    });

    const isVerifiedPurchase = Boolean(orderWithProduct);

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: user.id,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        isApproved: true, // Auto approved
        isVerifiedPurchase,
      },
      include: {
        user: { select: { name: true, avatar: true } },
      },
    });

    // Recalculate product rating
    const aggregate = await prisma.review.aggregate({
      where: { productId: data.productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: data.productId },
      data: {
        rating: aggregate._avg.rating ? Math.round(aggregate._avg.rating * 10) / 10 : 5,
        reviewCount: aggregate._count.rating || 0,
      },
    });

    await prisma.notification.create({
      data: {
        type: 'NEW_REVIEW',
        title: 'New Client Review',
        message: `${user.name} rated a product ${data.rating}★: "${data.title}"`,
        link: '/admin/reviews',
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to submit review' }, { status: 400 });
  }
}
