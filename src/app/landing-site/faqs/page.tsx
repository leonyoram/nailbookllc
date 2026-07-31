import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Script from "next/script";
import Link from "next/link";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";
import { getFaqs } from "@/lib/constants";
import { getDictionary } from "@/lib/dictionary";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Câu Hỏi Thường Gặp | Nail Book LLC",
  description: "Giải đáp các thắc mắc về ứng dụng Nail Book LLC, chi phí và hỗ trợ kỹ thuật.",
};

export default async function FAQsPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "VI";
  const faqs = getFaqs(lang);
  const dict = getDictionary(lang);

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
    <div className="pt-24 pb-24 min-h-screen bg-slate-50 relative overflow-hidden">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-rose-200">
            <MessageCircleQuestion className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
            {dict.faq.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
            {dict.faq.subtitle}
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="mb-20">
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

        {/* Still have questions CTA */}
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-lg border border-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-blue-50 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">
              {lang === "EN" ? "Still have questions?" : "Bạn vẫn còn câu hỏi khác?"}
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto text-lg">
              {lang === "EN" 
                ? "Can't find the answer you're looking for? Please chat to our friendly team." 
                : "Nếu bạn không tìm thấy câu trả lời mình cần, đừng ngần ngại liên hệ với đội ngũ của chúng tôi nhé."}
            </p>
            <Link 
              href="/lien-he" 
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-2 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              {lang === "EN" ? "Contact Support" : "Liên Hệ Trực Tiếp"} 
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
