import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const [products, logs] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          lowStockThreshold: true,
          brand: true,
          price: true,
          category: { select: { name: true } },
          variants: {
            select: {
              id: true,
              sku: true,
              title: true,
              stock: true,
            },
          },
        },
        orderBy: { stock: 'asc' },
      }),
      prisma.inventoryLog.findMany({
        include: {
          product: { select: { name: true, sku: true } },
          variant: { select: { title: true, sku: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    return NextResponse.json({ products, logs });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { productId, variantId, newStock, reason, notes } = await req.json();

    if (newStock === undefined || newStock < 0) {
      return NextResponse.json({ error: 'Valid stock quantity is required' }, { status: 400 });
    }

    let previousStock = 0;
    let quantityChange = 0;

    if (variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
      previousStock = variant.stock;
      quantityChange = newStock - previousStock;

      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
      });
    } else {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      previousStock = product.stock;
      quantityChange = newStock - previousStock;

      await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });
    }

    const log = await prisma.inventoryLog.create({
      data: {
        productId,
        variantId: variantId || null,
        quantityChange,
        previousStock,
        newStock,
        reason: reason || 'MANUAL_ADJUSTMENT',
        notes: notes || `Adjusted by ${admin.email}`,
        createdBy: admin.email,
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update inventory' }, { status: 400 });
  }
}
