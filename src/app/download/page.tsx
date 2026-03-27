"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronRight, Download, Shield, Layout, Search, Cpu, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, memo, useRef } from "react";

// 🌸 动态粒子系统 (雪花/樱花/青色粒子)
const FallingParticles = ({ theme, isVibrant }: { theme?: string, isVibrant?: boolean }) => {
  const [particles, setParticles] = useState<any[]>([]);
  const isSakura = theme === 'sakura';
  const color = isVibrant ? '#06b6d4' : (isSakura ? '#ffb7c5' : '#ffffff');
  
  useEffect(() => {
    const p = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // %
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 15,
      size: (isSakura || isVibrant) ? (4 + Math.random() * 6) : (2 + Math.random() * 4),
      sway: 100 + Math.random() * 150, // px
      opacity: 0.15 + Math.random() * 0.45,
      rotation: Math.random() * 360
    }));
    setParticles(p);
  }, [theme, isSakura, isVibrant]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[11]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, opacity: 0, rotate: p.rotation }}
          animate={{ 
            y: '110vh', 
            x: [0, p.sway / 2, -p.sway / 2, 0],
            opacity: [0, p.opacity, p.opacity, 0],
            rotate: (isSakura || isVibrant) ? [p.rotation, p.rotation + 720] : 0
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear",
            x: { duration: p.duration / 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            width: p.size,
            height: (isSakura || isVibrant) ? p.size * 0.8 : p.size,
            backgroundColor: color,
            borderRadius: (isSakura || isVibrant) ? '100% 10% 100% 10%' : '50%',
            filter: (isSakura || isVibrant) ? 'none' : 'blur(0.5px)',
            boxShadow: `0 0 10px ${color}44`,
          }}
        />
      ))}
    </div>
  );
};

// 🛠️ 核心功能数据
const FEATURES = [
  { icon: <EyeOff />, title: "Ghost Mode", desc: "Alt+↑/↓ 实时调节全局透明度，灵动切换幽灵与实体形态，完美融入背景。" },
  { icon: <Shield />, title: "Hyper-Stealth", desc: "Alt+B 瞬间剥离内核线程，在视觉与系统进程中实现物理级隐匿。" },
  { icon: <Layout />, title: "Persona Map", desc: "内置 Office、VS Code 等多种专业皮肤，一键伪装成正在深度办公的状态。" },
  { icon: <Search />, title: "AI Vision", desc: "智能感知用户视线聚焦，当检测到窥屏风险时，关键内容自动进入模糊保护。" },
  { icon: <Cpu />, title: "Vortex Engine", desc: "Chromium 原生内核驱动，极致流畅不掉帧，完美兼容所有主流扩展插件。" },
  { icon: <Lock />, title: "Zero Trace", desc: "配置完全本地加密存储，不上传任何浏览记录，让私密空间真正属于你自己。" }
];

// 🛠️ 核心内容渲染器 - 针对黑白/彩色双模式优化对比度
const PageContent = memo(({ isVibrant }: { isVibrant: boolean }) => {
  return (
    <div className={`w-full relative pt-24 pb-12 transition-colors duration-1000 overflow-hidden`}>
      {/* 🔮 BACKGROUND DECORATIONS */}
      {isVibrant && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              x: [0, 100, 0], 
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[180px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              x: [0, -80, 0], 
              y: [0, 100, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-600/10 blur-[150px] rounded-full" 
          />
        </div>
      )}

      <motion.main 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.3, delayChildren: 0.5 } }
        }}
        className="max-w-7xl mx-auto px-12 relative z-10"
      >
        {/* HERO SECTION */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 } }
          }}
          className="space-y-12"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/5 rounded-full mb-4">
             <span className={`w-2 h-2 rounded-full ${isVibrant ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
             <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isVibrant ? 'text-blue-400' : 'text-white/50'}`}>System Build Manifest</span>
          </div>

          <h1 className={`text-8xl md:text-[13rem] font-black tracking-[-0.08em] leading-[0.75] transition-all duration-1000 ${isVibrant ? 'text-white' : 'text-white/40'}`}>
            <motion.span 
              variants={{
                hidden: { x: -150, opacity: 0, filter: "blur(20px)" },
                visible: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="block"
            >
              BEYOND
            </motion.span>
            <motion.span 
              variants={{
                hidden: { x: 150, opacity: 0, filter: "blur(20px)" },
                visible: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 } }
              }}
              className={`relative block ${isVibrant ? 'text-cyan-500' : 'text-white/20'}`}
            >
              STEALTH
              {isVibrant && <motion.span initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, delay: 0.5 }} className="absolute bottom-4 left-0 h-2 bg-cyan-500/50 blur-sm" />}
            </motion.span>
          </h1>

          <p className={`max-w-2xl text-2xl md:text-3xl font-light leading-relaxed tracking-tighter transition-all duration-700 ${isVibrant ? 'text-white/80' : 'text-white/60'}`}>
             重新定义职场隐身学。 <br />
             <span className={isVibrant ? 'text-blue-400' : 'text-white/50'}>WENBrowser</span> 深度内核，掌控每一秒自由。
          </p>

          <div className="flex flex-wrap gap-8 pt-4">
             {[
               { key: "Alt + B", label: "瞬间遁形" },
               { key: "Alt + ↑/↓", label: "调节透明度" },
               { key: "Alt + H", label: "返回门户" }
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-3">
                 <span className={`px-3 py-1 rounded-md border text-[10px] font-black ${isVibrant ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
                   {item.key}
                 </span>
                 <span className={`text-xs font-bold tracking-widest ${isVibrant ? 'text-white/60' : 'text-white/30'}`}>
                   {item.label}
                 </span>
               </div>
             ))}
          </div>
        </motion.div>

        {/* CTA AREA */}
        <div className="mt-20 flex flex-col sm:flex-row items-center sm:items-start gap-12 h-[120px]">
          <motion.a
            variants={{
              hidden: { x: -100, opacity: 0, filter: "blur(10px)" },
              visible: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 } }
            }}
            href="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/MoyuBrowser_Setup.exe"
            className={`px-24 py-9 rounded-[2rem] text-[11px] font-black tracking-[0.4em] uppercase transition-all shadow-2xl border cursor-pointer ${isVibrant ? 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-500' : 'bg-white/20 border-white/20 text-white/70 hover:bg-white/30'}`}
          >
             <Download className="inline mr-5" size={24} strokeWidth={3} /> Install Final Release
          </motion.a>

          <motion.div 
            variants={{
              hidden: { x: 100, opacity: 0, filter: "blur(10px)" },
              visible: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.8 } }
            }}
            className="flex flex-col gap-2"
          >
             <span className={`text-[10px] font-black tracking-[0.6em] uppercase pb-1 ${isVibrant ? 'text-cyan-400' : 'text-white/50'}`}>Authority Check Passed</span>
             <div className="flex items-center gap-4">
                <span className={`text-md font-bold ${isVibrant ? 'text-white' : 'text-white/70'}`}>Chromium x64</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isVibrant ? 'bg-cyan-500' : 'bg-white/40'}`} />
                <span className={`text-md font-bold ${isVibrant ? 'text-white' : 'text-white/70'}`}>v1.1.55 Final</span>
             </div>
          </motion.div>
        </div>

        {/* 🎡 INFINITE SCROLLING FEATURES */}
        <div 
          className="mt-20 overflow-hidden relative group" 
          style={{ 
            maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)' 
          }}
        >
          <motion.div 
            animate={{ x: [0, -1 * (FEATURES.length * 352)] }}
            transition={{ 
              duration: 45, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8 py-10"
            style={{ width: "fit-content" }}
          >
            {[...FEATURES, ...FEATURES, ...FEATURES].map((feat, idx) => (
              <motion.div 
                key={idx} 
                className={`group relative flex-shrink-0 w-[320px] p-8 rounded-3xl border transition-all duration-700 overflow-hidden ${isVibrant ? 'bg-white/5 border-white/10 hover:border-cyan-500/40' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
              >
                 {/* 🧬 AMBIENT ACCENT LINE */}
                 <div className={`absolute top-0 left-0 w-full h-[1px] transition-opacity duration-700 ${isVibrant ? 'bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-100' : 'opacity-0'}`} />
                 
                 <div className={`w-12 h-12 flex items-center justify-center mb-6 rounded-xl border transition-all duration-700 ${isVibrant ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' : 'bg-white/5 border-white/5 text-white/20'}`}>
                    {feat.icon}
                 </div>
                 <h3 className={`text-lg font-bold mb-3 tracking-tight transition-all duration-700 ${isVibrant ? 'text-white' : 'text-white/40'}`}>{feat.title}</h3>
                 <p className={`text-[11px] leading-relaxed whitespace-normal transition-all duration-700 font-medium ${isVibrant ? 'text-white/30 group-hover:text-white/50' : 'text-white/20'}`}>{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 🎬 FOOTER INSIDE CONTENT */}
        <footer className="mt-20 pt-10 border-t border-white/5 text-center transition-all duration-700">
           <div className={`text-[10px] font-black tracking-[2em] uppercase transition-all duration-700 ${isVibrant ? 'text-white/20' : 'text-white/5'}`}>
             WEN ENGINEERING / BUILD v1.1.55
           </div>
        </footer>
      </motion.main>
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
  
  // 🚀 HIGHLY RESPONSIVE FOLLOW SPRING
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 800 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 800 });

  // 🚀 CRITICAL: ONE TRANSFORM HOOK ONLY
  const maskValue = useTransform(
    [smoothX, smoothY],
    (latest: number[]) => {
      const [x, y] = latest;
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
    <div className="relative min-h-screen bg-[#050505] overflow-hidden font-sans select-none">
      
      {/* 📺 SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-[150] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      {/* 🎞️ NOISE TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-[151] opacity-[0.05] bg-[url('https://res.cloudinary.com/dcb6m6vnr/image/upload/v1642944322/noise_pgeis7.png')] mix-blend-overlay" />

      
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
           <div className="relative z-0 pointer-events-auto w-full bg-[#050505] filter grayscale-[100%] contrast-[1.1] opacity-100">
              <FallingParticles isVibrant={false} />
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
              <div className="absolute inset-0 bg-black pointer-events-none">
                 <FallingParticles isVibrant={true} />
                 <video 
                   autoPlay 
                   muted 
                   loop 
                   playsInline 
                   className="fixed inset-0 w-screen h-screen object-cover opacity-80"
                   src="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/%E8%B5%9B%E5%8D%9A%E6%9C%8B%E5%85%8B%E7%A7%91%E6%8A%80%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90.mp4"
                 />
                  <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
              </div>
              <PageContent isVibrant={true} />
           </motion.div>
        </div>
      </div>

    </div>
  );
}
