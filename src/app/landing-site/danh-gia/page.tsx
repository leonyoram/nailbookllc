import { getTestimonials } from "@/lib/constants";
import { Star } from "lucide-react";
import Image from "next/image";
import { cookies } from "next/headers";

export const metadata = {
  title: "Khách Hàng Đánh Giá",
  description: "Cảm nhận từ các chủ tiệm đã và đang sử dụng hệ thống phần mềm.",
};

export default async function ReviewsPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "VI";
  const TESTIMONIALS = getTestimonials(lang);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Câu Chuyện Thành Công</h1>
          <p className="text-lg text-slate-600">
            Hàng ngàn chủ tiệm đã thay đổi cách vận hành và tăng mạnh doanh thu sau khi sử dụng Nail Book LLC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {TESTIMONIALS.map((review, index) => (
            <div key={index} className="bg-card p-8 rounded-2xl shadow-sm border flex flex-col relative pt-12 mt-8">
              {/* Avatar Positioned Top Center */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-card shadow-md">
                  <Image src={review.avatar} alt={review.author} fill className="object-cover" />
                </div>
              </div>
              
              <div className="flex justify-center mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="italic text-muted-foreground mb-8 text-center flex-1">
                "{review.quote}"
              </p>
              
              <div className="text-center border-t pt-4">
                <h4 className="font-bold text-lg">{review.author}</h4>
                <p className="text-sm text-primary font-medium mt-1">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
