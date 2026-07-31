import Link from "next/link";
import Image from "next/image";
import { Scissors, MapPin, Phone, Mail, Clock } from "lucide-react";

import { getSystemSettings } from "@/lib/landing_settings";

export async function Footer() {
  const settings = await getSystemSettings();

  return (
    <footer className="bg-muted text-muted-foreground pt-16 pb-8 border-t">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-foreground">
            <div className="relative h-16 w-52 md:h-20 md:w-60">
              <Image 
                src="/images/Logo/Nail Book LLC Transparent.png" 
                alt="Nail Book 24/7 - Phần mềm quản lý tiệm Nail và Spa chuyên nghiệp" 
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>
          <p className="text-sm">
            Giải pháp chuyển đổi số toàn diện dành riêng cho ngành công nghiệp làm đẹp: Tiệm Nail, Hair Salon, Spa.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4">Liên Kết Nhanh</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link></li>
            <li><Link href="/gioi-thieu" className="hover:text-primary transition-colors">Về Chúng Tôi</Link></li>
            <li><Link href="/dich-vu" className="hover:text-primary transition-colors">Giải Pháp</Link></li>
            <li><Link href="/danh-gia" className="hover:text-primary transition-colors">Khách Hàng</Link></li>
            <li><Link href="/faqs" className="hover:text-primary transition-colors">Hỏi Đáp</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4">Dịch Vụ Chính</h3>
          <ul className="space-y-2 text-sm">
            <li>Hệ Thống Đặt Lịch Hẹn</li>
            <li>Nhắc Lịch Tự Động SMS</li>
            <li>Quản Lý Thợ & Hoa Hồng</li>
            <li>Marketing Đa Kênh</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4">Liên Hệ</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>123 Innovation Drive, Tech City, TX 75001</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 shrink-0" />
              <span>{settings.email}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Thứ 2 - Thứ 6: 9:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} Nail Book LLC. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
          <Link href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</Link>
        </div>
      </div>
    </footer>
  );
}
