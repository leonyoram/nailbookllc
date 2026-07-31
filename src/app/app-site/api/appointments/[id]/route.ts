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
    const { status } = body; // e.g., 'Confirmed', 'Completed', 'Cancelled'

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    // Update appointment status
    const appointment = await prisma.booking.update({
      where: { 
        id,
        tenantId, // Ensure they only update their own appointments
      },
      data: { status },
    });
    
    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    console.error("API Appointment Update error:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
