import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { cookies } from "next/headers";
import { HeroSlider } from "@/components/home/HeroSlider";
import { getServices, getPricingPlans, getTestimonials, getFaqs } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phần mềm quản lý tiệm Nail toàn diện",
  description: "Khám phá giải pháp quản lý tiệm nail thông minh giúp tự động hóa lịch hẹn, tính lương, và gửi tin nhắn nhắc lịch tự động. Tăng 30% doanh thu ngay hôm nay!",
};
import { getDictionary } from "@/lib/dictionary";
import { CheckCircle2, Star, ChevronRight, Calendar, MessageSquare, Wallet, Globe, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";





const MOBILE_IMAGES = [
  "/images/Mobile/z7909079597224_4b675263f0c477ff7b7605159bc7e36d.jpg",
  "/images/Mobile/z7909079601580_129d826787eb83411c6d499ca1ac834b.jpg",
  "/images/Mobile/z7909079605741_e89cfe74ebb22d0c55d7ddd21fefe616.jpg",
  "/images/Mobile/z7909079609207_c27b9fb56dbf7314f8e475ebd3905280.jpg",
  "/images/Mobile/z7909079611069_c4280bda5be54ce4bbb0ce372966e959.jpg",
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "VI";
  const dict = getDictionary(lang);
  const faqs = getFaqs(lang);
  const PRICING_PLANS = getPricingPlans(lang);
  const TESTIMONIALS = getTestimonials(lang);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <h1 className="sr-only">Nail Book LLC - Giải Pháp Quản Lý Tiệm Nail Toàn Diện 24/7</h1>
      <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary overflow-hidden">
        <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. Hero Section (Mặt Tiền Cực Khủng - Thay bằng Slider) */}
      <HeroSlider dict={dict.hero} />

      {/* 2. Bento Box Features (Tại Sao Chọn Nail Book?) */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900">{dict.features.sectionTitle}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{dict.features.sectionSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Large Box */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white p-8 md:p-12 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar className="w-48 h-48 text-primary rotate-12 translate-x-10 -translate-y-10" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">{dict.features.feat1Title}</h3>
                <p className="text-slate-600 text-lg max-w-md leading-relaxed">
                  {dict.features.feat1Desc}
                </p>
              </div>
            </div>

            {/* Feature 2: Tall Box */}
            <div className="md:col-span-1 md:row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary to-rose-400 p-8 md:p-12 shadow-lg text-white group hover:scale-[1.02] transition-transform">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{dict.features.feat2Title}</h3>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                {dict.features.feat2Desc}
              </p>
              
              <div className="mt-auto bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Anna Smith</span>
                  <span className="font-bold text-green-300">+$150.00</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">John Doe</span>
                  <span className="font-bold text-green-300">+$85.00</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Small Box */}
            <div className="md:col-span-1 relative overflow-hidden rounded-3xl bg-white p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{dict.features.feat3Title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {dict.features.feat3Desc}
              </p>
            </div>

            {/* Feature 4: Small Box */}
            <div className="md:col-span-1 relative overflow-hidden rounded-3xl bg-white p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{dict.features.feat4Title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {dict.features.feat4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. App Showcase (Giao Diện Thân Thiện) */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-100 via-white to-white -z-10"></div>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900">{dict.showcase.title}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{dict.showcase.subtitle}</p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center gap-12 max-w-7xl mx-auto items-center">
            {/* Hình 1: Mobile */}
            <div className="flex flex-col items-center max-w-xs group">
              <div className="relative w-56 h-[450px] md:w-64 md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-black bg-white mb-8 transition-transform duration-500 group-hover:-translate-y-4">
                <Image src="/images/Mobile/z7909079601580_129d826787eb83411c6d499ca1ac834b.jpg" alt="Màn hình Khách Đặt Lịch" fill className="object-cover object-top" quality={100} unoptimized />
                {/* Glassmorphism overlay reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">{dict.showcase.customerTitle}</h3>
              <p className="text-slate-500 text-center">{dict.showcase.customerDesc}</p>
            </div>
            
            {/* Hình 2: Desktop/Tablet */}
            <div className="flex flex-col items-center w-full max-w-md lg:max-w-[700px] group z-10 lg:-mt-16">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border-[6px] border-slate-900 bg-slate-900 mb-8 transition-transform duration-500 group-hover:-translate-y-4">
                <Image src="/images/Desktop/Screenshot_5.png" alt="Màn hình Quản Lý Lễ Tân" fill className="object-cover object-top" quality={100} unoptimized />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">{dict.showcase.adminTitle}</h3>
              <p className="text-slate-500 text-center">{dict.showcase.adminDesc}</p>
            </div>

            {/* Hình 3: Mobile */}
            <div className="flex flex-col items-center max-w-xs group">
              <div className="relative w-56 h-[450px] md:w-64 md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-black bg-white mb-8 transition-transform duration-500 group-hover:-translate-y-4">
                <Image src="/images/Mobile/z7909079605741_e89cfe74ebb22d0c55d7ddd21fefe616.jpg" alt="Màn hình Báo Cáo Doanh Thu" fill className="object-cover object-top" quality={100} unoptimized />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">{dict.showcase.staffTitle}</h3>
              <p className="text-slate-500 text-center">{dict.showcase.staffDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing (Bảng Giá Dịch Vụ) */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900">{dict.pricing.title}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{dict.pricing.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {PRICING_PLANS.map((plan, idx) => (
              <div key={idx} className={`relative p-8 md:p-10 rounded-3xl bg-white border flex flex-col transition-all hover:shadow-2xl ${plan.highlight ? 'border-rose-500 shadow-xl ring-4 ring-rose-500/20 md:scale-105 z-10 py-12' : 'border-slate-200 shadow-sm'}`}>
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md uppercase tracking-wider">{dict.pricing.recommended}</div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{plan.name}</h3>
                <p className="text-slate-500 mb-8 min-h-[48px]">{plan.desc}</p>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-slate-900">{plan.priceMonthly}</span>
                  <span className="text-slate-500 font-medium">{dict.pricing.month}</span>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${plan.highlight ? 'text-rose-500' : 'text-primary'}`} />
                      <span className="text-slate-600 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
                <Link href="/lien-he" className={`w-full flex justify-center items-center h-14 rounded-full font-bold text-lg transition-all hover:scale-105 ${plan.highlight ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Infinite Marquee Testimonials */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 mb-16 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">{dict.testimonials.title}</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">{dict.testimonials.subtitle}</p>
        </div>

        <div className="relative w-full overflow-hidden flex flex-col gap-6 z-10">
          {/* Marquee Row 1 */}
          <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((review, idx) => (
              <div key={`row1-${idx}`} className="w-[350px] bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl flex-shrink-0">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-lg mb-8 italic">"{review.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <Image src={review.avatar} alt={review.author} width={48} height={48} className="rounded-full border-2 border-primary" />
                  <div>
                    <h4 className="font-bold text-white">{review.author}</h4>
                    <p className="text-primary text-sm">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQs Bứt Phá */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900">{dict.faq.title}</h2>
            <p className="text-xl text-slate-600">{dict.faq.subtitle}</p>
          </div>

          <Accordion className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-slate-200 bg-white px-6 md:px-8 py-2 rounded-3xl shadow-sm transition-all hover:border-primary/30 data-[state=open]:bg-gradient-to-r data-[state=open]:from-rose-50 data-[state=open]:to-white data-[state=open]:border-primary/50 data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="text-left font-bold text-lg md:text-xl py-5 hover:no-underline text-slate-800 data-[state=open]:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-6 text-base md:text-lg leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-24 px-4 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">{dict.cta.title}</h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-medium max-w-2xl mx-auto">
            {dict.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/lien-he" className="inline-flex h-16 items-center justify-center rounded-full bg-white text-primary px-10 py-3 text-lg font-bold shadow-2xl transition-transform hover:scale-105">
              {dict.cta.btn1}
            </Link>
            <Link href="/dich-vu" className="inline-flex h-16 items-center justify-center rounded-full border-2 border-white/30 bg-primary/20 backdrop-blur-sm px-10 py-3 text-lg font-bold text-white shadow-sm transition-all hover:bg-white/10 hover:border-white w-full sm:w-auto">
              {dict.cta.btn2}
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
