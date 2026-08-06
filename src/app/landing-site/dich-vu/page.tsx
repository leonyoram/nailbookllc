import { getPricingPlans } from "@/lib/constants";
import { CheckCircle2, CalendarDays, Wallet, MessageSquare, LineChart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

export const metadata = {
  title: "Dịch Vụ & Bảng Giá",
  description: "Chi tiết các tính năng giải pháp và bảng giá cho Tiệm Nail, Hair Salon, Spa.",
};

const Z_PATTERN_FEATURES = [
  {
    id: "booking",
    title: "1. Đặt Lịch Hẹn & Quản Lý Lịch Trình",
    description: "Khách hàng có thể dễ dàng đặt lịch 24/7. Toàn bộ lịch trình sẽ được hiển thị trực quan dưới dạng Calendar hoặc Danh sách trên hệ thống quản lý, giúp bạn theo dõi giờ giấc trống của từng thợ để tối ưu hóa doanh thu.",
    image: "/images/App/calendar.png",
    icon: CalendarDays,
    reverse: false
  },
  {
    id: "payroll",
    title: "2. Chấm Công & Tính Lương Tự Động",
    description: "Tự động ghi nhận giờ vào, giờ ra của nhân viên. Hệ thống sẽ thay bạn tính toán chi li từng đồng lương cứng, phần trăm hoa hồng (Commission), tiền Tip và các khoản phụ cấp/phạt để tạo ra phiếu lương (Payslip) cực kỳ chuẩn xác.",
    image: "/images/App/payroll.png",
    icon: Wallet,
    reverse: true
  },
  {
    id: "marketing",
    title: "3. Marketing SMS & Nhắc Hẹn",
    description: "Tự động gửi tin nhắn (SMS) nhắc nhở khách hàng trước giờ hẹn để giảm tỷ lệ hủy lịch (No-shows). Ngoài ra, hệ thống cho phép tạo các chương trình Vòng Quay May Mắn (Lucky Wheel) hoặc gửi mã giảm giá (Coupon) hàng loạt.",
    image: "/images/App/sms_marketing.png",
    icon: MessageSquare,
    reverse: false
  },
  {
    id: "reports",
    title: "4. Báo Cáo Doanh Thu Chuyên Sâu",
    description: "Mọi biến động về tài chính, số lượng khách, số lượng lịch hẹn, dịch vụ nào bán chạy nhất đều được hệ thống tổng hợp thành biểu đồ trực quan. Chủ tiệm có thể xem Dashboard thống kê mọi lúc, mọi nơi.",
    image: "/images/App/reports.png",
    icon: LineChart,
    reverse: true
  }
];

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "VI";
  const PRICING_PLANS = getPricingPlans(lang);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Giải Pháp Quản Lý Toàn Diện</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nail Book LLC mang đến hệ thống phần mềm SaaS mạnh mẽ được thiết kế riêng cho ngành Nail & Spa. Mọi quy trình từ đặt lịch, chăm sóc khách hàng đến quản lý lương thợ đều được tự động hóa.
          </p>
        </div>

        {/* Z-Pattern Features Walkthrough */}
        <div className="max-w-6xl mx-auto space-y-24 mb-32">
          {Z_PATTERN_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.id} 
                className={`flex flex-col md:flex-row items-center gap-12 ${feature.reverse ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Image Side */}
                <div className="flex-1 w-full">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border bg-gray-50/50">
                    <Image 
                      src={feature.image} 
                      alt={feature.title} 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                
                {/* Text Side */}
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{feature.title}</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3 pt-4">
                    <li className="flex items-center text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
                      Tối ưu quy trình vận hành
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
                      Giao diện thân thiện, dễ sử dụng
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Section */}
        <div className="mt-32 border-t pt-24">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">Bảng Giá Dịch Vụ</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            Khởi đầu miễn phí, nâng cấp khi tiệm của bạn lớn mạnh. Chúng tôi cam kết không phí ẩn.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {PRICING_PLANS.map((plan, index) => (
              <div 
                key={index} 
                className={`relative p-8 rounded-3xl border flex flex-col transition-all duration-300 ${
                  plan.highlight 
                    ? 'bg-primary text-primary-foreground shadow-2xl scale-100 md:scale-105 z-10' 
                    : 'bg-card hover:border-primary/50 hover:shadow-lg'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-950 font-bold px-4 py-1 rounded-full text-sm shadow-md">
                    PHỔ BIẾN NHẤT
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`mb-6 text-sm ${plan.highlight ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                  {plan.desc}
                </p>
                
                <div className="mb-8">
                  <span className="text-5xl font-extrabold">{plan.priceMonthly}</span>
                  <span className={`text-base font-medium ${plan.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    /tháng
                  </span>
                  <div className={`text-sm mt-2 font-medium ${plan.highlight ? 'text-yellow-200' : 'text-primary'}`}>
                    (Chỉ {plan.priceYearly}/tháng nếu thanh toán năm)
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-white' : 'text-primary'}`} />
                      <span className={plan.highlight ? 'text-white/95' : 'text-card-foreground/90'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/lien-he" 
                  className={`inline-flex h-14 w-full items-center justify-center rounded-xl px-8 py-2 text-base font-bold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    plan.highlight 
                      ? 'bg-white text-primary hover:bg-gray-50' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
