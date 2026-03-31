"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Upload, Volume2, SkipBack, SkipForward, X, List } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  url: string;
}

interface MusicPlayerProps {
  theme: string;
}

export default function MusicPlayer({ theme }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaElementSource(audioRef.current);
      
      source.connect(analyser);
      analyser.connect(ctx.destination);
      
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      audioContextRef.current = ctx;
    }
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      initAudio();
      audioRef.current.play().catch(e => console.error("Playback failed", e));
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const drawVisualizer = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Use fewer bins for much thicker, bolder bars
      const audibleLength = 40;
      const spacing = 6;
      // Calculate width to fill the center area nicely
      const totalBarWidth = (canvas.width * 0.8) / (audibleLength * 2);
      const barWidth = totalBarWidth - spacing;
      let barHeight: number;
      
      let accentColor = '#ffffff';
      if (theme === 'sakura') accentColor = '#ffb7c5';
      else if (theme === 'ocean') accentColor = '#06b6d4';
      else if (theme === 'office') accentColor = '#2b579a';

      for (let i = 0; i < audibleLength; i++) {
        // Average a few bins for a smoother, more stable look
        const binIndex = Math.floor(i * (bufferLength * 0.4 / audibleLength));
        const value = dataArray[binIndex];
        
        // Dynamic scaling: make sure it's punchy but never hits the absolute top
        barHeight = (value / 255) * canvas.height * 0.85;
        
        const xForward = (canvas.width / 2) + (i * totalBarWidth);
        const xBackward = (canvas.width / 2) - (i * totalBarWidth) - barWidth;

        // Solid color block for maximum visibility
        ctx.fillStyle = accentColor;
        ctx.shadowBlur = barHeight > 10 ? 25 : 0;
        ctx.shadowColor = accentColor;
        
        const radius = 8;
        const drawBar = (xPos: number) => {
          if (barHeight > 4) {
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(xPos, canvas.height - barHeight, barWidth, barHeight, [radius, radius, 0, 0]);
            } else {
              ctx.fillRect(xPos, canvas.height - barHeight, barWidth, barHeight);
            }
            ctx.fill();

            // Bright white highlight at the top for extra "pop"
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(xPos, canvas.height - barHeight, barWidth, Math.min(barHeight, 6));
            ctx.fillStyle = accentColor; // Reset for next loop
          }
        };

        drawBar(xForward);
        drawBar(xBackward);
      }
    };
    
    render();
  }, [theme]);

  useEffect(() => {
    if (isPlaying) {
      drawVisualizer();
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, drawVisualizer]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newTracks: Track[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: URL.createObjectURL(file)
      }));
      setTracks(prev => [...prev, ...newTracks]);
      if (tracks.length === 0) {
        setCurrentTrackIndex(0);
      }
    }
  };

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="fixed bottom-10 left-10 z-[400] flex flex-col items-start gap-4">
      <div className="pointer-events-none fixed bottom-0 left-0 w-full px-10 pb-4 flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={1800} 
          height={400} 
          className="opacity-100 transition-all w-full max-w-full drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          style={{ 
            filter: isPlaying ? 'none' : 'grayscale(1) opacity(0.05)',
          }}
        />
      </div>

      <motion.div 
        layout
        className={`backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500 ${isExpanded ? 'w-[320px] p-6' : 'w-auto p-3'} ${theme === 'office' ? 'bg-slate-900/15' : 'bg-black/40'}`}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-lg ${theme === 'sakura' ? 'bg-pink-500/80' : theme === 'ocean' ? 'bg-cyan-500/80' : theme === 'office' ? 'bg-slate-800' : 'bg-white/10'}`}
          >
            {isPlaying ? <Pause className="text-white fill-white" size={20} /> : <Play className="text-white fill-white ml-1" size={20} />}
          </motion.div>

          {!isExpanded ? (
            <button 
              onClick={() => setIsExpanded(true)}
              className="w-10 h-10 flex items-center justify-center text-white/30 hover:text-white transition-all"
            >
              <Music size={18} />
            </button>
          ) : (
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start mb-1">
                 <h4 className="text-[0.625rem] font-bold text-white/40 uppercase tracking-widest truncate">Now Playing</h4>
                 <button onClick={() => setIsExpanded(false)} className="text-white/20 hover:text-white"><X size={14}/></button>
               </div>
               <p className="text-[0.875rem] font-bold text-white truncate w-full">
                 {currentTrack ? currentTrack.name : "No Audio Selected"}
               </p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="text-white/30" size={14} />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v;
                  }}
                  className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
              </div>

              <div className="flex items-center justify-center gap-6 pt-2">
                 <button 
                    onClick={() => setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length)}
                    className="p-3 text-white/40 hover:text-white transition-all"
                 >
                    <SkipBack size={18} />
                 </button>
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 rounded-full transition-all shadow-xl ${theme === 'sakura' ? 'bg-pink-500 hover:bg-pink-400' : theme === 'ocean' ? 'bg-cyan-500 hover:bg-cyan-400' : theme === 'office' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white/20 hover:bg-white/30'}`}
                 >
                    <Upload size={18} className="text-white" />
                 </button>
                 <button 
                    onClick={() => setCurrentTrackIndex(prev => (prev + 1) % tracks.length)}
                    className="p-3 text-white/40 hover:text-white transition-all"
                 >
                    <SkipForward size={18} />
                 </button>
              </div>

              {tracks.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-3 text-white/30 truncate">
                    <List size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Playlist ({tracks.length})</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                    {tracks.map((track, idx) => (
                      <button 
                        key={track.id}
                        onClick={() => setCurrentTrackIndex(idx)}
                        className={`w-full text-left p-2 rounded-lg text-[10px] font-bold truncate transition-all ${currentTrackIndex === idx ? 'bg-white/10 text-white' : 'text-white/30 hover:bg-white/5 hover:text-white/60'}`}
                      >
                        {idx + 1}. {track.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        multiple 
        accept="audio/*" 
        className="hidden" 
      />
      <audio 
        ref={audioRef} 
        src={currentTrack?.url} 
        onEnded={() => setCurrentTrackIndex(prev => (prev + 1) % tracks.length)}
      />
    </div>
  );
}
