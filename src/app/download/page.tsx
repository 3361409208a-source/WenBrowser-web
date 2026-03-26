"use client";

import { motion, Variants } from "framer-motion";
import { X, Shield, RefreshCw, ChevronRight, Globe, Layers, Settings, Download, Search, Check } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 } as any
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-['MaoKenZhuyuanTi'] selection:bg-blue-500/30 overflow-x-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2 }} className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2, delay: 0.5 }} className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-slate-950/20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all font-black text-white/40 group-hover:text-white">
             <div className="rotate-180"><ChevronRight size={18} /></div>
          </div>
          <span className="text-white/40 text-xs font-black tracking-widest group-hover:text-white transition-all uppercase">返回主页仪表盘</span>
        </Link>
        <div className="flex items-center gap-4">
           <a href="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/MoyuBrowser_Setup.exe" className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <Download size={14} /> 确认获取安装
           </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-10 text-center space-y-12">
           {/* 去除下载页 Logo 的巨型背景框，采用纯净悬浮显示 */}
           <motion.div variants={itemVariants} className="w-32 h-32 mx-auto flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity" />
              <img src="/logo.png" alt="WEN Logo" className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" />
           </motion.div>
           
           <div className="space-y-6">
              <motion.h1 variants={itemVariants} className="text-8xl md:text-9xl font-black text-white tracking-tighter leading-none">
                 MoyuBrowser<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-cyan-400">职场隐匿利器</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-xl md:text-2xl text-white/40 font-medium leading-relaxed">
                 基于 Chromium 深度定制，专为办公环境设计的“三段式防御”体系。让专注回归本质，让放松不留痕迹。
              </motion.p>
           </div>

           <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
              <a href="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/MoyuBrowser_Setup.exe" className="group relative px-20 py-7 bg-white text-black text-xl font-black rounded-[1.2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden text-nowrap">
                 <div className="relative z-10 flex items-center gap-4"><Download size={28} strokeWidth={3} /> 立即极速下载</div>
                 <div className="absolute bottom-0 left-0 h-1.5 bg-blue-500 w-0 group-hover:w-full transition-all duration-500" />
              </a>
              <div className="flex flex-col items-center sm:items-start opacity-30">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">Current Build</span>
                 <span className="text-xl font-black text-white">v1.1.52.Final / Win-x64</span>
              </div>
           </motion.div>
        </div>

        {/* FEATURE GRID */}
        <section className="max-w-7xl mx-auto px-10 mt-64">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Shield className="text-yellow-400"/>, title: "全局老板键", desc: "Alt+B 瞬间隐身，剥离任务栏图标进入进程级伪装。", id: "boss", tag: "Win32 Hook" },
                { icon: <Search className="text-blue-400"/>, title: "智能焦点淡化", desc: "感知窗口状态，无操作时透明度平滑切至 0.15 隐蔽度。", id: "focus", tag: "Focus Monitor" },
                { icon: <Check className="text-green-400"/>, title: "身份标题伪装", desc: "一键修改标题为办公文件，从视觉根源完美应对查岗。", id: "spoof", tag: "Title Injector" },
                { icon: <Settings className="text-purple-400"/>, title: "WebView2 内核", desc: "100% 现代网页标准兼容，提供极致渲染平滑度。", id: "core", tag: "Chromium Engine" }
              ].map((feat, idx) => (
                <motion.div key={feat.id} variants={itemVariants} className="p-12 bg-white/[0.03] border border-white/5 rounded-[3rem] hover:bg-white/[0.08] hover:border-white/10 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 text-[9px] font-black text-white/5 uppercase tracking-widest">{feat.tag}</div>
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform group-hover:border-white/20">{feat.icon}</div>
                   <h3 className="text-2xl font-bold text-white mb-4 line-height-tight">{feat.title}</h3>
                   <p className="text-sm text-white/30 leading-relaxed font-bold">{feat.desc}</p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* QUOTE SECTION */}
        <motion.section variants={itemVariants} className="mt-64 max-w-4xl mx-auto px-10 text-center">
           <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent mx-auto mb-16" />
           <p className="text-4xl md:text-6xl font-black text-white leading-tight italic opacity-90 tracking-tighter">
              "Work hard, Moyu harder."
           </p>
           <div className="mt-16 flex items-center justify-center gap-6 text-white/10">
              <Shield size={22}/>
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">WENBrowser 2026 OFFICIAL PROJECT</span>
              <RefreshCw size={22}/>
           </div>
        </motion.section>
      </motion.main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-32 px-10 bg-black/40">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="space-y-4 text-center md:text-left">
               <div className="text-white text-3xl font-black tracking-tighter">WENBrowser</div>
               <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Engineering Studio / Stealth Infrastructure</p>
            </div>
            <div className="flex gap-20">
               <div className="space-y-6">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Technology</div>
                  <ul className="text-sm font-bold text-white/20 space-y-3">
                     <li className="hover:text-white transition-colors cursor-pointer">WebView2 Runtime</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Low-Level Hooks</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Next.js 14</li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Connect</div>
                  <ul className="text-sm font-bold text-white/20 space-y-3">
                     <li className="hover:text-white transition-colors cursor-pointer">Release Notes</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Bug Repo</li>
                  </ul>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
