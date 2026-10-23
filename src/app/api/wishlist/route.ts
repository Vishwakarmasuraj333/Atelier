import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 2 },
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ items: wishlist?.items || [] });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ items: [] });
    }
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId } = await req.json();

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: user.id },
      });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    let isAdded = false;
    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      isAdded = false;
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      isAdded = true;
    }

    return NextResponse.json({
      success: true,
      isAdded,
      message: isAdded ? 'Saved to your wishlist' : 'Removed from wishlist',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Authentication required for wishlist' },
      { status: error?.message === 'UNAUTHORIZED' ? 401 : 400 }
    );
  }
}
