"use server";

import { prisma } from "@/lib/prisma";

export async function getRevenueReport(tenantId: string) {
  try {
    const now = new Date();
    
    // Start of current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        tenantId,
        status: "Completed", // Assuming "Completed" is the status for paid/completed bookings
      },
      include: {
        service: true,
      },
    });

    let weeklyRevenue = 0;
    let monthlyRevenue = 0;

    bookings.forEach((booking) => {
      const bookingDate = new Date(`${booking.date}T${booking.time}`);
      
      if (booking.service?.price) {
        if (bookingDate >= startOfWeek) {
          weeklyRevenue += booking.service.price;
        }
        if (bookingDate >= startOfMonth) {
          monthlyRevenue += booking.service.price;
        }
      }
    });

    return { success: true, weeklyRevenue, monthlyRevenue };
  } catch (error) {
    console.error("Failed to fetch revenue report:", error);
    return { success: false, weeklyRevenue: 0, monthlyRevenue: 0 };
  }
}

export async function getNewCustomersReport(tenantId: string) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const count = await prisma.customer.count({
      where: {
        tenantId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    return { success: true, newCustomers: count };
  } catch (error) {
    console.error("Failed to fetch new customers report:", error);
    return { success: false, newCustomers: 0 };
  }
}

export async function getPopularServicesReport(tenantId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        tenantId,
        status: "Completed",
      },
      include: {
        service: true,
      },
    });

    const serviceCounts: Record<string, { name: string; count: number; revenue: number }> = {};

    bookings.forEach((booking) => {
      if (booking.serviceId && booking.service) {
        if (!serviceCounts[booking.serviceId]) {
          serviceCounts[booking.serviceId] = {
            name: booking.service.name,
            count: 0,
            revenue: 0,
          };
        }
        serviceCounts[booking.serviceId].count += 1;
        serviceCounts[booking.serviceId].revenue += booking.service.price;
      }
    });

    const popularServices = Object.values(serviceCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { success: true, popularServices };
  } catch (error) {
    console.error("Failed to fetch popular services report:", error);
    return { success: false, popularServices: [] };
  }
}

export async function getRevenueChartData(tenantId: string) {
  try {
    const now = new Date();
    // Get last 7 days including today
    const chartData: { day: string; dateStr: string; revenue: number }[] = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Initialize chartData array
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      chartData.push({
        dateStr: d.toISOString().split("T")[0],
        day: days[d.getDay()],
        revenue: 0,
      });
    }

    const startDateStr = chartData[0].dateStr;
    const endDateStr = chartData[6].dateStr;

    // Fetch bookings within the last 7 days
    const bookings = await prisma.booking.findMany({
      where: {
        tenantId,
        status: "Completed",
        date: {
          gte: new Date(startDateStr),
          lte: new Date(endDateStr)
        }
      },
      include: {
        service: true,
      },
    });

    bookings.forEach(booking => {
      const dateStr = booking.date.toISOString().split("T")[0];
      const dataPoint = chartData.find(d => d.dateStr === dateStr);
      if (dataPoint && booking.service?.price) {
        dataPoint.revenue += booking.service.price;
      }
    });

    return { success: true, chartData };
  } catch (error) {
    console.error("Failed to fetch revenue chart data:", error);
    return { success: false, chartData: [] };
  }
}

export async function getTopStaffReport(tenantId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        tenantId,
        status: "Completed",
        staffId: { not: null }
      },
      include: {
        service: true,
        staff: true,
      },
    });

    const staffStats: Record<string, { name: string; revenue: number; appointments: number }> = {};

    bookings.forEach((booking) => {
      if (booking.staffId && booking.staff) {
        if (!staffStats[booking.staffId]) {
          staffStats[booking.staffId] = {
            name: booking.staff.name,
            revenue: 0,
            appointments: 0
          };
        }
        staffStats[booking.staffId].appointments += 1;
        if (booking.service?.price) {
          staffStats[booking.staffId].revenue += booking.service.price;
        }
      }
    });

    const topStaff = Object.values(staffStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { success: true, topStaff };
  } catch (error) {
    console.error("Failed to fetch top staff report:", error);
    return { success: false, topStaff: [] };
  }
}
