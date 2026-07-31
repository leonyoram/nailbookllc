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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantFromToken(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, code, discountValue, isActive, startDate, endDate } = body;

    const existingCoupon = await prisma.coupon.findFirst({
      where: { id, tenantId },
    });

    if (!existingCoupon) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingCoupon.name,
        code: code !== undefined ? code.toUpperCase() : existingCoupon.code,
        discountValue: discountValue !== undefined ? Number(discountValue) : existingCoupon.discountValue,
        isActive: isActive !== undefined ? !!isActive : existingCoupon.isActive,
        startDate: startDate ? new Date(startDate) : existingCoupon.startDate,
        endDate: endDate ? new Date(endDate) : existingCoupon.endDate,
      },
    });

    return NextResponse.json({ success: true, data: updatedCoupon });
  } catch (error) {
    console.error("API Coupon PUT error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantFromToken(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingCoupon = await prisma.coupon.findFirst({
      where: { id, tenantId },
    });

    if (!existingCoupon) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Coupon DELETE error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
