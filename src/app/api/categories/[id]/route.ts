import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const category = await prisma.category.update({
      where: { id },
      data: body,
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'CATEGORY_UPDATED',
        entity: 'Category',
        entityId: category.id,
        details: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update category' },
      { status: 400 }
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

    const count = await prisma.product.count({
      where: { categoryId: id },
    });

    if (count > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${count} assigned products` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'CATEGORY_DELETED',
        entity: 'Category',
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete category' },
      { status: 400 }
    );
  }
}
