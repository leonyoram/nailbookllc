"use server";

import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const salonName = formData.get("salonName") as string;
  const notes = formData.get("notes") as string;
  
  // Parse the extra info from notes or we could just pass them directly.
  // Wait, in page.tsx we didn't pass serviceType and staffCount as separate fields in formData, we put them in notes.
  // Let's modify the FormData handling from page.tsx! Actually I will update page.tsx to send them properly next.
  // Assuming they are passed as separate fields:
  const serviceType = formData.get("serviceType") as string;
  const staffCount = formData.get("staffCount") as string;

  if (!name || !phone || !email) {
    return { error: "Vui lòng điền đủ Tên, Email và Số điện thoại." };
  }

  try {
    // 1. Save to Database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        salonName,
        serviceType,
        staffCount,
        notes,
      },
    });

    // 2. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email 1: To the Owner
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: `🎉 Lead Mới: ${salonName} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-md; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2e7d32;">Khách Hàng Mới Đăng Ký</h2>
          <p><strong>Tên tiệm:</strong> ${salonName || 'Không nhập'}</p>
          <p><strong>Họ tên:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          <p><strong>Loại dịch vụ:</strong> ${serviceType || 'N/A'}</p>
          <p><strong>Số lượng ghế/thợ:</strong> ${staffCount || 'N/A'}</p>
          <p><strong>Ghi chú:</strong> ${notes}</p>
        </div>
      `,
    });

    // Email 2: To the Customer (Auto-reply)
    await transporter.sendMail({
      from: `"Nail Book LLC" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Cảm ơn bạn đã đăng ký tư vấn tại Nail Book LLC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-md; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2e7d32;">Xin chào ${name},</h2>
          <p>Cảm ơn bạn đã quan tâm đến giải pháp quản lý tiệm của <strong>Nail Book LLC</strong>.</p>
          <p>Chúng tôi đã nhận được thông tin đăng ký của tiệm <strong>${salonName || 'bạn'}</strong>. Một chuyên viên hỗ trợ của chúng tôi sẽ liên hệ với bạn qua số điện thoại <strong>${phone}</strong> trong thời gian sớm nhất để tư vấn trực tiếp 1-1.</p>
          <br/>
          <p>Trân trọng,</p>
          <p><strong>Đội ngũ Nail Book LLC</strong></p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { error: "Đã có lỗi xảy ra. Vui lòng thử lại sau." };
  }
}
