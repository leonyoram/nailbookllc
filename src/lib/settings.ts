"use server";

import { prisma } from "./prisma";

export async function getSystemSettings() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      phone: settingsMap["CONTACT_PHONE"] || "+1 (832) 598-8899",
      email: settingsMap["CONTACT_EMAIL"] || "contact@nailbookllc.com",
    };
  } catch (error) {
    console.error("Failed to get system settings", error);
    return {
      phone: "+1 (832) 598-8899",
      email: "contact@nailbookllc.com",
    };
  }
}
