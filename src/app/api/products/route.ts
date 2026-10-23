import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { ProductSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured');
    const brand = searchParams.get('brand');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
        { tags: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (brand) {
      where.brand = brand;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'name-asc') orderBy = { name: 'asc' };
    if (sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: { select: { id: true, name: true, slug: true } },
          variants: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const data = ProductSchema.parse(body);

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug: data.slug }, { sku: data.sku }],
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this SKU or slug already exists' },
        { status: 400 }
      );
    }

    const { images, variants, ...productFields } = data;

    const product = await prisma.product.create({
      data: {
        ...productFields,
        images: {
          create: images.map((img, idx) => ({
            url: img.url,
            alt: img.alt || productFields.name,
            isPrimary: img.isPrimary ?? idx === 0,
            sortOrder: img.sortOrder ?? idx,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            sku: v.sku,
            title: v.title,
            color: v.color || null,
            colorHex: v.colorHex || null,
            size: v.size || null,
            price: v.price || null,
            stock: v.stock || 0,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    // Record initial inventory log
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        quantityChange: product.stock,
        previousStock: 0,
        newStock: product.stock,
        reason: 'PRODUCT_CREATION',
        notes: `Created by ${admin.email}`,
        createdBy: admin.email,
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'PRODUCT_CREATED',
        entity: 'Product',
        entityId: product.id,
        details: JSON.stringify({ name: product.name, sku: product.sku, price: product.price }),
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Product create error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create product' },
      { status: error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN' ? 403 : 400 }
    );
  }
}
