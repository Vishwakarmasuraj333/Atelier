import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 2 },
        category: true,
      },
      take: 4,
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to get product' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const { images, variants, ...directFields } = body;

    // Track stock changes for inventory logs if stock changed
    if (directFields.stock !== undefined && directFields.stock !== existing.stock) {
      await prisma.inventoryLog.create({
        data: {
          productId: existing.id,
          quantityChange: directFields.stock - existing.stock,
          previousStock: existing.stock,
          newStock: directFields.stock,
          reason: 'ADMIN_UPDATE',
          notes: `Stock updated by ${admin.email}`,
          createdBy: admin.email,
        },
      });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: directFields,
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'PRODUCT_UPDATED',
        entity: 'Product',
        entityId: updated.id,
        details: JSON.stringify(directFields),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update product' },
      { status: error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN' ? 403 : 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'PRODUCT_DELETED',
        entity: 'Product',
        entityId: id,
        details: JSON.stringify({ name: product.name, sku: product.sku }),
      },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete product' },
      { status: error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN' ? 403 : 400 }
    );
  }
}
