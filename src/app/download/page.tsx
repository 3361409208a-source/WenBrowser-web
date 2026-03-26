"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronRight, Download, Shield, Layout, Search, Cpu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, memo, useRef } from "react";

// 🛠️ 核心内容渲染器 - 针对黑白/彩色双模式优化对比度
const PageContent = memo(({ isVibrant }: { isVibrant: boolean }) => {
  return (
    <div className={`w-full relative pt-8 pb-48 transition-colors duration-1000`}>
      <main className="max-w-7xl mx-auto px-12">
        {/* LOGO AREA */}
        <div className="mb-28">
          <div className="relative inline-block">
             {isVibrant && <div className="absolute inset-0 bg-blue-500/40 blur-[100px] rounded-full animate-pulse" />}
             <img
               src="/logo.png"
               alt="WEN Logo"
               className={`w-32 h-32 object-contain relative z-10 transition-transform duration-700 ${isVibrant ? 'scale-110' : 'grayscale brightness-150 opacity-100'}`}
             />
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="space-y-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/5 rounded-full mb-4">
             <span className={`w-2 h-2 rounded-full ${isVibrant ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
             <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isVibrant ? 'text-blue-400' : 'text-white/50'}`}>System Build Manifest</span>
          </div>

          <h1 className={`text-8xl md:text-[11.5rem] font-black tracking-[-0.06em] leading-[0.8] transition-all ${isVibrant ? 'text-white' : 'text-white/70'}`}>
            BEYOND <br />
            <span className={isVibrant ? 'text-blue-500 italic' : 'text-white/50 italic'}>STEALTH</span>
          </h1>

          <p className={`max-w-2xl text-2xl md:text-3xl font-light leading-relaxed tracking-tighter transition-all duration-700 ${isVibrant ? 'text-white/80' : 'text-white/60'}`}>
             重新定义职场隐身学。 <br />
             <span className={isVibrant ? 'text-blue-400' : 'text-white/50'}>WENBrowser</span> 深度内核，掌控每一秒自由。
          </p>
        </div>

        {/* CTA AREA - 占位，实际按钮在遮罩层外 */}
        <div className="mt-28 flex flex-col sm:flex-row items-center sm:items-start gap-12 h-[120px]">
          <a
            href="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/MoyuBrowser_Setup.exe"
            className={`px-24 py-9 rounded-[2rem] text-[11px] font-black tracking-[0.4em] uppercase transition-all shadow-2xl border cursor-pointer ${isVibrant ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500' : 'bg-white/20 border-white/20 text-white/70 hover:bg-white/30'}`}
          >
             <Download className="inline mr-5" size={24} strokeWidth={3} /> Install Final Release
          </a>

          <div className="flex flex-col gap-2">
             <span className={`text-[10px] font-black tracking-[0.6em] uppercase pb-1 ${isVibrant ? 'text-blue-400' : 'text-white/50'}`}>Authority Check Passed</span>
             <div className="flex items-center gap-4">
                <span className={`text-md font-bold ${isVibrant ? 'text-white' : 'text-white/70'}`}>Chromium x64</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isVibrant ? 'bg-blue-500' : 'bg-white/40'}`} />
                <span className={`text-md font-bold ${isVibrant ? 'text-white' : 'text-white/70'}`}>v1.1.55 Final</span>
             </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <section className="mt-80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Shield />, title: "Hyper-Stealth", desc: "Alt+B 瞬间剥离内核线程，在视觉与内存中物理隐匿。" },
            { icon: <Layout />, title: "Persona Map", desc: "智能映射工作负载，让你的每一个操作都符合职场背景。" },
            { icon: <Search />, title: "AI Vision", desc: "感知用户视线离开，窗口静默进入低可见度保护状态。" },
            { icon: <Cpu />, title: "Vortex Engine", desc: "Chromium 原生驱动，极致流畅，不掉帧，不卡顿。" }
          ].map((feat, idx) => (
            <div key={idx} className={`p-16 border rounded-[3rem] transition-all duration-700 ${isVibrant ? 'bg-white/5 border-white/20 bg-blue-900/10' : 'bg-white/[0.05] border-white/10'}`}>
               <div className={`w-14 h-14 flex items-center justify-center mb-10 transition-all duration-700 ${isVibrant ? 'text-blue-500 scale-125' : 'text-white/40'}`}>
                  {feat.icon}
               </div>
               <h3 className={`text-xl font-bold mb-4 tracking-tight transition-all duration-700 ${isVibrant ? 'text-white' : 'text-white/70'}`}>{feat.title}</h3>
               <p className={`text-sm leading-relaxed transition-all duration-700 font-bold ${isVibrant ? 'text-white/40' : 'text-white/50'}`}>{feat.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
});

PageContent.displayName = "PageContent";

export default function DownloadPage() {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // MOUSE COORDINATES
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // SILKY FOLLOW SPRING
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 450 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 450 });

  // 🚀 CRITICAL: ONE TRANSFORM HOOK ONLY
  const maskValue = useTransform(
    [smoothX, smoothY],
    ([x, y]: [number, number]) => {
      const scrollTop = scrollRef.current?.scrollTop || 0;
      return `radial-gradient(450px circle at ${x}px ${y + scrollTop}px, black 0%, transparent 100%)`;
    }
  );

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#111] overflow-hidden font-sans cursor-none select-none">
      
      {/* ⚪️ NAVBAR - SHARED */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-12 py-10 flex items-center justify-between pointer-events-auto mix-blend-difference">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border border-white/20 rounded-xl flex items-center justify-center text-white/40 group-hover:text-white transition-all">
            <div className="rotate-180"><ChevronRight size={20} /></div>
          </div>
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/20 group-hover:text-white transition-all">Escape Portal</span>
        </Link>
        <a href="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/MoyuBrowser_Setup.exe" className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">
           Flash Binary
        </a>
      </header>

      {/* 🚀 SCROLL WRAPPER */}
      <div ref={scrollRef} className="relative h-screen overflow-y-auto scrollbar-hide py-0 pointer-events-auto">
        <div className="relative w-full">
           
           {/* 📽️ LAYER 0: THE STEALTH (GRAYSCALE) - LIGHTER & VISIBLE */}
           <div className="relative z-0 pointer-events-auto w-full bg-[#111] filter grayscale-[100%] contrast-[1.2] opacity-100">
              <PageContent isVibrant={false} />
           </div>

           {/* 📽️ LAYER 1: THE VIBRANT (COLOR) - TOP MASKED REVEAL */}
           <motion.div
             className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
             style={{
               WebkitMaskImage: maskValue,
               maskImage: maskValue
             }}
           >
              <div className="absolute inset-0 bg-[#0a0f2b] pointer-events-none">
                 <div className="absolute top-[10%] left-[-10%] w-[100%] h-[80%] bg-blue-600/30 blur-[150px] rounded-full" />
              </div>
              <PageContent isVibrant={true} />
           </motion.div>
        </div>

        <footer className="relative z-10 py-64 px-12 border-t border-white/5 bg-black text-center pointer-events-auto">
           <div className="text-[10px] font-black text-white/5 tracking-[2em] uppercase tracking-widest">WEN ENGINEERING / BUILD v1.1.55</div>
        </footer>
      </div>

      {/* ⚪️ CUSTOM CURSOR */}
      <motion.div 
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full z-[200] pointer-events-none mix-blend-difference shadow-[0_0_20px_white]"
        style={{ 
           x: smoothX, 
           y: smoothY,
           translateX: "-50%",
           translateY: "-50%" 
        }}
      />
    </div>
  );
}
