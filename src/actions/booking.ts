"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendSMS } from "./sms";
import { getTenantById } from "./tenant";
import { getSystemSettings } from "./settings";
import { createNotification } from "./notification";
import { sendPushNotification } from "./push";
import { BookingStatus, PaymentStatus } from "@prisma/client";

function replaceSmsVariables(template: string, data: any) {
  return template
    .replace(/%customer_full_name%/g, data.customerName || "")
    .replace(/%service_name%/g, data.serviceName || "")
    .replace(/%appointment_start_time%/g, data.time || "")
    .replace(/%appointment_date%/g, data.date || "")
    .replace(/%tenant_name%/g, data.tenantName || "");
}

export async function createBooking({
  tenantId,
  customerName,
  customerPhone,
  service,
  staff,
  date,
  time,
  status = "Pending",
  discountPercentage = 0,
  promotionPrize = null,
  notes = null,
  depositAmount = 0,
  paymentStatus = "Unpaid",
}: {
  tenantId: string;
  customerName: string;
  customerPhone: string;
  service: { id: string; name: string; price: string; duration?: number };
  staff: { id: string; name: string } | null;
  date: string;
  time: string;
  status?: string;
  discountPercentage?: number;
  promotionPrize?: string | null;
  notes?: string | null;
  depositAmount?: number;
  paymentStatus?: string;
}) {
  try {
    // 1. Ensure the Service exists in the DB (Upsert using the ID from the store)
    const dbService = await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: {
        id: service.id,
        tenantId,
        name: service.name,
        price: parseFloat(service.price.replace(/[^0-9.]/g, "")) || 0,
        duration: service.duration || 30,
      },
    });

    // 2. Ensure Staff exists if provided
    let dbStaff = null;
    if (staff && staff.id) {
      dbStaff = await prisma.staff.upsert({
        where: { id: staff.id },
        update: {},
        create: {
          id: staff.id,
          tenantId,
          name: staff.name,
          role: "Staff",
        },
      });
    }

    // 3. Ensure Customer exists (using phone as key)
    let dbCustomer = await prisma.customer.findFirst({
      where: { 
        tenantId,
        phone: customerPhone 
      }
    });

    // Calculate points to add
    const originalPrice = parseFloat(service.price.replace(/[^0-9.]/g, "")) || 0;
    const finalPrice = originalPrice * (1 - (discountPercentage || 0) / 100);
    const pointsEarned = Math.floor(finalPrice / 3);

    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          tenantId,
          name: customerName,
          phone: customerPhone,
          points: pointsEarned,
        }
      });
    } else {
      dbCustomer = await prisma.customer.update({
        where: { id: dbCustomer.id },
        data: {
          points: {
            increment: pointsEarned
          }
        }
      });
    }

    const tenant = await getTenantById(tenantId);
    if (tenant?.autoApproveBooking && status === "Pending") {
      status = "Confirmed";
    }

    // 4. Create the Booking
    const booking = await prisma.booking.create({
      data: {
        tenantId,
        customerName,
        customerPhone,
        serviceId: dbService.id,
        staffId: dbStaff ? dbStaff.id : null,
        customerId: dbCustomer.id,
        date: new Date(date), // YYYY-MM-DD format parsed to Date
        time, // HH:MM format
        status: status as BookingStatus,
        notes,
        depositAmount,
        paymentStatus: paymentStatus as PaymentStatus,
      },
    });

    // 5. Redeem Promotion if any
    if (promotionPrize) {
      const claim = await prisma.promotionClaim.findFirst({
        where: { tenantId, phone: customerPhone, status: "Unused" }
      });
      if (claim) {
        await prisma.promotionClaim.update({
          where: { id: claim.id },
          data: { status: "Redeemed" }
        });
      }
    }

    // 6. Send SMS Notification
    try {
      const settings = await getSystemSettings();
      if (tenant && tenant.smsEnabled && customerPhone && settings) {
        let template = "";
        const smsTemplates: any = tenant.smsTemplates || {};
        
        if (status === "Confirmed") {
           template = smsTemplates.approved || settings.approvedSmsTemplate || "%tenant_name%: %service_name% apt at %appointment_start_time% %appointment_date% is confirmed.";
        } else {
           template = smsTemplates.pending || settings.pendingSmsTemplate || "%tenant_name%: %service_name% apt at %appointment_start_time% %appointment_date% is pending.";
        }

        const message = replaceSmsVariables(template, {
          customerName,
          serviceName: service.name,
          date,
          time,
          tenantName: tenant.name
        });
        await sendSMS(tenantId, customerPhone, message);
      }
      
      // Send SMS Notification to Salon
      if (tenant && tenant.smsEnabled) {
        const adminPhone = tenant.bookingPhone || tenant.phone;
        if (adminPhone) {
          const prefix = tenant.name ? tenant.name.substring(0,10) : "Vici";
          const adminMessage = `${prefix}: New apt for ${customerName} (${customerPhone}) - ${service.name.substring(0,10)} at ${time} ${new Date(date).toLocaleDateString('en-US')}.`;
          await sendSMS(tenantId, adminPhone, adminMessage);
        }
      }
    } catch (smsError) {
      console.error("Failed to send SMS:", smsError);
    }

    // 7. Create Notification for Admin
    try {
      await createNotification(
        tenantId,
        "appointment",
        "New Appointment",
        `${customerName} just booked ${service.name} on ${date} at ${time}.`
      );

      // 8. Trigger Web Push Notification
      const tenant = await getTenantById(tenantId);
      if (tenant) {
        await sendPushNotification(
          tenantId,
          "New Appointment! 📅",
          `${customerName} just booked ${service.name} on ${date} at ${time}`,
          `/${tenant.slug}/admin/appointments`
        );
      }
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    // Revalidate paths so they show up immediately
    revalidatePath(`/[tenantSlug]/admin/calendar`, "page");
    revalidatePath(`/[tenantSlug]/admin/appointments`, "page");
    
    return { 
      success: true, 
      booking: JSON.parse(JSON.stringify(booking)) 
    };
  } catch (error) {
    console.error("Failed to create booking:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create booking." };
  }
}

export async function createMultipleBookings({
  tenantId,
  customerName,
  customerPhone,
  services,
  staff,
  date,
  time,
  status = "Pending",
  discountPercentage = 0,
  promotionPrize = null,
  notes = null,
  depositAmount = 0,
  paymentStatus = "Unpaid",
}: {
  tenantId: string;
  customerName: string;
  customerPhone: string;
  services: { id: string; name: string; price: string; duration?: number }[];
  staff: { id: string; name: string } | null;
  date: string;
  time: string;
  status?: string;
  discountPercentage?: number;
  promotionPrize?: string | null;
  notes?: string | null;
  depositAmount?: number;
  paymentStatus?: string;
}) {
  try {
    if (!services || services.length === 0) {
      throw new Error("No services provided");
    }

    // 1. Ensure Customer exists (using phone as key)
    let dbCustomer = await prisma.customer.findFirst({
      where: { 
        tenantId,
        phone: customerPhone 
      }
    });

    let totalPointsEarned = 0;
    
    // 2. Ensure Staff exists if provided
    let dbStaff = null;
    if (staff && staff.id) {
      dbStaff = await prisma.staff.upsert({
        where: { id: staff.id },
        update: {},
        create: {
          id: staff.id,
          tenantId,
          name: staff.name,
          role: "Staff",
        },
      });
    }

    const tenant = await getTenantById(tenantId);
    let finalStatus = status;
    if (tenant?.autoApproveBooking && status === "Pending") {
      finalStatus = "Confirmed";
    }

    const createdBookings: any[] = [];
    const serviceNames = [];

    // 3. Loop through each service to create a booking row
    for (const service of services) {
      const dbService = await prisma.service.upsert({
        where: { id: service.id },
        update: {},
        create: {
          id: service.id,
          tenantId,
          name: service.name,
          price: parseFloat(service.price.replace(/[^0-9.]/g, "")) || 0,
          duration: service.duration || 30,
        },
      });

      const originalPrice = parseFloat(service.price.replace(/[^0-9.]/g, "")) || 0;
      const finalPrice = originalPrice * (1 - (discountPercentage || 0) / 100);
      totalPointsEarned += Math.floor(finalPrice / 3);

      const newBooking = await prisma.booking.create({
        data: {
          tenantId,
          customerName,
          customerPhone,
          serviceId: dbService.id,
          staffId: dbStaff ? dbStaff.id : null,
          customerId: dbCustomer?.id || undefined,
          date: new Date(date),
          time,
          status: finalStatus as any,
          notes,
          depositAmount: createdBookings.length === 0 ? depositAmount : 0, // only apply deposit to first booking
          paymentStatus: paymentStatus as any,
        },
      });
      
      createdBookings.push(newBooking);
      serviceNames.push(service.name);
    }

    // 4. Update or Create Customer with combined points
    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          tenantId,
          name: customerName,
          phone: customerPhone,
          points: totalPointsEarned,
        }
      });
      // Link the customer ID to the bookings we just created
      await prisma.booking.updateMany({
        where: { id: { in: createdBookings.map(b => b.id) } },
        data: { customerId: dbCustomer.id }
      });
    } else {
      dbCustomer = await prisma.customer.update({
        where: { id: dbCustomer.id },
        data: {
          points: {
            increment: totalPointsEarned
          }
        }
      });
    }

    // 5. Redeem Promotion if any
    if (promotionPrize) {
      const claim = await prisma.promotionClaim.findFirst({
        where: { tenantId, phone: customerPhone, status: "Unused" }
      });
      if (claim) {
        await prisma.promotionClaim.update({
          where: { id: claim.id },
          data: { status: "Redeemed" }
        });
      }
    }

    const combinedServiceNames = serviceNames.join(", ");

    // 6. Send ONE combined SMS Notification
    try {
      const settings = await getSystemSettings();
      if (tenant && (tenant as any).smsEnabled && customerPhone && settings) {
        let template = "";
        const smsTemplates: any = (tenant as any).smsTemplates || {};
        
        if (services.length > 1 && smsTemplates.multiBooking) {
            template = smsTemplates.multiBooking;
        } else if (finalStatus === "Confirmed") {
            template = smsTemplates.approved || settings.approvedSmsTemplate || "%tenant_name%: %service_name% apt at %appointment_start_time% %appointment_date% is confirmed.";
        } else {
            template = smsTemplates.pending || settings.pendingSmsTemplate || "%tenant_name%: %service_name% apt at %appointment_start_time% %appointment_date% is pending.";
        }

        if (template) {
          const message = replaceSmsVariables(template, {
            customerName,
            serviceName: combinedServiceNames,
            date,
            time,
            tenantName: tenant.name
          });
          await sendSMS(tenantId, customerPhone, message);
        }

        // Send SMS Notification to Salon
        const adminPhone = (tenant as any).bookingPhone || (tenant as any).phone;
        if (adminPhone) {
          const prefix = tenant.name ? tenant.name.substring(0,10) : "Vici";
          const adminMessage = `${prefix}: New apt for ${customerName} (${customerPhone}) - ${combinedServiceNames.substring(0,10)} at ${time} ${new Date(date).toLocaleDateString('en-US')}.`;
          await sendSMS(tenantId, adminPhone, adminMessage);
        }
      }
    } catch (smsError) {
      console.error("Failed to send multi SMS:", smsError);
    }

    // 7. Create ONE Notification for Admin
    try {
      await createNotification(
        tenantId,
        "appointment",
        "New Appointment",
        `${customerName} just booked ${combinedServiceNames} on ${date} at ${time}.`
      );

      // 8. Trigger ONE Web Push Notification
      await sendPushNotification(
        tenantId,
        "New Appointment! 📅",
        `${customerName} just booked ${combinedServiceNames} on ${date} at ${time}`,
        `/${tenant.slug}/admin/appointments`
      );
    } catch (notifError) {
      console.error("Failed to create multi notification:", notifError);
    }

    revalidatePath(`/[tenantSlug]/admin/calendar`, "page");
    revalidatePath(`/[tenantSlug]/admin/appointments`, "page");
    
    return { 
      success: true, 
      bookings: JSON.parse(JSON.stringify(createdBookings)) 
    };
  } catch (error) {
    console.error("Failed to create multiple bookings:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create multiple bookings." };
  }
}

export async function getBookings(tenantId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { tenantId },
      include: {
        service: true,
        staff: true,
      },
      orderBy: [
        { date: "asc" },
        { time: "asc" },
      ],
    });
    // Manual serialization to avoid any hidden BigInt or complex object issues
    const serialized = bookings.map(b => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      service: b.service ? { ...b.service, createdAt: b.service.createdAt.toISOString() } : null,
      staff: b.staff ? { ...b.staff, createdAt: b.staff.createdAt.toISOString() } : null,
    }));

    return JSON.parse(JSON.stringify(serialized));
  } catch (error) {
    console.error("Failed to fetch bookings in action:", error);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: string, tenantId: string) {
  try {
    // Verify ownership indirectly by including tenantId in the where clause
    const booking = await prisma.booking.update({
      where: { 
        id: id,
        tenantId: tenantId 
      },
      data: { status: status as any },
      include: {
        service: true,
        tenant: true,
        staff: true,
      }
    });

    // Handle Commission calculation on completion
    if (status === "Completed" && booking.staffId && booking.staff) {
      const commissionRate = booking.staff.commissionRate || 0; // percentage
      if (commissionRate > 0) {
        const amount = (booking.service.price * commissionRate) / 100;
        await prisma.commission.upsert({
          where: { bookingId: booking.id },
          update: { amount, staffId: booking.staffId },
          create: {
            tenantId,
            staffId: booking.staffId,
            bookingId: booking.id,
            amount,
          }
        });
      }
    }

    // Handle Loyalty Points on completion
    if (status === "Completed" && booking.service) {
      const pointsEarned = Math.floor(booking.service.price / 10); // $10 = 1 point
      if (pointsEarned > 0) {
        if (booking.customerId) {
          await prisma.customer.update({
            where: { id: booking.customerId },
            data: { points: { increment: pointsEarned } }
          });
        } else if (booking.customerPhone) {
          // Fallback if customerId is missing but phone exists
          const customer = await prisma.customer.findFirst({
            where: { tenantId, phone: booking.customerPhone }
          });
          if (customer) {
            await prisma.customer.update({
              where: { id: customer.id },
              data: { points: { increment: pointsEarned } }
            });
            // Link the booking to customer
            await prisma.booking.update({
              where: { id: booking.id },
              data: { customerId: customer.id }
            });
          }
        }
      }
    }

    // Send SMS Notification (Approved or Rejected)
    if ((status === "Confirmed" || status === "Rejected") && booking.customerPhone) {
      try {
        const tenant = booking.tenant;
        if (tenant && (tenant as any).smsEnabled) {
          const settings = await getSystemSettings();
          if (settings) {
            let template = "";
            const smsTemplates: any = (tenant as any).smsTemplates || {};
            
            if (status === "Confirmed") {
              template = smsTemplates.approved || settings.approvedSmsTemplate || "%tenant_name%: %service_name% apt at %appointment_start_time% %appointment_date% is confirmed.";
            } else if (status === "Rejected") {
              template = smsTemplates.rejected || settings.rejectedSmsTemplate || "%tenant_name%: %service_name% apt at %appointment_start_time% %appointment_date% was REJECTED. Pls contact us.";
            }

            if (template) {
              const message = replaceSmsVariables(template, {
                customerName: booking.customerName,
                serviceName: booking.service.name,
                date: booking.date,
                time: booking.time,
                tenantName: booking.tenant.name
              });
              await sendSMS(tenantId, booking.customerPhone, message);
            }
          }
        }
      } catch (smsError) {
        console.error(`Failed to send ${status} SMS:`, smsError);
      }
    }

    
    revalidatePath(`/[tenantSlug]/admin/calendar`, "page");
    revalidatePath(`/[tenantSlug]/admin/appointments`, "page");
    return { success: true, booking: JSON.parse(JSON.stringify(booking)) };
  } catch (error) {
    console.error("Failed to update booking status:", error);
    return { success: false, error: "Failed to update booking status." };
  }
}
