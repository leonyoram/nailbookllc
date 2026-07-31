"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSystemSettings(formData: FormData) {
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  const updateData: any = {};
  if (phone) updateData.contactPhone = phone;
  if (email) updateData.contactEmail = email;

  if (Object.keys(updateData).length > 0) {
    await prisma.systemSettings.upsert({
      where: { id: "global" },
      update: updateData,
      create: { id: "global", ...updateData },
    });
  }

  revalidatePath("/", "layout");
}
