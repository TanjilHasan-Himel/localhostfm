import React from 'react';
import GlobalPlayer from '@/components/GlobalPlayer';
import NowPlaying from '@/components/NowPlaying';
import ScheduleCards from '@/components/ScheduleCards';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative min-h-screen pointer-events-none overflow-hidden">
      
      {/* Floating Schedule Cards (Top Right) */}
      <ScheduleCards />

      {/* Floating Social Links (Bottom Right above player) */}
      <div className="fixed bottom-36 md:bottom-28 right-4 md:right-12 z-40 pointer-events-auto">
        <a 
          href="https://www.facebook.com/tdoublehfm/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 glass px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-blue-500/30 hover:bg-blue-500/10 transition-all hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-blue-500">
            <path fillRule="evenodd" d="M13.111 20.354v-8.232h2.766l.413-3.216h-3.179v-2.05c0-.931.258-1.564 1.593-1.564h1.701V2.413A22.753 22.753 0 0014.167 2c-2.484 0-4.184 1.516-4.184 4.3v2.24H7.217v3.216h2.766v8.232h3.128z" clipRule="evenodd" />
          </svg>
          <span className="text-white text-xs md:text-sm font-bold tracking-wider">Facebook</span>
        </a>
      </div>

      {/* We use a fixed wrapper at the bottom to unify the shapes */}
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center justify-end z-50 pointer-events-none">
        <NowPlaying />
        <GlobalPlayer />
      </div>
    </main>
  );
}

