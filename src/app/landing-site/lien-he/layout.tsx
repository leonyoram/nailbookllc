import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên Hệ Tư Vấn & Dùng Thử",
  description: "Liên hệ ngay với Nail Book 24/7 để được tư vấn miễn phí giải pháp chuyển đổi số cho tiệm Nail của bạn. Hỗ trợ nhiệt tình 24/7.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
