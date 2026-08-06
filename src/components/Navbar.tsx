"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setLanguage } from "@/app/landing-site/actions/locale";
import { ThemeToggle } from "@/components/ThemeToggle";

const getNavLinks = (lang: string) => {
  if (lang === "EN") {
    return [
      { name: "Home", href: "/" },
      { name: "About", href: "/gioi-thieu" },
      { 
        name: "Services", 
        href: "/dich-vu",
        subLinks: [
          { name: "Customer App", href: "/dich-vu/khach-hang" },
          { name: "Owner Dashboard", href: "/dich-vu/chu-tiem" },
        ]
      },
      { name: "Reviews", href: "/danh-gia" },
      { name: "FAQs", href: "/faqs" },
    ];
  }
  return [
    { name: "Trang Chủ", href: "/" },
    { name: "Giới Thiệu", href: "/gioi-thieu" },
    { 
      name: "Dịch Vụ", 
      href: "/dich-vu",
      subLinks: [
        { name: "Giao Diện Khách Hàng", href: "/dich-vu/khach-hang" },
        { name: "Giao Diện Chủ Tiệm", href: "/dich-vu/chu-tiem" },
      ]
    },
    { name: "Đánh Giá", href: "/danh-gia" },
    { name: "FAQs", href: "/faqs" },
  ];
};

export function Navbar({ phone = "+18325988899" }: { phone?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("VI");

  const isHomePage = pathname === "/";
  const isHeaderTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    // Read initial lang from cookie
    const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
    if (match) {
      setCurrentLang(match[2]);
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = async (lang: string) => {
    setCurrentLang(lang);
    await setLanguage(lang);
  };

  const navLinks = getNavLinks(currentLang);
  const ctaText = currentLang === "EN" ? "Get Consultation" : "Nhận Tư Vấn";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/60 backdrop-blur-xl border-b shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-white/20 dark:border-white/10 dark:shadow-[0_8px_32px_rgba(255,255,255,0.02)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
          <div className="relative h-14 w-44 md:h-16 md:w-52">
            <Image 
              src="/images/Logo/Nail Book LLC Transparent.png" 
              alt="Nail Book LLC Logo" 
              fill
              className={`object-contain object-left transition-all duration-300 ${isHeaderTransparent ? "brightness-0 invert opacity-90" : ""}`}
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <div key={link.href} className="relative group">
              <Link
                href={link.href}
                className={`transition-colors py-6 inline-block flex items-center gap-1 ${
                  isHeaderTransparent 
                    ? (pathname === link.href || (link.subLinks && pathname.startsWith(link.href))) ? "text-white font-semibold drop-shadow-md" : "text-white/80 hover:text-white drop-shadow-md"
                    : (pathname === link.href || (link.subLinks && pathname.startsWith(link.href))) ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
              {link.subLinks && (
                <div className="absolute top-[80%] left-0 mt-0 w-56 rounded-xl bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-100 overflow-hidden flex flex-col z-50">
                  {link.subLinks.map(sub => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors border-b last:border-0 border-slate-50 font-medium"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/lien-he" className="inline-flex h-9 items-center justify-center rounded-lg bg-rose-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-all hover:bg-rose-600 hover:scale-105 focus-visible:outline-none">{ctaText}</Link>
          
          {/* Language Selector Desktop */}
          <div className="relative group flex items-center pl-2 border-l border-white/20">
            <button
              className={`flex items-center gap-1.5 transition-colors font-semibold ${
                isHeaderTransparent ? "text-white hover:text-white/80 drop-shadow-md" : "text-slate-700 hover:text-primary"
              }`}
            >
              <Globe className="w-5 h-5" />
              <span>{currentLang}</span>
            </button>
            <div className="absolute top-full right-0 mt-2 w-36 rounded-xl bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-100 overflow-hidden flex flex-col z-50">
              <button 
                onClick={() => handleLanguageChange("VI")}
                className={`px-4 py-3 text-sm text-left transition-colors flex items-center gap-2 ${currentLang === 'VI' ? 'text-primary font-bold bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button 
                onClick={() => handleLanguageChange("EN")}
                className={`px-4 py-3 text-sm text-left transition-colors flex items-center gap-2 ${currentLang === 'EN' ? 'text-primary font-bold bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>
          
          <div className={`border-l pl-2 transition-colors ${isHeaderTransparent ? "border-white/20 text-white" : "border-slate-200 text-slate-700"}`}>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className={`md:hidden p-2 transition-colors ${isHeaderTransparent ? "text-white" : "text-foreground"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative h-10 w-36">
              <Image 
                src="/images/Logo/Nail Book LLC Transparent.png" 
                alt="Nail Book LLC Logo" 
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Drawer Body (Links) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => !link.subLinks && setMobileMenuOpen(false)}
                  className={`block transition-colors py-2 text-lg ${
                    (pathname === link.href || (link.subLinks && pathname.startsWith(link.href))) ? "text-primary font-bold" : "text-slate-600 hover:text-primary font-medium"
                  }`}
                >
                  {link.name}
                </Link>
                {link.subLinks && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 border-slate-100 ml-2">
                    {link.subLinks.map(sub => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block transition-colors hover:text-primary py-2 text-base ${
                          pathname === sub.href ? "text-primary font-semibold" : "text-slate-500"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Contact / Call Button */}
          <div className="pt-6 border-t border-slate-100">
            <a 
              href={`tel:${phone.replace(/[\s()-]/g, "")}`}
              className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-100"
            >
              <div className="w-10 h-10 bg-green-200/50 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600/80 mb-0.5">
                  {currentLang === 'EN' ? "Call for Info" : "Gọi để Nhận Thông Tin"}
                </p>
                <p className="font-bold">{phone}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Drawer Footer (CTA & Lang) */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4 mt-auto">
          <Link 
            href="/lien-he" 
            onClick={() => setMobileMenuOpen(false)} 
            className="flex h-12 w-full items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-base font-bold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-600 focus-visible:outline-none"
          >
            {ctaText}
          </Link>
          
          <div className="flex gap-2">
            <button 
              onClick={() => { handleLanguageChange("VI"); setMobileMenuOpen(false); }}
              className={`flex-1 py-3 text-sm rounded-xl flex items-center justify-center gap-2 border transition-all ${currentLang === 'VI' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button 
              onClick={() => { handleLanguageChange("EN"); setMobileMenuOpen(false); }}
              className={`flex-1 py-3 text-sm rounded-xl flex items-center justify-center gap-2 border transition-all ${currentLang === 'EN' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
