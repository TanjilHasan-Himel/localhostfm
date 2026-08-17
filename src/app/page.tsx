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
        <div className="mb-2 mt-1 pointer-events-auto">
          <a href="/disclaimer" className="text-[10px] text-gray-400 hover:text-gray-200 transition-colors bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
            Disclaimer & Copyright
          </a>
        </div>
      </div>
    </main>
  );
}

