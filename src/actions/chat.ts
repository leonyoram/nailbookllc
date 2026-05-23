"use server";

import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you set GEMINI_API_KEY in your .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function processChat(tenantId: string, message: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { 
        success: false, 
        reply: "Tính năng AI đang bảo trì do thiếu API Key. Vui lòng liên hệ Admin." 
      };
    }

    // 1. Fetch Tenant Context
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return { success: false, reply: "Tiệm không tồn tại." };

    // 2. Fetch Services
    const services = await prisma.service.findMany({ where: { tenantId } });
    const serviceList = services.map(s => `- ${s.name} (${s.duration} phút): $${s.price}`).join("\n");

    // 3. Prepare System Prompt (RAG logic)
    const systemInstruction = `
      Bạn là một trợ lý AI thông minh làm việc cho tiệm Nail & Spa tên là "${tenant.name}".
      Thông tin về tiệm:
      - Điện thoại: ${tenant.phone || "Đang cập nhật"}
      - Vị trí: ${tenant.location || "Đang cập nhật"}
      - Giờ làm việc: ${tenant.workingHours || "Đang cập nhật"}
      
      Danh sách dịch vụ của tiệm:
      ${serviceList}

      Quy tắc trả lời:
      1. Luôn lịch sự, thân thiện và nhiệt tình với khách hàng.
      2. Nếu khách hỏi giá hoặc dịch vụ, hãy dựa vào Danh sách dịch vụ trên để trả lời chính xác.
      3. Nếu khách muốn đặt lịch, hướng dẫn họ sử dụng chức năng Đặt lịch trên trang web.
      4. Hãy trả lời ngắn gọn, súc tích (dưới 100 chữ).
    `;

    // 4. Call Gemini API
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction 
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return { success: true, reply: responseText };
  } catch (error) {
    console.error("Chat AI error:", error);
    return { success: false, reply: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau." };
  }
}
