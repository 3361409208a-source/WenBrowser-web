"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  DndContext,
  closestCenter,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Play, Pause, Volume2, VolumeX, Plus, X, Search, Trash2, Shield, Palette, Upload, Globe, FolderPlus, Layers, ChevronRight, Hash, Check, RefreshCw, Image as ImageIcon, Download, Flame } from "lucide-react";
import Link from "next/link";
import MusicPlayer from "@/components/MusicPlayer";
import { LAVA_PALETTES } from "@/components/LavaFluid/LavaBackground";

const LavaBackground = dynamic(() => import("@/components/LavaFluid/LavaBackground"), { ssr: false });

interface LinkItem { id: string; name: string; url: string; }
interface Category { id: string; title: string; links: LinkItem[]; }
type ThemeKey = "default" | "vscode" | "office" | "sakura" | "ocean";
type BgType = "video" | "image" | "lava";

const DEFAULT_BG = "https://wenbrowser-1330371299.cos.ap-guangzhou.myqcloud.com/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91Kuroha%E4%BD%9C%E5%93%81-%E5%8A%A8%E6%BC%AB%E7%BA%BF%E7%A8%BF.mp4";
const LOGO_URL = "/logo.png";
const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", title: "✨ 常用导航", links: [ { id: "link-1", name: "哔哩哔哩", url: "https://www.bilibili.com/" }, { id: "link-2", name: "抖音", url: "https://www.douyin.com/" }, { id: "link-3", name: "小红书", url: "https://www.xiaohongshu.com/" }, { id: "link-4", name: "腾讯视频", url: "https://v.qq.com/" }, { id: "link-5", name: "爱奇艺", url: "https://www.iqiyi.com/" }, { id: "link-6", name: "优酷", url: "https://www.youku.com/" } ] },
  { id: "cat-2", title: "🎮 热门游戏", links: [ { id: "game-1", name: "4399小游戏", url: "https://www.4399.com/" }, { id: "game-2", name: "TapTap", url: "https://www.taptap.cn/" }, { id: "game-3", name: "米游社", url: "https://www.miyoushe.com/" } ] }
];

const THEMES: Record<ThemeKey, { name: string; overlay: string; text: string; accent: string; card: string; panel: string; btn: string; subtext: string; border: string; preview: string; panelText: string; panelSidebar: string; panelBorder: string; panelInput: string; panelMuted: string; }> = {
  default: { name: "Cyber Glass", overlay: "bg-black/60", text: "text-white font-medium tracking-wide drop-shadow-md", accent: "bg-white text-black", card: "bg-white/5 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]", panel: "bg-black/70 backdrop-blur-2xl text-white shadow-2xl", subtext: "text-white/40", border: "border-white/10", btn: "bg-white/10 text-white hover:bg-white/20", preview: "bg-zinc-800", panelText: "text-white", panelSidebar: "bg-white/5", panelBorder: "border-white/10", panelInput: "bg-white/5 border-white/10 text-white focus:border-white/30", panelMuted: "text-white/30" },
  vscode: { name: "Terminal Brutalist", overlay: "bg-[#0a0a0a]/80", text: "text-[#00ff41] font-mono tracking-tighter", accent: "bg-[#00ff41] text-black", card: "bg-black border-[#00ff41]/30 hover:border-[#00ff41] rounded-none", panel: "bg-black/90 backdrop-blur-md text-[#00ff41] rounded-none border-2 border-[#00ff41]/50 shadow-[4px_4px_0px_#00ff41]", subtext: "text-[#00ff41]/50 font-mono", border: "border-[#00ff41]/30", btn: "bg-transparent border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black rounded-none", preview: "bg-[#0a0a0a]", panelText: "text-[#00ff41] font-mono", panelSidebar: "bg-black border-r border-[#00ff41]/30", panelBorder: "border-[#00ff41]/50", panelInput: "bg-black border border-[#00ff41]/50 text-[#00ff41] rounded-none focus:border-[#00ff41]", panelMuted: "text-[#008f11]" },
  office: { name: "Minimalist Pearl", overlay: "bg-[#fafafa]/40", text: "text-zinc-800 font-light tracking-tight", accent: "bg-zinc-900 text-white", card: "bg-white/70 border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] rounded-3xl", panel: "bg-white/90 backdrop-blur-3xl text-zinc-900 shadow-[0_24px_64px_rgba(0,0,0,0.08)]", subtext: "text-zinc-400", border: "border-zinc-200/50", btn: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200", preview: "bg-zinc-200", panelText: "text-zinc-900", panelSidebar: "bg-zinc-50/50", panelBorder: "border-zinc-200/50", panelInput: "bg-zinc-50 border-zinc-200/50 text-zinc-900 focus:border-zinc-300", panelMuted: "text-zinc-400" },
  sakura: { name: "Sakura Dream", overlay: "bg-rose-50/30", text: "text-rose-900 font-medium tracking-wide", accent: "bg-rose-400 text-white shadow-[0_0_20px_rgba(251,113,133,0.4)]", card: "bg-white/40 border-white/60 shadow-[0_8px_32px_rgba(225,29,72,0.05)] hover:shadow-[0_16px_48px_rgba(225,29,72,0.1)] rounded-[2rem]", panel: "bg-white/80 backdrop-blur-3xl text-rose-950 shadow-[0_24px_80px_rgba(225,29,72,0.15)]", subtext: "text-rose-400", border: "border-rose-200/60", btn: "bg-rose-100/50 text-rose-700 hover:bg-rose-200/50", preview: "bg-rose-300", panelText: "text-rose-900", panelSidebar: "bg-rose-50/50", panelBorder: "border-rose-200/60", panelInput: "bg-white/50 border-rose-200/60 text-rose-900 focus:border-rose-300", panelMuted: "text-rose-400" },
  ocean: { name: "Midnight Abyss", overlay: "bg-slate-950/60", text: "text-cyan-50 font-medium tracking-wide", accent: "bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]", card: "bg-slate-900/40 border-cyan-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-cyan-400/40 hover:shadow-[0_8px_32px_rgba(6,182,212,0.2)] rounded-2xl", panel: "bg-slate-900/80 backdrop-blur-2xl text-cyan-50 shadow-[0_24px_80px_rgba(0,0,0,0.5)]", subtext: "text-cyan-600", border: "border-cyan-900/50", btn: "bg-cyan-950/50 text-cyan-400 hover:bg-cyan-900/50 border border-cyan-800/50", preview: "bg-cyan-900", panelText: "text-cyan-50", panelSidebar: "bg-slate-950/50", panelBorder: "border-cyan-900/50", panelInput: "bg-slate-950/50 border-cyan-900/50 text-cyan-50 focus:border-cyan-700/50", panelMuted: "text-cyan-700" },
};

const ENGINES = {
  bing: { name: "必应", url: "https://www.bing.com/search?q=" },
  google: { name: "谷歌", url: "https://www.google.com/search?q=" },
  baidu: { name: "百度", url: "https://www.baidu.com/s?wd=" },
};

const STABLE_STORAGE_KEY = "moyu-master-config-stable";
const DB_NAME = "moyu-final-v1-db";
const STORE_NAME = "assets";
const HISTORICAL_KEYS = ["moyu-user-config-v29-favicons", "moyu-user-config-v28", "moyu-user-config-stable", "moyu-v21-rename-env", "moyu-v25-final"];
const springTransition = { type: "spring" as const, stiffness: 450, damping: 25 };

function FaviconIcon({ url, name, theme }: { url: string; name: string; theme: ThemeKey }) {
  const [loadStage, setLoadStage] = useState(0); // 0: gstatic(高清), 1: xinac(国产备份), 2: 字母占位
  
  const getDomain = (link: string) => {
    try {
      const hostname = new URL(link.startsWith('http') ? link : `https://${link}`).hostname;
      return hostname || link;
    } catch {
      return link;
    }
  };

  const safeUrl = url.startsWith('http') ? url : `https://${url}`;
  
  // 第一级：gstatic.cn (高清、境内镜像)
  // 第二级：api.xinac.net (纯国产接口，兼容性极高)
  let faviconUrl = `https://t3.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(safeUrl)}&size=128`;
  if (loadStage === 1) {
    faviconUrl = `https://api.xinac.net/icon/?url=${encodeURIComponent(safeUrl)}`;
  }

  if (loadStage >= 2 || !url) {
    return (
      <div className="w-8 h-8 sm:w-9 sm:h-9 mb-1.5 rounded-[0.8rem] bg-white/5 flex items-center justify-center border border-white/5 font-bold">
        {name[0] || 'W'}
      </div>
    );
  }

  return (
    <div className="w-8 h-8 sm:w-9 sm:h-9 mb-1.5 rounded-[0.8rem] bg-white p-1 shadow-sm border border-white/5 flex items-center justify-center overflow-hidden">
      <img 
        key={loadStage}
        src={faviconUrl} 
        alt={name} 
        onError={() => setLoadStage(prev => prev + 1)} 
        className="w-full h-full object-contain" 
      />
    </div>
  );
}

function SortableItem({ link, theme, onRemove }: { link: LinkItem; theme: ThemeKey; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 2000 : 0 };
  const themeData = THEMES[theme];
  return (
    <motion.div ref={setNodeRef} style={style} transition={springTransition} className={`group relative ${isDragging ? "opacity-0" : "opacity-100"} flex justify-center w-full aspect-square`}>
      <motion.div whileHover={{ y: -6, scale: 1.04 }} whileTap={{ scale: 0.95 }} {...attributes} {...listeners} className={`flex flex-col items-center justify-center p-2.5 sm:p-3 border transition-all duration-300 cursor-move w-full h-full ${themeData.card} overflow-hidden backdrop-blur-xl group-hover:border-white/30`}>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="contents">
          <FaviconIcon url={link.url} name={link.name} theme={theme} />
          <span className={`text-[0.625rem] sm:text-[0.7rem] font-medium tracking-tight truncate w-full px-1 text-center leading-tight mt-1 ${themeData.text}`}>{link.name}</span>
        </a>
      </motion.div>
      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none whitespace-nowrap px-4 py-2 rounded-2xl text-[0.5625rem] font-bold shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[150] transition-all duration-500 cubic-bezier(0.175,0.885,0.32,1.275) ${themeData.panel} border ${themeData.border} backdrop-blur-3xl`}>
        🚀 点击开启 / 🎨 拖动重排
        <div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${themeData.panel} ${themeData.border}`} />
      </div>
      <button onClick={onRemove} className="absolute -top-2 -right-2 p-1.5 bg-red-500/90 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 shadow-xl z-[160] hover:bg-red-500"><X size={12} strokeWidth={4} /></button>
    </motion.div>
  );
}

const FallingParticles = ({ theme }: { theme: string }) => {
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    const isSakura = theme === 'sakura';
    const p = Array.from({ length: isSakura ? 40 : 60 }).map((_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 10, duration: 10 + Math.random() * 15,
      size: isSakura ? (5 + Math.random() * 8) : (2 + Math.random() * 4),
      sway: 50 + Math.random() * 100, opacity: 0.2 + Math.random() * 0.5, rotation: Math.random() * 360
    }));
    setParticles(p);
  }, [theme]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[11]">
      {particles.map((p) => (
        <motion.div key={p.id} initial={{ y: -50, opacity: 0, rotate: p.rotation }} animate={{ y: '110vh', x: [0, p.sway / 2, -p.sway / 2, 0], opacity: [0, p.opacity, p.opacity, 0], rotate: theme === 'sakura' ? [p.rotation, p.rotation + 720] : 0 }} transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear", x: { duration: p.duration / 2.5, repeat: Infinity, ease: "easeInOut" } }} style={{ position: 'absolute', left: `${p.x}%`, width: p.size, height: theme === 'sakura' ? p.size * 0.8 : p.size, backgroundColor: theme === 'sakura' ? '#ffb7c5' : '#ffffff', borderRadius: theme === 'sakura' ? '100% 10% 100% 10%' : '50%', filter: theme === 'sakura' ? 'none' : 'blur(0.5px)', boxShadow: theme === 'sakura' ? '0 0 10px rgba(255,183,197,0.3)' : '0 0 5px rgba(255,255,255,0.3)' }} />
      ))}
    </div>
  );
};

const CursorTrail = ({ theme }: { theme: ThemeKey }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const color = theme === 'sakura' ? '#ffb7c5' : (theme === 'ocean' ? '#06b6d4' : (theme === 'office' ? '#2b579a' : '#ffffff'));

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (mouse.current.active) {
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          size: 6 + Math.random() * 4,
          life: 1.0,
          decay: 0.02 + Math.random() * 0.02,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1
        });
      }

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.life -= p.decay;
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.life <= 0) {
          particles.current.splice(i, 1);
          i--;
          continue;
        }

        ctx.globalAlpha = p.life * 0.5;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      }
      
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1000]" />;
};

function CategorySection({ c, theme, onRemoveLink, onAddLink, onRename }: { c: Category; theme: ThemeKey; onRemoveLink: (lId: string) => void; onAddLink: () => void; onRename: (newTitle: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: c.id });
  const { setNodeRef: setDroppableRef } = useDroppable({ id: `dropzone-${c.id}` });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(c.title);
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 0 };
  const currentTheme = THEMES[theme];

  const handleBlur = () => { setIsEditing(false); if (editTitle.trim() && editTitle !== c.title) onRename(editTitle.trim()); };

  return (
    <motion.section ref={setNodeRef} style={style} className={`${isDragging ? 'opacity-30 scale-95' : 'opacity-100 scale-100'} transition-all duration-300 outline-none`} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
      <div {...(isEditing ? {} : attributes)} {...(isEditing ? {} : listeners)} className="flex items-center gap-6 mb-8 px-2 group/handle">
        <div className="relative">
          {isEditing ? (
            <input
              autoFocus
              className={`text-[0.875rem] sm:text-[1rem] font-medium tracking-[0.4em] bg-transparent border-b border-dashed border-white/20 focus:border-white/60 focus:outline-none py-1 min-w-[150px] ${currentTheme.text}`}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={e => { if (e.key === 'Enter') handleBlur(); if (e.key === 'Escape') { setEditTitle(c.title); setIsEditing(false); } }}
            />
          ) : (
            <h2 
              onClick={() => { setIsEditing(true); setEditTitle(c.title); }}
              className={`text-[0.875rem] sm:text-[1rem] font-medium tracking-[0.4em] opacity-80 group-hover/handle:opacity-100 transition-opacity cursor-text hover:bg-white/5 px-3 py-1 -mx-3 rounded-lg h-9 flex items-center ${currentTheme.text}`}
            >
              {c.title}
            </h2>
          )}
        </div>
        {!isEditing && <div className="flex-1 cursor-grab active:cursor-grabbing h-8 flex items-center"><div className={`h-[1px] w-full transition-all opacity-10 group-hover/handle:opacity-30 ${theme === 'office' ? 'bg-slate-950' : 'bg-white'}`} /></div>}
        {isEditing && <div className="flex-1 h-8 flex items-center"><div className={`h-[1px] w-full opacity-5 bg-white`} /></div>}
      </div>
      <SortableContext items={c.links.map(l => l.id)} strategy={rectSortingStrategy}>
        <div ref={setDroppableRef} className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 2xl:grid-cols-12 gap-3 sm:gap-4 lg:gap-5 min-h-[120px] p-2 -m-2 rounded-3xl">
          {c.links.map((l) => (<SortableItem key={l.id} link={l} theme={theme} onRemove={() => onRemoveLink(l.id)} />))}
          <div className="group relative flex justify-center w-full aspect-square">
            <motion.button whileHover={{ scale: 1.04, y: -6 }} whileTap={{ scale: 0.95 }} transition={springTransition} onClick={onAddLink} className={`flex flex-col items-center justify-center rounded-[1.2rem] sm:rounded-[1.4rem] border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 w-full h-full shadow-lg ${currentTheme.card} backdrop-blur-md`}><Plus className={`${currentTheme.text} opacity-50 group-hover:opacity-100 transition-opacity`} size={24} strokeWidth={2.5} /></motion.button>
            <div className={`absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none whitespace-nowrap px-4 py-2 rounded-2xl text-[0.625rem] font-bold shadow-2xl z-[100] transition-all duration-500 cubic-bezier(0.175,0.885,0.32,1.275) ${currentTheme.panel} border ${currentTheme.panelBorder} backdrop-blur-3xl`}>
              ➕ 添加快捷节点
              <div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${currentTheme.panel} ${currentTheme.panelBorder}`} />
            </div>
          </div>
        </div>
      </SortableContext>
    </motion.section>
  );
}

function NewCategoryDropzone({ currentTheme, theme, onAdd }: { currentTheme: any, theme: ThemeKey, onAdd: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: "new-cat-dropzone" });
  return (
    <motion.section ref={setNodeRef} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
      <div className={`group relative transition-all duration-300 ${isOver ? 'scale-105 brightness-150' : ''}`}>
        <button 
          onClick={onAdd} 
          className={`flex items-center gap-6 mb-8 px-2 w-full transition-all group-hover:translate-x-1 outline-none`}
        >
          <div className="flex items-center gap-2">
            <Plus className={`${currentTheme.text} opacity-30 group-hover:opacity-100 transition-opacity`} size={24} strokeWidth={3} />
            <h2 className={`text-[0.75rem] font-black tracking-[0.6em] uppercase transition-all opacity-30 group-hover:opacity-100 ${currentTheme.text}`}>新建分类模块</h2>
          </div>
          <div className={`h-[1px] flex-1 transition-all opacity-10 group-hover:opacity-30 ${theme==='office' ? 'bg-slate-950' : 'bg-white'}`} />
        </button>
        <div className={`absolute -top-12 left-6 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none whitespace-nowrap px-4 py-3 rounded-2xl text-[0.625rem] font-bold shadow-2xl z-[150] transition-all duration-500 cubic-bezier(0.175,0.885,0.32,1.275) ${currentTheme.panel} border ${currentTheme.panelBorder} backdrop-blur-3xl`}>
          {isOver ? "🚀 释放图标以创建新分类" : "📂 创建一个全新的分类模块"}
          <div className={`absolute bottom-[-4px] left-4 w-2 h-2 rotate-45 border-r border-b ${currentTheme.panel} ${currentTheme.panelBorder}`} />
        </div>
      </div>
    </motion.section>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [linkModalData, setLinkModalData] = useState<{ catId: string; name: string; url: string }>({ catId: '', name: '', url: 'https://' });
  const [newCatTitle, setNewCatTitle] = useState("");
  const [search, setSearch] = useState("");
  const [engine, setEngine] = useState<"bing" | "google" | "baidu">("bing");
  const [theme, setTheme] = useState<ThemeKey>("default");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [bgUrl, setBgUrl] = useState(DEFAULT_BG);
  const [bgType, setBgType] = useState<BgType>("video");
  const [lavaPaletteIndex, setLavaPaletteIndex] = useState<number>(-1);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [uiScale, setUiScale] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const configInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const initDB = (): Promise<IDBDatabase> => new Promise((res, rej) => { const req = indexedDB.open(DB_NAME, 5); req.onupgradeneeded = (e: any) => { if (!e.target.result.objectStoreNames.contains(STORE_NAME)) e.target.result.createObjectStore(STORE_NAME); }; req.onsuccess = (e: any) => res(e.target.result); req.onerror = rej; });

  useEffect(() => {
    setMounted(true);
    let s = localStorage.getItem(STABLE_STORAGE_KEY);
    if (!s) { for (const k of HISTORICAL_KEYS) { const d = localStorage.getItem(k); if (d) { s = d; break; } } }
    if (s) { try { const p = JSON.parse(s); if (p.categories) { setCategories(p.categories); setSelectedCatId(p.categories[0]?.id || null); } if (p.theme) setTheme(p.theme); if (p.bgType) setBgType(p.bgType); if (typeof p.lavaPaletteIndex === "number") setLavaPaletteIndex(p.lavaPaletteIndex); } catch { setSelectedCatId(DEFAULT_CATEGORIES[0].id); } }
    else setSelectedCatId(DEFAULT_CATEGORIES[0].id);
    initDB().then(db => { const tx = db.transaction(STORE_NAME, "readonly"); const store = tx.objectStore(STORE_NAME).get("bg-blob"); store.onsuccess = (ev: any) => { if (ev.target.result) { const b = ev.target.result; setBgUrl(URL.createObjectURL(b)); setBgType(b.type.startsWith('video') ? 'video' : 'image'); } setIsLoaded(true); }; store.onerror = () => setIsLoaded(true); }).catch(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (bgType === 'video' && videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {
         // Silently fail if blocked by policy
      });
    }
  }, [bgUrl, bgType, isPlaying]);

  useEffect(() => { if (mounted && isLoaded) localStorage.setItem(STABLE_STORAGE_KEY, JSON.stringify({ categories, bgType, theme, lavaPaletteIndex })); }, [categories, bgType, theme, lavaPaletteIndex, mounted, isLoaded]);
  const togglePlay = () => { if (videoRef.current) { if (isPlaying) videoRef.current.pause(); else videoRef.current.play(); setIsPlaying(!isPlaying); } };
  const toggleMute = () => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } };
  const currentTheme = THEMES[theme]; if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-500">
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${currentTheme.overlay}`} />
        <FallingParticles theme={theme} />
        {bgType === 'lava' && <LavaBackground paletteIndex={lavaPaletteIndex} />}
        {bgType === 'video' && <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" src={bgUrl} />}
        {bgType === 'image' && <img src={bgUrl} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-[1]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://res.cloudinary.com/dcb6m6vnr/image/upload/v1642944322/noise_pgeis7.png')] mix-blend-overlay z-[2]" />
      </div>

      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[500] flex items-center gap-1.5 sm:gap-2">
        <Link href="/download" className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-[0.625rem] sm:text-[0.75rem] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg border backdrop-blur-md ${currentTheme.card} ${currentTheme.text}`}><Download size={14} className="sm:hidden" /><Download size={16} className="hidden sm:block" /> <span className="hidden sm:inline tracking-wider">DOWNLOAD APP</span><span className="sm:hidden">APP</span></Link>
      </div>

      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[100] flex items-center gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
          <img src="/logo.png" alt="WEN" className="w-full h-full object-cover" />
        </div>
        <h1 className={`text-base sm:text-[1.25rem] font-black tracking-widest ${currentTheme.text}`}>WEN</h1>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2 p-2 rounded-full border shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition-all duration-500 scale-90 sm:scale-100 hover:scale-100 sm:hover:scale-105 group/dock" style={{ backgroundColor: theme === 'office' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)', borderColor: theme === 'office' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
        <motion.button whileHover={{ y: -4 }} whileTap={{scale:0.9}} onClick={()=>{setIsSettingsOpen(true);}} className="p-3 sm:p-4 rounded-full transition-all text-white/50 hover:text-white hover:bg-white/10" style={{ color: theme === 'office' ? '#64748b' : undefined }}><Settings size={20} /></motion.button>
        <div className="w-px h-6 bg-white/20 mx-1" style={{ backgroundColor: theme === 'office' ? 'rgba(0,0,0,0.1)' : undefined }} />
        <motion.button whileHover={{ y: -4 }} whileTap={{scale:0.9}} onClick={togglePlay} className="p-3 sm:p-4 rounded-full transition-all text-white/50 hover:text-white hover:bg-white/10" style={{ color: theme === 'office' ? '#64748b' : undefined }}>{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</motion.button>
        <motion.button whileHover={{ y: -4 }} whileTap={{scale:0.9}} onClick={toggleMute} className="p-3 sm:p-4 rounded-full transition-all text-white/50 hover:text-white hover:bg-white/10" style={{ color: theme === 'office' ? '#64748b' : undefined }}>{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</motion.button>
        <div className="w-px h-6 bg-white/20 mx-1" style={{ backgroundColor: theme === 'office' ? 'rgba(0,0,0,0.1)' : undefined }} />
        <motion.button whileHover={{ y: -4 }} whileTap={{scale:0.9}} onClick={()=>setIsCatModalOpen(true)} className={`p-3 sm:p-4 rounded-full transition-all shadow-lg ${currentTheme.accent}`}><FolderPlus size={20} /></motion.button>
      </div>

      <div className="relative z-[20] min-h-screen flex flex-col pt-24 sm:pt-32 overflow-hidden">
        <div className="flex-shrink-0 w-full max-w-2xl mx-auto px-4 sm:px-6 mb-10 sm:mb-16">
          <motion.div initial={{ opacity: 0, y: 40, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center gap-6">
            <div className={`flex rounded-full p-1.5 border transition-all duration-300 shadow-2xl backdrop-blur-xl ${theme === 'office' ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/10'}`}>
              {Object.keys(ENGINES).map(id => (<button key={id} onClick={()=>setEngine(id as any)} className={`px-6 py-2 sm:px-8 sm:py-2.5 rounded-full text-[0.6875rem] font-bold tracking-[0.2em] transition-all duration-300 ${engine===id ? currentTheme.accent + ' shadow-lg scale-105' : theme === 'office' ? 'text-slate-500 hover:text-slate-900' : 'text-white/40 hover:text-white'}`}>{ENGINES[id as keyof typeof ENGINES].name}</button>))}
            </div>
            <form onSubmit={(e)=>{ e.preventDefault(); if (search.trim()) window.open(`${ENGINES[engine].url}${search}`, "_blank"); }} className="w-full">
              <div className={`flex items-center rounded-[2rem] sm:rounded-[2.5rem] border-2 px-6 sm:px-10 py-1.5 sm:py-2 transition-all duration-500 shadow-[0_24px_64px_rgba(0,0,0,0.2)] ${theme === 'office' ? 'bg-white/90 border-slate-200 focus-within:bg-white focus-within:border-slate-400 focus-within:shadow-[0_24px_64px_rgba(0,0,0,0.1)]' : 'bg-black/50 border-white/10 focus-within:bg-black/70 focus-within:border-white/30 focus-within:shadow-[0_0_40px_rgba(255,255,255,0.1)]'} backdrop-blur-2xl`}>
                <Search size={28} className={`${theme === 'office' ? 'text-slate-400' : 'text-white/40'} mr-4 transition-colors`} strokeWidth={2.5} />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Explore the infinite..." className={`flex-1 py-4 sm:py-6 bg-transparent text-base sm:text-lg focus:outline-none font-medium tracking-wide ${theme === 'office' ? 'placeholder-slate-400 text-slate-900' : 'placeholder-white/30 text-white'}`} />
                <button type="submit" className={`p-3 sm:p-4 rounded-full transition-all duration-300 ${theme === 'office' ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-white/40 hover:text-white hover:bg-white/10'}`}><ChevronRight size={24} strokeWidth={2.5} /></button>
              </div>
            </form>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 min-h-0 custom-scrollbar pb-24 sm:pb-40" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 20px)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20px)' }}>
          <div className="max-w-[85rem] mx-auto pt-4 sm:pt-6">
            <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={e => setActiveId(e.active.id as string)} onDragOver={e=>{const { active, over } = e; if (!over) return; const aI = active.id as string; const oI = over.id as string; if (aI === oI) return; const fC = (id: string) => { if (categories.some(c => c.id === id)) return id; if (id.startsWith('dropzone-')) return id.replace('dropzone-', ''); return categories.find(c => c.links.some(l => l.id === id))?.id; }; const aC = fC(aI); const oC = fC(oI); if (!aC || !oC || aC === aI || oC === oI) return; if (aC !== oC) { setCategories(prev => { const aCatIdx = prev.findIndex(c => c.id === aC); const oCatIdx = prev.findIndex(c => c.id === oC); if (aCatIdx<0 || oCatIdx<0) return prev; const aL = [...prev[aCatIdx].links]; const oL = [...prev[oCatIdx].links]; const aIdx = aL.findIndex(l => l.id === aI); if (aIdx < 0) return prev; const [mI] = aL.splice(aIdx, 1); if (oI.startsWith('dropzone-')) oL.push(mI); else { const oIdx = oL.findIndex(l => l.id === oI); oL.splice(oIdx >= 0 ? oIdx : oL.length, 0, mI); } const nC = [...prev]; nC[aCatIdx] = { ...prev[aCatIdx], links: aL }; nC[oCatIdx] = { ...prev[oCatIdx], links: oL }; return nC; }); } else { setCategories(prev => { const cI = prev.findIndex(c => c.id === aC); if (cI<0) return prev; const nL = arrayMove(prev[cI].links, prev[cI].links.findIndex(l => l.id === aI), prev[cI].links.findIndex(l => l.id === oI)); const nC = [...prev]; nC[cI] = { ...prev[cI], links: nL }; return nC; }); } }} onDragEnd={(e)=>{const {active, over} = e; if (over) { const fC = (id: string) => { if (categories.some(c => c.id === id)) return id; if (id.startsWith('dropzone-')) return id.replace('dropzone-', ''); return categories.find(c => c.links.some(l => l.id === id))?.id; }; if (over.id === "new-cat-dropzone") { if (!categories.some(c => c.id === active.id)) { setCategories(prev => { let mL: any = null; const nCs = prev.map(cat => { const lI = cat.links.findIndex(l => l.id === active.id); if (lI >= 0) { mL = cat.links[lI]; const nLs = [...cat.links]; nLs.splice(lI, 1); return { ...cat, links: nLs }; } return cat; }); if (mL) return [...nCs, { id: `cat-${Date.now()}`, title: "新分类", links: [mL] }]; return prev; }); } } else if (active.id !== over.id) { if (categories.some(c => c.id === active.id)) { setCategories((items) => { const oldIdx = items.findIndex(i => i.id === active.id); const newIdx = items.findIndex(i => i.id === (over.id.toString().startsWith('dropzone-')?over.id.toString().replace('dropzone-',''):over.id)); return arrayMove(items, oldIdx, newIdx); }); } } } setActiveId(null);}}>
              <motion.main initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }} className="space-y-8 sm:space-y-12">
                <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {categories.map((c) => (
                    <CategorySection
                      key={c.id} 
                      c={c} 
                      theme={theme} 
                      onRemoveLink={(lId) => setCategories(prev => prev.map(cat => ({ ...cat, links: cat.links.filter(li => li.id !== lId) })))}
                      onAddLink={() => { setLinkModalData({ catId: c.id, name: '', url: 'https://' }); setIsLinkModalOpen(true); }}
                      onRename={(newVal) => setCategories(prev => prev.map(cat => cat.id === c.id ? { ...cat, title: newVal } : cat))}
                    />
                  ))}
                </SortableContext>
                
                <NewCategoryDropzone currentTheme={currentTheme} theme={theme} onAdd={() => setIsCatModalOpen(true)} />
              </motion.main>
              <DragOverlay dropAnimation={null}>{activeId && categories.find(c=>c.links.some(l=>l.id===activeId)) ? (<div className={`p-3 rounded-[1.4rem] border shadow-2xl scale-110 w-[84px] aspect-square flex flex-col items-center justify-center pointer-events-none ${currentTheme.card}`}><FaviconIcon url={categories.find(c=>c.links.some(l=>l.id===activeId))?.links.find(l=>l.id===activeId)?.url || ''} name={categories.find(c=>c.links.some(l=>l.id===activeId))?.links.find(l=>l.id===activeId)?.name || ''} theme={theme} /><span className={`text-[0.625rem] font-bold truncate w-full px-1 text-center ${currentTheme.text}`}>{categories.find(c=>c.links.some(l=>l.id===activeId))?.links.find(l=>l.id===activeId)?.name}</span></div>) : null}</DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLinkModalOpen && (
           <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4">
             <motion.div key="link-modal-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsLinkModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />
             <motion.div key="link-modal-content" initial={{opacity:0, scale: 0.9, y: 20}} animate={{opacity:1, scale: 1, y: 0}} exit={{opacity:0, scale: 0.9, y: 20}} className={`relative ${currentTheme.panel} border ${currentTheme.panelBorder} rounded-[1.5rem] sm:rounded-[2rem] w-full max-sm:max-w-xs max-w-sm overflow-hidden shadow-2xl shadow-black`}>
               <div className={`px-5 sm:px-8 py-5 sm:py-8 border-b ${currentTheme.panelBorder} flex items-center gap-3`}><div className={`p-2 ${currentTheme.panelSidebar} rounded-lg`}><Plus size={16} className="opacity-60"/></div><div><h3 className={`font-bold text-base sm:text-[1.125rem] leading-none ${currentTheme.panelText}`}>添加导航节点</h3><p className={`text-[0.5rem] sm:text-[0.5625rem] opacity-60 uppercase tracking-widest mt-1 ${currentTheme.panelMuted}`}>New Shortcut node</p></div></div>
               <div className="p-5 sm:p-8 space-y-4 sm:space-y-6"><div className="space-y-3 sm:space-y-4"><div className="space-y-1.5"><label className={`text-[0.5rem] sm:text-[0.5625rem] font-bold opacity-80 uppercase tracking-[0.2em] pl-1 ${currentTheme.panelText}`}>名称 / LABEL</label><input autoFocus value={linkModalData.name} onChange={e=>setLinkModalData(p=>({...p, name: e.target.value}))} placeholder="网站名称" className={`w-full ${currentTheme.panelInput} border ${currentTheme.panelBorder} rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-[0.875rem] font-bold focus:outline-none focus:border-cyan-500/50 transition-all`} /></div><div className="space-y-1.5"><label className={`text-[0.5rem] sm:text-[0.5625rem] font-bold opacity-80 uppercase tracking-[0.2em] pl-1 ${currentTheme.panelText}`}>链接 / URL</label><input value={linkModalData.url} onChange={e=>setLinkModalData(p=>({...p, url: e.target.value}))} placeholder="https://" className={`w-full ${currentTheme.panelInput} border ${currentTheme.panelBorder} rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-[0.875rem] font-bold focus:outline-none focus:border-cyan-500/50 transition-all`} /></div></div><div className="grid grid-cols-2 gap-3 pt-2"><button onClick={()=>setIsLinkModalOpen(false)} className={`py-3 sm:py-4 ${currentTheme.panelSidebar} border ${currentTheme.panelBorder} rounded-xl text-[0.6875rem] font-bold hover:brightness-110 transition-all ${currentTheme.panelText}`}>取消退出</button><button onClick={()=>{const { catId, name, url } = linkModalData; if (!name || !url) return; setCategories(prev => prev.map(cat => cat.id === catId ? { ...cat, links: [...cat.links, { id: `link-${Date.now()}`, name, url }] } : cat)); setIsLinkModalOpen(false); }} className={`py-3 sm:py-4 ${currentTheme.accent} rounded-xl text-[0.6875rem] font-bold shadow-xl active:scale-95 transition-all text-white`}>保存节点</button></div></div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCatModalOpen && (
           <div className="fixed inset-0 z-[305] flex items-center justify-center p-3 sm:p-4">
              <motion.div key="cat-modal-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsCatModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />
              <motion.div key="cat-modal-content" initial={{opacity:0, scale: 0.9, y: 20}} animate={{opacity:1, scale: 1, y: 0}} exit={{opacity:0, scale: 0.9, y: 20}} className={`relative ${currentTheme.panel} border ${currentTheme.panelBorder} rounded-[1.5rem] sm:rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl`}><div className={`px-5 sm:px-8 py-5 sm:py-8 border-b ${currentTheme.panelBorder} flex items-center gap-3`}><div className={`p-2 ${currentTheme.panelSidebar} rounded-lg`}><FolderPlus size={16} className="opacity-60"/></div><div><h3 className={`font-bold text-base sm:text-[1.125rem] leading-none ${currentTheme.panelText}`}>新建分类层</h3><p className={`text-[0.5rem] sm:text-[0.5625rem] opacity-60 uppercase tracking-widest mt-1 ${currentTheme.panelMuted}`}>Add Module Cluster</p></div></div><div className="p-5 sm:p-8 space-y-4 sm:space-y-6"><div className="space-y-2"><label className={`text-[0.5rem] sm:text-[0.5625rem] font-bold opacity-80 uppercase tracking-[0.2em] pl-1 ${currentTheme.panelText}`}>分类名称 / CLUSTER TITLE</label><input autoFocus value={newCatTitle} onChange={e=>setNewCatTitle(e.target.value)} placeholder="例如：娱乐天地" className={`w-full ${currentTheme.panelInput} border ${currentTheme.panelBorder} rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-[0.875rem] font-bold focus:outline-none focus:border-cyan-500/50 transition-all`} /></div><div className="grid grid-cols-2 gap-3 pt-2"><button onClick={()=>setIsCatModalOpen(false)} className={`py-3 sm:py-4 ${currentTheme.panelSidebar} border ${currentTheme.panelBorder} rounded-xl text-[0.6875rem] font-bold hover:brightness-110 transition-all ${currentTheme.panelText}`}>放弃操作</button><button onClick={()=>{if (!newCatTitle.trim()) return; const nI = `cat-${Date.now()}`; setCategories([...categories, { id: nI, title: newCatTitle, links: [] }]); setSelectedCatId(nI); setNewCatTitle(""); setIsCatModalOpen(false);}} className={`py-3 sm:py-4 ${currentTheme.accent} rounded-xl text-[0.6875rem] font-bold shadow-xl active:scale-95 transition-all text-white`}>立即创建</button></div></div></motion.div>
           </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-0 sm:p-4">
             <motion.div key="settings-modal-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsSettingsOpen(false)} className="absolute inset-0 backdrop-blur-xl" />
             <motion.div key="settings-modal-content" initial={{opacity:0, scale: 0.95, y: 30}} animate={{opacity:1, scale: 1, y: 0}} exit={{opacity:0, scale: 0.95, y: 30}} className={`relative ${currentTheme.panel} border ${currentTheme.panelBorder} rounded-none sm:rounded-[1.8rem] w-full max-w-5xl h-[100dvh] sm:h-[85vh] flex flex-col shadow-2xl overflow-hidden`}>
                <div className={`px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-b ${currentTheme.panelBorder}`}><div className="flex items-center gap-3 sm:gap-4"><div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center border ${currentTheme.panelBorder} ${currentTheme.panelSidebar}`}><Shield size={18} className="sm:hidden opacity-60" /><Shield size={20} className="hidden sm:block opacity-60" /></div><div><h3 className={`text-sm sm:text-[1.125rem] font-bold ${currentTheme.panelText}`}>WEN 控制面板</h3><p className={`text-[0.5rem] sm:text-[0.5625rem] opacity-60 uppercase tracking-widest mt-0.5 ${currentTheme.panelMuted}`}>Configuration System</p></div></div><button onClick={()=>setIsSettingsOpen(false)} className={`p-2 opacity-30 hover:opacity-100 transition-all ${currentTheme.panelText}`}><X size={22}/></button></div>
                <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
                   <div className={`w-full sm:w-[280px] border-b sm:border-b-0 sm:border-r ${currentTheme.panelBorder} flex flex-col ${currentTheme.panelSidebar} font-bold`}><div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-8 sm:space-y-12"><section><div className="flex items-center justify-between mb-4"><label className={`text-[0.625rem] font-bold uppercase tracking-[0.3em] opacity-80 flex items-center gap-2 ${currentTheme.panelText}`}><Palette size={12}/> 视觉主题 / THEMES</label></div><div className="flex items-center justify-between gap-1.5 px-0.5">{(Object.keys(THEMES) as ThemeKey[]).map(key => (<button key={key} onClick={() => setTheme(key)} className={`group relative flex-1 aspect-square rounded-lg border transition-all flex items-center justify-center overflow-hidden h-9 ${theme === key ? 'border-primary' : `${currentTheme.panelBorder}`}`}><div className={`absolute inset-0 ${THEMES[key].preview} opacity-80`} />{theme === key && <Check size={14} className="relative z-10 text-white" />}</button>))}</div></section><section><div className="flex items-center justify-between mb-4"><label className={`text-[0.625rem] font-bold uppercase tracking-[0.3em] opacity-80 flex items-center gap-2 ${currentTheme.panelText}`}><Flame size={12}/> 熔岩调色 / LAVA PALETTE</label></div><div className="grid grid-cols-3 gap-2 px-0.5">{LAVA_PALETTES.map((palette, idx) => (<button key={palette.name} onClick={() => setLavaPaletteIndex(prev => prev === idx ? -1 : idx)} className={`group relative h-9 rounded-lg border transition-all flex items-center justify-center overflow-hidden ${lavaPaletteIndex === idx ? 'border-orange-500 ring-1 ring-orange-500/50' : currentTheme.panelBorder}`} title={palette.name}><div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${palette.colors[0]}, ${palette.colors[1]}, ${palette.colors[2]})` }} />{lavaPaletteIndex === idx && <Check size={14} className="relative z-10 text-white drop-shadow-md" />}</button>))}<button onClick={() => setLavaPaletteIndex(-1)} className={`h-9 rounded-lg border transition-all flex items-center justify-center text-[0.5rem] uppercase tracking-wider ${lavaPaletteIndex === -1 ? 'border-orange-500 text-orange-400 bg-orange-500/10' : currentTheme.panelBorder + ' ' + currentTheme.panelText}`}>自动</button></div></section><section><div className="flex items-center justify-between mb-6"><label className={`text-[0.625rem] font-bold uppercase tracking-[0.3em] opacity-80 flex items-center gap-2 ${currentTheme.panelText}`}><Layers size={12}/> 分类管理 / CLUSTERS</label><div className="group relative flex justify-center"><button onClick={()=>setIsCatModalOpen(true)} className={`p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-all ${currentTheme.panelText}`}><Plus size={14}/></button><div className={`absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-2xl text-[0.5625rem] font-bold shadow-2xl z-[150] transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${currentTheme.panel} border ${currentTheme.panelBorder} backdrop-blur-3xl`}>📂 创建全新分类模块<div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b ${currentTheme.panel} ${currentTheme.panelBorder}`} /></div></div></div><div className="space-y-3">{categories.map((cat) => (<button key={cat.id} onClick={()=>setSelectedCatId(cat.id)} className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-[0.6875rem] font-bold flex items-center justify-between transition-all border ${selectedCatId === cat.id ? `${currentTheme.accent} border-transparent shadow-lg` : `${currentTheme.panelSidebar} ${currentTheme.panelBorder} opacity-60 hover:opacity-100`}`}><span className="truncate">{cat.title}</span><span className="opacity-50 font-mono">{cat.links.length}</span></button>))}</div></section></div></div>
                   <div className="flex-1 flex flex-col overflow-hidden">
                     {selectedCatId && categories.find(c=>c.id===selectedCatId) ? (
                       <>
                         <div className={`px-4 sm:px-10 py-4 sm:py-8 border-b ${currentTheme.panelBorder} flex items-center justify-between`}><div className={`flex items-center gap-3 sm:gap-6 ${currentTheme.panelText}`}><div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-[1.125rem] font-bold opacity-60 italic ${currentTheme.panelSidebar}`}>{categories.findIndex(c => c.id === selectedCatId) + 1}</div><div><input value={categories.find(c=>c.id===selectedCatId)?.title} onChange={(e)=>{ const n=[...categories]; const i=n.findIndex(x=>x.id===selectedCatId); n[i].title=e.target.value; setCategories(n); }} className={`bg-transparent font-bold text-lg sm:text-[1.5rem] focus:outline-none w-full shadow-none border-none ring-0 outline-none ${currentTheme.panelText}`} /><p className={`text-[0.5rem] sm:text-[0.5625rem] opacity-60 uppercase tracking-[0.4em] mt-1 font-bold ${currentTheme.panelMuted}`}>Category Instance Identifier</p></div></div><button onClick={()=>{if(confirm("确定永久移除此分类模块？")) { const n=categories.filter(x=>x.id!==selectedCatId); setCategories(n); if(n.length) setSelectedCatId(n[0].id); else setSelectedCatId(null); }}} className="p-2 sm:p-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl sm:rounded-2xl transition-all flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-widest"><Trash2 size={14} className="sm:hidden" /><Trash2 size={16} className="hidden sm:block" /> <span className="hidden sm:inline">删除分类</span></button></div>
                         <div className="flex-1 p-4 sm:p-10 overflow-y-auto custom-scrollbar space-y-6 sm:space-y-8">
                           <div className="grid grid-cols-1 gap-3 sm:gap-4">
                             <div className={`flex items-center gap-3 px-2 sm:px-6 opacity-60 mb-2 ${currentTheme.panelText}`}><span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] flex-1">节点名称 / LABEL</span><span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] flex-[2] hidden sm:block">目标地址 / URL</span><div className="w-8" /></div>
                             {categories.find(c=>c.id===selectedCatId)?.links.map((l, lIdx) => (
                               <motion.div key={l.id} className={`flex gap-2 sm:gap-4 p-3 sm:p-5 rounded-[1.2rem] sm:rounded-[1.6rem] items-center border transition-all ${currentTheme.panelInput} ${currentTheme.panelBorder}`}>
                                 <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${currentTheme.panelSidebar}`}><Globe size={12} className="sm:hidden opacity-60"/><Globe size={14} className="hidden sm:block opacity-60"/></div>
                                 <input value={l.name} onChange={(e)=>{const n=[...categories]; const ci=n.findIndex(x=>x.id===selectedCatId); n[ci].links[lIdx].name=e.target.value; setCategories(n);}} className={`bg-transparent text-sm sm:text-[0.875rem] font-bold w-28 sm:w-44 focus:outline-none ${currentTheme.panelText}`} />
                                 <input value={l.url} onChange={(e)=>{const n=[...categories]; const ci=n.findIndex(x=>x.id===selectedCatId); n[ci].links[lIdx].url=e.target.value; setCategories(n);}} className={`bg-transparent text-xs sm:text-[0.6875rem] flex-1 opacity-60 focus:opacity-100 transition-opacity truncate focus:outline-none ${currentTheme.panelMuted}`} />
                                 <button onClick={()=>{const n=[...categories]; const ci=n.findIndex(x=>x.id===selectedCatId); n[ci].links.splice(lIdx,1); setCategories(n);}} className="text-red-500 p-1.5 sm:p-2 hover:bg-red-500/10 rounded-lg sm:rounded-xl transition-all"><X size={14} className="sm:hidden"/><X size={16} className="hidden sm:block"/></button>
                               </motion.div>
                             ))}
                             <button onClick={()=>{ setLinkModalData({ catId: selectedCatId!, name: '', url: 'https://' }); setIsLinkModalOpen(true); }} className={`w-full py-4 sm:py-6 border-2 border-dashed rounded-[1.2rem] sm:rounded-[1.6rem] flex items-center justify-center gap-3 text-[0.6875rem] font-bold opacity-60 hover:opacity-100 transition-all mt-4 ${currentTheme.panelBorder} ${currentTheme.panelText}`}><Plus size={16} className="sm:hidden"/><Plus size={18} className="hidden sm:block"/> <span className="hidden sm:inline">APPEND NEW NODE</span><span className="sm:hidden">添加节点</span></button>
                           </div>
                         </div>
                       </>
                     ) : (
                       <div className={`flex-1 flex flex-col items-center justify-center text-center opacity-20 p-10 sm:p-20 ${currentTheme.panelText}`}>
                         <Layers size={48} className="sm:hidden mb-4" />
                         <Layers size={64} className="hidden sm:block mb-6" />
                         <h4 className="text-base sm:text-[1.25rem] font-bold uppercase tracking-widest">请选择或创建一个分类模块</h4>
                       </div>
                     )}
                   </div>
                </div>
                <div className={`p-3 sm:p-6 border-t ${currentTheme.panelBorder} flex items-center justify-between ${currentTheme.panelSidebar} backdrop-blur-3xl`}>
                  <div className="flex gap-2 sm:gap-4">
                    {[
                      { icon: <><ImageIcon size={16} className="sm:hidden"/><ImageIcon size={18} className="hidden sm:block"/></>, title: "更换背景", tip: "✨ 自定义你的专属空间", onClick: () => fileInputRef.current?.click() },
                      { icon: <><RefreshCw size={16} className="sm:hidden"/><RefreshCw size={18} className="hidden sm:block"/></>, title: "重置背景", tip: "🏠 返回最初的梦(默认壁纸)", onClick: () => { setBgUrl(DEFAULT_BG); setBgType('video'); initDB().then(db => { db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete("bg-blob"); }); alert("已重置为默认背景"); } },
                      { icon: <><Flame size={16} className="sm:hidden"/><Flame size={18} className="hidden sm:block"/></>, title: "熔岩背景", tip: bgType === 'lava' ? "🌋 当前：熔岩模式（点击关闭）" : "🌋 切换到熔岩背景", onClick: () => setBgType(prev => prev === 'lava' ? 'video' : 'lava') },
                      { icon: <><Upload size={16} className="sm:hidden"/><Upload size={18} className="hidden sm:block"/></>, title: "导出配置", tip: "📦 保存当前灵感实验室", onClick: () => { const d = JSON.stringify({ categories, theme, bgType }, null, 2); const b = new Blob([d], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "WEN_Backup.json"; a.click(); } },
                      { icon: <><Download size={16} className="sm:hidden"/><Download size={18} className="hidden sm:block"/></>, title: "导入配置", tip: "📥 加载以前的设计配置", onClick: () => configInputRef.current?.click() }
                    ].map((btn, idx) => (
                      <div key={idx} className="group relative flex justify-center">
                        <button onClick={btn.onClick} className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all shadow-xl hover:scale-110 active:scale-90 hover:brightness-125 ${btn.title === '熔岩背景' && bgType === 'lava' ? 'bg-orange-500/30 border-orange-500/60 text-orange-400' : currentTheme.panelInput}`}>{btn.icon}</button>
                        <div className={`absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none whitespace-nowrap px-4 py-3 rounded-2xl text-[0.625rem] font-bold shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] transition-all duration-500 cubic-bezier(0.175,0.885,0.32,1.275) ${currentTheme.panel} border ${currentTheme.panelBorder} backdrop-blur-3xl`}>
                          {btn.tip}
                          <div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${currentTheme.panel} ${currentTheme.panelBorder}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className={`text-[0.625rem] opacity-60 font-bold uppercase tracking-[0.2em] hidden md:block ${currentTheme.panelMuted}`}>Engine Build v1.1.55</div>
                    <button onClick={()=>setIsSettingsOpen(false)} className={`px-6 sm:px-16 py-3 sm:py-4 font-bold text-xs rounded-lg sm:rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 text-nowrap ${currentTheme.accent}`}>保存当前全部配置</button>
                  </div>
                </div>
             </motion.div>
           </div>
          )}
       </AnimatePresence>

      <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*" onChange={(e)=>{ const f = e.target.files?.[0]; if(f){ const t = f.type.startsWith('video')?'video':'image'; setBgType(t); setBgUrl(URL.createObjectURL(f)); initDB().then(db => { const tx = db.transaction(STORE_NAME, "readwrite"); tx.objectStore(STORE_NAME).put(f, "bg-blob"); }); } }} />
      <input type="file" ref={configInputRef} className="hidden" accept=".json" onChange={(e)=>{ const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onload=(ev)=>{ try { const p = JSON.parse(ev.target?.result as string); if(p.categories){setCategories(p.categories); setSelectedCatId(p.categories[0]?.id); alert("导入成功"); } }catch(err){alert("文件无效");} }; r.readAsText(f); } }} />
      <CursorTrail theme={theme} />
      <MusicPlayer theme={theme} />
    </div>
  );
}
