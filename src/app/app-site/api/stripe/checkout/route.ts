import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantId, type, planName, amount, price } = body;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });
    }

    // In a real Stripe integration, you would create a Stripe Checkout Session here
    // and return the session.url to redirect the user.
    // For now, we simulate a successful redirect.

    const mockCheckoutUrl = `/api/stripe/mock-success?tenantId=${tenantId}&type=${type}&planName=${planName || ''}&amount=${amount || 0}&price=${price}`;

    return NextResponse.json({ success: true, url: mockCheckoutUrl });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
