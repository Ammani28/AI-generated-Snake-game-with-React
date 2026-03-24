import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-magenta selection:text-black overflow-hidden relative static-noise">
      {/* Glitch Overlays */}
      <div className="absolute inset-0 pointer-events-none z-40 screen-tear opacity-20" />
      
      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center border-b-2 border-cyan bg-black/80">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-cyan flex items-center justify-center border-2 border-magenta">
            <span className="text-black font-black text-2xl">X</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter glitch-cyan">SYSTEM_OVERRIDE</h1>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-magenta">PROTOCOL_v2.4.0</p>
          </div>
        </motion.div>

        <div className="hidden md:flex gap-12 text-[10px] font-bold tracking-widest uppercase">
          <span className="text-cyan cursor-crosshair hover:text-magenta transition-colors">[ CORE_ARCADE ]</span>
          <span className="text-cyan cursor-crosshair hover:text-magenta transition-colors">[ SIGNAL_STREAM ]</span>
          <span className="text-cyan cursor-crosshair hover:text-magenta transition-colors">[ CONFIG_NODE ]</span>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-6"
        >
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-magenta">AUTH_STATUS</p>
            <p className="text-xs font-mono text-cyan">UNAUTHORIZED_ACCESS</p>
          </div>
          <div className="w-12 h-12 border-2 border-cyan bg-black flex items-center justify-center">
            <div className="w-8 h-8 bg-magenta/20 border border-magenta animate-pulse" />
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left Section: Cryptic Data */}
        <div className="hidden xl:flex flex-col gap-6 w-72">
          <div className="p-4 border-2 border-magenta bg-black/50">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan mb-4">TERMINAL_LOG</h4>
            <div className="space-y-2 font-mono text-[10px]">
              <p className="text-magenta">&gt; INITIALIZING_SNAKE_CORE...</p>
              <p className="text-cyan">&gt; AUDIO_BUFFER_LOADED</p>
              <p className="text-white/40">&gt; ENCRYPTING_USER_DATA...</p>
              <p className="text-magenta">&gt; ERROR: UNKNOWN_SIGNAL_DETECTED</p>
            </div>
          </div>
          
          <div className="p-4 border-2 border-cyan bg-black/50">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-magenta mb-4">HARDWARE_STATS</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px]">
                <span className="text-cyan">CPU_LOAD</span>
                <span className="text-magenta">88%</span>
              </div>
              <div className="h-1 w-full bg-white/10">
                <div className="h-full w-[88%] bg-cyan" />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-cyan">MEM_USAGE</span>
                <span className="text-magenta">4.2GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Snake Game */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex justify-center"
        >
          <div className="p-2 border-4 border-cyan bg-magenta/5">
            <SnakeGame />
          </div>
        </motion.div>

        {/* Right Section: Music Player */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-auto flex justify-center"
        >
          <div className="p-2 border-4 border-magenta bg-cyan/5">
            <MusicPlayer />
          </div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end pointer-events-none">
        <div className="text-[120px] font-black tracking-tighter leading-none opacity-10 text-cyan select-none">
          VOID
        </div>
        <div className="text-right font-mono text-[10px] text-magenta">
          [ MACHINE_ID: 0x7F4A ]<br />
          [ UPTIME: 00:00:00 ]<br />
          [ STATUS: COMPROMISED ]
        </div>
      </footer>
    </div>
  );
}
