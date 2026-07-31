import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-vici-booking-key-change-in-production"
);

async function getTenantFromToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.tenantId as string;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const tenantId = await getTenantFromToken(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error("API Coupons GET error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenantId = await getTenantFromToken(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, discountValue, isActive, startDate, endDate } = body;

    if (!name || !code || discountValue === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        name,
        code: code.toUpperCase(),
        discountValue: Number(discountValue),
        isActive: !!isActive,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        tenantId,
      },
    });
    
    return NextResponse.json({ success: true, data: newCoupon });
  } catch (error) {
    console.error("API Coupons POST error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
