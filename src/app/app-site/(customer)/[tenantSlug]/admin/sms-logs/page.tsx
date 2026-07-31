"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function SmsLogsPage() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;

  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/sms/logs?tenantSlug=${tenantSlug}`);
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [tenantSlug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            Lịch sử SMS
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Xem lịch sử tất cả các tin nhắn SMS đã được gửi.
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Thời gian</th>
              <th className="p-4 font-semibold text-gray-600">Loại</th>
              <th className="p-4 font-semibold text-gray-600">Số điện thoại</th>
              <th className="p-4 font-semibold text-gray-600">Nội dung</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Chưa có lịch sử SMS.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize">
                      {log.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-800">{log.toPhone}</td>
                  <td className="p-4 text-gray-700 max-w-xs truncate" title={log.content}>
                    {log.content}
                  </td>
                  <td className="p-4">
                    {log.status === "Sent" ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle size={14} /> Thành công
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-medium" title={log.error}>
                        <AlertCircle size={14} /> Thất bại
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
