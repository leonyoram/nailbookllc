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

    // Get appointments from the database
    const appointments = await prisma.booking.findMany({
      where: { tenantId },
      include: {
        customer: true,
        service: true,
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' },
      ],
      take: 50,
    });
    
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error("API Appointments error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
