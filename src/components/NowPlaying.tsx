'use client';

import React, { useEffect, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import ConnectionTerminal from '@/components/ConnectionTerminal';

export default function NowPlaying() {
  const { currentTrack, isPlaying, audioMode, loading, nextTrack } = useAudio();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const isLive = currentTrack.title === 'ON AIR' || audioMode === 'live';

  return (
    <div className={`glass border-t border-l border-r border-white/10 rounded-t-3xl px-8 pt-5 pb-3 max-w-lg w-full mx-auto text-center relative overflow-hidden transition-all duration-500 pointer-events-auto shadow-2xl mb-[-1px] ${isPlaying && !isLive ? 'animate-rhythm' : ''}`}>
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${isLive ? 'from-red-500/20 to-orange-500/10' : 'from-purple-500/10 to-blue-500/10'} animate-pulse pointer-events-none`}></div>

      {isLive && isPlaying && (
        <div className="absolute inset-0 bg-red-500/5 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none rounded-t-3xl border-t border-red-500/30"></div>
      )}

      <div className="relative z-10">
        {/* Top row: NOW PLAYING / ON AIR label + time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isPlaying && !isLive && !loading && (
              <div className="flex items-end gap-[3px] h-3.5">
                <div className="w-[3px] bg-white/80 rounded-full animate-[bounce_1s_infinite] h-full"></div>
                <div className="w-[3px] bg-white/80 rounded-full animate-[bounce_1.2s_infinite] h-3/4"></div>
                <div className="w-[3px] bg-white/80 rounded-full animate-[bounce_0.8s_infinite] h-1/2"></div>
              </div>
            )}
            {isLive ? (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-red-500/20 rounded-md border border-red-500/30">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full absolute"></div>
                <span className="text-xs text-red-400 uppercase tracking-widest font-bold">Live Broadcast</span>
              </div>
            ) : (
              <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Now Playing</span>
            )}
          </div>
          {currentTime && (
            <span className={`text-xs font-medium tabular-nums ${isLive ? 'text-red-400/80' : 'text-white/60'}`}>{currentTime}</span>
          )}
        </div>

        {/* Track info */}
        {loading ? (
          <ConnectionTerminal isActive={loading} />
        ) : currentTrack.title === 'Loading...' ? (
          <div className="h-8 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <p className={`text-base md:text-lg font-bold leading-tight ${isLive ? 'text-red-100 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-white'}`}>
              {currentTrack.title}
            </p>
            <p className={`text-sm mt-0.5 font-medium tracking-wide ${isLive ? 'text-red-300/80' : 'text-white/50'}`}>
              {currentTrack.artist}
            </p>
            
            {/* Up Next Badge */}
            {nextTrack && (
              <div className="mt-3 flex justify-center animate-in fade-in slide-in-from-bottom-1 duration-700">
                <div className="bg-black/20 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white/40">
                    <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L11.69 12 8.97 9.28a.75.75 0 011.06-1.06l3.25 3.25zM17.28 11.47a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 11-1.06-1.06L15.69 12l-2.72-2.72a.75.75 0 011.06-1.06l3.25 3.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">
                    Up Next: <span className="text-white/70">{nextTrack.title}</span>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
