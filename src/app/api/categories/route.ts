import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { CategorySchema } from '@/lib/validations';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const data = CategorySchema.parse(body);

    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'CATEGORY_CREATED',
        entity: 'Category',
        entityId: category.id,
        details: JSON.stringify({ name: category.name, slug: category.slug }),
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create category' },
      { status: error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN' ? 403 : 400 }
    );
  }
}
