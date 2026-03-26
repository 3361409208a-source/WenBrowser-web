"use client";

import { motion } from "framer-motion";
import { X, Monitor, Zap, EyeOff, FileText, Cpu, Download, ArrowLeft, Shield, RefreshCw, ChevronRight, Github } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-['MaoKenZhuyuanTi'] selection:bg-blue-500/30 overflow-x-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-slate-950/20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all">
             <ArrowLeft size={18} className="text-white/40 group-hover:text-white" />
          </div>
          <span className="text-white/40 text-sm font-bold tracking-widest group-hover:text-white transition-all uppercase">返回门户首页</span>
        </Link>
        <div className="flex items-center gap-4">
           <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/60 hover:text-white transition-all flex items-center gap-2"><Github size={14}/> 源码仓库</button>
           <a href="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/MoyuBrowser_Setup.exe" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">确认获取安装</a>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-10 text-center space-y-12">
           <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Monitor size={48} className="text-white" />
           </motion.div>
           
           <div className="space-y-6">
              <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-8xl md:text-9xl font-black text-white tracking-tighter leading-none">
                 MoyuBrowser<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-cyan-400">职场隐匿利器</span>
              </motion.h1>
              <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto text-xl md:text-2xl text-white/40 font-medium leading-relaxed">
                 Deep-Stealth Engine 驱动，专为办公环境设计的“三段式防御”体系。让专注回归本质，让放松不留痕迹。
              </motion.p>
           </div>

           <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <a href="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/MoyuBrowser_Setup.exe" className="group relative px-16 py-6 bg-white text-black text-xl font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden">
                 <div className="relative z-10 flex items-center gap-4"><Download size={28} strokeWidth={3} /> 立即极速下载</div>
                 <div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-0 group-hover:w-full transition-all duration-500" />
              </a>
              <div className="flex flex-col items-center sm:items-start opacity-30">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">Current Build</span>
                 <span className="text-lg font-bold text-white">v1.1稳定版 / Win-x64</span>
              </div>
           </motion.div>
        </div>

        {/* FEATURE GRID */}
        <section className="max-w-7xl mx-auto px-10 mt-64">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Zap className="text-yellow-400"/>, title: "全局老板键", desc: "Alt+B 瞬间隐身，剥离任务栏图标进入进程级伪装。", id: "boss", tag: "Win32 Hook" },
                { icon: <EyeOff className="text-blue-400"/>, title: "智能焦点淡化", desc: "感知窗口状态，无操作时透明度平滑切至 0.15 隐蔽度。", id: "focus", tag: "Focus Monitor" },
                { icon: <FileText className="text-green-400"/>, title: "身份标题伪装", desc: "一键修改标题为办公文件，从视觉根源完美应对查岗。", id: "spoof", tag: "Title Injector" },
                { icon: <Cpu className="text-purple-400"/>, title: "WebView2 内核", desc: "100% 现代网页标准兼容，提供极致渲染平滑度。", id: "core", tag: "Chromium Engine" }
              ].map((feat, idx) => (
                <motion.div key={feat.id} initial={{y:40, opacity:0}} whileInView={{y:0, opacity:1}} viewport={{once: true}} transition={{delay: idx*0.1}} className="p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-white/10 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 text-[8px] font-black text-white/10 uppercase tracking-widest">{feat.tag}</div>
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">{feat.icon}</div>
                   <h3 className="text-2xl font-bold text-white mb-4">{feat.title}</h3>
                   <p className="text-sm text-white/30 leading-relaxed font-bold">{feat.desc}</p>
                   <div className="mt-8 flex items-center gap-2 text-blue-500/40 text-[10px] font-black uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                      Learn Technology <ChevronRight size={12}/>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* QUOTE SECTION */}
        <section className="mt-64 max-w-4xl mx-auto px-10 text-center">
           <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent mx-auto mb-16" />
           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <p className="text-4xl md:text-5xl font-bold text-white leading-tight italic opacity-80">
                 "Work hard, Moyu harder."
              </p>
              <div className="mt-12 flex items-center justify-center gap-4 text-white/20">
                 <Shield size={18}/>
                 <span className="text-xs font-bold uppercase tracking-[0.5em]">2026 官方实训卓越项目</span>
                 <RefreshCw size={18}/>
              </div>
           </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-20 px-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-2 text-center md:text-left">
               <div className="text-white text-lg font-black tracking-tighter">WENBrowser / Moyu Project</div>
               <p className="text-white/20 text-xs font-bold uppercase tracking-widest">A Masterpiece of Software Engineering Studio</p>
            </div>
            <div className="flex gap-12">
               <div className="space-y-4">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Technology</div>
                  <ul className="text-sm font-bold text-white/20 space-y-2">
                     <li className="hover:text-white transition-colors cursor-pointer">WebView2 Core</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Win32 Interop</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Next.js 14</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Connect</div>
                  <ul className="text-sm font-bold text-white/20 space-y-2">
                     <li className="hover:text-white transition-colors cursor-pointer">Developer Forum</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Report Issues</li>
                  </ul>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
