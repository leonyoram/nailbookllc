"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPromotion(data: {
  tenantId: string;
  title: string;
  description?: string;
  discount: number;
  type?: string;
  startTime?: string;
  endTime?: string;
  dayOfWeek?: any;
}) {
  try {
    const promo = await prisma.promotion.create({
      data: {
        tenantId: data.tenantId,
        title: data.title,
        description: data.description,
        discount: data.discount,
        type: (data.type as any) || "percentage",
        startTime: data.startTime ? new Date(`1970-01-01T${data.startTime}:00Z`) : null,
        endTime: data.endTime ? new Date(`1970-01-01T${data.endTime}:00Z`) : null,
        dayOfWeek: data.dayOfWeek || null,
        isActive: true,
      },
    });

    revalidatePath(`/[tenantSlug]/admin/promotions`, "page");
    return { success: true, promotion: JSON.parse(JSON.stringify(promo)) };
  } catch (error) {
    console.error("Failed to create promotion:", error);
    return { success: false, error: "System error while creating promotion" };
  }
}

export async function getPromotions(tenantId: string) {
  try {
    const promotions = await prisma.promotion.findMany({
      where: { tenantId, isActive: true },
    });
    return JSON.parse(JSON.stringify(promotions));
  } catch (error) {
    console.error("Failed to fetch promotions:", error);
    return [];
  }
}

export async function getUnusedPromotion(tenantId: string, phone: string) {
  try {
    const claim = await prisma.promotionClaim.findFirst({
      where: { tenantId, phone, status: "Unused" }
    });
    return claim;
  } catch (error) {
    console.error("Failed to get unused promotion:", error);
    return null;
  }
}

export async function checkEligibility(tenantId: string, phone: string) {
  try {
    const customer = await prisma.customer.findFirst({ where: { tenantId, phone } });
    if (customer) return { eligible: false, reason: "already_customer" };

    const claim = await prisma.promotionClaim.findFirst({ where: { tenantId, phone } });
    if (claim) return { eligible: false, reason: "already_spun" };

    return { eligible: true };
  } catch (error) {
    console.error("Failed to check eligibility:", error);
    return { eligible: false, reason: "error" };
  }
}

export async function claimPromotion(tenantId: string, phone: string) {
  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    let prize = "10% Off";

    if (tenant?.luckyWheelConfig) {
      try {
        const config = tenant.luckyWheelConfig as any;
        if (Array.isArray(config) && config.length > 0) {
          // simple random pick for now
          const randomIdx = Math.floor(Math.random() * config.length);
          prize = config[randomIdx].label || config[randomIdx].prize || "10% Off";
        }
      } catch (e) {
        console.error("Failed to parse lucky wheel config");
      }
    }

    const claim = await prisma.promotionClaim.create({
      data: {
        tenantId,
        phone,
        prize,
        status: "Unused",
      }
    });

    return { success: true, prize: claim.prize };
  } catch (error) {
    console.error("Failed to claim promotion:", error);
    return { success: false, error: "System error while claiming promotion" };
  }
}
