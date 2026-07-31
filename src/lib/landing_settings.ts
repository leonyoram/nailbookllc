"use server";

import { prisma } from "./prisma";

export async function getSystemSettings() {
  try {
    const settings = await prisma.systemSettings.findFirst({
      where: { id: "global" },
    });

    return {
      phone: settings?.contactPhone || "+1 (832) 598-8899",
      email: settings?.contactEmail || "contact@nailbookllc.com",
      facebookLink: settings?.facebookLink || "",
      instagramLink: settings?.instagramLink || "",
      tiktokLink: settings?.tiktokLink || "",
      heroTitle: settings?.heroTitle || "Dành Riêng Cho Tiệm Nail",
      heroSubtitle: settings?.heroSubtitle || "Nền tảng đặt lịch 24/7, tự động thu cọc Deposit, chia Commission cho thợ và kéo khách cũ quay lại. Giải pháp toàn diện cho chủ tiệm người Việt tại Bắc Mỹ.",
      aboutContent: settings?.aboutContent || "",
      videoUrl: settings?.videoUrl || "",
    };
  } catch (error) {
    console.error("Failed to get system settings", error);
    return {
      phone: "+1 (832) 598-8899",
      email: "contact@nailbookllc.com",
    };
  }
}
