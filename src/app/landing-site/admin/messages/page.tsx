import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Khách hàng liên hệ</h1>
        <p className="text-slate-500">Danh sách khách hàng đã gửi form tư vấn từ website.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-medium">
                <th className="px-6 py-4">Ngày gửi</th>
                <th className="px-6 py-4">Tên khách hàng</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Tên Tiệm (Salon)</th>
                <th className="px-6 py-4">Lời nhắn</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Chưa có tin nhắn nào.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {msg.createdAt.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{msg.name}</td>
                    <td className="px-6 py-4 text-slate-600">{msg.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{msg.salonName || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={msg.notes || ""}>
                      {msg.notes || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {msg.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
