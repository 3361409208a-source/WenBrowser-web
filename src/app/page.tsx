"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Play, Pause, Volume2, VolumeX, Plus, X, Search, Trash2, Shield, Monitor, Palette, Upload, Share2, Globe, FolderPlus, Layers, ChevronRight, Hash, Check, RefreshCw, Image as ImageIcon } from "lucide-react";

interface Link {
  id: string;
  name: string;
  url: string;
}

interface Category {
  id: string;
  title: string;
  links: Link[];
}

type ThemeKey = "default" | "vscode" | "office" | "sakura" | "ocean";

const DEFAULT_BG = "https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91Kuroha%E4%BD%9C%E5%93%81-%E5%8A%A8%E6%BC%AB%E7%BA%BF%E7%A8%BF.mp4";

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    title: "✨ 常用导航",
    links: [
      { id: "link-1", name: "哔哩哔哩", url: "https://www.bilibili.com/" },
      { id: "link-2", name: "抖音", url: "https://www.douyin.com/" },
      { id: "link-3", name: "小红书", url: "https://www.xiaohongshu.com/" },
      { id: "link-4", name: "腾讯视频", url: "https://v.qq.com/" },
      { id: "link-5", name: "爱奇艺", url: "https://www.iqiyi.com/" },
      { id: "link-6", name: "优酷", url: "https://www.youku.com/" },
    ],
  },
  {
    id: "cat-2",
    title: "🎮 热门游戏",
    links: [
      { id: "game-1", name: "4399小游戏", url: "https://www.4399.com/" },
      { id: "game-2", name: "TapTap", url: "https://www.taptap.cn/" },
      { id: "game-3", name: "米游社", url: "https://www.miyoushe.com/" },
    ],
  },
];

const THEMES: Record<ThemeKey, { name: string; overlay: string; text: string; accent: string; card: string; panel: string; btn: string; subtext: string; border: string; preview: string }> = {
  default: { 
    name: "极客毛玻璃", overlay: "bg-black/40", text: "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]", accent: "bg-white text-black", card: "bg-white/5 border-white/10 backdrop-blur-2xl", panel: "bg-slate-950/95 text-white", subtext: "text-white/30", border: "border-white/5", btn: "bg-white/5 text-white hover:bg-white/10", preview: "bg-slate-400"
  },
  vscode: { 
    name: "VS Code 暗色", overlay: "bg-[#1e1e1e]/60", text: "text-[#cccccc]", accent: "bg-[#007acc] text-white", card: "bg-white/5 border-white/5 backdrop-blur-md", panel: "bg-[#1e1e1e] text-white", subtext: "text-[#666666]", border: "border-[#333]", btn: "bg-[#333333] text-[#ccc] hover:bg-[#444]", preview: "bg-[#007acc]"
  },
  office: { 
    name: "Office 简约白", overlay: "bg-white/10", text: "text-slate-800", accent: "bg-[#2b579a] text-white", card: "bg-white/10 border-white/20 backdrop-blur-xl shadow-lg", panel: "bg-white text-slate-800", subtext: "text-slate-400 font-bold", border: "border-slate-50", btn: "bg-slate-50 text-slate-500 hover:bg-slate-100", preview: "bg-slate-200"
  },
  sakura: { 
    name: "樱花粉", overlay: "bg-pink-100/10", text: "text-pink-900", accent: "bg-pink-400 text-white", card: "bg-white/10 border-white/20 backdrop-blur-xl shadow-lg", panel: "bg-pink-50 text-pink-900", subtext: "text-pink-200 font-bold", border: "border-pink-50", btn: "bg-pink-50 text-pink-300 hover:bg-pink-100", preview: "bg-pink-400"
  },
  ocean: { 
    name: "深海蓝", overlay: "bg-blue-900/20", text: "text-blue-50", accent: "bg-cyan-500 text-white", card: "bg-white/5 border-blue-400/10 backdrop-blur-2xl", panel: "bg-blue-950 text-white", subtext: "text-blue-400/40", border: "border-blue-800", btn: "bg-blue-800/40 text-blue-200 hover:bg-blue-700/40", preview: "bg-cyan-600"
  },
};

const ENGINES = {
  bing: { name: "必应", url: "https://www.bing.com/search?q=", iframeUrl: "https://www.bing.com/search?q=" },
  google: { name: "谷歌", url: "https://www.google.com/search?q=", iframeUrl: "https://www.google.com/search?q=" },
  baidu: { name: "百度", url: "https://www.baidu.com/s?wd=", iframeUrl: "https://www.baidu.com/s?wd=" },
};

// FIXED: Added 'as const' to fix TypeScript inference error on Vercel build
const springTransition = { type: "spring" as const, stiffness: 450, damping: 25 };

function SortableItem({ link, theme, onRemove }: { link: Link; theme: ThemeKey; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 2000 : 0 };
  const themeData = THEMES[theme];
  return (
    <motion.div ref={setNodeRef} style={style} initial={false} whileHover={{ scale: 1.08, y: -4, zIndex: 100 }} whileTap={{ scale: 0.98 }} transition={springTransition} className={`group relative ${isDragging ? "opacity-0" : "opacity-100"}`}>
      <div {...attributes} {...listeners} className={`flex flex-col items-center justify-center p-2.5 rounded-[1.2rem] border transition-all cursor-move aspect-square w-full ${themeData.card} hover:border-white/40 shadow-xl overflow-hidden`}>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="contents">
          <div className="w-8 h-8 sm:w-9 sm:h-9 mb-1.5 rounded-[0.8rem] bg-white/5 flex items-center justify-center shadow-sm border border-white/5 group-hover:bg-white/10 text-current font-bold">{link.name[0]}</div>
          <span className={`text-[9px] sm:text-[10px] font-bold tracking-tight truncate w-full px-1 text-center leading-tight ${themeData.text}`}>{link.name}</span>
        </a>
      </div>
      <button onClick={onRemove} className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all scale-75 hover:scale-100 shadow-xl z-[150]"><X size={10} strokeWidth={4} /></button>
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bgUrl, setBgUrl] = useState(DEFAULT_BG);
  const [bgType, setBgType] = useState<"video" | "image">("video");
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeId, setActiveId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const configInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("moyu-v23-build-fix");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.categories) { setCategories(p.categories); setSelectedCatId(p.categories[0]?.id || null); }
        if (p.bgType) setBgType(p.bgType); if (p.theme) setTheme(p.theme);
      } catch (e) {}
    } else { setSelectedCatId(DEFAULT_CATEGORIES[0].id); }
    const r = indexedDB.open("moyu-storage-db", 2);
    r.onsuccess = (e: any) => {
      const db = e.target.result; const tx = db.transaction(["assets"],"readonly");
      tx.objectStore("assets").get("bg-blob").onsuccess = (ev: any) => { if (ev.target.result) setBgUrl(URL.createObjectURL(ev.target.result)); };
    };
    const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer);
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem("moyu-v23-build-fix", JSON.stringify({ categories, bgType, theme })); }, [categories, bgType, theme, mounted]);

  const togglePlay = () => { if (videoRef.current) { if (isPlaying) videoRef.current.pause(); else videoRef.current.play(); setIsPlaying(!isPlaying); } };
  const toggleMute = () => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } };
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (search.trim()) window.open(`${ENGINES[engine].url}${search}`, "_blank"); };

  const exportConfig = () => {
    const d = JSON.stringify({ categories, theme, bgType }, null, 2); const b = new Blob([d], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "WEN_Backup.json"; a.click();
  };

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e; if (!over) return; const aI = active.id as string; const oI = over.id as string; if (aI === oI) return;
    const fC = (id: string) => { if (categories.some(c => c.id === id)) return id; return categories.find(c => c.links.some(l => l.id === id))?.id; };
    const aC = fC(aI); const oC = fC(oI); if (!aC || !oC) return;
    if (aC !== oC) {
      setCategories(prev => {
        const aCatIdx = prev.findIndex(c => c.id === aC); const oCatIdx = prev.findIndex(c => c.id === oC);
        const aL = [...prev[aCatIdx].links]; const oL = [...prev[oCatIdx].links]; const aIdx = aL.findIndex(l => l.id === aI); const [mI] = aL.splice(aIdx, 1);
        if (oI === oC) { oL.push(mI); } else { const oIdx = oL.findIndex(l => l.id === oI); oL.splice(oIdx >= 0 ? oIdx : oL.length, 0, mI); }
        const nC = [...prev]; nC[aCatIdx] = { ...prev[aCatIdx], links: aL }; nC[oCatIdx] = { ...prev[oCatIdx], links: oL }; return nC;
      });
    } else {
      setCategories(prev => {
        const cI = prev.findIndex(c => c.id === aC); const nL = arrayMove(prev[cI].links, prev[cI].links.findIndex(l => l.id === aI), prev[cI].links.findIndex(l => l.id === oI));
        const nC = [...prev]; nC[cI] = { ...prev[cI], links: nL }; return nC;
      });
    }
  };

  const activeLinkData = useMemo(() => { if (!activeId) return null; for (const cat of categories) { const link = cat.links.find((l) => l.id === activeId); if (link) return link; } return null; }, [activeId, categories]);
  const saveNewLink = () => { const { catId, name, url } = linkModalData; if (!name || !url) return; setCategories(prev => prev.map(cat => cat.id === catId ? { ...cat, links: [...cat.links, { id: `link-${Date.now()}`, name, url }] } : cat)); setIsLinkModalOpen(false); };
  const saveNewCategory = () => { if (!newCatTitle.trim()) return; const nI = `cat-${Date.now()}`; setCategories([...categories, { id: nI, title: newCatTitle, links: [] }]); setSelectedCatId(nI); setNewCatTitle(""); setIsCatModalOpen(false); };
  const selectedCategory = useMemo(() => categories.find(c => c.id === selectedCatId) || categories[0], [selectedCatId, categories]);
  const currentTheme = THEMES[theme]; if (!mounted) return null;

  return (
    <div className={`relative min-h-screen overflow-hidden font-['MaoKenZhuyuanTi'] transition-colors duration-500`}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {bgType==='video' ? ( <motion.video key={bgUrl} ref={videoRef} className="w-full h-full object-cover" src={bgUrl} autoPlay muted loop playsInline /> ) : ( <motion.img key={bgUrl} src={bgUrl} className="w-full h-full object-cover" /> )}
        </AnimatePresence>
        <div className={`absolute inset-0 transition-colors duration-1000 ${currentTheme.overlay}`} />
      </div>

      <div className="fixed top-6 right-6 z-[100] flex items-center gap-2">
        <button onClick={()=>setIsDownloadOpen(true)} className="px-5 py-2.5 bg-white text-black rounded-xl font-bold text-[10px] sm:text-xs">下载 WENBrowser</button>
        <div className="flex bg-black/20 backdrop-blur-2xl rounded-xl p-1 border border-white/5">
          <button onClick={()=>setIsSettingsOpen(true)} className="p-2 text-white/30 hover:text-white transition-all"><Settings size={16}/></button>
          <button onClick={togglePlay} className="p-2 text-white/30 hover:text-white transition-all">{isPlaying ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}</button>
          <button onClick={toggleMute} className="p-2 text-white/30 hover:text-white transition-all">{isMuted ? <VolumeX size={16}/> : <Volume2 size={16}/>}</button>
        </div>
      </div>

      <div className="fixed top-6 left-6 z-[100] flex items-center gap-3">
        <div className="w-10 h-10 p-2 bg-black/20 backdrop-blur-2xl rounded-xl border border-white/10 flex items-center justify-center text-white font-bold">W</div>
        <h1 className={`text-xl font-bold tracking-tighter italic hidden sm:block ${currentTheme.text}`}>WENBrowser</h1>
      </div>

      <div className="relative z-10 max-w-[85rem] mx-auto px-6 py-10 mt-24 h-full overflow-y-auto pb-64 custom-scrollbar">
        <div className="flex flex-col items-center gap-5 mb-24">
          <div className="flex bg-white/5 backdrop-blur-2xl rounded-xl p-1 border border-white/10">
            {Object.keys(ENGINES).map(id => ( <button key={id} onClick={()=>setEngine(id as any)} className={`px-6 py-1.5 rounded-lg text-[10px] font-bold transition-all ${engine===id?'bg-white text-black shadow-lg' : 'text-white/20 hover:text-white'}`}>{ENGINES[id as keyof typeof ENGINES].name}</button> ))}
          </div>
          <form onSubmit={handleSearch} className="w-full max-w-lg">
            <div className={`flex items-center bg-white/5 backdrop-blur-[32px] rounded-2xl border border-white/20 px-8 py-0.5 focus-within:bg-white/10 focus-within:border-white/40 transition-all shadow-xl`}>
              <Search size={20} className="text-white/20 mr-4" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`搜索灵感...`} className={`flex-1 py-4 bg-transparent text-sm focus:outline-none font-bold placeholder-white/10 ${currentTheme.text}`} />
            </div>
          </form>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={()=>{setActiveId(null);}}>
          <main className="space-y-20">
            {categories.map((c) => (
              <section key={c.id}>
                <div className="flex items-center gap-5 mb-8 px-2">
                   <h2 className={`text-[11px] font-bold tracking-[0.5em] uppercase opacity-40 ${currentTheme.text}`}>{c.title}</h2>
                   <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <SortableContext items={c.links.map(l=>l.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5">
                    {c.links.map((l) => ( <SortableItem key={l.id} link={l} theme={theme} onRemove={()=>{setCategories(prev=>prev.map(cat=>({...cat,links:cat.links.filter(li=>li.id!==l.id)})))}} /> ))}
                    <motion.button whileHover={{ scale: 1.05 }} transition={springTransition} onClick={() => { setLinkModalData({ catId: c.id, name: '', url: 'https://' }); setIsLinkModalOpen(true); }} className={`flex items-center justify-center rounded-[1.2rem] border border-dashed border-white/10 hover:bg-white/5 transition-all aspect-square w-full shadow-lg ${currentTheme.card}`}><Plus className={currentTheme.text} size={22} strokeWidth={2} /></motion.button>
                  </div>
                </SortableContext>
              </section>
            ))}
          </main>
          <DragOverlay dropAnimation={null}>
            {activeId && activeLinkData ? ( <div className={`p-2.5 rounded-[1.2rem] border shadow-2xl scale-110 w-[78px] aspect-square flex flex-col items-center justify-center pointer-events-none ${currentTheme.card}`}><div className="w-9 h-9 mb-1.5 rounded-[0.8rem] bg-black/10 flex items-center justify-center text-current font-bold">{activeLinkData.name[0]}</div><span className={`text-[10px] font-bold truncate w-full px-1 text-center ${currentTheme.text}`}>{activeLinkData.name}</span></div> ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AnimatePresence>
        {isLinkModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsLinkModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
             <motion.div initial={{opacity:0, scale: 0.9}} animate={{opacity:1, scale: 1}} exit={{opacity:0, scale: 0.9}} className={`relative ${currentTheme.panel} border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl`}><div className="px-8 py-8 border-b border-white/5 flex items-center gap-3"><div className="p-2 bg-white/5 rounded-lg"><Plus size={16} className="opacity-30"/></div><div><h3 className="font-bold text-lg leading-none">添加导航节点</h3><p className="text-[9px] opacity-20 uppercase tracking-widest mt-1">New Shortcut node</p></div></div><div className="p-8 space-y-6"><div className="space-y-4"><div className="space-y-1.5"><label className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em] pl-1">名称 / LABEL</label><input autoFocus value={linkModalData.name} onChange={e=>setLinkModalData(p=>({...p, name: e.target.value}))} onKeyDown={e=>e.key==='Enter'&&saveNewLink()} placeholder="网站名称" className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-white/20 transition-all" /></div><div className="space-y-1.5"><label className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em] pl-1">链接 / URL</label><input value={linkModalData.url} onChange={e=>setLinkModalData(p=>({...p, url: e.target.value}))} onKeyDown={e=>e.key==='Enter'&&saveNewLink()} placeholder="https://" className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-white/20 transition-all" /></div></div><div className="grid grid-cols-2 gap-3 pt-2"><button onClick={()=>setIsLinkModalOpen(false)} className="py-4 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold hover:bg-white/10 transition-all">取消退出</button><button onClick={saveNewLink} className="py-4 bg-white text-black rounded-xl text-[11px] font-bold shadow-xl active:scale-95 transition-all">保存节点</button></div></div></motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isCatModalOpen && (
           <div className="fixed inset-0 z-[305] flex items-center justify-center p-4">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsCatModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
              <motion.div initial={{opacity:0, scale: 0.9}} animate={{opacity:1, scale: 1}} exit={{opacity:0, scale: 0.9}} className={`relative ${currentTheme.panel} border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl`}><div className="px-8 py-8 border-b border-white/5 flex items-center gap-3"><div className="p-2 bg-white/5 rounded-lg"><FolderPlus size={16} className="opacity-30"/></div><div><h3 className="font-bold text-lg leading-none">新建分类层</h3><p className="text-[9px] opacity-20 uppercase tracking-widest mt-1">Add Module Cluster</p></div></div><div className="p-8 space-y-6"><div className="space-y-2"><label className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em] pl-1">分类名称 / CLUSTER TITLE</label><input autoFocus value={newCatTitle} onChange={e=>setNewCatTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&saveNewCategory()} placeholder="例如：娱乐天地" className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-white/20 transition-all" /></div><div className="grid grid-cols-2 gap-3 pt-2"><button onClick={()=>setIsCatModalOpen(false)} className="py-4 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold hover:bg-white/10 transition-all">放弃操作</button><button onClick={saveNewCategory} className="py-4 bg-white text-black rounded-xl text-[11px] font-bold shadow-xl active:scale-95 transition-all">立即创建</button></div></div></motion.div>
           </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsSettingsOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{opacity:0, scale: 0.98}} animate={{opacity:1, scale: 1}} exit={{opacity:0, scale: 0.98}} className={`relative ${currentTheme.panel} border border-white/10 rounded-[1.8rem] w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden`}>
               <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10"><Shield size={20} className="opacity-30" /></div><div><h3 className="text-lg font-bold">WEN 控制面板</h3><p className="text-[9px] opacity-20 uppercase tracking-widest mt-0.5">Configuration System</p></div></div>
                  <button onClick={()=>setIsSettingsOpen(false)} className="p-2 text-white/20 hover:text-white transition-all"><X size={22}/></button>
               </div>
               
               <div className="flex-1 overflow-hidden flex">
                  <div className="w-[280px] border-r border-white/5 flex flex-col bg-black/20">
                     <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-12">
                        <section>
                           <div className="flex items-center justify-between mb-4">
                              <label className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 flex items-center gap-2"><Palette size={12}/> 视觉主题 / THEMES</label>
                              <span className="text-[10px] font-bold opacity-30 italic">{THEMES[theme].name}</span>
                           </div>
                           <div className="flex items-center justify-between gap-1.5 px-0.5">
                              {(Object.keys(THEMES) as ThemeKey[]).map(key => (
                                 <button key={key} onClick={() => setTheme(key)} title={THEMES[key].name} className={`group relative flex-1 aspect-square rounded-lg border transition-all flex items-center justify-center overflow-hidden h-9 ${theme === key ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-white/5 hover:border-white/20 hover:scale-105'}`}>
                                    <div className={`absolute inset-0 ${THEMES[key].preview} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                    {theme === key && <Check size={14} className="relative z-10 text-white drop-shadow-md" />}
                                 </button>
                              ))}
                           </div>
                        </section>
                        <section>
                           <div className="flex items-center justify-between mb-6">
                              <label className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 flex items-center gap-2"><Layers size={12}/> 分类管理 / CLUSTERS</label>
                              <button onClick={()=>setIsCatModalOpen(true)} className="p-1.5 hover:bg-white/10 rounded-lg opacity-30 hover:opacity-100 transition-all"><Plus size={14}/></button>
                           </div>
                           <div className="flex flex-col gap-1">
                              {categories.map((c) => ( <button key={c.id} onClick={() => setSelectedCatId(c.id)} className={`group p-3 rounded-xl flex items-center justify-between transition-all ${selectedCatId === c.id ? 'bg-white/10 text-white border border-white/10' : 'text-white/20 hover:text-white hover:bg-white/5'}`}><div className="flex items-center gap-3 overflow-hidden"><Hash size={12} className={selectedCatId === c.id ? 'text-primary' : 'opacity-20'} /><span className="text-[11px] font-bold truncate">{c.title}</span></div>{selectedCatId === c.id && <ChevronRight size={14} className="opacity-40" />}</button> ))}
                           </div>
                        </section>
                        <section>
                           <label className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 mb-6 flex items-center gap-2"><ImageIcon size={12}/> 壁纸背景 / WALLPAPER</label>
                           <div className="space-y-2">
                             <button onClick={()=>fileInputRef.current?.click()} className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-[11px] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">本地资源上传</button>
                             <button onClick={()=>{setBgUrl(DEFAULT_BG); setBgType('video'); }} className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-white/20 hover:text-white/60 transition-all flex items-center justify-center gap-2"><RefreshCw size={12}/> 还原官方默认</button>
                           </div>
                        </section>
                     </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-black/10 overflow-hidden">
                    {selectedCategory ? (
                       <>
                        <div className="px-10 py-8 border-b border-white/5 bg-white/2 flex items-center justify-between"><div className="flex items-center gap-6"><div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-lg font-bold opacity-30 italic">{categories.findIndex(c => c.id === selectedCategory.id) + 1}</div><div><input value={selectedCategory.title} onChange={(e)=>{ const n=[...categories]; const i=n.findIndex(x=>x.id===selectedCategory.id); n[i].title=e.target.value; setCategories(n); }} className="bg-transparent font-bold text-2xl focus:outline-none w-full" /><p className="text-[9px] opacity-20 uppercase tracking-[0.4em] mt-1 font-bold">Category Instance Identifier</p></div></div><button onClick={()=>{if(confirm("确定永久移除此分类模块？")) { const n=categories.filter(x=>x.id!==selectedCategory.id); setCategories(n); if(n.length) setSelectedCatId(n[0].id); else setSelectedCatId(null); }}} className="p-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest group"><Trash2 size={16} className="opacity-40 group-hover:opacity-100" /> 删除分类</button></div>
                        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar space-y-8">
                           <div className="grid grid-cols-1 gap-4"><div className="flex items-center gap-3 px-6 opacity-20 mb-2"><span className="text-[10px] font-bold uppercase tracking-[0.2em] flex-1">节点名称 / LABEL</span><span className="text-[10px] font-bold uppercase tracking-[0.2em] flex-[2]">目标地址 / URL</span><div className="w-8" /></div>
                              {selectedCategory.links.map((l, lIdx) => ( <motion.div initial={{opacity:0, scale: 0.98}} animate={{opacity:1, scale: 1}} key={l.id} className="flex gap-4 bg-white/5 p-5 rounded-[1.6rem] items-center border border-white/5 hover:border-white/10 group/cell transition-all"><div className="p-2.5 bg-white/5 rounded-xl"><Globe size={14} className="opacity-20"/></div><input value={l.name} onChange={(e)=>{const n=[...categories]; const ci=n.findIndex(x=>x.id===selectedCategory.id); n[ci].links[lIdx].name=e.target.value; setCategories(n);}} className="bg-transparent text-sm font-bold w-44 focus:outline-none" /><input value={l.url} onChange={(e)=>{const n=[...categories]; const ci=n.findIndex(x=>x.id===selectedCategory.id); n[ci].links[lIdx].url=e.target.value; setCategories(n);}} className="bg-transparent text-[11px] flex-1 opacity-20 focus:opacity-100 transition-opacity truncate focus:outline-none" /><button onClick={()=>{const n=[...categories]; const ci=n.findIndex(x=>x.id===selectedCategory.id); n[ci].links.splice(lIdx,1); setCategories(n);}} className="text-red-500 opacity-0 group-hover/cell:opacity-100 p-2 hover:bg-red-500/10 rounded-xl transition-all"><X size={16}/></button></motion.div> ))}
                              <button onClick={()=> { setLinkModalData({ catId: selectedCategory.id, name: '', url: 'https://' }); setIsLinkModalOpen(true); }} className="w-full py-6 border-2 border-dashed border-white/5 rounded-[1.6rem] flex items-center justify-center gap-3 text-[11px] font-bold opacity-20 hover:opacity-100 hover:bg-white/5 hover:border-white/10 transition-all mt-4"><Plus size={18}/> APPEND NEW NODE IN "{selectedCategory.title}"</button>
                           </div>
                        </div>
                       </>
                    ) : ( <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 p-20"><Layers size={64} className="mb-6" /><h4 className="text-xl font-bold">请选择或创建一个分类</h4><p className="text-xs mt-2 tracking-widest uppercase">Start managing your workspace modules</p></div> )}
                  </div>
               </div>
               <div className="p-6 border-t border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl">
                  <div className="flex gap-4"><button onClick={exportConfig} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white hover:text-black transition-all"><Share2 size={18}/></button><button onClick={()=>configInputRef.current?.click()} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white hover:text-black transition-all"><Upload size={18}/></button></div>
                  <div className="flex items-center gap-4"><div className="text-[10px] opacity-20 font-bold uppercase tracking-[0.2em] hidden md:block">Engine Build v1.1.13-Stable</div><button onClick={()=>setIsSettingsOpen(false)} className="px-16 py-4 bg-white text-black font-bold text-xs rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 text-nowrap">保存当前全部配置</button></div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*" onChange={(e)=>{ const f = e.target.files?.[0]; if(f){ const t = f.type.startsWith('video')?'video':'image'; setBgType(t); setBgUrl(URL.createObjectURL(f)); const req = indexedDB.open("moyu-storage-db", 2); req.onsuccess=(ev:any)=>ev.target.result.transaction(["assets"],"readwrite").objectStore("assets").put(f,"bg-blob"); } }} />
      <input type="file" ref={configInputRef} className="hidden" accept=".json" onChange={(e)=>{ const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onload=(ev)=>{ try { const p = JSON.parse(ev.target?.result as string); if(p.categories){setCategories(p.categories); setSelectedCatId(p.categories[0]?.id); alert("导入成功"); } }catch(err){alert("文件无效");} }; r.readAsText(f); } }} />

      <AnimatePresence>
        {isDownloadOpen && ( <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center"><div className="max-w-4xl mx-auto w-full p-20 relative text-center"><button onClick={()=>setIsDownloadOpen(false)} className="absolute top-0 right-0 p-8 text-white/20 hover:text-white transition-all"><X size={48}/></button><img src="/logologo.png" className="w-20 h-20 mx-auto mb-12" alt="Logo" /><h1 className="text-6xl font-black text-white mb-6">WENBrowser</h1><a href="https://1k9xf3dmajzvdrha.public.blob.vercel-storage.com/MoyuBrowser_Setup.exe" className="inline-flex items-center gap-6 px-16 py-5 bg-white text-black text-xl font-black rounded-xl shadow-2xl transition-all">极速本地获取</a></div></motion.div> )}
      </AnimatePresence>
    </div>
  );
}
