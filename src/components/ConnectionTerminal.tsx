'use client';

import React, { useEffect, useState } from 'react';

const LOADING_STEPS = [
  '📡 Requesting Server Stream...',
  '🔒 Establishing Secure Protocol...',
  '📥 Fetching Audio Data...',
  '🌀 Allocating Audio Buffer...',
  '⚡ Syncing Live Broadcast...'
];

export default function ConnectionTerminal({ isActive }: { isActive: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        // If it's taking a long time, loop the last two steps to simulate ongoing connection
        return prev === LOADING_STEPS.length - 1 ? prev - 1 : prev + 1;
      });
    }, 600); // 600ms per step

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center justify-center mt-2 animate-fade-in">
      <div className="font-mono text-[10px] md:text-xs text-green-400 bg-black/60 px-3 py-1.5 rounded-md border border-green-500/30 flex items-center gap-2 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
        {LOADING_STEPS[stepIndex]}
      </div>
    </div>
  );
}
