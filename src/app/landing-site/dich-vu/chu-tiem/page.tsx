import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, LayoutDashboard, Users, Calculator, LineChart } from "lucide-react";

export const metadata = {
  title: "Giao Diện Chủ Tiệm | Nail Book LLC",
  description: "Giải pháp quản trị toàn diện dành cho chủ tiệm Nail và Lễ tân.",
};

const FEATURES = [
  {
    title: "Trạm Điều Hành Trung Tâm",
    description: "Giao diện Calendar trực quan trên iPad/Desktop giúp Lễ tân dễ dàng kéo thả, đổi lịch, và theo dõi tình trạng khách check-in/check-out theo thời gian thực.",
    icon: LayoutDashboard,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    title: "Quản Lý Thợ & Xoay Turn",
    description: "Hệ thống tự động sắp xếp vòng xoay ca (Turn) công bằng cho các thợ. Biết chính xác thợ nào đang rảnh, thợ nào đang phục vụ khách.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "Tính Hoa Hồng (Commission) & Thuế",
    description: "Tạm biệt sổ sách tính tay. Cuối ngày, hệ thống tự động chốt lương cho từng thợ, tự động cộng tiền Tip. Hỗ trợ xuất báo cáo cuối năm phục vụ khai thuế IRS (cho thợ W-2 và 1099).",
    icon: Calculator,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    title: "Báo Cáo Doanh Thu Real-time",
    description: "Chủ tiệm có thể ngồi ở nhà vẫn biết chính xác hôm nay tiệm thu được bao nhiêu tiền mặt, bao nhiêu qua thẻ, dịch vụ nào đang bán chạy nhất.",
    icon: LineChart,
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
];

export default function OwnerDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-16 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 py-12 md:py-20 lg:py-24 max-w-7xl mx-auto w-full">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-indigo-50 text-indigo-600 font-medium text-sm border border-indigo-100">
            Dành Cho Chủ Tiệm (Owner) & Lễ Tân
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            Quản Lý Toàn Bộ Tiệm Nail <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Trực Quan & Khép Kín
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
            Một màn hình duy nhất cho Lễ tân thao tác nhanh như chớp. Một chiếc điện thoại duy nhất cho Chủ tiệm kiểm soát dòng tiền dù đang ở bất cứ đâu.
          </p>
          <Link href="/lien-he" className="inline-flex h-14 items-center justify-center rounded-full bg-indigo-600 px-10 py-3 text-lg font-bold text-white shadow-xl shadow-indigo-500/30 transition-transform hover:scale-105 hover:bg-indigo-700">
            Trải Nghiệm Admin Dashboard
          </Link>
        </div>

        {/* Dashboard Mockup Center */}
        <div className="relative w-full aspect-[16/10] max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border-[8px] border-slate-900 bg-slate-900 z-10">
          {/* Browser-like Header */}
          <div className="absolute top-0 inset-x-0 h-8 bg-slate-800/90 flex items-center px-4 gap-2 z-20 border-b border-slate-700/50">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          
          <div className="absolute top-8 inset-0 bottom-0">
            <Image 
              src="/images/Desktop/Screenshot_5.png" 
              alt="Dashboard Quản Lý Lễ Tân" 
              fill 
              className="object-cover object-top"
              quality={100}
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 bg-slate-50 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Tính Năng Vượt Trội</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Thiết kế chuẩn SaaS, giảm thiểu thao tác thủ công, chống thất thoát doanh thu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {FEATURES.map((feat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex gap-6 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${feat.bg}`}>
                  <feat.icon className={`w-8 h-8 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight">App Riêng Dành Cho Thợ <br/> (Staff App)</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Mỗi thợ trong tiệm sẽ được cấp một tài khoản đăng nhập riêng trên điện thoại của họ để tự theo dõi công việc mà không cần hỏi Lễ tân.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                <span className="text-slate-700">Xem lịch hẹn của bản thân trong ngày/tuần.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                <span className="text-slate-700">Theo dõi Commission và tiền Tip cộng dồn minh bạch.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                <span className="text-slate-700">Chặn thợ xem dữ liệu tổng của tiệm (chỉ chủ tiệm mới thấy).</span>
              </li>
            </ul>
            <Link href="/dich-vu/khach-hang" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700">
              <ArrowRight className="w-5 h-5 rotate-180" /> Xem Giao Diện Khách Hàng 
            </Link>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-64 aspect-[9/19.5] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-slate-900">
              <Image 
                src="/images/Mobile/z7909079609207_c27b9fb56dbf7314f8e475ebd3905280.jpg" 
                alt="App Quản Lý Dành Cho Thợ" 
                fill 
                className="object-cover object-top"
                quality={100}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
