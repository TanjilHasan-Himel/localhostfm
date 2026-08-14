'use client';

import React, { useEffect, useState } from 'react';
import { useAudio } from '@/context/AudioContext';

export default function NowPlaying() {
  const { setCurrentTrack, isPlaying } = useAudio();
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    // Poll the secure API route for track updates every 30 seconds
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/now-playing');
        if (res.ok) {
          const trackData = await res.json();
          setCurrentTrack(trackData);
        }
      } catch (error) {
        console.error("Failed to fetch now playing data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    
    return () => clearInterval(interval);
  }, [setCurrentTrack]);

  return (
    <div className={`glass border-t border-l border-r border-white/10 rounded-t-3xl px-8 pt-5 pb-3 max-w-lg w-full mx-auto text-center relative overflow-hidden transition-all duration-500 pointer-events-auto shadow-2xl mb-[-1px] ${isPlaying ? 'animate-rhythm' : ''}`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 animate-pulse pointer-events-none"></div>

      <div className="relative z-10">
        {/* Top row: NOW PLAYING label + time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isPlaying && (
              <div className="flex items-end gap-[3px] h-3.5">
                <div className="w-[3px] bg-white/80 rounded-full animate-[bounce_1s_infinite] h-full"></div>
                <div className="w-[3px] bg-white/80 rounded-full animate-[bounce_1.2s_infinite] h-3/4"></div>
                <div className="w-[3px] bg-white/80 rounded-full animate-[bounce_0.8s_infinite] h-1/2"></div>
              </div>
            )}
            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Now Playing</span>
          </div>
          {currentTime && (
            <span className="text-xs text-white/60 font-medium tabular-nums">{currentTime}</span>
          )}
        </div>

        {/* Track info */}
        {loading ? (
          <div className="h-8 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <p className="text-base md:text-lg font-semibold text-white leading-tight">Midnight Coding Sessions</p>
            <p className="text-sm text-white/50 mt-0.5">Localhost FM Chill</p>
          </>
        )}
      </div>
    </div>
  );
}
