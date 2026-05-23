import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Lấy toàn bộ tenants
    const tenants = await prisma.tenant.findMany({
      select: { id: true, planType: true }
    });

    let resetCount = 0;

    for (const tenant of tenants) {
      // Cách A: Reset smsSent = 0 và smsLimit về mặc định theo gói
      let defaultSmsLimit = 100;
      switch (tenant.planType?.toLowerCase()) {
        case 'basic':
          defaultSmsLimit = 100;
          break;
        case 'advanced':
          defaultSmsLimit = 500;
          break;
        case 'unlimited':
          defaultSmsLimit = -1;
          break;
        case 'trial':
        default:
          defaultSmsLimit = 100;
          break;
      }

      await prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          smsSent: 0,
          smsLimit: defaultSmsLimit
        }
      });

      resetCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Monthly SMS reset completed. Processed ${resetCount} tenants.`,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Monthly Cron Job Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
