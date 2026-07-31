import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantBySlug } from '@/actions/tenant';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get('tenantSlug');

    if (!tenantSlug) {
      return NextResponse.json({ success: false, error: 'Missing tenantSlug' }, { status: 400 });
    }

    const tenant = await getTenantBySlug(tenantSlug);
    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
    }

    const logs = await prisma.smsLog.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
      take: 200 // Limit to recent 200 logs
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('API Error fetching SMS logs:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
