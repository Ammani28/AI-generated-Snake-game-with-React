import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "SIGNAL_01",
    artist: "VOID_WALKER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "SIGNAL_02",
    artist: "CORE_DUMP",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "SIGNAL_03",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black p-6 border-2 border-magenta shadow-[4px_4px_0_#00ffff] flex flex-col gap-6 relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-black border-2 border-cyan flex items-center justify-center relative">
          <Activity className="w-8 h-8 text-magenta animate-pulse" />
          <div className="absolute inset-0 bg-cyan/10 animate-pulse" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 
            className="text-2xl font-black truncate glitch-cyan"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </h3>
          <p className="text-[10px] font-bold text-magenta/60 truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Zap className="w-4 h-4 text-cyan" />
          <div className="text-[8px] font-bold text-cyan/40">SIGNAL_STRENGTH: 99%</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full bg-white/5 border border-cyan/20 relative cursor-crosshair">
          <motion.div 
            className="h-full bg-cyan shadow-[2px_0_0_#ff00ff]"
            style={{ width: `${progress}%` }}
          />
          {/* Progress Markers */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-white/10" />
            ))}
          </div>
        </div>
        <div className="flex justify-between text-[8px] font-bold text-cyan/40 tracking-widest">
          <span>00:00:00</span>
          <span>00:03:45</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-10">
        <button 
          onClick={handlePrev}
          className="p-2 border-2 border-cyan text-cyan hover:bg-cyan hover:text-black transition-all"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-6 bg-magenta text-black border-b-4 border-r-4 border-white active:border-0 hover:bg-cyan transition-all"
        >
          {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 border-2 border-cyan text-cyan hover:bg-cyan hover:text-black transition-all"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="pt-4 border-t-2 border-cyan/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-magenta">SIGNAL_QUEUE</span>
          <span className="text-[8px] font-bold text-cyan/20">3_NODES_DETECTED</span>
        </div>
        <div className="space-y-2">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`flex items-center gap-4 p-3 border-2 cursor-crosshair transition-all ${
                currentTrackIndex === idx ? 'border-cyan bg-cyan/10' : 'border-transparent hover:border-magenta/40'
              }`}
            >
              <div className={`text-xs font-black ${
                currentTrackIndex === idx ? 'text-magenta' : 'text-white/20'
              }`}>
                0{idx + 1}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className={`text-[10px] font-black truncate ${currentTrackIndex === idx ? 'text-cyan' : 'text-white/40'}`}>
                  {track.title}
                </div>
              </div>
              {currentTrackIndex === idx && isPlaying && (
                <div className="flex gap-1 items-end h-4">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 16, 8] }} 
                      transition={{ repeat: Infinity, duration: 0.3 + i * 0.1 }} 
                      className="w-1 bg-magenta" 
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Background Static Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
}
