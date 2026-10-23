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

    const banner = await prisma.banner.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    await prisma.banner.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Banner deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }
}
