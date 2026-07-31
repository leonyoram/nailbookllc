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
    const { name, phone, email, vip, points } = body;

    const existingCustomer = await prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!existingCustomer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingCustomer.name,
        phone: phone !== undefined ? phone : existingCustomer.phone,
        email: email !== undefined ? email : existingCustomer.email,
        vip: vip !== undefined ? vip : existingCustomer.vip,
        points: points !== undefined ? Number(points) : existingCustomer.points,
      },
    });

    return NextResponse.json({ success: true, data: updatedCustomer });
  } catch (error) {
    console.error("API Customer PUT error:", error);
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

    const existingCustomer = await prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!existingCustomer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Customer DELETE error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
