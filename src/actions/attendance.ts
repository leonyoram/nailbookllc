"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAttendanceByDate(tenantId: string, date: string) {
  try {
    // Fetch all staff members for the tenant
    const staffList = await prisma.staff.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });

    // Fetch attendance records for the specific date
    const attendances = await prisma.attendance.findMany({
      where: {
        tenantId,
        date: new Date(date)
      }
    });

    // Merge staff with their attendance records
    const attendanceMap = new Map();
    attendances.forEach(a => attendanceMap.set(a.staffId, a));

    const result = staffList.map(staff => {
      const record = attendanceMap.get(staff.id);
      return {
        staffId: staff.id,
        staffName: staff.name,
        role: staff.role,
        clockIn: record?.clockIn ? record.clockIn.toISOString().substring(11, 16) : "",
        clockOut: record?.clockOut ? record.clockOut.toISOString().substring(11, 16) : "",
        status: record?.status || "Present",
        notes: record?.notes || "",
      };
    });

    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.error("Failed to fetch attendance:", error);
    return { success: false, error: "Failed to fetch attendance data" };
  }
}

export async function upsertAttendance({
  tenantId,
  staffId,
  date,
  clockIn,
  clockOut,
  status,
  notes
}: {
  tenantId: string;
  staffId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status?: string;
  notes?: string;
}) {
  try {
    const record = await prisma.attendance.upsert({
      where: {
        tenantId_staffId_date: {
          tenantId,
          staffId,
          date: new Date(date)
        }
      },
      update: {
        clockIn: clockIn ? new Date(`1970-01-01T${clockIn}:00Z`) : null,
        clockOut: clockOut ? new Date(`1970-01-01T${clockOut}:00Z`) : null,
        status: status as any,
        notes
      },
      create: {
        tenantId,
        staffId,
        date: new Date(date),
        clockIn: clockIn ? new Date(`1970-01-01T${clockIn}:00Z`) : null,
        clockOut: clockOut ? new Date(`1970-01-01T${clockOut}:00Z`) : null,
        status: (status || "Present") as any,
        notes
      }
    });

    revalidatePath(`/[tenantSlug]/admin/attendance`, "page");
    return { success: true, data: JSON.parse(JSON.stringify(record)) };
  } catch (error) {
    console.error("Failed to upsert attendance:", error);
    return { success: false, error: "Failed to save attendance" };
  }
}

export async function getMonthlyAttendance(tenantId: string, staffId: string, year: number, month: number) {
  try {
    const monthStr = month.toString().padStart(2, "0");
    const prefix = `${year}-${monthStr}-`;

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const records = await prisma.attendance.findMany({
      where: {
        tenantId,
        staffId,
        date: {
          gte: new Date(`${year}-${monthStr}-01`),
          lt: new Date(`${nextYear}-${nextMonth.toString().padStart(2, "0")}-01`)
        }
      }
    });

    return { success: true, data: JSON.parse(JSON.stringify(records)) };
  } catch (error) {
    console.error("Failed to fetch monthly attendance:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
