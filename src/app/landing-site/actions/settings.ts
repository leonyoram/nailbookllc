"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSystemSettings(formData: FormData) {
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  if (phone) {
    await prisma.systemSetting.upsert({
      where: { key: "CONTACT_PHONE" },
      update: { value: phone },
      create: { key: "CONTACT_PHONE", value: phone, label: "Số điện thoại Hotline" },
    });
  }

  if (email) {
    await prisma.systemSetting.upsert({
      where: { key: "CONTACT_EMAIL" },
      update: { value: email },
      create: { key: "CONTACT_EMAIL", value: email, label: "Email Liên Hệ" },
    });
  }

  revalidatePath("/", "layout");
}
