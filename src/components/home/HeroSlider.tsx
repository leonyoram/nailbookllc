"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const baseSlides = [
  {
    id: 1,
    image: "/images/Desktop/Screenshot_4.png", // Demo: Calendar/Booking
    link: "/lien-he",
    isMobile: false,
  },
  {
    id: 2,
    image: "/images/Mobile/z7909079597224_4b675263f0c477ff7b7605159bc7e36d.jpg", // Demo: Mobile Dashboard
    link: "/dich-vu",
    isMobile: true,
  },
  {
    id: 3,
    image: "/images/Desktop/a.png", // Demo: Analytics/Marketing
    link: "/lien-he",
    isMobile: false,
  },
];

type HeroSliderProps = {
  dict: any;
};

export function HeroSlider({ dict }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const appSlides = [
    {
      ...baseSlides[0],
      title: dict.titleLine1, // For demo, we just use the single dict object
      description: dict.subtitle,
      cta: dict.ctaPrimary,
    },
    {
      ...baseSlides[1],
      title: dict.titleLine2,
      description: dict.subtitle,
      cta: dict.ctaSecondary,
    },
    {
      ...baseSlides[2],
      title: "Marketing & Retention", // Ideally would be in dict, but fallback for demo
      description: dict.subtitle,
      cta: dict.ctaPrimary,
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === appSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [appSlides.length]);

  const nextSlide = () => {
    setCurrent(current === appSlides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? appSlides.length - 1 : current - 1);
  };

  return (
    <div className="relative w-full h-screen min-h-[750px] bg-[#0B0F19] overflow-hidden flex items-center pt-20">
      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Brightened Background glow effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-rose-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[150px] mix-blend-screen"></div>

      <div className="container mx-auto px-4 lg:px-12 w-full h-full flex flex-col justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          >
            {/* Text Content */}
            <div className="w-full lg:w-[45%] flex flex-col items-start text-left z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-200 font-medium text-sm shadow-xl"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                Nail Book LLC - Hệ sinh thái tự động hoá số 1
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 mb-6 drop-shadow-sm tracking-tight leading-[1.1]"
              >
                {appSlides[current].title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg md:text-xl text-slate-300 mb-10 max-w-lg font-normal leading-relaxed"
              >
                {appSlides[current].description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="pt-2"
              >
                <Link 
                  href={appSlides[current].link}
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-rose-500 px-8 py-2 text-lg font-bold text-white shadow-[0_0_40px_rgba(244,63,94,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(244,63,94,0.6)] focus-visible:outline-none"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
                  <span className="relative flex items-center gap-2">
                    {appSlides[current].cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Image/Mockup Content */}
            <div className="w-full lg:w-[55%] relative z-10 flex justify-center lg:justify-end">
              {appSlides[current].isMobile ? (
                /* Mobile Phone Mockup */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, rotateY: 10, y: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="relative w-full max-w-[320px] aspect-[9/19.5] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-800 bg-black flex justify-center ring-1 ring-white/20"
                  style={{ perspective: "1000px" }}
                >
                  {/* Phone Notch */}
                  <div className="absolute top-0 w-32 h-6 bg-slate-800 rounded-b-3xl z-30 flex justify-center items-end pb-1.5 gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                    <div className="w-12 h-1.5 rounded-full bg-slate-700"></div>
                  </div>
                  
                  {/* Phone Screen Image */}
                  <div className="absolute inset-0 pt-0">
                    <Image
                      src={appSlides[current].image}
                      alt={`Giao diện tính năng: ${appSlides[current].title} trên phần mềm quản lý Nail Book 24/7`}
                      fill
                      className="object-cover object-top"
                      priority
                      quality={100}
                      unoptimized
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem]"></div>
                  </div>
                </motion.div>
              ) : (
                /* Desktop Browser Mockup */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="relative w-full aspect-[16/10] max-w-2xl rounded-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-700/50 bg-slate-900"
                  style={{ perspective: "1000px" }}
                >
                  {/* Browser-like Header */}
                  <div className="absolute top-0 inset-x-0 h-8 bg-slate-800/90 flex items-center px-4 gap-2 z-20 border-b border-slate-700/50">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  
                  {/* The Screenshot */}
                  <div className="absolute top-8 inset-0 bottom-0">
                    <Image
                      src={appSlides[current].image}
                      alt={`Giao diện tính năng: ${appSlides[current].title} trên phần mềm quản lý Nail Book 24/7`}
                      fill
                      className="object-cover object-top"
                      priority
                      quality={100}
                      unoptimized
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10"></div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-12 right-8 md:right-16 flex items-center gap-6 z-20">
        <div className="flex gap-2">
          {appSlides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${current === idx ? "bg-white w-8" : "bg-white/30 hover:bg-white/50 w-2"}`}
            />
          ))}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
