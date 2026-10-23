import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            grandTotal: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enrichedCustomers = customers.map((c) => {
      const totalSpent = c.orders.reduce((acc, o) => acc + o.grandTotal, 0);
      const ordersCount = c.orders.length;
      const lastOrder = c.orders[0]?.createdAt || null;
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        avatar: c.avatar,
        isActive: c.isActive,
        createdAt: c.createdAt,
        totalSpent,
        ordersCount,
        lastOrder,
      };
    });

    return NextResponse.json({ customers: enrichedCustomers });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 403 });
  }
}
