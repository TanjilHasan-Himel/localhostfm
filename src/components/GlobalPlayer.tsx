'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';

export default function GlobalPlayer() {
  const { isPlaying, togglePlay, volume, setVolume, currentTrack } = useAudio();

  return (
    <div className="w-full glass shadow-lg pointer-events-auto relative z-10 pb-4 pt-4 px-4">
      {/* Custom split top border to seamlessly merge with the NowPlaying module */}
      <div className="absolute top-0 left-0 w-full h-[1px] flex justify-center pointer-events-none">
        <div className="flex-1 bg-white/10"></div>
        <div className="w-full max-w-lg bg-transparent"></div>
        <div className="flex-1 bg-white/10"></div>
      </div>
      
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Track Info */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 overflow-hidden">
          <div className={`relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.6)] ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : 'transition-transform duration-500'}`}>
            {/* The Real Vinyl Image */}
            <img src="/musicplayer/vinly.png" alt="Vinyl" className="absolute inset-0 w-full h-full object-cover rounded-full" />
            
            {/* The Album Cover in the center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full overflow-hidden opacity-90">
              <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover" />
            </div>
            
            {/* Inner Vinyl Hole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full border border-white/10"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-medium text-sm md:text-base truncate">{currentTrack.title}</span>
            <span className="text-white/60 text-xs md:text-sm truncate">{currentTrack.artist}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center px-2 md:px-0">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors flex-shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 ml-1">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Volume */}
        <div className="flex-1 flex justify-end items-center gap-1.5 md:gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-white/80">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
          </svg>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 md:w-24 accent-white bg-white/20 h-1 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      {/* Disclaimer Warning - Hidden on Mobile */}
      <div className="hidden md:block max-w-6xl mx-auto mt-3 text-center pointer-events-none">
        <p className="text-[9px] md:text-[10px] text-white/50 tracking-wide">
          ⚠️ Third-party gambling content may appear. T Double H FM does not endorse or operate such services ⚠️
        </p>
      </div>
    </div>
  );
}
