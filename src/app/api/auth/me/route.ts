import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const userSession = await getCurrentUser();
    if (!userSession) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userSession.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        addresses: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ user: null, error: error?.message });
  }
}
