import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const type = searchParams.get('type');
    const planName = searchParams.get('planName');
    const amount = parseInt(searchParams.get('amount') || '0');
    
    if (!tenantId) {
      return new NextResponse("Missing tenantId", { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return new NextResponse("Tenant not found", { status: 404 });
    }

    // Simulate Webhook processing
    if (type === 'sms') {
      const currentLimit = tenant.smsLimit === -1 ? 0 : tenant.smsLimit;
      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          smsLimit: currentLimit + amount
        }
      });
    } else if (type === 'upgrade') {
      let staffLimit = 1;
      if (planName === 'Basic') staffLimit = 3;
      if (planName === 'Pro') staffLimit = 10;
      if (planName === 'Enterprise') staffLimit = 999;

      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          planType: planName || tenant.planType,
          staffLimit: staffLimit
        }
      });
    }

    // Redirect back to settings page
    return NextResponse.redirect(new URL(`/${tenant.slug}/admin/settings`, request.url));

  } catch (error) {
    console.error("Stripe Mock Success Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
