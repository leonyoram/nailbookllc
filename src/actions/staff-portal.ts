"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-vici-booking-key-change-in-production"
);

export async function getStaffSession(tenantSlug: string) {
  try {
    const token = (await cookies()).get(`staff_auth_${tenantSlug}`)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { tenantId: string; slug: string; staffId: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function getStaffDashboardData(tenantSlug: string) {
  try {
    const session = await getStaffSession(tenantSlug);
    if (!session) return { success: false, error: "Unauthorized" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    // Get today's bookings
    const todaysBookings = await prisma.booking.findMany({
      where: {
        tenantId: session.tenantId,
        staffId: session.staffId,
        date: today,
        status: { not: "Cancelled" }
      },
      include: {
        service: true,
        customer: true
      },
      orderBy: { time: 'asc' }
    });

    // Get this week's commissions
    const commissions = await prisma.commission.findMany({
      where: {
        tenantId: session.tenantId,
        staffId: session.staffId,
        createdAt: { gte: startOfWeek }
      }
    });

    const weeklyCommission = commissions.reduce((sum, c) => sum + c.amount, 0);

    // Get staff details
    const staff = await prisma.staff.findUnique({
      where: { id: session.staffId }
    });

    return { 
      success: true, 
      data: {
        staff,
        todaysBookings,
        weeklyCommission
      } 
    };
  } catch (error) {
    console.error("Failed to fetch staff dashboard data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
