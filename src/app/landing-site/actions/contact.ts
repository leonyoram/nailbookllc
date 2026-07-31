"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const salonName = formData.get("salonName") as string;
  const notes = formData.get("notes") as string;

  if (!name || !phone) {
    return { error: "Vui lòng điền đủ Tên và Số điện thoại." };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        phone,
        salonName,
        notes,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Đã có lỗi xảy ra. Vui lòng thử lại sau." };
  }
}
