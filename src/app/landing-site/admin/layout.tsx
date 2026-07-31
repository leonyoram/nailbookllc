import Link from "next/link";
import { MessageSquare, Settings, LogOut } from "lucide-react";
import { logout } from "@/app/landing-site/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">Nail Book</h2>
          <p className="text-slate-400 text-sm">Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link 
            href="/admin/messages" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Khách hàng liên hệ
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5" />
            Cài đặt Hệ thống
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <form action={logout}>
            <button className="flex w-full items-center gap-3 px-4 py-3 text-rose-400 hover:bg-slate-800 rounded-xl transition-colors text-left">
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 md:hidden">
           <h2 className="text-xl font-bold">Admin Panel</h2>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
