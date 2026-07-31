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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await prisma.booking.findMany({
      where: {
        tenantId,
      }
    });

    // Filter today's appointments based on date string or simply all active
    // For simplicity in this mockup, we just calculate totals across all or past month
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter((a: any) => a.status === 'Completed');
    
    const totalRevenue = completedAppointments.reduce((sum: number, app: any) => sum + (app.totalPrice || 0), 0);

    return NextResponse.json({ 
      success: true, 
      data: {
        totalAppointments,
        completedAppointments: completedAppointments.length,
        totalRevenue
      } 
    });
  } catch (error) {
    console.error("API Stats error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
