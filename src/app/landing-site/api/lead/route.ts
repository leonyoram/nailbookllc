import { NextResponse } from "next/server";
import { z } from "zod";

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

    // TODO: Integrate with email service or database (e.g. Resend, Sendgrid)
    console.log("New Lead Data:", validatedData);

    return NextResponse.json({ success: true, message: "Đăng ký thành công!" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Lỗi máy chủ" }, { status: 500 });
  }
}
