"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Target, Zap, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const values = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Đơn giản & Tiện lợi",
    description: "Tối ưu hóa quy trình quản lý, giúp chủ tiệm tiết kiệm hàng giờ đồng hồ mỗi ngày.",
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Tối ưu Vận hành",
    description: "Công nghệ tự động hóa giảm thiểu sai sót, tối đa hóa năng suất nhân viên.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Chuyên nghiệp",
    description: "Nâng tầm trải nghiệm khách hàng với dịch vụ đặt lịch và chăm sóc chuẩn hóa.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "Tăng trưởng Thực chất",
    description: "Các công cụ marketing tự động giúp tăng tỷ lệ quay lại của khách hàng hiệu quả.",
  },
];

export function AboutContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Câu chuyện của chúng tôi</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Định hình lại <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Ngành Làm Đẹp</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Nail Book LLC được sinh ra với sứ mệnh số hóa và tự động hóa marketing, mang lại quyền năng quản lý tuyệt đối cho các chủ salon.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Our Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Từ Khó Khăn Đến <span className="text-primary">Giải Pháp</span></h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nhận thấy sự vất vả của các chủ tiệm salon trong việc quản lý lịch hẹn thủ công, theo dõi nhân viên và giữ chân khách hàng, chúng tôi hiểu rằng ngành làm đẹp cần một cuộc cách mạng.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Chúng tôi đã tạo ra một nền tảng "All-in-one" (tất cả trong một) không chỉ giúp quản lý dễ dàng mà còn là cỗ máy marketing tự động, giúp salon của bạn phát triển không ngừng.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <div className="aspect-square md:aspect-[4/3] rounded-3xl border border-white/10 flex items-center justify-center p-0 backdrop-blur-sm relative overflow-hidden shadow-2xl">
                 <Image 
                   src="/images/salon-interior.png" 
                   alt="Luxurious Nail Salon Interior" 
                   fill 
                   className="object-cover transition-transform duration-700 hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                 <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/90 backdrop-blur-md rounded-2xl border border-border/50 shadow-lg">
                    <p className="font-semibold text-lg">Hơn 500+ Salon tin dùng</p>
                    <p className="text-sm text-muted-foreground">Giải pháp đã được kiểm chứng bởi thị trường</p>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeInUp} className="group relative overflow-hidden rounded-3xl aspect-[4/3] shadow-lg">
              <Image 
                src="/images/salon-dashboard.png" 
                alt="Salon Dashboard Tablet" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Công Nghệ Quản Lý Hiện Đại</h3>
                <p className="text-white/80">Dashboard thông minh giúp bạn kiểm soát mọi hoạt động, lịch hẹn và doanh thu chỉ qua vài thao tác chạm.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeInUp} className="group relative overflow-hidden rounded-3xl aspect-[4/3] shadow-lg md:mt-12">
              <Image 
                src="/images/happy-technician.png" 
                alt="Happy Nail Technician" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Đội Ngũ Chuyên Nghiệp</h3>
                <p className="text-white/80">Mang lại môi trường làm việc tuyệt vời, giúp nhân viên tập trung tối đa vào việc chăm sóc khách hàng thay vì giấy tờ thủ công.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">Giá Trị <span className="text-primary">Cốt Lõi</span></motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
              Mọi tính năng chúng tôi xây dựng đều xoay quanh 4 cột trụ vững chắc, nhằm mang lại giá trị thiết thực nhất cho khách hàng.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center text-primary-foreground shadow-2xl"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6">
              Sẵn sàng thay đổi cách bạn quản lý?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Tham gia cùng hàng trăm salon khác đang sử dụng Nail Book LLC để tối ưu doanh thu và vận hành chuyên nghiệp hơn mỗi ngày.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link 
                href="/lien-he" 
                className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-background/90 transition-transform hover:scale-105 active:scale-95"
              >
                Bắt đầu ngay hôm nay
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
