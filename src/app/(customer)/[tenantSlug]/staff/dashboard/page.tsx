"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStaffDashboardData } from "@/actions/staff-portal";
import { logoutStaff } from "@/actions/auth";
import { LogOut, Calendar as CalendarIcon, DollarSign, Clock, User, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function StaffDashboardPage() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getStaffDashboardData(tenantSlug);
      if (res.success) {
        setData(res.data);
      } else {
        toast.error("Session expired. Please login again.");
        router.push(`/${tenantSlug}/staff/login`);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [tenantSlug, router]);

  const handleLogout = async () => {
    await logoutStaff(tenantSlug);
    router.push(`/${tenantSlug}/staff/login`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
            {data?.staff?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">{data?.staff?.name}</h1>
            <p className="text-xs text-gray-500">{data?.staff?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Weekly Commission Widget */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <DollarSign size={80} />
          </div>
          <p className="text-primary-100 text-sm font-medium mb-1">This Week's Earnings</p>
          <h2 className="text-3xl font-bold">${data?.weeklyCommission?.toFixed(2) || "0.00"}</h2>
          <div className="mt-4 inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            <CheckCircle size={14} /> Updated just now
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon size={18} className="text-primary" /> Today's Schedule
            </h3>
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {data?.todaysBookings?.length || 0} appts
            </span>
          </div>

          <div className="space-y-3">
            {data?.todaysBookings?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 border-dashed">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No appointments today</p>
                <p className="text-xs text-gray-400 mt-1">Enjoy your free time!</p>
              </div>
            ) : (
              data?.todaysBookings?.map((booking: any) => (
                <div key={booking.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 items-start">
                  <div className="flex flex-col items-center bg-gray-50 rounded-xl px-3 py-2 min-w-[70px]">
                    <span className="text-sm font-bold text-gray-900">{booking.time}</span>
                    <span className="text-xs text-gray-500">{booking.service?.duration}m</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h4 className="font-bold text-gray-900 truncate">{booking.service?.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 truncate">
                      <User size={14} /> {booking.customerName}
                    </p>
                  </div>
                  <div className="pt-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                      booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
