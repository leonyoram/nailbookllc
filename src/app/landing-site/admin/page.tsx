import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageSquare, Settings, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const totalMessages = await prisma.contactMessage.count();
  const newMessages = await prisma.contactMessage.count({
    where: { status: "NEW" },
  });

  const recentMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tổng quan</h1>
        <p className="text-slate-500">Chào mừng bạn quay lại hệ thống quản lý Nail Book.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-medium mb-1">Tin nhắn chờ xử lý</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">{newMessages}</span>
              <span className="text-sm text-slate-500">/ {totalMessages} tổng số</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-medium mb-1">Cài đặt hệ thống</p>
            <Link href="/admin/settings" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors">
              Thay đổi cấu hình <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Tin nhắn mới nhất</h2>
          <Link href="/admin/messages" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-medium">
                <th className="px-6 py-4">Tên khách hàng</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Chưa có tin nhắn nào.
                  </td>
                </tr>
              ) : (
                recentMessages.map((msg) => (
                  <tr key={msg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{msg.name}</td>
                    <td className="px-6 py-4 text-slate-600">{msg.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${msg.status === "NEW" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {msg.createdAt.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
