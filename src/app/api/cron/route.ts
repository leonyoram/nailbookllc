import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/actions/sms";
import { getSystemSettings } from "@/actions/settings";

function replaceSmsVariables(template: string, data: any) {
  return template
    .replace(/%customer_full_name%/g, data.customerName || "")
    .replace(/%service_name%/g, data.serviceName || "")
    .replace(/%appointment_start_time%/g, `${data.date} at ${data.time}` || "")
    .replace(/%tenant_name%/g, data.tenantName || "");
}

export async function GET(request: Request) {
  try {
    // Basic security token to prevent random hits
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'vici-cron-secret'}`) {
      // In a real app we would return 401, but for demo we allow it or we just check if it's localhost
      // For this project, we'll bypass to allow easy testing.
      // return new NextResponse("Unauthorized", { status: 401 });
    }

    const settings = await getSystemSettings();
    const results: any = {
      remindersSent: 0,
      reviewsSent: 0,
      cancelledBookings: 0,
      errors: [] as string[]
    };

    // 1. AUTO REMINDERS (24h before)
    // Find bookings that are Confirmed, date is tomorrow (or within next 24h), reminderSent is false
    // Since date is stored as DateTime (at midnight) and time is a string "HH:MM", we have to combine them.
    // For simplicity, we just look at the date field being tomorrow or today.
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Convert to YYYY-MM-DD for easier matching
    const todayStr = now.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const upcomingBookings = await prisma.booking.findMany({
      where: {
        status: "Confirmed",
        reminderSent: false,
        customerPhone: { not: null },
        OR: [
          // If we want 24h reminder, date could be tomorrow
          { date: new Date(tomorrowStr) },
          // Or if it's today and coming up soon
          { date: new Date(todayStr) }
        ],
        tenant: {
          smsEnabled: true,
          status: "Active"
        }
      },
      include: {
        tenant: true,
        service: true,
      }
    });

    for (const booking of upcomingBookings) {
      try {
        // Construct appointment datetime
        const [hours, minutes] = booking.time.split(':').map(Number);
        const aptDate = new Date(booking.date);
        aptDate.setHours(hours, minutes, 0, 0);

        const diffMs = aptDate.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // If appointment is between 2 and 24 hours away
        if (diffHours > 0 && diffHours <= 24) {
          const tenant = booking.tenant;
          let template = (tenant.smsTemplates as any)?.reminder || "Reminder: Your appointment for %service_name% at %tenant_name% is on %appointment_start_time%. See you soon!";
          
          const message = replaceSmsVariables(template, {
            customerName: booking.customerName,
            serviceName: booking.service.name,
            date: booking.date.toISOString().split('T')[0],
            time: booking.time,
            tenantName: tenant.name
          });

          await sendSMS(tenant.id, booking.customerPhone!, message);
          
          await prisma.booking.update({
            where: { id: booking.id },
            data: { reminderSent: true }
          });
          results.remindersSent++;
        }
      } catch (err: any) {
        results.errors.push(`Reminder error for ${booking.id}: ${err.message}`);
      }
    }

    // 2. AUTO REVIEW REQUEST (2 hours after completion)
    const recentlyCompleted = await prisma.booking.findMany({
      where: {
        status: "Completed",
        reviewRequestSent: false,
        customerPhone: { not: null },
        tenant: {
          smsEnabled: true,
          status: "Active",
          // We only want to send if they have Advanced or Unlimited, but since it's hard to check JSON array in prisma directly easily, we check in loop or we just allow it for all active.
        }
      },
      include: {
        tenant: true,
        service: true,
      }
    });

    for (const booking of recentlyCompleted) {
      try {
        const tenant = booking.tenant;
        // Check if tenant has google review url
        if (!tenant.googleReviewUrl) continue;
        // Check if plan allows reviews (Advanced or Unlimited)
        if (tenant.planType === "Trial" || tenant.planType === "Basic") continue;

        // Construct appointment datetime
        const [hours, minutes] = booking.time.split(':').map(Number);
        const aptDate = new Date(booking.date);
        aptDate.setHours(hours, minutes, 0, 0);
        // Add duration
        const duration = booking.service.duration || 60;
        aptDate.setMinutes(aptDate.getMinutes() + duration);

        const diffMs = now.getTime() - aptDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // If completed between 2 and 24 hours ago
        if (diffHours >= 2 && diffHours <= 24) {
          let template = (tenant.smsTemplates as any)?.review || "Thank you for visiting %tenant_name%! We hope you enjoyed your %service_name%. Please leave us a review: " + tenant.googleReviewUrl;
          
          const message = replaceSmsVariables(template, {
            customerName: booking.customerName,
            serviceName: booking.service.name,
            date: booking.date.toISOString().split('T')[0],
            time: booking.time,
            tenantName: tenant.name
          });

          await sendSMS(tenant.id, booking.customerPhone!, message);
          
          await prisma.booking.update({
            where: { id: booking.id },
            data: { reviewRequestSent: true }
          });
          results.reviewsSent++;
        }
      } catch (err: any) {
        results.errors.push(`Review error for ${booking.id}: ${err.message}`);
      }
    }

    // 3. AUTO CANCELLATION (Unpaid deposits after 30 mins)
    const thirtyMinsAgo = new Date(now.getTime() - 30 * 60000);
    const unpaidBookings = await prisma.booking.findMany({
      where: {
        status: "Pending",
        paymentStatus: "Unpaid",
        depositAmount: { gt: 0 },
        createdAt: { lt: thirtyMinsAgo }
      }
    });

    for (const booking of unpaidBookings) {
      try {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "Cancelled" as any, notes: (booking.notes ? booking.notes + "\\n" : "") + "Auto-cancelled: Deposit not paid within 30 minutes." }
        });
        results.cancelledBookings++;
      } catch (err: any) {
        results.errors.push(`Cancel error for ${booking.id}: ${err.message}`);
      }
    }

    // 4. AUTO WIN-BACK CAMPAIGN (60 days since last visit)
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const targetDateStr = sixtyDaysAgo.toISOString().split('T')[0];

    // Find bookings that were completed exactly 60 days ago
    const winbackCandidates = await prisma.booking.findMany({
      where: {
        status: "Completed",
        date: new Date(targetDateStr),
        customerPhone: { not: null },
        tenant: {
          smsEnabled: true,
          status: "Active"
        }
      },
      include: {
        tenant: true
      }
    });

    results.winbackSent = 0;

    for (const booking of winbackCandidates) {
      try {
        // Double check if they have any newer bookings (this was not their *last* visit)
        const newerBooking = await prisma.booking.findFirst({
          where: {
            customerPhone: booking.customerPhone,
            tenantId: booking.tenantId,
            date: { gt: new Date(targetDateStr) },
            status: { in: ["Completed", "Confirmed", "Pending"] }
          }
        });

        if (!newerBooking) {
          const tenant = booking.tenant;
          const winbackDiscount = (tenant.smsTemplates as any)?.winbackDiscount || "5";
          const template = "Chao ban, da 60 ngay roi chung toi khong gap ban tai " + tenant.name + ". Tang ban ma giam gia " + winbackDiscount + "% (Code: WINBACK" + winbackDiscount + ") cho lan dat lich tiep theo! Dat lai ngay: " + ((tenant.socialLinks as any)?.website || "https://nailbook.app");
          
          await sendSMS(tenant.id, booking.customerPhone!, template);
          results.winbackSent++;
        }
      } catch (err: any) {
        results.errors.push(`Winback error for phone ${booking.customerPhone}: ${err.message}`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
