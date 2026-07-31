import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, Star, Gift } from "lucide-react";

export const metadata = {
  title: "Giao Diện Khách Hàng | Nail Book LLC",
  description: "Khám phá trải nghiệm đặt lịch mượt mà dành cho khách hàng của tiệm Nail.",
};

const FEATURES = [
  {
    title: "Đặt Lịch & Giữ Chỗ (Deposit)",
    description: "Khách hàng phải thanh toán một khoản cọc nhỏ (ví dụ $15) bằng thẻ tín dụng để giữ chỗ. Điều này giúp loại bỏ 95% khách hàng ảo và No-Show.",
    icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "Lựa Chọn Thợ Yêu Thích",
    description: "Khách có thể xem danh sách thợ, đọc đánh giá 5 sao và chọn đích danh người thợ mà họ tin tưởng nhất để làm móng hoặc làm tóc.",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    title: "Mã Khuyến Mãi (Coupons)",
    description: "Áp dụng các chương trình giảm giá dịp Lễ, Tết hoặc mã Coupon sinh nhật trực tiếp ngay trên màn hình thanh toán.",
    icon: Gift,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    title: "Đồng Bộ 24/7",
    description: "Ngay khi khách đặt xong, lịch sẽ tự động nhảy vào màn hình iPad của Lễ tân ở tiệm mà không cần bất kỳ thao tác thủ công nào.",
    icon: Clock,
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

export default function CustomerAppPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-16 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 py-12 md:py-20 lg:py-24 max-w-7xl mx-auto w-full">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-rose-50 text-rose-600 font-medium text-sm border border-rose-100">
              Dành Cho Khách Hàng (Customer)
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
              Trải Nghiệm Booking <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">
                Mượt Mà Như TikTok
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
              Biến website/app của tiệm bạn thành một công cụ chốt sale tự động 24/7. Khách hàng dễ dàng chọn dịch vụ, chọn thợ và trả tiền cọc chỉ trong 30 giây.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/lien-he" className="inline-flex h-14 items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 w-full">
                Đăng Ký Demo Ngay
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Không bùng lịch
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Tự động hóa
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white rounded-full scale-110 -z-10"></div>
            
            {/* Main Mobile Mockup */}
            <div className="relative w-64 md:w-72 aspect-[9/19.5] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-900 bg-black z-10 animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute top-0 w-32 h-6 bg-slate-900 rounded-b-3xl z-30 left-1/2 -translate-x-1/2"></div>
              <Image 
                src="/images/Mobile/z7909079601580_129d826787eb83411c6d499ca1ac834b.jpg" 
                alt="App Booking Khách Hàng" 
                fill 
                className="object-cover object-top"
                quality={100}
                unoptimized
              />
            </div>

            {/* Secondary Mobile Mockup (Behind) */}
            <div className="absolute -right-4 md:-right-12 top-12 w-56 md:w-64 aspect-[9/19.5] rounded-[3rem] overflow-hidden shadow-xl border-[10px] border-slate-800 bg-black -z-10 rotate-6 opacity-80">
              <Image 
                src="/images/Mobile/z7909079597224_4b675263f0c477ff7b7605159bc7e36d.jpg" 
                alt="App Booking Lịch Trình" 
                fill 
                className="object-cover object-top"
                quality={100}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 bg-slate-50 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Chi Tiết Tính Năng</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Tất cả những gì khách hàng cần để có một trải nghiệm đặt lịch đẳng cấp.</p>
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
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight">Thanh Toán Trực Tuyến <br/> An Toàn & Bảo Mật</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Tích hợp sẵn các cổng thanh toán hàng đầu. Khách hàng có thể dễ dàng lưu thẻ tín dụng cho các lần booking sau. Tiền cọc (Deposit) được chuyển thẳng vào tài khoản ngân hàng của chủ tiệm.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <span className="text-slate-700">Chấp nhận mọi loại thẻ: Visa, Mastercard, Amex.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <span className="text-slate-700">Tùy chỉnh số tiền cọc cố định hoặc theo % dịch vụ.</span>
              </li>
            </ul>
            <Link href="/dich-vu/chu-tiem" className="inline-flex items-center gap-2 text-rose-500 font-bold hover:text-rose-600">
              Khám phá Giao Diện Chủ Tiệm <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-64 aspect-[9/19.5] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-slate-900">
              <Image 
                src="/images/Mobile/z7909079605741_e89cfe74ebb22d0c55d7ddd21fefe616.jpg" 
                alt="App Thanh Toán" 
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
