"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminDashboardData(tenantId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalBookingsCount,
      totalCustomersCount,
      upcomingBookings
    ] = await Promise.all([
      prisma.booking.count({
        where: { tenantId }
      }),
      prisma.customer.count({
        where: { tenantId }
      }),
      prisma.booking.findMany({
        where: { 
          tenantId,
          date: {
            gte: today
          }
        },
        include: {
          service: {
            select: { id: true, name: true, price: true }
          },
          customer: {
            select: { id: true, name: true }
          }
        },
        orderBy: [
          { date: "asc" },
          { time: "asc" },
        ],
        take: 8 // Only fetch the top 8 upcoming
      })
    ]);

    const formattedBookings = upcomingBookings.map(b => ({
      id: b.id,
      customer: b.customerName,
      service: b.service?.name || "Service",
      date: b.date.toISOString(),
      time: b.time,
      status: b.status,
      price: `$${b.service?.price || "0"}`,
      notes: b.notes
    }));

    return {
      success: true,
      stats: {
        totalBookings: totalBookingsCount,
        totalCustomers: totalCustomersCount,
      },
      upcomingBookings: formattedBookings
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return { success: false, stats: { totalBookings: 0, totalCustomers: 0 }, upcomingBookings: [] };
  }
}
