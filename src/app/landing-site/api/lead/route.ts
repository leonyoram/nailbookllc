import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const leadSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  salonName: z.string().min(2, "Tên tiệm không hợp lệ"),
  serviceType: z.string().min(1, "Vui lòng chọn loại hình dịch vụ"),
  staffCount: z.string().min(1, "Vui lòng nhập số lượng thợ/ghế"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email HTML template
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: `🎉 Lead Mới: ${validatedData.salonName} - ${validatedData.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-md; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2e7d32;">Khách Hàng Mới Đăng Ký</h2>
          <p><strong>Tên tiệm:</strong> ${validatedData.salonName}</p>
          <p><strong>Họ tên:</strong> ${validatedData.fullName}</p>
          <p><strong>Số điện thoại:</strong> ${validatedData.phone}</p>
          <p><strong>Loại dịch vụ:</strong> ${validatedData.serviceType}</p>
          <p><strong>Số lượng ghế/thợ:</strong> ${validatedData.staffCount}</p>
          <br/>
          <p style="font-size: 12px; color: #888;">Gửi từ hệ thống form Liên hệ Nail Book</p>
        </div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully for:", validatedData.salonName);

    return NextResponse.json({ success: true, message: "Đăng ký thành công!" }, { status: 200 });
  } catch (error) {
    console.error("Error submitting lead:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Lỗi máy chủ khi gửi mail" }, { status: 500 });
  }
}
