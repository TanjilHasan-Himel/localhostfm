import React from 'react';
import GlobalPlayer from '@/components/GlobalPlayer';
import NowPlaying from '@/components/NowPlaying';
import ScheduleCards from '@/components/ScheduleCards';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative min-h-screen pointer-events-none overflow-hidden">
      
      {/* Floating Schedule Cards (Top Right) */}
      <ScheduleCards />

      {/* We use a fixed wrapper at the bottom to unify the shapes */}
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center justify-end z-50 pointer-events-none">
        <NowPlaying />
        <GlobalPlayer />
      </div>

      {/* Modern Floating Footer */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
        <a href="/disclaimer" className="group flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] text-xs font-medium text-white/70 hover:text-white hover:bg-black/60 hover:border-white/20 transition-all duration-300">
          <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Disclaimer & Copyright</span>
        </a>
      </div>
    </main>
  );
}

