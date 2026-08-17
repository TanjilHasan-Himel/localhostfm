'use client';

import React from 'react';
import Image from 'next/image';

export default function StationTitle() {
  return (
    <div className="absolute top-16 md:top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-start justify-center w-full px-4">
      <div className="animate-air-wave flex justify-center w-full">
        {/* Desktop Landscape Title (Much Larger) */}
        <div className="hidden md:block relative w-[900px] h-[300px] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <Image 
            src="/title/land_tit.png" 
            alt="T Double H FM" 
            fill 
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-contain"
          />
        </div>

        {/* Mobile Portrait Title */}
        <div className="block md:hidden relative w-[300px] h-[300px] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <Image 
            src="/title/ver_tit.png" 
            alt="T Double H FM" 
            fill 
            priority
            sizes="(max-width: 768px) 300px, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
