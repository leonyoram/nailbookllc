import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { getSystemSettings } from "@/lib/landing_settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Nail Book 24/7",
    default: "Nail Book 24/7 - Giải Pháp Quản Lý & Đặt Lịch Tiệm Nail Số 1",
  },
  description: "Nền tảng quản lý tiệm Nail toàn diện: tự động hóa đặt lịch, quản lý nhân viên, tính lương và chăm sóc khách hàng. Giúp chủ tiệm rảnh tay, tăng doanh thu.",
  keywords: ["quản lý tiệm nail", "phần mềm tiệm nail", "đặt lịch tiệm nail", "nail book 247", "app tiệm nail"],
  openGraph: {
    title: "Nail Book 24/7 - Giải Pháp Quản Lý Tiệm Nail",
    description: "Tự động hóa đặt lịch, quản lý nhân viên và chăm sóc khách hàng 24/7.",
    url: "https://nailbook247.com",
    siteName: "Nail Book 24/7",
    images: [
      {
        url: "/images/slider-1.png",
        width: 1200,
        height: 630,
        alt: "Giao diện quản lý tiệm Nail chuyên nghiệp của Nail Book 24/7",
      }
    ],
    locale: "vi_VN",
    type: "website",
  }
};

export default async function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSystemSettings();
  const phone = settings.phone;

  return (
    <div className="flex flex-col min-h-screen">
      <SmoothScroll>
        <Navbar phone={phone} />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact phone={phone} />
      </SmoothScroll>
    </div>
  );
}
