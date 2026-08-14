'use client';

import React, { useEffect, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import ConnectionTerminal from '@/components/ConnectionTerminal';

export default function NowPlaying() {
  const { currentTrack, isPlaying, audioMode, loading } = useAudio();
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
          </>
        )}
      </div>
    </div>
  );
}
