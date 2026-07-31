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
    const { name, role, phone } = body;

    const existingStaff = await prisma.staff.findFirst({
      where: { id, tenantId },
    });

    if (!existingStaff) {
      return NextResponse.json({ success: false, error: "Staff not found" }, { status: 404 });
    }

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingStaff.name,
        role: role !== undefined ? role : existingStaff.role,
        phone: phone !== undefined ? phone : existingStaff.phone,
      },
    });

    return NextResponse.json({ success: true, data: updatedStaff });
  } catch (error) {
    console.error("API Staff PUT error:", error);
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

    const existingStaff = await prisma.staff.findFirst({
      where: { id, tenantId },
    });

    if (!existingStaff) {
      return NextResponse.json({ success: false, error: "Staff not found" }, { status: 404 });
    }

    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Staff DELETE error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
