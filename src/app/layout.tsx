import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Nail Book LLC",
    default: "Nail Book LLC - Giải Pháp Quản Lý & Marketing Tiệm Nail",
  },
  description: "Bứt phá doanh thu và lấp đầy lịch hẹn cho Salon của bạn với nền tảng quản lý toàn diện.",
};

import { getSystemSettings } from "@/lib/settings";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSystemSettings();
  const phone = settings.phone;

  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${outfit.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <Navbar phone={phone} />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingContact phone={phone} />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
