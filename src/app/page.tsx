import React from 'react';
import GlobalPlayer from '@/components/GlobalPlayer';
import NowPlaying from '@/components/NowPlaying';
import ScheduleCards from '@/components/ScheduleCards';
import StationTitle from '@/components/StationTitle';
import MobileUtilities from '@/components/MobileUtilities';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative min-h-screen pointer-events-none overflow-hidden">
      
      {/* Central Animated Station Title */}
      <StationTitle />

      {/* We use a fixed wrapper at the bottom to unify the shapes */}
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center justify-end z-50 pointer-events-none">
        {/* Floating Schedule Cards (Symmetrical, sits right above NowPlaying) */}
        <ScheduleCards />
        <NowPlaying />
        <GlobalPlayer />
      </div>

      {/* Modern Floating Footer (Disclaimer) - Hidden on Mobile */}
      <div className="hidden md:block fixed top-4 left-4 z-50 pointer-events-auto">
        <a href="/disclaimer" className="glass px-3 py-1.5 rounded-full text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 border border-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          Disclaimer
        </a>
      </div>

      {/* Mobile Top-Center Utilities */}
      <MobileUtilities />
    </main>
  );
}
