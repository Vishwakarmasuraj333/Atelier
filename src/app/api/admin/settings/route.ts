import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany();
    const settingsMap = settings.reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    return NextResponse.json({ settings: settingsMap, raw: settings });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const updates = Object.entries(body).map(([key, value]) =>
      prisma.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(updates);

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'SETTINGS_UPDATED',
        entity: 'Setting',
        details: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, message: 'Settings updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }
}
