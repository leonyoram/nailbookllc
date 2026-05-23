"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export async function getTenants() {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: JSON.parse(JSON.stringify(tenants)) };
  } catch (error) {
    console.error("Failed to fetch tenants:", error);
    return { success: false, error: "Failed to fetch tenants" };
  }
}

// Helper function to run maintenance tasks (not cached)
export async function runMaintenance() {
  try {
    // 1. Data migration: If dueDate is null, set it to createdAt + 1 year
    const tenantsWithNullDue = await prisma.tenant.findMany({
      where: { dueDate: null }
    });
    
    if (tenantsWithNullDue.length > 0) {
      for (const t of tenantsWithNullDue) {
        const newDue = new Date(t.createdAt);
        newDue.setFullYear(newDue.getFullYear() + 1);
        await prisma.tenant.update({
          where: { id: t.id },
          data: { dueDate: newDue }
        });
      }
    }

    // 2. Auto-expire check: Transition "Active" to "Pending" if dueDate has passed
    const now = new Date();
    await prisma.tenant.updateMany({
      where: {
        status: "Active",
        dueDate: { lt: now }
      },
      data: {
        status: "Pending"
      }
    });

    revalidatePath("/super-admin");
    return { success: true };
  } catch (error) {
    console.error("Maintenance error:", error);
    return { success: false };
  }
}

export async function getTenantBySlug(slug: string) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });
    return tenant ? JSON.parse(JSON.stringify(tenant)) : null;
  } catch (error) {
    console.error("Failed to fetch tenant by slug:", error);
    return null;
  }
}

export const getTenantById = unstable_cache(
  async (id: string) => {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id }
      });
      return tenant ? JSON.parse(JSON.stringify(tenant)) : null;
    } catch (error) {
      console.error("Failed to fetch tenant by id:", error);
      return null;
    }
  },
  ["tenant-by-id"],
  { tags: ["tenants"] }
);


export async function createTenant(data: any) {
  try {
    const { name, slug, adminEmail, adminPassword, itPassword, themeColor, logo, location, phone, bookingPhone, payments } = data;

    if (!name || !slug || !adminEmail || !adminPassword) {
      return { success: false, error: "Please fill all required fields (Name, Slug, Email, Password)" };
    }

    const existing = await prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "This URL Slug already exists, please choose another name." };
    }

    const dueDate = new Date();
    dueDate.setFullYear(dueDate.getFullYear() + 1);

    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        adminEmail,
        adminPassword,
        itPassword: itPassword || null,
        themeColor: themeColor || "#000000",
        logo: logo || null,
        location,
        phone,
        bookingPhone,
        payments: payments || null,
        status: "Active",
        dueDate: dueDate,
        region: data.region || "VN",
        timezone: data.timezone || (data.region === "US" ? "America/New_York" : "Asia/Ho_Chi_Minh"),
        currency: data.currency || (data.region === "US" ? "USD" : "VND"),
        locale: data.locale || (data.region === "US" ? "en" : "vi"),
        enabledFeatures: data.enabledFeatures ? data.enabledFeatures : ["promotions", "staff", "attendance", "sms", "chatbot", "reports", "googleReviews", "social", "payments", "workingHours", "staffTimeOff"],
      },
    });

    revalidatePath("/super-admin");
    return { success: true, data: JSON.parse(JSON.stringify(tenant)) };
  } catch (error) {
    console.error("Failed to create tenant:", error);
    return { success: false, error: "An error occurred while creating tenant in database." };
  }
}

export async function updateTenantSettings(tenantId: string, data: any) {
  try {
    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        location: data.location !== undefined ? data.location : undefined,
        phone: data.phone !== undefined ? data.phone : undefined,
        bookingPhone: data.bookingPhone !== undefined ? data.bookingPhone : undefined,
        slotInterval: data.slotInterval !== undefined ? (parseInt(data.slotInterval) || 30) : undefined,
        minLeadTime: data.minLeadTime !== undefined ? (parseInt(data.minLeadTime) || 60) : undefined,
        themeColor: data.themeColor !== undefined ? data.themeColor : undefined,
        adminEmail: data.adminEmail !== undefined ? data.adminEmail : undefined,
        adminPassword: data.adminPassword !== undefined ? data.adminPassword : undefined,
        itPassword: data.itPassword !== undefined ? data.itPassword : undefined,
        logo: data.logo !== undefined ? data.logo : undefined,
        googleReviewUrl: data.googleReviewUrl !== undefined ? data.googleReviewUrl : undefined,
        socialLinks: data.socialLinks !== undefined ? (typeof data.socialLinks === 'object' ? JSON.stringify(data.socialLinks) : data.socialLinks) : undefined,
        paymentConfig: data.paymentConfig !== undefined ? data.paymentConfig : undefined,
        payments: data.payments !== undefined ? data.payments : undefined,
        chatbotEnabled: data.chatbotEnabled !== undefined ? data.chatbotEnabled : undefined,
        chatbotConfig: data.chatbotConfig !== undefined ? data.chatbotConfig : undefined,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        region: data.region !== undefined ? data.region : undefined,
        timezone: data.timezone !== undefined ? data.timezone : undefined,
        currency: data.currency !== undefined ? data.currency : undefined,
        locale: data.locale !== undefined ? data.locale : undefined,
        defaultSalaryCycle: data.defaultSalaryCycle !== undefined ? data.defaultSalaryCycle : undefined,
        enabledFeatures: data.enabledFeatures !== undefined ? data.enabledFeatures : undefined,
        smsEnabled: data.smsEnabled !== undefined ? data.smsEnabled : undefined,
        autoApproveBooking: data.autoApproveBooking !== undefined ? data.autoApproveBooking : undefined,
        smsTemplates: data.smsTemplates !== undefined ? data.smsTemplates : undefined,
        smsLimit: data.smsLimit !== undefined ? parseInt(data.smsLimit) : undefined,
        planType: data.planType !== undefined ? data.planType : undefined,
        staffLimit: data.staffLimit !== undefined ? parseInt(data.staffLimit) : undefined,
      },
    });

    revalidatePath(`/${tenant.slug}/admin/settings`);
    return { success: true, data: JSON.parse(JSON.stringify(tenant)) };
  } catch (error: any) {
    console.error("Failed to update tenant settings:", error);
    return { success: false, error: `System error: ${error.message || "Unknown cause"}` };
  }
}

export async function deleteTenant(tenantId: string) {
  try {
    // Delete tenant (cascading deletes should be handled by DB or manually if needed)
    // In our schema, we should ensure related data is handled.
    await prisma.tenant.delete({
      where: { id: tenantId }
    });

    revalidatePath("/super-admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete tenant:", error);
    return { success: false, error: "Failed to delete tenant. Ensure all related data is handled." };
  }
}

export async function updateLuckyWheel(tenantId: string, data: { enabled?: boolean, config?: any }) {
  try {
    const current = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { luckyWheelEnabled: true, luckyWheelLastDisabled: true }
    });

    if (!current) return { success: false, error: "Tenant not found" };

    const updateData: any = {};
    
    if (data.enabled !== undefined) {
      if (data.enabled) {
        // Turning ON: Check 7-day rule
        if (current.luckyWheelLastDisabled) {
          const lastDisabled = new Date(current.luckyWheelLastDisabled);
          const diffDays = (new Date().getTime() - lastDisabled.getTime()) / (1000 * 3600 * 24);
          if (diffDays < 7) {
            const remaining = Math.ceil(7 - diffDays);
            return { success: false, error: `You must wait another ${remaining} days before you can turn on the lucky wheel again.` };
          }
        }
        updateData.luckyWheelEnabled = true;
      } else {
        // Turning OFF
        updateData.luckyWheelEnabled = false;
        updateData.luckyWheelLastDisabled = new Date();
      }
    }

    if (data.config) {
      updateData.luckyWheelConfig = data.config;
    }

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData
    });

    revalidatePath(`/${tenant.slug}/admin/promotions`);
    return { success: true, data: JSON.parse(JSON.stringify(tenant)) };
  } catch (error: any) {
    console.error("Failed to update lucky wheel:", error);
    return { success: false, error: "System error while updating lucky wheel" };
  }
}

export async function updateWorkingHours(tenantId: string, data: { workingHours?: any, holidays?: string[] }) {
  try {
    const updateData: any = {};
    if (data.workingHours !== undefined) {
      updateData.workingHours = data.workingHours;
    }
    if (data.holidays !== undefined) {
      updateData.holidays = data.holidays;
    }

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData
    });

    revalidatePath(`/${tenant.slug}/admin/working-hours`);
    return { success: true, data: JSON.parse(JSON.stringify(tenant)) };
  } catch (error: any) {
    console.error("Failed to update working hours:", error);
    return { success: false, error: "System error while updating working hours" };
  }
}

export async function getTenantStats(tenantId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { tenantId, status: { not: "Cancelled" } },
      include: { service: true }
    });

    const revenue = bookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);
    const bookingCount = bookings.length;

    const staffCount = await prisma.staff.count({
      where: { tenantId }
    });

    const serviceCounts: Record<string, {name: string, count: number}> = {};
    bookings.forEach(b => {
      if (b.service) {
        if (!serviceCounts[b.service.id]) {
          serviceCounts[b.service.id] = { name: b.service.name, count: 0 };
        }
        serviceCounts[b.service.id].count += 1;
      }
    });

    const topServices = Object.values(serviceCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return { 
      success: true, 
      data: { revenue, bookingCount, staffCount, topServices } 
    };
  } catch (error) {
    console.error("Failed to get stats:", error);
    return { success: false, error: "Failed to get stats" };
  }
}

export async function topUpSmsLimit(tenantId: string, amount: number) {
  try {
    const current = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { smsLimit: true, slug: true }
    });

    if (!current) return { success: false, error: "Tenant not found" };

    let currentLimit = current.smsLimit || 0;
    if (currentLimit === -1) {
      return { success: false, error: "Your plan already has Unlimited SMS." };
    }

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        smsLimit: currentLimit + amount
      }
    });

    revalidatePath(`/${current.slug}/admin/settings`);
    return { success: true, data: { newLimit: updated.smsLimit } };
  } catch (error: any) {
    console.error("Failed to top-up SMS limit:", error);
    return { success: false, error: "System error while adding SMS credits" };
  }
}
