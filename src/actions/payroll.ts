"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function generateDraftPayslip(tenantId: string, staffId: string, startDateStr: string, endDateStr: string) {
  try {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // 1. Get Staff Details
    const staff = await prisma.staff.findUnique({
      where: { id: staffId }
    });

    if (!staff) {
      return { success: false, error: "Staff not found" };
    }

    // 2. Calculate Base Salary based on Cycle
    let baseSalary = staff.baseSalary || 0;
    // For a real app, if cycle is Monthly but they generate for 1 week, we should prorate.
    // For MVP, we assume the requested period matches the staff's salary cycle.

    // 3. Get all completed bookings for this staff in the period to calculate Commissions and Tips
    const bookings = await prisma.booking.findMany({
      where: {
        tenantId,
        staffId,
        status: "Completed",
        date: {
          gte: startDate,
          lte: endDate,
        }
      },
      include: {
        service: true,
        commission: true
      }
    });

    let commissionTotal = 0;
    let tipsTotal = 0;

    for (const bkg of bookings) {
      tipsTotal += bkg.tipAmount || 0;
      
      if (bkg.commission) {
        commissionTotal += bkg.commission.amount;
      } else {
        // Fallback: If no commission record was auto-generated, calculate based on staff rate
        const rate = staff.commissionRate || 0;
        commissionTotal += (bkg.service.price * rate) / 100;
      }
    }

    // 4. Calculate Deductions from Attendance
    const attendances = await prisma.attendance.findMany({
      where: {
        tenantId,
        staffId,
        date: {
          gte: startDate,
          lte: endDate,
        }
      }
    });

    let deductions = 0;
    // Simple penalty logic: 
    // Absent = $50 deduction, Late = $10 deduction (Configurable in real app)
    for (const att of attendances) {
      if (att.status === "Absent") deductions += 50;
      if (att.status === "Late") deductions += 10;
      if (att.status === "Half_day") deductions += 25;
    }

    // 5. Calculate Net Pay
    let netPay = 0;
    if (staff.salaryType === "Fixed") {
      netPay = baseSalary + tipsTotal - deductions;
      commissionTotal = 0; // Fixed staff don't get commission
    } else if (staff.salaryType === "Commission") {
      netPay = commissionTotal + tipsTotal - deductions;
      baseSalary = 0; // Commission staff don't get base
    } else {
      // Hybrid
      netPay = baseSalary + commissionTotal + tipsTotal - deductions;
    }

    // Ensure netPay doesn't go below 0 due to penalties
    if (netPay < 0) netPay = 0;

    // 6. Create or Update the Draft Payslip
    const payslip = await prisma.payslip.upsert({
      where: {
        staffId_startDate_endDate: {
          staffId,
          startDate,
          endDate
        }
      },
      update: {
        baseSalary,
        commissionTotal,
        tipsTotal,
        deductions,
        netPay,
        status: "Draft",
        updatedAt: new Date()
      },
      create: {
        tenantId,
        staffId,
        startDate,
        endDate,
        baseSalary,
        commissionTotal,
        tipsTotal,
        deductions,
        allowances: 0,
        netPay,
        status: "Draft"
      }
    });

    revalidatePath("/[tenantSlug]/admin/payroll", "page");
    return { success: true, payslip: JSON.parse(JSON.stringify(payslip)) };

  } catch (error) {
    console.error("Failed to generate draft payslip:", error);
    return { success: false, error: "System error while generating payslip" };
  }
}

export async function getPayslips(tenantId: string) {
  try {
    const payslips = await prisma.payslip.findMany({
      where: { tenantId },
      include: {
        staff: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return JSON.parse(JSON.stringify(payslips));
  } catch (error) {
    console.error("Failed to fetch payslips:", error);
    return [];
  }
}

export async function updatePayslipStatus(payslipId: string, status: string) {
  try {
    const dataToUpdate: any = { status };
    if (status === "Paid") {
      dataToUpdate.paymentDate = new Date();
    }

    const payslip = await prisma.payslip.update({
      where: { id: payslipId },
      data: dataToUpdate
    });
    revalidatePath("/[tenantSlug]/admin/payroll", "page");
    return { success: true, payslip: JSON.parse(JSON.stringify(payslip)) };
  } catch (error) {
    console.error("Failed to update payslip status:", error);
    return { success: false, error: "System error while updating payslip status" };
  }
}
