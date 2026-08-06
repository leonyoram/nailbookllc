"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export function FloatingContact({ phone = "+18325988899" }: { phone?: string }) {
  const [currentLang, setCurrentLang] = useState("VI");

  useEffect(() => {
    // Read lang from cookie to sync text if needed
    const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
    if (match) {
      setCurrentLang(match[2]);
    }
  }, []);

  const tooltipText = currentLang === "EN" ? "Call Us Now" : "Gọi Cho Chúng Tôi";

  // Clean phone for href (remove spaces, parentheses, dashes)
  const cleanPhone = phone.replace(/[\s()-]/g, "");

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90] flex items-center gap-4 group">
      {/* Tooltip / Label that appears on hover */}
      <div className="absolute right-[115%] whitespace-nowrap opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-slate-900 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-xl hidden md:block">
        {tooltipText}
        {/* Little triangle arrow pointing to the button */}
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-900"></div>
      </div>

      <a 
        href={`tel:${cleanPhone}`}
        className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-rose-500 to-pink-400/90 backdrop-blur-md border border-white/20 text-white rounded-full shadow-[0_8px_32px_rgba(244,63,94,0.4)] hover:shadow-[0_8px_32px_rgba(244,63,94,0.7)] hover:from-rose-600 hover:to-pink-500 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Pulsing rings for attention */}
        <span className="absolute inset-0 rounded-full border-2 border-rose-500 opacity-50 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
        <span className="absolute inset-[-8px] rounded-full border-2 border-rose-500 opacity-20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-300"></span>
        
        <Phone className="w-6 h-6 md:w-7 md:h-7 animate-pulse" />
      </a>
    </div>
  );
}
