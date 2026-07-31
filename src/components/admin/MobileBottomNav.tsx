"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  ListTodo, 
  Settings,
  MoreHorizontal
} from "lucide-react";

interface MobileBottomNavProps {
  isDarkMode: boolean;
  onMoreClick: () => void;
}

export default function MobileBottomNav({ isDarkMode, onMoreClick }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { tenantSlug } = useParams() as { tenantSlug: string };

  const bottomNavItems = [
    { name: "Home", href: `/${tenantSlug}/admin`, icon: LayoutDashboard },
    { name: "Calendar", href: `/${tenantSlug}/admin/calendar`, icon: CalendarDays },
    { name: "Appts", href: `/${tenantSlug}/admin/appointments`, icon: ListTodo },
    { name: "Settings", href: `/${tenantSlug}/admin/settings`, icon: Settings },
  ];

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t pb-[env(safe-area-inset-bottom)] flex items-center justify-around px-2 py-2 ${
      isDarkMode ? "bg-black border-zinc-800" : "bg-white border-gray-200"
    }`}>
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${tenantSlug}/admin`);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center w-full py-1"
          >
            <div className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${
              isActive ? "text-primary" : isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              <Icon size={24} className={isActive ? "text-primary" : ""} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? "text-primary" : ""}`}>
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
      
      <button 
        onClick={onMoreClick}
        className={`flex flex-col items-center justify-center w-full py-1 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <div className="flex flex-col items-center justify-center p-1 rounded-xl transition-colors">
          <MoreHorizontal size={24} />
          <span className="text-[10px] mt-1 font-medium">
            Menu
          </span>
        </div>
      </button>
    </div>
  );
}
